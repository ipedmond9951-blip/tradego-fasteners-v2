'use client'

import { type Locale, t } from '@/i18n'
import { badgeCopy, pick } from '@/lib/uiCopy'

interface TestimonialsSectionProps { locale?: Locale }

// B2B Industrial Testimonials - Project-focused with specific technical details
// Format: [Country] + [Project] + [Product] + [Quantity] + [Result]
// 客户证言的多语版本：数据、公司与项目名称保持原文，叙述按语种本地化
const localizedTestimonials: Record<string, { project: string; quote: string }[]> = {
  es: [
    {
      project: 'Refuerzo de cinta transportadora minera en Great Dyke',
      quote: `TradeGo nos suministró 25 toneladas de pernos hexagonales 10.9 galvanizados en caliente (M16-M24) para el refuerzo de los soportes de nuestra cinta transportadora en Great Dyke. Los productos cumplieron plenamente las normas de resistencia a la corrosión exigidas. El equipo logístico gestionó con eficacia el transporte transfronterizo a Harare y el proyecto se mantuvo en plazo.`,
    },
    {
      project: 'Programa de ampliación de naves industriales',
      quote: `Como distribuidor mayorista, el cumplimiento SABS es innegociable para nosotros. Los tornillos para placa de yeso de TradeGo mantienen un fosfatado uniforme y un punto afilado preciso en cada lote. Se han convertido en nuestro socio más fiable para el suministro a gran escala en Gauteng: 2 contenedores de 40 pies al mes durante más de 18 meses.`,
    },
    {
      project: 'Sistema de cubierta IBR para nave industrial',
      quote: `Utilizamos los clavos IBR de TradeGo junto con tornillos autotaladrantes en una gran nave industrial en Nairobi. Las arandelas EPDM sellaron a la perfección frente a las lluvias tropicales. La documentación técnica SABS y los informes de ensayo dieron a nuestros clientes plena confianza en la integridad estructural de la cubierta.`,
    },
  ],
  fr: [
    {
      project: 'Renforcement de convoyeur minier à Great Dyke',
      quote: `TradeGo nous a fourni 25 tonnes de boulons hexagonaux 10.9 galvanisés à chaud (M16-M24) pour le renforcement des supports de notre convoyeur minier de Great Dyke. Les produits respectaient pleinement les exigences de résistance à la corrosion. L’équipe logistique a géré efficacement le transport transfrontalier vers Harare, et le projet est resté dans les délais.`,
    },
    {
      project: 'Programme d’extension d’entrepôts industriels',
      quote: `En tant que distributeur de gros, la conformité SABS est non négociable. Les vis à plaque de plâtre de TradeGo conservent une phosphatation régulière et une pointe précise à chaque lot. Ils sont devenus notre partenaire le plus fiable pour l’approvisionnement à grande échelle du Gauteng : 2 conteneurs 40 pieds par mois depuis plus de 18 mois.`,
    },
    {
      project: 'Système de toiture IBR d’entrepôt industriel',
      quote: `Nous avons utilisé les clous IBR de TradeGo avec des vis autoperceuses pour un grand entrepôt industriel à Nairobi. Les rondelles EPDM ont assuré une étanchéité parfaite face aux pluies tropicales. La documentation technique SABS et les rapports d’essai ont donné à nos clients toute confiance dans l’intégrité structurelle de la toiture.`,
    },
  ],
  pt: [
    {
      project: 'Reforço de correia transportadora de mineração em Great Dyke',
      quote: `A TradeGo forneceu 25 toneladas de parafusos sextavados 10.9 galvanizados a quente (M16-M24) para o reforço dos apoios da nossa correia transportadora em Great Dyke. Os produtos atenderam plenamente às normas de resistência à corrosão exigidas. A equipe logística conduziu com eficiência o transporte transfronteiriço até Harare e o projeto seguiu no prazo.`,
    },
    {
      project: 'Programa de expansão de galpões industriais',
      quote: `Como distribuidor atacadista, a conformidade SABS é inegociável. Os parafusos para drywall da TradeGo mantêm fosfatização uniforme e ponta afiada precisa em cada lote. Tornaram-se nosso parceiro mais confiável para o fornecimento em larga escala em Gauteng: 2 contêineres de 40 pés por mês há mais de 18 meses.`,
    },
    {
      project: 'Sistema de cobertura IBR de galpão industrial',
      quote: `Usamos os pregos IBR da TradeGo com parafusos autoatarraxantes em um grande galpão industrial em Nairóbi. As arruelas EPDM vedaram perfeitamente contra as chuvas tropicais. A documentação técnica SABS e os relatórios de ensaio deram aos nossos clientes plena confiança na integridade estrutural da cobertura.`,
    },
  ],
  ar: [
    {
      project: 'تقوية سير ناقل للتعدين في Great Dyke',
      quote: `وفّرت TradeGo 25 طنًا من البراغي السداسية 10.9 المجلفنة ساخنًا (M16-M24) لتقوية دعامات سير النقل في منجم Great Dyke. استوفت المنتجات كليًا معايير مقاومة التآكل المطلوبة. وأدار فريق الخدمات اللوجستية النقل العابر إلى هاراري بكفاءة، فبقي المشروع في موعده.`,
    },
    {
      project: 'برنامج توسعة مستودعات صناعية',
      quote: `بصفتنا موزعًا بالجملة، الالتزام بمعايير SABS أمر غير قابل للتنازل. تحافظ براغي الجبس من TradeGo على طلاء فوسفاتي متجانس وطرف حاد دقيق في كل دفعة. أصبحوا شريكنا الأكثر موثوقية للتوريد الواسع في منطقة Gauteng: حاويتان 40 قدمًا شهريًا لأكثر من 18 شهرًا.`,
    },
    {
      project: 'نظام تسقيف IBR لمستودع صناعي',
      quote: `استخدمنا مسامير IBR من TradeGo مع براغي ذاتية الحفر في مستودع صناعي كبير في نيروبي. وفّرت حلقات EPDM عزلًا مثاليًا أمام الأمطار الاستوائية. وأعطت الوثائق الفنية SABS وتقارير الاختبار عملاءنا ثقة كاملة في سلامة هيكل السطح.`,
    },
  ],
  ru: [
    {
      project: 'Усиление конвейера рудника Great Dyke',
      quote: `TradeGo поставила 25 тонн болтов 10.9 горячего цинкования (M16–M24) для усиления опор конвейера на руднике Great Dyke. Продукция полностью соответствовала требованиям коррозионной стойкости. Логистическая команда организовала трансграничную доставку в Хараре, и проект уложился в срок.`,
    },
    {
      project: 'Программа расширения промышленных складов',
      quote: `Для нас как оптового дистрибьютора соответствие SABS обязательно. Шурупы для гипсокартона TradeGo сохраняют равномерное фосфатное покрытие и точную заточку в каждой партии. Они стали нашим самым надёжным партнёром по крупным поставкам в Гаутенг: 2 контейнера 40 футов в месяц уже более 18 месяцев.`,
    },
    {
      project: 'Кровельная система IBR для промышленного склада',
      quote: `Мы использовали гвозди IBR TradeGo вместе с саморезами на крупном промышленном складе в Найроби. Уплотнители EPDM обеспечили идеальную герметичность при тропических дождях. Техническая документация SABS и протоколы испытаний дали нашим заказчикам полную уверенность в надёжности кровли.`,
    },
  ],
  de: [
    {
      project: 'Verstärkung des Förderbands im Great-Dyke-Bergwerk',
      quote: `TradeGo lieferte 25 Tonnen feuerverzinkte Sechskantschrauben 10.9 (M16–M24) für die Verstärkung der Tragstruktur unseres Förderbands im Great-Dyke-Bergwerk. Die Produkte erfüllten die geforderten Korrosionsschutzstandards vollständig. Das Logistikteam wickelte den Grenztransport nach Harare effizient ab, sodass der Projekttermin gehalten wurde.`,
    },
    {
      project: 'Erweiterungsprogramm für Industriehallen',
      quote: `Als Großhändler ist SABS-Konformität für uns unverzichtbar. Die Gipskartonschrauben von TradeGo halten Phosphatierung und Spitzenqualität in jeder Charge konstant. Sie sind unser zuverlässigster Partner für die Großversorgung der Gauteng-Region geworden: 2 × 40-Fuß-Container monatlich seit über 18 Monaten.`,
    },
    {
      project: 'IBR-Dachsystem für eine Industriehalle',
      quote: `Für eine große Industriehalle in Nairobi setzten wir IBR-Dachnägel von TradeGo zusammen mit Selbstbohrschrauben ein. Die EPDM-Dichtungen sorgten für perfekte Dichtigkeit bei tropischen Regenfällen. Die SABS-Dokumentation und Prüfberichte gaben unseren Kunden volle Sicherheit zur Tragfähigkeit des Dachs.`,
    },
  ],
  ja: [
    {
      project: 'Great Dyke 鉱山コンベヤ補強',
      quote: `TradeGo は Great Dyke 鉱山のコンベヤ支持部補強用に、溶融亜鉛めっき 10.9 六角ボルト（M16〜M24）25 トンを供給しました。製品は要求される耐食基準を完全に満たしています。物流チームがハラレまでの越境輸送を円滑に進め、工程どおりに完工しました。`,
    },
    {
      project: '産業倉庫拡張プロジェクト',
      quote: `当社は卸売ディストリビューターとして SABS 適合を譲れません。TradeGo の石膏ボード用ねじは、ロットごとに均一なリン酸塩皮膜と鋭利な先端を保っています。ハウテン州への大口供給で最も信頼できるパートナーとなり、40ft コンテナ 2 本／月を 18 か月以上継続しています。`,
    },
    {
      project: '産業倉庫の IBR 屋根システム',
      quote: `ナイロビの大型産業倉庫で、TradeGo の IBR 屋根釘と自穿孔ねじを組み合わせて使用しました。EPDM ワッシャーが熱帯の雨に対して完全なシール性能を発揮しました。SABS の技術資料と試験報告書により、施主は屋根の構造安全性に確信を持てました。`,
    },
  ],
  hi: [
    {
      project: 'Great Dyke खदान कन्वेयर सुदृढ़ीकरण',
      quote: `TradeGo ने Great Dyke खदान में हमारे कन्वेयर बेल्ट सपोर्ट मजबूत करने के लिए 25 टन ग्रेड 10.9 हॉट-डिप गैल्वनाइज़्ड हेक्स बोल्ट (M16–M24) दिए। उत्पाद जंग-रोधक मानकों पर पूरी तरह खरे उतरे। लॉजिस्टिक्स टीम ने हरारे तक सीमा-पार परिवहन कुशलता से संभाला और प्रोजेक्ट समय पर रहा।`,
    },
    {
      project: 'औद्योगिक गोदाम विस्तार कार्यक्रम',
      quote: `थोक वितरक के नाते SABS अनुपालन हमारे लिए अनिवार्य है। TradeGo के ड्राईवॉल स्क्रू हर बैच में एकसमान फॉस्फेट कोटिंग और तेज़ पॉइंट बनाए रखते हैं। गौतेंग क्षेत्र में बड़े पैमाने पर आपूर्ति के लिए वे हमारे सबसे भरोसेमंद साझेदार बन गए हैं — 18 महीनों से हर महीने 2 × 40ft कंटेनर।`,
    },
    {
      project: 'औद्योगिक गोदाम की IBR छत प्रणाली',
      quote: `नैरोबी के एक बड़े औद्योगिक गोदाम में हमने TradeGo के IBR रूफिंग कीलों के साथ सेल्फ-ड्रिलिंग स्क्रू लगाए। EPDM वॉशर ने उष्णकटिबंधीय बारिश में पूरी सीलिंग दी। SABS तकनीकी दस्तावेज़ और टेस्ट रिपोर्ट से हमारे ग्राहकों को छत की संरचनात्मक मजबूती पर पूरा भरोसा मिला।`,
    },
  ],
}

const testimonials = [
  {
    quote: "TradeGo provided 25 tons of Grade 10.9 Hot Dip Galvanized hex bolts (M16-M24) for our Great Dyke mining conveyor belt support reinforcement project. Products fully complied with required corrosion resistance standards. The logistics team handled cross-border transport to Harare efficiently, ensuring the project stayed on schedule.",
    author: "Operations Director",
    company: "ZIM-Mining Solutions",
    location: "Harare, Zimbabwe",
    project: "Great Dyke Mining Conveyor Belt Reinforcement",
    products: "Grade 10.9 HDG Hex Bolts (M16-M24), 25 Tons",
    standards: "ISO 4014 / ASTM A325",
    rating: 5,
  },
  {
    quote: "As a bulk distributor, SABS compliance is non-negotiable for us. TradeGo's drywall screws maintain consistent phosphate coating quality and sharp-point precision across every batch. They have become our most reliable partner for large-scale construction supply to the Gauteng region—2 x 40ft containers monthly for over 18 months now.",
    author: "Procurement Manager",
    company: "Gauteng Hardware Supplies",
    location: "Johannesburg, South Africa",
    project: "Industrial Warehouse Expansion Program",
    products: "Drywall Screws (Fine Thread), 2 × 40ft Containers/Month",
    standards: "SABS 1575 / DIN 7505",
    rating: 5,
  },
  {
    quote: "We utilized TradeGo's IBR roofing nails combined with self-drilling screws for a major industrial warehouse project in Nairobi. The EPDM washers provided a perfect seal against tropical rains. The SABS technical documentation and test reports gave our clients full confidence in the roofing system's structural integrity.",
    author: "Project Engineer",
    company: "Nairobi Build-Tech",
    location: "Nairobi, Kenya",
    project: "Industrial Warehouse IBR Roofing System",
    products: "IBR Roofing Nails + Self-Drilling Screws, 15 Tons",
    standards: "SABS 1195 / DIN 7504",
    rating: 5,
  },
]


export default function TestimonialsSection({ locale = 'en' }: TestimonialsSectionProps) {
  const title = t(locale, 'testimonials.title') || 'Customer Success Stories'
  const subtitle = t(locale, 'testimonials.subtitle') || 'Real projects, real results. See how TradeGo supports African construction and mining operations.'

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, i) => {
            const lc = localizedTestimonials[locale]?.[i]
            return (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Stars + Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">{pick(badgeCopy.b2b, locale)}</span>
              </div>
              
              {/* Project Context Badge */}
              <div className="bg-primary-50 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-4">
                {lc?.project ?? item.project}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
                &quot;{lc?.quote ?? item.quote}&quot;
              </blockquote>
              
              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Products:</span>
                  <span className="text-gray-700 font-medium text-right max-w-[60%]">{item.products}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Standards:</span>
                  <span className="text-gray-700 font-medium">{item.standards}</span>
                </div>
              </div>
              
              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900 text-sm md:text-base">{item.author}</p>
                <p className="text-primary-700 text-xs md:text-sm font-medium">{item.company}</p>
                <p className="text-gray-400 text-xs">{item.location}</p>
              </div>
            </div>
            )
          })}
        </div>
        
        {/* Schema.org markup notice for SEO */}
        <p className="text-center text-xs text-gray-400 mt-8">
          {t(locale, 'testimonials.disclaimer')}
        </p>
      </div>
    </section>
  )
}
