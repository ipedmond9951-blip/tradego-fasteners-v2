'use client'

import { type Locale } from '@/i18n'
import ProductCardClient from './ProductCardClient'

interface Product {
  slug: string
  image: string
  pricePerPiece: number
  nameKey: string
  specs: {
    size: string
    standard: string
    material: string
    finish: string
  }
  features: string[]
  applications: string[]
}

interface ProductGridWithSkeletonProps {
  products: Product[]
  locale: Locale
  texts: Record<string, string>
}

/**
 * Product grid with skeleton loading support.
 * 
 * Usage: When fetching products from API, wrap in loading state:
 * 
 * const [loading, setLoading] = useState(true)
 * const [products, setProducts] = useState([])
 * 
 * useEffect(() => {
 *   fetchProducts().then(data => {
 *     setProducts(data)
 *     setLoading(false)
 *   })
 * }, [])
 * 
 * if (loading) return <ProductGridSkeleton count={4} />
 * return <ProductGridWithSkeleton products={products} />
 */
export default function ProductGridWithSkeleton({ products, locale, texts }: ProductGridWithSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
      {products.map((product) => {
        const text = texts[product.nameKey] || ''
        return (
          <ProductCardClient
            key={product.slug}
            product={product}
            locale={locale}
            name={text}
          />
        )
      })}
    </div>
  )
}

// Re-export skeleton for use with loading state
export { default as ProductGridSkeleton } from './ProductCardSkeleton'
