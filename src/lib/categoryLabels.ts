// 文章分类标签的十语种对照表（2026-11-24 新增）
// 背景：文章 JSON 的 category 字段只有英文（Technical Guide / Market Analysis …），
// 直接渲染会让西语、阿语、日语页的 hero 徽标和“Más en …”出现英文分类名。
// 这里统一做映射，取不到就回落原值，保证不破坏任何页面。
export type CatLocale = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'ar' | 'ru' | 'ja' | 'de' | 'hi'

const L = (
  en: string, zh: string, es: string, fr: string, pt: string,
  ar: string, ru: string, ja: string, de: string, hi: string,
) => ({ en, zh, es, fr, pt, ar, ru, ja, de, hi })

export const categoryLabels: Record<string, Record<string, string>> = {
  'Anchors': L('Anchors', '锚栓', 'Anclajes', 'Ancrages', 'Chumbadores', 'مراسي', 'Анкеры', 'アンカー', 'Anker', 'एंकर'),
  'Buying Guide': L('Buying Guide', '选购指南', 'Guía de compra', "Guide d'achat", 'Guia de compra', 'دليل الشراء', 'Руководство по покупке', '購入ガイド', 'Einkaufsratgeber', 'ख़रीद गाइड'),
  'Case Study': L('Case Study', '案例研究', 'Caso práctico', 'Étude de cas', 'Estudo de caso', 'دراسة حالة', 'Пример из практики', '事例紹介', 'Fallstudie', 'केस स्टडी'),
  'Construction': L('Construction', '建筑', 'Construcción', 'Construction', 'Construção', 'البناء', 'Строительство', '建設', 'Bauwesen', 'निर्माण'),
  'Energy': L('Energy', '能源', 'Energía', 'Énergie', 'Energia', 'الطاقة', 'Энергетика', 'エネルギー', 'Energie', 'ऊर्जा'),
  'Fastener guide': L('Fastener guide', '紧固件指南', 'Guía de fijaciones', 'Guide des fixations', 'Guia de fixações', 'دليل المثبتات', 'Руководство по крепежу', '締結具ガイド', 'Befestigungstechnik-Ratgeber', 'फास्टनर गाइड'),
  'Import Guide': L('Import Guide', '进口指南', 'Guía de importación', "Guide d'importation", 'Guia de importação', 'دليل الاستيراد', 'Руководство по импорту', '輸入ガイド', 'Importratgeber', 'आयात गाइड'),
  'Industry Guide': L('Industry Guide', '行业指南', 'Guía sectorial', 'Guide sectoriel', 'Guia setorial', 'دليل قطاعي', 'Отраслевое руководство', '業界ガイド', 'Branchenratgeber', 'उद्योग गाइड'),
  'Installation Guide': L('Installation Guide', '安装指南', "Guía de instalación", "Guide d'installation", 'Guia de instalação', 'دليل التركيب', 'Руководство по монтажу', '施工ガイド', 'Montageratgeber', 'इंस्टॉलेशन गाइड'),
  'Logistics Guide': L('Logistics Guide', '物流指南', 'Guía logística', 'Guide logistique', 'Guia logístico', 'دليل لوجستي', 'Логистическое руководство', '物流ガイド', 'Logistikratgeber', 'लॉजिस्टिक्स गाइड'),
  'Market Analysis': L('Market Analysis', '市场分析', 'Análisis de mercado', 'Analyse de marché', 'Análise de mercado', 'تحليل السوق', 'Анализ рынка', '市場分析', 'Marktanalyse', 'बाज़ार विश्लेषण'),
  'Market Guide': L('Market Guide', '市场指南', 'Guía de mercado', 'Guide du marché', 'Guia de mercado', 'دليل السوق', 'Рыночное руководство', '市場ガイド', 'Marktratgeber', 'बाज़ार गाइड'),
  'Mining Fasteners': L('Mining Fasteners', '矿业紧固件', 'Fijaciones para minería', 'Fixations pour mines', 'Fixações para mineração', 'مثبتات التعدين', 'Крепёж для горной отрасли', '鉱山用締結具', 'Befestigung für Bergbau', 'खनन फास्टनर'),
  'Nails': L('Nails', '钉子', 'Clavos', 'Pointes', 'Pregos', 'مسامير', 'Гвозди', 'くぎ', 'Nägel', 'कील'),
  'Price Guide': L('Price Guide', '价格指南', 'Guía de precios', 'Guide des prix', 'Guia de preços', 'دليل الأسعار', 'Руководство по ценам', '価格ガイド', 'Preisratgeber', 'मूल्य गाइड'),
  'Procurement Guide': L('Procurement Guide', '采购指南', 'Guía de compras', "Guide d'approvisionnement", 'Guia de aquisição', 'دليل التوريد', 'Руководство по закупкам', '調達ガイド', 'Beschaffungsratgeber', 'प्रोक्योरमेंट गाइड'),
  'Procurement Guide - Africa': L('Procurement Guide - Africa', '非洲采购指南', 'Guía de compras - África', "Guide d'approvisionnement - Afrique", 'Guia de aquisição - África', 'دليل التوريد - أفريقيا', 'Руководство по закупкам — Африка', '調達ガイド（アフリカ）', 'Beschaffungsratgeber – Afrika', 'प्रोक्योरमेंट गाइड – अफ्रीका'),
  'Product Comparison': L('Product Comparison', '产品对比', 'Comparativa de producto', 'Comparatif produit', 'Comparação de produtos', 'مقارنة المنتجات', 'Сравнение продуктов', '製品比較', 'Produktvergleich', 'उत्पाद तुलना'),
  'Product Guide': L('Product Guide', '产品指南', 'Guía de producto', 'Guide produit', 'Guia de produto', 'دليل المنتج', 'Руководство по продукту', '製品ガイド', 'Produktratgeber', 'उत्पाद गाइड'),
  'Quality Guide': L('Quality Guide', '质量指南', 'Guía de calidad', 'Guide qualité', 'Guia de qualidade', 'دليل الجودة', 'Руководство по качеству', '品質ガイド', 'Qualitätsratgeber', 'गुणवत्ता गाइड'),
  'Quality Standards': L('Quality Standards', '质量标准', 'Normas de calidad', 'Normes de qualité', 'Normas de qualidade', 'معايير الجودة', 'Стандарты качества', '品質規格', 'Qualitätsnormen', 'गुणवत्ता मानक'),
  'Reference Guide': L('Reference Guide', '参考指南', 'Guía de referencia', 'Guide de référence', 'Guia de referência', 'دليل مرجعي', 'Справочное руководство', 'リファレンスガイド', 'Referenzratgeber', 'संदर्भ गाइड'),
  'Reference Guide - Africa': L('Reference Guide - Africa', '非洲参考指南', 'Guía de referencia - África', 'Guide de référence - Afrique', 'Guia de referência - África', 'دليل مرجعي - أفريقيا', 'Справочное руководство — Африка', 'リファレンスガイド（アフリカ）', 'Referenzratgeber – Afrika', 'संदर्भ गाइड – अफ्रीका'),
  'Regional Supplier': L('Regional Supplier', '区域供应商', 'Proveedor regional', 'Fournisseur régional', 'Fornecedor regional', 'مورّد إقليمي', 'Региональный поставщик', '地域サプライヤー', 'Regionaler Lieferant', 'क्षेत्रीय आपूर्तिकर्ता'),
  'Screws': L('Screws', '螺丝', 'Tornillos', 'Vis', 'Parafusos', 'براغي', 'Винты', 'ねじ', 'Schrauben', 'स्क्रू'),
  'Supplier Directory': L('Supplier Directory', '供应商名录', 'Directorio de proveedores', 'Annuaire des fournisseurs', 'Diretório de fornecedores', 'دليل الموردين', 'Каталог поставщиков', 'サプライヤー一覧', 'Lieferantenverzeichnis', 'आपूर्तिकर्ता निर्देशिका'),
  'Technical Guide': L('Technical Guide', '技术指南', 'Guía técnica', 'Guide technique', 'Guia técnico', 'دليل فني', 'Техническое руководство', '技術ガイド', 'Technischer Ratgeber', 'तकनीकी गाइड'),
  'Trade Guide': L('Trade Guide', '贸易指南', 'Guía comercial', 'Guide commercial', 'Guia comercial', 'دليل تجاري', 'Торговое руководство', '貿易ガイド', 'Handelsratgeber', 'व्यापार गाइड'),
  'Waterproofing': L('Waterproofing', '防水材料', 'Impermeabilización', 'Étanchéité', 'Impermeabilização', 'العزل المائي', 'Гидроизоляция', '防水', 'Abdichtung', 'वॉटरप्रूफ़िंग'),
}

export function categoryLabel(category: string | undefined, locale: string): string {
  if (!category) return ''
  return categoryLabels[category]?.[locale] || category
}

// 品类页 URL slug：与 /industry/category/[category] 的 generateStaticParams 同一算法
export function categorySlug(cat: string): string {
  return cat.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')
}
