import { type Locale } from '@/i18n'
import { pick, statistics } from '@/lib/statisticsI18n'
import { badgeCopy } from '@/lib/uiCopy'

interface StatisticsSectionProps {
  locale?: Locale
}

// Key statistics for E-E-A-T signals — 十语种取自 statisticsI18n，缺失语种回落 en
export default function StatisticsSection({ locale = 'en' }: StatisticsSectionProps) {
  const block = pick(statistics, locale)
  const stats = block.stats

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{block.title}</h2>
          <p className="text-primary-200 text-sm md:text-base max-w-2xl mx-auto">{block.sub}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">{stat.value}</div>
              <div className="font-semibold text-sm md:text-base mb-1">{stat.label}</div>
              <div className="text-xs text-primary-200">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-xl">🏭</span>
            <span className="text-sm font-medium">ISO 9001:2015</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-xl">✅</span>
            <span className="text-sm font-medium">{pick(badgeCopy.sabs, locale)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-xl">🇪🇺</span>
            <span className="text-sm font-medium">{pick(badgeCopy.ce, locale)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-xl">🇨🇳</span>
            <span className="text-sm font-medium">{pick(badgeCopy.madeIn, locale)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
