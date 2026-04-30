import Image from 'next/image'
import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

const heroProducts = [
  { key: 'product1', src: '/images/products/drywall-screws-1.webp', nameKey: 'drywall' },
  { key: 'product2', src: '/images/products/self-drilling-screws-1.webp', nameKey: 'selfdrilling' },
  { key: 'product3', src: '/images/products/bolts-nuts-1.webp', nameKey: 'bolts' },
  { key: 'product4', src: '/images/products/ibr-nails-1.webp', nameKey: 'ibr' },
  { key: 'product5', src: '/images/products/anchor-bolts.webp', nameKey: 'anchor' },
  { key: 'product6', src: '/images/products/coach-screws.webp', nameKey: 'coach' },
]

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-construction.webp" alt="Construction site" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/80 via-primary-800/85 to-primary-900/90"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-10 md:py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Text */}
          <div className="flex-1 w-full max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold mb-4 md:mb-5 leading-[1.1] tracking-tight">
              Wholesale <span className="text-yellow-400">Fasteners</span> Manufacturer
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary-100/95 mb-4 md:mb-5">
              Drywall Screws, Bolts, Nuts & Industrial Hardware
            </p>
            <p className="text-sm md:text-base lg:text-lg text-primary-100/90 mb-5 md:mb-7 leading-relaxed">
              12+ years Africa focus, SABS & ISO 9001 certified, sea freight to Africa
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 md:mb-8">
              {[t(locale, 'hero.iso'), t(locale, 'hero.global'), t(locale, 'hero.experience')].map((label, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-success-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <a href={`/${locale}#inquiry`} className="inline-flex items-center bg-warning-500 hover:bg-warning-400 text-primary-900 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-colors shadow-md">{t(locale, 'hero.cta')}</a>
              <a href={`/${locale}#products`} className="inline-flex items-center border-2 border-white/50 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-white/10 transition-colors">{t(locale, 'hero.ctaSecondary')}</a>
            </div>
          </div>

          {/* Right: Featured Products Card */}
          <div className="w-full lg:w-auto lg:max-w-md lg:flex-1">
            <div className="bg-white/[0.12] backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/[0.15]">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5">{t(locale, 'hero.featured')}</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {heroProducts.map((p, i) => (
                  <a key={i} href={`/${locale}#products`} className="group flex flex-col items-center p-2 rounded-lg hover:bg-white/[0.08] transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 border border-white/10">
                      <Image src={p.src} alt={t(locale, `hero.${p.key}_name`)} width={64} height={64} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200" priority={i < 3} />
                    </div>
                    <p className="text-xs text-center text-primary-200/80 mt-1.5 line-clamp-1">{t(locale, `hero.${p.key}_name`)}</p>
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