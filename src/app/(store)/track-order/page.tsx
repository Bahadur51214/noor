'use client'

import { useState, useEffect } from 'react'
import { trackOrderAction } from '@/actions/checkout.actions'
import { OrderStatus } from '@/types/order'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Package, CheckCircle2, Truck, Box, XCircle, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { format } from 'date-fns'

const STATUS_STEPS = [
  { status: OrderStatus.PENDING, label: 'Order Placed', icon: Box },
  { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle2 },
  { status: OrderStatus.PROCESSING, label: 'Processing', icon: Package },
  { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
  { status: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle2 },
]

export default function TrackOrderPage({
  searchParams,
}: {
  searchParams?: { orderNumber?: string }
}) {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    // If we're rendering this in a way that searchParams is available (e.g. not strictly layout-wrapped)
    // Actually searchParams in Next 15 client components needs to be wrapped with useSearchParams, 
    // but we can just use window.location.search since this is a simple fallback or we can use next/navigation.
    const urlParams = new URLSearchParams(window.location.search)
    const on = urlParams.get('orderNumber')
    if (on) {
      setOrderNumber(on)
    }
  }, [])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber || !phone) {
      toast.error('Please enter both Order Number and Phone Number')
      return
    }

    setIsLoading(true)
    setOrder(null)
    try {
      const res = await trackOrderAction(orderNumber, phone)
      if (res.success) {
        setOrder(res.order)
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIndex = (currentStatus: OrderStatus) => {
    return STATUS_STEPS.findIndex(s => s.status === currentStatus)
  }

  const isCancelled = order?.status === OrderStatus.CANCELLED
  const isReturned = order?.status === OrderStatus.RETURNED

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl mb-4 text-black">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number and phone number to see the current status.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border shadow-sm mb-12 max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <Input 
            placeholder="Order Number (e.g., NOOR-123456)" 
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="flex-1"
          />
          <Input 
            placeholder="Phone Number (e.g., 03001234567)" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-black/90 md:w-32">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
          </Button>
        </form>
      </div>

      {order && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border shadow-sm p-6 md:p-10"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <h2 className="text-2xl font-serif font-medium">{order.orderNumber}</h2>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Visual Timeline */}
          {isCancelled ? (
            <div className="flex flex-col items-center justify-center py-10 text-red-500">
              <XCircle className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-medium">Order Cancelled</h3>
              <p className="text-gray-500 mt-2">This order has been cancelled.</p>
            </div>
          ) : isReturned ? (
            <div className="flex flex-col items-center justify-center py-10 text-orange-500">
              <RefreshCcw className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-medium">Order Returned</h3>
              <p className="text-gray-500 mt-2">This order is returned or return is requested.</p>
            </div>
          ) : (
            <div className="relative py-8">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded" />
              
              <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-[#C9A96E] -translate-y-1/2 rounded transition-all duration-500" 
                   style={{ width: `${Math.max(0, (getStatusIndex(order.status) / (STATUS_STEPS.length - 1)) * 100)}%` }} 
              />

              <div className="flex flex-col md:flex-row justify-between relative z-10 space-y-8 md:space-y-0">
                {STATUS_STEPS.map((step, index) => {
                  const currentIdx = getStatusIndex(order.status)
                  const isCompleted = index <= currentIdx
                  const isCurrent = index === currentIdx
                  const Icon = step.icon

                  return (
                    <div key={step.status} className="flex md:flex-col items-center md:justify-start gap-4 md:gap-0">
                      {/* Mobile Line */}
                      <div className="md:hidden absolute left-6 top-10 bottom-0 w-1 bg-gray-100 -z-10" />
                      <div className="md:hidden absolute left-6 top-10 w-1 bg-[#C9A96E] -z-10 transition-all duration-500"
                           style={{ height: isCompleted ? '100%' : '0%' }}
                      />

                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                        ${isCompleted ? 'bg-[#C9A96E] border-[#C9A96E] text-white' : 'bg-white border-gray-200 text-gray-300'}
                        ${isCurrent ? 'ring-4 ring-[#C9A96E]/20' : ''}
                      `}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="md:mt-4 md:text-center">
                        <p className={`font-medium ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-serif text-xl mb-6">Updates</h3>
              <div className="space-y-6">
                {order.statusHistory.map((history: any) => (
                  <div key={history.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#C9A96E] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{history.status}</p>
                      {history.note && <p className="text-gray-600 mt-1">{history.note}</p>}
                      <p className="text-xs text-gray-400 mt-1">{format(new Date(history.createdAt), 'PPpp')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
