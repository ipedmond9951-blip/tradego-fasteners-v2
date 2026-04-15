import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">{t(locale, 'hero.iso')}</span>
            <span className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">{t(locale, 'hero.global')}</span>
            <span className="bg-blue-600/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">{t(locale, 'hero.experience')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t(locale, 'hero.title')}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            {t(locale, 'hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`/${locale}#inquiry`} className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              {t(locale, 'hero.cta')}
            </a>
            <a href={`/${locale}#products`} className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
              {t(locale, 'hero.ctaSecondary')}
            </a>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <h3 className="col-span-full text-xl font-semibold text-blue-200">{t(locale, 'hero.featured')}</h3>
          {(['product1', 'product2', 'product3'] as const).map((p, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold">{t(locale, `hero.${p}_name`)}</h4>
              <p className="text-sm text-blue-200">{t(locale, `hero.${p}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
