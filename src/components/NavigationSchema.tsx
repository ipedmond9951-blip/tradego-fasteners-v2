import { type Locale } from '@/i18n'
import { navLabels, pick } from '@/lib/uiCopy'

interface NavigationSchemaProps {
  locale: Locale
}

export default function NavigationSchema({ locale }: NavigationSchemaProps) {
  const baseUrl = 'https://www.tradego-fasteners.com'
  
  const localePrefix = locale === 'en' ? '' : `/${locale}/`
  
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
          name: pick(navLabels.home, locale),
          url: `${baseUrl}${localePrefix}`,
        },
        {
          '@type': 'MenuItem',
          name: pick(navLabels.products, locale),
          url: `${baseUrl}${localePrefix}/products`,
        },
        {
          '@type': 'MenuItem',
          name: pick(navLabels.industry, locale),
          url: `${baseUrl}${localePrefix}/industry`,
        },
        {
          '@type': 'MenuItem',
          name: pick(navLabels.about, locale),
          url: `${baseUrl}${localePrefix}/#about`,
        },
        {
          '@type': 'MenuItem',
          name: pick(navLabels.contact, locale),
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
