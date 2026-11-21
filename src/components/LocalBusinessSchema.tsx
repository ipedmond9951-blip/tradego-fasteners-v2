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
      width: 512,
      height: 512,
    },
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressRegion: 'Shandong',
      addressLocality: 'Weifang',
      streetAddress: 'Weifang, Shandong, China',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.7069,
      longitude: 119.1618,
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
    sameAs: [
      'https://www.facebook.com/tradegofasteners',
      'https://twitter.com/tradegofasteners',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+86-159-6340-9951',
        email: 'sales@tradego-fasteners.com',
        contactType: 'sales',
        availableLanguage: ['English', 'Chinese', 'Shona'],
        areaServed: [
          { '@type': 'Country', name: 'Zimbabwe' },
          { '@type': 'Country', name: 'South Africa' },
          { '@type': 'Country', name: 'Kenya' },
          { '@type': 'Country', name: 'Nigeria' },
        ],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+86-159-6340-9951',
        contactType: 'customer support',
        contactOption: 'WhatsApp',
        availableLanguage: ['English', 'Chinese'],
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
