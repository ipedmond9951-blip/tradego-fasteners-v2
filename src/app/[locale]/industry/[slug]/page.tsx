import { Metadata } from 'next'
import { permanentRedirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSlugs, getArticleBySlug, getRelatedByCategory, getArticleTitle, humanizeSlug, isThinArticle } from '@/lib/articles'
import { type Locale, t, locales } from '@/i18n'
import type { ArticleSection } from '@/lib/articles'
import ShareButtons from '@/components/ShareButtons'
import { clampDescription } from '@/lib/seo'
import { optImagePath } from '@/lib/optImages'
import { backToArticles, pick } from '@/lib/uiCopy'

const SITE_URL = 'https://www.tradego-fasteners.com'

export async function generateStaticParams() {
  // Exclude redirect articles (articles with redirectTo field) from static generation
  const allSlugs = getAllSlugs()
  const redirectSlugs = new Set(
    allSlugs.filter(slug => {
      const article = getArticleBySlug(slug)
      return article?.redirectTo
    })
  )
  return allSlugs
    .filter(slug => !redirectSlugs.has(slug))
    .map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = (localeParam as Locale) || 'en'
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found', robots: { index: false, follow: true } }

  // Old article slug redirected to new URL - don't index
  if (article.redirectTo) {
    return {
      title: 'Page Moved | TradeGo Fasteners',
      robots: { index: false },
    }
  }

  const rawTitle = (article.title as Record<string, string>)[locale] || (article.title as Record<string, string>).en
  // Truncate title to 50-60 chars for SERP; add brand suffix only if room
  const title = rawTitle.length > 55 ? rawTitle.slice(0, 55).replace(/\s+\S*$/, '') + '...' : rawTitle
  // 优先本语种原生文案：metaDescription[locale] → description[locale] → 英文兜底，
  // 避免非英语页拿到英文 meta（2026-11-23 修）
  const rawDesc = article.metaDescription?.[locale] || article.description?.[locale] || article.metaDescription?.en || article.description?.en
  // Clamp to SERP length but never cut mid-sentence
  const desc = clampDescription(rawDesc)
  const fullTitle = `${rawTitle} | TradeGo Fasteners`

  return {
    title,
    description: desc,
    keywords: article.keywords,
    ...(isThinArticle(article) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description: rawDesc,
      url: `${SITE_URL}/${locale}/industry/${slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: ['TradeGo Fasteners'],
      images: [{ url: `${SITE_URL}${article.image}`, width: 1200, height: 630, alt: rawTitle }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/industry/${slug}`,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/industry/${slug}`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/industry/${slug}`])
      ]),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: rawDesc,
      images: [`${SITE_URL}${article.image}`],
    },
  }
}

// 历史文章里有约 480 处占位段落 (如 "<p>Content coming soon.</p>", 常跟在
// "Related resources: ..." 之类的真实尾巴后面), 直接渲染会出现"内容即将上线"式空话,
// 对 SEO 和信任度都是负分。这里把开头的占位句剥掉, 只剩空壳时视为缺失并回退 en。
const PLACEHOLDER_LEAD = new RegExp(
  '^(?:<p>)?\\s*(?:content coming soon|coming soon|see frequently asked questions below|内容即将上线|敬请期待)[.。]?\\s*(?:</p>)?\\s*',
  'i'
)

function stripPlaceholder(value: string | undefined): string {
  if (!value) return ''
  return value.replace(PLACEHOLDER_LEAD, '').trim()
}

function localizedText(obj: Record<string, string> | undefined, locale: string): string {
  if (!obj) return ''
  const ordered = [obj[locale], obj['en'], ...Object.values(obj)]
  for (const candidate of ordered) {
    const cleaned = stripPlaceholder(candidate)
    if (cleaned) return cleaned
  }
  return ''
}

function renderSection(section: ArticleSection, locale: string) {
  // 2026-11-22 FIX: 文章的 table 字段有两种历史写法 —— 扁平的 {headers, rows},
  // 以及按语言分组的 {en:{headers,rows}, zh:{...}, ...}(lobito 那篇就是后者)。
  // 后者会让 section.table.headers 变成 undefined, 直接打断 /[locale]/industry/[slug] 的预渲染。
  // 这里统一归一化: 扁平直接用, 分组则按当前语言取, 都没有就回退 en。
  const rawTable = section.table as
    | ({ headers: string[]; rows: string[][] } & Record<string, { headers: string[]; rows: string[][] }>)
    | null
    | undefined
  const table = rawTable
    ? (Array.isArray(rawTable.headers) ? rawTable : (rawTable[locale] || rawTable.en || Object.values(rawTable)[0]))
    : null

  return (
    <section key={section.id} className="mb-8" id={section.id}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{localizedText(section.heading, locale)}</h2>
      {section.body && (
        <p className="text-gray-700 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: localizedText(section.body, locale) }} />
      )}
      {table && Array.isArray(table.headers) && Array.isArray(table.rows) && (
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-primary-50">
              <tr>
                {table.headers.map((h: string, i: number) => (
                  <th key={i} className="border border-gray-300 p-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row: string[], i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="border border-gray-300 p-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.faqItems && (
        <div className="space-y-4">
          {section.faqItems.map((item, i) => (
            <details key={i} className="bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold text-gray-900 cursor-pointer">{localizedText(item.q, locale)}</summary>
              <p className="mt-2 text-gray-700">{localizedText(item.a, locale)}</p>
            </details>
          ))}
        </div>
      )}
    </section>
  )
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = (localeParam as Locale) || 'en'
  const article = getArticleBySlug(slug)

  // 未知 slug 必须返回真 404, 避免软 404 被收录
  if (!article) notFound()

  // Old article slug redirected to new URL
  if (article.redirectTo) {
    permanentRedirect(`/${locale}/industry/${article.redirectTo}`)
  }

  const title = localizedText(article.title, locale)
  const desc = localizedText(article.description, locale)
  const ctaText = localizedText(article.cta?.text, locale)
  const ctaBtn = localizedText(article.cta?.buttonText, locale)

  // JSON-LD FAQ Schema
  const faqItems = article.sections
    .filter(s => s.faqItems)
    .flatMap(s => s.faqItems!)
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: localizedText(item.q, locale),
      acceptedAnswer: {
        '@type': 'Answer',
        text: localizedText(item.a, locale),
      },
    })),
  } : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    datePublished: article.date,
    image: `https://www.tradego-fasteners.com${article.image}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.tradego-fasteners.com/${locale}/industry/${slug}/`,
    },
    author: { '@type': 'Organization', name: 'TradeGo Fasteners' },
    publisher: {
      '@type': 'Organization',
      name: 'TradeGo Fasteners',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tradego-fasteners.com/images/logo.png',
        width: 512,
        height: 512,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-800 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={optImagePath(article.image, 'hero')} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px" priority quality={80} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl">
          <Link href={`/${locale}/industry/`} className="inline-flex items-center gap-1 text-primary-200 hover:text-white text-sm mb-6 transition-colors">
            ← {pick(backToArticles, locale)}
          </Link>
          <span className="inline-block bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{article.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-primary-200">
            <span>{article.date}</span>
            <span>· ~{isThinArticle(article) ? 1 : article.readTime} min read</span>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">{desc}</p>
        
        {/* Social Share Buttons */}
        <ShareButtons 
          url={`${SITE_URL}/${locale}/industry/${slug}`}
          title={title}
          description={desc}
        />
        
        {article.sections.map(section => renderSection(section, locale))}

        {/* CTA */}
        <div className="mt-12 bg-primary-50 rounded-xl p-6 md:p-8 text-center">
          <p className="text-lg font-medium text-gray-900 mb-4">{ctaText}</p>
          <Link href={`/${locale}${article.cta?.link || '/contact'}/`} className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            {ctaBtn}
          </Link>
        </div>

        {/* Related Products */}
        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">{t(locale, 'industry.relatedProducts')}</h3>
            <div className="flex gap-3 flex-wrap">
              {article.relatedProducts.map((p, i: number) => {
                const slug = typeof p === 'string' ? p : p.slug
                const label = typeof p === 'string' ? p : (p.title || p.slug)
                const display = humanizeSlug(label)
                return (
                  <Link key={typeof p === 'string' ? p : `${slug}-${i}`} href={`/${locale}/products/`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors">
                    {display}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Related Articles — hardcoded from article.relatedArticles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">{t(locale, 'industry.relatedArticles')}</h3>
            <div className="flex gap-3 flex-wrap">
              {article.relatedArticles.map((a, i: number) => {
                const slug = typeof a === 'string' ? a : a.slug
                // Try to resolve to actual title; fall back to humanized slug
                const linked = getArticleBySlug(slug)
                const display = linked
                  ? getArticleTitle(linked, locale)
                  : humanizeSlug(typeof a === 'string' ? a : (a.title || a.slug))
                const truncated = display.length > 60 ? display.substring(0, 60) + '…' : display
                return (
                  <Link key={`${slug}-${i}`} href={`/${locale}/industry/${slug}/`} className="px-4 py-2 bg-blue-50 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                    {truncated}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* More in this Category — auto-recommendation fallback */}
        {(() => {
          const hardcodedSlugs = new Set(
            (article.relatedArticles || []).map((a) => typeof a === 'string' ? a : a.slug)
          )
          const moreInCat = getRelatedByCategory(article.category, article.slug, 4)
            .filter(a => !hardcodedSlugs.has(a.slug))
          if (moreInCat.length === 0) return null
          return (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">
                {t(locale, 'industry.inThisCategory').replace('{category}', article.category)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moreInCat.map((a) => {
                  const aTitle = getArticleTitle(a, locale)
                  const truncated = aTitle.length > 70 ? aTitle.substring(0, 70) + '…' : aTitle
                  return (
                    <Link
                      key={a.slug}
                      href={`/${locale}/industry/${a.slug}/`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="text-sm text-primary-600 font-medium mb-1">{a.category}</div>
                      <div className="text-gray-900 font-medium">{truncated}</div>
                      <div className="text-xs text-gray-500 mt-1">{a.date}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </article>

      {/* Schema */}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </div>
  )
}
