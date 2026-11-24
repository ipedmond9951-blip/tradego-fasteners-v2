'use client'

import Image from 'next/image'
import { type Locale, t } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, productDescriptions, pick } from '@/lib/productI18n'
import { productGuides } from '@/lib/productGuides'
import { productCategories, featuredSlugs } from '@/lib/productCategories'
import { productGridCopy } from '@/lib/uiCopy'

interface ProductGridProps { locale?: Locale }

const heading: Record<string, { featured: string; featuredSub: string; all: string; inStock: string; tag: string }> = {
  en: { featured: 'Featured products', featuredSub: 'Our most requested lines for Zimbabwe and Southern Africa — factory direct, quote on request.', all: 'All products by category', inStock: '59 lines in the production programme', tag: 'Bestseller' },
  zh: { featured: '重点推荐', featuredSub: '面向津巴布韦与南部非洲最常被询价的品类，工厂直供、按需报价。', all: '全部产品（按品类）', inStock: '59 个品类常备生产', tag: '主推' },
  es: { featured: 'Productos destacados', featuredSub: 'Las líneas más solicitadas para Zimbabue y el sur de África.', all: 'Todos los productos por categoría', inStock: '59 líneas en programa', tag: 'Más vendido' },
  fr: { featured: 'Produits phares', featuredSub: 'Nos lignes les plus demandées pour le Zimbabwe et l’Afrique australe.', all: 'Tous les produits par catégorie', inStock: '59 lignes au programme', tag: 'Best-seller' },
  pt: { featured: 'Produtos em destaque', featuredSub: 'As linhas mais procuradas para o Zimbabué e a África Austral.', all: 'Todos os produtos por categoria', inStock: '59 linhas em catálogo', tag: 'Mais vendido' },
  ar: { featured: 'منتجات مميزة', featuredSub: 'أكثر الخطوط طلبًا لزيمبابوي والجنوب الأفريقي.', all: 'كل المنتجات حسب الفئة', inStock: '59 خط إنتاج', tag: 'الأكثر طلبًا' },
  ru: { featured: 'Рекомендуемые товары', featuredSub: 'Наиболее востребованные позиции для Зимбабве и Юга Африки.', all: 'Все товары по категориям', inStock: '59 позиций в программе', tag: 'Хит' },
  ja: { featured: 'おすすめ製品', featuredSub: 'ジンバブエ・南部アフリカで最も問い合わせの多い品目。', all: 'カテゴリー別 全製品', inStock: '59品目を生産', tag: '人気' },
  de: { featured: 'Empfohlene Produkte', featuredSub: 'Die gefragtesten Artikel für Simbabwe und das südliche Afrika.', all: 'Alle Produkte nach Kategorie', inStock: '59 Artikel im Programm', tag: 'Bestseller' },
  hi: { featured: 'विशेष रूप से अनुशंसित', featuredSub: 'ज़िम्बाब्वे और दक्षिणी अफ्रीका के लिए सबसे ज़्यादा पूछे जाने वाले उत्पाद।', all: 'श्रेणी अनुसार सभी उत्पाद', inStock: '59 उत्पाद श्रेणियाँ', tag: 'लोकप्रिय' },
}

export default function ProductGrid({ locale = 'en' }: ProductGridProps) {
  const h = heading[locale] || heading.en
  const byslug = new Map(allProducts.map(p => [p.slug, p]))
  const featured = featuredSlugs.map(s => byslug.get(s)).filter(Boolean)

  const renderCard = (product: (typeof allProducts)[number], big = false) => {
    const name = pick(productNames[product.slug], locale)
    const desc = pick(productDescriptions[product.slug], locale)
    const guide = productGuides[product.slug]
    const imageHref = guide ? `/${locale}/industry/${guide}/` : `/${locale}/products/${product.slug}/`

    return (
      <div key={product.slug} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
        <a href={imageHref} className={`block relative ${big ? 'h-48 md:h-56' : 'h-40 sm:h-44 lg:h-48'} bg-gradient-to-br from-gray-100 to-gray-200`}>
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover"
            sizes={big ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
            loading="lazy"
            quality={78}
          />
        </a>

        <div className={`flex-1 ${big ? 'p-5 md:p-6' : 'p-4 md:p-5'} flex flex-col`}>
          <a href={`/${locale}/products/${product.slug}/`} className="block hover:text-primary-700 transition-colors">
            <h3 className={`${big ? 'text-base md:text-lg' : 'text-sm md:text-base'} font-bold text-primary-900 mb-1`}>{name}</h3>
          </a>
          {desc && <p className="hidden sm:block text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{desc}</p>}

          <div className="space-y-1.5 text-xs md:text-sm mt-auto">
            <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">{t(locale, 'products.specification')}:</span><span className="font-medium text-right truncate" title={product.specs.size}>{product.specs.size}</span></div>
            <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">{t(locale, 'products.standard')}:</span><span className="font-medium text-right truncate">{product.specs.standard}</span></div>
            <div className="flex justify-between gap-2"><span className="text-gray-500 shrink-0">{t(locale, 'products.moq')}:</span><span className="font-medium">{product.minOrder || pick(productGridCopy.moqTon, locale)}</span></div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <span className="text-gray-500 text-xs md:text-sm">{pick(productGridCopy.quoteNote, locale)}</span>
            <a href={`/${locale}/#inquiry`} className="bg-primary-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-800 transition-colors whitespace-nowrap">
              {t(locale, 'products.inquiry')}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="products" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{t(locale, 'products.title')}</h2>
        <p className="text-gray-600 text-center mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'products.subtitle')}</p>

        {/* 品类锚点导航：全部 59 个品类一屏可达 */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {productCategories.map(cat => (
            <a
              key={cat.key}
              href={`#cat-${cat.key}`}
              className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:border-primary-600 hover:text-primary-700 transition-colors"
            >
              {cat.label[locale] || cat.label.en}
              <span className="ml-1 text-gray-400">{cat.slugs.length}</span>
            </a>
          ))}
        </div>

        {/* 重点推荐 */}
        <div className="mb-5">
          <h3 className="text-xl md:text-2xl font-bold text-primary-900">{h.featured}</h3>
          <p className="text-gray-600 text-xs md:text-sm mt-1 max-w-3xl">{h.featuredSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-14">
          {featured.map(p => p && (
            <div key={p.slug} className="relative">
              <span className="absolute z-10 left-3 top-3 rounded-full bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 shadow">
                {h.tag}
              </span>
              {renderCard(p, true)}
            </div>
          ))}
        </div>

        {/* 全品类分区 */}
        <h3 className="text-xl md:text-2xl font-bold text-primary-900 mb-1">{h.all}</h3>
        <p className="text-gray-600 text-xs md:text-sm mb-8">{h.inStock.replace('59', String(allProducts.length))}</p>

        <div className="space-y-12">
          {productCategories.map(cat => {
            const items = cat.slugs.map(s => byslug.get(s)).filter(Boolean)
            return (
              <div key={cat.key} id={`cat-${cat.key}`} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-gray-200 pb-2 mb-5">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900">
                    {cat.label[locale] || cat.label.en}
                    <span className="ml-2 text-sm font-normal text-gray-400">{items.length}</span>
                  </h4>
                  <p className="text-gray-500 text-xs md:text-sm max-w-xl">{cat.blurb[locale] || cat.blurb.en}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                  {items.map(p => p && renderCard(p))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <a href={`/${locale}/products/`} className="inline-flex items-center gap-2 border border-primary-700 text-primary-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 hover:text-white transition-colors">
            {pick(productGridCopy.viewAll, locale)} →
          </a>
        </div>
      </div>
    </section>
  )
}
