import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { ProductStatus } from '@/types/product'

export const productService = {
  async getAll(params: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    search?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popular';
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    status?: ProductStatus | null;
  } = {}) {
    const page = params.page || 1
    const limit = params.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      ...(params.status ? { status: params.status } : { status: 'ACTIVE' }),
      ...(params.categorySlug ? { category: { slug: params.categorySlug } } : {}),
      ...(params.featured !== undefined ? { featured: params.featured } : {}),
      ...(params.search ? { name: { contains: params.search, mode: 'insensitive' } } : {}),
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    if (params.sort === 'price-asc') orderBy = { price: 'asc' }
    else if (params.sort === 'price-desc') orderBy = { price: 'desc' }
    else if (params.sort === 'name') orderBy = { name: 'asc' }
    else if (params.sort === 'popular') orderBy = { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } }
        }
      }),
      db.product.count({ where })
    ])

    return {
      products,
      total,
      pages: Math.ceil(total / limit)
    }
  },

  async getBySlug(slug: string) {
    return db.product.findUnique({
      where: { slug, status: 'ACTIVE' },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } }
      }
    })
  },

  async getById(id: string) {
    return db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } }
      }
    })
  },

  async create(data: any) {
    const { images, ...productData } = data
    return db.product.create({
      data: {
        ...productData,
        images: {
          create: images
        }
      },
      include: { category: true, images: true }
    })
  },

  async update(id: string, data: any) {
    const { images, ...productData } = data
    return db.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images ? {
          images: {
            deleteMany: {},
            create: images
          }
        } : {})
      },
      include: { category: true, images: true }
    })
  },

  async archive(id: string) {
    await db.product.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    })
  },

  async getFeatured(limit: number = 4) {
    return db.product.findMany({
      where: { featured: true, status: 'ACTIVE' },
      take: limit,
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    })
  },

  async getNewArrivals(limit: number = 4) {
    return db.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    })
  },

  async getBestSellers(limit: number = 4) {
    return db.product.findMany({
      where: { bestSeller: true, status: 'ACTIVE' },
      take: limit,
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    })
  },

  async getRelated(productId: string, categoryId: string | null, limit: number = 4) {
    if (!categoryId) return []
    return db.product.findMany({
      where: { categoryId, id: { not: productId }, status: 'ACTIVE' },
      take: limit,
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    })
  },

  async checkStock(productId: string, quantity: number) {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    })
    if (!product) return { available: false, stock: 0 }
    return { available: product.stock >= quantity, stock: product.stock }
  },

  async search(query: string, limit: number = 10) {
    return db.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      include: { category: { select: { name: true } }, images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
    })
  }
}
