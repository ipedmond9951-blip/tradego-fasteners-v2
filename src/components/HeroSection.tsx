import Image from 'next/image'
import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

const heroProducts = [
  { key: 'product1', src: '/images/products/drywall-screws-1.jpg' },
  { key: 'product2', src: '/images/products/self-drilling-screws-1.jpg' },
  { key: 'product3', src: '/images/products/bolts-nuts-1.jpg' },
]

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top: Text + CTA */}
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-20">
          {/* Left: Copy */}
          <div className="flex-1 max-w-xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20">{t(locale, 'hero.iso')}</span>
              <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20">{t(locale, 'hero.global')}</span>
              <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium border border-white/20">{t(locale, 'hero.experience')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
              {t(locale, 'hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 mb-8 leading-relaxed">
              {t(locale, 'hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`/${locale}#inquiry`} className="inline-flex items-center bg-white text-blue-900 px-7 py-3.5 rounded-xl font-bold text-base hover:bg-blue-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5">
                {t(locale, 'hero.cta')} →
              </a>
              <a href={`/${locale}#products`} className="inline-flex items-center border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 transition-all hover:border-white/60">
                {t(locale, 'hero.ctaSecondary')}
              </a>
            </div>
          </div>

          {/* Right: Hero Product Image */}
          <div className="flex-1 relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <Image
                  src="/images/products/drywall-screws-2.jpg"
                  alt={t(locale, 'hero.product1_name')}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 50vw, 45vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Featured Products — Large Cards */}
        <div className="pb-16 lg:pb-20">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-200/80 mb-6">{t(locale, 'hero.featured')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {heroProducts.map((p, i) => (
              <a
                key={i}
                href={`/${locale}#products`}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <Image
                    src={p.src}
                    alt={t(locale, `hero.${p.key}_name`)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="font-bold text-base md:text-lg leading-tight">{t(locale, `hero.${p.key}_name`)}</h4>
                    <p className="text-xs md:text-sm text-blue-100 mt-1 opacity-90">{t(locale, `hero.${p.key}_desc`)}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
