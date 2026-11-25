import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GeoProvider } from '@/contexts/GeoContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { locales, type Locale } from '@/i18n'
import { clampDescription } from '@/lib/seo'
const AIChatWidget = dynamic(() => import('@/components/AIChatWidget'))
import Analytics from '@/components/Analytics'
import { SpeedInsights } from '@vercel/speed-insights/next'
const CookieConsent = dynamic(() => import('@/components/CookieConsent') )
const WhatsAppCTA = dynamic(() => import('@/components/WhatsAppCTA') )
import VideoSchema from '@/components/VideoSchema'
import OrganizationSchema from '@/components/OrganizationSchema'
import NavigationSchema from '@/components/NavigationSchema'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import WebSiteSchema from '@/components/WebSiteSchema'
import ImageObjectSchema from '@/components/ImageObjectSchema'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A3D62',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'
  const siteUrl = 'https://www.tradego-fasteners.com'
  
  // 首页标题压到 55-60 字符（搜索结果页不截断），保留品类 + 认证 + 核心市场
  const titles: Record<string, string> = {
    zh: '紧固件批发厂家｜ISO 9001 & SABS｜直供南部非洲',
    en: 'Wholesale Fastener Manufacturer | Zimbabwe & S. Africa',
    es: 'Fabricante mayorista de fijaciones | África Austral',
    fr: 'Fabricant grossiste de fixations | Afrique australe',
    pt: 'Fabricante atacadista de fixadores | África Austral',
    ar: 'مصنع مثبتات بالجملة لزيمبابوي والجنوب الأفريقي',
    ru: 'Производитель крепежа оптом | Зимбабве и Юг Африки',
    ja: 'ファスナー卸売メーカー｜ジンバブエ・南部アフリカ',
    de: 'Großhandel Verbindungselemente | Südliches Afrika',
    hi: 'फास्टनर थोक निर्माता | ज़िम्बाब्वे और दक्षिणी अफ्रीका',
  }
  const descriptions: Record<string, string> = {
    zh: 'ISO 9001 & SABS认证中国紧固件制造商,20年出口津巴布韦、南非、赞比亚、莫桑比克、博茨瓦纳。干壁钉、六角螺栓、IBR瓦钉、自钻螺丝,出厂价直供。发货至德班、贝拉、哈拉雷。',
    en: 'ISO 9001 & SABS certified China fastener manufacturer with 20+ years exporting to Zimbabwe, South Africa, Zambia, Mozambique, Botswana. Drywall screws, hex bolts, IBR nails, self-drilling screws at factory prices. Shipping to Durban, Beira, Harare.',
    es: 'Fabricante chino de fijaciones con ISO 9001 y SABS, más de 20 años exportando a Zimbabue, Sudáfrica, Zambia, Mozambique y Botswana. Tornillos para pladur, pernos hexagonales, clavos IBR y tornillos autotaladrantes a precio de fábrica. Envíos a Durban, Beira y Harare.',
    fr: 'Fabricant chinois de fixations certifié ISO 9001 et SABS, plus de 20 ans d’export vers le Zimbabwe, l’Afrique du Sud, la Zambie, le Mozambique et le Botswana. Vis à plaque de plâtre, boulons hexagonaux, clous IBR et vis autoperceuses au prix usine. Expéditions vers Durban, Beira et Harare.',
    pt: 'Fabricante chinês de fixadores com ISO 9001 e SABS, há mais de 20 anos exportando para Zimbabué, África do Sul, Zâmbia, Moçambique e Botswana. Parafusos para gesso acartonado, parafusos sextavados, pregos IBR e parafusos autoperfurantes a preço de fábrica. Envios para Durban, Beira e Harare.',
    ar: 'مصنع صيني للمثبتات حاصل على ISO 9001 وSABS، يصدّر منذ أكثر من 20 عامًا إلى زيمبابوي وجنوب أفريقيا وزامبيا وموزمبيق وبوتسوانا. براغي الجبس والبراغي السداسية ومسامير IBR والبراغي ذاتية الحفر بأسعار المصنع. شحن إلى ديربان وبيرا وهاراري.',
    ru: 'Китайский производитель крепежа с сертификатами ISO 9001 и SABS, более 20 лет поставок в Зимбабве, ЮАР, Замбию, Мозамбик и Ботсвану. Саморезы для гипсокартона, шестигранные болты, гвозди IBR и саморезы по металлу по заводским ценам. Отгрузка в Дурбан, Бейру и Хараре.',
    ja: 'ISO 9001・SABS 認証の中国ファスナーメーカー。ジンバブエ、南アフリカ、ザンビア、モザンビーク、ボツワナへ 20 年以上輸出。石膏ボードねじ、六角ボルト、IBR 屋根釘、自穿孔ねじを工場価格で供給。ダーバン、ベイラ、ハラレへ出荷。',
    de: 'ISO-9001- und SABS-zertifizierter chinesischer Hersteller von Verbindungselementen, seit über 20 Jahren Export nach Simbabwe, Südafrika, Sambia, Mosambik und Botswana. Trockenbau-Schrauben, Sechskantschrauben, IBR-Dachnägel und Bohrschrauben zu Fabrikpreisen. Versand nach Durban, Beira und Harare.',
    hi: 'ISO 9001 और SABS प्रमाणित चीनी फास्टनर निर्माता, 20 से अधिक वर्षों से ज़िम्बाब्वे, दक्षिण अफ्रीका, ज़ाम्बिया, मोज़ाम्बिक और बोत्सवाना को निर्यात। ड्राईवॉल स्क्रू, हेक्स बोल्ट, IBR नेल और सेल्फ-ड्रिलिंग स्क्रू फैक्ट्री मूल्य पर। डरबन, बेरा और हरारे तक शिपिंग।',
  }
  
  return {
    title: {
      default: titles[loc] || titles.en,
      template: '%s',  // No brand suffix in template — children handle full title
    },
    description: clampDescription(descriptions[loc] || descriptions.en),
    // Meta keywords removed per modern SEO best practice
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: ({ en: 'en_US', zh: 'zh_CN', es: 'es_ES', fr: 'fr_FR', pt: 'pt_PT', ar: 'ar_AR', ru: 'ru_RU', ja: 'ja_JP', de: 'de_DE', hi: 'hi_IN' } as Record<string, string>)[loc] || 'en_US',
      url: `${siteUrl}/${loc}`,
      siteName: 'TradeGo Fasteners',
      title: titles[loc] || titles.en,
      description: clampDescription(descriptions[loc] || descriptions.en),
      images: [{ url: `${siteUrl}/images/og-image.webp`, width: 1200, height: 630, alt: 'TradeGo Fasteners' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[loc] || titles.en,
      description: clampDescription(descriptions[loc] || descriptions.en),
      images: [`${siteUrl}/images/og-image.webp`],
    },
    alternates: {
      canonical: `${siteUrl}/${loc}/`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/en/`],
        ...locales.map(l => [l, `${siteUrl}/${l}/`])
      ]),
    },
    verification: {
      google: 'B8o4b_2zfT64y2bbOMBlBLBpyMsc01wKJKcB8HlUYTg',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'

  return (
    <html lang={loc}>
      <head>
        {/* GSC 已 DNS 验证, 不需要 HTML meta tag */}

        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TradeGo" />
        <meta name="theme-color" content="#0A3D62" />
        <VideoSchema locale={loc} />
        <OrganizationSchema locale={loc} />
        <LocalBusinessSchema locale={loc} />
        <NavigationSchema locale={loc} />
        <WebSiteSchema locale={loc} />
        <ImageObjectSchema locale={loc} />
      </head>
      <body className="antialiased">
        <GeoProvider>
          <CurrencyProvider>
            <Header locale={loc} />
            <main>{children}</main>
            <Footer locale={loc} />
            <AIChatWidget locale={loc} />
            <WhatsAppCTA locale={loc} />
            <Analytics />
            <SpeedInsights />
            <CookieConsent locale={locale} />
          </CurrencyProvider>
        </GeoProvider>
      </body>
    </html>
  )
}
