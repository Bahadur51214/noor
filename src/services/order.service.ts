import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { randomInt } from 'crypto'
import { emailService } from './email.service'
import { discountService } from './discount.service'

async function generateUniqueOrderNumber(tx: Prisma.TransactionClient) {
  const prefix = 'NOOR'
  for (let i = 0; i < 5; i++) {
    const random = randomInt(100000, 1000000)
    const orderNumber = `${prefix}-${random}`
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true }
    })
    if (!existing) return orderNumber
  }
  throw new Error('Unable to generate a unique order number')
}

export const orderService = {
  async create(data: any) {
    const result = await db.$transaction(async (tx) => {
      const productIds = data.items.map((i: any) => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds } }
      })
      const productMap = new Map(products.map(p => [p.id, p]))

      let subtotal = new Prisma.Decimal(0)
      const orderItemsData: any[] = []

      for (const item of data.items) {
        const product = productMap.get(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)

        const price = product.salePrice ?? product.price
        const itemTotal = new Prisma.Decimal(price.toString()).mul(item.quantity)
        subtotal = subtotal.add(itemTotal)

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productImage: null,
          quantity: item.quantity,
          price: price,
          total: itemTotal,
        })

        const updated = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        })
        if (updated.count === 0) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }
      }

      let discountAmount = new Prisma.Decimal(0)
      let appliedDiscountId: string | null = null
      let appliedDiscountCode: string | null = null
      if (data.discountCode) {
        const result = await discountService.validate(data.discountCode, Number(subtotal))
        if (result.valid) {
          const claimed = await tx.discount.updateMany({
            where: {
              id: result.discount.id,
              active: true,
              usedCount: { lt: result.discount.usageLimit ?? Number.MAX_SAFE_INTEGER },
            },
            data: { usedCount: { increment: 1 } }
          })
          if (claimed.count > 0) {
            discountAmount = new Prisma.Decimal(result.discountAmount)
            appliedDiscountId = result.discount.id
            appliedDiscountCode = result.discount.code
          }
        }
      }

      const deliveryFeeKey = data.paymentMethod === 'COD' ? 'codDeliveryFee' : 'advanceDeliveryFee'
      const deliveryFeeSetting = await tx.storeSetting.findFirst({
        where: { OR: [{ key: deliveryFeeKey }, { key: deliveryFeeKey === 'codDeliveryFee' ? 'cod_delivery_fee' : 'advance_delivery_fee' }] }
      })
      const deliveryFee = new Prisma.Decimal(deliveryFeeSetting?.value || '0')
      
      const discountTotal = subtotal.sub(discountAmount).isNegative()
        ? new Prisma.Decimal(0)
        : subtotal.sub(discountAmount)
      const total = discountTotal.add(deliveryFee)
      const orderNumber = await generateUniqueOrderNumber(tx)

      const customer = await tx.customer.upsert({
        where: { phone: data.customer.phone },
        update: { 
          name: data.customer.name,
          email: data.customer.email || undefined,
          city: data.customer.city,
          area: data.customer.area,
          address: data.customer.address,
          orderCount: { increment: 1 },
          totalSpent: { increment: Number(total) },
        },
        create: { 
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email || null,
          city: data.customer.city,
          area: data.customer.area,
          address: data.customer.address,
          orderCount: 1,
          totalSpent: Number(total),
        }
      })

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName: data.customer.name,
          customerPhone: data.customer.phone,
          customerEmail: data.customer.email || null,
          city: data.customer.city,
          area: data.customer.area,
          address: data.customer.address,
          landmark: data.customer.landmark || null,
          subtotal,
          discountAmount,
          deliveryFee,
          total,
          status: 'PENDING',
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING_VERIFICATION',
          paymentMethod: data.paymentMethod,
          discountId: appliedDiscountId,
          discountCode: appliedDiscountCode,
          orderItems: {
            create: orderItemsData
          },
          ...(appliedDiscountId
            ? {
                discountUsages: {
                  create: {
                    discountId: appliedDiscountId,
                    amount: discountAmount,
                  }
                }
              }
            : {}),
          orderStatusHistories: {
            create: {
              status: 'PENDING',
              note: 'Order created'
            }
          },
          ...(data.paymentMethod !== 'COD'
            ? {
                payments: {
                  create: {
                    method: data.paymentMethod,
                    transactionId: data.paymentReference?.transactionId ?? null,
                    senderName: data.paymentReference?.senderName ?? null,
                    screenshotUrl: data.paymentReference?.screenshotUrl || null,
                    status: 'PENDING_VERIFICATION'
                  }
                }
              }
            : {}),
        },
        include: { orderItems: true, payments: true }
      })

      return { order, orderNumber }
    })

    // Fire-and-forget email confirmation (after transaction commits)
    emailService.sendOrderConfirmation(result.order).catch(() => {})

    return result
  },

  async getById(id: string) {
    return db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: { include: { product: true } },
        payments: true,
        orderStatusHistories: { orderBy: { createdAt: 'desc' } },
        adminNotes: { orderBy: { createdAt: 'desc' } }
      }
    })
  },

  async getByOrderNumber(orderNumber: string) {
    return db.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: true,
        orderStatusHistories: true
      }
    })
  },

  async trackOrder(orderNumber: string, phone: string) {
    const order = await db.order.findFirst({
      where: { orderNumber, customerPhone: phone },
      select: {
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        orderStatusHistories: { orderBy: { createdAt: 'desc' } }
      }
    })
    return order
  },

  async getAll(params: any = {}) {
    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.OrderWhereInput = {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.paymentStatus ? { paymentStatus: params.paymentStatus as any } : {}),
      ...(params.search
        ? {
            OR: [
              { orderNumber: { contains: params.search, mode: 'insensitive' } },
              { customerName: { contains: params.search, mode: 'insensitive' } },
              { customerPhone: { contains: params.search } },
            ],
          }
        : {}),
      ...(params.city ? { city: { contains: params.city, mode: 'insensitive' } } : {}),
      ...(params.courier ? { courier: { contains: params.courier, mode: 'insensitive' } } : {}),
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {}
      if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom)
      if (params.dateTo) {
        const toDate = new Date(params.dateTo)
        toDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = toDate
      }
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: params.sort === 'oldest' ? 'asc' : 'desc' },
        skip,
        take: limit,
        include: { customer: true }
      }),
      db.order.count({ where })
    ])

    return { orders, total, pages: Math.ceil(total / limit) }
  },

  async updateStatus(orderId: string, status: string, adminId: string, note?: string) {
    await db.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true }
      })

      if (status === 'CANCELLED' && current?.status !== 'CANCELLED') {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true }
        })
        if (order) {
          for (const item of order.orderItems) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } }
            })
          }
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: status as any }
      })
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: status as any,
          note: note || `Status updated to ${status}`,
          adminId,
        }
      })
    })

    if (status === 'SHIPPED') {
      const order = await db.order.findUnique({ where: { id: orderId } })
      if (order?.customerEmail) {
        emailService.sendShippingNotification(order).catch(() => {})
      }
    }
  },

  async updateCourier(orderId: string, courier: string, trackingNumber: string, trackingUrl?: string) {
    await db.order.update({
      where: { id: orderId },
      data: { courier, trackingNumber, trackingUrl }
    })
  },

  async cancel(orderId: string, adminId: string, reason?: string) {
    await db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { orderItems: true } })
      if (!order) return
      if (order.status === 'CANCELLED') return
      
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      })

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: 'CANCELLED',
          note: reason || 'Order cancelled by admin',
          adminId,
        }
      })
    })
  },

  async getPendingCount() {
    const [pending, paymentVerification, processing, shipped] = await Promise.all([
      db.order.count({ where: { status: 'PENDING' } }),
      db.order.count({ where: { paymentStatus: 'PENDING_VERIFICATION' } }),
      db.order.count({ where: { status: 'PROCESSING' } }),
      db.order.count({ where: { status: 'SHIPPED' } })
    ])
    return { pending, paymentVerification, processing, shipped }
  },

  async addNote(orderId: string, adminId: string, content: string) {
    await db.adminNote.create({
      data: {
        orderId,
        adminId,
        content,
      }
    })
  }
}
