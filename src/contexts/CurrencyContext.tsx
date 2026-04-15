'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const exchangeRates: Record<string, number> = {
  USD: 1, CNY: 7.2, EUR: 0.92, GBP: 0.79, ZAR: 18.5,
  SAR: 3.75, AED: 3.67, BRL: 5.0, RUB: 92, JPY: 155,
  INR: 83, AUD: 1.55, CAD: 1.37, MXN: 17, CHF: 0.88,
  KRW: 1350, SEK: 10.8, NOK: 10.5, DKK: 6.9, PLN: 4.0,
  CZK: 23, HUF: 365, RON: 4.6, UAH: 38, BYN: 3.3,
  KZT: 450, UZS: 12600, THB: 36, VND: 24500, IDR: 15800,
  PHP: 57, MYR: 4.7, SGD: 1.35, NZD: 1.7, HKD: 7.82,
  TWD: 32, EGP: 48, IQD: 1310, KWD: 0.31, QAR: 3.64,
  BHD: 0.38, OMR: 0.39, JOD: 0.71, DZD: 134, MAD: 10,
  TND: 3.1, XOF: 600, XAF: 600, MGA: 4500, MZN: 64, AOA: 830,
  ARS: 870, COP: 3900, CLP: 900, PEN: 3.7,
}

const currencySymbols: Record<string, string> = {
  USD: '$', CNY: '¥', EUR: '€', GBP: '£', ZAR: 'R',
  SAR: '﷼', AED: 'د.إ', BRL: 'R$', RUB: '₽', JPY: '¥',
  INR: '₹', AUD: 'A$', CAD: 'C$', MXN: 'MX$', CHF: 'CHF',
  KRW: '₩', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł',
  CZK: 'Kč', HUF: 'Ft', RON: 'lei', UAH: '₴', BYN: 'Br',
  KZT: '₸', UZS: "so'm", THB: '฿', VND: '₫', IDR: 'Rp',
  PHP: '₱', MYR: 'RM', SGD: 'S$', NZD: 'NZ$', HKD: 'HK$',
  TWD: 'NT$', EGP: 'E£', IQD: 'ع.د', KWD: 'د.ك', QAR: 'ر.ق',
  BHD: 'د.ب', OMR: 'ر.ع.', JOD: 'د.أ', DZD: 'د.ج', MAD: 'MAD',
  TND: 'د.ت', XOF: 'CFA', XAF: 'FCFA', MGA: 'Ar', MZN: 'MT', AOA: 'Kz',
  ARS: '$', COP: '$', CLP: '$', PEN: 'S/',
}

// Popular currencies shown in dropdown
export const popularCurrencies = ['USD', 'CNY', 'EUR', 'GBP', 'JPY', 'INR', 'BRL', 'RUB', 'SAR', 'AED', 'ZAR', 'KRW']

export const currencies = Object.keys(exchangeRates) as string[]

interface CurrencyContextType {
  currency: string
  setCurrency: (c: string) => void
  formatPrice: (usdPrice: number) => string
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (p) => `$${p.toFixed(2)}`,
  symbol: '$',
})

export function useCurrency() {
  return useContext(CurrencyContext)
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('USD')

  const formatPrice = useCallback(
    (usdPrice: number) => {
      const rate = exchangeRates[currency] || 1
      const sym = currencySymbols[currency] || currency
      const converted = usdPrice * rate
      // JPY, KRW, VND, IDR, COP, CLP, etc. don't use decimals
      const noDecimal = ['JPY', 'KRW', 'VND', 'IDR', 'COP', 'CLP', 'UZS', 'KZT', 'ARS', 'MGA', 'XOF', 'XAF', 'IQD']
      const formatted = noDecimal.includes(currency) 
        ? Math.round(converted).toLocaleString() 
        : converted.toFixed(2)
      return `${sym}${formatted}`
    },
    [currency]
  )

  const symbol = currencySymbols[currency] || '$'

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}
