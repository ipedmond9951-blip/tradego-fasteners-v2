import type { Metadata } from 'next'
import { type Locale, getMessages } from '@/i18n'
import SteelPricesChart from './SteelPricesChart'

const SITE_URL = 'https://www.tradego-fasteners.com'

const titles: Record<string, string> = {
  en: 'Steel & Commodity Prices | TradeGo Fasteners',
  zh: '钢材与大宗商品价格 | TradeGo紧固件',
  es: 'Precios del Acero y Materias Primas | TradeGo Fasteners',
  ar: 'أسعار الصلب والسلع الأساسية | TradeGo Fasteners',
  fr: 'Prix de l\'Acier et Matières Premières | TradeGo Fasteners',
  pt: 'Preços de Aço e Commodities | TradeGo Fasteners',
  ru: 'Цены на Сталь и Сырьевые Товары | TradeGo Fasteners',
  ja: '鉄鋼と商品価格 | TradeGo Fasteners',
  de: 'Stahl- und Rohstoffpreise | TradeGo Fasteners',
  hi: 'स्टील और कमोडिटी कीमतें | TradeGo Fasteners',
}

const descriptions: Record<string, string> = {
  en: 'Live global steel and commodity prices (HRC, CRC, rebar) from London Metal Exchange and Shanghai Futures Exchange. Real-time data for construction, fasteners, and manufacturing procurement decisions.',
  zh: '伦敦金属交易所和上海期货交易所的全球钢材和大宗商品实时价格（热轧卷板、冷轧卷板、螺纹钢）。为建筑、紧固件和制造业采购决策提供实时数据。',
  es: 'Precios mundiales de acero y materias primas en vivo (HRC, CRC, varilla) de la London Metal Exchange y Shanghai Futures Exchange. Datos en tiempo real para decisiones de adquisición de construcción, sujetadores y manufactura.',
  ar: 'أسعار الصلب والسلع الأساسية العالمية المباشرة (HRC، CRC، حديد التسليح) من بورصة لندن للمعادن وبورصة شنغهاي للعقود الآجلة. بيانات في الوقت الفعلي لقرارات الشراء في البناء والمثبتات والتصنيع.',
  fr: 'Prix mondiaux de l\'acier et des matières premières en direct (HRC, CRC, armature) du London Metal Exchange et de la Shanghai Futures Exchange. Données en temps réel pour les décisions d\'achat de construction, fixations et fabrication.',
  pt: 'Preços globais de aço e commodities ao vivo (HRC, CRC, vergalhão) da London Metal Exchange e Shanghai Futures Exchange. Dados em tempo real para decisões de aquisição de construção, fixadores e manufatura.',
  ru: 'Глобальные цены на сталь и сырьевые товары в реальном времени (HRC, CRC, арматура) от Лондонской биржи металлов и Шанхайской биржи фьючерсов. Данные в реальном времени для принятия решений о закупках в строительстве, крепеже и производстве.',
  ja: 'ロンドン金属取引所と上海先物取引所からの鉄鋼と商品の世界的なライブ価格（HRC、CRC、鉄筋）。建設、ファスナー、製造業の調達決定のためのリアルタイムデータ。',
  de: 'Live globale Stahl- und Rohstoffpreise (HRC, CRC, Betonstahl) von der London Metal Exchange und Shanghai Futures Exchange. Echtzeitdaten für Beschaffungsentscheidungen in Bauwesen, Befestigungen und Fertigung.',
  hi: 'लंदन मेटल एक्सचेंज और शंघाई फ्यूचर्स एक्सचेंज से वैश्विक स्टील और कमोडिटी की लाइव कीमतें (HRC, CRC, रीबार)। निर्माण, फास्टनर और विनिर्माण खरीद निर्णयों के लिए रियल-टाइम डेटा।',
}

const localMarketInsights: Record<string, { title: string; paragraphs: string[] }> = {
  en: {
    title: 'Why Track Steel Prices for Your Fastener Procurement',
    paragraphs: [
      'Steel represents 60–80% of fastener raw material cost. Tracking LME HRC (Hot Rolled Coil) and SHFE rebar futures helps procurement teams time bulk orders when prices are favorable.',
      'For projects in Africa, ocean freight from China typically costs $1,200–$2,500 per CBM and adds 25–40 days to lead time. Locking in steel prices 60–90 days before shipping reduces exposure to mid-project cost spikes.',
      'Major fastener grades (Grade 4.8, 8.8, 10.9, A2-70, A4-80) all derive from the same hot-rolled coil feedstock. A 10% rise in HRC typically translates to a 6–8% rise in finished bolt pricing within 30–60 days.',
    ],
  },
  zh: {
    title: '为什么紧固件采购需要追踪钢材价格',
    paragraphs: [
      '钢材占紧固件原材料成本的 60–80%。追踪 LME 热轧卷板（HRC）和上海期货交易所螺纹钢期货有助于采购团队在价格有利时下单。',
      '对于非洲项目，从中国海运成本通常为每立方米 1,200–2,500 美元，并增加 25–40 天的交货期。在装运前 60–90 天锁定钢材价格可降低项目中期成本飙升的风险。',
      '主要紧固件等级（4.8、8.8、10.9、A2-70、A4-80）都来自相同的热轧卷板原料。HRC 上涨 10% 通常会在 30–60 天内导致成品螺栓价格上涨 6–8%。',
    ],
  },
  es: {
    title: 'Por qué Rastrear los Precios del Acero para su Adquisición de Sujetadores',
    paragraphs: [
      'El acero representa el 60–80% del costo de materia prima de los sujetadores. Rastrear los futuros de bobina laminada en caliente (HRC) de LME y varilla de refuerzo de SHFE ayuda a los equipos de adquisición a programar pedidos al por mayor cuando los precios son favorables.',
      'Para proyectos en África, el flete marítimo desde China generalmente cuesta $1,200–$2,500 por CBM y agrega 25–40 días al tiempo de entrega. Bloquear los precios del acero 60–90 días antes del envío reduce la exposición a picos de costos a mitad del proyecto.',
      'Los grados principales de sujetadores (Grado 4.8, 8.8, 10.9, A2-70, A4-80) derivan del mismo material de bobina laminada en caliente. Un aumento del 10% en HRC típicamente se traduce en un aumento del 6–8% en el precio de pernos terminados dentro de 30–60 días.',
    ],
  },
  ar: {
    title: 'لماذا تتبع أسعار الصلب لمشتريات المثبتات الخاصة بك',
    paragraphs: [
      'يمثل الصلب 60–80% من تكلفة المواد الخام للمثبتات. يساعد تتبع عقود HRC (الملف المدرفل على الساخن) في LME وعقود حديد التسليح الآجلة في SHFE فرق المشتريات على توقيت الطلبات الكبيرة عندما تكون الأسعار مواتية.',
      'بالنسبة للمشاريع في أفريقيا، تتراوح تكلفة الشحن البحري من الصين عادة بين 1,200 و2,500 دولار لكل CBM وتضيف 25–40 يومًا إلى مدة التسليم. يقلل تثبيت أسعار الصلب قبل الشحن بـ 60–90 يومًا من التعرض لارتفاع التكاليف في منتصف المشروع.',
      'تستمد درجات المثبتات الرئيسية (الدرجة 4.8 و8.8 و10.9 وA2-70 وA4-80) من نفس مادة الملف المدرفل على الساخن. عادة ما تترجم زيادة بنسبة 10% في HRC إلى زيادة بنسبة 6–8% في تسعير المسامير النهائية في غضون 30–60 يومًا.',
    ],
  },
  fr: {
    title: 'Pourquoi Suivre les Prix de l\'Acier pour vos Approvisionnements en Fixations',
    paragraphs: [
      'L\'acier représente 60–80% du coût des matières premières des fixations. Le suivi des contrats à terme HRC (bobine laminée à chaud) du LME et des contrats à terme sur les armatures du SHFE aide les équipes d\'approvisionnement à planifier les commandes en vrac lorsque les prix sont favorables.',
      'Pour les projets en Afrique, le fret maritime depuis la Chine coûte généralement entre 1 200 et 2 500 USD par CBM et ajoute 25–40 jours au délai de livraison. Verrouiller les prix de l\'acier 60–90 jours avant l\'expédition réduit l\'exposition aux pics de coûts en milieu de projet.',
      'Les principales nuances de fixations (Grade 4.8, 8.8, 10.9, A2-70, A4-80) dérivent toutes de la même matière première de bobine laminée à chaud. Une hausse de 10% du HRC se traduit typiquement par une hausse de 6–8% du prix des boulons finis dans les 30–60 jours.',
    ],
  },
  pt: {
    title: 'Por que Rastrear Preços do Aço para suas Aquisições de Fixadores',
    paragraphs: [
      'O aço representa 60–80% do custo de matéria-prima dos fixadores. Rastrear os futuros de bobina laminada a quente (HRC) da LME e os futuros de vergalhão da SHFE ajuda as equipes de aquisição a programar pedidos em grandes volumes quando os preços são favoráveis.',
      'Para projetos na África, o frete marítimo da China geralmente custa $1.200–$2.500 por CBM e adiciona 25–40 dias ao prazo de entrega. Bloquear os preços do aço 60–90 dias antes do envio reduz a exposição a picos de custo no meio do projeto.',
      'Os principais graus de fixadores (Grau 4.8, 8.8, 10.9, A2-70, A4-80) derivam todos da mesma matéria-prima de bobina laminada a quente. Um aumento de 10% no HRC tipicamente se traduz em um aumento de 6–8% no preço de parafusos acabados dentro de 30–60 dias.',
    ],
  },
  ru: {
    title: 'Зачем Отслеживать Цены на Сталь для Закупок Крепежа',
    paragraphs: [
      'Сталь составляет 60–80% стоимости сырья для крепежа. Отслеживание фьючерсов LME HRC (горячекатаный рулон) и фьючерсов на арматуру SHFE помогает командам закупок планировать оптовые заказы, когда цены благоприятны.',
      'Для проектов в Африке морская перевозка из Китая обычно стоит $1,200–$2,500 за CBM и добавляет 25–40 дней к сроку поставки. Фиксация цен на сталь за 60–90 дней до отгрузки снижает подверженность скачкам затрат в середине проекта.',
      'Основные марки крепежа (Grade 4.8, 8.8, 10.9, A2-70, A4-80) происходят из одного и того же горячекатаного рулонного сырья. Рост HRC на 10% обычно приводит к росту цен на готовые болты на 6–8% в течение 30–60 дней.',
    ],
  },
  ja: {
    title: 'ファスナー調達のために鉄鋼価格を追跡する理由',
    paragraphs: [
      '鉄鋼はファスナー原材料費の60〜80%を占めます。LME HRC（熱延コイル）とSHFE鉄筋先物の追跡は、価格が有利な時期に大量注文のタイミングを計るのに役立ちます。',
      'アフリカのプロジェクトでは、中国からの海上運賃は通常CBMあたり1,200〜2,500ドルで、リードタイムに25〜40日を追加します。出荷の60〜90日前に鉄鋼価格を固定することで、プロジェクト中期のコスト急騰への露出を減らします。',
      '主要なファスナークレード（4.8、8.8、10.9、A2-70、A4-80）はすべて同じ熱延コイル原料に由来します。HRCの10%上昇は通常、30〜60日以内に完成ボルトの6〜8%上昇につながります。',
    ],
  },
  de: {
    title: 'Warum Stahlpreise für Ihre Befestigungsbeschaffung verfolgen',
    paragraphs: [
      'Stahl macht 60–80% der Rohstoffkosten von Befestigungen aus. Die Verfolgung von LME HRC (Warmband)-Futures und SHFE-Betonstahl-Futures hilft Beschaffungsteams, Massenbestellungen dann zu timen, wenn die Preise günstig sind.',
      'Für Projekte in Afrika kostet die Seefracht aus China typischerweise $1.200–$2.500 pro CBM und verlängert die Lieferzeit um 25–40 Tage. Die Fixierung der Stahlpreise 60–90 Tage vor dem Versand reduziert die Exposition gegenüber Kostenspitzen mitten im Projekt.',
      'Wichtige Befestigungsqualitäten (Grade 4.8, 8.8, 10.9, A2-70, A4-80) stammen alle aus demselben Warmband-Vormaterial. Ein 10%-Anstieg bei HRC führt typischerweise zu einem 6–8%-Anstieg bei den fertigen Schraubenpreisen innerhalb von 30–60 Tagen.',
    ],
  },
  hi: {
    title: 'अपने फास्टनर प्रोक्योरमेंट के लिए स्टील कीमतों को ट्रैक क्यों करें',
    paragraphs: [
      'स्टील फास्टनर कच्चे माल की लागत का 60–80% हिस्सा बनाता है। LME HRC (हॉट रोल्ड कॉइल) और SHFE रीबार फ्यूचर्स को ट्रैक करने से प्रोक्योरमेंट टीमों को कीमतें अनुकूल होने पर थोक ऑर्डर का समय निर्धारित करने में मदद मिलती है।',
      'अफ्रीका में परियोजनाओं के लिए, चीन से समुद्री माल ढुलाई आमतौर पर $1,200–$2,500 प्रति CBM होती है और लीड टाइम में 25–40 दिन जोड़ती है। शिपिंग से 60–90 दिन पहले स्टील कीमतों को लॉक करने से प्रोजेक्ट के बीच में लागत वृद्धि के जोखिम को कम किया जाता है।',
      'प्रमुख फास्टनर ग्रेड (ग्रेड 4.8, 8.8, 10.9, A2-70, A4-80) सभी एक ही हॉट रोल्ड कॉइल फीडस्टॉक से प्राप्त होते हैं। HRC में 10% वृद्धि आमतौर पर 30–60 दिनों के भीतर तैयार बोल्ट मूल्य निर्धारण में 6–8% वृद्धि में बदल जाती है।',
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const loc = locale as Locale
  return {
    title: titles[loc] || titles.en,
    description: descriptions[loc] || descriptions.en,
    alternates: {
      // Force /en/steel-prices/ as canonical for all 10 language variants
      // (price data is identical across locales — GSC sees them as duplicates otherwise)
      canonical: `${SITE_URL}/en/steel-prices/`,
      languages: Object.fromEntries([
        ['x-default', `${SITE_URL}/en/steel-prices/`],
        ...(['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi'] as Locale[]).map(l => [l, `${SITE_URL}/${l}/steel-prices/`]),
      ]),
    },
  }
}

export default async function SteelPricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const loc = locale as Locale
  const messages = getMessages(loc)
  const sp = messages.steelPrices
  const insight = localMarketInsights[loc] || localMarketInsights.en

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Localized Header — unique per locale, server-rendered for SEO */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{sp.title}</h1>
          <p className="text-gray-600">{sp.subtitle}</p>
        </header>

        {/* Chart (Client) */}
        <SteelPricesChart locale={locale} messages={sp} />

        {/* Localized Procurement Insight — unique content per locale, eliminates duplicate signal */}
        <section className="mt-10 bg-white rounded-lg shadow p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{insight.title}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {insight.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
