import { type Locale, t } from '@/i18n'

interface CertificationsSectionProps { locale?: Locale }

const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    icon: '🏭',
  },
  {
    name: 'SABS Approved',
    description: 'South African Standards',
    icon: '🇿🇦',
  },
  {
    name: 'CE Marking',
    description: 'European Conformity',
    icon: '🇪🇺',
  },
  {
    name: 'Test Reports',
    description: 'Material & Coating Tests',
    icon: '📋',
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
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">{cert.icon}</div>
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
