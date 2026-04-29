import { locales } from '@/i18n'
import { getAllSlugs } from '@/lib/articles'

export default function sitemap() {
  const baseUrl = 'https://www.tradego-fasteners.com'
  
  const staticPages = ['', '/products', '/industry', '/product-upload', '/analytics', '/steel-prices', '/zimbabwe-fasteners-wholesale', '/privacy-policy', '/terms']
  
  // 动态获取所有文章slug
  const articleSlugs = getAllSlugs()

  const entries = []
  
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date().toISOString(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.7,
      })
    }
    
    for (const slug of articleSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/industry/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }
  
  return entries
}
