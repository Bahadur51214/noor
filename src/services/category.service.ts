import { db } from '@/lib/db'

export const categoryService = {
  async getAll(includeInactive: boolean = false) {
    return db.category.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { sortOrder: 'asc' }
    })
  },

  async getBySlug(slug: string) {
    return db.category.findUnique({
      where: { slug }
    })
  },

  async getById(id: string) {
    return db.category.findUnique({
      where: { id }
    })
  },

  async create(data: any) {
    return db.category.create({ data })
  },

  async update(id: string, data: any) {
    return db.category.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    })
    
    if (!category) return { success: false, error: 'Category not found' }
    if (category._count.products > 0) return { success: false, error: 'Cannot delete category with products' }
    
    await db.category.delete({ where: { id } })
    return { success: true }
  },

  async toggleActive(id: string) {
    const category = await db.category.findUnique({ where: { id } })
    if (category) {
      await db.category.update({
        where: { id },
        data: { active: !category.active }
      })
    }
  }
}
