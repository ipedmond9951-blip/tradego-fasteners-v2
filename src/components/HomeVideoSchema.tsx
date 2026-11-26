import { type Locale } from '@/i18n'

interface HomeVideoSchemaProps {
  locale?: Locale
}

const SITE = 'https://www.tradego-fasteners.com'

// 2026-11-26 P2-9: 仅首页输出的 VideoObject，与 VideoSection 播放器里的三条真实视频一一对应。
// 元数据来源（均可核实，不编造）：
// - 三条 mp4 与三张 poster 线上均实测 HTTP 200（见 report-schema.md 取证表）；
// - duration 由 ffprobe 实测 8.04s，归一为 ISO 8601 PT8S；旧组件里的 PT3M45S 等时长系编造，已弃用；
// - uploadDate 取本地文件创建时间戳（mp4 内嵌 tags 无 creation_time），带 UTC 时区偏移；
// - 旧 VideoSchema 全站每页注入、且视频只在首页播放，是 GSC「视频不在观看页面上」1,299 条的根因；
//   本组件只挂在首页，其它页面零 VideoObject。
const videos = [
  {
    slug: 'factory-tour',
    name: 'TradeGo Fasteners Factory Tour',
    description:
      'Take a virtual tour of our fastener production facilities, where products are made to SABS 1195 / DIN / ISO specs serving African markets',
    thumbnail: '/images/videos/factory-poster.webp',
    uploadDate: '2026-04-23T08:02:13+00:00',
  },
  {
    slug: 'product-showcase',
    name: 'TradeGo Fastener Product Showcase',
    description: 'Watch detailed demonstrations of our fastener products and applications',
    thumbnail: '/images/videos/product-poster.webp',
    uploadDate: '2026-04-23T08:02:13+00:00',
  },
  {
    slug: 'testimonial',
    name: 'TradeGo Customer Testimonials',
    description: 'Hear from satisfied customers about their experience working with TradeGo',
    thumbnail: '/images/videos/testimonial-poster.webp',
    uploadDate: '2026-04-23T08:02:13+00:00',
  },
]

export default function HomeVideoSchema({ locale = 'en' }: HomeVideoSchemaProps) {
  return (
    <>
      {videos.map((video) => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: video.name,
          description: video.description,
          thumbnailUrl: `${SITE}${video.thumbnail}`,
          uploadDate: video.uploadDate,
          duration: 'PT8S',
          contentUrl: `${SITE}/videos/${video.slug}.mp4`,
          inLanguage: locale === 'zh' ? 'zh-CN' : locale,
          publisher: {
            '@type': 'Organization',
            '@id': `${SITE}/#organization`,
            name: 'TradeGo Fasteners',
          },
        }
        return (
          <script
            key={video.slug}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      })}
    </>
  )
}
