import { type Locale, t, locales } from '@/i18n'
import type { Metadata } from 'next'
import MaterialsSection from '@/components/MaterialsSection'
import ProductSearchSection from '@/components/ProductSearchSection'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { navLabels, pick } from '@/lib/uiCopy'
import { clampDescription } from '@/lib/seo'
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
    es: 'Fijaciones al por mayor | TradeGo Fasteners',
    fr: 'Fixations en gros | TradeGo Fasteners',
    pt: 'Fixadores no atacado | TradeGo Fasteners',
    ar: 'مثبتات بالجملة | TradeGo Fasteners',
    ru: 'Крепёж оптом | TradeGo Fasteners',
    ja: 'ファスナー卸売 | TradeGo Fasteners',
    de: 'Verbindungselemente im Großhandel | TradeGo Fasteners',
    hi: 'फास्टनर थोक | TradeGo Fasteners',
  }
  const descriptions: Record<string, string> = {
    en: 'Wholesale 304/316 stainless hex bolts, Grade 8.8/10.9 structural bolts, drywall/TEK screws, lock nuts, IBR nails. SGS/BV inspection on request. Ships to Africa.',
    zh: '批发304/316不锈钢螺栓、8.8/10.9级结构螺栓、干墙/自钻螺丝、锁紧螺母、IBR钉。按 SABS 1195 / DIN / ISO 规格生产。',
    es: 'Mayorista de pernos inox 304/316, pernos estructurales 8.8/10.9, tornillos para pladur y TEK, tuercas de bloqueo y clavos IBR. Producción según SABS 1195 / DIN / ISO; certificados por pedido. Envíos a África.',
    fr: 'Grossiste en boulons inox 304/316, boulons de structure 8.8/10.9, vis à plaque de plâtre et TEK, écrous de blocage et clous IBR. Production selon SABS 1195 / DIN / ISO ; certificats sur demande. Expéditions vers l’Afrique.',
    pt: 'Atacado de parafusos inox 304/316, parafusos estruturais 8.8/10.9, parafusos para gesso e TEK, porcas de travamento e pregos IBR. Produção segundo SABS 1195 / DIN / ISO; certificados sob pedido. Envios para a África.',
    ar: 'بيع بالجملة لبراغي الستانلس 304/316 والبراغي الإنشائية 8.8/10.9 وبراغي الجبس وTEK وصواميل القفل ومسامير IBR. وفق SABS 1195 / DIN / ISO. شحن إلى أفريقيا.',
    ru: 'Оптовая продажа болтов из нержавеющей стали 304/316, конструкционных болтов 8.8/10.9, саморезов для ГКЛ и TEK, стопорных гаек и гвоздей IBR. По SABS 1195 / DIN / ISO. Отгрузка в Африку.',
    ja: 'ステンレス304/316ボルト、構造用8.8/10.9ボルト、石膏ボードねじ・TEKねじ、ロックナット、IBR釘の卸売。SABS 1195 / DIN / ISO 規格で製造。アフリカへ出荷。',
    de: 'Großhandel mit Edelstahlschrauben 304/316, Konstruktionsschrauben 8.8/10.9, Trockenbau- und TEK-Schrauben, Sicherungsmuttern und IBR-Nägeln. Gefertigt nach SABS 1195 / DIN / ISO. Versand nach Afrika.',
    hi: 'स्टेनलेस 304/316 बोल्ट, स्ट्रक्चरल 8.8/10.9 बोल्ट, ड्राईवॉल/TEK स्क्रू, लॉक नट और IBR नेल का थोक। ISO 9001 (ऑर्डर पर)। अफ्रीका तक शिपिंग।',
  }
  
  return {
    title: titles[locale] || titles.en,
    description: clampDescription(descriptions[locale] || descriptions.en, 155),
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${siteUrl}/${locale}/products/`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/products/`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/en/products/`],
        ...locales.map(l => [l, `${siteUrl}/${l}/products/`]),
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

      {/* 2026-11-26 P2-11: 列表页不再批量输出 Product/Offer 标记——详情页不展示价格、
          站点口径禁写具体报价、无真实库存，offers/price 断言与可见内容不一致，整块移除。 */}

      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema locale={locale} pageName={pick(navLabels.products, locale)} pageUrl="/products" />

    </div>
  )
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
