'use client'

import { useGeo } from '@/contexts/GeoContext'
import { t } from '@/i18n'
import { useParams } from 'next/navigation'
import type { Locale } from '@/i18n'

const regionalContent: Record<string, Record<string, { promotion: string; shipping: string }>> = {
  US: {
    en: { promotion: 'Free shipping on orders over $500', shipping: 'Delivery in 7-10 business days via sea freight' },
    zh: { promotion: '', shipping: '' },
  },
  ZA: {
    en: { promotion: 'Bulk discount for Africa market — up to 15% off', shipping: 'Sea freight to Durban, 25-30 days' },
    zh: { promotion: '非洲市场批量折扣 — 最高15%优惠', shipping: '海运至德班，25-30天' },
  },
  EU: {
    en: { promotion: 'CE certified products available', shipping: 'Delivery to EU ports in 20-25 days' },
    zh: { promotion: '提供CE认证产品', shipping: '海运至欧盟港口，20-25天' },
  },
  CN: {
    en: { promotion: '', shipping: '' },
    zh: { promotion: '国内客户享批发价，量大从优', shipping: '国内包邮，3-5天送达' },
  },
}

function getRegion(country: string): string {
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'PL', 'SE', 'DK', 'FI', 'IE']
  if (country === 'US' || country === 'CA') return 'US'
  if (country === 'ZA' || country === 'NG' || country === 'KE') return 'ZA'
  if (country === 'CN' || country === 'HK' || country === 'TW') return 'CN'
  if (euCountries.includes(country)) return 'EU'
  return 'US' // default
}

export function GeoPromotion() {
  const { country } = useGeo()
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const region = getRegion(country)
  const content = regionalContent[region]?.[locale] || regionalContent[region]?.en

  if (!content?.promotion && !content?.shipping) {
    // Use default from i18n
    const defaultPromo = t(locale, 'geo.default.promotion')
    const defaultShipping = t(locale, 'geo.default.shipping')
    if (!defaultPromo && !defaultShipping) return null
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        {defaultPromo && <p className="text-blue-800 font-medium">🎉 {defaultPromo}</p>}
        {defaultShipping && <p className="text-blue-600 text-sm mt-1">🚢 {defaultShipping}</p>}
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      {content.promotion && <p className="text-blue-800 font-medium">🎉 {content.promotion}</p>}
      {content.shipping && <p className="text-blue-600 text-sm mt-1">🚢 {content.shipping}</p>}
    </div>
  )
}
