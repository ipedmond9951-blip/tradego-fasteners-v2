'use client'

import { useGeo } from '@/contexts/GeoContext'
import { t } from '@/i18n'
import { useParams } from 'next/navigation'
import type { Locale } from '@/i18n'

const regionalContent: Record<string, Record<string, { promotion: string; shipping: string; payment: string }>> = {
  US: {
    en: { promotion: 'Free shipping on orders over $500', shipping: 'Delivery in 7-10 business days via sea freight', payment: 'Accepted: T/T, L/C, PayPal' },
    zh: { promotion: '', shipping: '', payment: '' },
  },
  ZA: {
    en: { promotion: 'Bulk discount for Africa market — up to 15% off', shipping: 'Sea freight to Durban, 25-30 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '非洲市场批量折扣 — 最高15%优惠', shipping: '海运至德班，25-30天', payment: '接受付款: T/T, L/C, 支付宝, 微信支付' },
  },
  EU: {
    en: { promotion: 'CE certified products available', shipping: 'Delivery to EU ports in 20-25 days', payment: 'Accepted: T/T, L/C, PayPal' },
    zh: { promotion: '提供CE认证产品', shipping: '海运至欧盟港口，20-25天', payment: '接受付款: T/T, L/C, PayPal' },
  },
  CN: {
    en: { promotion: '', shipping: '', payment: '' },
    zh: { promotion: '国内客户享批发价，量大从优', shipping: '国内包邮，3-5天送达', payment: '接受: 支付宝, 微信支付, 银行转账' },
  },
  // Additional African countries
  NG: {
    en: { promotion: 'Nigeria bulk orders welcome — up to 15% discount', shipping: 'Sea freight to Lagos, 30-35 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '尼日利亚批量订单优惠 — 最高15%折扣', shipping: '海运至拉各斯，30-35天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  KE: {
    en: { promotion: 'Kenya construction projects — SABS certified fasteners', shipping: 'Sea freight to Mombasa, 28-32 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '肯尼亚建筑项目 — SABS认证紧固件', shipping: '海运至蒙巴萨，28-32天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  GH: {
    en: { promotion: 'Ghana market — competitive pricing for bulk orders', shipping: 'Sea freight to Tema, 30-35 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '加纳市场 — 批量订单优惠价格', shipping: '海运至特马，30-35天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  TZ: {
    en: { promotion: 'Tanzania projects — SABS compliant fasteners available', shipping: 'Sea freight to Dar es Salaam, 28-33 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '坦桑尼亚项目 — SABS认证紧固件', shipping: '海运至达累斯萨拉姆，28-33天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  MZ: {
    en: { promotion: 'Mozambique bulk orders — up to 15% discount', shipping: 'Sea freight to Maputo, 25-30 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '莫桑比克批量订单 — 最高15%折扣', shipping: '海运至马普托，25-30天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  ZW: {
    en: { promotion: 'Zimbabwe customers — factory direct pricing', shipping: 'Sea freight to Beira, 28-33 days', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '津巴布韦客户 — 工厂直供价格', shipping: '海运至贝拉，28-33天', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
  ZM: {
    en: { promotion: 'Zambia construction — CE & SABS certified products', shipping: 'Sea freight to Durban, 30-35 days + transit', payment: 'Accepted: T/T, L/C, Alipay, WeChat Pay' },
    zh: { promotion: '赞比亚建筑项目 — CE和SABS认证产品', shipping: '海运至德班，30-35天+陆运', payment: '接受付款: T/T, L/C, 支付宝, 微信' },
  },
}

function getRegion(country: string): string {
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'PL', 'SE', 'DK', 'FI', 'IE']
  const africanCountries = ['ZA', 'NG', 'KE', 'GH', 'TZ', 'MZ', 'ZW', 'ZM', 'ET', 'RW', 'UG', 'AO', 'BW', 'MW']
  if (country === 'US' || country === 'CA') return 'US'
  if (africanCountries.includes(country)) return country // Return country-specific content
  if (country === 'CN' || country === 'HK' || country === 'TW') return 'CN'
  if (euCountries.includes(country)) return 'EU'
  return 'US' // default
}

export function GeoPromotion() {
  const { country } = useGeo()
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const region = getRegion(country)
  
  // Try country-specific content first, then fall back to region, then to default
  const content = regionalContent[country]?.[locale] 
    || regionalContent[country]?.en
    || regionalContent[region]?.[locale]
    || regionalContent[region]?.en

  if (!content?.promotion && !content?.shipping) {
    // Use default from i18n
    const defaultPromo = t(locale, 'geo.default.promotion')
    const defaultShipping = t(locale, 'geo.default.shipping')
    if (!defaultPromo && !defaultShipping) return null
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        {defaultPromo && <p className="text-primary-800 font-medium">🎉 {defaultPromo}</p>}
        {defaultShipping && <p className="text-primary-600 text-sm mt-1">🚢 {defaultShipping}</p>}
      </div>
    )
  }

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
      {content.promotion && <p className="text-primary-800 font-medium">🎉 {content.promotion}</p>}
      {content.shipping && <p className="text-primary-600 text-sm mt-1">🚢 {content.shipping}</p>}
      {content.payment && <p className="text-primary-600 text-sm mt-1">💳 {content.payment}</p>}
    </div>
  )
}
