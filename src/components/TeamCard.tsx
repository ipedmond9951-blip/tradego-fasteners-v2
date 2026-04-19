import { type Locale, t } from '@/i18n'

interface TeamCardProps { locale?: Locale }

export default function TeamCard({ locale = 'en' }: TeamCardProps) {
  return (
    <section className="py-6 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-7">
          {/* TG Logo */}
          <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-primary-800 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-yellow-400 font-black text-xl md:text-3xl tracking-tight">TG</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-bold text-gray-900 mb-1">
              TradeGo Engineering Team
            </h2>
            <p className="text-xs md:text-base text-gray-500 mb-2 md:mb-3 leading-relaxed">
              {locale === 'zh'
                ? '专业的紧固件专家团队，在建筑材料和工业应用领域拥有深厚知识'
                : 'Expert fastener specialists with deep knowledge in construction materials and industrial applications'}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] md:text-sm text-gray-400">
              <span className="inline-flex items-center gap-1">🏢 Founded: 2004</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1">✅ ISO 9001:2015 Certified</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1">👥 150+ Employees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
