'use client'

import { useState } from 'react'
import { type Locale, t } from '@/i18n'

interface InquiryFormProps { locale?: Locale }

export default function InquiryForm({ locale = 'en' }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Track GA4 conversion event
  const trackConversion = (eventName: string, params: Record<string, string>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = {
      name: (form.name as any).value,
      email: (form.email as any).value,
      company: (form.company as any).value,
      country: (form.country as any).value,
      products: (form.products as any).value,
      quantity: (form.quantity as any).value,
      message: (form.message as any).value,
    }
    try {
      const res = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) {
        setSubmitted(true)
        // Fire GA4 conversion event for inquiry form submission
        trackConversion('submit_inquiry', {
          event_category: 'engagement',
          inquiry_product: data.products || 'not_selected',
          inquiry_country: data.country || 'not_provided',
          locale: locale,
        })
      }
    } catch {}
    setLoading(false)
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
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.name')} *</label>
              <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.email')} *</label>
              <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.company')}</label>
              <input name="company" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.country')}</label>
              <input name="country" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.products')}</label>
            <select name="products" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">{t(locale, 'inquiry.selectProduct')}</option>
              <option value="drywall">Drywall Screws</option>
              <option value="self-drilling">Self-Drilling Screws</option>
              <option value="bolts">Bolts & Nuts</option>
              <option value="ibr">IBR Nails</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.quantity')}</label>
            <input name="quantity" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="e.g. 5 tons" />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.message')}</label>
            <textarea name="message" rows={3} className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-primary-700 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors disabled:opacity-50 text-sm md:text-base">
              {loading ? '...' : t(locale, 'inquiry.submit')}
            </button>
            <a
              href="https://wa.me/8615963409951"
              target="_blank"
              rel="noopener noreferrer"
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
