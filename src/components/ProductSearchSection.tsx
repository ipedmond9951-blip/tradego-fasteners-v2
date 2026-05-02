'use client'

import { useState, useMemo } from 'react'
import { type Locale, t } from '@/i18n'
import ProductGridWithSkeleton from '@/components/ProductGridWithSkeleton'

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

interface ProductSearchSectionProps {
  products: Product[]
  locale: Locale
  texts: Record<string, string>
}

const categories = [
  { key: 'All', label: 'All Products' },
  { key: 'screws', label: 'Screws' },
  { key: 'bolts', label: 'Bolts & Nuts' },
  { key: 'nails', label: 'Nails' },
  { key: 'anchors', label: 'Anchors' },
  { key: 'washers', label: 'Washers' },
]

// Map products to categories
function getProductCategories(slug: string): string[] {
  const categories: string[] = []
  if (slug.includes('drywall') || slug.includes('self-drilling') || slug.includes('coach')) {
    categories.push('screws')
  }
  if (slug.includes('bolt') || slug.includes('threaded')) {
    categories.push('bolts')
  }
  if (slug.includes('ibr') || slug.includes('nail')) {
    categories.push('nails')
  }
  if (slug.includes('anchor')) {
    categories.push('anchors')
  }
  if (slug.includes('washer')) {
    categories.push('washers')
  }
  return categories
}

// Search score function - higher = more relevant
function searchScore(product: Product, query: string, texts: Record<string, string>): number {
  if (!query.trim()) return 1 // No query = show all
  
  const q = query.toLowerCase().trim()
  let score = 0
  
  const searchableText = [
    product.slug,
    product.nameKey,
    product.specs.size,
    product.specs.standard,
    product.specs.material,
    product.specs.finish,
    ...product.features,
    ...product.applications,
    texts[product.nameKey] || '',
  ].join(' ').toLowerCase()
  
  // Exact match
  if (searchableText.includes(q)) score += 10
  // Word starts with query
  const words = q.split(/\s+/)
  words.forEach(word => {
    if (word.length > 2 && searchableText.includes(word)) score += 5
  })
  
  return score
}

export default function ProductSearchSection({ products, locale, texts }: ProductSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let result = products

    // Category filter
    if (selectedCategory !== 'All') {
      const categoryMap: Record<string, string[]> = {
        'screws': ['drywall', 'self-drilling', 'coach'],
        'bolts': ['bolt', 'threaded'],
        'nails': ['ibr', 'nail'],
        'anchors': ['anchor'],
        'washers': ['washer'],
      }
      const keywords = categoryMap[selectedCategory] || []
      result = result.filter(p => 
        keywords.some(k => p.slug.includes(k))
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const scored = result
        .map(p => ({ product: p, score: searchScore(p, searchQuery, texts) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
      result = scored.map(item => item.product)
    }

    return result
  }, [products, searchQuery, selectedCategory, texts])

  const categoryLabels: Record<string, string> = {
    'All Products': locale === 'zh' ? '全部产品' : 'All Products',
    'Screws': locale === 'zh' ? '螺丝' : 'Screws',
    'Bolts & Nuts': locale === 'zh' ? '螺栓螺母' : 'Bolts & Nuts',
    'Nails': locale === 'zh' ? '钉子' : 'Nails',
    'Anchors': locale === 'zh' ? '锚栓' : 'Anchors',
    'Washers': locale === 'zh' ? '垫圈' : 'Washers',
  }

  return (
    <>
      {/* Search bar */}
      <div className="mt-8 max-w-xl">
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'zh' ? '搜索产品...' : 'Search products...'}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/40 text-sm"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-primary-200 text-sm">
            {filteredProducts.length} {locale === 'zh' ? '个结果' : 'results'} 
            {locale === 'zh' ? ' for "' : ' for "'}
            {searchQuery}
            {locale === 'zh' ? '"' : '"'}
          </p>
        )}
      </div>

      {/* Product Grid */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-primary-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {categoryLabels[cat.label] || cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="mb-4 text-gray-600 text-sm">
            {filteredProducts.length} {locale === 'zh' ? '个产品' : 'products'}
            {selectedCategory !== 'All' && ` ${locale === 'zh' ? 'in' : 'in'} ${categoryLabels[categories.find(c => c.key === selectedCategory)?.label || selectedCategory]}`}
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <ProductGridWithSkeleton
              products={filteredProducts}
              locale={locale}
              texts={texts}
            />
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {locale === 'zh' ? '没有找到匹配的产品' : 'No products found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {locale === 'zh' ? '尝试其他关键词或浏览全产品' : 'Try different keywords or browse all products'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {locale === 'zh' ? '查看全部产品' : 'View All Products'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
