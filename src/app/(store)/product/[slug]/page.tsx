import { productService } from "@/services/product.service"
import { reviewService } from "@/services/review.service"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Truck, Banknote, RefreshCw } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { ProductImageGallery } from "@/components/store/product/product-image-gallery"
import { ProductDescription } from "@/components/store/product/product-description"
import { ProductReviews } from "@/components/store/product/product-reviews"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await productService.getBySlug(resolvedParams.slug)

  if (!product) {
    return { title: 'Product Not Found | NOOR' }
  }

  return {
    title: product.seoTitle || `${product.name} | NOOR`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      product.description ||
      `Buy ${product.name} at NOOR`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.seoTitle || `${product.name} | NOOR`,
      description:
        product.seoDescription ||
        product.shortDescription ||
        product.description ||
        `Buy ${product.name} at NOOR`,
      url: `/product/${product.slug}`,
      type: 'website',
      images: product.images[0]?.url
        ? [{ url: product.images[0].url, alt: product.name }]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await productService.getBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const [reviews, ratingInfo] = await Promise.all([
    reviewService.getForProduct(product.id),
    reviewService.getAverageRating(product.id),
  ])

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://noorwatches.com'

  const isSale = !!product.salePrice

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    sku: product.sku || undefined,
    image: product.images[0]?.url || undefined,
    brand: { '@type': 'Brand', name: 'NOOR' },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: isSale && product.salePrice ? product.salePrice : product.price,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
        />

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

          <div className="mb-8">
            <AddToCartButton product={product as any} />
          </div>

          <div className="mb-8">
            <ProductDescription description={product.description} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-gray-100 mb-8">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Banknote className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RefreshCw className="w-6 h-6 text-[#C9A96E]" />
              <span className="text-xs uppercase tracking-wider text-gray-500">7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews
        productId={product.id}
        reviews={reviews as any}
        average={ratingInfo.average}
        reviewCount={ratingInfo.count}
      />
      </div>
    </>
  )
}
