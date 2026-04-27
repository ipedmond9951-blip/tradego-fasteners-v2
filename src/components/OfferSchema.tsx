'use client'

import { type Locale } from '@/i18n'

interface OfferSchemaProps {
  locale?: Locale
  sku: string
  name: string
  description: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  url?: string
}

export default function OfferSchema({
  locale = 'en',
  sku,
  name,
  description,
  price,
  currency = 'USD',
  availability = 'InStock',
  url,
}: OfferSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': url ? `https://www.tradego-fasteners.com${url}#offer` : undefined,
    sku: sku,
    name: name,
    description: description,
    price: price.toFixed(2),
    priceCurrency: currency,
    availability: `https://schema.org/${availability}`,
    url: url ? `https://www.tradego-fasteners.com${url}` : undefined,
    seller: {
      '@type': 'Organization',
      '@id': 'https://www.tradego-fasteners.com/#organization',
      name: 'TradeGo Fasteners',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: ['ZA', 'NG', 'KE', 'GH', 'TZ', 'MZ', 'ZW', 'ZM', 'UG', 'ET'],
      },
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'USD',
      },
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
          minValue: '7',
          maxValue: '21',
          unitCode: 'DAY',
        },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: [
        'Zimbabwe', 'South Africa', 'Kenya', 'Nigeria', 'Ghana',
        'Tanzania', 'Mozambique', 'Zambia', 'Uganda', 'Ethiopia',
      ],
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: '30',
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
    acceptedPaymentMethod: [
      'https://schema.org/PaymentMethod',
      'https://schema.org/CreditCard',
      'https://schema.org/PayPal',
    ],
    areaServed: {
      '@type': 'Place',
      name: '20+ African countries (South Africa, Nigeria, Kenya, Ghana, Tanzania)',
    },
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
