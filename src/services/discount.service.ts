import { db } from '@/lib/db'

export const discountService = {
  async validate(code: string, orderTotal: number) {
    const discount = await db.discount.findUnique({ where: { code } })
    if (!discount || !discount.active) {
      return { valid: false, message: 'Invalid or inactive discount code' }
    }
    if (discount.usedCount >= (discount.usageLimit || 0)) {
      return { valid: false, message: 'Discount code usage limit reached' }
    }
    if (discount.startDate && new Date() < discount.startDate) {
      return { valid: false, message: 'Discount code not yet active' }
    }
    if (discount.endDate && new Date() > discount.endDate) {
      return { valid: false, message: 'Discount code expired' }
    }
    if (Number(discount.minOrder) > 0 && orderTotal < Number(discount.minOrder)) {
      return { valid: false, message: `Minimum order of ${Number(discount.minOrder)} required for this code` }
    }
    
    let discountAmount = 0
    if (discount.type === 'PERCENTAGE') {
      discountAmount = orderTotal * (Number(discount.amount) / 100)
    } else {
      discountAmount = Number(discount.amount)
    }
    if (discount.maxDiscount && discountAmount > Number(discount.maxDiscount)) {
      discountAmount = Number(discount.maxDiscount)
    }

    return { valid: true, discount, discountAmount }
  },

  async getAll(params?: { active?: boolean }) {
    return db.discount.findMany({
      where: params?.active !== undefined ? { active: params.active } : {}
    })
  },

  async getById(id: string) {
    return db.discount.findUnique({
      where: { id }
    })
  },

  async create(data: any) {
    return db.discount.create({ data })
  },

  async update(id: string, data: any) {
    return db.discount.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    await db.discount.delete({ where: { id } })
  },

  async toggleActive(id: string) {
    const discount = await db.discount.findUnique({ where: { id } })
    if (discount) {
      await db.discount.update({
        where: { id },
        data: { active: !discount.active }
      })
    }
  }
}
