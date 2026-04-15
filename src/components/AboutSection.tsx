import Image from 'next/image'
import { type Locale, t } from '@/i18n'

interface AboutSectionProps { locale?: Locale }

const stats = [
  { key: 'experience', icon: '🏭' },
  { key: 'certification', icon: '✅' },
  { key: 'global', icon: '🌍' },
  { key: 'moq', icon: '📦' },
]

const scenes = [
  { key: 'manufacturing', src: '/images/scenarios/factory-environment.jpg' },
  { key: 'quality', src: '/images/scenarios/quality-control.jpg' },
  { key: 'logistics', src: '/images/scenarios/warehouse-management.jpg' },
]

export default function AboutSection({ locale = 'en' }: AboutSectionProps) {
  return (
    <section id="about" className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">{t(locale, 'about.title')}</h2>
          
          {/* Stats - responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm">
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">{stat.icon}</div>
                <h3 className="font-bold text-blue-900 text-sm md:text-lg">{t(locale, `about.${stat.key}`)}</h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">{t(locale, `about.${stat.key}Desc`)}</p>
              </div>
            ))}
          </div>

          {/* Scene images - 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {scenes.map((scene) => (
              <div key={scene.key} className="relative aspect-[16/9] md:aspect-video rounded-xl overflow-hidden shadow-md group">
                <Image
                  src={scene.src}
                  alt={t(locale, `about.${scene.key}Alt`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 md:p-4">
                  <p className="text-white font-semibold text-sm md:text-base">{t(locale, `about.${scene.key}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
