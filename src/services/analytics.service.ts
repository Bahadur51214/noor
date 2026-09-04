import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export const analyticsService = {
  async getDashboardStats(dateRange?: { from: Date; to: Date }) {
    const where = dateRange ? { createdAt: { gte: dateRange.from, lte: dateRange.to } } : {}
    
    const [totalOrders, todayOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, lowStockCount, pendingVerification] = await Promise.all([
      db.order.count({ where }),
      db.order.count({ where: { ...where, createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
      db.order.count({ where: { ...where, status: 'PENDING' } }),
      db.order.count({ where: { ...where, status: 'PROCESSING' } }),
      db.order.count({ where: { ...where, status: 'SHIPPED' } }),
      db.order.count({ where: { ...where, status: 'DELIVERED' } }),
      db.order.count({ where: { ...where, status: 'CANCELLED' } }),
      db.product.count({ where: { stock: { lte: 5 } } }),
      db.payment.count({ where: { status: 'PENDING' } })
    ])

    const revenueResult = await db.order.aggregate({
      where: { ...where, status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] } },
      _sum: { total: true }
    })

    const codResult = await db.order.aggregate({
      where: { ...where, paymentMethod: 'COD', status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] } },
      _sum: { total: true }
    })

    const advanceResult = await db.order.aggregate({
      where: { ...where, paymentMethod: { not: 'COD' }, status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] } },
      _sum: { total: true }
    })

    return {
      todayOrders,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: Number(revenueResult._sum.total || 0),
      codRevenue: Number(codResult._sum.total || 0),
      advanceRevenue: Number(advanceResult._sum.total || 0),
      lowStockCount,
      pendingVerification
    }
  },

  async getSalesOverTime(days: number) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    
    const orders = await db.order.findMany({
      where: { createdAt: { gte: date }, status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] } },
      select: { createdAt: true, total: true }
    })

    const map = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(o => {
      const d = o.createdAt.toISOString().split('T')[0]
      const current = map.get(d) || { revenue: 0, orders: 0 }
      map.set(d, { revenue: current.revenue + Number(o.total), orders: current.orders + 1 })
    })

    return Array.from(map.entries()).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date))
  },

  async getPaymentMethodDistribution() {
    const data = await db.order.groupBy({
      by: ['paymentMethod'],
      _count: { id: true },
      _sum: { total: true }
    })
    return data.map(d => ({
      method: d.paymentMethod,
      count: d._count.id,
      revenue: Number(d._sum.total || 0)
    }))
  },

  async getBestSellers(limit: number = 5) {
    const grouped = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit
    })

    const productIds = grouped.map(g => g.productId)
    const products = productIds.length
      ? await db.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, slug: true, images: { take: 1, select: { url: true } } }
        })
      : []

    const productMap = new Map(products.map(p => [p.id, p]))

    return grouped.map(g => {
      const product = productMap.get(g.productId)
      return {
        productId: g.productId,
        name: product?.name || 'Unknown',
        slug: product?.slug || '',
        image: product?.images?.[0]?.url || '',
        quantitySold: g._sum.quantity || 0,
        orderCount: g._count.id
      }
    })
  },

  async getRevenue(period: 'today' | '7days' | '30days' | 'month' | 'all') {
    const date = new Date()
    if (period === 'today') date.setHours(0,0,0,0)
    else if (period === '7days') date.setDate(date.getDate() - 7)
    else if (period === '30days') date.setDate(date.getDate() - 30)
    else if (period === 'month') date.setDate(1)
    
    const where = period === 'all' ? {} : { createdAt: { gte: date } }
    const result = await db.order.aggregate({
      where: { ...where, status: { in: ['DELIVERED', 'CONFIRMED', 'SHIPPED'] } },
      _sum: { total: true }
    })
    return Number(result._sum.total || 0)
  }
}
