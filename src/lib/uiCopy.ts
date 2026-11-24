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
    'TradeGo is a SABS & ISO 9001 certified fastener distributor specializing in serving African construction markets for 20+ years. Products include drywall screws, self-drilling screws, hex bolts, nuts, IBR nails. Factory-direct pricing with sea freight to Durban, Lagos, Mombasa and 20+ African countries.',
    'TradeGo 是专业的 SABS 和 ISO 9001 认证紧固件分销商，专注服务非洲建筑市场 20 余年。产品包括干墙螺丝、自钻螺丝、螺栓螺母、IBR 钉等。工厂价，海运至德班、拉各斯、蒙巴萨等 20 余个非洲国家。',
    'TradeGo es un distribuidor de fijaciones certificado SABS e ISO 9001, especializado en el mercado de la construcción africano desde hace más de 20 años. Productos: tornillos para placas de yeso, autotaladrantes, pernos hexagonales, tuercas, clavos IBR. Precios de fábrica con flete marítimo a Durban, Lagos, Mombasa y más de 20 países africanos.',
    "TradeGo est un distributeur de visserie certifié SABS et ISO 9001, spécialisé sur les marchés de la construction africains depuis plus de 20 ans. Produits : vis plaque de plâtre, vis autoforeuses, boulons hexagonaux, écrous, pointes IBR. Prix départ usine, fret maritime vers Durban, Lagos, Mombasa et plus de 20 pays africains.",
    'A TradeGo é uma distribuidora de fixadores certificada SABS e ISO 9001, especializada no mercado de construção africano há mais de 20 anos. Produtos: parafusos para drywall, autoatarraxantes, parafusos sextavados, porcas, pregos IBR. Preço de fábrica com frete marítimo para Durban, Lagos, Mombaça e mais de 20 países africanos.',
    'TradeGo موزّع مثبتات حاصل على شهادتي SABS وISO 9001، متخصص في أسواق البناء الأفريقية منذ أكثر من 20 عاماً. تشمل المنتجات براغي الجبس وذاتية الحفر ومسامير سداسية وصواميل ومسامير IBR. أسعار المصنع مع شحن بحري إلى ديربان ولاغوس ومومباسا وأكثر من 20 دولة أفريقية.',
    'TradeGo — дистрибьютор крепежа с сертификатами SABS и ISO 9001, специализируется на строительных рынках Африки более 20 лет. Продукция: винты для гипсокартона, саморезы, болты с шестигранной головкой, гайки, гвозди IBR. Заводские цены, морская доставка в Дурбан, Лагос, Момбасу и более 20 африканских стран.',
    'TradeGo は SABS および ISO 9001 認証のファスナー販売会社で、20 年以上にわたりアフリカ建設市場に特化しています。石膏ボード用ねじ、自穿孔ねじ、六角ボルト、ナット、IBR くぎなどを扱い、工場価格でダーバン、ラゴス、モンバサなど 20 カ国以上へ海上輸送します。',
    'TradeGo ist ein SABS- und ISO 9001-zertifizierter Befestigungselemente-Distributor mit über 20 Jahren Fokus auf afrikanische Baumärkte. Sortiment: Trockenbauschrauben, Bohrschrauben, Sechskantschrauben, Muttern, IBR-Nägel. Fabrikpreise mit Seefracht nach Durban, Lagos, Mombasa und über 20 afrikanische Länder.',
    'TradeGo SABS और ISO 9001 प्रमाणित फास्टनर वितरक है, जो 20 से अधिक वर्षों से अफ्रीकी निर्माण बाज़ारों पर केंद्रित है। उत्पाद: ड्राईवॉल स्क्रू, सेल्फ-ड्रिलिंग स्क्रू, हेक्स बोल्ट, नट, IBR कील। फैक्ट्री मूल्य और डरबन, लागोस, मोम्बासा सहित 20+ अफ्रीकी देशों तक समुद्री ढुलाई।',
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
