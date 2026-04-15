'use client'

import { useState } from 'react'
import { type Locale, t } from '@/i18n'

interface InquiryFormProps { locale?: Locale }

export default function InquiryForm({ locale = 'en' }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
      if (res.ok) setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  if (submitted) {
    return (
      <section id="inquiry" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-blue-900">{t(locale, 'inquiry.success')}</h2>
        </div>
      </section>
    )
  }

  return (
    <section id="inquiry" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">{t(locale, 'inquiry.title')}</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{t(locale, 'inquiry.subtitle')}</p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.name')} *</label>
              <input name="name" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.email')} *</label>
              <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.company')}</label>
              <input name="company" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.country')}</label>
              <input name="country" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.products')}</label>
            <select name="products" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">{t(locale, 'inquiry.selectProduct')}</option>
              <option value="drywall">Drywall Screws</option>
              <option value="self-drilling">Self-Drilling Screws</option>
              <option value="bolts">Bolts & Nuts</option>
              <option value="ibr">IBR Nails</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.quantity')}</label>
            <input name="quantity" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. 5 tons" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t(locale, 'inquiry.message')}</label>
            <textarea name="message" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:opacity-50">
              {loading ? '...' : t(locale, 'inquiry.submit')}
            </button>
            <a
              href="https://wa.me/8615963409951"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 transition-colors text-center"
            >
              💬 {t(locale, 'inquiry.whatsapp')}
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}
