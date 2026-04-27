'use client'

import { type Locale } from '@/i18n'

interface ArticleSchemaProps {
  locale?: Locale
  title: string
  description: string
  author?: string
  datePublished?: string
  dateModified?: string
  image?: string
  url?: string
}

export default function ArticleSchema({
  locale = 'en',
  title,
  description,
  author = 'TradeGo Fasteners',
  datePublished,
  dateModified,
  image = 'https://www.tradego-fasteners.com/images/blog/article-default.jpg',
  url,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url ? `https://www.tradego-fasteners.com${url}` : undefined,
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
      name: author,
    },
    publisher: {
      '@id': 'https://www.tradego-fasteners.com/#organization',
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url ? `https://www.tradego-fasteners.com${url}` : undefined,
    },
    articleSection: locale === 'zh' ? '紧固件知识' : 'Fastener Knowledge',
    keywords: locale === 'zh'
      ? '紧固件,干墙螺丝,自钻螺丝,螺栓,螺母,IBR钉,建筑,批发'
      : 'fasteners,drywall screws,self-drilling screws,bolts,nuts,IBR nails,construction,wholesale',
    wordCount: description.split(' ').length * 10, // Estimate
    inLanguage: locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://www.tradego-fasteners.com/#website',
    },
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}
