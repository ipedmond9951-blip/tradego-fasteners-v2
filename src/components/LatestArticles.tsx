import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles, type Article } from '@/lib/articles'
import { type Locale } from '@/i18n'
import { optImagePath } from '@/lib/optImages'
import { latestArticlesCopy, pick } from '@/lib/uiCopy'

interface LatestArticlesProps {
  locale: Locale
  limit?: number
}

export default function LatestArticles({ locale, limit = 6 }: LatestArticlesProps) {
  const articles = getAllArticles().slice(0, limit)

  const sectionTitle = pick(latestArticlesCopy.title, locale)
  const sectionSubtitle = pick(latestArticlesCopy.subtitle, locale)
  const readMore = pick(latestArticlesCopy.readMore, locale)
  const viewAll = pick(latestArticlesCopy.viewAll, locale)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{sectionTitle}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">{sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article) => {
            const title = article.title[locale] || article.title.en
            const desc = article.description?.[locale] || article.description?.en || ''
            const encodedSlug = encodeURIComponent(article.slug)

            return (
              <Link
                key={article.slug}
                href={`/${locale}/industry/${encodedSlug}/`}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Image
                    src={optImagePath(article.image, 'thumb')}
                    alt={article.imageAlt?.[locale] || article.imageAlt?.en || title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.category && (
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {desc}
                  </p>
                  <span className="text-primary-600 text-sm font-medium group-hover:underline">
                    {readMore}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/${locale}/industry/`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            {viewAll}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
