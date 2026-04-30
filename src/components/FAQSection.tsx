import { type Locale, t } from '@/i18n'

interface FAQSectionProps { locale?: Locale }

const faqKeys = [
  { q: 'What types of fasteners do you manufacture?', a: 'Drywall screws, TEK/self-drilling screws, hex bolts, IBR nails, anchor bolts. ISO 9001 & SABS certified.' },
  { q: 'What material should I choose for my fastener application?', a: 'Carbon steel: indoor use. SS 304/316: outdoor/marine. 316 for chloride-rich environments.' },
  { q: 'What surface finish should I choose?', a: 'Zinc plated: indoor/dry. HDG: outdoor/marine. Dacromet: demanding industrial environments.' },
  { q: 'What is the difference between zinc plated and hot-dip galvanized fasteners?', a: 'Zinc plated: 5-15μm, indoor. HDG: 45-85μm, 5-7x more protection, ideal for outdoor/marine.' },
  { q: 'What is your minimum order quantity (MOQ)?', a: 'Standard MOQ 1 ton. Trial orders from 500kg. Free samples (buyer pays shipping). 5-7 days delivery.' },
  { q: 'What are your payment terms and shipping options?', a: 'T/T, L/C, PayPal. 30% deposit, 70% balance. FOB/CIF/DDP. Sea freight 15-30 days.' },
  { q: 'Can you customize fasteners to my specifications?', a: 'Yes, OEM/ODM. Custom thread, material, finish, packaging. MOQ 5 tons for custom items.' },
  { q: 'What certifications and standards do your products meet?', a: 'ISO 9001:2015 & SABS certified. DIN, ANSI, JIS, GB compliant. Test reports available.' },
  { q: 'What is your typical lead time and delivery schedule?', a: '15-20 days standard. 25-30 days custom. Rush: 7-10 days (+15%). 98% on-time.' },
  { q: 'Do you provide wholesale pricing for distributors?', a: 'Yes, tiered wholesale pricing. Volume discounts. Private label. Direct dropshipping available.' },
  { q: 'How do you ensure product quality?', a: '3-stage QC: incoming, in-process, pre-shipment. Defect rate <0.5%. Tensile & salt spray testing.' },
  { q: 'Do your products meet SABS standards for South Africa?', a: 'Yes, SABS 1195 compliant for IBR nails and roofing fasteners. Certificates on request.' },
  { q: 'What payment methods do you accept for African customers?', a: 'T/T, L/C, Alipay, WeChat Pay. 15% bulk discount for African market customers.' },
  { q: 'How long does sea freight shipping take to African ports?', a: 'Durban 25-30 days, Lagos 30-35 days, Mombasa 28-32 days, Dar es Salaam 28-33 days.' },
  { q: 'Can you provide documentation for African customs clearance?', a: 'Yes, full export docs: invoice, packing list, Bill of Lading, Certificate of Origin, fumigation.' },
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
