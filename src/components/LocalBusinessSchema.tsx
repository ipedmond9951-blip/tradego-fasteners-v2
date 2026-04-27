'use client'

import { type Locale } from '@/i18n'

interface LocalBusinessSchemaProps {
  locale?: Locale
}

export default function LocalBusinessSchema({ locale = 'en' }: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.tradego-fasteners.com/#business',
    name: 'TradeGo Fasteners',
    image: {
      '@type': 'ImageObject',
      url: 'https://www.tradego-fasteners.com/images/logo.png',
      width: 200,
      height: 60,
    },
    priceRange: '$$',
    servesCuisine: 'Manufacturing',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressRegion: 'Guangdong',
      addressLocality: 'Shenzhen',
      streetAddress: 'Baoan District',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.5431,
      longitude: 114.0579,
    },
    telephone: '+86-159-6340-9951',
    whatsapp: '+8615963409951',
    email: 'sales@tradego-fasteners.com',
    url: 'https://www.tradego-fasteners.com',
    areaServed: [
      { '@type': 'Country', name: 'South Africa' },
      { '@type': 'Country', name: 'Zimbabwe' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Country', name: 'Ghana' },
      { '@type': 'Country', name: 'UAE' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Vietnam' },
      { '@type': 'Country', name: 'Thailand' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
        timeZone: 'Asia/Shanghai',
      },
    ],
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, L/C',
    currenciesAccepted: 'USD, CNY, EUR',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '156',
      bestRating: '5',
    },
    sameAs: [
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
