'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const exchangeRates: Record<string, number> = {
  USD: 1,
  CNY: 7.2,
  EUR: 0.92,
  GBP: 0.79,
  ZAR: 18.5,
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  ZAR: 'R',
}

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
      const sym = currencySymbols[currency] || '$'
      const converted = usdPrice * rate
      return `${sym}${converted.toFixed(2)}`
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
