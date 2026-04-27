'use client'

import { type Locale } from '@/i18n'

interface AboutPageSchemaProps {
  locale?: Locale
}

export default function AboutPageSchema({ locale = 'en' }: AboutPageSchemaProps) {
  const aboutData = {
    en: {
      name: 'TradeGo Fasteners',
      description: 'TradeGo Fasteners is a SABS & ISO 9001 certified fastener distributor based in China, specializing in serving African construction markets since 2012. We export IBR roofing nails, drywall screws, self-drilling screws, and hex bolts to 20+ African countries including South Africa, Nigeria, and Kenya. Factory-direct pricing with sea freight to Durban, Lagos, and Mombasa.',
      url: 'https://www.tradego-fasteners.com/about',
      foundingDate: '2012',
      numberOfEmployees: '50-100',
      slogan: 'Your Trusted Fastener Partner in Africa',
    },
    zh: {
      name: 'TradeGo 紧固件',
      description: 'TradeGo紧固件是一家专业紧固件制造商和出口商，总部位于中国，为20+个非洲国家提供SABS和ISO 9001认证的紧固件，包括津巴布韦、南非、肯尼亚、尼日利亚、加纳、坦桑尼亚等。海运至德班、拉各斯和蒙巴萨。',

      url: 'https://www.tradego-fasteners.com/zh/about',
      foundingDate: '2012',
      numberOfEmployees: '50-100',
      slogan: '您值得信赖的非洲紧固件合作伙伴',
    },
  }

  const data = aboutData[locale as keyof typeof aboutData] || aboutData.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${data.url}#webpage`,
    url: data.url,
    name: data.name,
    description: data.description,
    about: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
      name: data.name,
      foundingDate: data.foundingDate,
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: data.numberOfEmployees,
      },
      slogan: data.slogan,
      areaServed: {
        '@type': 'Place',
        name: '20+ African countries (South Africa, Nigeria, Kenya, Ghana, Tanzania, Zimbabwe)',
      },
      knowsAbout: [
        'Fasteners',
        'Construction Hardware',
        'IBR Roofing Nails',
        'Drywall Screws',
        'Self-Drilling Screws',
        'Hex Bolts',
      ],
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
    },
    inLanguage: locale === 'zh' ? 'zh-CN' : locale,
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
