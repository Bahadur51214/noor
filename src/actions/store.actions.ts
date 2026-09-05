'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { productService } from '@/services/product.service'
import { discountService } from '@/services/discount.service'
import { reviewService } from '@/services/review.service'
import { reviewFormSchema } from '@/schemas/review.schema'
import { normalizePakistaniPhone } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'
import { db } from '@/lib/db'

export async function searchProductsAction(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return { results: [] }

  try {
    const results = await productService.search(trimmed, 8)
    return {
      results: results.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        image: p.images[0]?.url || null,
      })),
    }
  } catch {
    return { results: [] }
  }
}

const discountQuerySchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().min(0),
})

export async function validateDiscountAction(code: string, subtotal: number) {
  try {
    const { code: cleanCode } = discountQuerySchema.parse({ code, subtotal })
    const result = await discountService.validate(cleanCode, subtotal)
    if (!result.valid) {
      return { success: false, message: result.message }
    }
    return {
      success: true,
      discountAmount: result.discountAmount,
      code: result.discount.code,
    }
  } catch {
    return { success: false, message: 'Invalid discount code' }
  }
}

const reviewVerificationSchema = z.object({
  orderNumber: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
})

export async function submitReviewAction(
  productId: string,
  formData: z.infer<typeof reviewFormSchema>,
  verification?: z.infer<typeof reviewVerificationSchema>
) {
  try {
    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'unknown'

    const rate = rateLimit(`review:${ip}`, 5, 60 * 1000)
    if (!rate.success) {
      return { success: false, message: 'Too many review submissions. Please try again later.' }
    }

    const parsed = reviewFormSchema.parse(formData)

    let orderId: string | null = null
    const verifiedOrderNumber = verification?.orderNumber
    const verifiedPhone = verification?.phone

    if (verifiedOrderNumber || verifiedPhone) {
      if (!verifiedOrderNumber || !verifiedPhone) {
        return {
          success: false,
          message: 'Please provide both order number and phone number to verify your purchase.',
        }
      }
      const order = await dbOrderWithProduct(
        verifiedOrderNumber,
        normalizePakistaniPhone(verifiedPhone),
        productId
      )
      if (!order) {
        return {
          success: false,
          message: 'We couldn\'t find a matching order for this product. Check your order number and phone.',
        }
      }
      orderId = order.id
    }

    await reviewService.submit(
      productId,
      {
        ...parsed,
        ...(orderId ? { orderId } : {}),
      },
      orderId ? 'APPROVED' : 'PENDING'
    )

    return {
      success: true,
      verified: !!orderId,
      message: orderId
        ? 'Thanks! Your verified review has been published.'
        : 'Thanks! Your review is pending approval and will appear shortly.',
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0]?.message || 'Invalid review' }
    }
    return { success: false, message: error.message || 'Failed to submit review' }
  }
}

async function dbOrderWithProduct(orderNumber: string, phone: string, productId: string) {
  return db.order.findFirst({
    where: {
      orderNumber,
      customerPhone: phone,
      status: { not: 'CANCELLED' },
      orderItems: { some: { productId } },
    },
    select: { id: true },
  })
}