import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

// 六个主营品类，每个都链到对应的产品详情页（不是首页 #products 锚点）
const heroProducts = [
  { slug: 'drywall-screws', nameKey: 'product1_name', src: '/images/products/hero/drywall-screws-480.webp' },
  { slug: 'self-drilling-screws', nameKey: 'product2_name', src: '/images/products/hero/self-drilling-screws-480.webp' },
  { slug: 'bolts-nuts', nameKey: 'product3_name', src: '/images/products/hero/bolts-nuts-480.webp' },
  { slug: 'ibr-nails', nameKey: 'product4_name', src: '/images/products/hero/ibr-nails-480.webp' },
  { slug: 'anchor-bolts', nameKey: 'product5_name', src: '/images/products/hero/anchor-bolts-480.webp' },
  { slug: 'coach-screws', nameKey: 'product6_name', src: '/images/products/hero/coach-screws-480.webp' },
]

// 核心市场用极小字保留：搜索与 AI 仍能读到地域实体，视觉上不把全球客户挡在门外
const heroNote: Record<string, string> = {
  en: 'Primary markets: Zimbabwe, South Africa, Zambia, Mozambique, Botswana — other regions welcome',
  zh: '主力市场：津巴布韦、南非、赞比亚、莫桑比克、博茨瓦纳；其他地区同样接单',
  es: 'Mercados principales: Zimbabue, Sudáfrica, Zambia, Mozambique y Botsuana; otras regiones bienvenidas',
  fr: 'Marchés principaux : Zimbabwe, Afrique du Sud, Zambie, Mozambique, Botswana ; autres régions bienvenues',
  pt: 'Mercados principais: Zimbabué, África do Sul, Zâmbia, Moçambique e Botswana; outras regiões bem-vindas',
  ar: 'الأسواق الرئيسية: زيمبابوي وجنوب أفريقيا وزامبيا وموزمبيق وبوتسوانا، وسائر المناطق مرحب بها',
  ru: 'Основные рынки: Зимбабве, ЮАР, Замбия, Мозамбик, Ботсвана; другие регионы тоже',
  ja: '主要市場：ジンバブエ、南アフリカ、ザンビア、モザンビーク、ボツワナ。その他の地域も対応',
  de: 'Hauptmärkte: Simbabwe, Südafrika, Sambia, Mosambik, Botswana; andere Regionen willkommen',
  hi: 'मुख्य बाज़ार: ज़िम्बाब्वे, दक्षिण अफ्रीका, ज़ाम्बिया, मोज़ाम्बिक, बोत्सवाना; अन्य क्षेत्र भी स्वागत',
}

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  return (
    <section className="relative bg-[#F7F8FA] border-b border-[#ECEEF2] text-primary-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14">
          {/* Left: 文案 */}
          <div className="flex-1 w-full lg:max-w-[620px]">
            <h1 className="text-[30px] sm:text-4xl md:text-[44px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight">
              {t(locale, 'hero.h1line1')}
              <br />
              <span className="text-accent-500">{t(locale, 'hero.h1line2')}</span>
            </h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-[#4A5563] leading-relaxed max-w-[520px]">
              {t(locale, 'hero.tagline')}
            </p>
            {/* 规格小字：真实 DOM 文本，字号小但可被爬虫与 AI 直接读取 */}
            <p className="mt-3 md:mt-4 text-[12.5px] font-medium tracking-[0.06em] text-[#8A95A3]">
              {t(locale, 'hero.spec')}
            </p>

            <div className="mt-7 md:mt-8 flex flex-wrap gap-3 md:gap-4">
              <a href={`/${locale}/#inquiry`} className="inline-flex items-center bg-primary-900 hover:bg-primary-800 text-white px-6 md:px-7 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base transition-colors">
                {t(locale, 'hero.cta')}
              </a>
              <a href={`/${locale}/#products`} className="inline-flex items-center bg-white border-[1.5px] border-[#CBD2DC] hover:border-primary-700 text-primary-900 px-6 md:px-7 py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base transition-colors">
                {t(locale, 'hero.ctaSecondary')}
              </a>
            </div>

            <div className="mt-6 md:mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {[t(locale, 'hero.iso'), t(locale, 'hero.global'), t(locale, 'hero.experience')].map((label, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs text-[#7C8794]">
                  <svg className="w-3.5 h-3.5 text-success-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-[#98A2AE]">
              {heroNote[locale] || heroNote.en}
            </p>
          </div>

          {/* Right: 主营品类六宫格，每个图卡链到对应产品页 */}
          <div className="w-full lg:w-[504px] lg:flex-none">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[12.5px] font-bold tracking-[0.13em] uppercase text-primary-900">
                {t(locale, 'hero.featuredLines')}
              </span>
              <a href={`/${locale}/#products`} className="text-[12.5px] font-semibold text-primary-700 hover:text-primary-900 transition-colors">
                {t(locale, 'hero.allProducts')} →
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {heroProducts.map((p) => (
                <a
                  key={p.slug}
                  href={`/${locale}/products/${p.slug}/`}
                  aria-label={t(locale, `hero.${p.nameKey}`)}
                  className="group block bg-white border border-[#E7EAF0] rounded-xl overflow-hidden shadow-[0_6px_18px_rgba(16,42,67,0.05)] hover:shadow-[0_10px_26px_rgba(16,42,67,0.12)] transition-shadow"
                >
                  <img
                    src={p.src}
                    alt={t(locale, `hero.${p.nameKey}`)}
                    width={480}
                    height={480}
                    loading="eager"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                  <span className="flex min-h-[2.6em] items-center px-3 py-2 text-[12.5px] font-semibold leading-tight text-[#1B3A50] group-hover:text-primary-900">
                    {t(locale, `hero.${p.nameKey}`)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
