'use client'

import Image from 'next/image'
import { type Locale, t } from '@/i18n'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ProductGridProps { locale?: Locale }

const products = [
  { slug: 'drywall-screws', image: '/images/products/drywall-screws-1.webp', pricePerPiece: 0.02, nameKey: 'drywall',
    articleSlug: 'drywall-screws-selection-guide',
    specs: { size: '3.5-4.8mm × 25-100mm', standard: 'DIN 7505 / GB/T 15856' } },
  { slug: 'self-drilling-screws', image: '/images/products/self-drilling-screws-1.webp', pricePerPiece: 0.03, nameKey: 'selfdrilling',
    articleSlug: 'self-drilling-screws-selection-guide',
    specs: { size: '4.2-6.3mm × 19-150mm', standard: 'DIN 7504 / ANSI' } },
  { slug: 'bolts-nuts', image: '/images/products/bolts-nuts-1.webp', pricePerPiece: 0.05, nameKey: 'bolts',
    articleSlug: 'hex-bolt-dimensions-chart',
    specs: { size: 'M5-M30 × 20-300mm', standard: 'DIN 933/934 / ISO 4014', grades: '4.8 / 8.8 / 10.9', materials: 'Carbon Steel / SS304 / SS316' } },
  { slug: 'ibr-nails', image: '/images/products/ibr-nails-1.webp', pricePerPiece: 0.01, nameKey: 'ibr',
    articleSlug: 'ibr-roofing-nails-installation-guide',
    specs: { size: '2.5-4.0mm × 30-100mm', standard: 'SABS 1195' } },
  { slug: 'anchor-bolts', image: '/images/products/anchor-bolts.webp', pricePerPiece: 0.12, nameKey: 'anchor',
    articleSlug: 'anchor-bolts-selection-guide',
    specs: { size: 'M10-M30 × 75-1000mm', standard: 'DIN 529 / ASTM F1554', grades: 'Grade 36 / Grade 55 / Grade 105', materials: 'Carbon Steel / SS304 / SS316' } },
  { slug: 'washers', image: '/images/products/washers.webp', pricePerPiece: 0.008, nameKey: 'washers',
    articleSlug: 'flat-washers-vs-spring-washers',
    specs: { size: 'M6-M36', standard: 'DIN 125 / ISO 7089' } },
  { slug: 'coach-screws', image: '/images/products/coach-screws.webp', pricePerPiece: 0.025, nameKey: 'coach',
    articleSlug: 'fastener-selection-guide-african-construction',
    specs: { size: 'M6-M12 × 30-200mm', standard: 'DIN 571 / LS 1993', materials: 'Carbon Steel / SS304 / SS316', finishes: 'Hot-Dip Galvanized / Zinc Plated / Plain' } },
  { slug: 'threaded-rods', image: '/images/products/threaded-rods.webp', pricePerPiece: 0.08, nameKey: 'threaded',
    articleSlug: 'threaded-rod-studding-guide',
    specs: { size: 'M6-M24 × 1m-3m', standard: 'DIN 975 / ISO 898' } },
]

const productText: Record<string, Record<string, { name: string; desc: string }>> = {
  en: {
    drywall: { name: 'Drywall Screws', desc: 'Premium bugle head screws for drywall installation. Coarse thread for wood studs, fine thread for metal studs. Available in 3.5-4.8mm × 25-100mm, zinc plated or black phosphate finish.' },
    selfdrilling: { name: 'Self-Drilling Screws', desc: 'High-performance TEK screws for metal-to-metal fastening. Built-in drill point eliminates pre-drilling. EPDM washer options for waterproof roofing applications. DIN 7504 compliant.' },
    bolts: { name: 'Hex Bolts & Nuts', desc: 'Industrial hex bolts and nuts for construction and mining across Africa. Grade 8.8 and 10.9 high-tensile options. DIN 933 full thread and DIN 931 partial thread. Hot-dip galvanized for outdoor Zimbabwe and South Africa projects. Stainless steel 304/316 for mining applications. Custom sizes M6-M30, 20-300mm lengths. Bulk orders welcome with factory direct pricing.' },
    ibr: { name: 'IBR Nails', desc: 'Umbrella head roofing nails for IBR/corrugated roofing. SABS 1195 compliant for African markets. Smooth or ring shank options. Hot-dip galvanized for corrosion resistance.' },
    anchor: { name: 'Anchor Bolts', desc: 'Heavy-duty anchor bolts for African construction: mining foundations, solar panel mounts, transmission towers. ASTM F1554 Grade 36 (36 ksi) or Grade 55 (55 ksi) options. Hot-dip galvanized (HDG) for Zimbabwe and South Africa outdoor projects. Stainless steel 316 for coastal Kenya and Tanzania. Available M10-M30, lengths 75-600mm with custom lengths up to 1000mm. DIN 529 and ASTM F1554 compliant with full material traceability. Bulk pricing for Africa projects.' },
    washers: { name: 'Washers', desc: 'Flat washers and spring washers for load distribution and vibration resistance. Available in zinc plated, hot-dip galvanized, and stainless steel A2/A4. DIN 125, DIN 127 compliant. M6-M36 sizes.' },
    coach: { name: 'Coach Screws', desc: 'Heavy-duty hex head coach screws for African construction: timber frame roofing, deck building, fence post installation, and solar panel mounting structures. Full thread for maximum grip in wood and composite materials. Hot-dip galvanized (HDG) for Zimbabwe outdoor projects. Stainless steel 304 for coastal Kenya and Tanzania. M6-M12, 30-200mm. DIN 571 compliant. Bulk pricing for Africa.' },
    threaded: { name: 'Threaded Rods', desc: 'Fully threaded rods for structural anchoring and assembly. Available in zinc plated steel and stainless steel. Custom lengths available up to 3 meters. DIN 975 compliant, M6-M24 sizes.' },
  },
  zh: {
    drywall: { name: '干壁钉', desc: '优质喇叭头干壁钉，专用于石膏板安装。粗牙适合木龙骨，细牙适合轻钢龙骨。规格3.5-4.8mm × 25-100mm，镀锌或黑磷化处理。' },
    selfdrilling: { name: '自钻螺丝', desc: '高性能TEK自钻螺丝，金属对金属连接无需预钻孔。带EPDM垫片款适用于防水屋顶。符合DIN 7504标准。' },
    bolts: { name: '螺栓螺母', desc: '工业级六角螺栓螺母，强度等级4.8、8.8、10.9可选。全丝、半丝规格齐全。镀锌、热镀锌、不锈钢表面处理。符合DIN 933/934、ISO 4014/4017。' },
    ibr: { name: 'IBR钉', desc: '伞头屋顶钉，专用于IBR/瓦楞板屋面。符合SABS 1195南非标准。光钉/环纹钉可选，热镀锌防腐。' },
    anchor: { name: '地脚螺栓', desc: '重型地脚螺栓，用于基础和结构连接。ASTM F1554 36级或55级可选。热镀锌处理，适用于户外和混凝土应用。规格M10-M30，长度75-600mm。' },
    washers: { name: '垫圈', desc: '平垫圈和弹簧垫圈，用于分散荷载和防震。镀锌、热镀锌和不锈钢A2/A4可选。符合DIN 125、DIN 127标准。规格M6-M36。' },
    coach: { name: '木螺丝', desc: '重型六角木螺丝，用于木对木、木对金属连接。全丝设计，抓 l力强。热镀锌处理，适用于户外Decking和围栏。' },
    threaded: { name: '牙条', desc: '全牙牙条，用于结构锚固和组装。镀锌钢和不锈钢可选。可定制长度，最长3米。符合DIN 975标准，规格M6-M24。' },
  },
  es: {
    drywall: { name: 'Tornillos para tablaroca', desc: 'Tornillos de cabeza avellanada para instalación de tablaroca' },
    selfdrilling: { name: 'Tornillos autorroscantes', desc: 'Tornillos de alto rendimiento para metal y madera' },
    bolts: { name: 'Pernos y tuercas', desc: 'Pernos hexagonales y tuercas de grado industrial' },
    ibr: { name: 'Clavos IBR', desc: 'Clavos de techo con cabeza paraguas para techos IBR' },
    anchor: { name: 'Pernos de anclaje', desc: 'Pernos de anclaje de servicio pesado para cimentación y conexiones estructurales' },
    washers: { name: 'Arandelas', desc: 'Arandelas planas y de muelle para distribución de carga y resistencia a vibraciones' },
    coach: { name: 'Tornillos para madera', desc: 'Tornillos para madera de servicio pesado con cabeza hexagonal' },
    threaded: { name: 'Varillas roscadas', desc: 'Varillas completamente roscadas para anclaje estructural y ensamblaje' },
  },
  ar: {
    drywall: { name: 'براغي جبس', desc: 'براغي رأس بوق عالية الجودة لتركيب الجبس' },
    selfdrilling: { name: 'براغي ذاتية الحفر', desc: 'براغي حفر عالية الأداء للمعادن والخشب' },
    bolts: { name: 'مسامير وصواميل', desc: 'مسامير سداسية وصواميل صناعية بدرجات متعددة' },
    ibr: { name: 'مسامير IBR', desc: 'مسامير سقف برأس مظلة للأسقف المموجة' },
    anchor: { name: 'براغي التثبيت', desc: 'براغي تثبيت الخدمة الشاقة للأساسات والوصلات الهيكلية' },
    washers: { name: 'براغي الغسالات', desc: 'غسالات مسطحة ومتنابيع لتوزيع الحمل ومقاومة الاهتزاز' },
    coach: { name: 'براغي الخشب', desc: 'براغي خشب الخدمة الشاقة برأس سداسي' },
    threaded: { name: 'قضبان ملولبة', desc: 'قضبان ملولبة بالكامل لربط الهياكل والتجميع' },
  },
  fr: {
    drywall: { name: 'Vis à plâtre', desc: 'Vis à tête fraisée pour installation de plaques de plâtre' },
    selfdrilling: { name: 'Vis autoperceuses', desc: 'Vis à haute performance pour métal et bois' },
    bolts: { name: 'Boulons et écrous', desc: 'Boulons hexagonaux et écrous de qualité industrielle' },
    ibr: { name: 'Clous IBR', desc: 'Clous de toiture à tête parapluie pour toitures IBR' },
    anchor: { name: "Boulons d'ancrage", desc: "Boulons d'ancrage robustes pour fondations et connexions structurelles" },
    washers: { name: 'Rondelles', desc: 'Rondelles plates et ressorts pour distribution de charge et résistance aux vibrations' },
    coach: { name: 'Vis pour bois', desc: 'Vis pour bois robustes à tête hexagonale' },
    threaded: { name: 'Tiges filetées', desc: 'Tiges entièrement filetées pour ancrage structurel et assemblage' },
  },
  pt: {
    drywall: { name: 'Parafusos para drywall', desc: 'Parafusos de cabeça francesa para instalação de drywall' },
    selfdrilling: { name: 'Parafusos autorroscantes', desc: 'Parafusos de alto desempenho para metal e madeira' },
    bolts: { name: 'Parafusos e porcas', desc: 'Parafusos hexagonais e porcas de grau industrial' },
    ibr: { name: 'Pregos IBR', desc: 'Pregos de telhado com cabeça guarda-chuva para telhados IBR' },
    anchor: { name: 'Chumbadores', desc: 'Chumbadores de serviço pesado para fundações e conexões estruturais' },
    washers: { name: 'Arruelas', desc: 'Arruelas planas e de pressão para distribuição de carga e resistência à vibração' },
    coach: { name: 'Parafusos para madeira', desc: 'Parafusos para madeira de serviço pesado com cabeça hexagonal' },
    threaded: { name: 'Hastes roscadas', desc: 'Hastes totalmente roscadas para ancoragem estrutural e montagem' },
  },
  ru: {
    drywall: { name: 'Гипсовые винты', desc: 'Винты с потайной головкой для гипсокартона' },
    selfdrilling: { name: 'Саморезы', desc: 'Высокопроизводительные саморезы для металла и дерева' },
    bolts: { name: 'Болты и гайки', desc: 'Шестигранные болты и гайки промышленного класса' },
    ibr: { name: 'Гвозди IBR', desc: 'Кровельные гвозди с зонтичной головкой для IBR-крыш' },
    anchor: { name: 'Анкерные болты', desc: 'Анкерные болты для фундамента и конструктивных соединений' },
    washers: { name: 'Шайбы', desc: 'Плоские и пружинные шайбы для распределения нагрузки и виброгашения' },
    coach: { name: 'Шурупы для дерева', desc: 'Тяжелые шурупы для дерева с шестигранной головкой' },
    threaded: { name: 'Резьбовые шпильки', desc: 'Полностью резьбовые шпильки для структурного крепления и сборки' },
  },
  ja: {
    drywall: { name: '石膏ボード用ネジ', desc: '石膏ボード取り付け用プレミアムネジ' },
    selfdrilling: { name: 'タッピンねじ', desc: '金属・木材用高性能ドリルネジ' },
    bolts: { name: 'ボルト・ナット', desc: '工業用六角ボルト・ナット各種グレード' },
    ibr: { name: 'IBR釘', desc: 'IBR/波形屋根用傘頭屋根釘' },
    anchor: { name: 'アンカーボルト', desc: '基礎・構造接続用の重型アンカーボルト' },
    washers: { name: 'ワッシャー', desc: '荷重分散・振動抵抗用の平ワッシャー・スプリングワッシャー' },
    coach: { name: '木ねじ', desc: '六角頭付き重型木ねじ' },
    threaded: { name: 'ねじ棒', desc: '構造定着・組立用の全ねじ棒' },
  },
  de: {
    drywall: { name: 'Gipskartonschrauben', desc: 'Premium-Senkkopfschrauben für Gipskartoninstallation' },
    selfdrilling: { name: 'Bohrschrauben', desc: 'Hochleistungsbohrschrauben für Metall und Holz' },
    bolts: { name: 'Schrauben & Muttern', desc: 'Sechskantschrauben und Muttern industrieller Qualität' },
    ibr: { name: 'IBR-Nägel', desc: 'Dachnägel mit Schirmkopf für IBR-Wellblechdächer' },
    anchor: { name: 'Ankerbolzen', desc: 'Schwere Ankerbolzen für Fundament und Strukturverbindungen' },
    washers: { name: 'Unterlegscheiben', desc: 'Flache und Federringe für Lastverteilung und Vibrationsschutz' },
    coach: { name: 'Holzschrauben', desc: 'Schwere Holzschrauben mit Sechskantkopf' },
    threaded: { name: 'Gewindestangen', desc: 'Vollständig gewindete Stangen für strukturelle Verankerung' },
  },
  hi: {
    drywall: { name: 'ड्राईवॉल स्क्रू', desc: 'ड्राईवॉल स्थापना के लिए प्रीमियम बगल हेड स्क्रू' },
    selfdrilling: { name: 'सेल्फ-ड्रिलिंग स्क्रू', desc: 'धातु और लकड़ी के लिए उच्च प्रदर्शन ड्रिलिंग स्क्रू' },
    bolts: { name: 'बोल्ट और नट', desc: 'विभिन्न ग्रेड में औद्योगिक ग्रेड हेक्स बोल्ट और नट' },
    ibr: { name: 'IBR नेल', desc: 'IBR/नालीदार छत के लिए छतरी सिर वाले छत नेल' },
    anchor: { name: 'एंकर बोल्ट', desc: 'फाउंडेशन और संरचनात्मक कनेक्शन के लिए भारी शुल्क एंकर बोल्ट' },
    washers: { name: 'वॉशर', desc: 'लोड वितरण और कंपन प्रतिरोध के लिए फ्लैट और स्प्रिंग वॉशर' },
    coach: { name: 'कोच स्क्रू', desc: 'षट्कोणीय सिर वाले भारी शुल्क लकड़ी के स्क्रू' },
    threaded: { name: 'थ्रेडेड रॉड', desc: 'संरचनात्मक लंगर और असेंबली के लिए पूर्ण थ्रेडेड रॉड' },
  },
}

export default function ProductGrid({ locale = 'en' }: ProductGridProps) {
  const { formatPrice } = useCurrency()
  const texts = productText[locale] || productText.en

  return (
    <section id="products" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">{t(locale, 'products.title')}</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">{t(locale, 'products.subtitle')}</p>
        
        {/* Responsive grid: 1col sm → 2col md → 4col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {products.map((product, index) => {
            const text = texts[product.nameKey] || productText.en[product.nameKey]
            return (
              <div key={product.slug} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
                {/* Image - clickable link to article for SEO internal link juice */}
                <a href={`/${locale}/industry/${product.articleSlug}`} className="block relative h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image src={product.image} alt={text.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" priority={index < 4} />
                </a>
                
                {/* Content */}
                <div className="flex-1 p-4 md:p-6 flex flex-col">
                  <a href={`/${locale}#inquiry`} className="block hover:text-primary-700 transition-colors">
                    <h3 className="font-bold text-primary-900 text-sm md:text-base lg:text-lg mb-1">{text.name}</h3>
                  </a>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{text.desc}</p>
                  
                  <div className="space-y-1.5 text-xs md:text-sm mt-auto">
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.specification')}:</span><span className="font-medium text-right truncate ml-2" title={product.specs.size}>{product.specs.size}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.standard')}:</span><span className="font-medium text-right truncate ml-2">{product.specs.standard}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.moq')}:</span><span className="font-medium">1 {locale === 'zh' ? '吨' : 'ton'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.lead')}:</span><span className="font-medium">15-20 {locale === 'zh' ? '天' : 'days'}</span></div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-primary-900 font-bold text-sm md:text-base whitespace-nowrap">{formatPrice(product.pricePerPiece)}{t(locale, 'products.piece')}</span>
                    <a href={`/${locale}#inquiry`} className="bg-primary-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-primary-800 transition-colors whitespace-nowrap">
                      {t(locale, 'products.inquiry')}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
