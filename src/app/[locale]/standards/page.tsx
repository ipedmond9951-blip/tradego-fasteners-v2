import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale, locales } from '@/i18n'
import { standardEntries, stdNote } from '@/lib/standards'

const SITE_URL = 'https://www.tradego-fasteners.com'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const title = locale === 'zh'
    ? '紧固件标准索引｜DIN / ISO / ASTM / SABS 全清单 | TradeGo'
    : 'Fastener Standard Index — DIN, ISO, ASTM, SABS | TradeGo'
  const description = locale === 'zh'
    ? `按标准号查紧固件：本站生产的 ${standardEntries.length} 个标准（DIN、ISO、ASTM、SABS、EN、GB/T）各自对应在售品类，可直接询价。`
    : `Look up fasteners by standard number: ${standardEntries.length} standards we produce to — DIN, ISO, ASTM, SABS, EN and GB/T — each mapped to the product lines we ship.`
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/standards/`,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/standards/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/standards/`]),
      ]),
    },
  }
}

const GROUPS = ['DIN', 'ISO', 'ASTM', 'SABS', 'EN', 'GB/T', 'GB', 'ANSI', 'JIS', 'JC/T', '其他']

export default async function StandardsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const zh = locale === 'zh'

  const groups = GROUPS.map(g => ({
    g,
    items: standardEntries.filter(e => (g === '其他'
      ? !GROUPS.slice(0, -1).some(p => e.code.startsWith(p))
      : e.code.startsWith(g))),
  })).filter(x => x.items.length > 0)

  const totalProducts = new Set(standardEntries.flatMap(e => e.products)).size

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{zh ? '紧固件标准索引' : 'Fastener standard index'}</h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed">
            {zh
              ? `按标准号检索：我们生产的 ${standardEntries.length} 个标准，覆盖 ${totalProducts} 个在售品类。点开任一标准，可看到对应产品、执行条款说明与询价所需资料。`
              : `${standardEntries.length} standards we produce to, covering ${totalProducts} product lines. Open any standard to see the lines that ship against it and what we need to quote.`}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-9">
        {groups.map(({ g, items }) => (
          <section key={g}>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {g === '其他' ? (zh ? '其他标准' : 'Other standards') : g}
              <span className="ml-2 text-sm font-normal text-gray-400">{items.length}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(e => (
                <Link
                  key={e.slug}
                  href={`/${locale}/standards/${e.slug}/`}
                  className="group bg-white border border-gray-200 rounded-lg p-3.5 hover:border-primary-500 hover:shadow-sm transition"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-primary-900 group-hover:text-primary-700">{e.code}</span>
                    <span className="text-xs text-gray-400">{e.products.length} {zh ? '个品类' : 'lines'}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{stdNote(e.code, locale)}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
