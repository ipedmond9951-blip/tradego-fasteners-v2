'use client'

import { useState, useRef, useEffect } from 'react'
import { useCurrency, popularCurrencies } from '@/contexts/CurrencyContext'
import { localeInfo, type Locale } from '@/i18n'
import { useParams } from 'next/navigation'

const allCurrencyGroups = [
  { label: 'Popular', currencies: popularCurrencies },
  { label: 'Americas', currencies: ['CAD', 'MXN', 'ARS', 'COP', 'CLP', 'PEN', 'BRL'] },
  { label: 'Europe', currencies: ['GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'UAH', 'BYN', 'RUB'] },
  { label: 'Asia-Pacific', currencies: ['JPY', 'KRW', 'INR', 'THB', 'VND', 'IDR', 'PHP', 'MYR', 'SGD', 'AUD', 'NZD', 'HKD', 'TWD'] },
  { label: 'Middle East', currencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD', 'IQD', 'EGP'] },
  { label: 'Africa', currencies: ['ZAR', 'XOF', 'XAF', 'MGA', 'MZN', 'AOA', 'DZD', 'MAD', 'TND'] },
]

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-set currency when locale changes
  useEffect(() => {
    const info = localeInfo[locale]
    if (info?.currency) setCurrency(info.currency)
  }, [locale, setCurrency])

  const currencySymbols: Record<string, string> = {
    USD: '$', CNY: '¥', EUR: '€', GBP: '£', JPY: '¥', INR: '₹',
    BRL: 'R$', RUB: '₽', SAR: '﷼', AED: 'د.إ', ZAR: 'R', KRW: '₩',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:border-primary-500 transition-colors bg-white"
      >
        <span>{currencySymbols[currency] || ''} {currency}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-72 overflow-y-auto text-sm">
          {allCurrencyGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase sticky top-0 bg-gray-50">
                {group.label}
              </div>
              {group.currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setIsOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-primary-50 transition-colors ${
                    currency === c ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {currencySymbols[c] || ''} {c}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
