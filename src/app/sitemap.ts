import { locales } from '@/i18n'

export default function sitemap() {
  const baseUrl = 'https://tradego-fasteners-v2.vercel.app'
  
  const staticPages = ['', '/products', '/industry', '/product-upload']
  
  const articleSlugs = [
    'global-fastener-market-2026',
    'self-drilling-screws-guide',
  ]

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
