'use client'

import { type Locale } from '@/i18n'

interface ImageObjectSchemaProps {
  locale: Locale
}

// Product images to include in ImageObject schema
const productImages = [
  {
    url: '/images/products/drywall-screws-2.jpg',
    caption: 'Drywall Screws - Bugle Head Fine Thread',
  },
  {
    url: '/images/products/self-drilling-screws-1.jpg',
    caption: 'Self-Drilling TEK Screws',
  },
  {
    url: '/images/products/bolts-nuts-2.jpg',
    caption: 'Hex Bolts and Nuts',
  },
  {
    url: '/images/products/ibr-nails-placeholder.jpg',
    caption: 'IBR Roofing Nails - SABS Certified',
  },
  {
    url: '/images/products/anchor-bolts.jpg',
    caption: 'Anchor Bolts for Construction',
  },
  {
    url: '/images/products/washers.jpg',
    caption: 'Flat and Spring Washers',
  },
]

// GEO article images
const articleImages = [
  {
    url: '/images/geo/zimbabwe-border-map.jpg',
    caption: 'Zimbabwe Border Crossings - Trade Routes',
  },
  {
    url: '/images/geo/south-africa-ports.jpg',
    caption: 'South Africa Ports - Durban, Mombasa, Lagos',
  },
]

export default function ImageObjectSchema({ locale }: ImageObjectSchemaProps) {
  const siteUrl = 'https://tradego-fasteners.com'
  const currentDate = new Date().toISOString().split('T')[0]
  
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Main organization logo
      {
        '@type': 'ImageObject',
        '@id': `${siteUrl}/#logo`,
        url: `${siteUrl}/images/logo.png`,
        width: 200,
        height: 60,
        caption: locale === 'zh' ? 'TradeGo紧固件标志' : 'TradeGo Fasteners Logo',
        contentUrl: `${siteUrl}/images/logo.png`,
        encodingFormat: 'image/png',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      // Product images
      ...productImages.map((img, idx) => ({
        '@type': 'ImageObject',
        '@id': `${siteUrl}${img.url}#primary`,
        url: `${siteUrl}${img.url}`,
        width: 800,
        height: 600,
        caption: img.caption,
        contentUrl: `${siteUrl}${img.url}`,
        encodingFormat: 'image/jpeg',
        description: locale === 'zh' 
          ? `高质量${img.caption}，ISO 9001和SABS认证`
          : `High-quality ${img.caption}, ISO 9001 and SABS certified`,
        creator: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
          name: 'TradeGo Fasteners',
        },
        copyrightHolder: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
        },
        datePublished: currentDate,
        license: `${siteUrl}/terms`,
      })),
      // GEO article images
      ...articleImages.map((img, idx) => ({
        '@type': 'ImageObject',
        '@id': `${siteUrl}${img.url}#article`,
        url: `${siteUrl}${img.url}`,
        width: 1200,
        height: 630,
        caption: img.caption,
        contentUrl: `${siteUrl}${img.url}`,
        encodingFormat: 'image/jpeg',
        description: locale === 'zh'
          ? `${img.caption} - TradeGo GEO文章配图`
          : `${img.caption} - TradeGo GEO Article Image`,
        creator: {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
          name: 'TradeGo Fasteners',
        },
        datePublished: currentDate,
        inLanguage: locale === 'zh' ? 'zh' : 'en',
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
