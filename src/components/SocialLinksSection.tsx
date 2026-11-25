'use client'

import type { ReactNode } from 'react'
import type { Locale } from '@/i18n'

interface SocialLinksSectionProps {
  locale?: Locale
}

type Channel = {
  key: string
  brand: string
  handle: string
  href: string
  bg: string
  ring: string
  icon: ReactNode
}

const channels: Channel[] = [
  {
    key: 'instagram',
    brand: 'Instagram',
    handle: '@tradegofasteners',
    href: 'https://www.instagram.com/tradegofasteners/',
    bg: 'hover:bg-fuchsia-600',
    ring: 'border-fuchsia-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    brand: 'Facebook',
    handle: 'TradeGo Fasteners',
    href: 'https://www.facebook.com/profile.php?id=61596617862433',
    bg: 'hover:bg-blue-600',
    ring: 'border-blue-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1h-2.5V14h2.5v7h3.1z" />
      </svg>
    ),
  },
  {
    key: 'x',
    brand: 'X',
    handle: '@tradego_fast',
    href: 'https://x.com/tradego_fast',
    bg: 'hover:bg-neutral-900',
    ring: 'border-neutral-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 4l7.2 8.4L4.6 20" />
        <path d="M19.4 4l-6.4 7.4L20 20" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    brand: 'YouTube',
    handle: '@TradeGoFasteners',
    href: 'https://www.youtube.com/@TradeGoFasteners',
    bg: 'hover:bg-red-600',
    ring: 'border-red-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'quora',
    brand: 'Quora',
    handle: 'Edmond Zhang',
    href: 'https://www.quora.com/profile/Edmond-Zhang-18',
    bg: 'hover:bg-red-700',
    ring: 'border-red-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11.5" cy="11.5" r="7.5" />
        <path d="M15.5 16l4 4.5" />
      </svg>
    ),
  },
  {
    key: 'reddit',
    brand: 'Reddit',
    handle: 'u/TradeGoFasteners',
    href: 'https://www.reddit.com/user/TradeGoFasteners/',
    bg: 'hover:bg-orange-600',
    ring: 'border-orange-200',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="13" r="7" />
        <circle cx="9" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
        <path d="M9.5 15.6c.8.7 1.6 1 2.5 1s1.7-.3 2.5-1" />
        <path d="M12 6l1-3 2.5.7" />
      </svg>
    ),
  },
]

const copy: Record<string, { title: string; sub: string; cta: string }> = {
  en: {
    title: 'Follow TradeGo',
    sub: 'Product specs, coating comparisons and port notes are posted on every channel below — same facts, different format.',
    cta: 'Open profile',
  },
  zh: {
    title: '关注 TradeGo',
    sub: '规格、镀层与港口信息会在下列所有平台同步更新，事实一致，只是形式不同。',
    cta: '打开主页',
  },
  es: {
    title: 'Siga a TradeGo',
    sub: 'Especificaciones, comparativas de recubrimiento y notas de puerto se publican en todos estos canales: mismos datos, otro formato.',
    cta: 'Abrir perfil',
  },
  fr: {
    title: 'Suivre TradeGo',
    sub: 'Spécifications, comparaisons de revêtement et notes portuaires sont publiées sur tous ces canaux : mêmes faits, autre format.',
    cta: 'Ouvrir le profil',
  },
  pt: {
    title: 'Siga a TradeGo',
    sub: 'Especificações, comparativos de revestimento e notas de porto são publicados em todos estes canais: os mesmos fatos, em outro formato.',
    cta: 'Abrir perfil',
  },
  ar: {
    title: 'تابعوا TradeGo',
    sub: 'تُنشر المواصفات ومقارنات الطلاء وملاحظات الموانئ على جميع القنوات أدناه؛ الحقائق نفسها بصيغ مختلفة.',
    cta: 'فتح الصفحة',
  },
  ru: {
    title: 'TradeGo в соцсетях',
    sub: 'Спецификации, сравнения покрытий и заметки о портах публикуются во всех каналах ниже: одни факты, разный формат.',
    cta: 'Открыть профиль',
  },
  ja: {
    title: 'TradeGo をフォロー',
    sub: '規格・めっき比較・港湾情報を下記すべてのチャネルで発信しています。事実は同じ、形式だけが違います。',
    cta: 'プロフィールを開く',
  },
  de: {
    title: 'TradeGo folgen',
    sub: 'Spezifikationen, Beschichtungsvergleiche und Hafeninfos erscheinen auf allen Kanälen unten — gleiche Fakten, anderes Format.',
    cta: 'Profil öffnen',
  },
  hi: {
    title: 'TradeGo को फ़ॉलो करें',
    sub: 'स्पेसिफिकेशन, कोटिंग तुलना और पोर्ट जानकारी नीचे के सभी चैनलों पर एक जैसे तथ्यों के साथ, अलग रूप में।',
    cta: 'प्रोफ़ाइल खोलें',
  },
}

export default function SocialLinksSection({ locale = 'en' }: SocialLinksSectionProps) {
  const c = copy[locale] || copy.en

  return (
    <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">{c.title}</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 text-sm md:text-base">{c.sub}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto">
          {channels.map(ch => (
            <a
              key={ch.key}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${ch.brand} — ${c.cta}`}
              title={`${ch.brand} ${ch.handle}`}
              className={`group flex flex-col items-center justify-center gap-2 rounded-xl border ${ch.ring} bg-white px-3 py-4 text-center transition-colors duration-200 text-gray-800 ${ch.bg} hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white">
                {ch.icon}
              </span>
              <span className="text-sm font-semibold leading-tight">{ch.brand}</span>
              <span className="text-[11px] text-gray-500 group-hover:text-white/90 break-all">{ch.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
