import { productService } from "@/services/product.service"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import { Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await productService.getBySlug(resolvedParams.slug)

  if (!product) {
    return { title: 'Product Not Found | NOOR' }
  }

  return {
    title: `${product.name} | NOOR`,
    description: product.description || `Buy ${product.name} at NOOR`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await productService.getBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const isSale = !!product.salePrice

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] bg-[#F7F4EF] w-full">
            <Image
              src={product.images[0]?.url || "/placeholder.jpg"}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square bg-[#F7F4EF]">
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-sm text-[#C9A96E] uppercase tracking-widest">{product.category?.name}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-[#0D0D0D] mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            {isSale ? (
              <>
                <span className="text-2xl text-[#C9A96E] font-medium">Rs. {product.salePrice?.toLocaleString()}</span>
                <span className="text-xl text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>
                <Badge className="bg-[#C9A96E] text-white rounded-none uppercase tracking-wider">Sale</Badge>
              </>
            ) : (
              <span className="text-2xl text-[#0D0D0D] font-medium">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>

          <div className="mb-8 p-4 bg-[#F7F4EF] border border-[#C9A96E]/20 flex items-center justify-center">
            <p className="text-sm text-[#0D0D0D] tracking-wide font-medium">
              ✨ PAY IN ADVANCE &rarr; FREE DELIVERY
            </p>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="mb-8">
            <AddToCartButton product={product as any} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-gray-100 mb-8">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCw className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">7 Days Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
