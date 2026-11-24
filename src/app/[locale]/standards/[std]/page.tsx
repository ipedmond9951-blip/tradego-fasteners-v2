import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type Locale, locales } from '@/i18n'
import { allProducts } from '@/lib/products'
import { productNames, pick } from '@/lib/productI18n'
import { standardEntries, getStd, stdNote } from '@/lib/standards'
import { categoryOf } from '@/lib/productCategories'

const SITE_URL = 'https://www.tradego-fasteners.com'

// 标准详情页 SEO 文案：十语种原生模板（不植入英文 note，避免其他语种混入英文）
const stdTitles: Record<string, string> = {
  en: '{code} Fasteners — Wholesale Supplier | TradeGo',
  zh: '{code} 紧固件 — 批发供应 | TradeGo',
  es: '{code} Fijaciones — Proveedor mayorista | TradeGo',
  fr: '{code} Visserie — Fournisseur en gros | TradeGo',
  pt: '{code} Fixadores — Fornecedor atacadista | TradeGo',
  ar: '{code} مواد تثبيت — مورّد بالجملة | TradeGo',
  ru: '{code} Крепёж — оптовый поставщик | TradeGo',
  ja: '{code} ファスナー — 卸売サプライヤー | TradeGo',
  de: '{code} Verbindungselemente — Großhandel | TradeGo',
  hi: '{code} फ़ासनर — थोक आपूर्तिकर्ता | TradeGo',
}

const stdDescs: Record<string, string> = {
  en: '{code} supplied wholesale — {n} product lines, ISO 9001 factory, FOB Qingdao/Tianjin, sea freight to Beira and Durban.',
  zh: '{code} 批发供应，{n} 个在售品类，ISO 9001 工厂，FOB 青岛/天津，海运至贝拉、德班。',
  es: '{code} al por mayor: {n} líneas de producto, fábrica ISO 9001, FOB Qingdao/Tianjin, flete marítimo a Beira y Durban.',
  fr: '{code} en gros : {n} gammes, usine ISO 9001, FOB Qingdao/Tianjin, fret maritime vers Beira et Durban.',
  pt: '{code} por atacado: {n} linhas de produto, fábrica ISO 9001, FOB Qingdao/Tianjin, frete marítimo para Beira e Durban.',
  ar: '{code} بالجملة: {n} خط إنتاج، مصنع ISO 9001، FOB تشينغداو/تيانجين، شحن بحري إلى بيرا وديربان.',
  ru: '{code} оптом: {n} позиций, завод ISO 9001, FOB Циндао/Тяньцзинь, морская доставка в Бейру и Дурбан.',
  ja: '{code} 卸売：{n}品目、ISO 9001工場、FOB青島/天津、ベイラ・ダーバン向け海上輸送。',
  de: '{code} im Großhandel: {n} Produktlinien, ISO-9001-Werk, FOB Qingdao/Tianjin, Seefracht nach Beira und Durban.',
  hi: '{code} थोक में: {n} उत्पाद लाइन, ISO 9001 फ़ैक्टरी, FOB किंगदाओ/तियानजिंग, बेरा और डरबन के लिए समुद्री माल।',
}

export function generateStaticParams() {
  return locales.flatMap(locale => standardEntries.map(e => ({ locale, std: e.slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; std: string }> }): Promise<Metadata> {
  const { locale: lp, std } = await params
  const locale = (lp as Locale) || 'en'
  const entry = getStd(std)
  if (!entry) return { title: 'Standard Not Found | TradeGo Fasteners', robots: { index: false } }

  const title = (stdTitles[locale] || stdTitles.en).replace('{code}', entry.code)
  const description = (stdDescs[locale] || stdDescs.en).replace('{code}', entry.code).replace('{n}', String(entry.products.length))
  const canonical = `${SITE_URL}/${locale}/standards/${std}/`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/standards/${std}/`],
        ...locales.map(l => [l, `${SITE_URL}/${l}/standards/${std}/`]),
      ]),
    },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

const copy = {
  en: {
    home: 'Home',
    standards: 'Standards',
    intro: (code: string, note: string, n: number) =>
      `${code} covers ${note.toLowerCase()}. We produce the ${n} line${n > 1 ? 's' : ''} below against this standard and quote on the clause you specify — send the standard number, size and quantity and we confirm tolerance, material and test report before production.`,
    lines: 'Product lines under this standard',
    why: 'Why order against a standard number',
    points: [
      ['No ambiguity on dimensions', 'The standard fixes thread, head and tolerance, so what arrives matches what your engineer drew — not a near-equivalent.'],
      ['Test reports line up', 'Mill certificates and dimensional reports are issued against the same clause, which keeps customs, QA and site inspection on one page.'],
      ['Easier substitution later', 'A standard number lets you re-order from any qualified mill without re-specifying the whole drawing set.'],
    ],
    faq: 'FAQ',
    faqs: (code: string) => [
      [`Can you produce to ${code} exactly?`, `Yes — we quote and produce against the clause you name, and state on the quotation which clause and which test reports apply.`],
      [`What do you need to quote ${code} parts?`, 'Size, standard/clause, material and finish, quantity per size and destination port. With those we return price, MOQ, packing and lead time the same working day.'],
      ['Do you supply test reports?', 'Mill certificates ship with the goods. Third-party pre-shipment inspection (SGS, BV or your agent) can be arranged if requested at order stage.'],
    ],
    related: 'Other standards on the same lines',
    cta: 'Request a quote',
    all: 'All products',
  },
  zh: {
    home: '首页',
    standards: '标准',
    intro: (code: string, note: string, n: number) =>
      `${code} 涵盖${note}。下列 ${n} 个品类按该标准生产，按你指定的条款报盘 —— 提供标准号、规格与数量，我们在生产前确认公差、材质与检测报告。`,
    lines: '该标准下的在售品类',
    why: '按标准号下单的理由',
    points: [
      ['尺寸无歧义', '标准锁定螺纹、头型与公差，到货与工程图纸一致，不用近似规格替代。'],
      ['检测报告对得上', '材质书与尺寸报告按同一条款出具，清关、质检与现场验收口径统一。'],
      ['后续换厂更容易', '有标准号，换任何合格工厂复购都不必重新出整套图纸。'],
    ],
    faq: '常见问题',
    faqs: (code: string) => [
      [`能否严格按 ${code} 生产？`, '可以 —— 按你指定的条款报盘与生产，并在报价单上注明适用条款与检测报告。'],
      [`按 ${code} 询价需要提供什么？`, '规格尺寸、标准/条款、材质与镀层、每个规格数量、目的港。五项齐全当天可回价格、MOQ、包装与交期。'],
      ['是否提供检测报告？', '材质书随货。出厂前第三方验货（SGS、BV 或客户指定机构）可在订单阶段提出安排。'],
    ],
    related: '同一批产品的其他标准',
    cta: '索取报价',
    all: '全部产品',
  },
  es: {
    home: 'Inicio',
    standards: 'Normas',
    intro: (code: string, note: string, n: number) =>
      `${code} cubre ${note.toLowerCase()}. Producimos las ${n} líneas siguientes conforme a esta norma y cotizamos según la cláusula que indique: envíe número de norma, medida y cantidad y confirmamos tolerancia, material e informe de ensayo antes de fabricar.`,
    lines: 'Líneas de producto bajo esta norma',
    why: 'Por qué pedir con número de norma',
    points: [
      ['Sin ambigüedad en medidas', 'La norma fija rosca, cabeza y tolerancia, así lo que llega coincide con el plano del ingeniero y no con un equivalente aproximado.'],
      ['Informes de ensayo coherentes', 'Certificados de colada e informes dimensionales se emiten contra la misma cláusula, manteniendo aduana, calidad y obra alineados.'],
      ['Sustitución más fácil después', 'El número de norma permite recomprar de cualquier fabricante calificado sin rehacer todo el juego de planos.'],
    ],
    faq: 'Preguntas frecuentes',
    faqs: (code: string) => [
      [`¿Pueden fabricar exactamente según ${code}?`, 'Sí: cotizamos y fabricamos según la cláusula que indique, y dejamos constancia en la cotización de qué cláusula y qué informes aplican.'],
      [`¿Qué necesitan para cotizar piezas ${code}?`, 'Medida, norma/cláusula, material y acabado, cantidad por medida y puerto de destino. Con eso devolvemos precio, MOQ, embalaje y plazo el mismo día.'],
      ['¿Entregan informes de ensayo?', 'Los certificados de colada viajan con la mercancía. La inspección previa al embarque por terceros (SGS, BV o su agente) puede organizarse si se solicita al hacer el pedido.'],
    ],
    related: 'Otras normas en las mismas líneas',
    cta: 'Solicitar cotización',
    all: 'Todos los productos',
  },
  fr: {
    home: 'Accueil',
    standards: 'Normes',
    intro: (code: string, note: string, n: number) =>
      `${code} couvre ${note.toLowerCase()}. Nous produisons les ${n} gammes ci-dessous selon cette norme et chiffrons sur la clause que vous précisez : envoyez le numéro de norme, la dimension et la quantité, nous confirmons tolérance, matière et rapport d'essai avant fabrication.`,
    lines: 'Gammes de produits sous cette norme',
    why: 'Pourquoi commander avec un numéro de norme',
    points: [
      ['Aucune ambiguïté sur les dimensions', 'La norme fixe filetage, tête et tolérance : ce qui arrive correspond au plan de votre ingénieur, pas à un équivalent approchant.'],
      ['Rapports d\'essai cohérents', 'Certificats de coulée et rapports dimensionnels sont émis sur la même clause, ce qui aligne douane, qualité et chantier.'],
      ['Remplacement plus simple ensuite', 'Le numéro de norme permet de recommander chez tout fabricant qualifié sans refaire tout le jeu de plans.'],
    ],
    faq: 'Questions fréquentes',
    faqs: (code: string) => [
      [`Pouvez-vous produire exactement selon ${code} ?`, 'Oui : nous chiffrons et produisons selon la clause que vous nommez, et indiquons sur le devis quelle clause et quels rapports s\'appliquent.'],
      [`Que faut-il pour chiffrer des pièces ${code} ?`, 'Dimension, norme/clause, matière et finition, quantité par dimension et port de destination. Avec ces éléments, prix, MOQ, emballage et délai partent le jour même.'],
      ['Fournissez-vous des rapports d\'essai ?', 'Les certificats de coulée accompagnent la marchandise. Une inspection tierce avant expédition (SGS, BV ou votre agent) peut être organisée si elle est demandée à la commande.'],
    ],
    related: 'Autres normes sur les mêmes gammes',
    cta: 'Demander un devis',
    all: 'Tous les produits',
  },
  pt: {
    home: 'Início',
    standards: 'Normas',
    intro: (code: string, note: string, n: number) =>
      `${code} cobre ${note.toLowerCase()}. Produzimos as ${n} linhas abaixo segundo esta norma e cotamos pela cláusula que indicar: envie número da norma, medida e quantidade e confirmamos tolerância, material e relatório de ensaio antes de produzir.`,
    lines: 'Linhas de produto sob esta norma',
    why: 'Por que comprar com número de norma',
    points: [
      ['Sem ambiguidade nas medidas', 'A norma fixa rosca, cabeça e tolerância, então o que chega corresponde ao desenho do engenheiro, não a um equivalente aproximado.'],
      ['Relatórios de ensaio alinhados', 'Certificados de aciaria e relatórios dimensionais saem pela mesma cláusula, mantendo alfândega, qualidade e obra na mesma página.'],
      ['Substituição mais fácil depois', 'O número de norma permite recomprar de qualquer fabricante qualificado sem refazer todo o conjunto de desenhos.'],
    ],
    faq: 'Perguntas frequentes',
    faqs: (code: string) => [
      [`Conseguem produzir exatamente conforme ${code}?`, 'Sim: cotamos e produzimos pela cláusula que indicar, e registamos na cotação qual cláusula e quais relatórios se aplicam.'],
      [`O que precisam para cotar peças ${code}?`, 'Medida, norma/cláusula, material e acabamento, quantidade por medida e porto de destino. Com isso devolvemos preço, MOQ, embalagem e prazo no mesmo dia.'],
      ['Fornecem relatórios de ensaio?', 'Os certificados de aciaria seguem com a mercadoria. Inspeção de terceiros antes do embarque (SGS, BV ou o seu agente) pode ser organizada se pedida na encomenda.'],
    ],
    related: 'Outras normas nas mesmas linhas',
    cta: 'Pedir cotação',
    all: 'Todos os produtos',
  },
  ar: {
    home: 'الرئيسية',
    standards: 'المعايير',
    intro: (code: string, note: string, n: number) =>
      `${code} يغطي ${note}. ننتج ${n} من الخطوط أدناه وفق هذا المعيار ونسعّر حسب البند الذي تحدده: أرسل رقم المعيار والمقاس والكمية ونؤكد التفاوت والمادة وتقرير الاختبار قبل الإنتاج.`,
    lines: 'خطوط المنتجات ضمن هذا المعيار',
    why: 'لماذا الطلب برقم معيار',
    points: [
      ['لا غموض في المقاسات', 'المعيار يحدد السن والرأس والتفاوت، فيطابق ما يصل الرسم الذي وضعه مهندسك، لا بديلاً قريباً منه.'],
      ['تقارير اختبار متوافقة', 'تُصدر شهادات الصهر والتقارير البُعدية على البند نفسه، فتبقى الجمارك والجودة والموقع على مرجع واحد.'],
      ['استبدال أسهل لاحقاً', 'رقم المعيار يتيح إعادة الطلب من أي مصنع مؤهل دون إعادة كتابة مجموعة الرسومات.'],
    ],
    faq: 'الأسئلة الشائعة',
    faqs: (code: string) => [
      [`هل يمكن الإنتاج وفق ${code} تماماً؟`, 'نعم — نسعّر وننتج حسب البند الذي تسميه، ونبيّن في العرض البند والتقارير المطبقة.'],
      [`ما المطلوب لتسعير قطع ${code}؟`, 'المقاس، المعيار/البند، المادة والتشطيب، الكمية لكل مقاس وميناء الوجهة. بهذه العناصر نعيد السعر والحد الأدنى والتغليف ومدة التسليم في اليوم نفسه.'],
      ['هل توفرون تقارير اختبار؟', 'شهادات الصهر ترافق البضاعة. ويمكن ترتيب فحص طرف ثالث قبل الشحن (SGS أو BV أو وكيلك) عند الطلب في مرحلة الطلب.'],
    ],
    related: 'معايير أخرى على الخطوط نفسها',
    cta: 'اطلب عرض سعر',
    all: 'كل المنتجات',
  },
  ru: {
    home: 'Главная',
    standards: 'Стандарты',
    intro: (code: string, note: string, n: number) =>
      `${code} охватывает ${note}. Мы производим ${n} позиции ниже по этому стандарту и котируем по указанному вами пункту: пришлите номер стандарта, размер и количество, и мы подтвердим допуск, материал и протокол испытаний до запуска в производство.`,
    lines: 'Позиции под этим стандартом',
    why: 'Зачем заказывать по номеру стандарта',
    points: [
      ['Нет неоднозначности в размерах', 'Стандарт фиксирует резьбу, головку и допуск, поэтому приходит то, что начертил ваш инженер, а не близкий аналог.'],
      ['Протоколы испытаний совпадают', 'Сертификаты плавки и размерные протоколы выпускаются на тот же пункт, так что таможня, ОТК и площадка работают по одному документу.'],
      ['Проще замена поставщика', 'Номер стандарта позволяет повторно закупать у любого квалифицированного завода без перевыпуска всего комплекта чертежей.'],
    ],
    faq: 'Частые вопросы',
    faqs: (code: string) => [
      [`Можете изготовить строго по ${code}?`, 'Да — котируем и производим по названному вами пункту и указываем в предложении, какой пункт и какие протоколы применяются.'],
      [`Что нужно для расчёта цены на детали ${code}?`, 'Размер, стандарт/пункт, материал и покрытие, количество по каждому размеру и порт назначения. С этими данными цену, MOQ, упаковку и срок даём в тот же день.'],
      ['Вы предоставляете протоколы испытаний?', 'Сертификаты плавки идут с грузом. Независимую инспекцию перед отгрузкой (SGS, BV или ваш агент) можно организовать, если заявить на этапе заказа.'],
    ],
    related: 'Другие стандарты на те же позиции',
    cta: 'Запросить цену',
    all: 'Все продукты',
  },
  ja: {
    home: 'ホーム',
    standards: '規格',
    intro: (code: string, note: string, n: number) =>
      `${code}は${note}を対象とします。以下の${n}品目をこの規格に沿って製造し、ご指定の条項で見積もります。規格番号・サイズ・数量をお送りいただければ、製造前に公差・材質・試験成績書を確認して回答します。`,
    lines: 'この規格の対象品目',
    why: '規格番号で発注する理由',
    points: [
      ['寸法の曖昧さがない', '規格がねじ・頭部・公差を定めるため、届く品は設計図どおりで、近似代替品ではありません。'],
      ['試験成績書の整合', 'ミルシートと寸法検査報告を同じ条項で発行するため、通関・品質・現場検査の基準が一つに揃います。'],
      ['後からの切り替えが容易', '規格番号があれば、図面一式を作り直さずに認定工場から再発注できます。'],
    ],
    faq: 'よくある質問',
    faqs: (code: string) => [
      [`${code}どおりに製造できますか？`, 'はい。ご指定の条項で見積り・製造し、適用する条項と試験成績書を 見積書に明記します。'],
      [`${code}品の見積りに必要な情報は？`, 'サイズ、規格・条項、材質と表面処理、サイズ別数量、仕向港。5点が揃えば当日中に価格・MOQ・梱包・納期を回答します。'],
      ['試験成績書は提供されますか？', 'ミルシートは商品に同梱します。出荷前の第三者検査（SGS・BV・お客様指定機関）は発注時にご要望があれば手配します。'],
    ],
    related: '同じ品目の他の規格',
    cta: '見積りを依頼',
    all: 'すべての製品',
  },
  de: {
    home: 'Startseite',
    standards: 'Normen',
    intro: (code: string, note: string, n: number) =>
      `${code} deckt ${note} ab. Wir fertigen die ${n} unten genannten Positionen nach dieser Norm und kalkulieren nach der von Ihnen genannten Klausel: Normnummer, Größe und Menge senden, wir bestätigen Toleranz, Werkstoff und Prüfbericht vor der Fertigung.`,
    lines: 'Produktlinien unter dieser Norm',
    why: 'Warum mit Normnummer bestellen',
    points: [
      ['Keine Unklarheit bei den Maßen', 'Die Norm legt Gewinde, Kopf und Toleranz fest, geliefert wird also was der Konstrukteur gezeichnet hat — kein Näherungsprodukt.'],
      ['Prüfberichte passen zusammen', 'Walzwerkszeugnisse und Maßprüfberichte werden auf dieselbe Klausel ausgestellt, Zoll, QS und Baustelle arbeiten mit einem Bezug.'],
      ['Späterer Wechsel einfacher', 'Mit der Normnummer lässt sich bei jedem qualifizierten Werk nachbestellen, ohne den ganzen Zeichnungssatz neu zu erstellen.'],
    ],
    faq: 'Häufige Fragen',
    faqs: (code: string) => [
      [`Können Sie exakt nach ${code} fertigen?`, 'Ja — wir kalkulieren und fertigen nach der von Ihnen genannten Klausel und geben im Angebot an, welche Klausel und welche Prüfberichte gelten.'],
      [`Was brauchen Sie für ein Angebot über ${code}-Teile?`, 'Größe, Norm/Klausel, Werkstoff und Oberfläche, Menge je Größe und Bestimmungshafen. Damit erhalten Sie Preis, MOQ, Verpackung und Lieferzeit am selben Tag.'],
      ['Liefern Sie Prüfberichte?', 'Walzwerkszeugnisse gehen mit der Ware. Eine Drittinspektion vor Versand (SGS, BV oder Ihr Agent) lässt sich auf Anfrage bei der Bestellung organisieren.'],
    ],
    related: 'Weitere Normen auf denselben Linien',
    cta: 'Angebot anfordern',
    all: 'Alle Produkte',
  },
  hi: {
    home: 'होम',
    standards: 'मानक',
    intro: (code: string, note: string, n: number) =>
      `${code} ${note} को कवर करता है। हम नीचे दी गई ${n} श्रेणियाँ इस मानक के अनुसार बनाते हैं और आपके बताए क्लॉज़ पर कोट करते हैं — मानक संख्या, साइज़ और मात्रा भेजें, उत्पादन से पहले हम टॉलरेंस, सामग्री और परीक्षण रिपोर्ट की पुष्टि करते हैं।`,
    lines: 'इस मानक के अंतर्गत उत्पाद श्रेणियाँ',
    why: 'मानक संख्या से ऑर्डर क्यों करें',
    points: [
      ['माप में कोई अस्पष्टता नहीं', 'मानक थ्रेड, हेड और टॉलरेंस तय करता है, इसलिए जो आता है वह आपके इंजीनियर के ड्रॉइंग से मेल खाता है, न कि निकट विकल्प से।'],
      ['परीक्षण रिपोर्ट मेल खाती हैं', 'मिल सर्टिफिकेट और आयामी रिपोर्ट एक ही क्लॉज़ पर जारी होते हैं, जिससे सीमा शुल्क, गुणवत्ता और साइट एक ही संदर्भ पर रहते हैं।'],
      ['बाद में बदलाव आसान', 'मानक संख्या होने पर पूरा ड्रॉइंग सेट दोबारा बनाए बिना किसी योग्य फैक्टरी से दोबारा ऑर्डर किया जा सकता है।'],
    ],
    faq: 'सामान्य प्रश्न',
    faqs: (code: string) => [
      [`क्या ${code} के अनुसार ठीक-ठीक उत्पादन संभव है?`, 'हाँ — हम आपके बताए क्लॉज़ पर कोट और उत्पादन करते हैं, और कोटेशन में लिखते हैं कि कौन सा क्लॉज़ और कौन सी रिपोर्ट लागू हैं।'],
      [`${code} पार्ट्स का कोट पाने के लिए क्या चाहिए?`, 'साइज़, मानक/क्लॉज़, सामग्री और फिनिश, प्रति साइज़ मात्रा और गंतव्य बंदरगाह। इनके साथ हम उसी दिन कीमत, MOQ, पैकिंग और लीड टाइम देते हैं।'],
      ['क्या परीक्षण रिपोर्ट मिलती हैं?', 'मिल सर्टिफिकेट माल के साथ जाते हैं। शिपमेंट से पहले तीसरे पक्ष का निरीक्षण (SGS, BV या आपका एजेंट) ऑर्डर के समय अनुरोध पर कराया जा सकता है।'],
    ],
    related: 'इन्हीं श्रेणियों पर अन्य मानक',
    cta: 'कोट का अनुरोध करें',
    all: 'सभी उत्पाद',
  },
} as const

export default async function StandardPage({ params }: { params: Promise<{ locale: string; std: string }> }) {
  const { locale: lp, std } = await params
  const locale = (lp as Locale) || 'en'
  const entry = getStd(std)
  if (!entry) notFound()

  const c = (copy as unknown as Record<string, typeof copy.en>)[locale] ?? copy.en
  const note = stdNote(entry.code, locale)
  const items = entry.products.map(s => allProducts.find(p => p.slug === s)).filter((p): p is (typeof allProducts)[number] => Boolean(p))

  // 同批产品的其他标准，最多 6 个，构成标准之间的内链网
  const otherCodes = [...new Set(items.flatMap(p => parseOther(p.specs.standard || '', entry.code)))].slice(0, 6)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs(entry.code).map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 text-sm text-gray-500 flex flex-wrap items-center gap-1">
          <Link href={`/${locale}/`} className="hover:text-primary-700">{c.home}</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{entry.code}</span>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-primary-200 text-sm mb-2">{c.standards}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{entry.code} — {note}</h1>
          <p className="text-primary-100 max-w-3xl leading-relaxed mb-6">{c.intro(entry.code, note, entry.products.length)}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/contact/`} className="inline-flex items-center rounded-lg bg-white text-primary-800 font-semibold px-5 py-3 hover:bg-primary-50 transition">{c.cta}</Link>
            <Link href={`/${locale}/products/`} className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 hover:bg-white/10 transition">{c.all}</Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">{c.lines} <span className="text-sm font-normal text-gray-400">{items.length}</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map(p => {
              const name = pick(productNames[p.slug], locale)
              const cat = categoryOf(p.slug)
              return (
                <Link key={p.slug} href={`/${locale}/products/${p.slug}/`} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="relative h-32 md:h-36 bg-gray-100">
                    <Image src={p.image} alt={name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base text-primary-900 group-hover:text-primary-700 line-clamp-2">{name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{p.specs.size}</p>
                    {cat && <p className="text-[11px] text-gray-400 mt-1">{cat.label[locale] || cat.label.en}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.why}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {c.points.map(([h, t]) => (
              <div key={h}>
                <h3 className="font-semibold text-primary-900 mb-1">{h}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{c.faq}</h2>
          <div className="divide-y divide-gray-100">
            {c.faqs(entry.code).map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer font-medium text-gray-900">{q}</summary>
                <p className="mt-2 text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {otherCodes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">{c.related}</h2>
            <div className="flex flex-wrap gap-2">
              {otherCodes.map(code => (
                <Link key={code} href={`/${locale}/standards/${stdSlugOf(code)}/`} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs md:text-sm text-gray-700 hover:border-primary-600 hover:text-primary-700">
                  {code}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// 本页工具：取同产品其他标准（排除当前）与 slug 化
function parseOther(standard: string, current: string): string[] {
  const RE = /(DIN|ISO|ANSI\/ASME|ANSI|ASTM|SABS|EN|GB\/T|GB|JIS|BS|UNI|LS|JC\/T)\s*([A-Z]?\d[\w.\-]*)/g
  const out: string[] = []
  for (const m of standard.matchAll(RE)) {
    for (const n of m[2].split('/')) {
      const code = `${m[1]} ${n.trim()}`
      if (code !== current) out.push(code)
    }
  }
  return out
}

function stdSlugOf(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// 2026-11-24 额度治理: 本页由 generateStaticParams 全量预生成, 显式声明纯静态,
// 让 CDN 直接返回预渲染结果, 不再每次请求都进 ISR 读缓存 (降低 ISR Reads / FoT / CPU).
export const dynamic = 'force-static'
export const revalidate = false
