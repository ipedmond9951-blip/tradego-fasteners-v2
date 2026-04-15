'use client'

import Image from 'next/image'
import { type Locale, t } from '@/i18n'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ProductGridProps { locale?: Locale }

const products = [
  {
    slug: 'drywall-screws',
    image: '/images/products/drywall-screws-2.jpg',
    pricePerPiece: 0.02,
    nameKey: 'drywall',
    specs: { size: '3.5-4.8mm × 25-100mm', standard: 'DIN 7505 / GB/T 15856' },
    features: ['Sharp point', 'Bugle head', 'Phosphate/Black oxide'],
  },
  {
    slug: 'self-drilling-screws',
    image: '/images/products/self-drilling-screws-1.jpg',
    pricePerPiece: 0.03,
    nameKey: 'selfdrilling',
    specs: { size: '4.2-6.3mm × 19-150mm', standard: 'DIN 7504 / ANSI' },
    features: ['DR point', 'Hex/Phillips drive', 'Zinc/Ruspert coating'],
  },
  {
    slug: 'bolts-nuts',
    image: '/images/products/bolts-nuts-2.jpg',
    pricePerPiece: 0.05,
    nameKey: 'bolts',
    specs: { size: 'M5-M30 × 20-300mm', standard: 'DIN 933/934 / ISO 4014' },
    features: ['Grade 4.8/8.8/10.9', 'Full/Partial thread', 'Zinc/HDG/Black'],
  },
  {
    slug: 'ibr-nails',
    image: '/images/products/ibr-nails-placeholder.jpg',
    pricePerPiece: 0.01,
    nameKey: 'ibr',
    specs: { size: '2.5-4.0mm × 30-100mm', standard: 'SABS 1195' },
    features: ['Umbrella head', 'Smooth/Ring shank', 'Electro galvanized'],
  },
]

// Product names/descriptions per locale
const productText: Record<string, Record<string, { name: string; desc: string }>> = {
  en: {
    drywall: { name: 'Drywall Screws', desc: 'Premium bugle head screws for drywall installation' },
    selfdrilling: { name: 'Self-Drilling Screws', desc: 'High-performance drilling screws for metal and wood' },
    bolts: { name: 'Bolts & Nuts', desc: 'Industrial grade hex bolts and nuts in various grades' },
    ibr: { name: 'IBR Nails', desc: 'Umbrella head roofing nails for IBR/corrugated roofing' },
  },
  zh: {
    drywall: { name: '干壁钉', desc: '优质喇叭头干壁钉，专用于石膏板安装' },
    selfdrilling: { name: '自钻螺丝', desc: '高性能自钻螺丝，适用于金属和木材' },
    bolts: { name: '螺栓螺母', desc: '工业级六角螺栓螺母，多种强度等级' },
    ibr: { name: 'IBR钉', desc: '伞头屋顶钉，适用于IBR/瓦楞板屋面' },
  },
  es: {
    drywall: { name: 'Tornillos para tablaroca', desc: 'Tornillos de cabeza avellanada para instalación de tablaroca' },
    selfdrilling: { name: 'Tornillos autorroscantes', desc: 'Tornillos de alto rendimiento para metal y madera' },
    bolts: { name: 'Pernos y tuercas', desc: 'Pernos hexagonales y tuercas de grado industrial' },
    ibr: { name: 'Clavos IBR', desc: 'Clavos de techo con cabeza paraguas para techos IBR' },
  },
  ar: {
    drywall: { name: 'براغي جبس', desc: 'براغي رأس بوق عالية الجودة لتركيب الجبس' },
    selfdrilling: { name: 'براغي ذاتية الحفر', desc: 'براغي حفر عالية الأداء للمعادن والخشب' },
    bolts: { name: 'مسامير وصواميل', desc: 'مسامير سداسية وصواميل صناعية بدرجات متعددة' },
    ibr: { name: 'مسامير IBR', desc: 'مسامير سقف برأس مظلة للأسقف المموجة' },
  },
  fr: {
    drywall: { name: 'Vis à plâtre', desc: 'Vis à tête fraisée pour installation de plaques de plâtre' },
    selfdrilling: { name: 'Vis autoperceuses', desc: 'Vis à haute performance pour métal et bois' },
    bolts: { name: 'Boulons et écrous', desc: 'Boulons hexagonaux et écrous de qualité industrielle' },
    ibr: { name: 'Clous IBR', desc: 'Clous de toiture à tête parapluie pour toitures IBR' },
  },
  pt: {
    drywall: { name: 'Parafusos para drywall', desc: 'Parafusos de cabeça francesa para instalação de drywall' },
    selfdrilling: { name: 'Parafusos autorroscantes', desc: 'Parafusos de alto desempenho para metal e madeira' },
    bolts: { name: 'Parafusos e porcas', desc: 'Parafusos hexagonais e porcas de grau industrial' },
    ibr: { name: 'Pregos IBR', desc: 'Pregos de telhado com cabeça guarda-chuva para telhados IBR' },
  },
  ru: {
    drywall: { name: 'Гипсовые винты', desc: 'Винты с потайной головкой для гипсокартона' },
    selfdrilling: { name: 'Саморезы', desc: 'Высокопроизводительные саморезы для металла и дерева' },
    bolts: { name: 'Болты и гайки', desc: 'Шестигранные болты и гайки промышленного класса' },
    ibr: { name: 'Гвозди IBR', desc: 'Кровельные гвозди с зонтичной головкой для IBR-крыш' },
  },
  ja: {
    drywall: { name: '石膏ボード用ネジ', desc: '石膏ボード取り付け用プレミアムネジ' },
    selfdrilling: { name: 'タッピンねじ', desc: '金属・木材用高性能ドリルネジ' },
    bolts: { name: 'ボルト・ナット', desc: '工業用六角ボルト・ナット各種グレード' },
    ibr: { name: 'IBR釘', desc: 'IBR/波形屋根用傘頭屋根釘' },
  },
  de: {
    drywall: { name: 'Gipskartonschrauben', desc: 'Premium-Senkkopfschrauben für Gipskartoninstallation' },
    selfdrilling: { name: 'Bohrschrauben', desc: 'Hochleistungsbohrschrauben für Metall und Holz' },
    bolts: { name: 'Schrauben & Muttern', desc: 'Sechskantschrauben und Muttern industrieller Qualität' },
    ibr: { name: 'IBR-Nägel', desc: 'Dachnägel mit Schirmkopf für IBR-Wellblechdächer' },
  },
  hi: {
    drywall: { name: 'ड्राईवॉल स्क्रू', desc: 'ड्राईवॉल स्थापना के लिए प्रीमियम बगल हेड स्क्रू' },
    selfdrilling: { name: 'सेल्फ-ड्रिलिंग स्क्रू', desc: 'धातु और लकड़ी के लिए उच्च प्रदर्शन ड्रिलिंग स्क्रू' },
    bolts: { name: 'बोल्ट और नट', desc: 'विभिन्न ग्रेड में औद्योगिक ग्रेड हेक्स बोल्ट और नट' },
    ibr: { name: 'IBR नेल', desc: 'IBR/नालीदार छत के लिए छतरी सिर वाले छत नेल' },
  },
}

export default function ProductGrid({ locale = 'en' }: ProductGridProps) {
  const { formatPrice } = useCurrency()
  const texts = productText[locale] || productText.en

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">{t(locale, 'products.title')}</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{t(locale, 'products.subtitle')}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const text = texts[product.nameKey] || productText.en[product.nameKey]
            return (
              <div key={product.slug} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image src={product.image} alt={text.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{text.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{text.desc}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.specification')}:</span><span className="font-medium">{product.specs.size}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.standard')}:</span><span className="font-medium text-xs">{product.specs.standard}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.moq')}:</span><span className="font-medium">1 {locale === 'zh' ? '吨' : 'ton'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t(locale, 'products.lead')}:</span><span className="font-medium">15-20 {locale === 'zh' ? '天' : 'days'}</span></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-blue-900 font-bold text-lg">{formatPrice(product.pricePerPiece)}{t(locale, 'products.piece')}</span>
                    <a href={`/${locale}#inquiry`} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
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
