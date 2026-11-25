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
      name: 'China',
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
      streetAddress: 'China',
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
    // sameAs 只放实测可访问的官方账号，404 空号比不写更伤实体可信度（2026-11-24 逐个 curl 验证 200）
    sameAs: [
      'https://x.com/tradego_fast',
      'https://www.youtube.com/@TradeGoFasteners',
    ],

    // hasCredential 已移除（2026-11-25）。结构化数据里的 "made to SABS 1195 spec" 属无条件的强断言，
    // 与 llms.txt / 关于页 "certificate available on request / documented with test reports" 的口径不一致，
    // 被 AI 交叉核验时会变成实体不可信证据。认证信息统一由页面正文与 llms.txt 以可核实措辞承载。
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
