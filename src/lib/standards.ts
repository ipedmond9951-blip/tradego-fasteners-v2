// 标准聚合页数据源：从产品 standard 字段解析标准号，生成 /standards/<slug>/ 落地页
// 目的：承接 "DIN 933 bolts supplier" 这类按标准号搜索的长尾，与产品页、品类分区互链
import { allProducts } from '@/lib/products'

const STD_RE = /(DIN|ISO|ANSI\/ASME|ANSI|ASTM|SABS|EN|GB\/T|GB|JIS|BS|UNI|LS|JC\/T)\s*([A-Z]?\d[\w.\-]*)/g

export function parseStandards(standard: string): string[] {
  const out = new Set<string>()
  for (const m of standard.matchAll(STD_RE)) {
    const prefix = m[1]
    const nums = m[2]
    // "933/934" 这类同族编号拆开，各自成页
    for (const n of nums.split('/')) {
      const clean = n.trim()
      if (clean) out.add(`${prefix} ${clean}`)
    }
  }
  return [...out]
}

export function stdSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export interface StdEntry {
  slug: string
  code: string
  products: string[]
}

// 由产品数据推导，产品新增标准后自动出现新页
export const standardEntries: StdEntry[] = (() => {
  const map = new Map<string, StdEntry>()
  for (const p of allProducts) {
    const codes = parseStandards(p.specs.standard || '')
    for (const code of codes) {
      const slug = stdSlug(code)
      const entry = map.get(slug) || { slug, code, products: [] }
      if (!entry.products.includes(p.slug)) entry.products.push(p.slug)
      map.set(slug, entry)
    }
  }
  return [...map.values()].filter(e => e.products.length > 0).sort((a, b) => a.code.localeCompare(b.code))
})()

export function getStd(slug: string): StdEntry | undefined {
  return standardEntries.find(e => e.slug === slug)
}

// 标准号的中英对照说明：只描述该标准涵盖的产品类型，不复述条款细节
const stdNotes: Record<string, Record<string, string>> = {
  'DIN 933': { en: 'Hexagon head bolts, fully threaded', zh: '六角头全螺纹螺栓', es: 'Pernos de cabeza hexagonal totalmente roscados', fr: 'Vis à tête hexagonale entièrement filetées', pt: 'Parafusos sextavados totalmente roscados', ar: 'براغي سداسية الرأس كاملة الخيط', ru: 'Болты с шестигранной головкой, полная резьба', ja: '六角ボルト（全ねじ）', de: 'Sechskantschrauben, Ganzgewinde', hi: 'हेक्स हेड बोल्ट, पूर्ण थ्रेडेड' }, 
  'DIN 934': { en: 'Hexagon nuts, standard series', zh: '六角螺母（标准系列）', es: 'Tuercas hexagonales, serie estándar', fr: 'Écrous hexagonaux, série standard', pt: 'Porcas sextavadas, série padrão', ar: 'صواميل سداسية، السلسلة القياسية', ru: 'Гайки шестигранные, стандартная серия', ja: '六角ナット（標準シリーズ）', de: 'Sechskantmuttern, Standardreihe', hi: 'हेक्स नट, मानक श्रेणी' }, 
  'DIN 912': { en: 'Hexagon socket head cap screws', zh: '内六角圆柱头螺钉', es: 'Tornillos de cabeza cilíndrica con hexágono interior', fr: 'Vis à tête cylindrique à six pans creux', pt: 'Parafusos de cabeça cilíndrica com sextavado interno', ar: 'براغي برأس أسطواني بمفتاح سداسي داخلي', ru: 'Винты с цилиндрической головкой и внутренним шестигранником', ja: '六角穴付きボルト', de: 'Zylinderschrauben mit Innensechskant', hi: 'हेक्स सॉकेट हेड कैप स्क्रू' }, 
  'DIN 913': { en: 'Hexagon socket set screws, flat point', zh: '内六角平端紧定螺钉', es: 'Tornillos de ajuste con hexágono interior y punta plana', fr: 'Vis de réglage à six pans creux, bout plat', pt: 'Parafusos de ajuste com sextavado interno e ponta chata', ar: 'براغي تثبيت بمفتاح سداسي داخلي وطرف مسطح', ru: 'Винты установочные с внутренним шестигранником, плоский конец', ja: '六角穴付き止めねじ（平先）', de: 'Gewindestifte mit Innensechskant, flache Spitze', hi: 'हेक्स सॉकेट सेट स्क्रू, फ्लैट पॉइंट' }, 
  'DIN 315': { en: 'Wing nuts', zh: '蝶形螺母', es: 'Tuercas de mariposa', fr: 'Écrous à oreilles', pt: 'Porcas borboleta', ar: 'صواميل جناحية', ru: 'Гайки барашковые', ja: '蝶ナット', de: 'Flügelmuttern', hi: 'विंग नट' }, 
  'DIN 3570': { en: 'U-bolts for pipes and poles', zh: 'U 型螺栓（管道与立柱）', es: 'Pernos en U para tuberías y postes', fr: 'Boulons en U pour tuyaux et poteaux', pt: 'Parafusos em U para tubos e postes', ar: 'براغي على شكل حرف U للأنابيب والأعمدة', ru: 'U-образные болты для труб и столбов', ja: '配管・支柱用Uボルト', de: 'U-Bügel für Rohre und Masten', hi: 'पाइप और पोल के लिए U-बोल्ट' }, 
  'DIN 529': { en: 'Foundation anchor bolts', zh: '地脚锚栓', es: 'Pernos de anclaje para cimentación', fr: 'Boulons d’ancrage de fondation', pt: 'Chumbadores de fundação', ar: 'براغي تثبيت للأساسات', ru: 'Фундаментные анкерные болты', ja: '基礎用アンカーボルト', de: 'Fundamentankerbolzen', hi: 'फ़ाउंडेशन एंकर बोल्ट' }, 
  'DIN 571': { en: 'Hexagon head wood screws (coach screws)', zh: '六角头木螺钉（木结构螺栓）', es: 'Tornillos para madera de cabeza hexagonal (tirafondos)', fr: 'Vis à bois à tête hexagonale (vis de charpente)', pt: 'Parafusos para madeira de cabeça sextavada (parafusos de cavilha)', ar: 'براغي خشب سداسية الرأس', ru: 'Винты для дерева с шестигранной головкой', ja: '六角頭木ねじ（コーチボルト）', de: 'Sechskant-Holzschrauben (Zugschrauben)', hi: 'हेक्स हेड वुड स्क्रू (कोच स्क्रू)' }, 
  'DIN 580': { en: 'Ring bolts', zh: '吊环螺栓', es: 'Pernos con anilla', fr: 'Boulons à anneau', pt: 'Parafusos com argola', ar: 'براغي حلقية', ru: 'Болты с кольцом (рым-болты)', ja: 'アイボルト', de: 'Ringschrauben', hi: 'रिंग बोल्ट' }, 
  'DIN 581': { en: 'Ring nuts', zh: '吊环螺母', es: 'Tuercas con anilla', fr: 'Écrous à anneau', pt: 'Porcas com argola', ar: 'صواميل حلقية', ru: 'Гайки с кольцом (рым-гайки)', ja: 'アイナット', de: 'Ringmuttern', hi: 'रिंग नट' }, 
  'DIN 603': { en: 'Carriage bolts with square neck', zh: '马车螺栓（方颈）', es: 'Pernos de carrocería con cuello cuadrado', fr: 'Boulons de charronnage à col carré', pt: 'Parafusos de carroçaria com pescoço quadrado', ar: 'براغي عربة بعنق مربع', ru: 'Болты с квадратным подголовником (вагонные)', ja: '角根丸頭ボルト', de: 'Schlossschrauben mit Vierkantansatz', hi: 'स्क्वायर नेक वाले कैरिज बोल्ट' }, 
  'DIN 6334': { en: 'Flange nuts', zh: '法兰螺母', es: 'Tuercas de brida', fr: 'Écrous à embase', pt: 'Porcas de flange', ar: 'صواميل ذات قاعدة مسطحة', ru: 'Гайки с фланцем', ja: 'フランジナット', de: 'Muttern mit Bund', hi: 'फ्लैंज नट' }, 
  'DIN 6797': { en: 'Spring lock washers with internal teeth', zh: '内齿锁紧垫圈', es: 'Arandelas de seguridad con dientes interiores', fr: 'Rondelles de blocage à dents intérieures', pt: 'Anéis de trava com dentes internos', ar: 'حلقات قفل بأسنان داخلية', ru: 'Стопорные шайбы с внутренними зубьями', ja: '内歯付き座金', de: 'Sicherungsscheiben mit Innverzahnung', hi: 'आंतरिक दांतों वाले स्प्रिंग लॉक वॉशर' }, 
  'DIN 6921': { en: 'Hexagon head flange bolts', zh: '六角法兰面螺栓', es: 'Pernos de cabeza hexagonal con brida', fr: 'Vis à tête hexagonale à embase', pt: 'Parafusos sextavados com flange', ar: 'براغي سداسية الرأس ذات قاعدة', ru: 'Болты с шестигранной головкой и фланцем', ja: '六角フランジボルト', de: 'Sechskantschrauben mit Bund', hi: 'हेक्स हेड फ्लैंज बोल्ट' }, 
  'DIN 6923': { en: 'Hexagon flange nuts', zh: '六角法兰螺母', es: 'Tuercas hexagonales con brida', fr: 'Écrous hexagonaux à embase', pt: 'Porcas sextavadas com flange', ar: 'صواميل سداسية ذات قاعدة', ru: 'Гайки шестигранные с фланцем', ja: '六角フランジナット', de: 'Sechskantmuttern mit Bund', hi: 'हेक्स फ्लैंज नट' }, 
  'DIN 7337': { en: 'Blind rivets', zh: '拉铆钉', es: 'Remaches ciegos', fr: 'Rivets aveugles', pt: 'Rebites cegos', ar: 'مسامير برشام عمياء', ru: 'Заклёпки слепые', ja: '盲鋲（リベット）', de: 'Blindnieten', hi: 'ब्लाइंड रिवेट' }, 
  'DIN 7338': { en: 'Semi-tubular rivets', zh: '半空心铆钉', es: 'Remaches semitubulares', fr: 'Rivets semi-tubulaires', pt: 'Rebites semitubulares', ar: 'مسامير برشام نصف أنبوبية', ru: 'Заклёпки полупустые', ja: '半管状リベット', de: 'Halbhohlnieten', hi: 'सेमी-ट्यूबुलर रिवेट' }, 
  'DIN 7340': { en: 'Rivet nuts (blind threaded inserts)', zh: '拉铆螺母', es: 'Tuercas remachables', fr: 'Écrous rivetés', pt: 'Porcas rebitadas', ar: 'صواميل برشامية', ru: 'Заклёпочные гайки', ja: 'リベットナット', de: 'Blindnietmuttern', hi: 'रिवेट नट' }, 
  'DIN 7500': { en: 'Self-tapping screws, general purpose', zh: '自攻螺钉（通用）', es: 'Tornillos autoperforantes de uso general', fr: 'Vis autotaraudeuses à usage général', pt: 'Parafusos autoatarraxantes de uso geral', ar: 'براغي ذاتية اللولبة للاستخدام العام', ru: 'Самонарезающие винты общего назначения', ja: '一般的なタッピングねじ', de: 'Selbstschneidende Schrauben, universell', hi: 'सामान्य उपयोग के सेल्फ-टैपिंग स्क्रू' }, 
  'DIN 7504': { en: 'Self-drilling screws (TEK type)', zh: '自钻自攻螺钉（TEK）', es: 'Tornillos autotaladrantes (tipo TEK)', fr: 'Vis autoperceuses (type TEK)', pt: 'Parafusos autoperfurantes (tipo TEK)', ar: 'براغي ذاتية الحفر (نوع TEK)', ru: 'Саморезы с буром (тип TEK)', ja: '自穿孔ねじ（TEKタイプ）', de: 'Bohrschrauben (TEK-Typ)', hi: 'सेल्फ-ड्रिलिंग स्क्रू (TEK प्रकार)' }, 
  'DIN 7505': { en: 'Drywall screws for gypsum board', zh: '干墙螺钉（石膏板）', es: 'Tornillos para pladur (yeso laminado)', fr: 'Vis à plaque de plâtre', pt: 'Parafusos para gesso acartonado', ar: 'براغي ألواح الجبس', ru: 'Саморезы для гипсокартона', ja: '石膏ボード用ねじ', de: 'Trockenbau-Schrauben für Gipskarton', hi: 'जिप्सम बोर्ड के लिए ड्राईवॉल स्क्रू' }, 
  'DIN 7985': { en: 'Pan head self-tapping screws', zh: '盘头自攻螺钉', es: 'Tornillos autoperforantes de cabeza plana', fr: 'Vis autotaraudeuses à tête fraisée bombée', pt: 'Parafusos autoatarraxantes de cabeça panela', ar: 'براغي ذاتية اللولبة برأس مقعر', ru: 'Самонарезающие винты с полукруглой головкой', ja: '丸頭タッピングねじ', de: 'Halbrundkopf-Schrauben, selbstschneidend', hi: 'पैन हेड सेल्फ-टैपिंग स्क्रू' }, 
  'DIN 7998': { en: 'Round head self-tapping screws', zh: '圆头自攻螺钉', es: 'Tornillos autoperforantes de cabeza redonda', fr: 'Vis autotaraudeuses à tête ronde', pt: 'Parafusos autoatarraxantes de cabeça redonda', ar: 'براغي ذاتية اللولبة برأس دائري', ru: 'Самонарезающие винты с круглой головкой', ja: '丸頭タッピングねじ（大丸）', de: 'Rundkopf-Schrauben, selbstschneidend', hi: 'राउंड हेड सेल्फ-टैपिंग स्क्रू' }, 
  'DIN 1587': { en: 'Large wafer head self-tapping screws', zh: '大扁头自攻螺钉', es: 'Tornillos autoperforantes de cabeza wafer grande', fr: 'Vis autotaraudeuses à large tête wafer', pt: 'Parafusos autoatarraxantes de cabeça wafer grande', ar: 'براغي ذاتية اللولبة برأس عريض مسطح', ru: 'Самонарезающие винты с широкой плоской головкой', ja: '大型ワッシャー頭タッピングねじ', de: 'Selbstschneidende Schrauben mit breitem Flachkopf', hi: 'बड़े वेफर हेड सेल्फ-टैपिंग स्क्रू' }, 
  'DIN 975': { en: 'Threaded rods, fully threaded', zh: '全螺纹螺杆', es: 'Barras roscadas totalmente roscadas', fr: 'Tiges filetées entièrement filetées', pt: 'Barras roscadas totalmente roscadas', ar: 'قضبان ملولبة كاملة الخيط', ru: 'Стержни резьбовые с полной резьбой', ja: '全ねじシャフト', de: 'Gewindestangen, Ganzgewinde', hi: 'थ्रेडेड रॉड, पूर्ण थ्रेडेड' }, 
  'DIN 976': { en: 'Stud bolts / double-ended studs', zh: '双头螺栓', es: 'Pernos de espárrago de doble extremo', fr: 'Goujons à deux extrémités filetées', pt: 'Cravos de duas pontas', ar: 'براغي مزدوجة الأطراف', ru: 'Шпильки с двумя резьбовыми концами', ja: 'スタッドボルト（両端ねじ）', de: 'Stiftschrauben mit zwei Gewindeenden', hi: 'स्टड बोल्ट / डबल-एंडेड स्टड' }, 
  'DIN 985': { en: 'Nylon insert lock nuts', zh: '尼龙锁紧螺母', es: 'Tuercas de bloqueo con inserto de nylon', fr: 'Écrous de blocage à insert nylon', pt: 'Porcas de trava com inserto de náilon', ar: 'صواميل قفل بإدخال نايلون', ru: 'Гайки самоконтрящиеся с нейлоновой вставкой', ja: 'ナイロンロックナット', de: 'Sicherungsmuttern mit Nyloneinsatz', hi: 'नायलॉन इनसर्ट लॉक नट' }, 
  'DIN 125': { en: 'Flat washers, plain', zh: '平垫圈', es: 'Arandelas planas', fr: 'Rondelles plates', pt: 'Anéis planos', ar: 'حلقات مسطحة', ru: 'Шайбы плоские', ja: '平座金', de: 'Flache Scheiben', hi: 'फ्लैट वॉशर' }, 
  'DIN 127': { en: 'Spring washers', zh: '弹簧垫圈', es: 'Arandelas de muelle', fr: 'Rondelles ressorts', pt: 'Anéis de mola', ar: 'حلقات نابضية', ru: 'Шайбы пружинные', ja: 'バネ座金', de: 'Federscheiben', hi: 'स्प्रिंग वॉशर' }, 
  'ISO 4014': { en: 'Hexagon head bolts, partially threaded', zh: '六角头螺栓（半螺纹）', es: 'Pernos de cabeza hexagonal parcialmente roscados', fr: 'Vis à tête hexagonale partiellement filetées', pt: 'Parafusos sextavados parcialmente roscados', ar: 'براغي سداسية الرأس جزئية الخيط', ru: 'Болты с шестигранной головкой, частичная резьба', ja: '六角ボルト（半ねじ）', de: 'Sechskantschrauben, Teilgewinde', hi: 'हेक्स हेड बोल्ट, आंशिक थ्रेडेड' }, 
  'ISO 4762': { en: 'Hexagon socket head cap screws', zh: '内六角圆柱头螺钉', es: 'Tornillos de cabeza cilíndrica con hexágono interior', fr: 'Vis à tête cylindrique à six pans creux', pt: 'Parafusos de cabeça cilíndrica com sextavado interno', ar: 'براغي برأس أسطواني بمفتاح سداسي داخلي', ru: 'Винты с цилиндрической головкой и внутренним шестигранником', ja: '六角穴付きボルト', de: 'Zylinderschrauben mit Innensechskant', hi: 'हेक्स सॉकेट हेड कैप स्क्रू' }, 
  'ISO 7040': { en: 'Prevailing torque hexagon nuts with nylon insert', zh: '尼龙锁紧六角螺母', es: 'Tuercas hexagonales de par de apriete con inserto de nylon', fr: 'Écrous hexagonaux à couple résistant avec insert nylon', pt: 'Porcas sextavadas de torque prevalecente com inserto de náilon', ar: 'صواميل سداسية بعزم مقاوم بإدخال نايلون', ru: 'Гайки шестигранные самоконтрящиеся с нейлоновой вставкой', ja: 'ナイロンインサート付き六角ナット', de: 'Sechskantmuttern mit Nyloneinsatz, selbstsichernd', hi: 'नायलॉन इनसर्ट के साथ हेक्स नट' }, 
  'ISO 7089': { en: 'Plain washers, normal series', zh: '平垫圈（标准系列）', es: 'Arandelas planas, serie normal', fr: 'Rondelles plates, série normale', pt: 'Anéis planos, série normal', ar: 'حلقات مسطحة، السلسلة العادية', ru: 'Шайбы плоские, нормальная серия', ja: '平座金（標準シリーズ）', de: 'Flache Scheiben, normale Reihe', hi: 'फ्लैट वॉशर, सामान्य श्रेणी' }, 
  'ISO 898': { en: 'Mechanical properties of carbon steel fasteners', zh: '碳钢紧固件机械性能', es: 'Propiedades mecánicas de fijaciones de acero al carbono', fr: 'Propriétés mécaniques des fixations en acier au carbone', pt: 'Propriedades mecânicas de fixadores de aço carbono', ar: 'الخصائص الميكانيكية لمثبتات الفولاذ الكربوني', ru: 'Механические свойства крепежа из углеродистой стали', ja: '炭素鋼締結部品の機械的特性', de: 'Mechanische Eigenschaften von Verbindungselementen aus Kohlenstoffstahl', hi: 'कार्बन स्टील फास्टनर के यांत्रिक गुण' }, 
  'ASTM F1554': { en: 'Anchor bolts for structural foundations', zh: '结构基础锚栓', es: 'Pernos de anclaje para cimentaciones estructurales', fr: 'Boulons d’ancrage pour fondations structurelles', pt: 'Chumbadores para fundações estruturais', ar: 'براغي تثبيت للأساسات الإنشائية', ru: 'Анкерные болты для строительных фундаментов', ja: '構造基礎用アンカーボルト', de: 'Ankerbolzen für Bauwerksfundamente', hi: 'संरचनात्मक फ़ाउंडेशन के लिए एंकर बोल्ट' }, 
  'ASTM A193': { en: 'Alloy and stainless steel bolting for high temperature service', zh: '高温工况合金与不锈钢螺栓', es: 'Pernos de aleación y acero inoxidable para servicio a alta temperatura', fr: 'Boulonnerie en alliage et inox pour service à haute température', pt: 'Parafusos de liga e aço inox para serviço em alta temperatura', ar: 'براغي من السبائك والفولاذ المقاوم للصدأ لدرجات الحرارة العالية', ru: 'Болты из легированной и нержавеющей стали для высоких температур', ja: '高温用途向け合金鋼・ステンレス鋼ボルト', de: 'Schrauben aus legiertem und nichtrostendem Stahl für Hochtemperaturbetrieb', hi: 'उच्च तापमान सेवा के लिए मिश्रधातु और स्टेनलेस स्टील बोल्ट' }, 
  'ASTM D1970': { en: 'Self-adhering polymer modified bituminous waterproofing', zh: '自粘聚合物改性沥青防水材料', es: 'Impermeabilización bituminosa autoadhesiva modificada con polímeros', fr: 'Étanchéité bitumineuse autocollante modifiée par polymère', pt: 'Impermeabilização betuminosa autoadesiva modificada por polímero', ar: 'عزل مائي بيتوميني ذاتي اللصق معدَّل بالبوليمر', ru: 'Самоклеящаяся битумно-полимерная гидроизоляция', ja: '高分子改質アスファルト系自己粘着防水', de: 'Selbstklebende polymerbitumenhaltige Abdichtung', hi: 'स्वयं-चिपकने वाली पॉलिमर मॉडिफाइड बिटुमिनस वॉटरप्रूफ़िंग' }, 
  'ANSI B18.5': { en: 'Round head and square neck bolts (carriage bolts)', zh: '圆头方颈螺栓（马车螺栓）', es: 'Pernos de cabeza redonda y cuello cuadrado (pernos de carrocería)', fr: 'Boulons à tête ronde et col carré (boulons de charronnage)', pt: 'Parafusos de cabeça redonda e pescoço quadrado (parafusos de carroçaria)', ar: 'براغي برأس دائري وعنق مربع (براغي عربة)', ru: 'Болты с круглой головкой и квадратным подголовником', ja: '丸頭角根ボルト（カービッジボルト）', de: 'Rundkopfschrauben mit Vierkantansatz (Schlossschrauben)', hi: 'राउंड हेड और स्क्वायर नेक बोल्ट (कैरिज बोल्ट)' }, 
  'SABS 1195': { en: 'Roofing nails for corrugated and IBR sheeting', zh: '瓦楞与 IBR 屋面用钉', es: 'Clavos para cubierta de chapa ondulada e IBR', fr: 'Clous de toiture pour tôles ondulées et IBR', pt: 'Pregos para telhado de chapa ondulada e IBR', ar: 'مسامير أسقف للصفائح المموجة وIBR', ru: 'Кровельные гвозди для волнистого и IBR-листа', ja: '波板・IBR屋根用釘', de: 'Dachnägel für Wellblech und IBR-Platten', hi: 'नालीदार और IBR चादर के लिए रूफिंग नेल' }, 
  'SABS 153': { en: 'Anchor bolts for construction', zh: '建筑用锚栓', es: 'Pernos de anclaje para construcción', fr: 'Boulons d’ancrage pour la construction', pt: 'Chumbadores para construção', ar: 'براغي تثبيت للإنشاءات', ru: 'Анкерные болты для строительства', ja: '建設用アンカーボルト', de: 'Ankerbolzen für den Bau', hi: 'निर्माण के लिए एंकर बोल्ट' }, 
  'EN 10230-1': { en: 'Steel wire nails', zh: '钢制圆钉', es: 'Clavos de alambre de acero', fr: 'Clous en fils d’acier', pt: 'Pregos de arame de aço', ar: 'مسامير من أسلاك الفولاذ', ru: 'Гвозди из стальной проволоки', ja: 'スチールワイヤー釘', de: 'Stahldrahtnägel', hi: 'स्टील वायर कीलें' }, 
  'EN 14566': { en: 'Gypsum board screws and accessories', zh: '石膏板螺钉及配件', es: 'Tornillos y accesorios para placas de yeso', fr: 'Vis et accessoires pour plaques de plâtre', pt: 'Parafusos e acessórios para placas de gesso', ar: 'براغي وملحقات ألواح الجبس', ru: 'Саморезы и комплектующие для гипсокартона', ja: '石膏ボード用ねじおよび付属品', de: 'Gipskarton-Schrauben und Zubehör', hi: 'जिप्सम बोर्ड स्क्रू और सहायक सामग्री' }, 
  'EN 10346': { en: 'Continuously hot-dip coated steel flat products', zh: '连续热镀锌钢板', es: 'Productos planos de acero recubiertos en caliente de forma continua', fr: 'Produits plats en acier revêtus en continu par immersion à chaud', pt: 'Produtos planos de aço revestidos a quente de forma contínua', ar: 'منتجات فولاذية مسطحة مطلية بالغمس الساخن المستمر', ru: 'Плоский прокат с непрерывным горячим покрытием', ja: '連続溶融めっき鋼板', de: 'Kontinuierlich feuerveredelte Flachstahlerzeugnisse', hi: 'लगातार हॉट-डिप कोटेड स्टील फ्लैट उत्पाद' }, 
  'JC/T 408': { en: 'Waterproofing coatings for buildings', zh: '建筑防水涂料', es: 'Revestimientos impermeabilizantes para edificios', fr: 'Revêtements d’étanchéité pour bâtiments', pt: 'Revestimentos impermeabilizantes para edifícios', ar: 'طلاءات عزل مائي للمباني', ru: 'Гидроизоляционные покрытия для зданий', ja: '建築用防水塗料', de: 'Abdichtungsbeschichtungen für Gebäude', hi: 'इमारतों के लिए वॉटरप्रूफ़िंग कोटिंग्स' }
}

export function stdNote(code: string, locale: string): string {
  const n = stdNotes[code]
  const generic: Record<string, string> = {
    en: 'Fastener product standard', zh: '紧固件产品执行标准',
    es: 'Norma de producto para fijaciones', fr: 'Norme produit pour fixations',
    pt: 'Norma de produto para fixadores', ar: 'معيار منتج للمثبتات',
    ru: 'Стандарт на крепёжную продукцию', ja: '締結部品の製品規格',
    de: 'Produktnorm für Verbindungselemente', hi: 'फास्टनर उत्पाद मानक',
  }
  if (!n) return generic[locale] || generic.en
  return n[locale] || n.en
}
