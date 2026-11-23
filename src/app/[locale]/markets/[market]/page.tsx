import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, pick } from '@/lib/productI18n'
import { markets, getMarket } from '@/lib/markets'

const SITE_URL = 'https://www.tradego-fasteners.com'

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
  const title = locale === 'zh'
    ? `出口${country}的紧固件批发｜螺栓螺母屋面钉 | TradeGo`
    : `Fastener Wholesale for ${country} | Bolts, Nails, Anchors | TradeGo`
  const description = locale === 'zh'
    ? `${country}市场紧固件批发：结构螺栓、屋面钉、锚栓、螺丝与防水材料，ISO 9001 工厂，FOB/CIF 报价，含港口与单证说明。`
    : `Wholesale fasteners for ${country}: structural bolts, roofing nails, anchors, screws and waterproofing. ISO 9001 factory, FOB/CIF quotes with port and document guidance.`
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

const copy = {
  en: {
    home: 'Home', markets: 'Markets',
    portsLabel: 'Ports and routing', docsLabel: 'Documents and clearance', linesLabel: 'What sells in this market',
    faqLabel: 'FAQ', cta: 'Request a quote', allMarkets: 'All markets',
    sub: 'Factory direct from Qingdao / Tianjin, ISO 9001 and SABS-compliant lines available.',
  },
  zh: {
    home: '首页', markets: '市场',
    portsLabel: '港口与航线', docsLabel: '单证与清关', linesLabel: '这个市场主要买什么',
    faqLabel: '常见问题', cta: '索取报价', allMarkets: '全部市场',
    sub: '青岛/天津工厂直供，可提供 ISO 9001 与符合 SABS 的品类。',
  },
} as const

export default async function MarketPage({ params }: { params: Promise<{ locale: string; market: string }> }) {
  const { locale: lp, market } = await params
  const locale = (lp as Locale) || 'en'
  const zh = locale === 'zh'
  const c = zh ? copy.zh : copy.en
  const m = getMarket(market)
  if (!m || EXCLUDED.includes(market)) notFound()

  const country = m.name[locale] || m.name.en
  const items = m.topSlugs.map(s => allProducts.find(p => p.slug === s)).filter((p): p is (typeof allProducts)[number] => Boolean(p))
  const faqs = m.faq[locale] || m.faq.en

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
            {zh ? `${country}紧固件批发供应` : `Fasteners for ${country}`}
          </h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed mb-3">{m.hero[locale] || m.hero.en}</p>
          <p className="text-primary-200 text-sm mb-6">{c.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/contact/`} className="inline-flex items-center rounded-lg bg-white text-primary-800 font-semibold px-5 py-3 hover:bg-primary-50 transition">{c.cta}</Link>
            <Link href={`/${locale}/products/`} className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 hover:bg-white/10 transition">
              {zh ? '查看全部 59 个品类' : 'See all 59 product lines'}
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{c.portsLabel}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{m.ports[locale] || m.ports.en}</p>
          </section>
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{c.docsLabel}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{m.docs[locale] || m.docs.en}</p>
          </section>
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{c.linesLabel}</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-3xl">{m.lines[locale] || m.lines.en}</p>
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
