import { db } from '@/lib/db'

export const reviewService = {
  async submit(productId: string, data: any) {
    await db.review.create({
      data: {
        productId,
        ...data,
        status: 'PENDING'
      }
    })
  },

  async getForProduct(productId: string) {
    return db.review.findMany({
      where: { productId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getAll(params?: { status?: string }) {
    return db.review.findMany({
      where: params?.status ? { status: params.status as any } : {},
      orderBy: { createdAt: 'desc' },
      include: { product: true }
    })
  },

  async approve(id: string) {
    await db.review.update({
      where: { id },
      data: { status: 'APPROVED' }
    })
  },

  async reject(id: string) {
    await db.review.update({
      where: { id },
      data: { status: 'REJECTED' }
    })
  },

  async delete(id: string) {
    await db.review.delete({ where: { id } })
  },

  async getAverageRating(productId: string) {
    const result = await db.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true }
    })
    return {
      average: result._avg.rating || 0,
      count: result._count.id
    }
  }
}
