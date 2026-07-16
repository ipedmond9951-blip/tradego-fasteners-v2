import { type Locale, t, locales } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles } from '@/lib/articles'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  const titles: Record<string, string> = {
    en: 'Fastener Selection Guide | TradeGo Fasteners',
    zh: '紧固件选择指南 | TradeGo',
  }
  const descriptions: Record<string, string> = {
    en: 'Expert guides on 304/316 stainless bolts, Grade 8.8/10.9/12.9 structural bolts, self-tapping screws, lock nuts. ISO 9001 + SABS. Africa market insights.',
    zh: '304/316不锈钢螺栓、8.8/10.9级结构螺栓、自攻螺丝选型指南。ISO 9001+SABS认证。非洲市场洞察。',
  }
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${siteUrl}/${locale}/industry`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/industry`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/${locale}/industry`],
        ...locales.map(l => [l, `${siteUrl}/${l}/industry`]),
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

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))]

  // 2026-07-16: 分类按钮改 Link 指向 category 静态页 (SEO 友好, 预渲染)
  const slugify = (cat: string) => cat.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')

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
              href={`/${locale}/industry`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-primary-700 text-white"
            >
              All
            </Link>
            {categories.filter(c => c !== 'All').map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/industry/category/${slugify(cat)}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {articles.map((article) => {
              const title = article.title[locale] || article.title.en
              const excerpt = article.description[locale] || article.description.en
              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/industry/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={article.image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{article.category}</span>
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
        </div>
      </section>

      {/* Breadcrumb Schema for SEO - Round 13 */}
      <BreadcrumbSchema locale={locale} pageName="Industry" pageUrl="/industry" />
    </div>
  )
}
