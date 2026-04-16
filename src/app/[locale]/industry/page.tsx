import { type Locale, t } from '@/i18n'
import Link from 'next/link'

// Static article data — in production this would come from CMS/MDX
const articles = [
  {
    slug: 'global-fastener-market-2026',
    title: { en: 'Global Fastener Market Outlook 2026: Trends & Opportunities', zh: '2026全球紧固件市场展望：趋势与机遇' },
    excerpt: { en: 'The global fastener market is projected to reach $95B by 2026. Key trends include lightweight materials, smart fasteners, and regional manufacturing shifts.', zh: '预计到2026年全球紧固件市场规模将达到950亿美元。主要趋势包括轻量化材料、智能紧固件和区域制造业转移。' },
    category: 'Market Analysis',
    date: '2026-04-15',
    image: '/images/scenarios/factory-environment.jpg',
    readTime: '5 min',
  },
  {
    slug: 'self-drilling-screws-guide',
    title: { en: 'Complete Guide to Self-Drilling Screws: Selection & Application', zh: '自钻螺丝完全指南：选型与应用' },
    excerpt: { en: 'Learn how to select the right self-drilling screw for your project. Covers drill point types, material compatibility, and installation best practices.', zh: '了解如何为您的项目选择合适的自钻螺丝。涵盖钻头类型、材料兼容性和安装最佳实践。' },
    category: 'Technical Guide',
    date: '2026-04-10',
    image: '/images/products/self-drilling-screws-1.jpg',
    readTime: '8 min',
  },
  {
    slug: 'africa-construction-boom',
    title: { en: 'Africa Construction Boom: Why Fastener Demand is Surging', zh: '非洲建筑热潮：为什么紧固件需求激增' },
    excerpt: { en: 'Infrastructure investment across Africa is driving unprecedented demand for quality fasteners. South Africa, Nigeria, and Kenya lead the growth.', zh: '非洲各地的基础设施投资正在推动对优质紧固件的前所未有需求。南非、尼日利亚和肯尼亚引领增长。' },
    category: 'Regional Focus',
    date: '2026-04-05',
    image: '/images/scenarios/warehouse-management.jpg',
    readTime: '6 min',
  },
  {
    slug: 'iso9001-quality-control',
    title: { en: 'How ISO 9001:2015 Ensures Consistent Fastener Quality', zh: 'ISO 9001:2015如何确保紧固件质量一致性' },
    excerpt: { en: 'Deep dive into our quality management system: from raw material inspection to final product testing. Every step documented and traceable.', zh: '深入我们的质量管理体系：从原材料检验到最终产品测试。每一步都有记录和可追溯性。' },
    category: 'Quality',
    date: '2026-03-28',
    image: '/images/scenarios/quality-control.jpg',
    readTime: '4 min',
  },
]

export default async function IndustryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(locale, 'industry.title')}</h1>
          <p className="text-blue-200 text-base md:text-lg max-w-2xl">{t(locale, 'industry.subtitle')}</p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div id="market"></div>
          <div className="flex flex-wrap gap-2 mb-8" id="geo">
            {['All', 'Market Analysis', 'Technical Guide', 'Regional Focus', 'Quality'].map((cat) => (
              <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === 'All' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/${locale}/industry/${article.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row"
              >
                {/* Image */}
                <div className="relative w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={article.image} alt={(article.title as Record<string, string>)[locale] || article.title.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{article.category}</span>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span>{t(locale, 'industry.publishedOn')} {article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base md:text-lg mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {(article.title as Record<string, string>)[locale] || article.title.en}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mt-auto">
                    {(article.excerpt as Record<string, string>)[locale] || article.excerpt.en}
                  </p>
                  <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                    {t(locale, 'industry.readMore')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
