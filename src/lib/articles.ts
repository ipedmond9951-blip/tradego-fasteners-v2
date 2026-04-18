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
  readTime: number
  image: string
  title: Record<string, string>
  description: Record<string, string>
  keywords: string
  sections: ArticleSection[]
  relatedProducts: string[]
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
  const filePath = path.join(articlesDir, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Article
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return []
  return fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
}
