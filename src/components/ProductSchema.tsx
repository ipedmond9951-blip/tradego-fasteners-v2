'use client'
import { productNames as i18nNames, productDescriptions as i18nDescs, specLabels, pick } from '@/lib/productI18n'

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

const SITE = 'https://www.tradego-fasteners.com'

export default function ProductSchema({ products, locale }: ProductSchemaProps) {
  // Render each product as a standalone Product schema (Google requirement)
  // ItemList is not recognized for product rich results
  return (
    <>
      {products.map((product) => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: pick(i18nNames[product.slug], locale) || product.nameKey,
          description: pick(i18nDescs[product.slug], locale),
          image: `https://www.tradego-fasteners.com${product.image}`,
          brand: {
            '@type': 'Brand',
            name: 'TradeGo',
          },
          sku: `TRADEGO-${product.slug.toUpperCase()}`,
          mpn: product.slug.toUpperCase(),
          url: `${SITE}/${locale}/products/${product.slug}/`,
          material: product.specs.material,
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'TradeGo Fasteners',
            },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingDestination: [
                { '@type': 'Country', name: 'ZA' },
                { '@type': 'Country', name: 'ZW' },
                { '@type': 'Country', name: 'ZM' },
                { '@type': 'Country', name: 'MZ' },
                { '@type': 'Country', name: 'BW' },
                { '@type': 'Country', name: 'MW' },
                { '@type': 'Country', name: 'NA' },
              ],
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: '7',
                  maxValue: '14',
                  unitCode: 'DAY',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: '15',
                  maxValue: '35',
                  unitCode: 'DAY',
                },
              },
            },
          },
          additionalProperty: [
            { '@type': 'PropertyValue', name: pick(specLabels.size, locale), value: product.specs.size },
            { '@type': 'PropertyValue', name: pick(specLabels.standard, locale), value: product.specs.standard },
            { '@type': 'PropertyValue', name: pick(specLabels.material, locale), value: product.specs.material },
            { '@type': 'PropertyValue', name: pick(specLabels.finish, locale), value: product.specs.finish },
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
        }

        return (
          <script
            key={product.slug}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      })}
    </>
  )
}
