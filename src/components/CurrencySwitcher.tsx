'use client'

import { useCurrency, currencies } from '@/contexts/CurrencyContext'

const currencyLabels: Record<string, string> = {
  USD: '$ USD',
  CNY: '¥ CNY',
  EUR: '€ EUR',
  GBP: '£ GBP',
  ZAR: 'R ZAR',
}

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {currencies.map((c) => (
        <option key={c} value={c}>
          {currencyLabels[c] || c}
        </option>
      ))}
    </select>
  )
}
