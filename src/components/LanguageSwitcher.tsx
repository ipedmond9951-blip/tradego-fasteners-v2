'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { locales, localeInfo, type Locale } from '@/i18n'

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params.locale as Locale) || 'en'
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/')
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    }
    return segments.join('/') || '/'
  }

  const current = localeInfo[currentLocale] || localeInfo.en

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:border-primary-500 transition-colors bg-white"
      >
        <span>{current.nativeName}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          {locales.map((locale) => {
            const info = localeInfo[locale]
            return (
              <Link
                key={locale}
                href={switchLocale(locale)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-primary-50 transition-colors ${
                  currentLocale === locale ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span>{info.nativeName}</span>
                <span className="text-xs text-gray-400">{info.currency}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
