import { db } from '@/lib/db'

export const inventoryService = {
  async getOverview(params: any) {
    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit
    
    let where = {}
    if (params.filter === 'low') {
      where = { stock: { lte: 5, gt: 0 } }
    } else if (params.filter === 'out') {
      where = { stock: 0 }
    }

    const [items, total] = await Promise.all([
      db.product.findMany({ where, skip, take: limit }),
      db.product.count({ where })
    ])
    
    return { items, total, pages: Math.ceil(total / limit) }
  },

  async adjust(productId: string, quantity: number, note: string, adminId: string) {
    await db.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } }
    })
  },

  async restock(productId: string, quantity: number, note: string, adminId: string) {
    await db.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } }
    })
  },

  async decreaseForOrder(productId: string, quantity: number, orderId: string, tx: any = db) {
    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } }
    })
  },

  async restoreForCancellation(productId: string, quantity: number, orderId: string, tx: any = db) {
    await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } }
    })
  },

  async getLowStock() {
    return db.product.findMany({
      where: { stock: { lte: 5 } },
      select: { id: true, name: true, stock: true }
    })
  },

  async getTransactions(productId: string) {
    return db.inventoryTransaction.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  }
}
