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
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold mb-5 leading-[1.1] tracking-tight">
              Leading <span className="text-yellow-400">Fastener</span><br />Manufacturer
            </h1>
            <p className="text-base md:text-lg text-blue-100/90 mb-7 leading-relaxed">
              20+ years experience, ISO 9001 certified, global delivery
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
              {[t(locale, 'hero.iso'), t(locale, 'hero.global'), t(locale, 'hero.experience')].map((label, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href={`/${locale}#inquiry`} className="inline-flex items-center bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3 rounded-lg font-bold text-base transition-colors shadow-md">{t(locale, 'hero.cta')}</a>
              <a href={`/${locale}#products`} className="inline-flex items-center border-2 border-white/50 text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-colors">{t(locale, 'hero.ctaSecondary')}</a>
            </div>
          </div>

          {/* Right: Featured Products Card */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="bg-white/[0.12] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/[0.15]">
              <h3 className="text-xl font-bold mb-5">{t(locale, 'hero.featured')}</h3>
              <div className="space-y-4">
                {heroProducts.map((p, i) => (
                  <a key={i} href={`/${locale}#products`} className="group flex items-start gap-4 p-2 -mx-2 rounded-lg hover:bg-white/[0.08] transition-colors">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 border border-white/10">
                      <Image src={p.src} alt={t(locale, `hero.${p.key}_name`)} width={56} height={56} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-semibold text-sm md:text-base leading-tight">{t(locale, `hero.${p.key}_name`)}</p>
                      <p className="text-xs md:text-sm text-blue-200/80 mt-0.5">{t(locale, `hero.${p.key}_desc`)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
