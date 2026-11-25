'use client'

import { useState, useRef } from 'react'

interface VideoSectionProps {
  locale: string
}

const translations: Record<string, {
  title: string
  subtitle: string
  factoryTitle: string
  factoryDesc: string
  productTitle: string
  productDesc: string
  testimonialTitle: string
  testimonialDesc: string
  subscribe: string
  subscribeText: string
}> = {
  en: {
    title: 'Video Content',
    subtitle: 'See our manufacturing process, products, and customer testimonials in action',
    factoryTitle: 'Factory Tour',
    factoryDesc: 'Take a virtual tour of our fastener production facilities, where products are made to SABS 1195 / DIN / ISO specs serving African markets',
    productTitle: 'Product Showcase',
    productDesc: 'Watch detailed demonstrations of our fastener products and applications',
    testimonialTitle: 'Customer Testimonials',
    testimonialDesc: 'Hear from satisfied customers about their experience working with TradeGo',
    subscribe: 'Subscribe',
    subscribeText: 'Subscribe to our YouTube channel for weekly updates'
  },
  zh: {
    title: '视频内容',
    subtitle: '观看我们的制造流程、产品和客户评价视频',
    factoryTitle: '工厂参观',
    factoryDesc: '虚拟参观我们位于中国的先进制造设施',
    productTitle: '产品展示',
    productDesc: '观看紧固件产品和应用的详细演示',
    testimonialTitle: '客户评价',
    testimonialDesc: '聆听满意客户分享与TradeGo合作的体验',
    subscribe: '订阅',
    subscribeText: '订阅我们的YouTube频道获取每周更新',
  },
  es: {
    title: 'Contenido en vídeo',
    subtitle: 'Vea nuestro proceso de fabricación, productos y testimonios de clientes',
    factoryTitle: 'Visita de fábrica',
    factoryDesc: 'Recorra virtualmente nuestras plantas que producen según SABS 1195 / DIN / ISO que sirven al mercado africano',
    productTitle: 'Muestra de producto',
    productDesc: 'Vea demostraciones detalladas de nuestros productos y aplicaciones',
    testimonialTitle: 'Testimonios de clientes',
    testimonialDesc: 'Conozca la experiencia de clientes que trabajan con TradeGo',
    subscribe: 'Suscribirse',
    subscribeText: 'Suscríbase a nuestro canal de YouTube para novedades semanales',
  },
  fr: {
    title: 'Contenu vidéo',
    subtitle: 'Découvrez notre process de fabrication, nos produits et les témoignages clients',
    factoryTitle: 'Visite d’usine',
    factoryDesc: 'Visite virtuelle de nos sites produisant selon SABS 1195 / DIN / ISO au service du marché africain',
    productTitle: 'Présentation produits',
    productDesc: 'Démonstrations détaillées de nos produits et applications',
    testimonialTitle: 'Témoignages clients',
    testimonialDesc: 'Des clients satisfaits racontent leur collaboration avec TradeGo',
    subscribe: 'S’abonner',
    subscribeText: 'Abonnez-vous à notre chaîne YouTube pour les nouveautés hebdomadaires',
  },
  pt: {
    title: 'Conteúdo em vídeo',
    subtitle: 'Veja nosso processo de fabricação, produtos e depoimentos de clientes',
    factoryTitle: 'Visita à fábrica',
    factoryDesc: 'Tour virtual pelas nossas fábricas que producen según SABS 1195 / DIN / ISO que atendem o mercado africano',
    productTitle: 'Vitrine de produtos',
    productDesc: 'Demonstrações detalhadas dos nossos produtos e aplicações',
    testimonialTitle: 'Depoimentos de clientes',
    testimonialDesc: 'Saiba como é trabalhar com a TradeGo na visão de clientes satisfeitos',
    subscribe: 'Inscrever-se',
    subscribeText: 'Inscreva-se no nosso canal do YouTube para novidades semanais',
  },
  ar: {
    title: 'محتوى فيديو',
    subtitle: 'شاهد عملية التصنيع والمنتجات وشهادات العملاء',
    factoryTitle: 'جولة المصنع',
    factoryDesc: 'جولة افتراضية في مصانعنا التي تنتج وفق SABS 1195 / DIN / ISO التي تخدم الأسواق الأفريقية',
    productTitle: 'عرض المنتجات',
    productDesc: 'عروض تفصيلية لمنتجاتنا وتطبيقاتها',
    testimonialTitle: 'شهادات العملاء',
    testimonialDesc: 'استمع إلى عملاء راضين عن تجربتهم مع TradeGo',
    subscribe: 'اشترك',
    subscribeText: 'اشترك في قناتنا على يوتيوب لتصلك التحديثات أسبوعيًا',
  },
  ru: {
    title: 'Видеоматериалы',
    subtitle: 'Смотрите производство, продукцию и отзывы клиентов',
    factoryTitle: 'Экскурсия по заводу',
    factoryDesc: 'Виртуальный тур по нашим производствам, работающим по SABS 1195 / DIN / ISO для африканских рынков',
    productTitle: 'Презентация продукции',
    productDesc: 'Подробные демонстрации нашей продукции и применения',
    testimonialTitle: 'Отзывы клиентов',
    testimonialDesc: 'Клиенты рассказывают о работе с TradeGo',
    subscribe: 'Подписаться',
    subscribeText: 'Подпишитесь на наш канал YouTube — обновления каждую неделю',
  },
  de: {
    title: 'Videomaterial',
    subtitle: 'Sehen Sie Fertigung, Produkte und Kundenstimmen',
    factoryTitle: 'Werksbesichtigung',
    factoryDesc: 'Virtueller Rundgang durch unsere Werke, die nach SABS 1195 / DIN / ISO fertigen für afrikanische Märkte',
    productTitle: 'Produktvorstellung',
    productDesc: 'Detaillierte Demonstrationen unserer Produkte und Anwendungen',
    testimonialTitle: 'Kundenstimmen',
    testimonialDesc: 'Zufriedene Kunden berichten über die Zusammenarbeit mit TradeGo',
    subscribe: 'Abonnieren',
    subscribeText: 'Abonnieren Sie unseren YouTube-Kanal für wöchentliche Updates',
  },
  ja: {
    title: '動画コンテンツ',
    subtitle: '製造工程・製品・お客様の声をご覧ください',
    factoryTitle: '工場見学',
    factoryDesc: 'SABS 1195 / DIN / ISO 規格で製造する拠点をバーチャル見学（アフリカ市場向け）',
    productTitle: '製品紹介',
    productDesc: '製品と用途の詳細デモ',
    testimonialTitle: 'お客様の声',
    testimonialDesc: 'TradeGo との取引経験を紹介',
    subscribe: '登録',
    subscribeText: 'YouTube チャンネル登録で毎週の更新をお届け',
  },
  hi: {
    title: 'वीडियो सामग्री',
    subtitle: 'हमारी निर्माण प्रक्रिया, उत्पाद और ग्राहक प्रतिक्रियाएँ देखें',
    factoryTitle: 'फैक्ट्री टूर',
    factoryDesc: 'SABS 1195 / DIN / ISO मानक पर उत्पादन करने वाले हमारे प्लांट का वर्चुअल टूर, अफ्रीकी बाज़ार के लिए',
    productTitle: 'उत्पाद प्रदर्शन',
    productDesc: 'हमारे उत्पादों और उपयोगों का विस्तृत प्रदर्शन',
    testimonialTitle: 'ग्राहक प्रतिक्रियाएँ',
    testimonialDesc: 'संतुष्ट ग्राहक TradeGo के साथ अपना अनुभव बताते हैं',
    subscribe: 'सब्सक्राइब करें',
    subscribeText: 'साप्ताहिक अपडेट के लिए हमारा YouTube चैनल सब्सक्राइब करें',
  },
}


const videos = [
  {
    id: 'factory' as const,
    videoSrc: '/videos/factory-tour.mp4',
    poster: '/images/videos/factory-poster.webp',
  },
  {
    id: 'product' as const,
    videoSrc: '/videos/product-showcase.mp4',
    poster: '/images/videos/product-poster.webp',
  },
  {
    id: 'testimonial' as const,
    videoSrc: '/videos/testimonial.mp4',
    poster: '/images/videos/testimonial-poster.webp',
  }
]

export default function VideoSection({ locale }: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<'factory' | 'product' | 'testimonial'>('factory')
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const content = translations[locale] || translations.en

  const handlePlay = () => {
    if (videoRef.current) {
      // First-time click: set src (otherwise it stays undefined for lazy load)
      if (!videoRef.current.src) {
        videoRef.current.src = activeVideoData.videoSrc
      }
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        if (!videoRef.current.src) {
          videoRef.current.src = activeVideoData.videoSrc
        }
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  const activeVideoData = videos.find(v => v.id === activeVideo) || videos[0]

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600">
            {content.subtitle}
          </p>
        </div>

        {/* Video Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => {
                setActiveVideo(video.id)
                setIsPlaying(false)
                if (videoRef.current) {
                  videoRef.current.pause()
                  videoRef.current.currentTime = 0
                }
              }}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                activeVideo === video.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {video.id === 'factory' && content.factoryTitle}
              {video.id === 'product' && content.productTitle}
              {video.id === 'testimonial' && content.testimonialTitle}
            </button>
          ))}
        </div>

        {/* Video Player Area */}
        <div className="max-w-4xl mx-auto">
          {/* Video Container */}
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              src={isPlaying ? activeVideoData.videoSrc : undefined}
              preload="none"
              title={activeVideo === 'factory' ? 'TradeGo Fasteners factory tour - SGS/BV inspection on request fastener production facility in China serving African markets' : activeVideo === 'product' ? 'TradeGo fastener product showcase - drywall screws, self-drilling screws, hex bolts, IBR nails for construction applications' : 'TradeGo customer testimonials - construction companies from South Africa, Zimbabwe, Kenya share their experience'}
              aria-label={activeVideo === 'factory' ? 'Factory tour video showing TradeGo fastener manufacturing and quality control process' : activeVideo === 'product' ? 'Product showcase video demonstrating TradeGo fastener product range and applications' : 'Customer testimonial video featuring African construction professionals'}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleVideoClick}
              onEnded={handleVideoEnded}
              controls={isPlaying}
              playsInline
            />
            
            {/* Play Button Overlay (shown when not playing) */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
                onClick={handlePlay}
              >
                {/* 封面图懒加载：不进首屏关键路径 */}
                <img
                  src={activeVideoData.poster}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                />
                <div className="text-center">
                  <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 mb-4">
                    <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {activeVideo === 'factory' && content.factoryTitle}
                    {activeVideo === 'product' && content.productTitle}
                    {activeVideo === 'testimonial' && content.testimonialTitle}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {activeVideo === 'factory' && content.factoryDesc}
                    {activeVideo === 'product' && content.productDesc}
                    {activeVideo === 'testimonial' && content.testimonialDesc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeVideo === 'factory' && content.factoryTitle}
              {activeVideo === 'product' && content.productTitle}
              {activeVideo === 'testimonial' && content.testimonialTitle}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {activeVideo === 'factory' && content.factoryDesc}
              {activeVideo === 'product' && content.productDesc}
              {activeVideo === 'testimonial' && content.testimonialDesc}
            </p>
          </div>
        </div>

        {/* YouTube Subscribe CTA */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{content.subscribe}</h4>
                <p className="text-sm text-gray-600">{content.subscribeText}</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@TradeGoFasteners"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-shrink-0"
            >
              YouTube →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
