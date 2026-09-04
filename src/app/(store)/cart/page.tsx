'use client'

import { useCart } from '@/hooks/use-cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getSubtotal } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>

  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-4xl mb-6 text-black">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven&apos;t added anything to your cart yet. Discover our premium collection of timepieces.</p>
        <Button asChild className="bg-black text-white hover:bg-black/90">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 max-w-6xl">
      <h1 className="font-serif text-4xl mb-10 text-black">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="hidden md:grid grid-cols-12 text-sm text-gray-500 pb-4 border-b">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          
          {items.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              key={item.productId}
              className="grid grid-cols-12 gap-4 items-center py-6 border-b"
            >
              <div className="col-span-12 md:col-span-6 flex gap-4">
                <div className="w-24 h-24 relative bg-[#F7F4EF] rounded overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image || "/placeholder.jpg"} 
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/product/${item.slug}`} className="font-medium hover:text-[#C9A96E] transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Rs. {(item.salePrice ?? item.price).toLocaleString()}
                  </p>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-sm text-red-500 mt-2 flex items-center gap-1 w-fit hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              
              <div className="col-span-6 md:col-span-3 flex justify-start md:justify-center">
                <div className="flex items-center border rounded">
                  <button 
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button 
                    aria-label={`Increase quantity of ${item.name}`}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="col-span-6 md:col-span-3 text-right font-medium">
                Rs. {((item.salePrice ?? item.price) * item.quantity).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-[#F7F4EF] p-8 rounded-lg sticky top-8">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-500">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">Total</span>
                <span className="font-serif text-xl">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>
            
            <Button asChild className="w-full bg-black text-white hover:bg-black/90 h-12 text-base">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <div className="mt-6 flex justify-center gap-4 opacity-70">
              <div className="text-xs text-center text-gray-500">
                <p>Secure checkout</p>
                <p className="mt-1">COD &amp; Bank Transfer available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
