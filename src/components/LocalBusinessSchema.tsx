import { type Locale } from '@/i18n'

interface LocalBusinessSchemaProps {
  locale?: Locale
}

export default function LocalBusinessSchema({}: LocalBusinessSchemaProps) {
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
    parentOrganization: { '@id': 'https://www.tradego-fasteners.com/#organization' },
    // sameAs 待账号验证后加回（见 OrganizationSchema 注释）
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
