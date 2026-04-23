import { type Locale, t } from '@/i18n'

interface MaterialsSectionProps { locale?: Locale }

const materials = [
  { 
    icon: '🔩',
    nameKey: 'material.carbonSteel', 
    descKey: 'material.carbonSteelDesc',
    applications: 'material.carbonSteelApps',
  },
  { 
    icon: '✨',
    nameKey: 'material.stainlessSteel', 
    descKey: 'material.stainlessSteelDesc',
    applications: 'material.stainlessSteelApps',
  },
  { 
    icon: '🟡',
    nameKey: 'material.brass', 
    descKey: 'material.brassDesc',
    applications: 'material.brassApps',
  },
  { 
    icon: '🔵',
    nameKey: 'material.alluminum', 
    descKey: 'material.aluminumDesc',
    applications: 'material.aluminumApps',
  },
]

const finishes = [
  { 
    icon: '⚪',
    nameKey: 'finish.zinc', 
    descKey: 'finish.zincDesc',
  },
  { 
    icon: '🟠',
    nameKey: 'finish.hdg', 
    descKey: 'finish.hdgDesc',
  },
  { 
    icon: '⚫',
    nameKey: 'finish.blackOxide', 
    descKey: 'finish.blackOxideDesc',
  },
  { 
    icon: '🔴',
    nameKey: 'finish.dacromet', 
    descKey: 'finish.dacrometDesc',
  },
]

export default function MaterialsSection({ locale = 'en' }: MaterialsSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Materials */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{t(locale, 'material.title')}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'material.subtitle')}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((mat) => (
              <div key={mat.nameKey} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-4">{mat.icon}</div>
                <h3 className="font-bold text-primary-900 mb-2">{t(locale, mat.nameKey)}</h3>
                <p className="text-gray-600 text-sm mb-3">{t(locale, mat.descKey)}</p>
                <p className="text-gray-500 text-xs"><strong>{t(locale, 'common.applications')}:</strong> {t(locale, mat.applications)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Finishes */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{t(locale, 'finish.title')}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'finish.subtitle')}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {finishes.map((fin) => (
              <div key={fin.nameKey} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-4">{fin.icon}</div>
                <h3 className="font-bold text-primary-900 mb-2">{t(locale, fin.nameKey)}</h3>
                <p className="text-gray-600 text-sm">{t(locale, fin.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
