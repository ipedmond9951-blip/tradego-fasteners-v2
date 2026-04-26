'use client'

import { type Locale } from '@/i18n'

interface VideoSchemaProps {
  locale: Locale
}

const videoData = {
  en: [
    {
      name: 'TradeGo Fasteners Factory Tour',
      description: 'Take a virtual tour of our state-of-the-art fastener manufacturing facility in China. See our production lines, quality control processes, and warehouse operations.',
      duration: 'PT3M45S',
      uploadDate: '2026-04-15',
      thumbnail: 'https://tradego-fasteners.com/images/scenarios/factory-environment.webp',
    },
    {
      name: 'TradeGo Fastener Product Showcase',
      description: 'Explore our complete range of wholesale fasteners including drywall screws, self-drilling screws, hex bolts, and IBR nails. ISO 9001 certified manufacturer.',
      duration: 'PT2M30S',
      uploadDate: '2026-04-10',
      thumbnail: 'https://tradego-fasteners.com/images/products/product-showcase.jpg',
    },
    {
      name: 'TradeGo Customer Testimonials',
      description: 'Hear from our satisfied customers in Africa about their experience working with TradeGo Fasteners as their China fastener supplier.',
      duration: 'PT1M45S',
      uploadDate: '2026-04-05',
      thumbnail: 'https://tradego-fasteners.com/images/products/testimonial.jpg',
    },
  ],
}

export default function VideoSchema({ locale }: VideoSchemaProps) {
  const videos = videoData.en // Default to English for now

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videos[0].name,
    description: videos[0].description,
    duration: videos[0].duration,
    uploadDate: videos[0].uploadDate,
    thumbnailUrl: videos[0].thumbnail,
    contentUrl: 'https://tradego-fasteners.com/videos/factory-tour.mp4',
    embedUrl: 'https://tradego-fasteners.com/videos/factory-tour.mp4',
    publisher: {
      '@type': 'Organization',
      name: 'TradeGo Fasteners',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tradego-fasteners.com/images/logo.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
