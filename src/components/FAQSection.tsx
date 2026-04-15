import { type Locale, t } from '@/i18n'

interface FAQSectionProps { locale?: Locale }

const faqKeys = [
  { q: 'What types of fasteners do you manufacture?', a: 'We manufacture drywall screws, self-drilling screws, bolts, nuts, and IBR nails. All products are made in our ISO 9001 certified factory in China.' },
  { q: 'What is your minimum order quantity (MOQ)?', a: 'Our standard MOQ is 1 ton per item. However, we offer sample orders and flexible quantities for new customers to test quality.' },
  { q: 'Do you offer free samples?', a: 'Yes! We provide free samples for quality verification. You only need to cover the shipping cost. Sample delivery takes 5-7 business days.' },
  { q: 'What is your typical lead time?', a: 'Standard orders are completed within 15-20 days. Rush orders can be accommodated within 7-10 days for an additional fee.' },
  { q: 'Can you customize fasteners to my specifications?', a: 'Absolutely. We offer full customization including size, material, surface treatment, and packaging. Our engineering team works with your drawings or samples.' },
  { q: 'What certifications do your products have?', a: 'Our factory holds ISO 9001:2015 certification. Products comply with DIN, ANSI, and JIS standards. CE certification available upon request.' },
]

export default function FAQSection({ locale = 'en' }: FAQSectionProps) {
  const title = t(locale, 'faq.title')
  const subtitle = t(locale, 'faq.subtitle')

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">{title}</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{subtitle}</p>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqKeys.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 group">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-blue-600 flex justify-between items-center">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">{t(locale, 'faq.contact')}</p>
          <a href={`/${locale}#inquiry`} className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            {t(locale, 'faq.contactCta')}
          </a>
        </div>
      </div>
    </section>
  )
}
