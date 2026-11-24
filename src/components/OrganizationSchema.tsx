import { orgCopy, pick } from '@/lib/uiCopy'

interface OrganizationSchemaProps {
  locale?: string
}

export default function OrganizationSchema({ locale = 'en' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.tradego-fasteners.com/#organization',
    name: 'TradeGo Fasteners',
    alternateName: 'TradeGo',
    url: 'https://www.tradego-fasteners.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.tradego-fasteners.com/images/logo.png',
      width: 512,
      height: 512,
    },
    image: 'https://www.tradego-fasteners.com/images/factory.jpg',
    description: pick(orgCopy.description, locale),
    slogan: pick(orgCopy.slogan, locale),
    foundingDate: '2004',
    foundingLocation: {
      '@type': 'Place',
      name: 'Weifang, Shandong, China',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '150',
      unitCode: 'E39',
    },
    annualRevenue: {
      '@type': 'QuantitativeValue',
      value: '50000000',
      unitCode: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressRegion: 'Shandong',
      addressLocality: 'Weifang',
      streetAddress: 'Weifang, Shandong, China',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '36.7069',
      longitude: '119.1618',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-159-6340-9951',
      whatsapp: '+8615963409951',
      email: 'sales@tradego-fasteners.com',
      contactType: 'sales',
      availableLanguage: ['English', 'Chinese', 'Spanish', 'French', 'Portuguese', 'Arabic', 'Russian', 'Japanese', 'Hindi'],
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
      timeZone: 'Asia/Shanghai',
    },
    sameAs: [
      'https://www.facebook.com/tradegofasteners',
      'https://twitter.com/tradegofasteners',
    ],

    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'ISO 9001:2015', credentialCategory: 'quality' },
      { '@type': 'EducationalOccupationalCredential', name: 'CE Certification', credentialCategory: 'safety' },
      { '@type': 'EducationalOccupationalCredential', name: 'SABS Approved', credentialCategory: 'regional' },
    ],
    makesOffer: {
      '@type': 'Offer',
      areaServed: {
        '@type': 'Place',
        name: 'Africa, Middle East, Southeast Asia',
      },
      availableDeliveryMethod: ['Sea Freight', 'Air Freight', 'Express'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
