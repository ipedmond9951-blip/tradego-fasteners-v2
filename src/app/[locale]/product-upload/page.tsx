'use client'

import { useState } from 'react'
import { type Locale, t } from '@/i18n'

export default function ProductUploadPage({ params }: { params: Promise<{ locale: string }> }) {
  const [localeParam] = useState('en')
  const locale = (localeParam as Locale) || 'en'
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    // Handle image preview
    const imageFile = form.image?.files?.[0]
    if (imageFile) {
      setPreviewUrl(URL.createObjectURL(imageFile))
    }

    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))

    // In production: POST /api/products with FormData
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'zh' ? '产品提交成功！' : 'Product Submitted Successfully!'}</h1>
          <p className="text-gray-600 mb-6">
            {locale === 'zh'
              ? '我们的团队将在24小时内审核您的产品信息。'
              : 'Our team will review your product information within 24 hours.'}
          </p>
          <a href={`/${locale}/products`} className="inline-flex items-center bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
            ← {t(locale, 'products.allProducts')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            📤 {locale === 'zh' ? '上传新产品' : 'Upload New Product'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {locale === 'zh'
              ? '填写产品信息，我们的团队将审核后发布到网站。'
              : 'Fill in the product details. Our team will review and publish it on the website.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {locale === 'zh' ? '产品名称（英文）' : 'Product Name (EN)'} *
              </label>
              <input name="nameEn" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" placeholder="Drywall Screws" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {locale === 'zh' ? '产品名称（中文）' : 'Product Name (ZH)'}
              </label>
              <input name="nameZh" className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" placeholder="干壁钉" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {locale === 'zh' ? '产品分类' : 'Category'} *
            </label>
            <select name="category" required className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500">
              <option value="">Select...</option>
              <option value="drywall-screws">Drywall Screws</option>
              <option value="self-drilling-screws">Self-Drilling Screws</option>
              <option value="bolts-nuts">Bolts & Nuts</option>
              <option value="ibr-nails">IBR Nails</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {locale === 'zh' ? '产品描述（英文）' : 'Description (EN)'} *
            </label>
            <textarea name="descEn" required rows={3} className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {locale === 'zh' ? '产品描述（中文）' : 'Description (ZH)'}
            </label>
            <textarea name="descZh" rows={3} className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500" />
          </div>

          {/* Specifications */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⚙️ {locale === 'zh' ? '技术规格' : 'Technical Specifications'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'size', label: 'Size', ph: '3.5-4.8mm × 25-100mm' },
                { key: 'material', label: 'Material', ph: 'C1022 Carbon Steel' },
                { key: 'standard', label: 'Standard', ph: 'DIN 7505 / GB/T 15856' },
                { key: 'finish', label: 'Surface Finish', ph: 'Phosphate, Black Oxide' },
                { key: 'grade', label: 'Grade/Class', ph: '4.8 / 8.8 / 10.9' },
                { key: 'moq', label: 'MOQ', ph: '1 ton' },
              ].map((spec) => (
                <div key={spec.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{spec.label}</label>
                  <input name={`spec_${spec.key}`} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" placeholder={spec.ph} />
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📷 {locale === 'zh' ? '产品图片' : 'Product Images'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Image *</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setPreviewUrl(URL.createObjectURL(file))
                  }}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm hover:border-primary-400 cursor-pointer"
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border" />
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Additional Images</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm hover:border-primary-400 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">Max 5 images, JPG/PNG, each under 5MB</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💰 {locale === 'zh' ? '定价信息' : 'Pricing Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price USD/piece</label>
                <input name="priceUsd" type="number" step="0.001" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="0.02" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'zh' ? '起订量' : 'MOQ'}</label>
                <input name="moq" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="1 ton" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'zh' ? '交货期' : 'Lead Time'}</label>
                <input name="leadTime" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="15-20 days" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-700 text-white py-3 rounded-lg font-bold hover:bg-primary-800 disabled:opacity-50 text-base transition-colors"
            >
              {loading ? '⏳ Submitting...' : '🚀 Submit Product'}
            </button>
            <a href={`/${locale}/products`} className="flex-1 text-center py-3 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-base">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
