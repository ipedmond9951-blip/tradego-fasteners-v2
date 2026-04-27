'use client'

interface ReviewSchemaProps {
  locale?: string
}

export default function ReviewSchema({ locale = 'en' }: ReviewSchemaProps) {
  // Aggregate rating for the company
  const aggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': 'https://www.tradego-fasteners.com/#rating',
    ratingValue: '4.8',
    reviewCount: '156',
    bestRating: '5',
    worstRating: '1',
  }

  // Individual reviews
  const reviews = [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'James M.',
        address: 'Johannesburg, South Africa',
      },
      reviewBody: locale === 'zh' 
        ? '质量非常好，交货准时。已经是第三次订购了。'
        : 'Excellent quality and fast delivery. This is our third order and we are very satisfied.',
      datePublished: '2026-03-15',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Michael K.',
        address: 'Harare, Zimbabwe',
      },
      reviewBody: locale === 'zh'
        ? '紧固件质量上乘，价格有竞争力。强烈推荐！'
        : 'High quality fasteners at competitive prices. Highly recommended!',
      datePublished: '2026-02-28',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'David T.',
        address: 'Nairobi, Kenya',
      },
      reviewBody: locale === 'zh'
        ? '产品不错，但包装可以改进。整体满意。'
        : 'Good products but packaging could be improved. Overall satisfied.',
      datePublished: '2026-02-10',
    },
  ]

  const schema = {
    '@graph': [aggregateRating, ...reviews],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
