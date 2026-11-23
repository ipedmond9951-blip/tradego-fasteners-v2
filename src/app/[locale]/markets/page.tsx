import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale, locales } from '@/i18n'
import { markets } from '@/lib/markets'

const SITE_URL = 'https://www.tradego-fasteners.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const title = locale === 'zh'
    ? '出口市场与物流：津巴布韦、南非、赞比亚、肯尼亚等 | TradeGo'
    : 'Export Markets & Routes: Zimbabwe, South Africa, Zambia | TradeGo'
  const description = locale === 'zh'
    ? '按目的国看港口、清关单证与热销紧固件品类：津巴布韦、南非、赞比亚、莫桑比克、博茨瓦纳、肯尼亚、尼日利亚。'
    : 'Ports, clearance documents and the fastener lines that sell in each market: Zimbabwe, South Africa, Zambia, Mozambique, Botswana, Kenya and Nigeria.'
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/markets/`,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/markets/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/markets/`]),
      ]),
    },
  }
}

export default async function MarketsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const zh = locale === 'zh'

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{zh ? '出口市场与物流' : 'Export markets and routes'}</h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed">
            {zh
              ? '每个市场页写清港口与内陆段、清关单证、当地常用标准，以及这个市场真正下单的品类。先选国家，再看货。'
              : 'Each market page sets out the port and inland leg, the documents needed, the local standards buyers ask for, and the lines that actually move. Pick the country first, then the goods.'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {markets.map(m => {
          const country = m.name[locale] || m.name.en
          const href = m.slug === 'zimbabwe' ? `/${locale}/zimbabwe-fasteners-wholesale/` : `/${locale}/markets/${m.slug}/`
          return (
            <Link key={m.slug} href={href} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-500 hover:shadow-md transition">
              <h2 className="text-lg font-bold text-primary-900 group-hover:text-primary-700 mb-2">{country}</h2>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{m.hero[locale] || m.hero.en}</p>
              <p className="text-xs text-primary-700 font-medium mt-3">{zh ? '查看港口与单证 →' : 'Ports and documents →'}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
