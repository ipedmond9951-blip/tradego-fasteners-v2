'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n'

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params.locale as Locale) || 'en'

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/')
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    }
    return segments.join('/') || '/'
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocale(locale)}
          className={`px-2 py-1 rounded transition-colors ${
            currentLocale === locale
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
