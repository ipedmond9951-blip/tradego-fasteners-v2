import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

const heroProducts = [
  { key: 'product1', src: '/images/products/drywall-screws-1-thumb.webp', nameKey: 'drywall' },
  { key: 'product2', src: '/images/products/self-drilling-screws-1-thumb.webp', nameKey: 'selfdrilling' },
  { key: 'product3', src: '/images/products/bolts-nuts-1-thumb.webp', nameKey: 'bolts' },
  { key: 'product4', src: '/images/products/ibr-nails-1-thumb.webp', nameKey: 'ibr' },
  { key: 'product5', src: '/images/products/anchor-bolts-thumb.webp', nameKey: 'anchor' },
  { key: 'product6', src: '/images/products/coach-screws-thumb.webp', nameKey: 'coach' },
]

// H1 讲全球能力（不把站点写死成只做津巴布韦/南非），核心市场改到页脚式小字 note：
// 大标题负责“能不能做全球”，小字保留地域关键词给搜索与 AI 抓取，视觉上不喧宾夺主。
const heroH1: Record<string, { pre: string; hi: string; post: string; sub: string; note: string }> = {
  en: { pre: 'Wholesale ', hi: 'Fastener', post: ' Manufacturer — SABS 1195 Spec, Ships Worldwide', sub: 'Drywall screws, bolts, nuts, IBR nails, anchors and waterproofing', note: 'Primary markets: Zimbabwe, South Africa, Zambia, Mozambique, Botswana — other regions welcome' },
  zh: { pre: '', hi: '紧固件', post: '批发厂家｜按 SABS 1195 规格，全球发货', sub: '干墙钉、螺栓螺母、IBR 屋面钉、锚栓与防水材料', note: '主力市场：津巴布韦、南非、赞比亚、莫桑比克、博茨瓦纳；其他地区同样接单' },
  es: { pre: 'Fabricante mayorista de ', hi: 'fijaciones', post: ' — según SABS 1195, envíos a todo el mundo', sub: 'Tornillos, pernos, tuercas, clavos IBR, anclajes e impermeabilización', note: 'Mercados principales: Zimbabue, Sudáfrica, Zambia, Mozambique y Botsuana; otras regiones bienvenidas' },
  fr: { pre: 'Fabricant grossiste de ', hi: 'fixations', post: ' — selon SABS 1195, expédition mondiale', sub: 'Vis, boulons, écrous, clous IBR, ancrages et étanchéité', note: 'Marchés principaux : Zimbabwe, Afrique du Sud, Zambie, Mozambique, Botswana ; autres régions bienvenues' },
  pt: { pre: 'Fabricante atacadista de ', hi: 'fixadores', post: ' — conforme SABS 1195, envio para todo o mundo', sub: 'Parafusos, pernos, porcas, pregos IBR, chumbadores e impermeabilização', note: 'Mercados principais: Zimbabué, África do Sul, Zâmbia, Moçambique e Botswana; outras regiões bem-vindas' },
  ar: { pre: 'مصنع ', hi: 'مثبتات', post: ' بالجملة — وفق SABS 1195 وشحن عالمي', sub: 'براغي، براغي ربط، صواميل، مسامير IBR، مثبتات ومواد عزل', note: 'الأسواق الرئيسية: زيمبابوي وجنوب أفريقيا وزامبيا وموزمبيق وبوتسوانا، وسائر المناطق مرحب بها' },
  ru: { pre: 'Производитель ', hi: 'крепежа', post: ' оптом — по SABS 1195, доставка по миру', sub: 'Винты, болты, гайки, гвозди IBR, анкеры и гидроизоляция', note: 'Основные рынки: Зимбабве, ЮАР, Замбия, Мозамбик, Ботсвана; другие регионы тоже' },
  ja: { pre: '卸売', hi: 'ファスナー', post: 'メーカー — SABS 1195 規格、世界発送', sub: 'ビス、ボルト、ナット、IBR釘、アンカー、防水材', note: '主要市場：ジンバブエ、南アフリカ、ザンビア、モザンビーク、ボツワナ。その他の地域も対応' },
  de: { pre: 'Großhandelshersteller für ', hi: 'Verbindungselemente', post: ' — nach SABS 1195, weltweiter Versand', sub: 'Schrauben, Bolzen, Muttern, IBR-Nägel, Anker und Abdichtung', note: 'Hauptmärkte: Simbabwe, Südafrika, Sambia, Mosambik, Botswana; andere Regionen willkommen' },
  hi: { pre: 'थोक ', hi: 'फास्टनर', post: ' निर्माता — SABS 1195 मानक, दुनिया भर शिपिंग', sub: 'स्क्रू, बोल्ट, नट, IBR कील, एंकर और वॉटरप्रूफिंग', note: 'मुख्य बाज़ार: ज़िम्बाब्वे, दक्षिण अफ्रीका, ज़ाम्बिया, मोज़ाम्बिक, बोत्सवाना; अन्य क्षेत्र भी स्वागत' },
}

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  const hh = heroH1[locale] || heroH1.en
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
      {/* LCP 预加载：React 19 会把 link 提升到 head，图片与 HTML 并行下载 */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-construction-960.webp"
        imageSrcSet="/images/hero-construction-480.webp 480w, /images/hero-construction-640.webp 640w, /images/hero-construction-960.webp 960w, /images/hero-construction.webp 1400w"
        imageSizes="100vw"
        fetchPriority="high"
      />
      {/* Hero Background Image — LCP critical: responsive srcSet keeps mobile at ~35KB */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-construction.webp"
          srcSet="/images/hero-construction-480.webp 480w, /images/hero-construction-640.webp 640w, /images/hero-construction-960.webp 960w, /images/hero-construction.webp 1400w"
          sizes="100vw"
          alt="Construction site with fastener application"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/80 via-primary-800/85 to-primary-900/90"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-10 md:py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Text */}
          <div className="flex-1 w-full max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold mb-4 md:mb-5 leading-[1.1] tracking-tight">
              {hh.pre}<span className="text-yellow-400">{hh.hi}</span>{hh.post}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-primary-100/95 mb-4 md:mb-5">
              {hh.sub}
            </p>
            <p className="text-sm md:text-base lg:text-lg text-primary-100/90 mb-5 md:mb-7 leading-relaxed">
              {t(locale, 'hero.badge')}
            </p>
            {/* 核心市场用极小字保留：搜索与 AI 仍能读到地域实体，视觉上不把全球客户挡在门外 */}
            <p className="text-[11px] md:text-xs text-primary-100/65 mb-5 md:mb-7 leading-relaxed">
              {hh.note}
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
              <a href={`/${locale}/#inquiry`} className="inline-flex items-center bg-warning-500 hover:bg-warning-400 text-primary-900 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-colors shadow-md">{t(locale, 'hero.cta')}</a>
              <a href={`/${locale}/#products`} className="inline-flex items-center border-2 border-white/50 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-white/10 transition-colors">{t(locale, 'hero.ctaSecondary')}</a>
            </div>
          </div>

          {/* Right: Featured Products Card */}
          <div className="w-full lg:w-auto lg:max-w-md lg:flex-1">
            <div className="bg-white/[0.12] backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/[0.15]">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-5">{t(locale, 'hero.featured')}</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {heroProducts.map((p, i) => (
                  <a key={i} href={`/${locale}/#products`} className="group flex flex-col items-center p-2 rounded-lg hover:bg-white/[0.08] transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 border border-white/10">
                      <img src={p.src} alt={t(locale, `hero.${p.key}_name`)} width={96} height={96} loading="lazy" decoding="async" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200" />
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