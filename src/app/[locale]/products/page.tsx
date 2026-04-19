import { type Locale, t } from '@/i18n'
import Image from 'next/image'
import Link from 'next/link'

// Static product data (same as ProductGrid)
const allProducts = [
  { slug: 'drywall-screws', image: '/images/products/drywall-screws-2.jpg', pricePerPiece: 0.02, nameKey: 'drywall', specs: { size: '3.5-4.8mm × 25-100mm', standard: 'DIN 7505 / GB/T 15856', material: 'C1022 Carbon Steel', finish: 'Phosphate, Black Oxide' }, features: ['Sharp point', 'Bugle head', 'Fine thread'] },
  { slug: 'self-drilling-screws', image: '/images/products/self-drilling-screws-1.jpg', pricePerPiece: 0.03, nameKey: 'selfdrilling', specs: { size: '4.2-6.3mm × 19-150mm', standard: 'DIN 7504 / ANSI', material: 'C1022 Carbon Steel', finish: 'Zinc Plated, Ruspert' }, features: ['DR point', 'Hex/Phillips drive', 'Self-tapping'] },
  { slug: 'bolts-nuts', image: '/images/products/bolts-nuts-2.jpg', pricePerPiece: 0.05, nameKey: 'bolts', specs: { size: 'M5-M30 × 20-300mm', standard: 'DIN 933/934 / ISO 4014', material: 'Q235/Q345 Steel', finish: 'Zinc, HDG, Black, YZP' }, features: ['Grade 4.8/8.8/10.9', 'Full/Partial thread', 'Various coatings'] },
  { slug: 'ibr-nails', image: '/images/products/ibr-nails-placeholder.jpg', pricePerPiece: 0.01, nameKey: 'ibr', specs: { size: '2.5-4.0mm × 30-100mm', standard: 'SABS 1195', material: 'Q195/Q235 Wire', finish: 'Electro Galvanized' }, features: ['Umbrella head', 'Smooth/Ring shank', 'Roofing专用'] },
]

const productText: Record<string, Record<string, string>> = {
  en: { drywall: 'Drywall Screws', selfdrilling: 'Self-Drilling Screws', bolts: 'Bolts & Nuts', ibr: 'IBR Nails' },
  zh: { drywall: '干壁钉', selfdrilling: '自钻螺丝', bolts: '螺栓螺母', ibr: 'IBR钉' },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {allProducts.map((product) => {
              const text = texts[product.nameKey] || productText.en[product.nameKey]
              return (
                <div key={product.slug} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col">
                  <div className="relative h-44 md:h-52 bg-gray-100 overflow-hidden">
                    <Image src={product.image} alt={text} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" />
                    <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">${product.pricePerPiece.toFixed(3)}/pc</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-primary-900 text-lg mb-2">{text}</h3>
                    
                    {/* Specs table */}
                    <div className="space-y-1.5 text-sm mb-4 mt-auto">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between"><span className="text-gray-500 capitalize">{key === 'size' ? 'Size' : key === 'standard' ? 'Standard' : key === 'material' ? 'Material' : 'Finish'}:</span><span className="font-medium text-right ml-2 truncate">{val as string}</span></div>
                      ))}
                    </div>
                    
                    {/* Features tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.features.map((f) => (
                        <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
                      ))}
                    </div>

                    <a href={`/${locale}#inquiry`} className="block w-full text-center bg-primary-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-800 transition-colors">
                      {t(locale, 'products.inquiry')}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
