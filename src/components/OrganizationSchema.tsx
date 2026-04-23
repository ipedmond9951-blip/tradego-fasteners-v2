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
    description: locale === 'zh' 
      ? '中国领先紧固件批发制造商，专业生产干墙螺丝、自钻螺丝、螺栓螺母、IBR钉等产品。ISO 9001认证，20多年经验。'
      : 'China leading wholesale fastener manufacturer. Professional production of drywall screws, self-drilling screws, hex bolts, nuts, washers, IBR nails. ISO 9001 certified with 20+ years experience.',
    foundingDate: '2004',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '150',
      unitCode: 'E39', // employees
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
      addressRegion: 'Guangdong',
      addressLocality: 'Shenzhen',
      streetAddress: 'Baoan District',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-159-6340-9951',
      contactType: 'sales',
      availableLanguage: ['English', 'Chinese', 'Spanish', 'French', 'Portuguese', 'Arabic', 'Russian', 'Japanese', 'Hindi'],
    },
    sameAs: [
      'https://www.linkedin.com/company/tradego-fasteners',
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
