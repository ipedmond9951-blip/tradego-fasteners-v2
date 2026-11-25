import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, pick } from '@/lib/productI18n'
import { markets, getMarket } from '@/lib/markets'
import { marketText } from '@/lib/marketText'

const SITE_URL = 'https://www.tradego-fasteners.com'

// 地域页 SEO 标题与描述：十语种原生模板，{c} 为目的国本地国名
const marketTitles: Record<string, string> = {
  en: 'Fastener Wholesale for {c} | Bolts, Nails, Anchors | TradeGo',
  zh: '出口{c}的紧固件批发｜螺栓螺母屋面钉 | TradeGo',
  es: 'Mayorista de fijaciones para {c} | Pernos, tornillos, anclajes | TradeGo',
  fr: 'Grossiste en visserie pour {c} | Boulons, vis, ancrages | TradeGo',
  pt: 'Atacado de fixadores para {c} | Parafusos, pregos, chumbadores | TradeGo',
  ar: 'بيع بالجملة لمواد التثبيت إلى {c} | براغي ومسامير ومراسي | TradeGo',
  ru: 'Крепёж оптом — {c} | Болты, саморезы, анкеры | TradeGo',
  ja: '{c}向けファスナー卸売 | ボルト・ビス・アンカー | TradeGo',
  de: 'Verbindungselemente Großhandel für {c} | Schrauben, Bolzen, Anker | TradeGo',
  hi: '{c} के लिए फ़ासनर थोक | बोल्ट, स्क्रू, एंकर | TradeGo',
}

const marketDescriptions: Record<string, string> = {
  en: 'Wholesale fasteners for {c}: structural bolts, roofing screws, anchors, screws and waterproofing. made to SABS 1195 / DIN / ISO, FOB/CIF quotes with port and document guidance.',
  zh: '{c}市场紧固件批发：结构螺栓、屋面钉、锚栓、螺丝与防水材料，按 SABS 1195 / DIN / ISO 规格生产，FOB/CIF 报价，含港口与单证说明。',
  es: 'Fijaciones al por mayor para {c}: pernos estructurales, tornillos de tejado, anclajes, tornillos e impermeabilización. Producción según SABS 1195 / DIN / ISO, cotización FOB/CIF con guía de puertos y documentos.',
  fr: 'Visserie en gros pour {c} : boulons de structure, vis de toiture, ancrages, vis et étanchéité. Production selon SABS 1195 / DIN / ISO, devis FOB/CIF avec guide des ports et documents.',
  pt: 'Fixadores por atacado para {c}: parafusos estruturais, parafusos de telhado, chumbadores, parafusos e impermeabilização. Producción según SABS 1195 / DIN / ISO, cotação FOB/CIF com guia de portos e documentos.',
  ar: 'مواد تثبيت بالجملة إلى {c}: براغي إنشائية وبراغي أسقف ومراسي وبراغي ومواد عزل مائي. وفق SABS 1195 / DIN / ISO، عرض FOB/CIF مع دليل الموانئ والمستندات.',
  ru: 'Крепёж оптом — {c}: конструкционные болты, кровельные саморезы, анкеры, саморезы и гидроизоляция. Поставки по SABS 1195 / DIN / ISO, цены FOB/CIF с данными по портам и документам.',
  ja: '{c}向けファスナー卸：構造用ボルト、屋根用ビス、アンカー、ビス、防水資材。SABS 1195 / DIN / ISO 規格で製造、港と書類の案内付きのFOB/CIF見積。',
  de: 'Verbindungselemente im Großhandel für {c}: Konstruktionsbolzen, Dachschrauben, Anker, Schrauben und Abdichtung. gefertigt nach SABS 1195 / DIN / ISO, FOB/CIF-Angebot mit Hafen- und Dokumentenberatung.',
  hi: '{c} के लिए थोक फ़ासनर: स्ट्रक्चरल बोल्ट, रूफिंग स्क्रू, एंकर, स्क्रू और वॉटरप्रूफिंग। SABS 1195 / DIN / ISO मानक पर निर्मित, बंदरगाह और दस्तावेज़ मार्गदर्शन के साथ FOB/CIF कोटेशन।',
}

// 津巴布韦已有独立落地页（/zimbabwe-fasteners-wholesale），此处不重复生成，避免自我竞争
const EXCLUDED = ['zimbabwe']
const generated = markets.filter(m => !EXCLUDED.includes(m.slug))

export function generateStaticParams() {
  return locales.flatMap(locale => generated.map(m => ({ locale, market: m.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; market: string }> }): Promise<Metadata> {
  const { locale: lp, market } = await params
  const locale = (lp as Locale) || 'en'
  const m = getMarket(market)
  if (!m || EXCLUDED.includes(market)) return { title: 'Market Not Found | TradeGo Fasteners', robots: { index: false } }

  const country = m.name[locale] || m.name.en
  const title = (marketTitles[locale] || marketTitles.en).replace('{c}', country)
  const description = (marketDescriptions[locale] || marketDescriptions.en).replace('{c}', country)
  const canonical = `${SITE_URL}/${locale}/markets/${market}/`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/markets/${market}/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/markets/${market}/`]),
      ]),
    },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

type Copy = {
  home: string; markets: string; portsLabel: string; docsLabel: string; linesLabel: string
  faqLabel: string; cta: string; allMarkets: string; sub: string; h1: string; seeAll: string
}

const copy: Record<string, Copy> = {
  en: {
    home: 'Home', markets: 'Markets',
    portsLabel: 'Ports and routing', docsLabel: 'Documents and clearance', linesLabel: 'What sells in this market',
    faqLabel: 'FAQ', cta: 'Request a quote', allMarkets: 'All markets',
    sub: 'Factory direct from Qingdao / Tianjin, ISO 9001 and SABS 1195 spec lines available.',
    h1: 'Fasteners for {c}', seeAll: 'See all {n} product lines',
  },
  zh: {
    home: '首页', markets: '市场',
    portsLabel: '港口与航线', docsLabel: '单证与清关', linesLabel: '这个市场主要买什么',
    faqLabel: '常见问题', cta: '索取报价', allMarkets: '全部市场',
    sub: '按 SABS 1195 / DIN / ISO 规格生产，青岛/天津起运；ISO 9001 与 SABS 认证可按订单申请办理。',
    h1: '{c}紧固件批发供应', seeAll: '查看全部 {n} 个品类',
  },
  es: {
    home: 'Inicio', markets: 'Mercados',
    portsLabel: 'Puertos y rutas', docsLabel: 'Documentos y despacho', linesLabel: 'Qué se vende en este mercado',
    faqLabel: 'Preguntas frecuentes', cta: 'Solicitar cotización', allMarkets: 'Todos los mercados',
    sub: 'Directo de fábrica desde Qingdao / Tianjin, líneas ISO 9001 y conformes SABS.',
    h1: 'Fijaciones para {c}', seeAll: 'Ver las {n} líneas de producto',
  },
  fr: {
    home: 'Accueil', markets: 'Marchés',
    portsLabel: 'Ports et itinéraires', docsLabel: 'Documents et dédouanement', linesLabel: 'Ce qui se vend sur ce marché',
    faqLabel: 'Questions fréquentes', cta: 'Demander un devis', allMarkets: 'Tous les marchés',
    sub: 'Direct usine de Qingdao / Tianjin, gammes ISO 9001 et conformes SABS.',
    h1: 'Visserie et fixations pour {c}', seeAll: 'Voir les {n} gammes',
  },
  pt: {
    home: 'Início', markets: 'Mercados',
    portsLabel: 'Portos e rotas', docsLabel: 'Documentos e desembaraço', linesLabel: 'O que vende neste mercado',
    faqLabel: 'Perguntas frequentes', cta: 'Pedir cotação', allMarkets: 'Todos os mercados',
    sub: 'Direto da fábrica em Qingdao / Tianjin, linhas ISO 9001 e conformes SABS.',
    h1: 'Fixadores para {c}', seeAll: 'Ver as {n} linhas de produto',
  },
  ar: {
    home: 'الرئيسية', markets: 'الأسواق',
    portsLabel: 'الموانئ والمسارات', docsLabel: 'المستندات والتخليص', linesLabel: 'ما يُطلب في هذا السوق',
    faqLabel: 'الأسئلة الشائعة', cta: 'طلب عرض سعر', allMarkets: 'كل الأسواق',
    sub: 'من المصنع مباشرة من تشينغداو / تيانجين، خطوط ISO 9001 ومطابقة SABS.',
    h1: 'مسامير ومواد تثبيت إلى {c}', seeAll: 'عرض {n} خط إنتاج',
  },
  ru: {
    home: 'Главная', markets: 'Рынки',
    portsLabel: 'Порты и маршруты', docsLabel: 'Документы и растаможка', linesLabel: 'Что покупают на этом рынке',
    faqLabel: 'Вопросы', cta: 'Запросить цену', allMarkets: 'Все рынки',
    sub: 'Напрямую с завода в Циндао / Тяньцзине, позиции ISO 9001 и по SABS.',
    h1: 'Крепёж — {c}', seeAll: 'Все {n} позиций',
  },
  ja: {
    home: 'ホーム', markets: '市場',
    portsLabel: '港と輸送ルート', docsLabel: '書類と通関', linesLabel: 'この市場で売れる品目',
    faqLabel: 'よくある質問', cta: '見積依頼', allMarkets: 'すべての市場',
    sub: '青島・天津から出荷、SABS 1195 / DIN / ISO 規格で製造；ISO 9001・SABS 認証はご注文に応じ申請可能。',
    h1: '{c}向けファスナー卸', seeAll: '全{n}品目を見る',
  },
  de: {
    home: 'Start', markets: 'Märkte',
    portsLabel: 'Häfen und Routen', docsLabel: 'Dokumente und Zoll', linesLabel: 'Was sich in diesem Markt verkauft',
    faqLabel: 'Häufige Fragen', cta: 'Angebot anfordern', allMarkets: 'Alle Märkte',
    sub: 'Direkt ab Werk in Qingdao / Tianjin, ISO-9001- und SABS-konforme Linien.',
    h1: 'Verbindungselemente für {c}', seeAll: 'Alle {n} Produktlinien',
  },
  hi: {
    home: 'होम', markets: 'बाज़ार',
    portsLabel: 'बंदरगाह और मार्ग', docsLabel: 'दस्तावेज़ और क्लीयरेंस', linesLabel: 'इस बाज़ार में क्या बिकता है',
    faqLabel: 'सामान्य प्रश्न', cta: 'कोटेशन मांगें', allMarkets: 'सभी बाज़ार',
    sub: 'किंगदाओ / तियानजिन से सीधे फ़ैक्टरी, ISO 9001 और SABS अनुरूप लाइनें।',
    h1: '{c} के लिए फ़ासनर', seeAll: 'सभी {n} उत्पाद लाइन देखें',
  },
}

export default async function MarketPage({ params }: { params: Promise<{ locale: string; market: string }> }) {
  const { locale: lp, market } = await params
  const locale = (lp as Locale) || 'en'
  const c = copy[locale] || copy.en
  const m = getMarket(market)
  if (!m || EXCLUDED.includes(market)) notFound()

  const country = m.name[locale] || m.name.en
  const items = m.topSlugs.map(s => allProducts.find(p => p.slug === s)).filter((p): p is (typeof allProducts)[number] => Boolean(p))
  const text = marketText(m.slug, locale)!
  const hero = text.hero
  const ports = text.ports
  const docs = text.docs
  const lines = text.lines
  const faqs = text.faq

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale === 'zh' ? 'zh-CN' : locale,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.home, item: `https://www.tradego-fasteners.com/${locale}/` },
      { '@type': 'ListItem', position: 2, name: c.markets, item: `https://www.tradego-fasteners.com/${locale}/markets/` },
      { '@type': 'ListItem', position: 3, name: country, item: `https://www.tradego-fasteners.com/${locale}/markets/${m.slug}/` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href={`/${locale}/`} className="hover:text-primary-700">{c.home}</Link>
          <span>/</span>
          <Link href={`/${locale}/markets/`} className="hover:text-primary-700">{c.markets}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{country}</span>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {c.h1.replace('{c}', country)}
          </h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed mb-3">{hero}</p>
          <p className="text-primary-200 text-sm mb-6">{c.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/contact/`} className="inline-flex items-center rounded-lg bg-white text-primary-800 font-semibold px-5 py-3 hover:bg-primary-50 transition">{c.cta}</Link>
            <Link href={`/${locale}/products/`} className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 hover:bg-white/10 transition">
              {c.seeAll.replace('{n}', String(allProducts.length))}
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{c.portsLabel}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{ports}</p>
          </section>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{c.docsLabel}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{docs}</p>
          </section>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{c.linesLabel}</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-3xl">{lines}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map(p => {
              const name = pick(productNames[p.slug], locale)
              return (
                <Link key={p.slug} href={`/${locale}/products/${p.slug}/`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="relative h-28 bg-gray-100">
                    <Image src={p.image} alt={name} fill sizes="(max-width:768px) 50vw, 16vw" className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs md:text-sm font-semibold text-primary-900 group-hover:text-primary-700 line-clamp-2">{name}</h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.faqLabel}</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer font-medium text-gray-900">{q}</summary>
                <p className="mt-2 text-gray-600 leading-relaxed text-sm md:text-[15px]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <Link href={`/${locale}/markets/`} className="text-sm font-medium text-primary-700 hover:underline">← {c.allMarkets}</Link>
        </section>
      </div>
    </div>
  )
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
// 2026-11-25: content/ 已从函数包剔除(体积治理), 运行时不能再读磁盘 JSON。
export const dynamicParams = false
