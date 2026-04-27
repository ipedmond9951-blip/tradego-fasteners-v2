'use client'

import { type Locale } from '@/i18n'

interface EventSchemaProps {
  locale?: Locale
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  url?: string
}

export default function EventSchema({
  locale = 'en',
  name,
  description,
  startDate,
  endDate,
  location,
  url,
}: EventSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': url ? `https://www.tradego-fasteners.com${url}` : undefined,
    name: name,
    description: description,
    startDate: startDate,
    endDate: endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ZA',
      },
    },
    organizer: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
      name: 'TradeGo Fasteners',
    },
    sponsor: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
      name: 'TradeGo Fasteners',
    },
    about: {
      '@type': 'Thing',
      name: 'Fasteners, Construction, Building Materials',
    },
    keywords: locale === 'zh'
      ? '紧固件,建筑,南非,展会,IBR钉,干墙螺丝'
      : 'fasteners, construction, South Africa, trade show, IBR nails, drywall screws',
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
