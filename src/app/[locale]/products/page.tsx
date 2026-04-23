import { type Locale, t, locales } from '@/i18n'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import MaterialsSection from '@/components/MaterialsSection'
import ProductGridWithSkeleton from '@/components/ProductGridWithSkeleton'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

// Static product data (same as ProductGrid)
const allProducts = [
  { slug: 'drywall-screws', image: '/images/products/drywall-screws-2.jpg', pricePerPiece: 0.02, nameKey: 'drywall', specs: { size: '3.5-4.8mm × 25-100mm', standard: 'DIN 7505 / GB/T 15856', material: 'C1022 Carbon Steel', finish: 'Phosphate, Black Oxide' }, features: ['Sharp point', 'Bugle head', 'Fine thread', 'Wholesale supplier', 'ISO 9001 certified'], applications: ['Construction', 'Interior decoration', 'Wood frame', 'Gypsum board', 'Wholesale bulk orders'] },
  { slug: 'self-drilling-screws', image: '/images/products/self-drilling-screws-1.jpg', pricePerPiece: 0.03, nameKey: 'selfdrilling', specs: { size: '4.2-6.3mm × 19-150mm', standard: 'DIN 7504 / ANSI', material: 'C1022 Carbon Steel', finish: 'Zinc Plated, Ruspert' }, features: ['DR point', 'Hex/Phillips drive', 'Self-tapping', 'Metal-to-metal', 'WholesaleTEK screws'], applications: ['Metal roofing', 'Steel structures', 'HVAC', 'Steel frame', 'Wholesale bulk orders'] },
  { slug: 'bolts-nuts', image: '/images/products/bolts-nuts-2.jpg', pricePerPiece: 0.05, nameKey: 'bolts', specs: { size: 'M5-M30 × 20-300mm', standard: 'DIN 933/934 / ISO 4014', material: 'Q235/Q345 Steel', finish: 'Zinc, HDG, Black, YZP' }, features: ['Grade 4.8/8.8/10.9', 'Full/Partial thread', 'Various coatings', 'Hex bolts', 'Wholesale supplier'], applications: ['Construction', 'Machinery', 'Automotive', 'Industrial', 'Wholesale bulk orders'] },
  { slug: 'ibr-nails', image: '/images/products/ibr-nails-placeholder.jpg', pricePerPiece: 0.01, nameKey: 'ibr', specs: { size: '2.5-4.0mm × 30-100mm', standard: 'SABS 1195', material: 'Q195/Q235 Wire', finish: 'Electro Galvanized' }, features: ['Umbrella head', 'Smooth/Ring shank', 'Roofing专用', 'SABS certified', 'Wholesale supplier'], applications: ['Roofing', 'Cladding', 'Construction', 'IBR roof sheeting', 'Wholesale bulk orders'] },
  { slug: 'anchor-bolts', image: '/images/products/anchor-bolts.jpg', pricePerPiece: 0.12, nameKey: 'anchor', specs: { size: 'M10-M30 × 75-600mm', standard: 'DIN 529 / ASTM F1554', material: 'Q235/Q345 Steel', finish: 'Hot-Dip Galvanized' }, features: ['Heavy-duty', 'Foundation bolts', 'Structural connection', 'ASTM F1554 certified', 'Wholesale supplier'], applications: ['Construction', 'Foundation', 'Steel structures', 'Solar panel mounting', 'Wholesale bulk orders'] },
  { slug: 'washers', image: '/images/products/washers.jpg', pricePerPiece: 0.008, nameKey: 'washers', specs: { size: 'M6-M36', standard: 'DIN 125 / ISO 7089', material: 'Carbon Steel', finish: 'Zinc Plated, HDG' }, features: ['Flat washers', 'Spring washers', 'Load distribution', 'Vibration resistance', 'Wholesale supplier'], applications: ['Machinery', 'Automotive', 'Construction', 'Industrial assembly', 'Wholesale bulk orders'] },
  { slug: 'coach-screws', image: '/images/products/coach-screws.jpg', pricePerPiece: 0.025, nameKey: 'coach', specs: { size: 'M6-M12 × 30-200mm', standard: 'DIN 571 / LS 1993', material: 'Carbon Steel', finish: 'Hot-Dip Galvanized' }, features: ['Hex head', 'Wood-to-wood', 'Deck screws', 'Outdoor use', 'Wholesale supplier'], applications: ['Decking', 'Fencing', 'Landscaping', 'Wood construction', 'Wholesale bulk orders'] },
  { slug: 'threaded-rods', image: '/images/products/threaded-rods.jpg', pricePerPiece: 0.08, nameKey: 'threaded', specs: { size: 'M6-M24 × 1m-3m', standard: 'DIN 975 / ISO 898', material: 'Carbon Steel', finish: 'Zinc Plated' }, features: ['Fully threaded', 'Custom lengths', 'Structural anchoring', 'Cut to size', 'Wholesale supplier'], applications: ['Structural', 'Machinery', 'Assembly', 'Hanging systems', 'Wholesale bulk orders'] },
]

const productText: Record<string, Record<string, string>> = {
  en: { drywall: 'Drywall Screws', selfdrilling: 'Self-Drilling Screws', bolts: 'Bolts & Nuts', ibr: 'IBR Nails', anchor: 'Anchor Bolts', washers: 'Washers', coach: 'Coach Screws', threaded: 'Threaded Rods' },
  zh: { drywall: '干墙钉', selfdrilling: '自钻螺丝', bolts: '螺栓螺母', ibr: 'IBR钉', anchor: '地脚螺栓', washers: '垫圈', coach: '木螺丝', threaded: '螺杆' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const siteUrl = 'https://tradego-fasteners.com'
  
  const titles: Record<string, string> = {
    en: 'China Wholesale Fastener Manufacturer - Drywall Screws, Self-Drilling Screws, Hex Bolts, IBR Nails | ISO 9001',
    zh: '中国紧固件批发厂家 | 干墙螺丝、自钻螺丝、六角螺栓、IBR钉批发 | ISO 9001',
  }
  const descriptions: Record<string, string> = {
    en: 'China leading wholesale fastener manufacturer. Bulk drywall screws, self-drilling TEK screws, hex bolts, nuts, washers, IBR nails. ISO 9001 certified factory with 20+ years. Low MOQ, global shipping.',
    zh: '中国领先紧固件批发制造商。批量干墙螺丝、自钻TEK螺丝、六角螺栓、螺母、垫圈、IBR钉。ISO 9001认证工厂，20多年经验。低MOQ，全球发货。',
  }
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${siteUrl}/${locale}/products`,
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/products`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/products`])),
    },
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const texts = productText[locale] || productText.en

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(locale, 'products.allProducts')}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">{t(locale, 'products.subtitle')}</p>
          {/* Search bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <input
                type="search"
                placeholder={t(locale, 'products.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/40 text-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', 'Drywall Screws', 'Self-Drilling', 'Bolts & Nuts', 'IBR Nails'].map((cat) => (
              <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === 'All' ? 'bg-primary-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <ProductGridWithSkeleton
            products={allProducts}
            locale={locale}
            texts={texts}
          />
        </div>
      </section>

      {/* Materials & Finishes Section - Round 2 improvement */}
      <MaterialsSection locale={locale} />

      {/* Product Schema for SEO - Round 5 */}
      <ProductSchema products={allProducts} locale={locale} />

      {/* Breadcrumb Schema for SEO - Round 11 */}
      <BreadcrumbSchema locale={locale} pageName="Products" pageUrl="/products" />

    </div>
  )
}
