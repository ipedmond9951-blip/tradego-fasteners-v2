// 界面文案集中表（只放短句/标签，正文与 SEO 文案走各自的数据文件）
// 所有键必须齐十语种；取值时用 pick() 回落 en。
export type Loc = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'ar' | 'ru' | 'ja' | 'de' | 'hi'

export const pick = <T,>(m: Record<string, T>, locale: string): T =>
  (m[locale] ?? m.en) as T

export const industryListCopy = {
  browse: {
    en: 'Browse all guides by topic',
    zh: '按主题浏览全部指南',
    es: 'Ver todas las guías por tema',
    fr: 'Parcourir tous les guides par thème',
    pt: 'Ver todos os guias por tema',
    ar: 'تصفّح كل الأدلة حسب الموضوع',
    ru: 'Все руководства по темам',
    ja: 'テーマ別に全ガイドを見る',
    de: 'Alle Ratgeber nach Thema',
    hi: 'विषय के अनुसार सभी गाइड देखें',
  },
  count: {
    en: (a: number, b: number) => `Showing the ${b} most recent of ${a} guides.`,
    zh: (a: number, b: number) => `共 ${a} 篇指南，当前显示最新 ${b} 篇。`,
    es: (a: number, b: number) => `Se muestran las ${b} guías más recientes de ${a}.`,
    fr: (a: number, b: number) => `Affichage des ${b} guides les plus récents sur ${a}.`,
    pt: (a: number, b: number) => `Mostrando os ${b} guias mais recentes de ${a}.`,
    ar: (a: number, b: number) => `يتم عرض أحدث ${b} دليلاً من ${a}.`,
    ru: (a: number, b: number) => `Показаны последние ${b} руководств из ${a}.`,
    ja: (a: number, b: number) => `全${a}件のガイドのうち最新${b}件を表示しています。`,
    de: (a: number, b: number) => `Die ${b} neuesten von ${a} Ratgebern werden angezeigt.`,
    hi: (a: number, b: number) => `कुल ${a} गाइड में से नवीनतम ${b} दिखाई जा रही हैं।`,
  },
}

export const latestArticlesCopy = {
  title: {
    en: 'Africa Fastener Industry Insights',
    zh: '非洲紧固件行业洞察',
    es: 'Perspectivas del sector de fijaciones en África',
    fr: 'Analyses du secteur de la visserie en Afrique',
    pt: 'Panorama do setor de fixadores na África',
    ar: 'رؤى قطاع المثبتات في أفريقيا',
    ru: 'Аналитика рынка крепежа в Африке',
    ja: 'アフリカファスナー業界のインサイト',
    de: 'Einblicke in die afrikanische Befestigungsbranche',
    hi: 'अफ्रीका फास्टनर उद्योग की अंतर्दृष्टि',
  },
  subtitle: {
    en: 'Deep analysis of fastener procurement trends and technical standards for African infrastructure, mining, and energy projects',
    zh: '深度分析非洲各国基建、矿业、能源项目的紧固件采购趋势与技术标准',
    es: 'Análisis profundo de las tendencias de compra y normas técnicas en infraestructura, minería y energía en África',
    fr: "Analyse approfondie des tendances d'achat et des normes techniques pour les projets d'infrastructure, de mines et d'énergie en Afrique",
    pt: 'Análise profunda das tendências de compra e normas técnicas em infraestrutura, mineração e energia na África',
    ar: 'تحليل معمّق لاتجاهات الشراء والمعايير الفنية في مشاريع البنية التحتية والتعدين والطاقة في أفريقيا',
    ru: 'Подробный разбор закупочных трендов и технических стандартов в инфраструктуре, горнодобыче и энергетике Африки',
    ja: 'アフリカのインフラ・鉱山・エネルギー案件における調達動向と技術規格の詳細分析',
    de: 'Detaillierte Analyse der Beschaffungstrends und technischen Normen für Infrastruktur-, Bergbau- und Energieprojekte in Afrika',
    hi: 'अफ्रीका में बुनियादी ढाँचा, खनन और ऊर्जा परियोजनाओं की खरीद प्रवृत्तियों और तकनीकी मानकों का गहन विश्लेषण',
  },
  readMore: {
    en: 'Read article →',
    zh: '阅读全文 →',
    es: 'Leer artículo →',
    fr: "Lire l'article →",
    pt: 'Ler artigo →',
    ar: 'اقرأ المقال →',
    ru: 'Читать статью →',
    ja: '記事を読む →',
    de: 'Artikel lesen →',
    hi: 'लेख पढ़ें →',
  },
  viewAll: {
    en: 'View all articles',
    zh: '查看全部文章',
    es: 'Ver todos los artículos',
    fr: 'Voir tous les articles',
    pt: 'Ver todos os artigos',
    ar: 'عرض كل المقالات',
    ru: 'Все статьи',
    ja: 'すべての記事を見る',
    de: 'Alle Artikel',
    hi: 'सभी लेख देखें',
  },
}

export const backToArticles = {
  en: 'Back to articles',
  zh: '返回文章列表',
  es: 'Volver a los artículos',
  fr: 'Retour aux articles',
  pt: 'Voltar aos artigos',
  ar: 'العودة إلى المقالات',
  ru: 'К списку статей',
  ja: '記事一覧に戻る',
  de: 'Zurück zu den Artikeln',
  hi: 'लेखों पर वापस',
}

export const productGridCopy = {
  moqTon: {
    en: '1 ton', zh: '1 吨', es: '1 tonelada', fr: '1 tonne', pt: '1 tonelada',
    ar: '1 طن', ru: '1 тонна', ja: '1トン', de: '1 Tonne', hi: '1 टन',
  },
  quoteNote: {
    en: 'Quote on request',
    zh: '工厂直供 · 按需报价',
    es: 'Cotización a solicitud',
    fr: 'Devis sur demande',
    pt: 'Cotação sob consulta',
    ar: 'عرض سعر عند الطلب',
    ru: 'Цена по запросу',
    ja: 'ご要望に応じて見積',
    de: 'Angebot auf Anfrage',
    hi: 'अनुरोध पर कोट',
  },
  viewAll: {
    en: 'View all products',
    zh: '查看全部产品',
    es: 'Ver todos los productos',
    fr: 'Voir tous les produits',
    pt: 'Ver todos os produtos',
    ar: 'عرض كل المنتجات',
    ru: 'Все продукты',
    ja: 'すべての製品を見る',
    de: 'Alle Produkte',
    hi: 'सभी उत्पाद देखें',
  },
}

export const shareCopy = {
  title: {
    en: 'TradeGo Fasteners - Professional Manufacturer',
    zh: 'TradeGo 紧固件 - 专业制造商',
    es: 'TradeGo Fasteners - Fabricante profesional',
    fr: 'TradeGo Fasteners - Fabricant professionnel',
    pt: 'TradeGo Fasteners - Fabricante profissional',
    ar: 'TradeGo Fasteners - مصنّع محترف',
    ru: 'TradeGo Fasteners - профессиональный производитель',
    ja: 'TradeGo Fasteners - 専門メーカー',
    de: 'TradeGo Fasteners - Professioneller Hersteller',
    hi: 'TradeGo Fasteners - पेशेवर निर्माता',
  },
  desc: {
    en: 'ISO 9001 certified wholesale fastener manufacturer',
    zh: 'ISO 9001 认证紧固件批发商，专业生产干墙螺丝、自钻螺丝、螺栓螺母等',
    es: 'Fabricante mayorista de fijaciones con certificación ISO 9001',
    fr: 'Fabricant grossiste de visserie certifié ISO 9001',
    pt: 'Fabricante atacadista de fixadores com certificação ISO 9001',
    ar: 'مصنّع مثبتات بالجملة حاصل على شهادة ISO 9001',
    ru: 'Оптовый производитель крепежа с сертификатом ISO 9001',
    ja: 'ISO 9001 認証のファスナー卸売メーカー',
    de: 'Großhändler und Hersteller von Befestigungselementen, ISO 9001 zertifiziert',
    hi: 'ISO 9001 प्रमाणित थोक फास्टनर निर्माता',
  },
}
