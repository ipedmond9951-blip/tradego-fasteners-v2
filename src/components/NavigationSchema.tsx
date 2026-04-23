'use client'

import { type Locale } from '@/i18n'

interface NavigationSchemaProps {
  locale: Locale
}

export default function NavigationSchema({ locale }: NavigationSchemaProps) {
  const baseUrl = 'https://tradego-fasteners.com'
  
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    url: baseUrl,
    hasMenuSection: {
      '@type': 'MenuSection',
      hasMenuItem: [
        {
          '@type': 'MenuItem',
          name: locale === 'zh' ? '首页' : 'Home',
          url: `${baseUrl}${localePrefix}`,
        },
        {
          '@type': 'MenuItem',
          name: locale === 'zh' ? '产品' : 'Products',
          url: `${baseUrl}${localePrefix}/products`,
        },
        {
          '@type': 'MenuItem',
          name: locale === 'zh' ? '行业指南' : 'Industry Guides',
          url: `${baseUrl}${localePrefix}/industry`,
        },
        {
          '@type': 'MenuItem',
          name: locale === 'zh' ? '关于我们' : 'About',
          url: `${baseUrl}${localePrefix}/#about`,
        },
        {
          '@type': 'MenuItem',
          name: locale === 'zh' ? '联系我们' : 'Contact',
          url: `${baseUrl}${localePrefix}/#inquiry`,
        },
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
