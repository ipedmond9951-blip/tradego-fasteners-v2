'use client'

import { useEffect, useRef, useState } from 'react'
import { type Locale, t } from '@/i18n'
import { trackGA4Event } from '@/components/Analytics'
import { inquiryOptionCopy, pick } from '@/lib/uiCopy'

interface InquiryFormProps { locale?: Locale }

export default function InquiryForm({ locale = 'en' }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [undelivered, setUndelivered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [certRequested, setCertRequested] = useState(false)
  // 表单进入页面的时刻，用来算"填表时长"；脚本通常瞬间提交
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  // Track GA4 conversion event
  // 2026-11-23 修：站点未加载 gtag.js，window.gtag 恒为 undefined，
  // 事件全被挡掉。改为走自建 Measurement Protocol 的 trackGA4Event。
  const trackConversion = (eventName: string, params: Record<string, string>) => {
    trackGA4Event(eventName, params)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const val = (field: string) => {
      const el = form.elements.namedItem(field)
      return el && 'value' in el ? String((el as unknown as HTMLInputElement).value) : ''
    }
    const data = {
      name: val('name'),
      email: val('email'),
      company: val('company'),
      phone: val('phone'),
      country: val('country'),
      products: val('products'),
      quantity: val('quantity'),
      message: [val('message'), certRequested ? '\n[Certificate request] Attach ISO 9001 / SABS / CE certificates with this order; cost and lead time quoted separately.' : ''].filter(Boolean).join(''),
      // 反滥用元数据：蜜罐字段（真人不会填）+ 填表耗时
      _honeypot: val('website'),
      _elapsed: mountedAt.current ? Date.now() - mountedAt.current : -1,
    }
    try {
      const res = await fetch('/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const body = (await res.json().catch(() => null)) as { delivered?: boolean } | null
      // 只有确认真的投递出去才算成功；否则引导客户直接联系，避免询盘静默丢失
      if (res.ok && body?.delivered !== false) {
        setSubmitted(true)
        // Fire GA4 conversion event for inquiry form submission
        trackConversion('submit_inquiry', {
          event_category: 'engagement',
          inquiry_product: data.products || 'not_selected',
          inquiry_country: data.country || 'not_provided',
          locale: locale,
        })
      } else {
        setUndelivered(true)
      }
    } catch {
      setUndelivered(true)
    }
    setLoading(false)
  }

  if (undelivered) {
    return (
      <section id="inquiry" className="py-12 md:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 text-center">
            <div className="text-3xl md:text-4xl mb-3">⚠️</div>
            <p className="text-primary-900 font-semibold mb-5 text-sm md:text-base">{t(locale, 'inquiry.fallback')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/8615963409951"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('click_whatsapp', { event_category: 'engagement', event_label: 'inquiry_fallback_button', locale: locale })}
                className="flex-1 bg-green-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-green-500 transition-colors text-sm md:text-base"
              >
                💬 {t(locale, 'inquiry.whatsapp')}
              </a>
              <a
                href="mailto:inquiry@tradego-fasteners.com"
                onClick={() => trackConversion('click_email', { event_category: 'engagement', event_label: 'inquiry_fallback_email', locale: locale })}
                className="flex-1 bg-primary-700 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors text-sm md:text-base"
              >
                ✉️ {t(locale, 'inquiry.emailUs')}
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (submitted) {
    return (
      <section id="inquiry" className="py-12 md:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl md:text-5xl mb-4">✅</div>
          <h2 className="text-lg md:text-2xl font-bold text-primary-900">{t(locale, 'inquiry.success')}</h2>
        </div>
      </section>
    )
  }

  return (
    <section id="inquiry" className="py-12 md:py-20 bg-primary-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{t(locale, 'inquiry.title')}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-xl mx-auto text-sm md:text-base">{t(locale, 'inquiry.subtitle')}</p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label htmlFor="inquiry-name" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.name')} *</label>
              <input id="inquiry-name" name="name" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="inquiry-email" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.email')} *</label>
              <input id="inquiry-email" name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="inquiry-company" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.company')}</label>
              <input id="inquiry-company" name="company" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="inquiry-phone" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.phone')}</label>
              <input id="inquiry-phone" name="phone" type="tel" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="+263..." />
            </div>
            <div>
              <label htmlFor="inquiry-country" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.country')}</label>
              <input id="inquiry-country" name="country" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label htmlFor="inquiry-products" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.products')}</label>
            <select id="inquiry-products" name="products" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">{t(locale, 'inquiry.selectProduct')}</option>
              <option value="drywall">{pick(inquiryOptionCopy[0], locale)}</option>
              <option value="self-drilling">{pick(inquiryOptionCopy[1], locale)}</option>
              <option value="bolts">{pick(inquiryOptionCopy[2], locale)}</option>
              <option value="ibr">{pick(inquiryOptionCopy[3], locale)}</option>
              <option value="anchor">{pick(inquiryOptionCopy[4], locale)}</option>
              <option value="washers">{pick(inquiryOptionCopy[5], locale)}</option>
              <option value="coach">{pick(inquiryOptionCopy[6], locale)}</option>
              <option value="threaded">{pick(inquiryOptionCopy[7], locale)}</option>
              <option value="other">{pick(inquiryOptionCopy[8], locale)}</option>
            </select>
          </div>
          <div>
            <label htmlFor="inquiry-quantity" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.quantity')}</label>
            <input id="inquiry-quantity" name="quantity" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g. 5 tons" />
          </div>
          <div>
            <label className="flex items-start gap-2 text-xs md:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={certRequested}
                onChange={(e) => setCertRequested(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-primary-700 border-gray-300 rounded"
              />
              <span>{t(locale, 'inquiry.certNote')}</span>
            </label>

            <label htmlFor="inquiry-message" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.message')}</label>
            <textarea id="inquiry-message" name="message" rows={3} className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          {/* 反垃圾蜜罐：真人看不见也跳不过去，被填写即判为脚本提交 */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none">
            <label htmlFor="inquiry-website">Website</label>
            <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading} aria-label={t(locale, 'inquiry.submit') + " - Submit your inquiry"} className="flex-1 bg-primary-700 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors disabled:opacity-50 text-sm md:text-base">
              {loading ? '...' : t(locale, 'inquiry.submit')}
            </button>
            <a
              href="https://wa.me/8615963409951"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact via WhatsApp for quick response"
              onClick={() => trackConversion('click_whatsapp', { event_category: 'engagement', event_label: 'inquiry_form_button', locale: locale })}
              className="flex-1 bg-green-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-green-500 transition-colors text-center text-sm md:text-base"
            >
              💬 {t(locale, 'inquiry.whatsapp')}
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}
