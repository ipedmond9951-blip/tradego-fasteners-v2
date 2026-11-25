import fs from 'fs'
import path from 'path'

export interface TableBlock {
  headers: string[]
  rows: string[][]
}

export interface ArticleSection {
  id: string
  heading: Record<string, string>
  body?: Record<string, string>
  /** 历史数据有两种写法：扁平 {headers, rows}，或按语言分组 {en:{...}, zh:{...}} */
  table?: TableBlock | Record<string, TableBlock>
  faqItems?: Array<{
    q: Record<string, string>
    a: Record<string, string>
  }>
}

export interface Article {
  slug: string
  category: string
  date: string
  updated?: string
  readTime: number
  image: string
  title: Record<string, string>
  description: Record<string, string>
  keywords: string
  sections: ArticleSection[]
  /** 旧 slug 重定向目标（存在时该篇不移入索引、直接 301） */
  redirectTo?: string
  /** OG/图片的按语言 alt 文案 */
  imageAlt?: Record<string, string>
  /** 部分老文章的按语言 meta description（优先于 description 用于 SEO） */
  metaDescription?: Record<string, string>
  relatedProducts?: Array<string | { slug: string; title?: string }>
  relatedArticles?: Array<string | { slug: string; title?: string }>
  cta: {
    text: Record<string, string>
    buttonText: Record<string, string>
    link: string
  }
}


const FALLBACK_ARTICLE_IMAGE = '/images/og-image.webp'

/** Article images occasionally reference files that were never generated; fall back to a real asset. */
function resolveArticleImage(article: Article): string {
  const img = article.image
  if (!img) return FALLBACK_ARTICLE_IMAGE
  if (img.startsWith('http')) return img
  const abs = path.join(process.cwd(), 'public', img.replace(/^\//, ''))
  return fs.existsSync(abs) ? img : FALLBACK_ARTICLE_IMAGE
}

/** Number of body words across all locales — used to flag stub articles. */
export function countArticleWords(article: Article): number {
  let count = 0
  for (const section of article.sections || []) {
    for (const text of Object.values(section.body || {})) {
      count += String(text).split(/\s+/).filter(Boolean).length
    }
  }
  return count
}

function plainLen(s?: string): number {
  if (!s) return 0
  return String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, '').length
}

/**
 * 本地语正文完整度 = 达到"约半篇幅"的小节占比。
 * 中文/日文信息密度高，字符数按 1.6 折算后再比，否则正常译文也会被判成摘要。
 * 用途：识别"一句话摘要"式本地语页面，避免薄内容被索引。
 */
export function localeSectionShare(article: Article, locale: string): number {
  if (locale === 'en') return 1
  const factor = locale === 'zh' ? 2 : locale === 'ja' ? 1.6 : 1
  let total = 0
  let pass = 0
  for (const section of article.sections || []) {
    const body = (section.body || {}) as Record<string, string>
    const en = plainLen(body.en)
    if (en < 100) continue
    total += 1
    if (plainLen(body[locale]) * factor >= en * 0.5) pass += 1
  }
  return total ? pass / total : 0
}

/**
 * 分两档：完整度 <20% 的本地语页面基本没有内容，robots:noindex 并从 sitemap 摘掉；
 * 20%–80% 的"摘要级"页面暂不摘索引，进 content/locale-backlog.json 排队扩写。
 */
export function isThinForLocale(article: Article, locale: string): boolean {
  if (locale === 'en') return false
  return localeSectionShare(article, locale) < 0.2
}

/** Stub articles (title + one-line summary only) should not be indexed and should not claim a read time. */
export function isThinArticle(article: Article, minWords = 300): boolean {
  return countArticleWords(article) < minWords
}

const articlesDir = path.join(process.cwd(), 'content', 'articles')

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const a = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8')) as Article
      return { ...a, image: resolveArticleImage(a) }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  // URL-encoded Chinese characters need to be decoded before file lookup
  const decodedSlug = decodeURIComponent(slug)
  const filePath = path.join(articlesDir, `${decodedSlug}.json`)
  if (!fs.existsSync(filePath)) return null
  const article = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Article
  return { ...article, image: resolveArticleImage(article) }
}

export function getIndexableSlugs(): string[] {
  // 2026-11-23 索引治理: 带 redirectTo 的旧 slug 会被 307 重定向, 不应再出现在 sitemap
  return getAllArticles()
    .filter(a => !isThinArticle(a) && !a.redirectTo)
    .map(a => a.slug)
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const article = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8')) as Article
        return article.slug
      } catch {
        return null
      }
    })
    .filter((s): s is string => s !== null)
}

export function getSlugDateMap(): Record<string, string> {
  const map: Record<string, string> = {}
  if (!fs.existsSync(articlesDir)) return map
  for (const f of fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'))) {
    try {
      const a = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8')) as Article
      const slug = decodeURIComponent(f.replace('.json', ''))
      map[slug] = a.updated || a.date || new Date().toISOString().slice(0, 10)
    } catch {}
  }
  return map
}

/**
 * Get related articles by category (auto-recommendation).
 * Used as fallback when article.relatedArticles is empty.
 * Returns up to `limit` articles in the same category, excluding the current slug.
 */
export function getRelatedByCategory(
  category: string,
  excludeSlug: string,
  limit = 3
): Article[] {
  return getAllArticles()
    .filter(a => a.category === category && a.slug !== excludeSlug)
    .slice(0, limit)
}

/**
 * Get article title localized for a given locale.
 * Falls back to English if locale-specific title is missing.
 */
export function getArticleTitle(article: Article, locale: string): string {
  return article.title[locale] || article.title.en || article.slug
}

/**
 * Humanize a slug into a display label.
 * e.g. "high-tensile-bolts-grade-8-8-10-9" → "High Tensile Bolts Grade 8 8 10 9"
 * (Preserves numeric values verbatim; do not interpret dash-separated numbers as decimals.)
 */
export function humanizeSlug(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
