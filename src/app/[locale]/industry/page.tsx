import { type Locale, t, locales } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles, getArticleTitle } from '@/lib/articles'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { optImagePath } from '@/lib/optImages'
import { industryListCopy, allCategoriesLabel, pick } from '@/lib/uiCopy'
import { categoryLabel, categorySlug } from '@/lib/categoryLabels'
import { navLabels } from '@/lib/uiCopy'

const titles: Record<string, string> = {
  en: 'Fastener Guides: Grades, Ports and China Sourcing',
  zh: '紧固件指南：进口清关、等级与采购',
  es: 'Guías de fijaciones: importación, grados y compras',
  fr: 'Guides de fixations : importation, classes et achats',
  pt: 'Guias de fixadores: importação, classes e compras',
  ar: 'أدلة المثبتات: الاستيراد والدرجات والتوريد',
  ru: 'Гид по крепежу: импорт, классы прочности и закупки',
  ja: '締結部品ガイド：輸入・強度区分・調達',
  de: 'Verbindungselemente-Ratgeber: Import, Festigkeitsklassen, Beschaffung',
  hi: 'फास्टनर गाइड: आयात, ग्रेड और खरीद',
}

const descriptions: Record<string, string> = {
  en: 'Bolt grades, coatings, port clearance documents and China-to-Africa sourcing — from a manufacturer producing to SABS 1195 and DIN/ISO, quoting at mill level.',
  zh: '螺栓等级、表面处理、非洲港口清关与中国采购的实操指南。按 SABS 1195 / DIN / ISO 规格生产供应商，含落地成本与单证清单。',
  es: 'Guías prácticas sobre grados de pernos, recubrimientos, despacho portuario y compra de fijaciones de China a África. Fabricante que produce según SABS 1195 / DIN / ISO, cotiza a nivel de fábrica.',
  fr: 'Guides pratiques sur les classes de boulons, les revêtements, le dédouanement portuaire et l’achat de fixations de la Chine vers l’Afrique. Fournisseur produisant selon SABS 1195 / DIN / ISO.',
  pt: 'Guias práticos sobre classes de parafusos, revestimentos, desembaraço portuário e compra de fixadores da China para a África. Fabricante que produz segundo SABS 1195 / DIN / ISO, cotação em nível de fábrica.',
  ar: 'أدلة عملية حول درجات البراغي والطلاءات والتخليص الجمركي في الموانئ وشراء المثبتات من الصين إلى أفريقيا. مورّد ينتج وفق SABS 1195 / DIN / ISO.',
  ru: 'Практические руководства по классам прочности болтов, покрытиям, таможенному оформлению в портах и закупке крепежа из Китая в Африку. Производство по SABS 1195 / DIN / ISO, котировка на уровне завода.',
  ja: 'ボルトの強度区分、表面処理、港での通関、中国からアフリカへの締結部品調達の実務ガイド。SABS 1195 / DIN / ISO 規格で製造する工場。',
  de: 'Praxisratgeber zu Festigkeitsklassen, Beschichtungen, Hafenabfertigung und Beschaffung von Verbindungselementen aus China nach Afrika. Lieferant, der nach SABS 1195 / DIN / ISO fertigt.',
  hi: 'बोल्ट ग्रेड, कोटिंग, बंदरगाह क्लीयरेंस और चीन से अफ्रीका तक फास्टनर खरीद पर व्यावहारिक गाइड। SABS 1195 / DIN / ISO मानक पर उत्पादन आपूर्तिकर्ता।',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${siteUrl}/${locale}/industry/`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/industry/`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/en/industry/`],
        ...locales.map(l => [l, `${siteUrl}/${l}/industry/`]),
      ]),
    },
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const articles = getAllArticles()
    .slice()
    .sort((a, b) => {
      const da = a.date || a.updated || ''
      const db = b.date || b.updated || ''
      return db.localeCompare(da)
    })

  const PREVIEW_COUNT = 24
  const previewArticles = articles.slice(0, PREVIEW_COUNT)
  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))]
  const categoryCounts = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})

  // 2026-07-16: 分类按钮改 Link 指向 category 静态页 (SEO 友好, 预渲染)
  const slugify = categorySlug

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(locale, 'industry.title')}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">{t(locale, 'industry.subtitle')}</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category tabs - 2026-07-16 改 Link 到 /industry/category/[slug]/ 静态页 */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              key="All"
              href={`/${locale}/industry/`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-primary-700 text-white"
            >
              {pick(allCategoriesLabel, locale)}
            </Link>
            {categories.filter(c => c !== 'All').map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/industry/category/${slugify(cat)}/`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              >
                {categoryLabel(cat, locale)}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {previewArticles.map((article) => {
              const title = article.title[locale] || article.title.en
              const excerpt = article.description[locale] || article.description.en
              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/industry/${article.slug}/`} prefetch={false}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={optImagePath(article.image, 'thumb')} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" />
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{categoryLabel(article.category, locale)}</span>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>{t(locale, 'industry.publishedOn')} {article.date}</span>
                      <span>·</span>
                      <span>{article.readTime} min</span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-base md:text-lg mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mt-auto">
                      {excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                      {t(locale, 'industry.readMore')} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 全量文章通过分类页可达，避免聚合页承载 266 篇 HTML */}
          <div className="mt-12 bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {pick(industryListCopy.browse, locale)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c !== 'All').map((cat) => (
                <Link
                  key={`all-${cat}`}
                  href={`/${locale}/industry/category/${slugify(cat)}/`}
                  className="px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-700 border border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors"
                >
                  {categoryLabel(cat, locale)} <span className="text-gray-400">({categoryCounts[cat]})</span>
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {pick(industryListCopy.count, locale)(articles.length, previewArticles.length)}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Schema for SEO - Round 13 */}
      {/* GEO：文章聚合页给出 CollectionPage + ItemList，AI 引擎可直接读到本语种文章图谱 */}
      <script
        id="collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: titles[locale] || titles.en,
            description: descriptions[locale] || descriptions.en,
            inLanguage: locale === 'zh' ? 'zh-CN' : locale,
            url: `https://www.tradego-fasteners.com/${locale}/industry/`,
            isPartOf: { '@type': 'WebSite', '@id': 'https://www.tradego-fasteners.com/#website' },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: previewArticles.length,
              itemListElement: previewArticles.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://www.tradego-fasteners.com/${locale}/industry/${a.slug}/`,
                name: getArticleTitle(a, locale),
              })),
            },
          }),
        }}
      />

      <BreadcrumbSchema locale={locale} pageName={pick(navLabels.industry, locale)} pageUrl="/industry" />
    </div>
  )
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
