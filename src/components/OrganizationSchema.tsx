'use client'

interface OrganizationSchemaProps {
  locale?: string
}

export default function OrganizationSchema({ locale = 'en' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://tradego-fasteners.com/#organization',
    name: 'TradeGo Fasteners',
    alternateName: 'TradeGo',
    url: 'https://tradego-fasteners.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tradego-fasteners.com/images/logo.png',
      width: 200,
      height: 60,
    },
    image: 'https://tradego-fasteners.com/images/factory.jpg',
    description: locale === 'zh' 
      ? 'TradeGo是专业的中国紧固件批发制造商，专注出口非洲、中东、东南亚市场20年。产品包括干墙螺丝、自钻螺丝、螺栓螺母、IBR钉等。ISO 9001认证，日产能50吨，出口47国。'
      : 'TradeGo is a professional China fastener manufacturer serving Africa, Middle East, and Southeast Asia markets for 20 years. Products include drywall screws, self-drilling screws, hex bolts, nuts, IBR nails. ISO 9001 certified. Daily output: 50 tons. Export to 47 countries.',
    slogan: locale === 'zh' 
      ? '可靠紧固件，全球送达'
      : 'Reliable Fasteners, Delivered Globally',
    foundingDate: '2004',
    foundingLocation: {
      '@type': 'Place',
      name: 'Shenzhen, Guangdong, China',
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
      addressRegion: 'Guangdong',
      addressLocality: 'Shenzhen',
      streetAddress: 'Baoan District, Hangcheng Avenue',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.5431',
      longitude: '114.0579',
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fastener Products',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Drywall Screws' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Self-Drilling Screws' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Bolts & Nuts' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'IBR Nails' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Anchor Bolts' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Washers' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Coach Screws' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Threaded Rods' } },
      ],
    },
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
