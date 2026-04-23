import { type Locale, t } from '@/i18n'

interface FAQSectionProps { locale?: Locale }

const faqKeys = [
  { q: 'What types of fasteners do you manufacture?', a: 'We manufacture a comprehensive range of fasteners for construction and industrial applications. Our main product categories include: drywall screws (bugle head, coarse and fine thread), self-drilling screws (TEK screws for metal-to-metal fastening), hex bolts and nuts (Grade 4.8, 8.8, 10.9), and IBR nails for roofing applications. All products are manufactured in our ISO 9001:2015 certified facility in Hebei, China, with over 20 years of production experience. We support custom specifications and offer various surface treatments including zinc plating, black oxide, and hot-dip galvanizing.' },
  { q: 'What material should I choose for my fastener application?', a: 'Choosing the right material depends on your application environment: Carbon Steel is the most economical option, suitable for indoor construction and general purposes. Stainless Steel (304/316) offers excellent corrosion resistance for outdoor, marine, and coastal environments — 316 grade is recommended for chloride-rich environments. Brass provides good corrosion resistance with excellent electrical conductivity, ideal for electrical and plumbing applications. Aluminum is lightweight with good corrosion resistance, perfect for aerospace, automotive, and applications where weight savings matter. Our team can recommend the best material based on your specific requirements and budget.' },
  { q: 'What surface finish should I choose?', a: 'Surface finish affects corrosion resistance and appearance: Zinc Plated fasteners offer basic corrosion protection with a clean silver appearance, suitable for indoor use or temporary applications. Hot-Dip Galvanized (HDG) provides superior corrosion protection for outdoor and marine environments — ideal for fencing, structural applications, and coastal areas. Black Oxide offers a decorative black finish with mild corrosion resistance for indoor use. Dacromet coating provides excellent resistance to corrosion and chemicals, suitable for demanding industrial environments. For outdoor structural applications, we recommend Hot-Dip Galvanized or Dacromet finishes.' },
  { q: 'What is the difference between zinc plated and hot-dip galvanized fasteners?', a: 'The key differences: Zinc Plating is a thin electroplated coating (5-15 microns) offering basic corrosion resistance for indoor or dry environments. Hot-Dip Galvanizing is a thick immersion coating (45-85 microns) providing 5-7x more corrosion protection than zinc plating. HDG is ideal for outdoor, marine, and structural applications where long-term durability is required. Zinc plated fasteners are more economical but degrade faster in harsh conditions. For construction projects in humid climates or coastal areas, hot-dip galvanized is strongly recommended for longevity.' },
  { q: 'What is your minimum order quantity (MOQ)?', a: 'Our standard MOQ is 1 metric ton per product item. This allows us to offer competitive wholesale pricing while maintaining quality control. For new customers, we offer flexible trial orders starting from 500kg to test product quality. We also provide free samples (you cover shipping) for quality verification before placing bulk orders. Sample delivery takes 5-7 business days via express courier.' },
  { q: 'What are your payment terms and shipping options?', a: 'We accept T/T (wire transfer), L/C (letter of credit), and PayPal for sample orders. Standard payment terms: 30% deposit with order, 70% balance before shipment. Shipping options include FOB (free on board), CIF (cost, insurance, freight), and DDP (delivered duty paid) to most destinations. We work with reliable freight forwarders and typically ship via sea freight for bulk orders (15-30 days transit). Air freight available for urgent orders at additional cost.' },
  { q: 'Can you customize fasteners to my specifications?', a: 'Yes, we specialize in OEM/ODM manufacturing. Our engineering team can produce custom fasteners based on your drawings, samples, or specifications. Customization options include: thread type (metric, UNC, UNF), head style (flat, pan, hex, countersunk), drive type (Phillips, square, Torx), material (carbon steel, stainless steel 304/316), surface finish (zinc, nickel, black oxide, dacromet), and packaging (bulk, retail blister packs, private label). Minimum order for custom items is typically 5 tons.' },
  { q: 'What certifications and standards do your products meet?', a: 'Our factory holds ISO 9001:2015 certification for quality management. Products comply with international standards including DIN (German), ANSI/ASME (American), JIS (Japanese), and GB (Chinese). We can provide mill certificates, test reports, and third-party inspection certificates (SGS, BV) upon request. CE certification is available for European market requirements. Our quality control process includes material testing, dimensional inspection, and surface finish verification.' },
  { q: 'What is your typical lead time and delivery schedule?', a: 'Standard production lead time is 15-20 working days for regular items in stock materials. Custom orders may require 25-30 days depending on complexity. Rush orders can be accommodated within 7-10 days for an expedite fee. We maintain inventory of popular sizes for faster turnaround. Production schedule: Day 1-3 order confirmation and raw material preparation, Day 4-12 manufacturing, Day 13-15 quality inspection, Day 16-18 packaging and documentation, Day 19-20 ready for shipment.' },
  { q: 'Do you provide wholesale pricing for distributors?', a: 'Absolutely! We offer tiered wholesale pricing for distributors, contractors, and hardware wholesalers. Pricing factors include: order volume, product specification, packaging requirements, and payment terms. Long-term partnership discounts available for regular customers. We support private label packaging and can ship directly to your customers as your manufacturing partner. Contact us with your requirements for a customized quotation.' },
  { q: 'How do you ensure product quality?', a: 'Quality is our top priority. Our QC process includes: raw material inspection (steel grade verification), in-process inspection (dimensional checks every 2 hours), final inspection (100% visual, statistical sampling for mechanical testing), and pre-shipment inspection. Testing capabilities include tensile strength, hardness, salt spray testing (for plating durability), and thread gauge inspection. We welcome third-party inspection and provide detailed quality documentation with each shipment.' },
]

export default function FAQSection({ locale = 'en' }: FAQSectionProps) {
  const title = t(locale, 'faq.title')
  const subtitle = t(locale, 'faq.subtitle')

  return (
    <section id="faq" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{title}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
        
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqKeys.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 group">
              <summary className="px-4 md:px-6 py-3 md:py-4 cursor-pointer font-semibold text-gray-800 hover:text-primary-600 flex justify-between items-center text-sm md:text-base">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-3 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{t(locale, 'faq.contact')}</p>
          <a href={`/${locale}#inquiry`} className="inline-flex items-center gap-2 bg-primary-700 text-white px-5 md:px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-800 transition-colors text-sm md:text-base">
            {t(locale, 'faq.contactCta')}
          </a>
        </div>
      </div>
    </section>
  )
}
