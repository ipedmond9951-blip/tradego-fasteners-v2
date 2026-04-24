'use client'

import { type Locale } from '@/i18n'

interface WebSiteSchemaProps {
  locale?: Locale
}

export default function WebSiteSchema({ locale = 'en' }: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://tradego-fasteners.com/#website',
    name: 'TradeGo Fasteners',
    url: 'https://tradego-fasteners.com',
    description: locale === 'zh'
      ? '专业中国紧固件制造商，出口非洲、中东、东南亚。ISO 9001认证。干墙螺丝、自钻螺丝、螺栓螺母、IBR钉等。'
      : 'Professional China fastener manufacturer exporting to Africa, Middle East, Southeast Asia. ISO 9001 certified. Drywall screws, self-drilling screws, hex bolts, nuts, IBR nails.',
    inLanguage: locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://tradego-fasteners.com/#organization',
    },
    about: {
      '@type': 'Organization',
      '@id': 'https://tradego-fasteners.com/#organization',
    },
    audience: {
      '@type': 'Audience',
      name: locale === 'zh'
        ? '南非、尼日利亚、肯尼亚、加纳、坦桑尼亚等非洲国家的建筑商和批发商'
        : 'Builders, contractors and wholesalers in South Africa, Nigeria, Kenya, Ghana, Tanzania and other African countries',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tradego-fasteners.com/' + locale + '/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@id': 'https://tradego-fasteners.com/#organization',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
