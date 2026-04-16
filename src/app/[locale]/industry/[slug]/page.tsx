import { type Locale, t } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'

const articles = [
  {
    slug: 'global-fastener-market-2026',
    title: { en: 'Global Fastener Market Outlook 2026: Trends & Opportunities', zh: '2026全球紧固件市场展望：趋势与机遇' },
    excerpt: { en: 'The global fastener market is projected to reach $95B by 2026.', zh: '预计到2026年全球紧固件市场规模将达到950亿美元。' },
    category: 'Market Analysis',
    date: '2026-04-15',
    image: '/images/scenarios/factory-environment.jpg',
  },
  {
    slug: 'self-drilling-screws-guide',
    title: { en: 'Complete Guide to Self-Drilling Screws', zh: '自钻螺丝完全指南' },
    excerpt: { en: 'Learn how to select the right self-drilling screw for your project.', zh: '了解如何为您的项目选择合适的自钻螺丝。' },
    category: 'Technical Guide',
    date: '2026-04-10',
    image: '/images/products/self-drilling-screws-1.jpg',
  },
]

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = (localeParam as Locale) || 'en'
  const article = articles.find(a => a.slug === slug) || articles[0]
  const title = (article.title as Record<string, string>)[locale] || article.title.en

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={article.image} alt="" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl">
          <Link href={`/${locale}/industry`} className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            &larr; {t(locale, 'industry.backToList')}
          </Link>
          <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{article.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-blue-200">
            <span>{t(locale, 'industry.publishedOn')} {article.date}</span>
            <span>&middot; ~5 min read</span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-8">
          {(article.excerpt as Record<string, string>)[locale] || article.excerpt.en}
        </p>

        {/* Placeholder article body */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Key Insights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This article provides in-depth analysis of current market trends, technical specifications, and practical guidance for procurement professionals.
          </p>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Market Data</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Global market projected to reach $95B by 2026</li>
            <li>Asia-Pacific region leads with 48% market share</li>
            <li>CAGR of 5.2% driven by infrastructure investment</li>
            <li>Rising demand in emerging markets (Africa, SE Asia)</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Recommendations</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
            <li>Diversify supplier base across regions</li>
            <li>Prioritize ISO-certified manufacturers</li>
            <li>Negotiate flexible MOQ terms for new partnerships</li>
            <li>Consider total cost of ownership beyond unit price</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 md:p-8 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Need fasteners for your project?</h3>
          <p className="text-gray-600 mb-4 text-sm">Get a free quote within 24 hours. MOQ as low as 1 ton.</p>
          <a href={`/${locale}#inquiry`} className="inline-flex items-center bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            Get a Quote &rarr;
          </a>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.filter(a => a.slug !== slug).map((a) => (
              <Link key={a.slug} href={`/${locale}/industry/${a.slug}`} className="group flex gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                <img src={a.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">{a.category} &middot; {a.date}</p>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{(a.title as Record<string, string>)[locale] || a.title.en}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
