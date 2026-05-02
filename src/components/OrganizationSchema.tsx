'use client'

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
      width: 200,
      height: 60,
    },
    image: 'https://www.tradego-fasteners.com/images/factory.jpg',
    description: locale === 'zh' 
      ? 'TradeGo是专业的SABS和ISO 9001认证紧固件分销商，专注服务非洲建筑市场12+年。产品包括干墙螺丝、自钻螺丝、螺栓螺母、IBR钉等。工厂价，海运至德班、拉各斯、蒙巴萨等20余个非洲国家。'
      : 'TradeGo is a SABS & ISO 9001 certified fastener distributor specializing in serving African construction markets for 12+ years. Products include drywall screws, self-drilling screws, hex bolts, nuts, IBR nails. Factory-direct pricing with sea freight to Durban, Lagos, Mombasa and 20+ African countries.',
    slogan: locale === 'zh' 
      ? '非洲可靠紧固件供应商'
      : 'Reliable Fasteners, Delivered to Africa',
    foundingDate: '2012',
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
