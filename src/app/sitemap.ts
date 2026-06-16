import { locales } from '@/i18n'
import { getAllSlugs, getSlugDateMap } from '@/lib/articles'

export default function sitemap() {
  const baseUrl = 'https://www.tradego-fasteners.com'
  const now = new Date().toISOString()
  
  const staticPages = ['', '/products', '/industry', '/steel-prices', '/zimbabwe-fasteners-wholesale', '/privacy-policy', '/terms']
  // NOTE: /product-upload and /analytics excluded - they have noindex meta tags

  // 动态获取所有文章slug + 各自的 date
  const articleSlugs = getAllSlugs()
  const slugDateMap = getSlugDateMap()

  const entries = []
  
  for (const locale of locales) {
    for (const page of staticPages) {
      // trailingSlash: true → all URLs end with /
      const url = page === '' ? `${baseUrl}/${locale}/` : `${baseUrl}/${locale}${page}/`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 1.0 : 0.7,
      })
    }
    
    for (const slug of articleSlugs) {
      // URL-encode slugs that contain non-ASCII characters (e.g. Chinese chars)
      const encodedSlug = encodeURIComponent(slug)
      // Use article's actual date from JSON (per-article lastmod)
      const articleDate = slugDateMap[slug] || now.slice(0, 10)
      entries.push({
        url: `${baseUrl}/${locale}/industry/${encodedSlug}/`,
        lastModified: articleDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }
  
  return entries
}
