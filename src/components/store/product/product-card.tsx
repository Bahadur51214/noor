"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    images: { url: string; alt?: string | null }[]
    stock: number
    isFeatured?: boolean
    newArrival?: boolean
    reviewCount?: number
    ratingAverage?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "/placeholder.svg",
      price: Number(product.price),
      salePrice: product.salePrice != null ? Number(product.salePrice) : null,
      stock: product.stock,
    })
    toast.success(`${product.name} added to cart`)
  }

  const isNew = product.newArrival
  const isSale = !!product.salePrice

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col gap-4"
    >
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#F7F4EF] rounded-sm block">
        <Image
          src={product.images[0]?.url || "/placeholder.svg"}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && <Badge className="bg-[#0D0D0D] text-white rounded-none uppercase tracking-wider text-[10px] px-2 py-1">New</Badge>}
          {isSale && <Badge className="bg-[#C9A96E] text-white rounded-none uppercase tracking-wider text-[10px] px-2 py-1">Sale</Badge>}
        </div>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-[#0D0D0D]/90 hover:bg-[#0D0D0D] text-white rounded-none uppercase tracking-widest text-xs h-12 backdrop-blur-sm"
          >
            {product.stock > 0 ? (
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </span>
            ) : "Out of Stock"}
          </Button>
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <Link href={`/product/${product.slug}`} className="hover:text-[#C9A96E] transition-colors">
          <h3 className="font-serif text-lg text-[#0D0D0D] truncate">{product.name}</h3>
        </Link>
        {(product.reviewCount ?? 0) > 0 && (
          <div className="flex items-center gap-1.5" aria-label={`${product.ratingAverage} stars, ${product.reviewCount} reviews`}>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= Math.round(product.ratingAverage ?? 0) ? "fill-[#C9A96E] text-[#C9A96E]" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {isSale ? (
            <>
              <span className="text-[#C9A96E] font-medium">Rs. {product.salePrice?.toLocaleString()}</span>
              <span className="text-gray-400 line-through text-sm">Rs. {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-[#0D0D0D] font-medium">Rs. {product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
