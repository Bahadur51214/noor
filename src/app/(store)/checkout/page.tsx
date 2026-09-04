'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/hooks/use-cart'
import { submitCheckout } from '@/actions/checkout.actions'
import { getPublicStoreSettings, getPublicPaymentSettings } from '@/actions/public.actions'
import { checkoutFormSchema, paymentReferenceSchema, CheckoutFormValues, PaymentReferenceValues } from '@/schemas/checkout.schema'
import { PaymentMethod } from '@/types/order'
import Image from 'next/image'
import { toast } from 'sonner'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'

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
  
  const paymentRefForm = useForm<PaymentReferenceValues>({
    resolver: zodResolver(paymentReferenceSchema),
    defaultValues: {
      method: PaymentMethod.BANK_TRANSFER,
      transactionId: '',
      senderName: '',
      screenshotUrl: '',
    }
  })

  // Keep paymentRef method in sync
  useEffect(() => {
    if (isAdvancePayment) {
      paymentRefForm.setValue('method', paymentMethod)
    }
  }, [paymentMethod, isAdvancePayment, paymentRefForm])

  useEffect(() => {
    setMounted(true)
    if (items.length === 0 && mounted) {
      router.push('/cart')
    }
    getPublicStoreSettings().then((settings) => {
      setCodDeliveryFee(Number(settings.shipping.codDeliveryFee ?? 250))
      setAdvanceDeliveryFee(Number(settings.shipping.advanceDeliveryFee ?? 0))
    })
    getPublicPaymentSettings().then((accounts) => {
      setPaymentAccounts({
        bankDetails: accounts.bankDetails,
        easypaisa: accounts.easypaisa,
        jazzcash: accounts.jazzcash,
      })
    })
  }, [items, router, mounted])

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (items.length === 0) return null

  const subtotal = getSubtotal()
  const deliveryFee = paymentMethod === PaymentMethod.COD ? codDeliveryFee : advanceDeliveryFee
  const total = subtotal + deliveryFee

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true)
    try {
      let paymentRefData: PaymentReferenceValues | undefined = undefined
      
      if (isAdvancePayment) {
        const isValid = await paymentRefForm.trigger()
        if (!isValid) {
          toast.error('Please fill in the payment reference details')
          setIsSubmitting(false)
          return
        }
        paymentRefData = paymentRefForm.getValues()
      }
      
      const cartItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      
      const result = await submitCheckout(data, cartItems, paymentRefData)
      
      if (result.success && result.orderNumber) {
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
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
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
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="03001234567" {...field} />
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
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} />
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
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Lahore" {...field} />
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
                        <FormLabel>Area</FormLabel>
                        <FormControl>
                          <Input placeholder="Gulberg" {...field} />
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
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="House 123, Street 4..." {...field} />
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
                        <FormLabel>Nearest Landmark (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Near ABC School" {...field} />
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
                          <div className="border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.COD} id={PaymentMethod.COD} />
                              <Label htmlFor={PaymentMethod.COD} className="flex-1 cursor-pointer font-medium">Cash on Delivery</Label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">Pay when you receive the order (Rs. {codDeliveryFee} fee)</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id={PaymentMethod.BANK_TRANSFER} />
                              <Label htmlFor={PaymentMethod.BANK_TRANSFER} className="flex-1 cursor-pointer font-medium">Bank Transfer</Label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">Free delivery on advance payment</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.EASYPAISA} id={PaymentMethod.EASYPAISA} />
                              <Label htmlFor={PaymentMethod.EASYPAISA} className="flex-1 cursor-pointer font-medium">Easypaisa</Label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">Free delivery on advance payment</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 cursor-pointer hover:border-black transition-colors [&:has([data-state=checked])]:border-black [&:has([data-state=checked])]:bg-[#F7F4EF]/30">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={PaymentMethod.JAZZCASH} id={PaymentMethod.JAZZCASH} />
                              <Label htmlFor={PaymentMethod.JAZZCASH} className="flex-1 cursor-pointer font-medium">JazzCash</Label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 ml-6">Free delivery on advance payment</p>
                          </div>
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
                    <div className="bg-[#F7F4EF] p-4 rounded-md mb-6">
                      <h3 className="font-medium mb-2">Account Details</h3>
                      {paymentMethod === PaymentMethod.BANK_TRANSFER && (
                        <p className="text-sm text-gray-700 whitespace-pre-line">{paymentAccounts.bankDetails || "Please contact support for bank transfer details."}</p>
                      )}
                      {paymentMethod === PaymentMethod.EASYPAISA && (
                        <p className="text-sm text-gray-700 whitespace-pre-line">{paymentAccounts.easypaisa || "Please contact support for Easypaisa details."}</p>
                      )}
                      {paymentMethod === PaymentMethod.JAZZCASH && (
                        <p className="text-sm text-gray-700 whitespace-pre-line">{paymentAccounts.jazzcash || "Please contact support for JazzCash details."}</p>
                      )}
                      <p className="text-xs mt-2 text-gray-500">Please transfer the total amount (Rs. {total.toLocaleString()}) and enter the reference details below.</p>
                    </div>
                    
                    <Form {...paymentRefForm}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={paymentRefForm.control}
                          name="senderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sender Account Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Ali Khan" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentRefForm.control}
                          name="transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction ID (TID)</FormLabel>
                              <FormControl>
                                <Input placeholder="1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Form>
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
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
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
