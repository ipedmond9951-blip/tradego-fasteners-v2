import { type Locale } from '@/i18n'
import { pick, siteSchemaCopy } from '@/lib/uiCopy'

interface WebSiteSchemaProps {
  locale: Locale
}

export default function WebSiteSchema({ locale }: WebSiteSchemaProps) {
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TradeGo Fasteners',
    url: siteUrl,
    description: pick(siteSchemaCopy.description, locale),
    keywords: pick(siteSchemaCopy.keywords, locale),
    inLanguage: locale === 'zh' ? 'zh' : locale,
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: pick(siteSchemaCopy.aboutName, locale),
      description: pick(siteSchemaCopy.aboutDesc, locale),
    },
    audience: {
      '@type': 'Audience',
      name: pick(siteSchemaCopy.audienceName, locale),
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
      description: pick(siteSchemaCopy.searchDesc, locale),
    },
    // sameAs 待账号验证后加回（见 OrganizationSchema 注释）
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'sales@tradego-fasteners.com',
      availableLanguage: ['English', 'Chinese'],
    },

  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
