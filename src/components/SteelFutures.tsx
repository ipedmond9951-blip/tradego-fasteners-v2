'use client'

import { useState, useEffect } from 'react'

interface FuturesData {
  name: string
  symbol: string
  price: string
  change: string
  changePercent: string
  unit: string
  updated: string
}

interface CommodityResponse {
  steel: FuturesData[]
  currencies: {
    usdcny: number
    usdzar: number
  }
  timestamp: string
  source: string
}

interface SteelFuturesProps {
  locale: string
}

const translations: Record<string, {
  title: string
  subtitle: string
  lastUpdate: string
  loading: string
  error: string
  source: string
  commodities: {
    steel: string
    ironOre: string
    coal: string
    scrap: string
    rebar: string
    galvanized: string
    coldRolled: string
    nickel: string
    usdzar: string
    usdcny: string
  }
}> = {
  en: {
    title: 'Steel Market Data',
    subtitle: 'Real-time steel and raw material prices affecting fastener costs',
    lastUpdate: 'Last updated',
    loading: 'Loading market data...',
    error: 'Market data temporarily unavailable',
    source: 'Source',
    commodities: {
      steel: 'Steel (HRC)',
      ironOre: 'Iron Ore',
      coal: 'Coking Coal',
      scrap: 'Steel Scrap',
      rebar: 'Rebar',
      galvanized: 'Galvanized Coil',
      coldRolled: 'Cold Rolled',
      nickel: 'Nickel',
      usdzar: 'USD/ZAR',
      usdcny: 'USD/CNY'
    }
  },
  zh: {
    title: '钢材市场行情',
    subtitle: '影响紧固件成本的实时钢材和原材料价格',
    lastUpdate: '最后更新',
    loading: '加载市场数据中...',
    error: '市场数据暂时不可用',
    source: '数据来源',
    commodities: {
      steel: '热轧卷板',
      ironOre: '铁矿石',
      coal: '焦煤',
      scrap: '废钢',
      rebar: '螺纹钢',
      galvanized: '镀锌板',
      coldRolled: '冷轧板',
      nickel: '镍',
      usdzar: '美元/南非兰特',
      usdcny: '美元/人民币'
    }
  }
}

const otherLocales: Record<string, typeof translations.en> = {
  es: { title: 'Datos del Mercado del Acero', subtitle: 'Precios del acero y materias primas en tiempo real', lastUpdate: 'Última actualización', loading: 'Cargando datos...', error: 'Datos temporalmente no disponibles', source: 'Fuente', commodities: { steel: 'Acero (HRC)', ironOre: 'Mineral de hierro', coal: 'Carbón coquizable', scrap: 'Chatarra de acero', rebar: 'Varilla corrugada', galvanized: 'Bobina galvanizada', coldRolled: 'Lámina cold rolled', nickel: 'Níquel', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  fr: { title: 'Données du Marché de l\'Acier', subtitle: 'Prix de l\'acier et des matières premières en temps réel', lastUpdate: 'Dernière mise à jour', loading: 'Chargement...', error: 'Données temporairement indisponibles', source: 'Source', commodities: { steel: 'Acier (HRC)', ironOre: 'Minerai de fer', coal: 'Charbon cokéfiable', scrap: 'Ferraille', rebar: 'Acier d\'armature', galvanized: 'Bobine galvanisée', coldRolled: 'Tôle cold rolled', nickel: 'Nickel', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  ar: { title: 'بيانات سوق الصلب', subtitle: 'أسعار الصلب والمواد الخام في الوقت الفعلي', lastUpdate: 'آخر تحديث', loading: 'جاري التحميل...', error: 'البيانات غير متاحة مؤقتا', source: 'المصدر', commodities: { steel: 'الصلب (HRC)', ironOre: 'خام الحديد', coal: 'فحم الكوك', scrap: 'خردة الصلب', rebar: 'حديد التسليح', galvanized: 'ملف مجلفن', coldRolled: 'صفائح باردة', nickel: 'النيكل', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  pt: { title: 'Dados do Mercado de Aço', subtitle: 'Preços do aço e matérias-primas em tempo real', lastUpdate: 'Última atualização', loading: 'Carregando...', error: 'Dados temporariamente indisponíveis', source: 'Fonte', commodities: { steel: 'Aço (HRC)', ironOre: 'Minério de ferro', coal: 'Carvão coqueria', scrap: 'Sucata de aço', rebar: 'Aço CA-50', galvanized: 'Bobina galvanizada', coldRolled: 'Chapa cold rolled', nickel: 'Níquel', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  ru: { title: 'Данные рынка стали', subtitle: 'Цены на сталь и сырье в реальном времени', lastUpdate: 'Последнее обновление', loading: 'Загрузка...', error: 'Данные временно недоступны', source: 'Источник', commodities: { steel: 'Сталь (HRC)', ironOre: 'Железная руда', coal: 'Коксующийся уголь', scrap: 'Металлолом', rebar: 'Арматура', galvanized: 'Оцинкованный рулон', coldRolled: 'Холоднокатаный лист', nickel: 'Никель', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  ja: { title: '鋼材市場データ', subtitle: '鋼材と原材料のリアルタイム価格', lastUpdate: '最終更新', loading: '読み込み中...', error: 'データ一時的に利用不可', source: 'ソース', commodities: { steel: '鋼材 (HRC)', ironOre: '鉄鉱石', coal: 'コークス用石炭', scrap: '鉄スクラップ', rebar: '鉄筋', galvanized: '溶融亜鉛めっき鋼板', coldRolled: '冷間圧延鋼板', nickel: 'ニッケル', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  de: { title: 'Stahldaten', subtitle: 'Echtzeit-Preise für Stahl und Rohstoffe', lastUpdate: 'Letzte Aktualisierung', loading: 'Laden...', error: 'Daten vorübergehend nicht verfügbar', source: 'Quelle', commodities: { steel: 'Stahl (HRC)', ironOre: 'Eisenerz', coal: 'Kokskohle', scrap: 'Stahlschrott', rebar: 'Bewehrungsstahl', galvanized: 'Verzinktes Blech', coldRolled: 'Kaltgewalztes Blech', nickel: 'Nickel', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
  hi: { title: 'इस्पात बाज़ार डेटा', subtitle: 'इस्पात और कच्चे माल की वास्तविक समय की कीमतें', lastUpdate: 'अंतिम अपडेट', loading: 'लोड हो रहा है...', error: 'डेटा अस्थायी रूप से अनुपलब्ध', source: 'स्रोत', commodities: { steel: 'इस्पात (HRC)', ironOre: 'लौह अयस्क', coal: 'कोकिंग कोयला', scrap: 'इस्पात स्क्रैप', rebar: 'रीबार', galvanized: 'जिंक-लेपित कॉइल', coldRolled: 'कोल्ड रोल्ड शीट', nickel: 'निकेल', usdzar: 'USD/ZAR', usdcny: 'USD/CNY' } },
}

// Default fallback data
// Static fallback data - DO NOT use new Date() here to prevent hydration mismatch
// The timestamp is set once at component initialization via useState lazy init
const defaultData: CommodityResponse = {
  steel: [
    { name: 'Hot Rolled Coil (HRC)', symbol: 'HRC', price: '685.50', change: '+12.30', changePercent: '+1.83%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Cold Rolled Coil (CRC)', symbol: 'CRC', price: '795.00', change: '+8.75', changePercent: '+1.11%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Rebar (Construction)', symbol: 'REBAR', price: '562.30', change: '-5.20', changePercent: '-0.92%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Galvanized Coil', symbol: 'GI', price: '825.00', change: '+15.40', changePercent: '+1.90%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Steel Scrap (HMS 1/2)', symbol: 'HMS', price: '385.00', change: '+3.50', changePercent: '+0.92%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Iron Ore (62% Fe)', symbol: 'FE62', price: '118.50', change: '-1.25', changePercent: '-1.04%', unit: 'USD/dmtu', updated: 'initial' },
    { name: 'Coking Coal', symbol: 'COKING', price: '215.80', change: '+4.30', changePercent: '+2.03%', unit: 'USD/ton', updated: 'initial' },
    { name: 'Nickel', symbol: 'NI', price: '16245.00', change: '+125.50', changePercent: '+0.78%', unit: 'USD/ton', updated: 'initial' },
  ],
  currencies: {
    usdcny: 7.24,
    usdzar: 18.45,
  },
  timestamp: 'initial',
  source: 'initial'
}

export default function SteelFutures({ locale }: SteelFuturesProps) {
  const [data, setData] = useState<CommodityResponse>(defaultData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [dataSource, setDataSource] = useState<string>('')
  
  const content = translations[locale] || translations.en

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/steel-prices', {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const result: CommodityResponse = await response.json()
      
      setData(result)
      setDataSource(result.source || 'real-time')
      setLastUpdated(new Date(result.timestamp).toLocaleTimeString(locale, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
    } catch (err) {
      console.error('Failed to fetch steel futures:', err)
      setError(content.error)
      // Keep showing previous data on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [locale, content.error])

  // Get display name for commodity
  const getCommodityName = (symbol: string): string => {
    const key = symbol.toLowerCase()
    if (content.commodities[key as keyof typeof content.commodities]) {
      return content.commodities[key as keyof typeof content.commodities]
    }
    // Fallback to symbol
    return symbol
  }

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600'
    if (change.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeBg = (change: string) => {
    if (change.startsWith('+')) return 'bg-green-50 border-green-100'
    if (change.startsWith('-')) return 'bg-red-50 border-red-100'
    return 'bg-gray-50 border-gray-100'
  }

  const formatPrice = (price: number | string, symbol: string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    // Format based on price magnitude
    if (numPrice > 1000) {
      return numPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else if (numPrice > 100) {
      return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {content.title}
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            {content.subtitle}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-slate-400">{content.loading}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Market Data Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
              {data.steel.slice(0, 8).map((item, index) => (
                <div 
                  key={index}
                  className={`${getChangeBg(item.change)} rounded-xl p-4 text-center transition-transform hover:scale-105 border`}
                >
                  <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">
                    {getCommodityName(item.symbol)}
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
                    {formatPrice(item.price, item.symbol)}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    {item.unit}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getChangeColor(item.change)}`}>
                    <span>{item.change}</span>
                    <span className="opacity-75">({item.changePercent})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Currency Info */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="bg-white/10 rounded-xl px-6 py-3 text-center">
                <div className="text-xs text-slate-400 mb-1">{content.commodities.usdcny}</div>
                <div className="text-xl font-bold text-white">
                  {data.currencies.usdcny.toFixed(4)}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3 text-center">
                <div className="text-xs text-slate-400 mb-1">{content.commodities.usdzar}</div>
                <div className="text-xl font-bold text-white">
                  {data.currencies.usdzar.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-xs">
                {content.lastUpdate}: {lastUpdated || '--:--'}
                {dataSource && dataSource !== 'fallback' && (
                  <span className="ml-2">• {content.source}: {dataSource}</span>
                )}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-center">
              <p className="text-slate-500 text-xs max-w-2xl mx-auto">
                Prices shown are reference prices for informational purposes only. Actual fastener prices may vary based on specifications, quantities, and market conditions. Always confirm current pricing with your sales representative.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
