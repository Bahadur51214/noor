'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/hooks/use-cart'
import { submitCheckout } from '@/actions/checkout.actions'
import { getPublicStoreSettings, getPublicPaymentSettings } from '@/actions/public.actions'
import { checkoutFormSchema, CheckoutFormValues } from '@/schemas/checkout.schema'
import { toWhatsAppLink } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/store/whatsapp-icon'
import { PaymentMethod } from '@/types/order'
import Image from 'next/image'
import { toast } from 'sonner'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormMessage, useFormField } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

function FieldLabel({ children }: { children: ReactNode }) {
  const { formItemId } = useFormField()

  return (
    <Label htmlFor={formItemId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </Label>
  )
}

function PaymentDetails({ text, fallback }: { text: string; fallback: string }) {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)

  if (lines.length === 0) {
    return <p className="text-sm text-gray-700">{fallback}</p>
  }

  return (
    <div className="divide-y divide-[#C9A96E]/20">
      {lines.map((line, index) => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          return (
            <div key={index} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-1.5 text-sm first:pt-0 last:pb-0">
              <span className="text-gray-500">{line.slice(0, colonIndex).trim()}</span>
              <span className="font-medium text-black text-right">{line.slice(colonIndex + 1).trim()}</span>
            </div>
          )
        }
        return (
          <p key={index} className="py-1.5 text-sm text-gray-600 whitespace-pre-line first:pt-0 last:pb-0">
            {line}
          </p>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codDeliveryFee, setCodDeliveryFee] = useState(250)
  const [advanceDeliveryFee, setAdvanceDeliveryFee] = useState(0)
  const [paymentAccounts, setPaymentAccounts] = useState<{ bankDetails: string; easypaisa: string; jazzcash: string }>({
    bankDetails: '',
    easypaisa: '',
    jazzcash: '',
  })
  const [whatsapp, setWhatsapp] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      area: '',
      address: '',
      landmark: '',
      paymentMethod: PaymentMethod.COD,
    }
  })
  
  const paymentMethod = form.watch('paymentMethod')
  const isAdvancePayment = paymentMethod !== PaymentMethod.COD
  
  useEffect(() => {
    setMounted(true)
    if (items.length === 0 && mounted && !orderPlaced) {
      router.push('/cart')
    }
    getPublicStoreSettings().then((settings) => {
      setCodDeliveryFee(Number(settings.shipping.codDeliveryFee ?? 250))
      setAdvanceDeliveryFee(Number(settings.shipping.advanceDeliveryFee ?? 0))
      setWhatsapp(settings.whatsapp || settings.phone || '')
    })
    getPublicPaymentSettings().then((accounts) => {
      setPaymentAccounts({
        bankDetails: accounts.bankDetails,
        easypaisa: accounts.easypaisa,
        jazzcash: accounts.jazzcash,
      })
    })
  }, [items, router, mounted, orderPlaced])

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (items.length === 0) return null

  const subtotal = getSubtotal()
  const deliveryFee = paymentMethod === PaymentMethod.COD ? codDeliveryFee : advanceDeliveryFee
  const total = subtotal + deliveryFee

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true)
    try {
      const cartItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      
      const result = await submitCheckout(data, cartItems)
      
      if (result.success && result.orderNumber) {
        setOrderPlaced(true)
        clearCart()
        router.push(`/order-success?orderNumber=${result.orderNumber}`)
      } else {
        toast.error(result.error || 'Failed to place order')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="font-serif text-3xl mb-8 text-black">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Details */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-6 pb-4 border-b">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Full Name</FieldLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Phone Number</FieldLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FieldLabel>Email (Optional)</FieldLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FieldLabel>City</FieldLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FieldLabel>Area</FieldLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FieldLabel>Full Address</FieldLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FieldLabel>Nearest Landmark (Optional)</FieldLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-6 pb-4 border-b">Payment Method</h2>
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-4 md:grid-cols-2"
                        >
                          <Label
                            htmlFor={PaymentMethod.COD}
                            className="block border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.COD} id={PaymentMethod.COD} />
                              <span className="flex-1 font-medium">Cash on Delivery</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">Pay when you receive the order (Rs. {codDeliveryFee} fee)</p>
                          </Label>
                          
                          <Label
                            htmlFor={PaymentMethod.BANK_TRANSFER}
                            className="block border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id={PaymentMethod.BANK_TRANSFER} />
                              <span className="flex-1 font-medium">Bank Transfer</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">{advanceDeliveryFee === 0 ? 'Free delivery on advance payment' : `Rs. ${advanceDeliveryFee} delivery fee`}</p>
                          </Label>
                          
                          <Label
                            htmlFor={PaymentMethod.EASYPAISA}
                            className="block border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.EASYPAISA} id={PaymentMethod.EASYPAISA} />
                              <span className="flex-1 font-medium">Easypaisa</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">{advanceDeliveryFee === 0 ? 'Free delivery on advance payment' : `Rs. ${advanceDeliveryFee} delivery fee`}</p>
                          </Label>
                          
                          <Label
                            htmlFor={PaymentMethod.JAZZCASH}
                            className="block border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.JAZZCASH} id={PaymentMethod.JAZZCASH} />
                              <span className="flex-1 font-medium">JazzCash</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">{advanceDeliveryFee === 0 ? 'Free delivery on advance payment' : `Rs. ${advanceDeliveryFee} delivery fee`}</p>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isAdvancePayment && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 pt-6 border-t"
                  >
                    <div className="bg-[#F7F4EF] p-4 rounded-md mb-4">
                      <h3 className="font-medium mb-3">Account Details</h3>
                      {paymentMethod === PaymentMethod.BANK_TRANSFER && (
                        <PaymentDetails text={paymentAccounts.bankDetails} fallback="Please contact support for bank transfer details." />
                      )}
                      {paymentMethod === PaymentMethod.EASYPAISA && (
                        <PaymentDetails text={paymentAccounts.easypaisa} fallback="Please contact support for Easypaisa details." />
                      )}
                      {paymentMethod === PaymentMethod.JAZZCASH && (
                        <PaymentDetails text={paymentAccounts.jazzcash} fallback="Please contact support for JazzCash details." />
                      )}
                      <p className="text-xs mt-3 text-gray-500">Please transfer the total amount (Rs. {total.toLocaleString()}).</p>
                    </div>

                    <div className="border border-[#C9A96E]/40 bg-[#C9A96E]/5 rounded-md p-4">
                      <h3 className="font-medium mb-2">How to Confirm Your Payment</h3>
                      <p className="text-sm text-gray-700">
                        After completing your transfer, send a screenshot of your payment to our WhatsApp at{" "}
                        <span className="font-semibold text-black">{whatsapp || "our support number"}</span>. Our
                        team will verify it and confirm your order shortly.
                      </p>
                      <Button asChild className="mt-4 bg-[#25D366] hover:bg-[#1fb857] text-white">
                        <a
                          href={whatsapp ? toWhatsAppLink(whatsapp, `Hi NOOR! I've completed my payment (Rs. ${total.toLocaleString()}) for order. Please find the screenshot attached.`) : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon className="w-4 h-4 mr-2" />
                          Send Screenshot on WhatsApp
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-black/90 h-14 text-lg hidden lg:flex"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Place Order - Rs. {total.toLocaleString()}
              </Button>
            </form>
          </Form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-2">
          <div className="bg-[#F7F4EF]/50 rounded-lg p-6 lg:sticky lg:top-8 border border-[#C9A96E]/20">
            <h2 className="font-serif text-xl mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-start">
                  <div className="w-16 h-16 relative bg-white rounded border flex-shrink-0 overflow-visible">
                    <Image 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] min-w-[18px] px-1 leading-none font-bold flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Rs. {(item.salePrice ?? item.price).toLocaleString()}</p>
                  </div>
                  <div className="font-medium text-sm">
                    Rs. {((item.salePrice ?? item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 text-sm pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  <span className="font-medium">Rs. {deliveryFee}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-lg">Total</span>
                <span className="font-serif text-2xl">Rs. {total.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="w-full bg-black text-white hover:bg-black/90 h-14 text-lg lg:hidden"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
