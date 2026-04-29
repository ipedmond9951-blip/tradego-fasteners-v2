import type { Metadata, Viewport } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GeoProvider } from '@/contexts/GeoContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { locales, type Locale } from '@/i18n'
import AIChatWidget from '@/components/AIChatWidget'
import Analytics from '@/components/Analytics'
import WhatsAppCTA from '@/components/WhatsAppCTA'
import FAQSchema from '@/components/FAQSchema'
import VideoSchema from '@/components/VideoSchema'
import OrganizationSchema from '@/components/OrganizationSchema'
import NavigationSchema from '@/components/NavigationSchema'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import ReviewSchema from '@/components/ReviewSchema'
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
    zh: 'TradeGo紧固件 - 中国对非出口厂家 | ISO 9001, SABS认证',
    en: 'TradeGo Fasteners - China Manufacturer for Zimbabwe & Southern Africa | ISO 9001, SABS',
  }
  const descriptions: Record<string, string> = {
    zh: 'ISO 9001 & SABS认证中国紧固件制造商。15+年供应津巴布韦、南非、赞比亚、莫桑比克。干壁钉、六角螺栓、IBR钉、自攻钉。发货至德班、贝拉、哈拉雷。',
    en: 'ISO 9001 & SABS certified China fastener manufacturer. 15+ years supplying Zimbabwe, South Africa, Zambia, Mozambique with drywall screws, hex bolts, IBR nails at factory prices. Shipping to Durban, Beira, Harare.',
  }
  
  return {
    title: {
      default: titles[loc] || titles.en,
      template: '%s | TradeGo Fasteners',
    },
    description: descriptions[loc] || descriptions.en,
    // Meta keywords removed per modern SEO best practice
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      locale: loc === 'zh' ? 'zh_CN' : 'en_US',
      url: `${siteUrl}/${loc}`,
      siteName: 'TradeGo Fasteners',
      title: titles[loc] || titles.en,
      description: descriptions[loc] || descriptions.en,
      images: [{ url: `${siteUrl}/images/og-image.webp`, width: 1200, height: 630, alt: 'TradeGo Fasteners' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[loc] || titles.en,
      description: descriptions[loc] || descriptions.en,
      images: [`${siteUrl}/images/og-image.webp`],
    },
    alternates: {
      canonical: `${siteUrl}/${loc}`,
      languages: Object.fromEntries(locales.map(l => [l, `${siteUrl}/${l}`])),
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TradeGo" />
        <meta name="theme-color" content="#0A3D62" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TradeGo Fasteners",
          "url": "https://www.tradego-fasteners.com",
          "logo": "https://www.tradego-fasteners.com/images/logo.png",
          "description": "ISO 9001 & SABS certified China fastener manufacturer. 15+ years exporting to Zimbabwe, South Africa, Zambia, Mozambique, Botswana. Drywall screws, hex bolts, IBR nails, self-drilling screws at factory prices. Shipping to Durban, Beira, Harare.",
          "foundingDate": "2004",
          "address": { "@type": "PostalAddress", "addressCountry": "CN", "addressLocality": "Hebei" },
          "areaServed": [
            { "@type": "Country", "name": "Zimbabwe" },
            { "@type": "Country", "name": "South Africa" },
            { "@type": "Country", "name": "Zambia" },
            { "@type": "Country", "name": "Mozambique" },
            { "@type": "Country", "name": "Botswana" },
            { "@type": "Country", "name": "Malawi" },
            { "@type": "Country", "name": "Namibia" }
          ],
          "contactPoint": { "@type": "ContactPoint", "telephone": "+86-159-6340-9951", "whatsApp": "+86-159-6340-9951", "contactType": "sales", "availableLanguage": ["English", "Chinese"] },
          "sameAs": [
          "https://www.facebook.com/tradegofasteners",
          "https://twitter.com/tradegofasteners",
          "https://www.youtube.com/@tradegofasteners"
        ]
        }) }} />
        <FAQSchema locale={loc} />
        <VideoSchema locale={loc} />
        <OrganizationSchema locale={loc} />
        <LocalBusinessSchema locale={loc} />
        <ReviewSchema locale={loc} />
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
          </CurrencyProvider>
        </GeoProvider>
      </body>
    </html>
  )
}
