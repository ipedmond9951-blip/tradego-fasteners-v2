export const pick = <T,>(m: Record<string, T>, locale?: string | null): T =>
  (m[locale ?? 'en'] ?? m.en) as T

type Stat = { value: string; label: string; sublabel: string }
type Block = { title: string; sub: string; stats: Stat[] }

export const statistics: Record<string, Block> = {
  en: {
    title: 'Why TradeGo?',
    sub: 'Numbers prove quality — ISO 9001 & SABS certified factory, 20 years Africa-focused',
    stats: [
      { value: '20+', label: 'Years Experience', sublabel: 'Since 2004, Africa-focused' },
      { value: '500+', label: 'Global Clients', sublabel: 'Across 20+ African countries' },
      { value: '50+', label: 'Containers Monthly', sublabel: 'Sea freight to Africa' },
      { value: '98%', label: 'On-Time Delivery', sublabel: 'Industry leading reliability' },
      { value: '0.5%', label: 'Defect Rate', sublabel: 'Industry average: 2-3%' },
      { value: '500', label: 'Tons Monthly', sublabel: 'Production capacity' },
    ],
  },
  zh: {
    title: '为什么选择 TradeGo？',
    sub: '数字证明实力 — ISO 9001 与 SABS 认证工厂，专注非洲市场 20 年',
    stats: [
      { value: '20+', label: '年行业经验', sublabel: '自 2004 年，专注非洲市场' },
      { value: '500+', label: '全球客户', sublabel: '遍布 20+ 非洲国家' },
      { value: '50+', label: '集装箱/月', sublabel: '海运至非洲' },
      { value: '98%', label: '准时交货率', sublabel: '行业领先可靠性' },
      { value: '0.5%', label: '缺陷率', sublabel: '行业平均：2-3%' },
      { value: '500', label: '吨/月', sublabel: '生产产能' },
    ],
  },
  es: {
    title: '¿Por qué TradeGo?',
    sub: 'Los números demuestran la calidad: fábrica certificada ISO 9001 y SABS, 20 años centrada en África',
    stats: [
      { value: '20+', label: 'Años de experiencia', sublabel: 'En África desde 2004' },
      { value: '500+', label: 'Clientes globales', sublabel: 'En más de 20 países africanos' },
      { value: '50+', label: 'Contenedores / mes', sublabel: 'Flete marítimo a África' },
      { value: '98%', label: 'Entregas a tiempo', sublabel: 'Fiabilidad líder del sector' },
      { value: '0.5%', label: 'Tasa de defectos', sublabel: 'Media del sector: 2-3%' },
      { value: '500', label: 'Toneladas / mes', sublabel: 'Capacidad de producción' },
    ],
  },
  fr: {
    title: 'Pourquoi TradeGo ?',
    sub: 'Les chiffres parlent : usine certifiée ISO 9001 et SABS, 20 ans dédiés à l’Afrique',
    stats: [
      { value: '20+', label: 'Ans d’expérience', sublabel: 'Focalisés sur l’Afrique depuis 2004' },
      { value: '500+', label: 'Clients internationaux', sublabel: 'Dans plus de 20 pays africains' },
      { value: '50+', label: 'Conteneurs / mois', sublabel: 'Fret maritime vers l’Afrique' },
      { value: '98%', label: 'Livraisons à temps', sublabel: 'Fiabilité de référence dans le secteur' },
      { value: '0.5%', label: 'Taux de défauts', sublabel: 'Moyenne du secteur : 2-3 %' },
      { value: '500', label: 'Tonnes / mois', sublabel: 'Capacité de production' },
    ],
  },
  pt: {
    title: 'Por que a TradeGo?',
    sub: 'Números comprovam a qualidade — fábrica certificada ISO 9001 e SABS, 20 anos focada na África',
    stats: [
      { value: '20+', label: 'Anos de experiência', sublabel: 'Foco na África desde 2004' },
      { value: '500+', label: 'Clientes globais', sublabel: 'Em mais de 20 países africanos' },
      { value: '50+', label: 'Contêineres / mês', sublabel: 'Frete marítimo para a África' },
      { value: '98%', label: 'Entregas no prazo', sublabel: 'Confiabilidade líder do setor' },
      { value: '0.5%', label: 'Taxa de defeitos', sublabel: 'Média do setor: 2-3%' },
      { value: '500', label: 'Toneladas / mês', sublabel: 'Capacidade de produção' },
    ],
  },
  ar: {
    title: 'لماذا TradeGo؟',
    sub: 'الأرقام تثبت الجودة — مصنع معتمد ISO 9001 وSABS، و20 عاماً من التركيز على أفريقيا',
    stats: [
      { value: '20+', label: 'عاماً من الخبرة', sublabel: 'في أفريقيا منذ 2004' },
      { value: '500+', label: 'عميل حول العالم', sublabel: 'في أكثر من 20 دولة أفريقية' },
      { value: '50+', label: 'حاوية / شهر', sublabel: 'شحن بحري إلى أفريقيا' },
      { value: '98%', label: 'التسليم في الموعد', sublabel: 'موثوقية رائدة في القطاع' },
      { value: '0.5%', label: 'نسبة العيوب', sublabel: 'متوسط القطاع: 2-3%' },
      { value: '500', label: 'طن / شهر', sublabel: 'الطاقة الإنتاجية' },
    ],
  },
  ru: {
    title: 'Почему TradeGo?',
    sub: 'Цифры подтверждают качество — завод с сертификатами ISO 9001 и SABS, 20 лет работы на Африку',
    stats: [
      { value: '20+', label: 'Лет в отрасли', sublabel: 'Фокус на Африке с 2004 года' },
      { value: '500+', label: 'Клиентов по всему миру', sublabel: 'Более чем в 20 странах Африки' },
      { value: '50+', label: 'Контейнеров в месяц', sublabel: 'Морская доставка в Африку' },
      { value: '98%', label: 'Поставки в срок', sublabel: 'Надёжность на уровне лидеров отрасли' },
      { value: '0.5%', label: 'Доля дефектов', sublabel: 'Среднее по отрасли: 2–3%' },
      { value: '500', label: 'Тонн в месяц', sublabel: 'Производственная мощность' },
    ],
  },
  ja: {
    title: 'TradeGo を選ぶ理由',
    sub: '数字が品質を証明 — ISO 9001・SABS 認証工場、アフリカ市場に20年の実績',
    stats: [
      { value: '20+', label: '業界経験年数', sublabel: '2004年からアフリカ市場に注力' },
      { value: '500+', label: 'グローバル顧客', sublabel: 'アフリカ20カ国以上' },
      { value: '50+', label: 'コンテナ／月', sublabel: 'アフリカへの海上輸送' },
      { value: '98%', label: '納期遵守率', sublabel: '業界トップクラスの信頼性' },
      { value: '0.5%', label: '不良率', sublabel: '業界平均：2〜3%' },
      { value: '500', label: 'トン／月', sublabel: '生産能力' },
    ],
  },
  de: {
    title: 'Warum TradeGo?',
    sub: 'Zahlen belegen Qualität — ISO 9001- und SABS-zertifizierte Fabrik, 20 Jahre Afrikafokus',
    stats: [
      { value: '20+', label: 'Jahre Erfahrung', sublabel: 'Afrika-Fokus seit 2004' },
      { value: '500+', label: 'Kunden weltweit', sublabel: 'In über 20 afrikanischen Ländern' },
      { value: '50+', label: 'Container pro Monat', sublabel: 'Seefracht nach Afrika' },
      { value: '98%', label: 'Pünktliche Lieferung', sublabel: 'Branchenführende Zuverlässigkeit' },
      { value: '0.5%', label: 'Fehlerquote', sublabel: 'Branchendurchschnitt: 2-3 %' },
      { value: '500', label: 'Tonnen pro Monat', sublabel: 'Produktionskapazität' },
    ],
  },
  hi: {
    title: 'TradeGo क्यों?',
    sub: 'आँकड़े गुणवत्ता साबित करते हैं — ISO 9001 और SABS प्रमाणित फैक्ट्री, 20 वर्ष अफ्रीका केंद्रित',
    stats: [
      { value: '20+', label: 'वर्षों का अनुभव', sublabel: '2004 से अफ्रीका पर केंद्रित' },
      { value: '500+', label: 'वैश्विक ग्राहक', sublabel: '20+ अफ्रीकी देशों में' },
      { value: '50+', label: 'कंटेनर / माह', sublabel: 'अफ्रीका तक समुद्री ढुलाई' },
      { value: '98%', label: 'समय पर डिलीवरी', sublabel: 'उद्योग में अग्रणी विश्वसनीयता' },
      { value: '0.5%', label: 'दोष दर', sublabel: 'उद्योग औसत: 2-3%' },
      { value: '500', label: 'टन / माह', sublabel: 'उत्पादन क्षमता' },
    ],
  },
}
