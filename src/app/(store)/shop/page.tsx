import { productService } from "@/services/product.service"
import { ProductCard } from "@/components/store/product/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Shop | NOOR',
  description: 'Explore our collection of luxury women\'s watches.',
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams
  
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1
  const limit = 12
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort as any : 'newest'
  const categorySlug = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined
  
  const { products, total, pages } = await productService.getAll({
    page,
    limit,
    sort,
    categorySlug,
    search
  })

  const buildSortUrl = (newSort: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (newSort !== 'newest') params.set('sort', newSort)
    if (categorySlug) params.set('category', categorySlug)
    if (search) params.set('search', search)
    const qs = params.toString()
    return qs ? `?${qs}` : '/shop'
  }

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (pageNum > 1) params.set('page', String(pageNum))
    if (sort && sort !== 'newest') params.set('sort', sort)
    if (categorySlug) params.set('category', categorySlug)
    if (search) params.set('search', search)
    const qs = params.toString()
    return qs ? `?${qs}` : '/shop'
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-[#0D0D0D] mb-4">
          {categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'OUR COLLECTION'}
        </h1>
        <p className="text-gray-500 max-w-2xl">
          {search ? `Showing results for "${search}"` : 'Discover our exquisite range of timepieces.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4 gap-4">
        <span className="text-sm text-gray-500">{total} Products</span>
        <div className="flex gap-4 text-sm flex-wrap justify-center" role="group" aria-label="Sort products">
          <Link href={buildSortUrl('newest')} className={sort === 'newest' ? 'text-[#C9A96E]' : 'text-gray-500 hover:text-[#0D0D0D]'} aria-current={sort === 'newest' ? 'true' : undefined}>Newest</Link>
          <Link href={buildSortUrl('price-asc')} className={sort === 'price-asc' ? 'text-[#C9A96E]' : 'text-gray-500 hover:text-[#0D0D0D]'} aria-current={sort === 'price-asc' ? 'true' : undefined}>Price: Low to High</Link>
          <Link href={buildSortUrl('price-desc')} className={sort === 'price-desc' ? 'text-[#C9A96E]' : 'text-gray-500 hover:text-[#0D0D0D]'} aria-current={sort === 'price-desc' ? 'true' : undefined}>Price: High to Low</Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-serif mb-4 text-[#0D0D0D]">No products found</h2>
          <Button asChild className="rounded-none bg-[#0D0D0D] text-white">
            <Link href="/shop">Clear Filters</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
          {page > 1 && (
            <Button variant="outline" asChild className="rounded-none text-[#0D0D0D] border-gray-300">
              <Link href={buildPageUrl(page - 1)} aria-label="Previous page">← Prev</Link>
            </Button>
          )}
          {Array.from({ length: pages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              asChild
              className={`rounded-none ${page === i + 1 ? 'bg-[#0D0D0D] text-white' : 'text-[#0D0D0D] border-gray-300'}`}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              <Link href={buildPageUrl(i + 1)}>
                {i + 1}
              </Link>
            </Button>
          ))}
          {page < pages && (
            <Button variant="outline" asChild className="rounded-none text-[#0D0D0D] border-gray-300">
              <Link href={buildPageUrl(page + 1)} aria-label="Next page">Next →</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
