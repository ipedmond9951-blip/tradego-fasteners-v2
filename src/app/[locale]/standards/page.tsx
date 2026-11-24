import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale, locales } from '@/i18n'
import { standardEntries, stdNote } from '@/lib/standards'

const SITE_URL = 'https://www.tradego-fasteners.com'

const stTitles: Record<string, string> = {
  en: 'Fastener Standard Index — DIN, ISO, ASTM, SABS | TradeGo',
  zh: '紧固件标准索引｜DIN / ISO / ASTM / SABS 全清单 | TradeGo',
  es: 'Índice de normas de fijaciones — DIN, ISO, ASTM, SABS | TradeGo',
  fr: 'Index des normes de visserie — DIN, ISO, ASTM, SABS | TradeGo',
  pt: 'Índice de normas de fixadores — DIN, ISO, ASTM, SABS | TradeGo',
  ar: 'فهرس معايير مواد التثبيت — DIN وISO وASTM وSABS | TradeGo',
  ru: 'Указатель стандартов крепежа — DIN, ISO, ASTM, SABS | TradeGo',
  ja: 'ファスナー規格インデックス — DIN・ISO・ASTM・SABS | TradeGo',
  de: 'Normenindex für Verbindungselemente — DIN, ISO, ASTM, SABS | TradeGo',
  hi: 'फ़ासनर मानक सूचकांक — DIN, ISO, ASTM, SABS | TradeGo',
}

const stDescs: Record<string, string> = {
  en: 'Look up fasteners by standard number: {n} standards we produce to — DIN, ISO, ASTM, SABS, EN and GB/T — each mapped to the product lines we ship.',
  zh: '按标准号查紧固件：本站生产的 {n} 个标准（DIN、ISO、ASTM、SABS、EN、GB/T）各自对应在售品类，可直接询价。',
  es: 'Consulta fijaciones por número de norma: {n} normas que producimos — DIN, ISO, ASTM, SABS, EN y GB/T — cada una vinculada a las líneas que enviamos.',
  fr: 'Recherchez la visserie par numéro de norme : {n} normes de production — DIN, ISO, ASTM, SABS, EN et GB/T — chacune reliée aux gammes expédiées.',
  pt: 'Consulte fixadores por número de norma: {n} normas que produzimos — DIN, ISO, ASTM, SABS, EN e GB/T — cada uma ligada às linhas que enviamos.',
  ar: 'ابحث عن مواد التثبيت برقم المعيار: {n} معيارًا ننتج وفقها — DIN وISO وASTM وSABS وEN وGB/T — وكل منها مرتبط بالخطوط التي نشحنها.',
  ru: 'Поиск крепежа по номеру стандарта: {n} стандартов нашего производства — DIN, ISO, ASTM, SABS, EN и GB/T, каждый привязан к отгружаемым позициям.',
  ja: '規格番号でファスナーを検索：当社工場の {n} 規格（DIN・ISO・ASTM・SABS・EN・GB/T）と出荷品目を対応付けています。',
  de: 'Verbindungselemente nach Normnummer suchen: {n} Normen aus unserer Fertigung — DIN, ISO, ASTM, SABS, EN und GB/T — jeweils den gelieferten Linien zugeordnet.',
  hi: 'मानक संख्या से फ़ासनर खोजें: हमारे उत्पादन के {n} मानक — DIN, ISO, ASTM, SABS, EN और GB/T — प्रत्येक शिप की जाने वाली लाइन से जुड़ा।',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const title = stTitles[locale] || stTitles.en
  const description = (stDescs[locale] || stDescs.en).replace('{n}', String(standardEntries.length))
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/standards/`,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/standards/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/standards/`]),
      ]),
    },
  }
}

const GROUPS = ['DIN', 'ISO', 'ASTM', 'SABS', 'EN', 'GB/T', 'GB', 'ANSI', 'JIS', 'JC/T', '其他']

const idxCopy = {
  en: {
    h1: 'Fastener standard index',
    intro: (n: number, t: number) =>
      `${n} standards we produce to, covering ${t} product lines. Open any standard to see the lines that ship against it and what we need to quote.`,
    other: 'Other standards',
    unit: 'lines',
  },
  zh: {
    h1: '紧固件标准索引',
    intro: (n: number, t: number) =>
      `按标准号检索：我们生产的 ${n} 个标准，覆盖 ${t} 个在售品类。点开任一标准，可看到对应产品、执行条款说明与询价所需资料。`,
    other: '其他标准',
    unit: '个品类',
  },
  es: {
    h1: 'Índice de normas para fijaciones',
    intro: (n: number, t: number) =>
      `Producimos según ${n} normas que cubren ${t} líneas de producto. Abra cualquier norma para ver las líneas que se fabrican conforme a ella y lo que necesitamos para cotizar.`,
    other: 'Otras normas',
    unit: 'líneas',
  },
  fr: {
    h1: 'Index des normes de visserie',
    intro: (n: number, t: number) =>
      `${n} normes appliquées, couvrant ${t} gammes de produits. Ouvrez une norme pour voir les gammes fabriquées selon elle et ce qu'il nous faut pour chiffrer.`,
    other: 'Autres normes',
    unit: 'gammes',
  },
  pt: {
    h1: 'Índice de normas de fixadores',
    intro: (n: number, t: number) =>
      `Produzimos segundo ${n} normas, cobrindo ${t} linhas de produto. Abra qualquer norma para ver as linhas fabricadas conforme ela e o que precisamos para cotar.`,
    other: 'Outras normas',
    unit: 'linhas',
  },
  ar: {
    h1: 'فهرس معايير المثبتات',
    intro: (n: number, t: number) =>
      `ننتج وفق ${n} معياراً تغطي ${t} من خطوط المنتجات. افتح أي معيار لترى الخطوط المنتجة وفقها وما نحتاجه للتسعير.`,
    other: 'معايير أخرى',
    unit: 'خطوط',
  },
  ru: {
    h1: 'Каталог стандартов крепежа',
    intro: (n: number, t: number) =>
      `Мы производим по ${n} стандартам, которые охватывают ${t} позиций. Откройте любой стандарт, чтобы увидеть позиции и что нужно для расчёта цены.`,
    other: 'Другие стандарты',
    unit: 'позиций',
  },
  ja: {
    h1: 'ファスナー規格インデックス',
    intro: (n: number, t: number) =>
      `当社が対応する${n}規格で、${t}品目をカバーします。規格を開くと対象品目と見積りに必要な情報が確認できます。`,
    other: 'その他の規格',
    unit: '品目',
  },
  de: {
    h1: 'Normenindex für Befestigungselemente',
    intro: (n: number, t: number) =>
      `Wir fertigen nach ${n} Normen, die ${t} Produktlinien abdecken. Eine Norm öffnen zeigt die Linien und was wir für ein Angebot brauchen.`,
    other: 'Weitere Normen',
    unit: 'Positionen',
  },
  hi: {
    h1: 'फास्टनर मानक सूची',
    intro: (n: number, t: number) =>
      `हम ${n} मानकों पर उत्पादन करते हैं जो ${t} उत्पाद श्रेणियों को कवर करते हैं। किसी मानक को खोलकर श्रेणियाँ और कोट के लिए आवश्यक जानकारी देखें।`,
    other: 'अन्य मानक',
    unit: 'श्रेणियाँ',
  },
} as const

export default async function StandardsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lp } = await params
  const locale = (lp as Locale) || 'en'
  const ic = (idxCopy as unknown as Record<string, typeof idxCopy.en>)[locale] ?? idxCopy.en

  const groups = GROUPS.map(g => ({
    g,
    items: standardEntries.filter(e => (g === '其他'
      ? !GROUPS.slice(0, -1).some(p => e.code.startsWith(p))
      : e.code.startsWith(g))),
  })).filter(x => x.items.length > 0)

  const totalProducts = new Set(standardEntries.flatMap(e => e.products)).size

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{ic.h1}</h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed">
            {ic.intro(standardEntries.length, totalProducts)}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-9">
        {groups.map(({ g, items }) => (
          <section key={g}>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              {g === '其他' ? ic.other : g}
              <span className="ml-2 text-sm font-normal text-gray-400">{items.length}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(e => (
                <Link
                  key={e.slug}
                  href={`/${locale}/standards/${e.slug}/`}
                  className="group bg-white border border-gray-200 rounded-lg p-3.5 hover:border-primary-500 hover:shadow-sm transition"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-primary-900 group-hover:text-primary-700">{e.code}</span>
                    <span className="text-xs text-gray-400">{e.products.length} {ic.unit}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{stdNote(e.code, locale)}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
