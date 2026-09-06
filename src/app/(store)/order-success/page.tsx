import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Success | NOOR',
  description: 'Your order has been placed successfully.',
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const orderNumber =
    typeof resolvedParams.orderNumber === 'string' ? resolvedParams.orderNumber : undefined

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="font-serif text-3xl mb-4 text-black">Order Successful!</h1>
        
        {orderNumber ? (
          <div className="mb-6">
            <p className="text-gray-500 mb-2">Your order number is:</p>
            <div className="bg-[#F7F4EF] py-3 px-6 rounded-md font-mono text-lg font-medium tracking-wider inline-block">
              {orderNumber}
            </div>
          </div>
        ) : null}
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for shopping with NOOR. We've received your order and are getting it ready to be shipped. We will send you an email/SMS confirmation shortly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="h-12 border-black text-black hover:bg-gray-50">
            <Link href={`/track-order${orderNumber ? `?orderNumber=${orderNumber}` : ''}`}>
              Track Order
            </Link>
          </Button>
          <Button asChild className="h-12 bg-black text-white hover:bg-black/90">
            <Link href="/">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
