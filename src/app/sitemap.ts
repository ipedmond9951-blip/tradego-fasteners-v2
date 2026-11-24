import { locales } from '@/i18n'
import { getIndexableSlugs, getSlugDateMap, getAllArticles } from '@/lib/articles'
import { allProducts } from '@/lib/products'
import { markets } from '@/lib/markets'
import { standardEntries } from '@/lib/standards'

export default function sitemap() {
  const baseUrl = 'https://www.tradego-fasteners.com'
  const now = new Date().toISOString()
  
  const staticPages = ['', '/products', '/industry', '/steel-prices', '/zimbabwe-fasteners-wholesale', '/privacy-policy', '/terms']
  // NOTE: /product-upload and /analytics excluded - they have noindex meta tags
  // 2026-11-24 复核: 仅 steel-prices / zimbabwe 是英语单语页（canonical 固定 /en），首页各语种已自指故 10 语回归
  const enOnlyPages = new Set(['/steel-prices', '/zimbabwe-fasteners-wholesale'])

  // 动态获取所有文章slug + 各自的 date
  const articleSlugs = getIndexableSlugs()
  const slugDateMap = getSlugDateMap()

  // 2026-11-23: 分类聚合页也是有效枢纽页, 每页 radiates 数十条文章内链, 补进 sitemap
  const catSlugify = (c: string) => c.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')
  const categorySlugs = Array.from(new Set(
    getAllArticles().filter(a => !a.redirectTo && a.category).map(a => catSlugify(a.category))
  ))

  const entries = []
  
  for (const locale of locales) {
    for (const page of staticPages) {
      if (locale !== 'en' && enOnlyPages.has(page)) continue
      // trailingSlash: true → all URLs end with /
      const url = page === '' ? `${baseUrl}/${locale}/` : `${baseUrl}/${locale}${page}/`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 1.0 : 0.7,
      })
    }
    
    for (const product of allProducts) {
      entries.push({
        url: `${baseUrl}/${locale}/products/${product.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    }

    for (const slug of articleSlugs) {
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

    // 地域页：索引 + 6 个有独立多语页的市场（zimbabwe 走旧路径 /{l}/zimbabwe-fasteners-wholesale/，仅 en）
    entries.push({
      url: `${baseUrl}/${locale}/markets/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    for (const m of markets) {
      if (m.slug === 'zimbabwe') continue
      entries.push({
        url: `${baseUrl}/${locale}/markets/${m.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    // 标准页：索引 + 每个标准详情（此前完全漏出 sitemap，是最大的发现渠道缺口）
    entries.push({
      url: `${baseUrl}/${locale}/standards/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    for (const std of standardEntries) {
      entries.push({
        url: `${baseUrl}/${locale}/standards/${std.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const cat of categorySlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/industry/category/${encodeURIComponent(cat)}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }
  
  return entries
}
