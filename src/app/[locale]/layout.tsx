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
const CookieConsent = dynamic(() => import('@/components/CookieConsent') )
const WhatsAppCTA = dynamic(() => import('@/components/WhatsAppCTA') )
import FAQSchema from '@/components/FAQSchema'
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
  
  const titles: Record<string, string> = {
    zh: 'ISO 9001 & SABS认证中国紧固件制造商 - 工厂直供津巴布韦南非',
    en: 'ISO 9001 & SABS Certified China Fastener Manufacturer - Factory Direct to Zimbabwe & South Africa',
  }
  const descriptions: Record<string, string> = {
    zh: 'ISO 9001 & SABS认证中国紧固件制造商,20年出口津巴布韦、南非、赞比亚、莫桑比克、博茨瓦纳。干壁钉、六角螺栓、IBR瓦钉、自钻螺丝,出厂价直供。发货至德班、贝拉、哈拉雷。',
    en: 'ISO 9001 & SABS certified China fastener manufacturer with 20+ years exporting to Zimbabwe, South Africa, Zambia, Mozambique, Botswana. Drywall screws, hex bolts, IBR nails, self-drilling screws at factory prices. Shipping to Durban, Beira, Harare.',
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
      locale: loc === 'zh' ? 'zh_CN' : 'en_US',
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
      canonical: `${siteUrl}/${loc}`,
      languages: Object.fromEntries([
        ['x-default', `${siteUrl}/en`],
        ...locales.map(l => [l, `${siteUrl}/${l}`])
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
        <FAQSchema locale={loc} />
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
            <CookieConsent locale={locale} />
          </CurrencyProvider>
        </GeoProvider>
      </body>
    </html>
  )
}
