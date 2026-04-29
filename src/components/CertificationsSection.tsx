import { type Locale, t } from '@/i18n'

interface CertificationsSectionProps { locale?: Locale }

// Certification badges with proper visual representations
const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    // Professional checkmark icon for quality certification
    iconSvg: (
      <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'SABS Approved',
    description: 'South African Standards',
    // Shield icon for certification/trust mark
    iconSvg: (
      <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'CE Marking',
    description: 'European Conformity',
    // CE mark text - professional certification symbol
    iconSvg: (
      <div className="w-12 h-12 mx-auto flex items-center justify-center border-2 border-primary-600 rounded">
        <span className="text-primary-600 font-bold text-lg">CE</span>
      </div>
    ),
  },
  {
    name: 'Test Reports',
    description: 'Material & Coating Tests',
    // Document/report icon
    iconSvg: (
      <svg className="w-12 h-12 mx-auto text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function CertificationsSection({ locale = 'en' }: CertificationsSectionProps) {
  const title = t(locale, 'certifications.title')
  const subtitle = t(locale, 'certifications.subtitle')

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{title}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {certifications.map((cert, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 md:p-8 text-center border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
              <div className="mb-3 md:mb-4">{cert.iconSvg}</div>
              <h3 className="font-bold text-primary-900 text-sm md:text-base mb-1">{cert.name}</h3>
              <p className="text-gray-500 text-xs md:text-sm">{cert.description}</p>
            </div>
          ))}
        </div>
        
        {/* Additional quality note */}
        <div className="mt-10 md:mt-12 text-center">
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            {locale === 'en' 
              ? 'All products come with material certificates, test reports, and quality guarantees. We provide third-party inspection services upon request.'
              : locale === 'zh'
              ? '所有产品均配有材料证书、测试报告和质量保证。我们提供第三方检验服务。'
              : locale === 'ja'
              ? 'すべての製品には材料証明書、試験報告書、品質保証が付属しています。第三方検査サービスもご要望に応じて提供いたします。'
              : 'All products come with material certificates, test reports, and quality guarantees.'}
          </p>
        </div>
      </div>
    </section>
  )
}
