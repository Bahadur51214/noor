'use server'

import { checkoutFormSchema, paymentReferenceSchema } from '@/schemas/checkout.schema'
import { orderService } from '@/services/order.service'
import { z } from 'zod'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

const CHECKOUT_RATE_LIMIT = 10
const CHECKOUT_WINDOW_MS = 60 * 60 * 1000 // 1 hour per IP

export async function submitCheckout(
  formData: z.infer<typeof checkoutFormSchema>,
  items: { productId: string; quantity: number }[],
  paymentRefData?: z.infer<typeof paymentReferenceSchema>,
  discountCode?: string
) {
  try {
    const headerList = await headers();
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'unknown';

    const rate = rateLimit(`checkout:${ip}`, CHECKOUT_RATE_LIMIT, CHECKOUT_WINDOW_MS);
    if (!rate.success) {
      return { success: false, error: 'Too many checkout attempts. Please try again later.' }
    }

    const validatedData = checkoutFormSchema.parse(formData)

    let paymentReference = undefined
    if (validatedData.paymentMethod !== 'COD') {
      if (!paymentRefData) {
        return { success: false, error: 'Payment reference is required for advance payments' }
      }
      paymentReference = paymentReferenceSchema.parse(paymentRefData)
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    const result = await orderService.create({
      items,
      discountCode,
      paymentMethod: validatedData.paymentMethod,
      customer: {
        name: validatedData.fullName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        city: validatedData.city,
        area: validatedData.area,
        address: validatedData.address,
        landmark: validatedData.landmark
      },
      paymentReference
    })

    return { success: true, orderNumber: result.orderNumber }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return { success: false, error: error.message || 'An error occurred during checkout' }
  }
}

export async function trackOrderAction(orderNumber: string, phone: string) {
  try {
    const headerList = await headers();
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      'unknown';

    const rate = rateLimit(`track:${ip}`, 30, 60 * 1000);
    if (!rate.success) {
      return { success: false, error: 'Too many requests. Please try again later.' }
    }

    const order = await orderService.trackOrder(orderNumber, phone)
    if (!order) {
      return { success: false, error: 'Order not found or phone number does not match.' }
    }
    return { success: true, order }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error tracking order' }
  }
}
