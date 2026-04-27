import Script from 'next/script'
import { locales, type Locale, getMessages, t } from '@/i18n'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import StatisticsSection from '@/components/StatisticsSection'
import ProductGrid from '@/components/ProductGrid'
import CertificationsSection from '@/components/CertificationsSection'
import FAQSection from '@/components/FAQSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import InquiryForm from '@/components/InquiryForm'
import TeamCard from '@/components/TeamCard'
import { GeoPromotion } from '@/components/GeoContent'
import ShareButtons from '@/components/ShareButtons'
import ManufacturingProcess from '@/components/ManufacturingProcess'
import SteelFutures from '@/components/SteelFutures'
import VideoSection from '@/components/VideoSection'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const msgs = getMessages(locale)
  const BASE_URL = 'https://www.tradego-fasteners.com'

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
              availableLanguage: ['English', 'Chinese', 'Spanish', 'Arabic', 'French', 'Portuguese', 'Russian'],
            },
            sameAs: [
              'https://wa.me/8615963409951'
            ],
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
              { '@type': 'ListItem', position: 1, item: { '@type': 'Product', name: 'Drywall Screws', description: 'Premium bugle head screws for drywall installation, coarse/fine thread options', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.02', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 2, item: { '@type': 'Product', name: 'Self-Drilling Screws', description: 'High-performance TEK screws for metal-to-metal fastening, drill point design', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.03', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 3, item: { '@type': 'Product', name: 'Bolts & Nuts', description: 'Industrial grade hex bolts and nuts, Grade 4.8 to 12.9', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.05', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 4, item: { '@type': 'Product', name: 'IBR Nails', description: 'Umbrella head roofing nails for IBR/corrugated roofing, SABS 1195 compliant', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.01', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 5, item: { '@type': 'Product', name: 'Anchor Bolts', description: 'Foundation anchor bolts M10-M30, ASTM F1554 compliant', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.80', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 6, item: { '@type': 'Product', name: 'Washers', description: 'Flat washers and spring washers M6-M36, DIN 125/127 standards', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.01', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 7, item: { '@type': 'Product', name: 'Coach Screws', description: 'Hex head timber screws for wood-to-wood fastening, M6-M12', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.04', availability: 'https://schema.org/InStock' } } },
              { '@type': 'ListItem', position: 8, item: { '@type': 'Product', name: 'Threaded Rods', description: 'Full thread rods M6-M24, DIN 975, 1m-3m lengths', brand: { '@type': 'Brand', name: 'TradeGo' }, offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.50', availability: 'https://schema.org/InStock' } } },
            ],
          }),
        }}
      />

      {/* FAQPage Structured Data for Google Rich Results */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'What types of fasteners do you manufacture?', acceptedAnswer: { '@type': 'Answer', text: 'We manufacture drywall screws, self-drilling screws (TEK), hex bolts and nuts, IBR nails, anchor bolts, washers, coach screws, and threaded rods. 12+ years specializing in Africa construction market. ISO 9001:2015 certified facility. SABS 1195 compliant products available.' } },
              { '@type': 'Question', name: 'What material should I choose for my fastener application?', acceptedAnswer: { '@type': 'Answer', text: 'Carbon Steel for indoor/general use. Stainless Steel 304/316 for outdoor, marine, coastal environments. 316 recommended for chloride-rich areas.' } },
              { '@type': 'Question', name: 'What surface finish should I choose?', acceptedAnswer: { '@type': 'Answer', text: 'Zinc Plated for basic indoor corrosion resistance. Hot-Dip Galvanized (HDG) for outdoor/marine/structural applications with 45-85 micron coating. Dacromet for demanding industrial environments.' } },
              { '@type': 'Question', name: 'What is the difference between zinc plated and hot-dip galvanized fasteners?', acceptedAnswer: { '@type': 'Answer', text: 'Zinc Plating: thin electroplated coating (5-15 microns), basic protection. Hot-Dip Galvanizing: thick immersion coating (45-85 microns), 5-7x more protection, ideal for outdoor and coastal areas.' } },
              { '@type': 'Question', name: 'What is your minimum order quantity (MOQ)?', acceptedAnswer: { '@type': 'Answer', text: 'Standard MOQ is 1 metric ton per product item. Trial orders available from 500kg for new customers. Free samples provided (buyer pays shipping).' } },
              { '@type': 'Question', name: 'What are your payment terms and shipping options?', acceptedAnswer: { '@type': 'Answer', text: 'Payment: T/T, L/C, PayPal for samples. Terms: 30% deposit, 70% balance before shipment. Shipping: FOB, CIF, DDP available. Sea freight for bulk orders (15-30 days transit).' } },
              { '@type': 'Question', name: 'Do your products meet SABS standards for South Africa?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, IBR nails comply with SABS 1195 requirements. Products also meet DIN, ANSI, ISO standards. Mill certificates and SABS-compliant test reports available upon request.' } },
              { '@type': 'Question', name: 'What payment methods do you accept for African customers?', acceptedAnswer: { '@type': 'Answer', text: 'T/T, L/C, Alipay, WeChat Pay accepted. Bulk order discounts up to 15% for African market customers.' } },
              { '@type': 'Question', name: 'How long does sea freight shipping take to African ports?', acceptedAnswer: { '@type': 'Answer', text: 'Durban (South Africa): 25-30 days, Beira (Mozambique/Zimbabwe): 20-25 days, Maputo (Mozambique): 20-25 days, Lagos (Nigeria): 30-35 days, Mombasa (Kenya): 28-32 days, Dar es Salaam (Tanzania): 28-33 days, Tema (Ghana): 30-35 days. We deliver to Harare, Bulawayo, Lusaka, and other major cities.' } },
              { '@type': 'Question', name: 'What certifications and standards do your products meet?', acceptedAnswer: { '@type': 'Answer', text: 'ISO 9001:2015 certified. Products comply with DIN, ANSI/ASME, JIS, GB standards. CE certification available for EU. Mill certificates and SGS/BV inspection certificates available.' } },
            ],
          }),
        }}
      />

      {/* BreadcrumbList Structured Data */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tradego-fasteners.com' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.tradego-fasteners.com/products' },
            ],
          }),
        }}
      />

      <HeroSection locale={locale} />

      <div className="container mx-auto px-4">
        <GeoPromotion />
        
        {/* Social Share Buttons */}
        <div className="max-w-3xl mx-auto py-4">
          <ShareButtons 
            url={`https://www.tradego-fasteners.com/${locale}`}
            title={locale === 'zh' ? 'TradeGo紧固件 - 专业制造商' : 'TradeGo Fasteners - Professional Manufacturer'}
            description={locale === 'zh' ? 'ISO 9001认证紧固件批发商，专业生产干墙螺丝、自钻螺丝、螺栓螺母等' : 'ISO 9001 certified wholesale fastener manufacturer'}
          />
        </div>
      </div>

      <AboutSection locale={locale} />
      <ManufacturingProcess locale={locale} />
      <SteelFutures locale={locale} />
      <VideoSection locale={locale} />
      <WhyChooseUs locale={locale} />
      <StatisticsSection locale={locale} />
      <TeamCard locale={locale} />
      <ProductGrid locale={locale} />

      {/* Application Scenarios - content depth for SEO */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Fastener Applications & Industries</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10 text-sm md:text-base">Our fasteners serve African construction and industrial projects. From residential buildings to commercial developments, TradeGo delivers SABS & ISO 9001 certified quality at factory prices with sea freight to Africa.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">🏗️ Construction & Building</h3>
              <p className="text-gray-600 text-sm">Drywall screws for interior framing, IBR nails for roofing installations, and structural bolts for steel connections. Meeting DIN, ANSI, and SABS standards for African construction projects.</p>
              <a href={`/${locale}/industry/timber-construction-fasteners-africa`} className="text-primary-600 hover:underline text-sm mt-2 inline-block">→ Learn more: Timber Construction Fasteners</a>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">⚙️ Manufacturing & Assembly</h3>
              <p className="text-gray-600 text-sm">Self-drilling screws for metal-to-metal fastening, hex bolts and nuts for machinery assembly. Available in carbon steel, stainless steel, and zinc-plated finishes with custom specifications.</p>
              <a href={`/${locale}/industry/high-tensile-structural-bolts-guide`} className="text-primary-600 hover:underline text-sm mt-2 inline-block">→ Learn more: High-Tensile Bolts</a>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-primary-900 mb-2">🏠 Roofing & Cladding</h3>
              <p className="text-gray-600 text-sm">IBR nails with umbrella heads for corrugated roofing, self-drilling screws with EPDM washers for waterproof metal roof installations. SABS 1195 compliant for African market requirements.</p>
              <a href={`/${locale}/industry/ibr-roofing-nails-installation-guide`} className="text-primary-600 hover:underline text-sm mt-2 inline-block">→ Learn more: IBR Roofing Installation</a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Product Guide - comprehensive content for SEO */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Complete Fastener Technical Guide</h2>
          <p className="text-gray-600 text-center mb-12 text-sm md:text-base">Expert reference for selecting the right fasteners for your application. Understand specifications, standards, and best practices from our 12+ years of Africa-focused manufacturing experience.</p>

          {/* Drywall Screws Guide */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">Drywall Screws: Complete Technical Specifications</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
              Drywall screws are essential fasteners for interior construction, specifically designed for attaching gypsum board to wood or metal studs. At TradeGo Fasteners, we manufacture two primary thread types: coarse thread (W-type) for wood studs and fine thread (S-type) for metal studs. Our drywall screws feature bugle head design that prevents damage to the gypsum paper surface while providing excellent holding power. <a href={`/${locale}/industry/drywall-screws-complete-guide`} className="text-primary-600 hover:underline">Read our complete drywall screws guide</a> for more detailed technical specifications.
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
              Self-drilling screws, commonly known as TEK screws, eliminate the need for pre-drilling in metal-to-metal applications. The integrated drill point (TEK point) creates the pilot hole and threads in a single operation, significantly reducing installation time and labor costs. TradeGo manufactures self-drilling screws with drill points rated for different metal thicknesses, from TEK 2 (up to 0.8mm steel) to TEK 5 (up to 12.5mm steel). <a href={`/${locale}/industry/roofing-screws-epdm-washer-guide`} className="text-primary-600 hover:underline">Learn more about EPDM washers for roofing applications</a>.
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
              Hex bolts and nuts form the backbone of structural and mechanical connections across industries. Understanding strength grades is essential for selecting the right fastener. TradeGo manufactures and stocks bolts from Grade 4.8 (general purpose) through Grade 12.9 (high-strength structural applications). Each grade indicates the bolt's tensile strength and yield point ratio, critical for safety-critical applications. <a href={`/${locale}/industry/high-tensile-structural-bolts-guide`} className="text-primary-600 hover:underline">Read our guide on high-tensile structural bolts</a> for applications requiring superior strength.
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
              IBR (Inverted Box Rib) nails are specialized roofing fasteners designed for securing corrugated steel roofing sheets to wooden or steel purlins. The distinctive umbrella head (also called dome head or button head) provides large bearing surface that prevents the nail from pulling through the roofing sheet. TradeGo's IBR nails are SABS 1195 compliant, meeting South African Bureau of Standards requirements essential for the African construction market. <a href={`/${locale}/industry/ibr-roofing-nails-installation-guide`} className="text-primary-600 hover:underline">See our detailed IBR roofing installation guide</a> for best practices.
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
              Selecting the appropriate material for your fasteners is critical for performance and longevity. TradeGo offers fasteners in multiple steel grades, each suited to specific environmental conditions and load requirements. Carbon steel fasteners offer excellent strength-to-cost ratio for indoor applications. For outdoor use, zinc plating or hot-dip galvanizing provides necessary corrosion protection. Stainless steel fasteners (304 and 316 grades) are recommended for food processing, chemical plants, and marine applications where corrosion resistance is paramount. <a href={`/${locale}/industry/fastener-corrosion-resistance-guide`} className="text-primary-600 hover:underline">Learn more about fastener corrosion resistance</a>.
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

            {/* Related Resources Section - Internal Links */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-6">📚 Related Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href={`/${locale}/industry/construction-fastener-standards-comparison`} className="block bg-white border rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all">
                  <h4 className="font-semibold text-primary-900 mb-1">Construction Standards Comparison</h4>
                  <p className="text-sm text-gray-600">Compare DIN, ANSI, and SABS fastener standards for construction projects.</p>
                </a>
                <a href={`/${locale}/industry/anchor-bolts-selection-guide`} className="block bg-white border rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all">
                  <h4 className="font-semibold text-primary-900 mb-1">Anchor Bolts Selection Guide</h4>
                  <p className="text-sm text-gray-600">Choose the right anchor bolts for foundation and structural applications.</p>
                </a>
                <a href={`/${locale}/industry/bolt-grade-markings-guide`} className="block bg-white border rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all">
                  <h4 className="font-semibold text-primary-900 mb-1">Bolt Grade Markings</h4>
                  <p className="text-sm text-gray-600">Understand bolt grade markings to ensure proper strength selection.</p>
                </a>
                <a href={`/${locale}/industry/stainless-steel-bolts-africa-guide`} className="block bg-white border rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all">
                  <h4 className="font-semibold text-primary-900 mb-1">Stainless Steel for Africa</h4>
                  <p className="text-sm text-gray-600">Guide to stainless steel fasteners for African environments.</p>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <FAQSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <CertificationsSection locale={locale} />
      <InquiryForm locale={locale} />
    </>
  )
}
