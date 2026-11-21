import { type Locale, t, locales } from '@/i18n'
import type { Metadata } from 'next'
import MaterialsSection from '@/components/MaterialsSection'
import ProductSearchSection from '@/components/ProductSearchSection'
import ProductSchema from '@/components/ProductSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import ProductsContentSection from '@/components/ProductsContentSection'
import StatisticsSection from '@/components/StatisticsSection'

import { allProducts } from '@/lib/products'
const productText: Record<string, Record<string, string>> = {
  en: { drywall: 'Drywall Screws', selfdrilling: 'Self-Drilling Screws', bolts: 'Bolts & Nuts', ibr: 'IBR Nails', anchor: 'Anchor Bolts', washers: 'Washers', coach: 'Coach Screws', threaded: 'Threaded Rods' },
  zh: { drywall: '干墙钉', selfdrilling: '自钻螺丝', bolts: '螺栓螺母', ibr: 'IBR钉', anchor: '地脚螺栓', washers: '垫圈', coach: '木螺丝', threaded: '螺杆' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  const titles: Record<string, string> = {
    en: 'Fastener Products Wholesale | TradeGo Fasteners',
    zh: '紧固件产品批发 | TradeGo',
  }
  const descriptions: Record<string, string> = {
    en: 'Wholesale 304/316 stainless hex bolts, Grade 8.8/10.9 structural bolts, drywall/TEK screws, lock nuts, IBR nails. ISO 9001 certified. Ships to Africa.',
    zh: '批发304/316不锈钢螺栓、8.8/10.9级结构螺栓、干墙/自钻螺丝、锁紧螺母、IBR钉。ISO 9001认证。',
  }
  
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${siteUrl}/${locale}/products`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/products`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/${locale}/products`],
        ...locales.map(l => [l, `${siteUrl}/${l}/products`]),
      ]),
    },
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const texts = productText[locale] || productText.en

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t(locale, 'products.allProducts')}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">{t(locale, 'products.subtitle')}</p>
          {/* Search Section - Client Component */}
          <ProductSearchSection
            products={allProducts}
            locale={locale}
            texts={texts}
          />
        </div>
      </section>

      {/* Materials & Finishes Section */}
      <MaterialsSection locale={locale} />

      {/* Statistics Section - E-E-A-T signals */}
      <StatisticsSection locale={locale} />

      {/* Unique Content Section - Helps with SEO indexing */}
      <ProductsContentSection locale={locale} />

      {/* Product Schema for SEO */}
      <ProductSchema products={allProducts} locale={locale} />

      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema locale={locale} pageName="Products" pageUrl="/products" />

    </div>
  )
}
