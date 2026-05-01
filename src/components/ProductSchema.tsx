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
    'anchor-bolts': 'Anchor Bolts',
    'washers': 'Washers',
    'coach-screws': 'Coach Screws',
    'threaded-rods': 'Threaded Rods',
  },
  zh: {
    'drywall-screws': 'Drywall Screws',
    'self-drilling-screws': 'Self-Drilling Screws',
    'bolts-nuts': 'Bolts & Nuts',
    'ibr-nails': 'IBR Nails',
    'anchor-bolts': 'Anchor Bolts',
    'washers': 'Washers',
    'coach-screws': 'Coach Screws',
    'threaded-rods': 'Threaded Rods',
  },
}

const productDescriptions: Record<string, Record<string, string>> = {
  en: {
    'drywall-screws': 'High-quality drywall screws for construction and interior decoration. SABS & ISO 9001 certified manufacturer with 12+ years of Africa-focused experience. Sharp point, bugle head, fine thread options. Popular for African construction projects.',
    'self-drilling-screws': 'Premium self-drilling TEK screws for metal-to-metal fastening. Drill point design for easy installation. Available in zinc plated and Ruspert finish.',
    'bolts-nuts': 'Industrial grade hex bolts and nuts Grade 4.8 to 12.9. Full and partial thread options. Suitable for construction, machinery, and automotive applications.',
    'ibr-nails': 'Umbrella head roofing nails for IBR and corrugated roofing. SABS 1195 compliant. Smooth and ring shank options for secure fastening.',
    'anchor-bolts': 'Heavy-duty anchor bolts for foundation and structural connections. ASTM F1554 certified with hot-dip galvanized finish. Suitable for construction, solar panel mounting, and heavy machinery.',
    'washers': 'Flat washers and spring washers for machinery, automotive, and construction. DIN 125 / ISO 7089 standard. Available in zinc plated and HDG finish.',
    'coach-screws': 'Hex head coach screws for wood-to-wood and deck fastening. Hot-dip galvanized for outdoor use. Suitable for decking, fencing, and landscaping.',
    'threaded-rods': 'Fully threaded rods for structural and machinery applications. Available in M6-M24 sizes, 1m-3m lengths. Cut to custom sizes available.',
  },
  zh: {
    'drywall-screws': 'High-quality drywall screws for construction and interior decoration. SABS & ISO 9001 certified manufacturer with 12+ years of Africa-focused experience.',
    'self-drilling-screws': 'Premium self-drilling TEK screws for metal-to-metal fastening. Drill point design for easy installation.',
    'bolts-nuts': 'Industrial grade hex bolts and nuts Grade 4.8 to 12.9. Full and partial thread options.',
    'ibr-nails': 'Umbrella head roofing nails for IBR and corrugated roofing. SABS 1195 compliant.',
    'anchor-bolts': 'Heavy-duty anchor bolts for foundation and structural connections. ASTM F1554 certified.',
    'washers': 'Flat washers and spring washers for machinery, automotive, and construction.',
    'coach-screws': 'Hex head coach screws for wood-to-wood and deck fastening.',
    'threaded-rods': 'Fully threaded rods for structural and machinery applications.',
  },
}

export default function ProductSchema({ products, locale }: ProductSchemaProps) {
  const names = productNames[locale] || productNames.en
  const descriptions = productDescriptions[locale] || productDescriptions.en

  // Render each product as a standalone Product schema (Google requirement)
  // ItemList is not recognized for product rich results
  return (
    <>
      {products.map((product) => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: names[product.slug] || product.nameKey,
          description: descriptions[product.slug] || `High-quality ${product.nameKey} for industrial and construction use.`,
          image: `https://www.tradego-fasteners.com${product.image}`,
          brand: {
            '@type': 'Brand',
            name: 'TradeGo',
          },
          sku: `TRADEGO-${product.slug.toUpperCase()}`,
          mpn: product.slug.toUpperCase(),
          color: 'Silver/Gray',
          material: product.specs.material,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: product.pricePerPiece.toFixed(2),
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'TradeGo Fasteners',
            },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingDestination: {
                '@type': 'Country',
                name: 'Worldwide',
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
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: {
                    '@type': 'QuantitativeValue',
                    minValue: '15',
                    maxValue: '35',
                    unitCode: 'DAY',
                  },
                },
              },
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
