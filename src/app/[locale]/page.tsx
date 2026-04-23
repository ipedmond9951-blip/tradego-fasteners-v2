import Script from 'next/script'
import { locales, type Locale, getMessages, t } from '@/i18n'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import ProductGrid from '@/components/ProductGrid'
import FAQSection from '@/components/FAQSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import InquiryForm from '@/components/InquiryForm'
import TeamCard from '@/components/TeamCard'
import { GeoPromotion } from '@/components/GeoContent'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const msgs = getMessages(locale)
  const BASE_URL = 'https://tradego-fasteners.com'

  return (
    <>
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TradeGo Fasteners',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            description: msgs.hero.subtitle,
            foundingDate: '2004',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Weifang',
              addressCountry: 'CN',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+86-159-6340-9951',
              contactType: 'sales',
              email: 'info@tradegofasteners.com',
              availableLanguage: ['English', 'Chinese', 'Spanish', 'Arabic', 'French', 'Portuguese', 'Russian', 'Japanese', 'German', 'Hindi'],
            },
          }),
        }}
      />

      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'TradeGo Fastener Products',
            itemListElement: [
              { '@type': 'ListItem', position: 1, item: { '@type': 'Product', name: 'Drywall Screws', description: 'Premium bugle head screws for drywall installation', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.02', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 2, item: { '@type': 'Product', name: 'Self-Drilling Screws', description: 'High-performance drilling screws for metal and wood', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.03', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 3, item: { '@type': 'Product', name: 'Bolts & Nuts', description: 'Industrial grade hex bolts and nuts in various grades', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.05', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 4, item: { '@type': 'Product', name: 'IBR Nails', description: 'Umbrella head roofing nails for IBR/corrugated roofing', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.01', availability: 'https://schema.org/InStock' } } },
            ],
          }),
        }}
      />

      <HeroSection locale={locale} />

      <div className="container mx-auto px-4">
        <GeoPromotion />
      </div>

      <AboutSection locale={locale} />
      <WhyChooseUs locale={locale} />
      <TeamCard locale={locale} />
      <ProductGrid locale={locale} />

      {/* Application Scenarios - content depth for SEO */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Fastener Applications & Industries</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-sm md:text-base">Our fasteners serve diverse industries worldwide. From residential construction to heavy industrial manufacturing, TradeGo delivers certified quality at competitive wholesale prices.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">🏗️ Construction & Building</h3>
              <p className="text-gray-600 text-sm">Drywall screws for interior framing, IBR nails for roofing installations, and structural bolts for steel connections. Meeting DIN, ANSI, and SABS standards for global construction projects.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">⚙️ Manufacturing & Assembly</h3>
              <p className="text-gray-600 text-sm">Self-drilling screws for metal-to-metal fastening, hex bolts and nuts for machinery assembly. Available in carbon steel, stainless steel, and zinc-plated finishes with custom specifications.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">🏠 Roofing & Cladding</h3>
              <p className="text-gray-600 text-sm">IBR nails with umbrella heads for corrugated roofing, self-drilling screws with EPDM washers for waterproof metal roof installations. SABS 1195 compliant for African market requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Product Guide - comprehensive content for SEO */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Complete Fastener Technical Guide</h2>
          <p className="text-gray-600 text-center mb-12 text-sm md:text-base">Expert reference for selecting the right fasteners for your application. Understand specifications, standards, and best practices from our 20+ years of manufacturing experience.</p>

          {/* Drywall Screws Guide */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">Drywall Screws: Complete Technical Specifications</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              Drywall screws are essential fasteners for interior construction, specifically designed for attaching gypsum board to wood or metal studs. At TradeGo Fasteners, we manufacture two primary thread types: coarse thread (W-type) for wood studs and fine thread (S-type) for metal studs. Our drywall screws feature bugle head design that prevents damage to the gypsum paper surface while providing excellent holding power.
            </p>
            <div className="bg-primary-50 rounded-lg p-4 md:p-6 mb-4">
              <h4 className="font-semibold text-primary-900 mb-3">Standard Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Sizes:</strong> 3.5mm, 3.9mm, 4.2mm, 4.8mm diameters; 25mm to 100mm lengths</div>
                <div><strong>Standards:</strong> DIN 7505, GB/T 15856, ANSI/ASME B18.6.1</div>
                <div><strong>Materials:</strong> Carbon steel (C1022), Stainless steel 304/410</div>
                <div><strong>Finishes:</strong> Zinc plated, black phosphate, galvanized</div>
                <div><strong>Head Type:</strong> Bugle head (countersunk)</div>
                <div><strong>Drive Type:</strong> Phillips #2, Square drive available</div>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              For optimal performance, select screw length that penetrates at least 19mm (3/4") into the stud. Common applications include residential interior walls, commercial office partitions, and ceiling installations. Our black phosphate finish provides superior holding power in wood studs, while zinc plating offers corrosion resistance for metal stud applications. <a href={`/${locale}#inquiry`} className="text-primary-600 hover:underline">Contact our team</a> for custom thread patterns and specialized coatings for humid environments.
            </p>
          </div>

          {/* Self-Drilling Screws Guide */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">Self-Drilling Screws (TEK Screws): Metal-to-Metal Solutions</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              Self-drilling screws, commonly known as TEK screws, eliminate the need for pre-drilling in metal-to-metal applications. The integrated drill point (TEK point) creates the pilot hole and threads in a single operation, significantly reducing installation time and labor costs. TradeGo manufactures self-drilling screws with drill points rated for different metal thicknesses, from TEK 2 (up to 0.8mm steel) to TEK 5 (up to 12.5mm steel).
            </p>
            <div className="bg-primary-50 rounded-lg p-4 md:p-6 mb-4">
              <h4 className="font-semibold text-primary-900 mb-3">Drill Point Selection Guide</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-primary-100">
                    <tr><th className="p-2 text-left">Point Type</th><th className="p-2 text-left">Metal Thickness</th><th className="p-2 text-left">Application</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr><td className="p-2 border">TEK 2</td><td className="p-2 border">Up to 0.8mm</td><td className="p-2 border">Light gauge steel, HVAC ductwork</td></tr>
                    <tr><td className="p-2 border">TEK 3</td><td className="p-2 border">0.8mm - 2.5mm</td><td className="p-2 border">Metal roofing, wall cladding</td></tr>
                    <tr><td className="p-2 border">TEK 4</td><td className="p-2 border">2.5mm - 5.0mm</td><td className="p-2 border">Structural steel, heavy framing</td></tr>
                    <tr><td className="p-2 border">TEK 5</td><td className="p-2 border">5.0mm - 12.5mm</td><td className="p-2 border">Heavy steel sections, bridge work</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              For roofing applications, we recommend self-drilling screws with EPDM washers for superior waterproofing. The washer compresses against the metal surface to create a watertight seal. Available in hex washer head (most common for power tool driving) and pan head (for applications requiring flush or low-profile finish). All our self-drilling screws comply with DIN 7504 and are tested for drill point hardness (HRC 50-55) to ensure consistent drilling performance. Request <a href={`/${locale}#inquiry`} className="text-primary-600 hover:underline">custom drill point specifications</a> for your specific material thickness.
            </p>
          </div>

          {/* Bolts & Nuts Guide */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">Industrial Bolts & Nuts: Grade Selection & Applications</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              Hex bolts and nuts form the backbone of structural and mechanical connections across industries. Understanding strength grades is essential for selecting the right fastener. TradeGo manufactures and stocks bolts from Grade 4.8 (general purpose) through Grade 12.9 (high-strength structural applications). Each grade indicates the bolt's tensile strength and yield point ratio, critical for safety-critical applications.
            </p>
            <div className="bg-primary-50 rounded-lg p-4 md:p-6 mb-4">
              <h4 className="font-semibold text-primary-900 mb-3">Bolt Grade Comparison Chart</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-primary-100">
                    <tr><th className="p-2 text-left">Grade</th><th className="p-2 text-left">Tensile Strength</th><th className="p-2 text-left">Yield Strength</th><th className="p-2 text-left">Typical Applications</th></tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr><td className="p-2 border">4.8</td><td className="p-2 border">400 MPa</td><td className="p-2 border">320 MPa</td><td className="p-2 border">Light machinery, furniture, general construction</td></tr>
                    <tr><td className="p-2 border">8.8</td><td className="p-2 border">800 MPa</td><td className="p-2 border">640 MPa</td><td className="p-2 border">Automotive, heavy equipment, structural steel</td></tr>
                    <tr><td className="p-2 border">10.9</td><td className="p-2 border">1000 MPa</td><td className="p-2 border">900 MPa</td><td className="p-2 border">Bridge construction, cranes, high-stress applications</td></tr>
                    <tr><td className="p-2 border">12.9</td><td className="p-2 border">1200 MPa</td><td className="p-2 border">1080 MPa</td><td className="p-2 border">Racing components, aerospace, extreme loads</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              All TradeGo bolts are manufactured to international standards: DIN 933 (full thread hex bolts), DIN 931 (partial thread hex bolts), ISO 4014/4017 (metric hex bolts), and ANSI/ASME B18.2.1 (imperial hex bolts). Matching nuts are available in DIN 934 (standard hex nuts) and DIN 6915 (structural nuts for high-strength applications). We offer hot-dip galvanized finish for outdoor and marine environments, with zinc thickness of 45-85 microns per ISO 1461. <a href={`/${locale}#inquiry`} className="text-primary-600 hover:underline">Request mill certificates</a> and test reports with your order.
            </p>
          </div>

          {/* IBR Nails Guide */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">IBR Nails: Roofing Fasteners for Corrugated Steel</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              IBR (Inverted Box Rib) nails are specialized roofing fasteners designed for securing corrugated steel roofing sheets to wooden or steel purlins. The distinctive umbrella head (also called dome head or button head) provides large bearing surface that prevents the nail from pulling through the roofing sheet. TradeGo's IBR nails are SABS 1195 compliant, meeting South African Bureau of Standards requirements essential for the African construction market.
            </p>
            <div className="bg-primary-50 rounded-lg p-4 md:p-6 mb-4">
              <h4 className="font-semibold text-primary-900 mb-3">IBR Nail Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Diameter:</strong> 2.5mm, 3.1mm, 3.5mm, 4.0mm</div>
                <div><strong>Length:</strong> 30mm to 100mm</div>
                <div><strong>Head Diameter:</strong> 10mm to 14mm (umbrella/dome)</div>
                <div><strong>Shank Types:</strong> Smooth, ring shank, screw shank</div>
                <div><strong>Standard:</strong> SABS 1195, ISO 1052</div>
                <div><strong>Finish:</strong> Hot-dip galvanized (HDG), sherardized</div>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              For maximum pull-out resistance, we recommend ring shank IBR nails. The annular rings create a mechanical lock with the wood fibers, providing up to 40% greater withdrawal resistance compared to smooth shank nails. Hot-dip galvanized finish ensures corrosion protection for 20+ years in most environments. For coastal or industrial areas with high salt/chemical exposure, consider sherardized finish (zinc flake coating) for enhanced corrosion resistance. <a href={`/${locale}#inquiry`} className="text-primary-600 hover:underline">Get a quote for your roofing project</a> with quantity discounts for bulk orders.
            </p>
          </div>

          {/* Material Selection Guide */}
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">Material Selection Guide: Choosing the Right Steel</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              Selecting the appropriate material for your fasteners is critical for performance and longevity. TradeGo offers fasteners in multiple steel grades, each suited to specific environmental conditions and load requirements. Carbon steel fasteners offer excellent strength-to-cost ratio for indoor applications. For outdoor use, zinc plating or hot-dip galvanizing provides necessary corrosion protection. Stainless steel fasteners (304 and 316 grades) are recommended for food processing, chemical plants, and marine applications where corrosion resistance is paramount.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Carbon Steel</h4>
                <p className="text-sm text-gray-600">Cost-effective for indoor use. Requires surface treatment (zinc, black oxide) for corrosion resistance. Available in all strength grades.</p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Stainless Steel 304</h4>
                <p className="text-sm text-gray-600">Excellent corrosion resistance for most environments. Food-safe. Lower strength than carbon steel (typically A2-70/A2-80 grade).</p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Stainless Steel 316</h4>
                <p className="text-sm text-gray-600">Marine grade. Superior resistance to salt water and chloride environments. Essential for coastal and offshore applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <InquiryForm locale={locale} />
    </>
  )
}
