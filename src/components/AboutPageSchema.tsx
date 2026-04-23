'use client'

import { type Locale } from '@/i18n'

interface AboutPageSchemaProps {
  locale?: Locale
}

export default function AboutPageSchema({ locale = 'en' }: AboutPageSchemaProps) {
  const aboutData = {
    en: {
      name: 'TradeGo Fasteners',
      description: 'TradeGo Fasteners is a professional fastener manufacturer and exporter based in China, serving clients in 47 countries across Africa, Middle East, and Southeast Asia since 2012. We specialize in IBR roofing nails, drywall screws, self-drilling screws, and hex bolts for construction, automotive, and general hardware applications.',
      url: 'https://tradego-fasteners.com/about',
      foundingDate: '2012',
      numberOfEmployees: '50-100',
      slogan: 'Your Trusted Fastener Partner in Africa',
    },
    zh: {
      name: 'TradeGo 紧固件',
      description: 'TradeGo紧固件是一家专业紧固件制造商和出口商，总部位于中国，为非洲、中东和东南亚47个国家的客户提供服务。自2012年以来，我们专注于IBR屋顶钉、干墙螺丝、自钻螺丝和六角螺栓，用于建筑、汽车和一般硬件应用。',
      url: 'https://tradego-fasteners.com/zh/about',
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
      '@id': 'https://tradego-fasteners.com/#organization',
      name: data.name,
      foundingDate: data.foundingDate,
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: data.numberOfEmployees,
      },
      slogan: data.slogan,
      areaServed: {
        '@type': 'Place',
        name: '47 countries worldwide (Africa, Middle East, Southeast Asia)',
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
      '@id': 'https://tradego-fasteners.com/#organization',
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
