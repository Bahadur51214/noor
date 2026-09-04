"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { ShoppingBag, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    images: { url: string }[]
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, clearCart } = useCart()
  const router = useRouter()

  const cartItem = {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    image: product.images[0]?.url || "/placeholder.svg",
    price: Number(product.price),
    salePrice: product.salePrice != null ? Number(product.salePrice) : null,
    stock: product.stock
  }

  const handleAddToCart = () => {
    addItem(cartItem)
    toast.success(`${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    clearCart()
    addItem(cartItem, false)
    toast.success(`${product.name} added to cart`)
    router.push("/checkout")
  }

  const isOutOfStock = product.stock <= 0

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="w-full bg-[#0D0D0D] hover:bg-black/80 text-white rounded-none uppercase tracking-widest h-14 text-sm"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
      <Button 
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className="w-full bg-[#C9A96E] hover:bg-[#B08D4F] text-white rounded-none uppercase tracking-widest h-14 text-sm"
      >
        <Zap className="w-5 h-5 mr-2" />
        Buy Now
      </Button>
    </div>
  )
}
