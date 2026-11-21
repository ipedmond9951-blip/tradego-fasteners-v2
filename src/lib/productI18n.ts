// 产品详情页的多语言文案（名称 / 简述 / 页面小标签）
// 2026-11-22 新增：产品详情页体系
import { type Locale } from '@/i18n'

type Dict = Record<string, string>

export const productNames: Record<string, Dict> = {
  'drywall-screws': {
    en: 'Drywall Screws', zh: '干墙钉', es: 'Tornillos para yeso', ar: 'مسامير الجبس',
    fr: 'Vis à cloison sèche', pt: 'Parafusos para drywall', ru: 'Саморезы для гипсокартона',
    ja: '石膏ボードねじ', de: 'Trockenbau-Schrauben', hi: 'ड्राईवॉल स्क्रू',
  },
  'self-drilling-screws': {
    en: 'Self-Drilling Screws', zh: '自钻自攻钉', es: 'Tornillos autotaladrantes', ar: 'مسامير ذاتية الحفر',
    fr: 'Vis autoperceuses', pt: 'Parafusos autoatarraventantes', ru: 'Саморезы с буром',
    ja: 'セルフドリリングねじ', de: 'Selbstbohrschrauben', hi: 'स्व-ड्रिलिंग स्क्रू',
  },
  'bolts-nuts': {
    en: 'Bolts & Nuts', zh: '螺栓与螺母', es: 'Pernos y tuercas', ar: 'براغي وصواميل',
    fr: 'Boulons et écrous', pt: 'Parafusos e porcas', ru: 'Болты и гайки',
    ja: 'ボルト・ナット', de: 'Schrauben und Muttern', hi: 'बोल्ट और नट्स',
  },
  'ibr-nails': {
    en: 'IBR Nails', zh: 'IBR 屋面钉', es: 'Clavos IBR', ar: 'مسامير IBR',
    fr: 'Clous IBR', pt: 'Pregos IBR', ru: 'Гвозди IBR',
    ja: 'IBR釘', de: 'IBR-Nägel', hi: 'IBR नेल',
  },
  'anchor-bolts': {
    en: 'Anchor Bolts', zh: '地脚螺栓', es: 'Pernos de anclaje', ar: 'براغي التثبيت',
    fr: 'Boulons d’ancrage', pt: 'Parafusos de ancoragem', ru: 'Анкерные болты',
    ja: 'アンカーボルト', de: 'Ankerbolzen', hi: 'एंकर बोल्ट',
  },
  'washers': {
    en: 'Washers', zh: '垫圈', es: 'Arandelas', ar: 'حلقات التثبيت',
    fr: 'Rondelles', pt: 'Arruelas', ru: 'Шайбы',
    ja: 'ワッシャー', de: 'Unterlegscheiben', hi: 'वॉशर',
  },
  'coach-screws': {
    en: 'Coach Screws', zh: '木螺丝', es: 'Tirafondos para madera', ar: 'مسامير خشب',
    fr: 'Tirefonds', pt: 'Parafusos para madeira', ru: 'Глухари для дерева',
    ja: 'コーチねじ', de: 'Holzschrauben', hi: 'कोच स्क्रू',
  },
  'threaded-rods': {
    en: 'Threaded Rods', zh: '螺纹杆（牙条）', es: 'Varillas roscadas', ar: 'قضبان ملولبة',
    fr: 'Tiges filetées', pt: 'Barras roscadas', ru: 'Резьбовые стержни',
    ja: '全ねじボルト', de: 'Gewindestangen', hi: 'थ्रेडेड रॉड',
  },
}

// 详情页简述（en / zh 为主，其它语言回落到 en）
export const productDescriptions: Record<string, Dict> = {
  'drywall-screws': {
    en: 'Bugle-head drywall screws for gypsum board and wood or metal studs. Coarse thread grips timber, fine thread grips steel studs. Phosphate or zinc plated, 3.5–4.8 mm × 25–100 mm.',
    zh: '喇叭头干墙钉，适用于石膏板与木龙骨/轻钢龙骨。粗牙咬木、细牙咬钢，磷化或镀锌处理，规格 3.5–4.8mm × 25–100mm。',
  },
  'self-drilling-screws': {
    en: 'TEK screws with a built-in drill point that drills, taps and fastens metal in one pass — no pre-drilling. DIN 7504 compliant, with EPDM washer options for waterproof roofing.',
    zh: '自钻自攻钉（TEK 钉）自带钻头，一次完成钻孔、攻丝、锁紧，无需预钻孔。符合 DIN 7504，可配 EPDM 防水垫用于屋面。',
  },
  'bolts-nuts': {
    en: 'Hex bolts and nuts in Grade 4.8 / 8.8 / 10.9, carbon steel or stainless 304/316, M5–M30 with lengths 20–300 mm. Full thread DIN 933 and partial thread DIN 931.',
    zh: '六角螺栓与螺母，4.8 / 8.8 / 10.9 级，碳钢或不锈钢 304/316，规格 M5–M30、长度 20–300mm。全牙 DIN 933 与半牙 DIN 931。',
  },
  'ibr-nails': {
    en: 'Umbrella-head roofing nails for IBR and corrugated sheeting, SABS 1195 compliant. Smooth or ring shank, electro-galvanized, 2.5–4.0 mm × 30–100 mm.',
    zh: '伞形头屋面钉，专用于 IBR 与波纹屋面板，符合 SABS 1195。光杆或环纹杆，电镀锌，规格 2.5–4.0mm × 30–100mm。',
  },
  'anchor-bolts': {
    en: 'Heavy-duty foundation and anchor bolts, M10–M30 with lengths 75–600 mm, hot-dip galvanized. DIN 529, ASTM F1554 and SABS 153 grades available.',
    zh: '重型地脚/锚固螺栓，M10–M30、长度 75–600mm，热镀锌。可提供 DIN 529、ASTM F1554 与 SABS 153 等级。',
  },
  'washers': {
    en: 'Flat, spring and lock washers M6–M36 to DIN 125 / ISO 7089 / DIN 127, in zinc plated carbon steel, hot-dip galvanized or stainless 304/316.',
    zh: '平垫、弹垫与锁紧垫圈，M6–M36，符合 DIN 125 / ISO 7089 / DIN 127，材质含镀锌碳钢、热镀锌与不锈钢 304/316。',
  },
  'coach-screws': {
    en: 'Hex-head coach screws (lag screws) for structural timber connections, M6–M12 × 30–200 mm, hot-dip galvanized for outdoor and coastal jobs.',
    zh: '六角头木螺丝（马车螺栓），用于木结构承重连接，M6–M12 × 30–200mm，热镀锌适用于户外与沿海环境。',
  },
  'threaded-rods': {
    en: 'Fully threaded rods M6–M24 in 1 m / 2 m / 3 m lengths, Grade 4.8 / 8.8 / 10.9, zinc plated, HDG or stainless 304/316, cut-to-size available.',
    zh: '全牙螺纹杆，M6–M24，1m/2m/3m 定尺，4.8/8.8/10.9 级，可镀锌、热镀锌或不锈钢 304/316，支持定尺切割。',
  },
}

export const uiLabels: Record<string, Dict> = {
  overview: {
    en: 'Overview', zh: '产品概述', es: 'Descripción', ar: 'نظرة عامة', fr: 'Présentation',
    pt: 'Visão geral', ru: 'Обзор', ja: '概要', de: 'Überblick', hi: 'अवलोकन',
  },
  specifications: {
    en: 'Specifications', zh: '技术规格', es: 'Especificaciones', ar: 'المواصفات', fr: 'Spécifications',
    pt: 'Especificações', ru: 'Характеристики', ja: '仕様', de: 'Technische Daten', hi: 'विनिर्देश',
  },
  features: {
    en: 'Key features', zh: '核心特点', es: 'Características', ar: 'الميزات الرئيسية', fr: 'Caractéristiques',
    pt: 'Características', ru: 'Особенности', ja: '特長', de: 'Merkmale', hi: 'मुख्य विशेषताएँ',
  },
  applications: {
    en: 'Applications', zh: '应用场景', es: 'Aplicaciones', ar: 'التطبيقات', fr: 'Applications',
    pt: 'Aplicações', ru: 'Применение', ja: '用途', de: 'Anwendungen', hi: 'अनुप्रयोग',
  },
  faq: {
    en: 'FAQ', zh: '常见问题', es: 'Preguntas frecuentes', ar: 'الأسئلة الشائعة', fr: 'FAQ',
    pt: 'Perguntas frequentes', ru: 'Вопросы и ответы', ja: 'よくある質問', de: 'FAQ', hi: 'सामान्य प्रश्न',
  },
  related: {
    en: 'Related products', zh: '相关产品', es: 'Productos relacionados', ar: 'منتجات ذات صلة', fr: 'Produits associés',
    pt: 'Produtos relacionados', ru: 'Похожие товары', ja: '関連製品', de: 'Ähnliche Produkte', hi: 'संबंधित उत्पाद',
  },
  quote: {
    en: 'Request a quote', zh: '获取报价', es: 'Solicitar cotización', ar: 'اطلب عرض سعر', fr: 'Demander un devis',
    pt: 'Solicitar cotação', ru: 'Запросить цену', ja: '見積もりを依頼', de: 'Angebot anfordern', hi: 'कोटेशन मांगें',
  },
  allProducts: {
    en: 'All products', zh: '全部产品', es: 'Todos los productos', ar: 'جميع المنتجات', fr: 'Tous les produits',
    pt: 'Todos os produtos', ru: 'Все товары', ja: 'すべての製品', de: 'Alle Produkte', hi: 'सभी उत्पाद',
  },
  from: {
    en: 'From', zh: '起订价', es: 'Desde', ar: 'ابتداءً من', fr: 'À partir de',
    pt: 'A partir de', ru: 'От', ja: '参考単価', de: 'Ab', hi: 'से शुरू',
  },
  moq: {
    en: 'MOQ', zh: '最小起订量', es: 'Pedido mínimo', ar: 'الحد الأدنى للطلب', fr: 'Quantité minimum',
    pt: 'Pedido mínimo', ru: 'Минимальный заказ', ja: '最小注文数', de: 'Mindestbestellmenge', hi: 'न्यूनतम ऑर्डर',
  },
  guide: {
    en: 'Technical guide', zh: '技术指南', es: 'Guía técnica', ar: 'دليل فني', fr: 'Guide technique',
    pt: 'Guia técnico', ru: 'Техническое руководство', ja: '技術ガイド', de: 'Technischer Leitfaden', hi: 'तकनीकी गाइड',
  },
}

export const specLabels: Record<string, Dict> = {
  size: { en: 'Size range', zh: '规格范围', es: 'Rango de tamaño', ar: 'نطاق المقاسات', fr: 'Plage de dimensions', pt: 'Faixa de tamanho', ru: 'Диапазон размеров', ja: 'サイズ範囲', de: 'Größenbereich', hi: 'आकार सीमा' },
  standard: { en: 'Standard', zh: '执行标准', es: 'Norma', ar: 'المعيار', fr: 'Norme', pt: 'Norma', ru: 'Стандарт', ja: '規格', de: 'Norm', hi: 'मानक' },
  material: { en: 'Material', zh: '材质', es: 'Material', ar: 'المادة', fr: 'Matériau', pt: 'Material', ru: 'Материал', ja: '材質', de: 'Werkstoff', hi: 'सामग्री' },
  finish: { en: 'Finish', zh: '表面处理', es: 'Acabado', ar: 'التشطيب', fr: 'Finition', pt: 'Acabamento', ru: 'Покрытие', ja: '表面処理', de: 'Oberfläche', hi: 'फिनिश' },
  grade: { en: 'Grade', zh: '强度等级', es: 'Grado', ar: 'الدرجة', fr: 'Grade', pt: 'Grau', ru: 'Класс прочности', ja: '強度等級', de: 'Festigkeitsklasse', hi: 'ग्रेड' },
  minOrder: { en: 'MOQ', zh: '最小起订量', es: 'Pedido mínimo', ar: 'الحد الأدنى للطلب', fr: 'Quantité minimum', pt: 'Pedido mínimo', ru: 'Минимальный заказ', ja: '最小注文数', de: 'Mindestbestellmenge', hi: 'न्यूनतम ऑर्डर' },
}

export function pick(map: Dict | undefined, locale: Locale): string {
  if (!map) return ''
  return map[locale] || map.en || ''
}
