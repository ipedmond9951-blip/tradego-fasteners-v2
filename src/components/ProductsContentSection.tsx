'use client'

import { type Locale } from '@/i18n'
import { appLabels, pick } from '@/lib/uiCopy'
import { productsContent } from '@/lib/productsContentI18n'

interface ProductsContentSectionProps {
  locale: Locale
}

export default function ProductsContentSection({ locale }: ProductsContentSectionProps) {
  // Fallback to English for unsupported locales
  const texts = productsContent[locale] || productsContent.en

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Selection Guide */}
      <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">{texts.title}</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.selectionGuide}</p>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Assurance */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">{texts.qualityTitle}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.qualityText}</p>
          </div>
        </section>

        {/* Shipping */}
        <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">{texts.shippingTitle}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{texts.shippingText}</p>
          </div>
        </section>
      </div>

      {/* Industry Applications */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6">{texts.applicationsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">🏗️ {pick(appLabels.construction, locale)}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.constructionText}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">⛏️ {pick(appLabels.mining, locale)}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.miningText}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-primary-800 mb-2">☀️ {pick(appLabels.solar, locale)}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{texts.solarText}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
