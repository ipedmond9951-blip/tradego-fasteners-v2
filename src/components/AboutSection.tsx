import Image from 'next/image'
import { type Locale, t } from '@/i18n'

interface AboutSectionProps { locale?: Locale }

export default function AboutSection({ locale = 'en' }: AboutSectionProps) {
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

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">{t(locale, 'about.title')}</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <h3 className="font-bold text-blue-900 text-lg">{t(locale, `about.${stat.key}`)}</h3>
                <p className="text-gray-600 text-sm mt-2">{t(locale, `about.${stat.key}Desc`)}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {scenes.map((scene) => (
              <div key={scene.key} className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                <Image
                  src={scene.src}
                  alt={t(locale, `about.${scene.key}Alt`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">{t(locale, `about.${scene.key}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
