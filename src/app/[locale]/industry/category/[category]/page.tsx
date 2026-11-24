import { type Locale, locales } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles, isThinArticle } from '@/lib/articles'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { optImagePath } from '@/lib/optImages'
import { notFound } from 'next/navigation'
import { categoryPageCopy, navLabels, pick } from '@/lib/uiCopy'
import { categorySlug } from '@/lib/categoryLabels'

// 23 unique categories in 224 articles (2026-07-16 scan)
// Slug = lowercase + spaces → hyphens (保留 hyphen like "Procurement Guide - Africa" → "procurement-guide-africa")
const CATEGORY_SLUGS: Record<string, string> = {}
const SLUG_TO_CATEGORY: Record<string, string> = {}

const slugifyCategory = categorySlug

// Build at import time
{
  const cats = Array.from(new Set(
    getAllArticles().map(a => a.category).filter(Boolean)
  ))
  for (const cat of cats) {
    const slug = slugifyCategory(cat)
    CATEGORY_SLUGS[cat] = slug
    SLUG_TO_CATEGORY[slug] = cat
  }
}

// Category i18n labels
const CATEGORY_I18N: Record<string, Record<string, string>> = {
  "Technical Guide": {
    en: "Technical Guides", zh: "技术指南", es: "Guías Técnicas", ar: "الأدلة التقنية",
    fr: "Guides Techniques", pt: "Guias Técnicos", ru: "Технические руководства",
    ja: "技術ガイド", de: "Technische Anleitungen", hi: "तकनीकी गाइड"
  },
  "Market Analysis": {
    en: "Market Analysis", zh: "市场分析", es: "Análisis de Mercado", ar: "تحليل السوق",
    fr: "Analyse de Marché", pt: "Análise de Mercado", ru: "Анализ рынка",
    ja: "市場分析", de: "Marktanalyse", hi: "बाज़ार विश्लेषण"
  },
  "Procurement Guide": {
    en: "Procurement Guides", zh: "采购指南", es: "Guías de Adquisición", ar: "أدلة الشراء",
    fr: "Guides d'Approvisionnement", pt: "Guias de Aquisição", ru: "Руководства по закупкам",
    ja: "調達ガイド", de: "Beschaffungsleitfäden", hi: "खरीद गाइड"
  },
  "Regional Supplier": {
    en: "Regional Suppliers", zh: "区域供应商", es: "Proveedores Regionales", ar: "الموردون الإقليميون",
    fr: "Fournisseurs Régionaux", pt: "Fornecedores Regionais", ru: "Региональные поставщики",
    ja: "地域サプライヤー", de: "Regionale Lieferanten", hi: "क्षेत्रीय आपूर्तिकर्ता"
  },
  "Product Guide": {
    en: "Product Guides", zh: "产品指南", es: "Guías de Producto", ar: "أدلة المنتج",
    fr: "Guides Produit", pt: "Guias de Produto", ru: "Руководства по продукту",
    ja: "製品ガイド", de: "Produktanleitungen", hi: "उत्पाद गाइड"
  },
  "Industry Guide": {
    en: "Industry Guides", zh: "行业指南", es: "Guías de Industria", ar: "أدلة الصناعة",
    fr: "Guides Sectoriels", pt: "Guias Setoriais", ru: "Отраслевые руководства",
    ja: "業界ガイド", de: "Branchenführer", hi: "उद्योग गाइड"
  },
  "Case Study": {
    en: "Case Studies", zh: "案例研究", es: "Estudios de Caso", ar: "دراسات الحالة",
    fr: "Études de Cas", pt: "Estudos de Caso", ru: "Тематические исследования",
    ja: "事例研究", de: "Fallstudien", hi: "केस स्टडीज़"
  },
  "Procurement Guide - Africa": {
    en: "Procurement Guides - Africa", zh: "采购指南 - 非洲", es: "Guías de Adquisición - África", ar: "أدلة الشراء - أفريقيا",
    fr: "Guides d'Approvisionnement - Afrique", pt: "Guias de Aquisição - África", ru: "Руководства по закупкам - Африка",
    ja: "調達ガイド - アフリカ", de: "Beschaffungsleitfäden - Afrika", hi: "खरीद गाइड - अफ्रीका"
  },
  "Logistics Guide": {
    en: "Logistics Guides", zh: "物流指南", es: "Guías de Logística", ar: "أدلة اللوجستيات",
    fr: "Guides Logistiques", pt: "Guias de Logística", ru: "Логистические руководства",
    ja: "物流ガイド", de: "Logistik-Leitfäden", hi: "लॉजिस्टिक्स गाइड"
  },
  "Market Guide": {
    en: "Market Guides", zh: "市场指南", es: "Guías de Mercado", ar: "أدلة السوق",
    fr: "Guides de Marché", pt: "Guias de Mercado", ru: "Руководства по рынку",
    ja: "市場ガイド", de: "Marktführer", hi: "बाज़ार गाइड"
  },
  "Supplier Directory": {
    en: "Supplier Directory", zh: "供应商目录", es: "Directorio de Proveedores", ar: "دليل الموردين",
    fr: "Annuaire des Fournisseurs", pt: "Diretório de Fornecedores", ru: "Каталог поставщиков",
    ja: "サプライヤーディレクトリ", de: "Lieferantenverzeichnis", hi: "आपूर्तिकर्ता निर्देशिका"
  },
  "Product Comparison": {
    en: "Product Comparisons", zh: "产品对比", es: "Comparaciones de Productos", ar: "مقارنات المنتجات",
    fr: "Comparaisons de Produits", pt: "Comparações de Produtos", ru: "Сравнения продуктов",
    ja: "製品比較", de: "Produktvergleiche", hi: "उत्पाद तुलना"
  },
  "Trade Guide": {
    en: "Trade Guides", zh: "贸易指南", es: "Guías Comerciales", ar: "أدلة التجارة",
    fr: "Guides Commerciaux", pt: "Guias de Comércio", ru: "Торговые руководства",
    ja: "貿易ガイド", de: "Handelsführer", hi: "व्यापार गाइड"
  },
  "Import Guide": {
    en: "Import Guides", zh: "进口指南", es: "Guías de Importación", ar: "أدلة الاستيراد",
    fr: "Guides d'Importation", pt: "Guias de Importação", ru: "Импортные руководства",
    ja: "輸入ガイド", de: "Importleitfäden", hi: "आयात गाइड"
  },
  "Price Guide": {
    en: "Price Guides", zh: "价格指南", es: "Guías de Precios", ar: "أدلة الأسعار",
    fr: "Guides de Prix", pt: "Guias de Preços", ru: "Ценовые руководства",
    ja: "価格ガイド", de: "Preis-Leitfäden", hi: "मूल्य गाइड"
  },
  "Energy": {
    en: "Energy Sector", zh: "能源行业", es: "Sector Energético", ar: "قطاع الطاقة",
    fr: "Secteur de l'Énergie", pt: "Setor de Energia", ru: "Энергетический сектор",
    ja: "エネルギーセクター", de: "Energiesektor", hi: "ऊर्जा क्षेत्र"
  },
  "Buying Guide": {
    en: "Buying Guides", zh: "购买指南", es: "Guías de Compra", ar: "أدلة الشراء",
    fr: "Guides d'Achat", pt: "Guias de Compra", ru: "Руководства по покупке",
    ja: "購入ガイド", de: "Kaufratgeber", hi: "खरीद गाइड"
  },
  "Mining Fasteners": {
    en: "Mining Fasteners", zh: "矿业紧固件", es: "Sujetadores Mineros", ar: "أدوات التثبيت للتعدين",
    fr: "Fixations Minières", pt: "Fixadores de Mineração", ru: "Горный крепёж",
    ja: "鉱業用ファスナー", de: "Bergbau-Befestigungselemente", hi: "खनन फास्टनर"
  },
  "Reference Guide": {
    en: "Reference Guides", zh: "参考指南", es: "Guías de Referencia", ar: "أدلة مرجعية",
    fr: "Guides de Référence", pt: "Guias de Referência", ru: "Справочные руководства",
    ja: "リファレンスガイド", de: "Referenzhandbücher", hi: "संदर्भ गाइड"
  },
  "Quality Standards": {
    en: "Quality Standards", zh: "质量标准", es: "Estándares de Calidad", ar: "معايير الجودة",
    fr: "Normes de Qualité", pt: "Padrões de Qualidade", ru: "Стандарты качества",
    ja: "品質基準", de: "Qualitätsstandards", hi: "गुणवत्ता मानक"
  },
  "Quality Guide": {
    en: "Quality Guides", zh: "质量指南", es: "Guías de Calidad", ar: "أدلة الجودة",
    fr: "Guides Qualité", pt: "Guias de Qualidade", ru: "Руководства по качеству",
    ja: "品質ガイド", de: "Qualitätsleitfäden", hi: "गुणवत्ता गाइड"
  },
  "Installation Guide": {
    en: "Installation Guides", zh: "安装指南", es: "Guías de Instalación", ar: "أدلة التركيب",
    fr: "Guides d'Installation", pt: "Guias de Instalação", ru: "Руководства по установке",
    ja: "インストールガイド", de: "Installationsanleitungen", hi: "इंस्टॉलेशन गाइड"
  },
  "Construction": {
    en: "Construction", zh: "建筑", es: "Construcción", ar: "البناء",
    fr: "Construction", pt: "Construção", ru: "Строительство",
    ja: "建設", de: "Bauwesen", hi: "निर्माण"
  },
  "Reference Guide - Africa": {
    en: "Reference Guides - Africa", zh: "参考指南 - 非洲", es: "Guías de Referencia - África", ar: "أدلة مرجعية - أفريقيا",
    fr: "Guides de Référence - Afrique", pt: "Guias de Referência - África", ru: "Справочные руководства - Африка",
    ja: "リファレンスガイド - アフリカ", de: "Referenzhandbücher - Afrika", hi: "संदर्भ गाइड - अफ्रीका"
  },
  "Anchors": {
    en: "Anchors", zh: "锚栓", es: "Anclajes", fr: "Ancrages", pt: "Chumbadores",
    ar: "مراسي التثبيت", ru: "Анкеры", ja: "アンカー", de: "Anker", hi: "एंकर"
  },
  "Screws": {
    en: "Screws", zh: "螺钉", es: "Tornillos", fr: "Vis", pt: "Parafusos",
    ar: "براغي", ru: "Саморезы и винты", ja: "ねじ", de: "Schrauben", hi: "स्क्रू"
  },
  "Nails": {
    en: "Nails", zh: "钉子", es: "Clavos", fr: "Clous", pt: "Pregos",
    ar: "مسامير", ru: "Гвозди", ja: "釘", de: "Nägel", hi: "कीलें"
  },
  "Waterproofing": {
    en: "Waterproofing", zh: "防水材料", es: "Impermeabilización", fr: "Étanchéité", pt: "Impermeabilização",
    ar: "العزل المائي", ru: "Гидроизоляция", ja: "防水", de: "Abdichtung", hi: "वॉटरप्रूफ़िंग"
  },
  "Fastener guide": {
    en: "Fastener Guide", zh: "紧固件指南", es: "Guía de fijaciones", fr: "Guide des fixations", pt: "Guia de fixadores",
    ar: "دليل المثبتات", ru: "Гид по крепежу", ja: "ファスナーガイド", de: "Verbindungselemente-Ratgeber", hi: "फास्टनर गाइड"
  },
}

export async function generateStaticParams() {
  // Pre-render all (locale × category) combinations
  const params: { locale: string; category: string }[] = []
  for (const locale of locales) {
    for (const slug of Object.keys(SLUG_TO_CATEGORY)) {
      params.push({ locale, category: slug })
    }
  }
  return params
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale: localeParam, category: catSlug } = await params
  const locale = (localeParam as Locale) || 'en'
  const cat = SLUG_TO_CATEGORY[catSlug]
  if (!cat) return { title: 'Category Not Found' }

  const siteUrl = 'https://www.tradego-fasteners.com'
  const catLabel = CATEGORY_I18N[cat]?.[locale] || cat
  const count = getAllArticles().filter(a => a.category === cat && !a.redirectTo).length
  // 2026-11-23: 分类页标题从"分类名 | 品牌"改成带篇数的价值主张，提升 SERP 点击意愿
  const title = locale === 'en'
    ? `${catLabel}: ${count} Fastener Guides`
    : `${catLabel} | TradeGo Fasteners`
  const description = pick(categoryPageCopy.desc, locale)(count, catLabel)

  return {
    title,
    description,
    openGraph: {
      title,
      description: pick(categoryPageCopy.ogDesc, locale)(catLabel),
      url: `${siteUrl}/${locale}/industry/category/${catSlug}/`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/industry/category/${catSlug}/`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/en/industry/category/${catSlug}/`],
        ...locales.map(l => [l, `${siteUrl}/${l}/industry/category/${catSlug}/`])
      ]),
    },
  }
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale: localeParam, category: catSlug } = await params
  const locale = (localeParam as Locale) || 'en'
  const cat = SLUG_TO_CATEGORY[catSlug]
  if (!cat) notFound()

  // 2026-11-23: 排除 redirectTo 空壳与 thin 文章，避免分类页把跳转页再链一遍
  const allArticles = getAllArticles()
    .filter(a => a.category === cat && !a.redirectTo && !isThinArticle(a))
    .sort((a, b) => {
      const da = a.date || a.updated || ''
      const db = b.date || b.updated || ''
      return db.localeCompare(da)
    })

  const catLabel = CATEGORY_I18N[cat]?.[locale] || cat

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-primary-200 mb-3">
            <Link href={`/${locale}/industry/`} className="hover:text-white">{pick(categoryPageCopy.allArticles, locale)}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{catLabel}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{catLabel}</h1>
          <p className="text-primary-200 text-base md:text-lg max-w-2xl">
            {pick(categoryPageCopy.count, locale)(allArticles.length)}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {allArticles.map((article) => {
              const title = article.title[locale] || article.title.en
              const excerpt = article.description[locale] || article.description.en
              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/industry/${article.slug}/`} prefetch={false}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={optImagePath(article.image, 'thumb')} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" />
                    <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{catLabel}</span>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime} min</span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-base md:text-lg mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mt-auto">
                      {excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                      Read more →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema
        locale={locale}
        pageName={catLabel}
        parentName={pick(navLabels.industry, locale)}
        parentUrl="/industry"
        pageUrl={`/industry/category/${catSlug}`}
      />
    </div>
  )
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
// 2026-11-25: content/ 已从函数包剔除(体积治理), 运行时不能再读磁盘 JSON。
export const dynamicParams = false
