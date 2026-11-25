// 2026-11-24 额度治理: 原 src/app/sitemap.ts 是 MetadataRoute, 每次抓取都跑一次函数
// (4322 条 URL 全量计算, 响应头 must-revalidate + x-vercel-cache MISS)。
// Google/Bing 一天多次抓 sitemap, 加上各种 AI 爬虫, 这是 ISR Reads / Fast Origin Transfer /
// Fluid CPU 三方一起越线的固定开销。
// 改为 route handler + force-static: 构建时就生成一份静态 XML, 之后由 CDN 直接返回,
// 内容仍是同一份逻辑(文章/产品/标准/市场/分类页全量), SEO 侧零损失。
import { locales } from '@/i18n'
import { getIndexableSlugs, getSlugDateMap, getAllArticles } from '@/lib/articles'
import { allProducts } from '@/lib/products'
import { markets } from '@/lib/markets'
import { standardEntries } from '@/lib/standards'

export const dynamic = 'force-static'
export const revalidate = false

const BASE_URL = 'https://www.tradego-fasteners.com'

interface Entry {
  url: string
  lastModified: string
  changeFrequency: string
  priority: number
}

function buildEntries(): Entry[] {
  // lastmod 用构建时刻固定下来, 不再每次请求变化(假 lastmod 反而削弱可信度)
  const now = new Date().toISOString()

  const staticPages = ['', '/products', '/industry', '/faq', '/steel-prices', '/zimbabwe-fasteners-wholesale', '/privacy-policy', '/terms']
  const enOnlyPages = new Set(['/steel-prices', '/zimbabwe-fasteners-wholesale'])

  const articleSlugs = getIndexableSlugs()
  const slugDateMap = getSlugDateMap()

  const catSlugify = (c: string) => c.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')
  const categorySlugs = Array.from(new Set(
    getAllArticles().filter(a => !a.redirectTo && a.category).map(a => catSlugify(a.category))
  ))

  const entries: Entry[] = []

  for (const locale of locales) {
    for (const page of staticPages) {
      if (locale !== 'en' && enOnlyPages.has(page)) continue
      const url = page === '' ? `${BASE_URL}/${locale}/` : `${BASE_URL}/${locale}${page}/`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 1.0 : 0.7,
      })
    }

    for (const product of allProducts) {
      entries.push({
        url: `${BASE_URL}/${locale}/products/${product.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    }

    for (const slug of articleSlugs) {
      const encodedSlug = encodeURIComponent(slug)
      const articleDate = slugDateMap[slug] || now.slice(0, 10)
      entries.push({
        url: `${BASE_URL}/${locale}/industry/${encodedSlug}/`,
        lastModified: articleDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    entries.push({
      url: `${BASE_URL}/${locale}/markets/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    for (const m of markets) {
      if (m.slug === 'zimbabwe') continue
      entries.push({
        url: `${BASE_URL}/${locale}/markets/${m.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    entries.push({
      url: `${BASE_URL}/${locale}/standards/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    for (const std of standardEntries) {
      entries.push({
        url: `${BASE_URL}/${locale}/standards/${std.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const cat of categorySlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/industry/category/${encodeURIComponent(cat)}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return entries
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export async function GET() {
  const entries = buildEntries()
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xmlEscape(e.url)}</loc>\n    <lastmod>${e.lastModified}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=86400',
    },
  })
}
