import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, productDescriptions, uiLabels, specLabels, pick } from '@/lib/productI18n'
import { clampDescription } from '@/lib/seo'
import { getArticleBySlug, getArticleTitle } from '@/lib/articles'
import { productGuides } from '@/lib/productGuides'
import { siblingsOf, categoryOf } from '@/lib/productCategories'
import ProductBuyingNotes from '@/components/ProductBuyingNotes'
import { productAsideCopy } from '@/lib/uiCopy'

const SITE_URL = 'https://www.tradego-fasteners.com'

export function generateStaticParams() {
  return allProducts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = (localeParam as Locale) || 'en'
  const product = allProducts.find(p => p.slug === slug)
  if (!product) return { title: 'Product Not Found | TradeGo Fasteners', robots: { index: false } }

  const name = pick(productNames[slug], locale)
  const descSource = productDescriptions[slug]?.[locale] || productDescriptions[slug]?.en || ''
  const description = clampDescription(descSource)
  const title = `${name} — Wholesale Supplier | TradeGo Fasteners`
  const canonical = `${SITE_URL}/${locale}/products/${slug}/`

  return {
    title,
    description,
    keywords: [name, `${name} wholesale`, `${name} supplier China`, 'fastener manufacturer', 'Africa fastener supplier'],
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/products/${slug}/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/products/${slug}/`]),
      ]),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: `${SITE_URL}${product.image}`, width: 1200, height: 900, alt: name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}${product.image}`] },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = (localeParam as Locale) || 'en'
  const product = allProducts.find(p => p.slug === slug)
  // 未知产品 slug 返回真 404
  if (!product) notFound()

  const name = pick(productNames[slug], locale)
  const desc = productDescriptions[slug]?.[locale] || productDescriptions[slug]?.en || ''
  const label = (key: string) => pick(uiLabels[key], locale)
  const specLabelText = (key: string) => pick(specLabels[key], locale)

  // 同族推荐：同分类优先，取 6 个；并给出去往所属品类分区的锚点
  const related = siblingsOf(slug, 6)
    .map(s => allProducts.find(p => p.slug === s))
    .filter((p): p is (typeof allProducts)[number] => Boolean(p))
  const category = categoryOf(slug)
  const specs = Object.entries(product.specs)
  const moq = product.specs.minOrder || (product.slug === 'ibr-nails' || product.slug === 'drywall-screws' ? '100 kg' : '500 pcs')
  const guide = productGuides[slug]
  const guideArticle = guide ? getArticleBySlug(guide) : null
  const guideTitle = guideArticle ? getArticleTitle(guideArticle, locale) : ''
  const canonical = `${SITE_URL}/${locale}/products/${slug}/`
  const inLanguage = locale === 'zh' ? 'zh-CN' : locale

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    image: [`${SITE_URL}${product.image}`],
    sku: `TG-${slug.toUpperCase()}`,
    brand: { '@type': 'Brand', name: 'TradeGo Fasteners' },
    material: product.specs.material,
    category: name,
    url: canonical,
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'TradeGo Fasteners', url: SITE_URL },
    },
    additionalProperty: specs.map(([k, v]) => ({
      '@type': 'PropertyValue',
      name: specLabelText(k) || k,
      value: v,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/${locale}/products/` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage,
    mainEntity: product.faq.map(q => {
      const idx = q.indexOf('? ')
      const question = idx > 0 ? q.slice(0, idx + 1) : q
      const answer = idx > 0 ? q.slice(idx + 2) : ''
      return { '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer || question } }
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 面包屑 */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href={`/${locale}/`} className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/products/`} className="hover:text-primary-700">Products</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{name}</span>
        </div>
      </nav>

      {/* 头部 */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{name}</h1>
            <p className="text-primary-100 leading-relaxed mb-6">{desc}</p>
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <span className="bg-white/15 rounded-lg px-3 py-2">
                {label('moq')}: <strong className="text-white">{moq}</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact/`}
                className="inline-flex items-center rounded-lg bg-white text-primary-800 font-semibold px-5 py-3 hover:bg-primary-50 transition"
              >
                {label('quote')}
              </Link>
              <Link
                href={`/${locale}/products/`}
                className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 hover:bg-white/10 transition"
              >
                {label('allProducts')}
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/10">
            <Image
              src={product.image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* 规格 */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{label('specifications')}</h2>
            <dl className="grid sm:grid-cols-2 gap-4">
              {specs.map(([k, v]) => (
                <div key={k} className="border-l-2 border-primary-200 pl-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">{specLabelText(k) || k}</dt>
                  <dd className="text-gray-900 font-medium">{v}</dd>
                </div>
              ))}
              <div className="border-l-2 border-primary-200 pl-3">
                <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label('moq')}</dt>
                <dd className="text-gray-900 font-medium">{moq}</dd>
              </div>
            </dl>
          </section>

          {/* 特点 */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{label('features')}</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-gray-700">
                  <span className="mt-1 text-primary-600">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 应用 */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{label('applications')}</h2>
            <div className="flex flex-wrap gap-2">
              {product.applications.map(a => (
                <span key={a} className="rounded-full bg-primary-50 text-primary-800 text-sm px-3 py-1">{a}</span>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{label('faq')}</h2>
            <div className="divide-y divide-gray-100">
              {product.faq.map(q => {
                const idx = q.indexOf('? ')
                const question = idx > 0 ? q.slice(0, idx + 1) : q
                const answer = idx > 0 ? q.slice(idx + 2) : ''
                return (
                  <details key={q} className="py-3 group">
                    <summary className="cursor-pointer font-medium text-gray-900 marker:content-none">
                      {question}
                    </summary>
                    {answer && <p className="mt-2 text-gray-600 leading-relaxed">{answer}</p>}
                  </details>
                )
              })}
            </div>
          </section>

          {guide && guideTitle && (
            <section className="bg-primary-50 rounded-xl p-6 border border-primary-100">
              <h2 className="text-lg font-bold text-primary-900 mb-2">{label('guide')}</h2>
              <Link href={`/${locale}/industry/${guide}/`} className="text-primary-800 underline underline-offset-2">
                {guideTitle}
              </Link>
            </section>
          )}

          {/* 采购决策深化：标准、材质、包装装载、质检、单证、报价要素 */}
          <ProductBuyingNotes specs={product.specs} locale={locale} />
        </div>

        {/* 侧栏 */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{label('quote')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              ISO 9001 certified factory, FOB Qingdao / Tianjin. Sample orders and mixed containers accepted.
            </p>
            <Link
              href={`/${locale}/contact/`}
              className="block text-center rounded-lg bg-primary-700 text-white font-semibold px-4 py-3 hover:bg-primary-800 transition"
            >
              {label('quote')}
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{label('related')}</h2>
            <ul className="space-y-3">
              {related.map(r => (
                <li key={r.slug} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={r.image} alt={pick(productNames[r.slug], locale)} fill sizes="56px" className="object-cover" />
                  </div>
                  <Link
                    href={`/${locale}/products/${r.slug}/`}
                    className="text-sm font-medium text-gray-800 hover:text-primary-700"
                  >
                    {pick(productNames[r.slug], locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {category && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{pick(productAsideCopy.category, locale)}</h2>
              <Link
                href={`/${locale}/#cat-${category.key}`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 text-primary-800 text-sm font-medium px-3 py-2 hover:bg-primary-100 transition"
              >
                {category.label[locale] || category.label.en}
                <span className="text-primary-500">→</span>
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                {pick(productAsideCopy.hint, locale)}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
