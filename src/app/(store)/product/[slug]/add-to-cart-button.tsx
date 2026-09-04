"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"

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
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "/placeholder.jpg",
      price: Number(product.price),
      salePrice: product.salePrice != null ? Number(product.salePrice) : null,
      stock: product.stock
    })
    toast.success(`${product.name} added to cart`)
  }

  const isOutOfStock = product.stock <= 0

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className="w-full bg-[#0D0D0D] hover:bg-black/80 text-white rounded-none uppercase tracking-widest h-14 text-sm"
    >
      <ShoppingBag className="w-5 h-5 mr-2" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
