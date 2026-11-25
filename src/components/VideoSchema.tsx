import { type Locale } from '@/i18n'

interface VideoSchemaProps {
  locale: Locale
}

const videoData: Record<string, Array<{ name: string; description: string; duration: string; uploadDate: string; thumbnail: string }>> = {
  en: [
    {
      name: 'TradeGo Fasteners Factory Tour',
      description: 'Take a virtual tour of our state-of-the-art fastener manufacturing facility in China. See our production lines, quality control processes, and warehouse operations.',
      duration: 'PT3M45S',
      uploadDate: '2026-04-15',
      thumbnail: 'https://www.tradego-fasteners.com/images/scenarios/factory-environment.webp',
    },
    {
      name: 'TradeGo Fastener Product Showcase',
      description: 'Explore our complete range of wholesale fasteners including drywall screws, self-drilling screws, hex bolts, and IBR nails. SGS/BV inspection on request manufacturer.',
      duration: 'PT2M30S',
      uploadDate: '2026-04-10',
      thumbnail: 'https://www.tradego-fasteners.com/images/products/product-showcase.jpg',
    },
    {
      name: 'TradeGo Customer Testimonials',
      description: 'Hear from our satisfied customers in Africa about their experience working with TradeGo Fasteners as their China fastener supplier.',
      duration: 'PT1M45S',
      uploadDate: '2026-04-05',
      thumbnail: 'https://www.tradego-fasteners.com/images/products/testimonial.jpg',
    },
  ],
}

export default function VideoSchema({ locale }: VideoSchemaProps) {
  // 目前只有英文视频源，其它语言回退到英文
  const videos = videoData[locale] ?? videoData.en

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: videos[0].name,
    description: videos[0].description,
    duration: videos[0].duration,
    uploadDate: videos[0].uploadDate,
    thumbnailUrl: videos[0].thumbnail,
    contentUrl: 'https://www.tradego-fasteners.com/videos/factory-tour.mp4',
    embedUrl: 'https://www.tradego-fasteners.com/videos/factory-tour.mp4',
    publisher: {
      '@type': 'Organization',
      name: 'TradeGo Fasteners',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tradego-fasteners.com/images/logo.png',
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
