import { Metadata } from 'next'
import Link from 'next/link'
import { locales, type Locale, t } from '@/i18n'
import { getFaq } from '@/lib/faqI18n'

const SITE = 'https://www.tradego-fasteners.com'

const titles: Record<string, string> = {
  en: 'Fastener FAQ - Sourcing, Specs and Shipping to Africa | TradeGo',
  zh: '紧固件常见问答 - 采购、规格与非洲海运 | TradeGo',
  es: 'Preguntas frecuentes sobre sujetadores - compras, especificaciones y envío a África | TradeGo',
  fr: 'FAQ fixations - achats, spécifications et expédition vers l\'Afrique | TradeGo',
  ar: 'الأسئلة الشائعة حول أدوات التثبيت - الشراء والمواصفات والشحن إلى أفريقيا | TradeGo',
  pt: 'Perguntas frequentes sobre fixadores - compras, especificações e envio para África | TradeGo',
  ru: 'Частые вопросы о крепеже - закупка, характеристики и доставка в Африку | TradeGo',
  ja: '締結部品FAQ - 調達・仕様・アフリカ輸送 | TradeGo',
  de: 'Befestigungselemente FAQ - Einkauf, Spezifikationen und Versand nach Afrika | TradeGo',
  hi: 'फास्टनर FAQ - खरीद, स्पेसिफिकेशन और अफ्रीका शिपिंग | TradeGo',
}

const descriptions: Record<string, string> = {
  en: '18 direct answers on fastener materials, finishes, MOQ, lead times and sea freight to Durban, Beira, Mombasa and Lagos, from a China-based manufacturer exporting to 20+ African markets since 2004.',
  zh: '18 个直接答案：材质、表面处理、起订量、交期，以及到德班、贝拉、蒙巴萨、拉各斯的海运时效。2004 年起向 20+ 非洲市场出口的中国制造商作答。',
  es: '18 respuestas directas sobre materiales, acabados, MOQ, plazos y flete marítimo a Durban, Beira, Mombasa y Lagos, de un fabricante chino que exporta a más de 20 mercados africanos desde 2004.',
  fr: '18 réponses directes sur les matériaux, finitions, MOQ, délais et fret maritime vers Durban, Beira, Mombasa et Lagos, par un fabricant chinois exportant vers plus de 20 marchés africains depuis 2004.',
  ar: '18 إجابة مباشرة عن المواد والتشطيبات والحد الأدنى للطلب ومُهل التسليم والشحن البحري إلى ديربان وبيرا ومومباسا ولاغوس، من مُصنّع صيني يُصدّر إلى أكثر من 20 سوقًا أفريقية منذ 2004.',
  pt: '18 respostas diretas sobre materiais, acabamentos, MOQ, prazos e frete marítimo para Durban, Beira, Mombasa e Lagos, de um fabricante chinês que exporta para mais de 20 mercados africanos desde 2004.',
  ru: '18 прямых ответов о материалах, покрытиях, MOQ, сроках и морской доставке в Дурбан, Бейру, Момбасу и Лагос — от китайского производителя, экспортирующего в более чем 20 африканских рынков с 2004 года.',
  ja: '材料・表面処理・MOQ・納期・ダーバン／ベイラ／モンバサ／ラゴス向け海上輸送について、2004年からアフリカ20以上の市場へ輸出する中国メーカーによる18の直接回答。',
  de: '18 direkte Antworten zu Werkstoffen, Oberflächen, MOQ, Lieferzeiten und Seefracht nach Durban, Beira, Mombasa und Lagos – von einem chinesischen Hersteller, der seit 2004 in über 20 afrikanische Märkte exportiert.',
  hi: 'सामग्री, फिनिश, MOQ, लीड टाइम और डरबन, बेरा, मोम्बासा, लागोस तक समुद्री मालभाड़े पर 18 सीधे उत्तर — 2004 से 20+ अफ्रीकी बाज़ारों में निर्यात करने वाले चीन स्थित निर्माता से।',
}

const extraLinks: Record<string, { industry: string; products: string; contact: string }> = {
  en: { industry: 'Industry guides', products: 'All products', contact: 'Request a quote' },
  zh: { industry: '行业指南', products: '全部产品', contact: '索取报价' },
  es: { industry: 'Guías sectoriales', products: 'Todos los productos', contact: 'Solicitar cotización' },
  fr: { industry: 'Guides sectoriels', products: 'Tous les produits', contact: 'Demander un devis' },
  ar: { industry: 'أدلة القطاعات', products: 'جميع المنتجات', contact: 'اطلب عرض سعر' },
  pt: { industry: 'Guias setoriais', products: 'Todos os produtos', contact: 'Solicitar cotação' },
  ru: { industry: 'Отраслевые руководства', products: 'Все товары', contact: 'Запросить цену' },
  ja: { industry: '業界ガイド', products: '全製品', contact: '見積もりを依頼' },
  de: { industry: 'Branchenleitfäden', products: 'Alle Produkte', contact: 'Angebot anfordern' },
  hi: { industry: 'उद्योग गाइड', products: 'सभी उत्पाद', contact: 'कोटेशन का अनुरोध' },
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = ((locale as Locale) in titles ? (locale as Locale) : 'en') as Locale

  return {
    title: titles[loc] || titles.en,
    description: descriptions[loc] || descriptions.en,
    alternates: {
      canonical: `${SITE}/${loc}/faq/`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}/faq/`])),
    },
  }
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = ((locale as Locale) in titles ? (locale as Locale) : 'en') as Locale
  const items = getFaq(loc)
  const links = extraLinks[loc] || extraLinks.en

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: loc === 'zh' ? 'zh-CN' : loc,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${loc}/` },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE}/${loc}/faq/` },
    ],
  }

  return (
    <main className="py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href={`/${loc}/`} className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">FAQ</span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{t(loc, 'faq.title')}</h1>
        <p className="text-gray-600 mb-8 md:mb-10 text-sm md:text-base">{t(loc, 'faq.subtitle')}</p>

        <div className="space-y-3 md:space-y-4">
          {items.map((faq, i) => (
            <details key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 group" open={i < 3}>
              <summary className="px-4 md:px-6 py-3 md:py-4 cursor-pointer font-semibold text-gray-800 hover:text-primary-600 flex justify-between items-center text-sm md:text-base">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-3 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href={`/${loc}/industry/`} className="px-4 py-2 rounded-lg border border-gray-200 hover:border-primary-600 hover:text-primary-700">
            {links.industry}
          </Link>
          <Link href={`/${loc}/products/`} className="px-4 py-2 rounded-lg border border-gray-200 hover:border-primary-600 hover:text-primary-700">
            {links.products}
          </Link>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-3 text-sm md:text-base">{t(loc, 'faq.contact')}</p>
          <Link
            href={`/${loc}/#inquiry`}
            className="inline-flex items-center gap-2 bg-primary-700 text-white px-5 md:px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-800 transition-colors text-sm md:text-base"
          >
            {links.contact}
          </Link>
        </div>
      </div>
    </main>
  )
}
