import { type Locale, t, locales } from '@/i18n'
import type { Metadata } from 'next'
import MaterialsSection from '@/components/MaterialsSection'
import ProductSearchSection from '@/components/ProductSearchSection'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ProductsContentSection from '@/components/ProductsContentSection'
import StatisticsSection from '@/components/StatisticsSection'

// Static product data (same as ProductGrid)
const allProducts = [
  { slug: 'drywall-screws', image: '/images/products/drywall-screws-1.webp', pricePerPiece: 0.02, nameKey: 'drywall', specs: { size: '3.5-4.8mm × 25-100mm', standard: 'DIN 7505 / GB/T 15856', material: 'C1022 Carbon Steel', finish: 'Phosphate, Black Oxide' }, features: ['Sharp point', 'Bugle head', 'Fine thread', 'Wholesale supplier', 'ISO 9001 certified'], applications: ['Construction', 'Interior decoration', 'Wood frame', 'Gypsum board', 'Wholesale bulk orders'], faq: ['What size drywall screw should I use? For 1/2-inch drywall on wood studs, use 1-5/8 inch screws. For 5/8-inch drywall, use 2-inch screws. For metal studs, use fine-thread drywall screws.', 'What is the difference between fine thread and coarse thread drywall screws? Fine thread screws are for metal studs (they grip metal better). Coarse thread screws are for wood studs (they bite into wood faster and hold better).', 'How many drywall screws do I need per sheet? Space screws every 12 inches on ceilings and every 16 inches on walls. A 4x8 sheet needs about 32-40 screws.', 'What is the bugle head on drywall screws? The bugle head has a concave shape that sits flush with the drywall paper without tearing it. Never use flat head screws on drywall.', 'Can drywall screws be used for outdoor projects? No, standard drywall screws (phosphate coated) are for indoor use only. For outdoor or wet areas, use stainless steel screws or exterior-rated fasteners.'] },
  { slug: 'self-drilling-screws', image: '/images/products/self-drilling-screws-1.webp', pricePerPiece: 0.03, nameKey: 'selfdrilling', specs: { size: '4.2-6.3mm × 19-150mm', standard: 'DIN 7504 / ANSI', material: 'C1022 Carbon Steel', finish: 'Zinc Plated, Ruspert' }, features: ['DR point', 'Hex/Phillips drive', 'Self-tapping', 'Metal-to-metal', 'WholesaleTEK screws', 'ISO 9001 certified'], applications: ['Metal roofing', 'Steel structures', 'HVAC', 'Steel frame', 'Solar panel mounting', 'African construction', 'Wholesale bulk orders'], faq: ['What is a self-drilling screw? A self-drilling screw (tek screw) has a drill bit tip that drills its own hole and taps threads, eliminating the need for pre-drilling. Available in types 1-5, with type 3 being most common for metal roofing.', 'What is the difference between self-drilling and self-tapping screws? Self-drilling screws have a drill point that drills the hole; self-tapping screws require a pre-drilled hole. Self-drilling screws are faster for metal applications.', 'What size self-drilling screw for metal roofing? For metal roofing on steel purlins, typically use #10-16 or #12-14 self-drilling screws. Match screw length to combined thickness of roof sheet and purlin.', 'Can self-drilling screws be used for wood? Self-drilling screws are designed for metal-to-metal. For wood-to-metal, use self-tapping screws or wood screws. Self-drilling into wood may split the material.', 'What coatings are available for self-drilling screws in Africa? Common coatings: Zinc Plated (indoor/dry), Ruspert (alkaline resistant, outdoor), HDG Hot-Dip Galvanized (coastal/marine). For African coastal projects, use Ruspert or HDG coatings.', 'Do you supply self-drilling screws to African countries? Yes, we supply self-drilling screws to Zimbabwe, Zambia, South Africa, Mozambique via Durban and Beira ports. MOQ 100kg, lead time 15-25 days sea freight.'] },
  { slug: 'bolts-nuts', image: '/images/products/bolts-nuts-2.webp', pricePerPiece: 0.05, nameKey: 'bolts', specs: { size: 'M5-M30 × 20-300mm', standard: 'DIN 933/934 / ISO 4014', material: 'Q235/Q345 Steel', finish: 'Zinc, HDG, Black, YZP' }, features: ['Grade 4.8/8.8/10.9', 'Full/Partial thread', 'Various coatings', 'Hex bolts', 'Wholesale supplier'], applications: ['Construction', 'Machinery', 'Automotive', 'Industrial', 'Wholesale bulk orders'] },
  { slug: 'ibr-nails', image: '/images/products/ibr-nails-1.webp', pricePerPiece: 0.01, nameKey: 'ibr', specs: { size: '2.5-4.0mm × 30-100mm', standard: 'SABS 1195', material: 'Q195/Q235 Wire', finish: 'Electro Galvanized' }, features: ['Umbrella head', 'Smooth/Ring shank', 'Roofing专用', 'SABS certified', 'Wholesale supplier'], applications: ['Roofing', 'Cladding', 'Construction', 'IBR roof sheeting', 'Wholesale bulk orders'] },
  { slug: 'anchor-bolts', image: '/images/products/anchor-bolts.webp', pricePerPiece: 0.12, nameKey: 'anchor', specs: { size: 'M10-M30 × 75-600mm', standard: 'DIN 529 / ASTM F1554 / SABS 153', material: 'Q235/Q345 Steel', finish: 'Hot-Dip Galvanized (HDG)', minOrder: '100 pcs' }, features: ['Heavy-duty', 'Foundation bolts', 'Structural connection', 'ASTM F1554 certified', 'HDG corrosion resistance', 'Wholesale supplier', 'ISO 9001 factory'], applications: ['Construction foundation', 'Steel structures', 'Solar panel mounting', 'Mining equipment', 'Bridge construction', 'Zimbabwe building projects'], faq: ['What is the lead time for anchor bolts to Zimbabwe? Lead time is 15-25 days by sea freight to Durban or Beira port.', 'What grades are available? Grade 4.6, 8.8, and 10.9 anchor bolts available with HDG finish.', 'Can you supply SABS certified anchor bolts? Yes, SABS 153 certified anchor bolts available for South Africa and Zimbabwe markets.', 'What is the minimum order quantity? MOQ is 100 pieces per size, mixed sizes welcome.', 'Do you provide custom lengths? Yes, custom lengths from 75mm to 600mm available with 7-day production time.'] },
  { slug: 'washers', image: '/images/products/washers.webp', pricePerPiece: 0.008, nameKey: 'washers', specs: { size: 'M6-M36', standard: 'DIN 125 / ISO 7089', material: 'Carbon Steel, Stainless Steel (304/316)', finish: 'Zinc Plated, HDG, Stainless Steel' }, features: ['Flat washers', 'Spring washers', 'Lock washers', 'Load distribution', 'Vibration resistance', 'Wholesale supplier', 'ISO 9001 certified'], applications: ['Machinery', 'Automotive', 'Construction', 'Industrial assembly', 'Structural connections', 'Mining equipment', 'Wholesale bulk orders'], faq: ['What sizes of washers do you supply? We supply washers from M6 to M36, suitable for most construction and industrial applications.', 'What materials are available? Carbon steel with zinc plating or hot-dip galvanizing, and stainless steel 304/316 for corrosive environments.', 'Can washers be supplied with bolts and nuts? Yes, we offer bolt-washer sets for convenience. Ask about our combo packages for African construction projects.', 'What is the minimum order quantity? MOQ is 500 pieces per size for bulk orders. Mixed sizes welcome.', 'Do you supply spring washers (split washers)? Yes, spring washers available in both carbon steel (zinc plated) and stainless steel.'] },
  { slug: 'coach-screws', image: '/images/products/coach-screws.webp', pricePerPiece: 0.025, nameKey: 'coach', specs: { size: 'M6-M12 × 30-200mm', standard: 'DIN 571 / LS 1993', material: 'Carbon Steel', finish: 'Hot-Dip Galvanized (HDG)' }, features: ['Hex head', 'Wood-to-wood', 'Deck screws', 'Heavy-duty', 'Outdoor use', 'HDG corrosion resistance', 'Wholesale supplier', 'ISO 9001 certified'], applications: ['Decking', 'Fencing', 'Landscaping', 'Wood construction', 'Timber frame', 'Outdoor structures', 'Zimbabwe construction', 'Wholesale bulk orders'], faq: ['What is a coach screw used for? Coach screws (lag screws) are heavy-duty wood screws used for strong wood-to-wood connections in decking, fencing, and timber frame construction.', 'Are coach screws suitable for outdoor use? Yes, our coach screws are hot-dip galvanized (HDG) making them ideal for outdoor and corrosive environments.', 'What size coach screws do I need for decking? For deck joists, typically M8 × 80mm or M10 × 100mm coach screws are used. Check your local building codes for requirements.', 'Can coach screws be used with metal? Coach screws are primarily designed for wood-to-wood applications. For metal-to-wood, consider lag bolts or structural screws.', 'Do you supply coach screws to Zimbabwe? Yes, we supply HDG coach screws to Zimbabwe via Durban and Beira ports. Lead time 15-25 days by sea freight.'] },
  { slug: 'threaded-rods', image: '/images/products/threaded-rods.webp', pricePerPiece: 0.08, nameKey: 'threaded', specs: { size: 'M6-M24 × 1m-3m', standard: 'DIN 975 / ISO 898', material: 'Carbon Steel', finish: 'Zinc Plated' }, features: ['Fully threaded', 'Custom lengths', 'Structural anchoring', 'Cut to size', 'Wholesale supplier'], applications: ['Structural', 'Machinery', 'Assembly', 'Hanging systems', 'Wholesale bulk orders'] },
]

const productText: Record<string, Record<string, string>> = {
  en: { drywall: 'Drywall Screws', selfdrilling: 'Self-Drilling Screws', bolts: 'Bolts & Nuts', ibr: 'IBR Nails', anchor: 'Anchor Bolts', washers: 'Washers', coach: 'Coach Screws', threaded: 'Threaded Rods' },
  zh: { drywall: '干墙钉', selfdrilling: '自钻螺丝', bolts: '螺栓螺母', ibr: 'IBR钉', anchor: '地脚螺栓', washers: '垫圈', coach: '木螺丝', threaded: '螺杆' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  const titles: Record<string, string> = {
    en: 'Stainless Steel Hex Bolts & Heavy Duty Fasteners Wholesale | 8.8/10.9 Grade, Self-Tapping Screws, Lock Nuts | TradeGo',
    zh: '不锈钢六角螺栓_高强度8.8/10.9级螺栓_自攻螺丝_锁紧螺母_批发 | TradeGo',
  }
  const descriptions: Record<string, string> = {
    en: 'Wholesale fastener supplier. 304/316 stainless steel hex bolts, high-strength 8.8/10.9/12.9 grade bolts, self-tapping & self-drilling screws, lock nuts, washers, IBR nails, anchor bolts. ISO 9001 certified. Low MOQ, sea freight to Zimbabwe, Zambia, Mozambique, South Africa.',
    zh: '批发紧固件供应商。304/316不锈钢六角螺栓、高强度8.8/10.9/12.9级螺栓、自攻螺丝、自钻螺丝、锁紧螺母、垫圈、IBR钉、地脚螺栓。ISO 9001认证。低MOQ，海运至津巴布韦、赞比亚、莫桑比克、南非。',
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
      canonical: `${siteUrl}/${locale}/products`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/${locale}/products`],
        ...locales.map(l => [l, `${siteUrl}/${l}/products`]),
      ]),
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
          {/* Search Section - Client Component */}
          <ProductSearchSection
            products={allProducts}
            locale={locale}
            texts={texts}
          />
        </div>
      </section>

      {/* Materials & Finishes Section */}
      <MaterialsSection locale={locale} />

      {/* Statistics Section - E-E-A-T signals */}
      <StatisticsSection locale={locale} />

      {/* Unique Content Section - Helps with SEO indexing */}
      <ProductsContentSection locale={locale} />

      {/* Product Schema for SEO */}
      <ProductSchema products={allProducts} locale={locale} />

      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema locale={locale} pageName="Products" pageUrl="/products" />

    </div>
  )
}
