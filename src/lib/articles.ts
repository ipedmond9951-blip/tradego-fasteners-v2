import fs from 'fs'
import path from 'path'

export interface ArticleSection {
  id: string
  heading: Record<string, string>
  body?: Record<string, string>
  table?: {
    headers: string[]
    rows: string[][]
  }
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
  relatedProducts: string[]
  relatedArticles?: string[]
  cta: {
    text: Record<string, string>
    buttonText: Record<string, string>
    link: string
  }
}

const articlesDir = path.join(process.cwd(), 'content', 'articles')

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8')) as Article)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  // URL-encoded Chinese characters need to be decoded before file lookup
  const decodedSlug = decodeURIComponent(slug)
  const filePath = path.join(articlesDir, `${decodedSlug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Article
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => decodeURIComponent(f.replace('.json', '')))
}

export function getSlugDateMap(): Record<string, string> {
  const map: Record<string, string> = {}
  if (!fs.existsSync(articlesDir)) return map
  for (const f of fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'))) {
    try {
      const a = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8')) as Article
      const slug = decodeURIComponent(f.replace('.json', ''))
      map[slug] = a.date || a.updated || new Date().toISOString().slice(0, 10)
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
