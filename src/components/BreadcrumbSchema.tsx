'use client'

import { type Locale } from '@/i18n'

interface BreadcrumbSchemaProps {
  locale: Locale
  pageName: string
  pageUrl: string
}

const breadcrumbLabels: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    products: 'Products',
    industry: 'Industry',
    'product-upload': 'Product Upload',
    'privacy-policy': 'Privacy Policy',
    terms: 'Terms of Service',
  },
  zh: {
    home: '首页',
    products: '产品',
    industry: '行业',
    'product-upload': '产品上传',
    'privacy-policy': '隐私政策',
    terms: '服务条款',
  },
}

export default function BreadcrumbSchema({ locale, pageName, pageUrl }: BreadcrumbSchemaProps) {
  const labels = breadcrumbLabels[locale] || breadcrumbLabels.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: labels.home || 'Home',
        item: 'https://www.tradego-fasteners.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `https://www.tradego-fasteners.com/${locale}${pageUrl}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
