import { type Locale, t } from '@/i18n'

interface WhyChooseUsProps { locale?: Locale }

const advantages = [
  {
    icon: '🏭',
    titleKey: 'why.experienceTitle',
    descKey: 'why.experienceDesc',
  },
  {
    icon: '✅',
    titleKey: 'why.certTitle',
    descKey: 'why.certDesc',
  },
  {
    icon: '🔧',
    titleKey: 'why.capabilityTitle',
    descKey: 'why.capabilityDesc',
  },
  {
    icon: '🚢',
    titleKey: 'why.logisticsTitle',
    descKey: 'why.logisticsDesc',
  },
]

export default function WhyChooseUs({ locale = 'en' }: WhyChooseUsProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{t(locale, 'why.title')}</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'why.subtitle')}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv) => (
            <div key={adv.titleKey} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">{adv.icon}</div>
              <h3 className="font-bold text-primary-900 mb-2 text-base md:text-lg">{t(locale, adv.titleKey)}</h3>
              <p className="text-gray-600 text-sm">{t(locale, adv.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
