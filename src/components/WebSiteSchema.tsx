'use client'

import { type Locale } from '@/i18n'

interface WebSiteSchemaProps {
  locale: Locale
}

export default function WebSiteSchema({ locale }: WebSiteSchemaProps) {
  const siteUrl = 'https://tradego-fasteners.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'zh' ? 'TradeGo紧固件' : 'TradeGo Fasteners',
    url: siteUrl,
    description: locale === 'zh' 
      ? 'ISO 9001 & SABS认证中国紧固件制造商。12年非洲出口经验。干墙螺丝、IBR钉、建筑紧固件工厂价直销。'
      : 'ISO 9001 & SABS certified China fastener manufacturer. 12+ years exporting to Africa. Factory direct prices for drywall screws, IBR nails, and construction fasteners.',
    keywords: locale === 'zh'
      ? '干墙螺丝,IBR钉,紧固件,中国制造商,非洲,建筑,批发'
      : 'drywall screws, IBR nails, fastener, China manufacturer, Africa, construction, wholesale',
    inLanguage: locale === 'zh' ? 'zh' : 'en',
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: locale === 'zh' ? '紧固件' : 'Fasteners',
      description: locale === 'zh'
        ? '建筑紧固件，包括干墙螺丝、螺栓、螺母和专业屋顶钉'
        : 'Construction fasteners including drywall screws, bolts, nuts, and specialized roofing nails',
    },
    audience: {
      '@type': 'Audience',
      name: locale === 'zh' ? '非洲建筑专业人士' : 'Construction professionals in Africa',
      geographicArea: {
        '@type': 'Place',
        name: 'Africa',
      },
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
      description: locale === 'zh' ? '搜索紧固件和建筑五金' : 'Search for fasteners and construction hardware',
    },
    sameAs: [
      'https://www.facebook.com/tradegofasteners',
      'https://www.linkedin.com/company/tradegofasteners',
      'https://twitter.com/tradegofasteners',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@tradego-fasteners.com',
      availableLanguage: ['English', 'Chinese'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'zh' ? '紧固件和建筑五金' : 'Fasteners and Construction Hardware',
      category: 'Industrial > Construction > Fasteners',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: locale === 'zh' ? '干墙螺丝' : 'Drywall Screws' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: locale === 'zh' ? '自钻螺丝' : 'Self-Drilling Screws' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: locale === 'zh' ? '螺栓螺母' : 'Bolts & Nuts' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: locale === 'zh' ? 'IBR钉' : 'IBR Nails' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: locale === 'zh' ? '地脚螺栓' : 'Anchor Bolts' } },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
