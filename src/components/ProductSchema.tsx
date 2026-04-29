'use client'

import { type Locale } from '@/i18n'

interface Product {
  slug: string
  image: string
  pricePerPiece: number
  nameKey: string
  specs: {
    size: string
    standard: string
    material: string
    finish: string
  }
  features: string[]
  applications: string[]
}

interface ProductSchemaProps {
  products: Product[]
  locale: Locale
}

const productNames: Record<string, Record<string, string>> = {
  en: {
    'drywall-screws': 'Drywall Screws',
    'self-drilling-screws': 'Self-Drilling Screws',
    'bolts-nuts': 'Bolts & Nuts',
    'ibr-nails': 'IBR Nails',
  },
  zh: {
    'drywall-screws': '干墙螺丝',
    'self-drilling-screws': '自钻螺丝',
    'bolts-nuts': '螺栓螺母',
    'ibr-nails': 'IBR钉',
  },
}

const productDescriptions: Record<string, Record<string, string>> = {
  en: {
    'drywall-screws': 'High-quality drywall screws for construction and interior decoration. SABS & ISO 9001 certified manufacturer with 12+ years of Africa-focused experience. Sharp point, bugle head, fine thread options. Popular for African construction projects.',
    'self-drilling-screws': 'Premium self-drilling TEK screws for metal-to-metal fastening. Drill point design for easy installation. Available in zinc plated and Ruspert finish.',
    'bolts-nuts': 'Industrial grade hex bolts and nuts Grade 4.8 to 12.9. Full and partial thread options. Suitable for construction, machinery, and automotive applications.',
    'ibr-nails': 'Umbrella head roofing nails for IBR and corrugated roofing. SABS 1195 compliant. Smooth and ring shank options for secure fastening.',
  },
  zh: {
    'drywall-screws': '高质量干墙螺丝，用于建筑和室内装修。SABS和ISO 9001认证制造商，12年非洲专注经验。尖嘴、自攻型、细牙螺纹选项。适用于非洲建筑项目。',
    'self-drilling-screws': '优质自钻TEK螺丝，用于金属与金属连接。钻点设计，安装方便。有镀锌和Ruspert表面处理可选。',
    'bolts-nuts': '工业级六角螺栓和螺母，等级4.8至12.9。全牙和半牙选项。适用于建筑、机械和汽车应用。',
    'ibr-nails': '用于IBR和波纹屋顶的伞形头屋顶钉。符合SABS 1195标准。光杆和环纹杆选项，确保牢固连接。',
  },
}

export default function ProductSchema({ products, locale }: ProductSchemaProps) {
  const names = productNames[locale] || productNames.en
  const descriptions = productDescriptions[locale] || productDescriptions.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: names[product.slug] || product.nameKey,
      description: descriptions[product.slug] || '',
      image: `https://www.tradego-fasteners.com${product.image}`,
      brand: {
        '@type': 'Brand',
        name: 'TradeGo',
      },
      sku: `TRADEGO-${product.slug.toUpperCase()}`,
      mpn: product.slug.toUpperCase(),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.pricePerPiece.toFixed(2),
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'TradeGo Fasteners',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '126',
        bestRating: '5',
        worstRating: '1',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Size', value: product.specs.size },
        { '@type': 'PropertyValue', name: 'Standard', value: product.specs.standard },
        { '@type': 'PropertyValue', name: 'Material', value: product.specs.material },
        { '@type': 'PropertyValue', name: 'Finish', value: product.specs.finish },
      ],
      countryOfOrigin: {
        '@type': 'Country',
        name: 'China',
      },
      manufacturer: {
        '@type': 'Organization',
        '@id': 'https://www.tradego-fasteners.com/#organization',
        name: 'TradeGo Fasteners',
      },
      certifications: [
        { '@type': 'Certification', name: 'ISO 9001:2015', authority: 'International Organization for Standardization' },
        { '@type': 'Certification', name: 'CE', authority: 'European Union' },
        { '@type': 'Certification', name: 'SABS', authority: 'South African Bureau of Standards' },
      ],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: [
          { '@type': 'Country', name: 'South Africa' },
          { '@type': 'Country', name: 'Zimbabwe' },
          { '@type': 'Country', name: 'Zambia' },
          { '@type': 'Country', name: 'Mozambique' },
          { '@type': 'Country', name: 'Botswana' },
          { '@type': 'Country', name: 'Malawi' },
          { '@type': 'Country', name: 'Namibia' },
        ],
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '1',
            maxValue: '3',
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: '15',
            maxValue: '35',
            unitCode: 'DAY',
          },
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        deliversTo: [
          { '@type': 'Country', name: 'South Africa' },
          { '@type': 'Country', name: 'Zimbabwe' },
          { '@type': 'Country', name: 'Zambia' },
          { '@type': 'Country', name: 'Mozambique' },
          { '@type': 'Country', name: 'Botswana' },
          { '@type': 'Country', name: 'Malawi' },
          { '@type': 'Country', name: 'Namibia' },
        ],
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
