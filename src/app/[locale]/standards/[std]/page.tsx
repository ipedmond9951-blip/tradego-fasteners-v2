import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, pick } from '@/lib/productI18n'
import { standardEntries, getStd, stdNote } from '@/lib/standards'
import { categoryOf } from '@/lib/productCategories'

const SITE_URL = 'https://www.tradego-fasteners.com'

export function generateStaticParams() {
  return locales.flatMap(locale => standardEntries.map(e => ({ locale, std: e.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; std: string }> }): Promise<Metadata> {
  const { locale: lp, std } = await params
  const locale = (lp as Locale) || 'en'
  const entry = getStd(std)
  if (!entry) return { title: 'Standard Not Found | TradeGo Fasteners', robots: { index: false } }

  const note = stdNote(entry.code, locale)
  const title = `${entry.code} ${locale === 'zh' ? '紧固件' : 'Fasteners'} — ${locale === 'zh' ? '批发供应' : 'Wholesale Supplier'} | TradeGo`
  const description = locale === 'zh'
    ? `${entry.code}（${note}）批发供应，${entry.products.length} 个在售品类，ISO 9001 工厂，FOB 青岛/天津，海运至贝拉、德班。`
    : `${entry.code} (${note}) supplied wholesale — ${entry.products.length} product lines, ISO 9001 factory, FOB Qingdao/Tianjin, sea freight to Beira and Durban.`
  const canonical = `${SITE_URL}/${locale}/standards/${std}/`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/standards/${std}/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/standards/${std}/`]),
      ]),
    },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

const copy = {
  en: {
    home: 'Home',
    standards: 'Standards',
    intro: (code: string, note: string, n: number) =>
      `${code} covers ${note.toLowerCase()}. We produce the ${n} line${n > 1 ? 's' : ''} below against this standard and quote on the clause you specify — send the standard number, size and quantity and we confirm tolerance, material and test report before production.`,
    lines: 'Product lines under this standard',
    why: 'Why order against a standard number',
    points: [
      ['No ambiguity on dimensions', 'The standard fixes thread, head and tolerance, so what arrives matches what your engineer drew — not a near-equivalent.'],
      ['Test reports line up', 'Mill certificates and dimensional reports are issued against the same clause, which keeps customs, QA and site inspection on one page.'],
      ['Easier substitution later', 'A standard number lets you re-order from any qualified mill without re-specifying the whole drawing set.'],
    ],
    faq: 'FAQ',
    faqs: (code: string) => [
      [`Can you produce to ${code} exactly?`, `Yes — we quote and produce against the clause you name, and state on the quotation which clause and which test reports apply.`],
      [`What do you need to quote ${code} parts?`, 'Size, standard/clause, material and finish, quantity per size and destination port. With those we return price, MOQ, packing and lead time the same working day.'],
      ['Do you supply test reports?', 'Mill certificates ship with the goods. Third-party pre-shipment inspection (SGS, BV or your agent) can be arranged if requested at order stage.'],
    ],
    related: 'Other standards on the same lines',
    cta: 'Request a quote',
    all: 'All products',
  },
  zh: {
    home: '首页',
    standards: '标准',
    intro: (code: string, note: string, n: number) =>
      `${code} 涵盖${note}。下列 ${n} 个品类按该标准生产，按你指定的条款报盘 —— 提供标准号、规格与数量，我们在生产前确认公差、材质与检测报告。`,
    lines: '该标准下的在售品类',
    why: '按标准号下单的理由',
    points: [
      ['尺寸无歧义', '标准锁定螺纹、头型与公差，到货与工程图纸一致，不用近似规格替代。'],
      ['检测报告对得上', '材质书与尺寸报告按同一条款出具，清关、质检与现场验收口径统一。'],
      ['后续换厂更容易', '有标准号，换任何合格工厂复购都不必重新出整套图纸。'],
    ],
    faq: '常见问题',
    faqs: (code: string) => [
      [`能否严格按 ${code} 生产？`, '可以 —— 按你指定的条款报盘与生产，并在报价单上注明适用条款与检测报告。'],
      [`按 ${code} 询价需要提供什么？`, '规格尺寸、标准/条款、材质与镀层、每个规格数量、目的港。五项齐全当天可回价格、MOQ、包装与交期。'],
      ['是否提供检测报告？', '材质书随货。出厂前第三方验货（SGS、BV 或客户指定机构）可在订单阶段提出安排。'],
    ],
    related: '同一批产品的其他标准',
    cta: '索取报价',
    all: '全部产品',
  },
} as const

export default async function StandardPage({ params }: { params: Promise<{ locale: string; std: string }> }) {
  const { locale: lp, std } = await params
  const locale = (lp as Locale) || 'en'
  const entry = getStd(std)
  if (!entry) notFound()

  const c = locale === 'zh' ? copy.zh : copy.en
  const note = stdNote(entry.code, locale)
  const items = entry.products.map(s => allProducts.find(p => p.slug === s)).filter((p): p is (typeof allProducts)[number] => Boolean(p))

  // 同批产品的其他标准，最多 6 个，构成标准之间的内链网
  const otherCodes = [...new Set(items.flatMap(p => parseOther(p.specs.standard || '', entry.code)))].slice(0, 6)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs(entry.code).map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href={`/${locale}/`} className="hover:text-primary-700">{c.home}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{entry.code}</span>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-primary-200 text-sm mb-2">{c.standards}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{entry.code} — {note}</h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed mb-6">{c.intro(entry.code, note, entry.products.length)}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/contact/`} className="inline-flex items-center rounded-lg bg-white text-primary-800 font-semibold px-5 py-3 hover:bg-primary-50 transition">{c.cta}</Link>
            <Link href={`/${locale}/products/`} className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 hover:bg-white/10 transition">{c.all}</Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">{c.lines} <span className="text-sm font-normal text-gray-400">{items.length}</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map(p => {
              const name = pick(productNames[p.slug], locale)
              const cat = categoryOf(p.slug)
              return (
                <Link key={p.slug} href={`/${locale}/products/${p.slug}/`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="relative h-32 md:h-36 bg-gray-100">
                    <Image src={p.image} alt={name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base text-primary-900 group-hover:text-primary-700 line-clamp-2">{name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{p.specs.size}</p>
                    {cat && <p className="text-[11px] text-gray-400 mt-1">{cat.label[locale] || cat.label.en}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.why}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {c.points.map(([h, t]) => (
              <div key={h}>
                <h3 className="font-semibold text-primary-900 mb-1">{h}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.faq}</h2>
          <div className="divide-y divide-gray-100">
            {c.faqs(entry.code).map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer font-medium text-gray-900">{q}</summary>
                <p className="mt-2 text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {otherCodes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{c.related}</h2>
            <div className="flex flex-wrap gap-2">
              {otherCodes.map(code => (
                <Link key={code} href={`/${locale}/standards/${stdSlugOf(code)}/`} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs md:text-sm text-gray-700 hover:border-primary-600 hover:text-primary-700">
                  {code}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// 本页工具：取同产品其他标准（排除当前）与 slug 化
function parseOther(standard: string, current: string): string[] {
  const RE = /(DIN|ISO|ANSI\/ASME|ANSI|ASTM|SABS|EN|GB\/T|GB|JIS|BS|UNI|LS|JC\/T)\s*([A-Z]?\d[\w.\-]*)/g
  const out: string[] = []
  for (const m of standard.matchAll(RE)) {
    for (const n of m[2].split('/')) {
      const code = `${m[1]} ${n.trim()}`
      if (code !== current) out.push(code)
    }
  }
  return out
}

function stdSlugOf(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
