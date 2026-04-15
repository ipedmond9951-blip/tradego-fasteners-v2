'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Locale, t } from '@/i18n'

interface HeroSectionProps { locale?: Locale }

const heroProducts = [
  { key: 'product1', src: '/images/products/drywall-screws-1.jpg' },
  { key: 'product2', src: '/images/products/self-drilling-screws-1.jpg' },
  { key: 'product3', src: '/images/products/bolts-nuts-1.jpg' },
]

export default function HeroSection({ locale = 'en' }: HeroSectionProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: Text Content */}
            <div className="flex-1 max-w-lg">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full text-xs font-medium border border-white/20">{t(locale, 'hero.iso')}</span>
                <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full text-xs font-medium border border-white/20">{t(locale, 'hero.global')}</span>
                <span className="bg-white/15 backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full text-xs font-medium border border-white/20">{t(locale, 'hero.experience')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                {t(locale, 'hero.title')}
              </h1>
              <p className="text-base md:text-lg text-blue-100/90 mb-7 leading-relaxed">
                {t(locale, 'hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a href={`/${locale}#inquiry`} className="inline-flex items-center bg-white text-blue-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5">
                  {t(locale, 'hero.cta')} →
                </a>
                <a href={`/${locale}#products`} className="inline-flex items-center border border-white/40 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                  {t(locale, 'hero.ctaSecondary')}
                </a>
              </div>

              {/* Featured Products List (below CTA on mobile, hidden on desktop) */}
              <div className="lg:hidden mt-4">
                <p className="text-xs uppercase tracking-widest text-blue-200/70 mb-3">{t(locale, 'hero.featured')}</p>
                <div className="space-y-2">
                  {heroProducts.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.08] rounded-lg p-2 border border-white/10">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative">
                        <Image src={p.src} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t(locale, `hero.${p.key}_name`)}</p>
                        <p className="text-xs text-blue-200/80">{t(locale, `hero.${p.key}_desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stacked Product Images (desktop only) */}
            <div className="hidden lg:flex flex-1 justify-center items-start gap-3 pt-4">
              <div className="relative w-full max-w-sm">
                {heroProducts.map((p, i) => {
                  const offsets = [
                    { rotate: -3, y: 0, scale: 1, zIndex: 10 },
                    { rotate: 1.5, y: 16, scale: 0.95, zIndex: 20 },
                    { rotate: -1, y: 32, scale: 0.9, zIndex: 30 },
                  ]
                  const off = offsets[i]
                  return (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className="absolute top-0 left-0 w-[85%] origin-bottom-left rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 hover:border-white/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:z-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      style={{
                        transform: `rotate(${off.rotate}deg) translateY(${off.y}px) scale(${off.scale})`,
                        zIndex: off.zIndex,
                        left: `${i * 12}%`,
                      }}
                      aria-label={t(locale, `hero.${p.key}_name`)}
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={p.src}
                          alt={t(locale, `hero.${p.key}_name`)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 45vw, 35vw"
                          priority={i === 2}
                        />
                      </div>
                      {/* Product label on card */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-6">
                        <p className="text-xs font-bold truncate">{t(locale, `hero.${p.key}_name`)}</p>
                      </div>
                    </button>
                  )
                })}
                {/* Click hint */}
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-xs text-blue-200/60 inline-flex items-center gap-1">
                    🔍 Click to enlarge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-[101] leading-none"
            aria-label="Close"
          >✕</button>

          {/* Nav arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx === 0 ? heroProducts.length - 1 : lightboxIdx - 1) }}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-[101]"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx === heroProducts.length - 1 ? 0 : lightboxIdx + 1) }}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-[101]"
          >›</button>

          <div className="relative max-w-4xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={heroProducts[lightboxIdx].src}
              alt={t(locale, `hero.${heroProducts[lightboxIdx].key}_name`)}
              width={800}
              height={600}
              className="object-contain rounded-lg mx-auto"
            />
            <p className="text-center text-white/90 mt-3 text-lg font-semibold">
              {t(locale, `hero.${heroProducts[lightboxIdx].key}_name`)}
            </p>
            <p className="text-center text-white/60 text-sm">
              {t(locale, `hero.${heroProducts[lightboxIdx].key}_desc`)} · {lightboxIdx + 1} / {heroProducts.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
