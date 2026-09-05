import { productService } from "@/services/product.service"
import { reviewService } from "@/services/review.service"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Truck, Banknote, RefreshCw, Star } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"
import { ProductImageGallery } from "@/components/store/product/product-image-gallery"
import { ProductInformation } from "@/components/store/product/product-information"
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

          {ratingInfo.count > 0 && (
            <a href="#reviews" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity" aria-label={`${ratingInfo.average.toFixed(1)} out of 5 stars, ${ratingInfo.count} reviews`}>
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(ratingInfo.average) ? "fill-[#C9A96E] text-[#C9A96E]" : "fill-gray-200 text-gray-200"}`}
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-[#0D0D0D]">{ratingInfo.average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">
                ({ratingInfo.count} review{ratingInfo.count === 1 ? "" : "s"})
              </span>
            </a>
          )}
          
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

          {product.shortDescription && (
            <p className="mb-8 text-[15px] leading-relaxed text-gray-600">
              {product.shortDescription}
            </p>
          )}

          <div className="mb-8">
            <ProductInformation
              specifications={
                product.specifications &&
                typeof product.specifications === "object" &&
                !Array.isArray(product.specifications)
                  ? (product.specifications as Record<string, string>)
                  : null
              }
              whyLoveIt={product.whyLoveIt}
              careInstructions={product.careInstructions}
            />
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

      <div id="reviews" className="scroll-mt-24">
      <ProductReviews
        productId={product.id}
        reviews={reviews as any}
        average={ratingInfo.average}
        reviewCount={ratingInfo.count}
      />
      </div>
      </div>
    </>
  )
}
