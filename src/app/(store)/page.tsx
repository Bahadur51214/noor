import { Hero, DEFAULT_HERO_IMAGE } from "@/components/store/home/hero"
import { ProductCard } from "@/components/store/product/product-card"
import { productService } from "@/services/product.service"
import { settingsService } from "@/services/settings.service"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: 'NOOR — Premium Women\'s Watches',
  description:
    'Discover NOOR\'s collection of luxury women\'s watches in Pakistan. Elegant timepieces with fast delivery and cash on delivery across the country.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NOOR — Premium Women\'s Watches',
    description:
      'Discover NOOR\'s collection of luxury women\'s watches in Pakistan. Elegant timepieces with fast delivery and cash on delivery across the country.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOOR — Premium Women\'s Watches',
    description:
      'Discover NOOR\'s collection of luxury women\'s watches in Pakistan. Elegant timepieces with fast delivery and cash on delivery across the country.',
  },
}

export default async function HomePage() {
  const [featuredProducts, bestSellers, heroImageSetting] = await Promise.all([
    productService.getFeatured(4).catch(() => []),
    productService.getBestSellers(4).catch(() => []),
    settingsService.get("heroImage").catch(() => null),
  ])

  const heroImage = heroImageSetting || DEFAULT_HERO_IMAGE

  return (
    <div className="flex flex-col min-h-screen">
      <Hero initialImage={heroImage} />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-serif text-[#0D0D0D] mb-4">Best Sellers</h2>
            <p className="text-gray-500 max-w-2xl">The pieces our customers love the most.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild variant="outline" className="rounded-none border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white px-8">
              <Link href="/shop?bestSeller=true">Shop Best Sellers</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Featured Watches */}
      {featuredProducts.length > 0 && (
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full bg-[#F7F4EF]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif text-[#0D0D0D] mb-2">Featured Collection</h2>
            <p className="text-gray-500">Handpicked selections for you.</p>
          </div>
          <Button asChild variant="outline" className="rounded-none border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white hidden sm:flex">
            <Link href="/shop?featured=true">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>
      )}

      {/* Brand Story */}
      <section className="py-24 px-4 md:px-8 bg-[#0D0D0D] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[#C9A96E] uppercase tracking-widest text-sm font-medium mb-6">Our Story</h2>
          <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">Elegance in Every Second.</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            NOOR represents the pinnacle of modern femininity and timeless elegance. 
            Our watches are designed for the confident, sophisticated woman who appreciates 
            fine craftsmanship and understated luxury.
          </p>
          <Button asChild className="bg-[#C9A96E] hover:bg-[#b0925c] text-white rounded-none px-8 py-6 uppercase tracking-widest text-sm">
            <Link href="/about">Discover NOOR</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
