'use client'

import Image from 'next/image'
import { optImagePath } from '@/lib/optImages'
import { type Locale, t } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, productDescriptions, pick } from '@/lib/productI18n'
import { productGuides } from '@/lib/productGuides'

interface ProductGridProps { locale?: Locale }

export default function ProductGrid({ locale = 'en' }: ProductGridProps) {
  return (
    <section id="products" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{t(locale, 'products.title')}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'products.subtitle')}</p>

        {/* Responsive grid: 1col sm → 2col md → 4col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {allProducts.map((product) => {
            const name = pick(productNames[product.slug], locale)
            const desc = pick(productDescriptions[product.slug], locale)
            const guide = productGuides[product.slug]
            const imageHref = guide ? `/${locale}/industry/${guide}` : `/${locale}/products/${product.slug}`

            return (
              <div key={product.slug} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
                {/* Image - clickable link to article for SEO internal link juice */}
                <a href={imageHref} className="block relative h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image src={optImagePath(product.image, 'thumb')} alt={name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" loading="lazy" quality={78} />
                </a>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 flex flex-col">
                  <a href={`/${locale}/products/${product.slug}`} className="block hover:text-primary-700 transition-colors">
                    <h3 className="font-bold text-primary-900 text-sm md:text-base lg:text-lg mb-1">{name}</h3>
                  </a>
                  <p className="hidden sm:block text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{desc}</p>

                  <div className="space-y-1.5 text-xs md:text-sm mt-auto">
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.specification')}:</span><span className="font-medium text-right truncate ml-2" title={product.specs.size}>{product.specs.size}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.standard')}:</span><span className="font-medium text-right truncate ml-2">{product.specs.standard}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.moq')}:</span><span className="font-medium">{product.minOrder || (locale === 'zh' ? '1 吨' : '1 ton')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.lead')}:</span><span className="font-medium">{product.leadTime || (locale === 'zh' ? '15-20 天' : '15-20 days')}</span></div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-gray-500 text-xs md:text-sm">{locale === 'zh' ? '工厂直供 · 按需报价' : 'Factory direct · quote on request'}</span>
                    <a href={`/${locale}#inquiry`} className="bg-primary-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-800 transition-colors whitespace-nowrap">
                      {t(locale, 'products.inquiry')}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a href={`/${locale}/products`} className="inline-flex items-center gap-2 border border-primary-700 text-primary-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 hover:text-white transition-colors">
            {locale === 'zh' ? '查看全部产品' : 'View all products'} →
          </a>
        </div>
      </div>
    </section>
  )
}
