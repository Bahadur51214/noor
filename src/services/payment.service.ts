import { db } from '@/lib/db'
import { emailService } from './email.service'

export const paymentService = {
  async submitReference(orderId: string, data: any) {
    await db.payment.create({
      data: {
        orderId,
        method: data.method,
        transactionId: data.transactionId,
        senderName: data.senderName,
        screenshotUrl: data.screenshotUrl,
        status: 'PENDING'
      }
    })
    await db.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PENDING_VERIFICATION' }
    })
  },

  async verify(paymentId: string, adminId: string) {
    await db.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', verifiedById: adminId, verifiedAt: new Date() }
      })
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
      })
    })

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    })
    if (payment?.order.customerEmail) {
      emailService.sendPaymentVerified(payment.order).catch(() => {})
    }
  },

  async reject(paymentId: string, adminId: string, reason: string) {
    await db.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'REJECTED', rejectionReason: reason, verifiedById: adminId, verifiedAt: new Date() }
      })
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'REJECTED', status: 'PAYMENT_ISSUE' }
      })
    })
  },

  async getPendingVerifications() {
    return db.payment.findMany({
      where: { status: 'PENDING' },
      include: { order: true }
    })
  },

  async getPaymentSettings() {
    const settings = await db.storeSetting.findMany({
      where: { group: 'payment' }
    })
    return settings.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {})
  },

  async updatePaymentSettings(settings: any) {
    for (const [key, value] of Object.entries(settings)) {
      await db.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), group: 'payment' }
      })
    }
  }
}
