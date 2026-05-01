import type { Metadata } from 'next'
import { type Locale } from '@/i18n'

export const metadata: Metadata = {
  title: 'Zimbabwe Fasteners Wholesale | Bulk Bolts & Screws Supplier | TradeGo',
  description: 'Professional Zimbabwe fastener wholesale supplier. Factory prices for drywall screws, hex bolts, IBR nails, self-drilling screws. Shipping to Harare, Bulawayo, Mutare. SABS & ISO 9001 certified.',
  keywords: ['Zimbabwe fasteners', 'Harare bolts', 'Zimbabwe wholesale screws', 'Bulawayo nuts', 'African construction fasteners', 'mining fasteners Zimbabwe'],
}

export default async function ZimbabweFastenersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const t = (key: string) => key // 简化，实际应该用i18n

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0A3D62] to-[#1A5F7A] text-white py-16 px-4 min-h-[400px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/zimbabwe-warehouse.webp" alt="Zimbabwe warehouse" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D62]/90 to-[#1A5F7A]/80"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Your Trusted Zimbabwe Fasteners Wholesale Partner
          </h1>
          <p className="text-xl mb-6">
            15+ years supplying drywall screws, hex bolts, IBR nails, and self-drilling screws to Zimbabwe, South Africa, and Southern Africa at factory prices.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`/${locale}/products`} className="bg-white text-[#0A3D62] px-6 py-3 rounded font-semibold hover:bg-gray-100">
              View Products
            </a>
            <a href="https://wa.me/8615963409951" className="bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 flex items-center gap-2">
              WhatsApp: +86-159-6340-9951
            </a>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">We Deliver To All Major Zimbabwe Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe', 'Masvingo', 'Zvishavane', 'Chinhoyi'].map(city => (
              <div key={city} className="bg-white p-4 rounded shadow text-center">
                <span className="font-semibold">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Popular Fasteners For Zimbabwe Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded p-6">
              <h3 className="font-bold text-lg mb-2">Drywall Screws</h3>
              <p className="text-gray-600 mb-4">Coarse thread, fine thread, black phosphate. Perfect for Zimbabwe construction projects.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• #6, #8, #10 gauges</li>
                <li>• 1" to 3" lengths</li>
                <li>• Bulk pricing available</li>
              </ul>
            </div>
            <div className="border rounded p-6">
              <h3 className="font-bold text-lg mb-2">Hex Bolts (DIN 931)</h3>
              <p className="text-gray-600 mb-4">High tensile steel, hot-dip galvanized. For mining and construction.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• M10 to M24 sizes</li>
                <li>• Grade 8.8 / 10.9</li>
                <li>• Zinc plating available</li>
              </ul>
            </div>
            <div className="border rounded p-6">
              <h3 className="font-bold text-lg mb-2">IBR Roof Nails</h3>
              <p className="text-gray-600 mb-4">Cladding nails, stitch rivets. Essential for IBR roofing in Zimbabwe.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Galvanized finish</li>
                <li>• Various head styles</li>
                <li>• Pre-drilled holes available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - AI Loves This Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (Zimbabwe Market)</h2>
          <div className="space-y-4">
            <details className="bg-white rounded p-4 shadow">
              <summary className="font-semibold cursor-pointer">What is the minimum order quantity for Zimbabwe wholesale?</summary>
              <p className="mt-2 text-gray-600">MOQ starts at 5,000 pieces per item. For container orders (20ft), we offer additional 8-12% discounts. Sample orders of 500-1,000 pieces are available at slightly higher unit prices.</p>
            </details>
            <details className="bg-white rounded p-4 shadow">
              <summary className="font-semibold cursor-pointer">How long does shipping to Zimbabwe take?</summary>
              <p className="mt-2 text-gray-600">Sea freight from China to Durban (South Africa) takes 25-30 days, then overland to Harare takes 5-7 days. Total lead time: 35-45 days. Air freight available for urgent orders (7-10 days) at higher cost.</p>
            </details>
            <details className="bg-white rounded p-4 shadow">
              <summary className="font-semibold cursor-pointer">Do you have SABS certified products?</summary>
              <p className="mt-2 text-gray-600">Yes, we have SABS certified fasteners available for South African and Zimbabwean market requirements. Contact us for SABS certification documentation and test reports.</p>
            </details>
            <details className="bg-white rounded p-4 shadow">
              <summary className="font-semibold cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-2 text-gray-600">We accept T/T (30% deposit, 70% before shipment), L/C at sight, and O/A for established customers. USD, CNY, and ZAR payments accepted.</p>
            </details>
            <details className="bg-white rounded p-4 shadow">
              <summary className="font-semibold cursor-pointer">Can you supply fasteners for Zimbabwe mining industry?</summary>
              <p className="mt-2 text-gray-600">Yes, we supply specialized mining fasteners including rock bolts, mine support fasteners, and corrosion-resistant coatings for Zimbabwe's mining sector. Our products are used by major mining companies in Hwange, Kadoma, and Mutare regions.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Why Choose TradeGo for Zimbabwe Fasteners?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🏭</div>
              <div>
                <h3 className="font-bold">15+ Years Manufacturing</h3>
                <p className="text-gray-600">Factory direct pricing, no middleman markup</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">✅</div>
              <div>
                <h3 className="font-bold">ISO 9001 & SABS Certified</h3>
                <p className="text-gray-600">Quality guaranteed with certification documents</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🚢</div>
              <div>
                <h3 className="font-bold">Sea Freight to Durban & Beira</h3>
                <p className="text-gray-600">Cost-effective shipping, 35-45 day lead time</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📦</div>
              <div>
                <h3 className="font-bold">20ft Container = 28-30 Tons</h3>
                <p className="text-gray-600">Optimized packaging for sea freight cost savings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema for this page */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WholesaleStore",
        "name": "TradeGo Fasteners - Zimbabwe Wholesale",
        "description": "Professional fastener wholesale supplier for Zimbabwe market. Factory direct prices for drywall screws, hex bolts, IBR nails, self-drilling screws. Shipping to Harare, Bulawayo, Mutare.",
        "url": "https://www.tradego-fasteners.com/en/zimbabwe-fasteners-wholesale",
        "telephone": "+86-159-6340-9951",
        "image": "https://www.tradego-fasteners.com/images/zimbabwe-warehouse.jpg",
        "priceRange": "$$",
        "whatsApp": "+8615963409951",
        "areaServed": [
          { "@type": "Country", "name": "Zimbabwe" },
          { "@type": "City", "name": "Harare" },
          { "@type": "City", "name": "Bulawayo" },
          { "@type": "City", "name": "Mutare" },
          { "@type": "Country", "name": "South Africa" },
          { "@type": "Country", "name": "Zambia" }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Zimbabwe Fasteners",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Drywall Screws", "description": "Black phosphate drywall screws for construction" }},
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Hex Bolts", "description": "High tensile hex bolts DIN 931" }},
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "IBR Nails", "description": "Galvanized IBR roof nails" }},
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Self-Drilling Screws", "description": "Self-drilling TEK screws for metal roofing" }}
          ]
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingDestination": [
            { "@type": "Country", "name": "Zimbabwe" },
            { "@type": "Country", "name": "Zambia" },
            { "@type": "Country", "name": "South Africa" }
          ],
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "35-45",
            "currency": "USD"
          },
          "deliveryTime": {
            "@type": "QuantitativeValue",
            "minValue": "35",
            "maxValue": "45",
            "unitCode": "DAY"
          }
        }
      }) }} />
    </div>
  )
}
