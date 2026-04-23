'use client'

import { type Locale } from '@/i18n'

interface LocalBusinessSchemaProps {
  locale?: Locale
}

export default function LocalBusinessSchema({ locale = 'en' }: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://tradego-fasteners.com/#business',
    name: 'TradeGo Fasteners',
    image: {
      '@type': 'ImageObject',
      url: 'https://tradego-fasteners.com/images/logo.png',
      width: 200,
      height: 60,
    },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressRegion: 'Guangdong',
      addressLocality: 'Shenzhen',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.5431,
      longitude: 114.0579,
    },
    telephone: '+86-159-6340-9951',
    email: 'info@tradegofasteners.com',
    url: 'https://tradego-fasteners.com',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '156',
      bestRating: '5',
    },
    sameAs: [
      'https://www.linkedin.com/company/tradego-fasteners',
      'https://www.facebook.com/tradegofasteners',
      'https://twitter.com/tradegofasteners',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
