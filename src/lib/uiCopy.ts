// 界面文案集中表（只放短句/标签，正文与 SEO 文案走各自的数据文件）
// 所有键必须齐十语种；取值时用 pick() 回落 en。
export type Loc = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'ar' | 'ru' | 'ja' | 'de' | 'hi'

export const pick = <T,>(m: Record<string, T>, locale?: string | null): T =>
  (m[locale ?? 'en'] ?? m.en) as T

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
    zh: '工厂直采 · 按需报价',
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
    en: 'SGS/BV inspection on request wholesale fastener manufacturer',
    zh: '按 SABS 1195 / DIN / ISO 规格供货的紧固件批发商，专业生产干墙螺丝、自钻螺丝、螺栓螺母等',
    es: 'Fabricante mayorista de fijaciones que produce según SABS 1195 / DIN / ISO',
    fr: 'Fabricant grossiste de visserie produisant selon SABS 1195 / DIN / ISO',
    pt: 'Fabricante atacadista de fixadores que produz conforme SABS 1195 / DIN / ISO',
    ar: 'مصنّع مثبتات بالجملة ينتج وفق SABS 1195 / DIN / ISO',
    ru: 'Оптовый производитель крепежа по SABS 1195 / DIN / ISO',
    ja: 'SABS 1195 / DIN / ISO 規格で製造するファスナー卸売メーカー',
    de: 'Großhändler und Hersteller von Befestigungselementen, gefertigt nach SABS 1195 / DIN / ISO',
    hi: 'SABS 1195 / DIN / ISO मानक पर उत्पादन करने वाला थोक फास्टनर निर्माता',
  },
}

const L10 = (en: string, zh: string, es: string, fr: string, pt: string, ar: string, ru: string, ja: string, de: string, hi: string) =>
  ({ en, zh, es, fr, pt, ar, ru, ja, de, hi })

export const searchCatLabels: Record<string, Record<string, string>> = {
  'All Products': L10('All Products', '全部产品', 'Todos los productos', 'Tous les produits', 'Todos os produtos', 'كل المنتجات', 'Все продукты', 'すべての製品', 'Alle Produkte', 'सभी उत्पाद'),
  'Screws': L10('Screws', '螺丝', 'Tornillos', 'Vis', 'Parafusos', 'براغي', 'Винты', 'ビス・ねじ', 'Schrauben', 'स्क्रू'),
  'Bolts & Nuts': L10('Bolts & Nuts', '螺栓螺母', 'Pernos y tuercas', 'Boulons et écrous', 'Parafusos e porcas', 'براغي وصواميل', 'Болты и гайки', 'ボルト・ナット', 'Schrauben und Muttern', 'बोल्ट और नट'),
  'Nails': L10('Nails', '钉子', 'Clavos', 'Pointes', 'Pregos', 'مسامير', 'Гвозди', 'くぎ', 'Nägel', 'कील'),
  'Nails & Wire': L10('Nails & Wire', '钉子与铁丝', 'Clavos y alambre', 'Pointes et fils', 'Pregos e arame', 'مسامير وأسلاك', 'Гвозди и проволока', 'くぎとワイヤー', 'Nägel und Draht', 'कील और तार'),
  'Anchors': L10('Anchors', '锚栓', 'Anclajes', 'Ancrages', 'Chumbadores', 'مثبتات الخرسانة', 'Анкеры', 'アンカー', 'Anker', 'एंकर'),
  'Nuts': L10('Nuts', '螺母', 'Tuercas', 'Écrous', 'Porcas', 'صواميل', 'Гайки', 'ナット', 'Muttern', 'नट'),
  'Washers': L10('Washers', '垫圈', 'Arandelas', 'Rondelles', 'Arruelas', 'حلقات', 'Шайбы', 'ワッシャー', 'Unterlegscheiben', 'वॉशर'),
  'Solar Mounting': L10('Solar Mounting', '光伏支架', 'Montaje solar', 'Montage solaire', 'Estrutura solar', 'تثبيت الطاقة الشمسية', 'Солнечные крепления', '太陽光マウント', 'Solarmontage', 'सोलर माउंटिंग'),
  'Rivets': L10('Rivets', '铆钉', 'Remaches', 'Rivets', 'Rebites', 'برشام', 'Заклёпки', 'リベット', 'Nieten', 'रिवेट'),
  'Brackets & Profiles': L10('Brackets & Profiles', '支架与型材', 'Soportes y perfiles', 'Supports et profilés', 'Suportes e perfis', 'دعامات ومقاطع', 'Кронштейны и профили', 'ブラケット・形材', 'Halterungen und Profile', 'ब्रैकेट और प्रोफ़ाइल'),
  'Waterproofing': L10('Waterproofing', '防水材料', 'Impermeabilización', 'Étanchéité', 'Impermeabilização', 'العزل المائي', 'Гидроизоляция', '防水資材', 'Abdichtung', 'वॉटरप्रूफ़िंग'),
}

export const productSearchCopy = {
  placeholder: L10(
    'Search products...', '搜索产品...', 'Buscar productos...', 'Rechercher des produits...', 'Buscar produtos...',
    'ابحث عن المنتجات...', 'Поиск продуктов...', '製品を検索...', 'Produkte suchen...', 'उत्पाद खोजें...',
  ),
  resultsFor: {
    en: (n: number, q: string) => `${n} results for "${q}"`,
    zh: (n: number, q: string) => `${n} 个结果：“${q}”`,
    es: (n: number, q: string) => `${n} resultados para "${q}"`,
    fr: (n: number, q: string) => `${n} résultats pour « ${q} »`,
    pt: (n: number, q: string) => `${n} resultados para "${q}"`,
    ar: (n: number, q: string) => `${n} نتيجة لـ "${q}"`,
    ru: (n: number, q: string) => `${n} результатов по запросу «${q}»`,
    ja: (n: number, q: string) => `「${q}」の検索結果 ${n} 件`,
    de: (n: number, q: string) => `${n} Ergebnisse für „${q}“`,
    hi: (n: number, q: string) => `"${q}" के लिए ${n} परिणाम`,
  },
  countLine: {
    en: (n: number, cat?: string) => (cat ? `${n} products in ${cat}` : `${n} products`),
    zh: (n: number, cat?: string) => (cat ? `${n} 个产品 · ${cat}` : `${n} 个产品`),
    es: (n: number, cat?: string) => (cat ? `${n} productos en ${cat}` : `${n} productos`),
    fr: (n: number, cat?: string) => (cat ? `${n} produits dans « ${cat} »` : `${n} produits`),
    pt: (n: number, cat?: string) => (cat ? `${n} produtos em ${cat}` : `${n} produtos`),
    ar: (n: number, cat?: string) => (cat ? `${n} منتج في ${cat}` : `${n} منتج`),
    ru: (n: number, cat?: string) => (cat ? `${n} товаров · ${cat}` : `${n} товаров`),
    ja: (n: number, cat?: string) => (cat ? `${n} 件の製品・${cat}` : `${n} 件の製品`),
    de: (n: number, cat?: string) => (cat ? `${n} Produkte in ${cat}` : `${n} Produkte`),
    hi: (n: number, cat?: string) => (cat ? `${n} उत्पाद · ${cat}` : `${n} उत्पाद`),
  },
  emptyTitle: L10(
    'No products found', '没有找到匹配的产品', 'No se encontraron productos', 'Aucun produit trouvé', 'Nenhum produto encontrado',
    'لم يتم العثور على منتجات', 'Продукты не найдены', '該当する製品が見つかりません', 'Keine Produkte gefunden', 'कोई उत्पाद नहीं मिला',
  ),
  emptyHint: L10(
    'Try different keywords or browse all products', '换个关键词，或浏览全部产品',
    'Pruebe otras palabras clave o vea todos los productos',
    'Essayez d\'autres mots-clés ou parcourez tous les produits',
    'Tente outras palavras-chave ou veja todos os produtos',
    'جرّب كلمات مفتاحية أخرى أو تصفّح كل المنتجات',
    'Попробуйте другие ключевые слова или все продукты',
    '別のキーワードでお試しいただくか、すべての製品をご覧ください',
    'Andere Suchbegriffe verwenden oder alle Produkte ansehen',
    'दूसरे कीवर्ड आज़माएँ या सभी उत्पाद देखें',
  ),
}

export const navLabels = {
  home: L10('Home', '首页', 'Inicio', 'Accueil', 'Início', 'الرئيسية', 'Главная', 'ホーム', 'Startseite', 'होम'),
  products: L10('Products', '产品', 'Productos', 'Produits', 'Produtos', 'المنتجات', 'Продукция', '製品', 'Produkte', 'उत्पाद'),
  industry: L10('Industry Guides', '行业指南', 'Guías del sector', 'Guides sectoriels', 'Guias do setor', 'أدلة القطاع', 'Отраслевые руководства', '業界ガイド', 'Branchenratgeber', 'उद्योग गाइड'),
  about: L10('About', '关于我们', 'Nosotros', 'À propos', 'Sobre nós', 'من نحن', 'О нас', '会社概要', 'Über uns', 'हमारे बारे में'),
  contact: L10('Contact', '联系我们', 'Contacto', 'Contact', 'Contato', 'اتصل بنا', 'Контакты', 'お問い合わせ', 'Kontakt', 'संपर्क करें'),
}

export const orgCopy = {
  description: L10(
    'TradeGo is a fastener manufacturer and exporter specializing in serving African construction markets for 20+ years. Products include drywall screws, self-drilling screws, hex bolts, nuts, IBR nails. Mill-direct pricing with sea freight to Durban, Lagos, Mombasa and 20+ African countries.',
    'TradeGo 是按 SABS 1195 / DIN / ISO 规格生产的紧固件生产商与出口商，专注服务非洲建筑市场 20 余年。产品包括干墙螺丝、自钻螺丝、螺栓螺母、IBR 钉等。工厂价，海运至德班、拉各斯、蒙巴萨等 20 余个非洲国家。',
    'TradeGo es un fabricante y exportador de fijaciones que produce según SABS 1195 / DIN / ISO, especializado en el mercado de la construcción africano desde hace más de 20 años. Productos: tornillos para placas de yeso, autotaladrantes, pernos hexagonales, tuercas, clavos IBR. Precios de fábrica con flete marítimo a Durban, Lagos, Mombasa y más de 20 países africanos.',
    "TradeGo est un fabricant et exportateur de visserie produisant selon SABS 1195 / DIN / ISO, spécialisé sur les marchés de la construction africains depuis plus de 20 ans. Produits : vis plaque de plâtre, vis autoforeuses, boulons hexagonaux, écrous, pointes IBR. Prix départ usine, fret maritime vers Durban, Lagos, Mombasa et plus de 20 pays africains.",
    'A TradeGo é uma fabricante e exportadora de fixadores que produz conforme SABS 1195 / DIN / ISO, especializada no mercado de construção africano há mais de 20 anos. Produtos: parafusos para drywall, autoatarraxantes, parafusos sextavados, porcas, pregos IBR. Preço de fábrica com frete marítimo para Durban, Lagos, Mombaça e mais de 20 países africanos.',
    'TradeGo مصنّع ومصدّر مثبتات ينتج وفق SABS 1195 / DIN / ISO، متخصص في أسواق البناء الأفريقية منذ أكثر من 20 عاماً. تشمل المنتجات براغي الجبس وذاتية الحفر ومسامير سداسية وصواميل ومسامير IBR. أسعار المصنع مع شحن بحري إلى ديربان ولاغوس ومومباسا وأكثر من 20 دولة أفريقية.',
    'TradeGo — производитель и экспортёр крепежа, работающий по SABS 1195 / DIN / ISO, специализируется на строительных рынках Африки более 20 лет. Продукция: винты для гипсокартона, саморезы, болты с шестигранной головкой, гайки, гвозди IBR. Заводские цены, морская доставка в Дурбан, Лагос, Момбасу и более 20 африканских стран.',
    'TradeGo は SABS 1195 / DIN / ISO 規格で製造するファスナーメーカー兼輸出業者で、20 年以上にわたりアフリカ建設市場に特化しています。石膏ボード用ねじ、自穿孔ねじ、六角ボルト、ナット、IBR くぎなどを扱い、工場価格でダーバン、ラゴス、モンバサなど 20 カ国以上へ海上輸送します。',
    'TradeGo ist ein Befestigungselemente-Hersteller, der nach SABS 1195 / DIN / ISO fertigt und Exporteur mit über 20 Jahren Fokus auf afrikanische Baumärkte. Sortiment: Trockenbauschrauben, Bohrschrauben, Sechskantschrauben, Muttern, IBR-Nägel. Fabrikpreise mit Seefracht nach Durban, Lagos, Mombasa und über 20 afrikanische Länder.',
    'TradeGo SABS 1195 / DIN / ISO मानक पर उत्पादन करने वाला फास्टनर निर्माता एवं निर्यातक है, जो 20 से अधिक वर्षों से अफ्रीकी निर्माण बाज़ारों पर केंद्रित है। उत्पाद: ड्राईवॉल स्क्रू, सेल्फ-ड्रिलिंग स्क्रू, हेक्स बोल्ट, नट, IBR कील। फैक्ट्री मूल्य और डरबन, लागोस, मोम्बासा सहित 20+ अफ्रीकी देशों तक समुद्री ढुलाई।',
  ),
  slogan: L10(
    'Reliable Fasteners, Delivered to Africa',
    '非洲可靠紧固件供应商',
    'Fijaciones fiables, entregadas en África',
    'Visserie fiable, livrée en Afrique',
    'Fixadores confiáveis, entregues na África',
    'مثبتات موثوقة تصل إلى أفريقيا',
    'Надёжный крепёж с доставкой в Африку',
    '信頼のファスナーをアフリカへ',
    'Zuverlässige Befestigungstechnik, geliefert nach Afrika',
    'भरोसेमंद फास्टनर, अफ्रीका तक डिलीवरी',
  ),
}

export const cookieCopy = {
  text: L10(
    'We use anonymous analytics to understand how the site is used, so we can improve it.',
    '我们使用匿名统计了解网站使用情况，用于改进产品和内容。',
    'Usamos analítica anónima para entender cómo se usa el sitio y mejorarlo.',
    "Nous utilisons des statistiques anonymes pour comprendre l'utilisation du site et l'améliorer.",
    'Usamos análises anônimas para entender o uso do site e melhorá-lo.',
    'نستخدم تحليلات مجهولة لفهم كيفية استخدام الموقع وتحسينه.',
    'Мы используем анонимную аналитику, чтобы понять, как используется сайт, и улучшить его.',
    'サイトの利用状況を匿名で分析し、改善に役立てています。',
    'Wir nutzen anonyme Analysen, um die Nutzung der Website zu verstehen und sie zu verbessern.',
    'हम अनाम विश्लेषण से समझते हैं कि साइट कैसे उपयोग होती है, ताकि इसे बेहतर बना सकें।',
  ),
  accept: L10('Accept', '同意', 'Aceptar', 'Accepter', 'Aceitar', 'موافق', 'Принять', '同意する', 'Akzeptieren', 'स्वीकार करें'),
  decline: L10('Essential only', '仅必要', 'Solo esenciales', 'Essentiels uniquement', 'Apenas essenciais', 'الضروري فقط', 'Только необходимые', '必須のみ', 'Nur notwendige', 'केवल आवश्यक'),
  ariaLabel: L10('Cookie notice', 'Cookie 提示', 'Aviso de cookies', 'Avis sur les cookies', 'Aviso de cookies', 'إشعار ملفات تعريف الارتباط', 'Уведомление о cookie', 'Cookie に関するお知らせ', 'Cookie-Hinweis', 'Cookie सूचना'),
}

export const productAsideCopy = {
  category: L10('Product category', '所属品类', 'Categoría de producto', 'Catégorie de produit', 'Categoria do produto', 'فئة المنتج', 'Категория продукта', '製品カテゴリー', 'Produktkategorie', 'उत्पाद श्रेणी'),
  hint: L10(
    'See the other lines and matching parts in this category on the home page.',
    '同品类的其他规格与配套件，可在首页对应分区一次看完。',
    'Vea las demás líneas y piezas compatibles de esta categoría en la página de inicio.',
    "Retrouvez les autres gammes et pièces associées de cette catégorie sur la page d'accueil.",
    'Veja as demais linhas e peças compatíveis desta categoria na página inicial.',
    'اطّلع على بقية الخطوط والقطع المتوافقة في هذه الفئة من الصفحة الرئيسية.',
    'Другие позиции и сопутствующие детали этой категории — на главной странице.',
    '同じカテゴリーの他の品目と付属部品は、トップページでまとめてご覧いただけます。',
    'Weitere Linien und passende Teile dieser Kategorie finden Sie auf der Startseite.',
    'इस श्रेणी की अन्य लाइनें और मिलते-जुलते पुर्जे होम पेज पर देखें।',
  ),
}

export const appLabels = {
  construction: L10('Construction', '建筑', 'Construcción', 'Construction', 'Construção', 'البناء', 'Строительство', '建設', 'Bauwesen', 'निर्माण'),
  mining: L10('Mining', '采矿', 'Minería', 'Extraction minière', 'Mineração', 'التعدين', 'Горнодобыча', '鉱山', 'Bergbau', 'खनन'),
  solar: L10('Solar Energy', '太阳能', 'Energía solar', 'Énergie solaire', 'Energia solar', 'الطاقة الشمسية', 'Солнечная энергетика', '太陽光発電', 'Solarenergie', 'सौर ऊर्जा'),
}

export const certNote = L10(
  'All products come with material certificates, test reports, and quality guarantees. We provide third-party inspection services upon request.',
  '所有产品均配有材料证书、测试报告和质量保证。我们提供第三方检验服务。',
  'Todos los productos incluyen certificados de material, informes de ensayo y garantía de calidad. Ofrecemos inspección por terceros a solicitud.',
  "Tous les produits sont livrés avec certificats matière, rapports d'essai et garantie qualité. Inspection par un tiers sur demande.",
  'Todos os produtos incluem certificados de material, relatórios de ensaio e garantia de qualidade. Oferecemos inspeção por terceiros sob solicitação.',
  'جميع المنتجات مصحوبة بشهادات المواد وتقارير الاختبار وضمان الجودة، ونوفّر خدمات الفحص من طرف ثالث عند الطلب.',
  'Все продукты комплектуются сертификатами материалов, протоколами испытаний и гарантией качества. По запросу проводим независимую инспекцию.',
  '全製品に材料証明書・試験報告書・品質保証を添付。ご要望に応じて第三者検査にも対応します。',
  'Alle Produkte werden mit Materialzeugnissen, Prüfberichten und Qualitätsgarantie geliefert. Auf Wunsch organisieren wir Drittprüfungen.',
  'सभी उत्पाद सामग्री प्रमाणपत्र, परीक्षण रिपोर्ट और गुणवत्ता गारंटी के साथ आते हैं। अनुरोध पर तीसरे पक्ष का निरीक्षण उपलब्ध है।',
)

export const sourcesTitle = L10(
  'References & Standards', '参考资料与标准', 'Referencias y normas', 'Références et normes', 'Referências e normas',
  'المراجع والمعايير', 'Источники и стандарты', '参考資料と規格', 'Quellen und Normen', 'संदर्भ और मानक',
)

export const teamText = L10(
  'Expert fastener specialists with deep knowledge in construction materials and industrial applications',
  '专业的紧固件专家团队，在建筑材料和工业应用领域拥有深厚知识',
  'Especialistas en fijaciones con amplio conocimiento de materiales de construcción y aplicaciones industriales',
  'Spécialistes de la visserie maîtrisant les matériaux de construction et les applications industrielles',
  'Especialistas em fixadores com profundo conhecimento em materiais de construção e aplicações industriais',
  'متخصصون في المثبتات بخبرة عميقة في مواد البناء والتطبيقات الصناعية',
  'Специалисты по крепежу с глубокими знаниями строительных материалов и промышленного применения',
  '建築資材と産業用途に精通したファスナー専門チーム',
  'Fachleute für Befestigungstechnik mit fundiertem Wissen zu Baustoffen und Industrieanwendungen',
  'निर्माण सामग्री और औद्योगिक उपयोग में गहरी विशेषज्ञता वाले फास्टनर विशेषज्ञ',
)

export const siteSchemaCopy = {
  description: L10(
    'Made to SABS 1195 / DIN / ISO China fastener manufacturer. 20+ years exporting to Africa. Mill-direct prices for drywall screws, IBR nails, and construction fasteners.',
    '按 SABS 1195 / DIN / ISO 规格生产的中国紧固件制造商。20 余年对非出口经验。干墙螺丝、IBR 钉、建筑紧固件工厂价直销。',
    'Fabricante chino de fijaciones que produce según SABS 1195 / DIN / ISO. Más de 20 años exportando a África. Precios de fábrica para tornillos para placas de yeso, clavos IBR y fijaciones de construcción.',
    "Fabricant produisant selon SABS 1195 / DIN / ISO. Plus de 20 ans d'export vers l'Afrique. Prix d'usine pour vis plaque de plâtre, pointes IBR et visserie de construction.",
    'Fabricante chinês de fixadores que produce según SABS 1195 / DIN / ISO. Mais de 20 anos exportando para a África. Preços de fábrica para parafusos para drywall, pregos IBR e fixadores de construção.',
    'مصنّع صيني للمثبتات ينتج وفق SABS 1195 / DIN / ISO. أكثر من 20 عاماً من التصدير إلى أفريقيا. أسعار المصنع لبراغي الجبس ومسامير IBR ومثبتات البناء.',
    'Китайский производитель крепежа по SABS 1195 / DIN / ISO. Более 20 лет экспорта в Африку. Заводские цены на винты для гипсокартона, гвозди IBR и строительный крепёж.',
    'SABS 1195 / DIN / ISO 規格で製造する中国ファスナーメーカー。20 年以上アフリカへ輸出。石膏ボード用ねじ、IBR くぎ、建築ファスナーを工場価格で供給。',
    'Chinesischer Befestigungselemente-Hersteller, gefertigt nach SABS 1195 / DIN / ISO. Über 20 Jahre Export nach Afrika. Fabrikpreise für Trockenbauschrauben, IBR-Nägel und Baubefestigungen.',
    'SABS 1195 / DIN / ISO मानक पर उत्पादन करने वाला चीनी फास्टनर निर्माता। 20+ वर्षों से अफ्रीका को निर्यात। ड्राईवॉल स्क्रू, IBR कील और निर्माण फास्टनर फैक्ट्री मूल्य पर।',
  ),
  keywords: L10(
    'drywall screws, IBR nails, fastener, China manufacturer, Africa, construction, wholesale',
    '干墙螺丝,IBR钉,紧固件,中国制造商,非洲,建筑,批发',
    'tornillos para placas de yeso, clavos IBR, fijaciones, fabricante en China, África, construcción, mayorista',
    'vis plaque de plâtre, pointes IBR, visserie, fabricant chinois, Afrique, construction, grossiste',
    'parafusos para drywall, pregos IBR, fixadores, fabricante na China, África, construção, atacado',
    'براغي الجبس, مسامير IBR, مثبتات, مصنع في الصين, أفريقيا, البناء, الجملة',
    'винты для гипсокартона, гвозди IBR, крепёж, производитель в Китае, Африка, строительство, оптом',
    '石膏ボード用ねじ, IBRくぎ, ファスナー, 中国メーカー, アフリカ, 建設, 卸売',
    'Trockenbauschrauben, IBR-Nägel, Befestigungselemente, Hersteller in China, Afrika, Bauwesen, Großhandel',
    'ड्राईवॉल स्क्रू, IBR कील, फास्टनर, चीन निर्माता, अफ्रीका, निर्माण, थोक',
  ),
  aboutName: L10('Fasteners', '紧固件', 'Fijaciones', 'Visserie', 'Fixadores', 'مثبتات', 'Крепёж', 'ファスナー', 'Befestigungselemente', 'फास्टनर'),
  aboutDesc: L10(
    'Construction fasteners including drywall screws, bolts, nuts, and specialized roofing nails',
    '建筑紧固件，包括干墙螺丝、螺栓、螺母和专业屋顶钉',
    'Fijaciones de construcción: tornillos para placas de yeso, pernos, tuercas y clavos especializados para cubiertas',
    'Visserie de construction : vis plaque de plâtre, boulons, écrous et pointes spéciales pour toiture',
    'Fixadores de construção: parafusos para drywall, parafusos, porcas e pregos especiais para cobertura',
    'مثبتات البناء: براغي الجبس والمسامير والصواميل ومسامير الأسطح المتخصصة',
    'Строительный крепёж: винты для гипсокартона, болты, гайки и специальные кровельные гвозди',
    '建築用ファスナー：石膏ボード用ねじ、ボルト、ナット、屋根専用くぎ',
    'Baubefestigungen: Trockenbauschrauben, Schrauben, Muttern und spezielle Dachnägel',
    'निर्माण फास्टनर: ड्राईवॉल स्क्रू, बोल्ट, नट और विशेष छत कीलें',
  ),
  audienceName: L10(
    'Construction professionals in Africa', '非洲建筑专业人士', 'Profesionales de la construcción en África',
    'Professionnels du bâtiment en Afrique', 'Profissionais da construção na África',
    'متخصصو البناء في أفريقيا', 'Специалисты строительной отрасли в Африке', 'アフリカの建設関係者',
    'Bauprofis in Afrika', 'अफ्रीका में निर्माण पेशेवर',
  ),
  searchDesc: L10(
    'Search for fasteners and construction hardware', '搜索紧固件和建筑五金',
    'Buscar fijaciones y ferretería de construcción', 'Rechercher visserie et quincaillerie de construction',
    'Buscar fixadores e ferragens de construção', 'ابحث عن المثبتات ومعدات البناء',
    'Поиск крепежа и строительной фурнитуры', 'ファスナーと建築金物を検索',
    'Befestigungselemente und Baubeschläge suchen', 'फास्टनर और निर्माण हार्डवेयर खोजें',
  ),
}

export const imageSchemaCopy = {
  logoCaption: L10('TradeGo Fasteners Logo', 'TradeGo 紧固件标志', 'Logotipo de TradeGo Fasteners', 'Logo TradeGo Fasteners', 'Logotipo da TradeGo Fasteners', 'شعار TradeGo Fasteners', 'Логотип TradeGo Fasteners', 'TradeGo Fasteners ロゴ', 'TradeGo Fasteners Logo', 'TradeGo Fasteners लोगो'),
  productDesc: {
    en: (c: string) => `High-quality ${c}, Made to SABS 1195 / DIN / ISO`,
    zh: (c: string) => `高质量${c}，按 SABS 1195 / DIN / ISO 规格生产`,
    es: (c: string) => `Producto de alta calidad: ${c}, que produce según SABS 1195 / DIN / ISO`,
    fr: (c: string) => `Produit de haute qualité : ${c}, produit selon SABS 1195 / DIN / ISO`,
    pt: (c: string) => `Produto de alta qualidade: ${c}, que produce según SABS 1195 / DIN / ISO`,
    ar: (c: string) => `${c} عالي الجودة، وفق SABS 1195 / DIN / ISO`,
    ru: (c: string) => `${c} высокого качества, по SABS 1195 / DIN / ISO`,
    ja: (c: string) => `高品質な${c}、SABS 1195 / DIN / ISO 規格`,
    de: (c: string) => `Hochwertige ${c}, gefertigt nach SABS 1195 / DIN / ISO`,
    hi: (c: string) => `उच्च गुणवत्ता वाला ${c}, SABS 1195 / DIN / ISO मानक पर उत्पादन`,
  },
  articleDesc: {
    en: (c: string) => `${c} - TradeGo GEO Article Image`,
    zh: (c: string) => `${c} - TradeGo GEO 文章配图`,
    es: (c: string) => `${c}: imagen de artículo TradeGo GEO`,
    fr: (c: string) => `${c} : image d'article TradeGo GEO`,
    pt: (c: string) => `${c}: imagem de artigo TradeGo GEO`,
    ar: (c: string) => `${c}: صورة مقال TradeGo GEO`,
    ru: (c: string) => `${c}: изображение статьи TradeGo GEO`,
    ja: (c: string) => `${c}：TradeGo GEO 記事用画像`,
    de: (c: string) => `${c}: TradeGo GEO Artikelbild`,
    hi: (c: string) => `${c}: TradeGo GEO लेख छवि`,
  },
}

export const articleSchemaCopy = {
  section: L10(
    'Fastener Knowledge', '紧固件知识', 'Conocimientos sobre fijaciones', 'Connaissances en visserie',
    'Conhecimento em fixadores', 'معرفة المثبتات', 'Знания о крепеже', 'ファスナー知識', 'Befestigungswissen', 'फास्टनर ज्ञान',
  ),
  keywords: L10(
    'fasteners,drywall screws,self-drilling screws,bolts,nuts,IBR nails,construction,wholesale',
    '紧固件,干墙螺丝,自钻螺丝,螺栓,螺母,IBR钉,建筑,批发',
    'fijaciones, tornillos para placas de yeso, autotaladrantes, pernos, tuercas, clavos IBR, construcción, mayorista',
    'visserie, vis plaque de plâtre, vis autoforeuses, boulons, écrous, pointes IBR, construction, grossiste',
    'fixadores, parafusos para drywall, autoatarraxantes, parafusos, porcas, pregos IBR, construção, atacado',
    'مثبتات, براغي الجبس, براغي ذاتية الحفر, مسامير, صواميل, مسامير IBR, البناء, الجملة',
    'крепёж, винты для гипсокартона, саморезы, болты, гайки, гвозди IBR, строительство, оптом',
    'ファスナー, 石膏ボード用ねじ, 自穿孔ねじ, ボルト, ナット, IBRくぎ, 建設, 卸売',
    'Befestigungselemente, Trockenbauschrauben, Bohrschrauben, Schrauben, Muttern, IBR-Nägel, Bauwesen, Großhandel',
    'फास्टनर, ड्राईवॉल स्क्रू, सेल्फ-ड्रिलिंग स्क्रू, बोल्ट, नट, IBR कील, निर्माण, थोक',
  ),
}

export const eventSchemaCopy = {
  keywords: L10(
    'fasteners, construction, South Africa, trade show, IBR nails, drywall screws',
    '紧固件,建筑,南非,展会,IBR钉,干墙螺丝',
    'fijaciones, construcción, Sudáfrica, feria, clavos IBR, tornillos para placas de yeso',
    'visserie, construction, Afrique du Sud, salon, pointes IBR, vis plaque de plâtre',
    'fixadores, construção, África do Sul, feira, pregos IBR, parafusos para drywall',
    'مثبتات, البناء, جنوب أفريقيا, معرض, مسامير IBR, براغي الجبس',
    'крепёж, строительство, ЮАР, выставка, гвозди IBR, винты для гипсокартона',
    'ファスナー, 建設, 南アフリカ, 展示会, IBRくぎ, 石膏ボード用ねじ',
    'Befestigungselemente, Bauwesen, Südafrika, Messe, IBR-Nägel, Trockenbauschrauben',
    'फास्टनर, निर्माण, दक्षिण अफ्रीका, प्रदर्शनी, IBR कील, ड्राईवॉल स्क्रू',
  ),
}

export const sourcesCopy = {
  intro: L10(
    'Our product quality complies with the following international and regional standards',
    '我们的产品质量符合以下国际和地区标准',
    'Nuestra calidad cumple las siguientes normas internacionales y regionales',
    'La qualité de nos produits est conforme aux normes internationales et régionales suivantes',
    'A qualidade dos nossos produtos atende às seguintes normas internacionais e regionais',
    'تتوافق جودة منتجاتنا مع المعايير الدولية والإقليمية التالية',
    'Качество нашей продукции соответствует следующим международным и региональным стандартам',
    '当社製品の品質は以下の国際・地域規格に適合しています',
    'Die Qualität unserer Produkte entspricht den folgenden internationalen und regionalen Normen',
    'हमारे उत्पादों की गुणवत्ता निम्नलिखित अंतरराष्ट्रीय और क्षेत्रीय मानकों के अनुरूप है',
  ),
  visit: L10(
    'Visit Website', '访问官网', 'Visitar sitio web', 'Visiter le site web', 'Visitar site',
    'زيارة الموقع', 'На сайт', '公式サイトを見る', 'Website besuchen', 'वेबसाइट देखें',
  ),
  note: L10(
    'All statistics based on internal business records and customer feedback surveys (2024)',
    '所有统计数据基于内部业务记录和客户反馈调查（2024）',
    'Todas las estadísticas se basan en registros internos y encuestas de satisfacción de clientes (2024)',
    'Toutes les statistiques reposent sur nos registres internes et des enquêtes de satisfaction client (2024)',
    'Todas as estatísticas baseiam-se em registros internos e pesquisas de satisfação de clientes (2024)',
    'كل الإحصاءات مستندة إلى السجلات الداخلية واستبيانات رضا العملاء (2024)',
    'Все статистические данные основаны на внутренних записях и опросах клиентов (2024)',
    'すべての統計は社内記録と顧客満足度調査（2024年）に基づきます',
    'Alle Angaben basieren auf internen Geschäftsunterlagen und Kundenumfragen (2024)',
    'सभी आँकड़े आंतरिक व्यावसायिक रिकॉर्ड और ग्राहक संतोष सर्वेक्षण (2024) पर आधारित हैं',
  ),
}

export const chatFallback = L10(
  'Thanks for your inquiry! Please leave your contact info and our sales team will reach out shortly. You can also email us at aimingtrade@hotmail.com or WhatsApp: +86-159-6340-9951',
  '感谢您的咨询！请留下您的联系方式，我们的销售团队会尽快联系您。您也可以直接发邮件至 aimingtrade@hotmail.com 或 WhatsApp: +86-159-6340-9951',
  '¡Gracias por su consulta! Déjenos sus datos de contacto y nuestro equipo comercial se pondrá en contacto en breve. También puede escribirnos a aimingtrade@hotmail.com o WhatsApp: +86-159-6340-9951',
  "Merci pour votre demande ! Laissez-nous vos coordonnées, notre équipe commerciale vous répondra rapidement. Vous pouvez aussi nous écrire à aimingtrade@hotmail.com ou sur WhatsApp : +86-159-6340-9951",
  'Obrigado pelo seu contato! Deixe seus dados e nossa equipe comercial retornará em breve. Você também pode escrever para aimingtrade@hotmail.com ou WhatsApp: +86-159-6340-9951',
  'شكراً لاستفسارك! اترك بيانات الاتصال وسيتواصل معك فريق المبيعات قريباً. يمكنك أيضاً مراسلتنا على aimingtrade@hotmail.com أو واتساب: +86-159-6340-9951',
  'Спасибо за запрос! Оставьте контакты, и наш отдел продаж свяжется с вами в ближайшее время. Также можно написать на aimingtrade@hotmail.com или WhatsApp: +86-159-6340-9951',
  'お問い合わせありがとうございます。ご連絡先をお知らせください。営業チームより折り返しご連絡します。aimingtrade@hotmail.com または WhatsApp（+86-159-6340-9951）でも承ります。',
  'Vielen Dank für Ihre Anfrage! Hinterlassen Sie Ihre Kontaktdaten, unser Vertrieb meldet sich kurzfristig. Sie erreichen uns auch unter aimingtrade@hotmail.com oder WhatsApp: +86-159-6340-9951',
  'आपकी पूछताछ के लिए धन्यवाद! अपना संपर्क विवरण छोड़ें, हमारी बिक्री टीम शीघ्र संपर्क करेगी। आप aimingtrade@hotmail.com या WhatsApp: +86-159-6340-9951 पर भी लिख सकते हैं',
)

// 文章页 CTA 兜底文案：文章 JSON 的 cta.text/buttonText 缺该语种时使用，
// 避免非英语页面出现英文 CTA（2026-11-24 修）
export const articleCta = {
  text: L10(
    'Need fasteners in bulk? Get a mill-direct quote from TradeGo.',
    '需要批量采购紧固件？获取 TradeGo 工厂直采报价。',
    '¿Necesita fijaciones al por mayor? Solicite una cotización directa de fábrica.',
    'Besoin de visserie en gros ? Demandez un devis direct usine.',
    'Precisa de fixações a granel? Peça uma cotação direta de fábrica.',
    'هل تحتاج مثبتات بالجملة؟ اطلب عرض سعر مباشرًا من المصنع.',
    'Нужны крепёжные изделия оптом? Запросите цену напрямую с завода.',
    'ボルト・ねじをまとめて調達されますか。工場直調達の見積をご依頼ください。',
    'Benötigen Sie Verbindungselemente in großen Mengen? Fordern Sie ein Direktangebot ab Werk an.',
    'बल्क में फास्टनर चाहिए? फैक्ट्री-डायरेक्ट कोटेशन मांगें।',
  ),
  button: L10(
    'Request a quote',
    '获取报价',
    'Solicitar cotización',
    'Demander un devis',
    'Pedir cotação',
    'اطلب عرض سعر',
    'Запросить цену',
    '見積を依頼',
    'Angebot anfordern',
    'कोटेशन मांगें',
  ),
}

// 认证徽标与询盘表单选项（2026-11-24 新增，原为硬编码英文）
export const badgeCopy = {
  sabs: L10('made to SABS 1195 spec', '按 SABS 1195 规格', 'según SABS 1195', 'selon SABS 1195', 'conforme SABS 1195', 'وفق SABS 1195', 'по SABS 1195', 'SABS 1195 規格', 'nach SABS 1195', 'SABS 1195 मानक'),
  ce: L10('CE Marked', 'CE 认证', 'Marcado CE', 'Marquage CE', 'Marcação CE', 'علامة CE', 'Маркировка CE', 'CE マーク', 'CE-Kennzeichnung', 'CE चिह्नित'),
  madeIn: L10('Made in China', '中国制造', 'Fabricado en China', 'Fabriqué en Chine', 'Fabricado na China', 'صناعة صينية', 'Сделано в Китае', '中国製', 'Hergestellt in China', 'चीन में निर्मित'),
  b2b: L10('B2B Verified', 'B2B 认证', 'Verificado B2B', 'Vérifié B2B', 'Verificado B2B', 'موثّق B2B', 'Проверено B2B', 'B2B 認証', 'B2B-geprüft', 'B2B सत्यापित'),
}

export const inquiryOptionCopy = [
  L10('Drywall Screws', '干墙螺钉', 'Tornillos para drywall', 'Vis à plaque de plâtre', 'Parafusos para drywall', 'براغي الجبس', 'Шурупы для гипсокартона', '石膏ボード用ねじ', 'Trockenbauschrauben', 'ड्राईवॉल स्क्रू'),
  L10('Self-Drilling Screws (TEK)', '自钻螺钉（TEK）', 'Tornillos autoperforantes (TEK)', 'Vis autoperceuses (TEK)', 'Parafusos autoperfurantes (TEK)', 'براغي حفر ذاتي (TEK)', 'Саморезы TEK', 'セルフドリリング（TEK）ねじ', 'Selbstbohrende TEK-Schrauben', 'सेल्फ-ड्रिलिंग (TEK) स्क्रू'),
  L10('Bolts & Nuts', '螺栓与螺母', 'Pernos y tuercas', 'Boulons et écrous', 'Parafusos e porcas', 'براغي وصواميل', 'Болты и гайки', 'ボルト・ナット', 'Schrauben und Muttern', 'बोल्ट और नट'),
  L10('IBR Roofing Nails', 'IBR 屋面钉', 'Clavos IBR para cubierta', 'Pointes IBR pour toiture', 'Pregos IBR para cobertura', 'مسامير IBR للأسقف', 'Кровельные гвозди IBR', 'IBR 屋根くぎ', 'IBR-Dachnägel', 'IBR रूफिंग कील'),
  L10('Anchor Bolts', '锚栓', 'Anclajes', 'Ancrages', 'Chumbadores', 'مراسي', 'Анкерные болты', 'アンカー', 'Anker', 'एंकर बोल्ट'),
  L10('Washers', '垫圈', 'Arandelas', 'Rondelles', 'Arruelas', 'حلقات', 'Шайбы', 'ワッシャー', 'Unterlegscheiben', 'वॉशर'),
  L10('Coach Screws', '六角头木螺钉', 'Tornillos para madera', 'Vis à bois hexagonales', 'Parafusos para madeira', 'براغي خشب سداسية', 'Шестигранные шурупы для дерева', '六角木ねじ', 'Sechskant-Holzschrauben', 'हेक्स वुड स्क्रू'),
  L10('Threaded Rods', '牙条', 'Varillas roscadas', 'Tiges filetées', 'Tirantes roscados', 'قضبان ملولبة', 'Шпильки', '全ねじ', 'Gewindestangen', 'थ्रेडेड रॉड'),
  L10('Other', '其他', 'Otros', 'Autres', 'Outros', 'أخرى', 'Другое', 'その他', 'Sonstiges', 'अन्य'),
]

// 参考资料（SourcesSection）四条标准的本地化说明，避免非中英站显示英文描述
export const sourceStandardCopy = {
  iso: L10(
    'International standard for quality management systems',
    '国际质量管理体系标准',
    'Norma internacional para sistemas de gestión de la calidad',
    'Norme internationale des systèmes de management de la qualité',
    'Norma internacional para sistemas de gestão da qualidade',
    'المعيار الدولي لأنظمة إدارة الجودة',
    'Международный стандарт систем менеджмента качества',
    '品質マネジメントシステムの国際規格',
    'Internationale Norm für Qualitätsmanagementsysteme',
    'गुणवत्ता प्रबंधन प्रणालियों का अंतरराष्ट्रीय मानक',
  ),
  sabs: L10(
    'South African national standards body',
    '南非国家标准化机构',
    'Organismo nacional de normalización de Sudáfrica',
    'Organisme national de normalisation sud-africain',
    'Organismo nacional de normalização da África do Sul',
    'الهيئة الوطنية للمعايير في جنوب أفريقيا',
    'Национальный орган по стандартизации ЮАР',
    '南アフリカの国家標準機関',
    'Südafrikanische Normungsorganisation',
    'दक्षिण अफ्रीका की राष्ट्रीय मानक संस्था',
  ),
  astm: L10(
    'International standards organization for materials and products',
    '材料和产品国际标准组织',
    'Organización internacional de normas para materiales y productos',
    'Organisation internationale de normalisation des matériaux et produits',
    'Organização internacional de normas para materiais e produtos',
    'منظمة دولية لوضع معايير المواد والمنتجات',
    'Международная организация стандартов на материалы и изделия',
    '材料・製品の国際標準化機関',
    'Internationale Normungsorganisation für Werkstoffe und Produkte',
    'सामग्री और उत्पादों के लिए अंतरराष्ट्रीय मानक संगठन',
  ),
  din: L10(
    'German national standards body',
    '德国国家标准化机构',
    'Organismo nacional de normalización de Alemania',
    'Organisme national de normalisation allemand',
    'Organismo nacional de normalização da Alemanha',
    'الهيئة الوطنية للمعايير في ألمانيا',
    'Национальный орган по стандартизации Германии',
    'ドイツの国家標準機関',
    'Deutsche Normungsorganisation',
    'जर्मनी की राष्ट्रीय मानक संस्था',
  ),
}

// 页脚固定条目（海运时效、标准列表、法务链接）十语
export const footerExtra = {
  seaFreight: L10('Sea Freight to Africa', '海运至非洲', 'Flete marítimo a África', 'Fret maritime vers l’Afrique', 'Frete marítimo para a África', 'الشحن البحري إلى أفريقيا', 'Морская доставка в Африку', 'アフリカへの海上輸送', 'Seefracht nach Afrika', 'अफ्रीका को समुद्री माल ढुलाई'),
  durban: L10('Durban 25-30 days', '德班 25–30 天', 'Durban 25-30 días', 'Durban 25-30 jours', 'Durban 25-30 dias', 'ديربان 25-30 يومًا', 'Дурбан 25-30 дней', 'ダーバン 25〜30 日', 'Durban 25-30 Tage', 'डरबन 25-30 दिन'),
  beira: L10('Beira 20-25 days', '贝拉 20–25 天', 'Beira 20-25 días', 'Beira 20-25 jours', 'Beira 20-25 dias', 'بيرا 20-25 يومًا', 'Бейра 20-25 дней', 'ベイラ 20〜25 日', 'Beira 20-25 Tage', 'बेइरा 20-25 दिन'),
  mombasa: L10('Mombasa 28-32 days', '蒙巴萨 28–32 天', 'Mombasa 28-32 días', 'Mombasa 28-32 jours', 'Mombasa 28-32 dias', 'مومباسا 28-32 يومًا', 'Момбаса 28-32 дней', 'モンバサ 28〜32 日', 'Mombasa 28-32 Tage', 'मोम्बासा 28-32 दिन'),
  dinStandards: L10('DIN Standards', 'DIN 标准', 'Normas DIN', 'Normes DIN', 'Normas DIN', 'معايير DIN', 'Стандарты DIN', 'DIN 規格', 'DIN-Normen', 'DIN मानक'),
  sabs: L10('SABS (South Africa)', 'SABS（南非）', 'SABS (Sudáfrica)', 'SABS (Afrique du Sud)', 'SABS (África do Sul)', 'SABS (جنوب أفريقيا)', 'SABS (ЮАР)', 'SABS（南アフリカ）', 'SABS (Südafrika)', 'SABS (दक्षिण अफ्रीका)'),
  astmStandards: L10('ASTM Standards', 'ASTM 标准', 'Normas ASTM', 'Normes ASTM', 'Normas ASTM', 'معايير ASTM', 'Стандарты ASTM', 'ASTM 規格', 'ASTM-Normen', 'ASTM मानक'),
  privacy: L10('Privacy Policy', '隐私政策', 'Política de privacidad', 'Politique de confidentialité', 'Política de privacidade', 'سياسة الخصوصية', 'Политика конфиденциальности', 'プライバシーポリシー', 'Datenschutzerklärung', 'गोपनीयता नीति'),
  terms: L10('Terms of Service', '服务条款', 'Términos de servicio', 'Conditions d’utilisation', 'Termos de serviço', 'شروط الخدمة', 'Условия использования', '利用規約', 'Nutzungsbedingungen', 'सेवा की शर्तें'),
}

// 结构化数据里用到的名称，避免十语站 schema 只输出英文
export const schemaCopy = {
  itemListName: L10('TradeGo fastener product range', 'TradeGo 紧固件产品线', 'Gama de fijaciones TradeGo', 'Gamme de fixations TradeGo', 'Linha de fixadores TradeGo', 'مجموعة مثبتات TradeGo', 'Ассортимент крепежа TradeGo', 'TradeGo 締結部品ラインナップ', 'TradeGo Befestigungssortiment', 'TradeGo फास्टनर उत्पाद श्रेणी'),
}

// 文章分类页：面包屑、篇数文案与 meta 描述（原先非英语站输出英文句子）
export const categoryPageCopy = {
  allArticles: L10('All Articles', '全部文章', 'Todos los artículos', 'Tous les articles', 'Todos os artigos', 'كل المقالات', 'Все статьи', 'すべての記事', 'Alle Artikel', 'सभी लेख'),
  count: {
    en: (n: number) => `${n} ${n === 1 ? 'article' : 'articles'} in this category`,
    zh: (n: number) => `本分类共 ${n} 篇指南`,
    es: (n: number) => `${n} artículos en esta categoría`,
    fr: (n: number) => `${n} articles dans cette catégorie`,
    pt: (n: number) => `${n} artigos nesta categoria`,
    ar: (n: number) => `${n} مقالًا في هذا التصنيف`,
    ru: (n: number) => `${n} статей в этой категории`,
    ja: (n: number) => `このカテゴリーの記事 ${n} 件`,
    de: (n: number) => `${n} Artikel in dieser Kategorie`,
    hi: (n: number) => `इस श्रेणी में ${n} लेख`,
  },
  desc: {
    en: (n: number, label: string) => `${n} practical guides on ${label.toLowerCase()}: bolt grades, coatings, port clearance and fastener sourcing for African and global buyers. ISO 9001 and SABS documented.`,
    zh: (n: number, label: string) => `${n} 篇${label}实操指南：螺栓等级、表面处理、港口清关与紧固件采购，面向非洲及全球买家，按 SABS 1195 / DIN / ISO 规格生产。`,
    es: (n: number, label: string) => `${n} guías prácticas de ${label.toLowerCase()}: clases de pernos, recubrimientos, despacho portuario y compra de fijaciones para África y mercados globales. ISO 9001 y SABS documentados.`,
    fr: (n: number, label: string) => `${n} guides pratiques sur ${label.toLowerCase()} : classes de boulons, revêtements, dédouanement portuaire et achat de fixations pour l’Afrique et les marchés mondiaux. ISO 9001 et SABS documentés.`,
    pt: (n: number, label: string) => `${n} guias práticos de ${label.toLowerCase()}: classes de parafusos, revestimentos, desembaraço portuário e compra de fixadores para a África e mercados globais. ISO 9001 e SABS documentados.`,
    ar: (n: number, label: string) => `${n} أدلة عملية حول ${label}: درجات البراغي والطلاءات والتخليص الجمركي وشراء المثبتات لأفريقيا والأسواق العالمية. منتجات مصنّعة وفق SABS 1195 / DIN / ISO.`,
    ru: (n: number, label: string) => `${n} практических руководств по теме «${label}»: классы прочности болтов, покрытия, таможенное оформление в портах и закупка крепежа для Африки и мировых рынков. Продукция по SABS 1195 / DIN / ISO.`,
    ja: (n: number, label: string) => `${label}の実務ガイド ${n} 件：ボルトの強度区分、表面処理、港での通関、アフリカおよび世界市場向けの締結部品調達。SABS 1195 / DIN / ISO 規格で製造。`,
    de: (n: number, label: string) => `${n} Praxisratgeber zu ${label}: Festigkeitsklassen, Beschichtungen, Hafenabfertigung und Beschaffung von Verbindungselementen für Afrika und globale Märkte. ISO 9001 und SABS dokumentiert.`,
    hi: (n: number, label: string) => `${label} पर ${n} व्यावहारिक गाइड: बोल्ट ग्रेड, कोटिंग, बंदरगाह क्लीयरेंस और अफ्रीका व वैश्विक बाज़ारों के लिए फास्टनर खरीद। SABS 1195 / DIN / ISO मानक पर उत्पादन।`,
  },
  ogDesc: {
    en: (label: string) => `${label} articles from TradeGo.`,
    zh: (label: string) => `${label}相关文章，来自 TradeGo。`,
    es: (label: string) => `Artículos sobre ${label} de TradeGo.`,
    fr: (label: string) => `Articles sur ${label} par TradeGo.`,
    pt: (label: string) => `Artigos sobre ${label} da TradeGo.`,
    ar: (label: string) => `مقالات عن ${label} من TradeGo.`,
    ru: (label: string) => `Статьи о «${label}» от TradeGo.`,
    ja: (label: string) => `${label}に関する記事（TradeGo）。`,
    de: (label: string) => `Artikel zu ${label} von TradeGo.`,
    hi: (label: string) => `${label} पर TradeGo के लेख।`,
  },
}

export const allCategoriesLabel = L10('All', '全部', 'Todos', 'Tous', 'Todos', 'الكل', 'Все', 'すべて', 'Alle', 'सभी')

// 认证卡片：名称与释义十语（原先非英语站只显示英文 Certification 说明）
export const certCardCopy: Record<string, { name: Record<string, string>; desc: Record<string, string> }> = {
  iso: {
    name: L10('ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015', 'ISO 9001:2015'),
    desc: L10('Quality Management System', '质量管理体系', 'Sistema de gestión de calidad', 'Système de management de la qualité', 'Sistema de gestão da qualidade', 'نظام إدارة الجودة', 'Система менеджмента качества', '品質マネジメントシステム', 'Qualitätsmanagementsystem', 'गुणवत्ता प्रबंधन प्रणाली'),
  },
  sabs: {
    name: L10('made to SABS 1195 spec', '按 SABS 1195 规格', 'según SABS 1195', 'selon SABS 1195', 'conforme SABS 1195', 'وفق SABS 1195', 'по SABS 1195', 'SABS 1195 規格', 'nach SABS 1195', 'SABS 1195 मानक'),
    desc: L10('South African Standards', '南非国家标准', 'Normas sudafricanas', 'Normes sud-africaines', 'Normas sul-africanas', 'المعايير الجنوب أفريقية', 'Стандарты ЮАР', '南アフリカ規格', 'Südafrikanische Normen', 'दक्षिण अफ़्रीकी मानक'),
  },
  ce: {
    name: L10('CE Marking', 'CE 认证', 'Marcado CE', 'Marquage CE', 'Marcação CE', 'علامة CE', 'Маркировка CE', 'CE マーク', 'CE-Kennzeichnung', 'CE मार्किंग'),
    desc: L10('European Conformity', '欧盟合规', 'Conformidad europea', 'Conformité européenne', 'Conformidade europeia', 'المطابقة الأوروبية', 'Соответствие ЕС', '欧州適合', 'Europäische Konformität', 'यूरोपीय अनुरूपता'),
  },
  tests: {
    name: L10('Test Reports', '检测报告', 'Informes de ensayo', 'Rapports d’essai', 'Laudos de ensaio', 'تقارير الاختبار', 'Протоколы испытаний', '試験報告書', 'Prüfberichte', 'परीक्षण रिपोर्ट'),
    desc: L10('Material & Coating Tests', '材质与镀层检测', 'Ensayos de material y revestimiento', 'Essais matériau et revêtement', 'Ensaios de material e revestimento', 'اختبارات المادة والطلاء', 'Испытания материала и покрытия', '材料・コーティング試験', 'Material- und Beschichtungsprüfungen', 'सामग्री और कोटिंग परीक्षण'),
  },
}

// 法律页语言声明：条款/隐私正文为英文原文（法律口径以英文版为准），非英语站给本语种提示
export const legalNoteCopy = L10(
  'This page is written in English; the English version is the legally binding one.',
  '本页正文为英文原文，具有法律效力的版本为英文版。',
  'Esta página está redactada en inglés; la versión inglesa es la que tiene validez legal.',
  'Cette page est rédigée en anglais ; seule la version anglaise fait foi juridiquement.',
  'Esta página está redigida em inglês; a versão inglesa é a que tem validade legal.',
  'هذه الصفحة مكتوبة بالإنجليزية، والنسخة الإنجليزية هي الملزمة قانونًا.',
  'Текст этой страницы составлен на английском языке; юридическую силу имеет английская версия.',
  'このページの本文は英語です。法的効力を持つのは英語版です。',
  'Diese Seite ist auf Englisch verfasst; rechtlich verbindlich ist die englische Fassung.',
  'यह पृष्ठ अंग्रेज़ी में लिखा गया है; कानूनी रूप से मान्य अंग्रेज़ी संस्करण है।'
)

export const lastUpdatedCopy = L10('Last updated: {d}', '最后更新：{d}', 'Última actualización: {d}', 'Dernière mise à jour : {d}', 'Última atualização: {d}', 'آخر تحديث: {d}', 'Обновлено: {d}', '最終更新: {d}', 'Zuletzt aktualisiert: {d}', 'अंतिम अद्यतन: {d}')
