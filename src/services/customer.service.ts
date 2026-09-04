import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export const customerService = {
  async getAll(params: any = {}) {
    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.CustomerWhereInput = params.search ? {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' as const } },
        { phone: { contains: params.search } }
      ]
    } : {}

    const [customers, total] = await Promise.all([
      db.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.customer.count({ where })
    ])
    
    return { customers, total, pages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    return db.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: 'desc' } }
      }
    })
  }
}
