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
  const siteUrl = 'https://tradego-fasteners.com'
  
  const titles: Record<string, string> = {
    zh: '紧固件批发制造商 | 干墙螺丝·螺栓螺母',
    en: 'Wholesale Fasteners Manufacturer | Drywall Screws & Bolts',
  }
  const descriptions: Record<string, string> = {
    zh: 'ISO 9001紧固件批发商：干墙螺丝、自钻螺丝、螺栓螺母、IBR钉。20年经验，起订量低，全球发货。立即询价！',
    en: 'ISO 9001 certified wholesale fastener manufacturer with 20+ years expertise. Quality drywall screws, self-drilling screws, bolts, nuts & IBR nails. Low MOQ, global delivery. Request your quote today!',
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
      images: [{ url: `${siteUrl}/images/og-image.jpg`, width: 1200, height: 630, alt: 'TradeGo Fasteners' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[loc] || titles.en,
      description: descriptions[loc] || descriptions.en,
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    alternates: {
      canonical: `/${loc}`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}`])),
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
          "url": "https://tradego-fasteners.com",
          "logo": "https://tradego-fasteners.com/images/logo.png",
          "description": "Professional fastener manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails",
          "foundingDate": "2004",
          "address": { "@type": "PostalAddress", "addressCountry": "CN", "addressLocality": "Hebei" },
          "contactPoint": { "@type": "ContactPoint", "contactType": "sales", "availableLanguage": ["English", "Chinese"] },
          "sameAs": [
          "https://www.linkedin.com/company/tradego-fasteners",
          "https://www.facebook.com/tradegofasteners",
          "https://twitter.com/tradegofasteners",
          "https://www.youtube.com/@tradegofasteners"
        ]
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TradeGo Fasteners",
          "url": "https://tradego-fasteners.com"
        }) }} />
        <FAQSchema locale={loc} />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="zh" href="/zh" />
        <link rel="alternate" hrefLang="es" href="/es" />
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="alternate" hrefLang="fr" href="/fr" />
        <link rel="alternate" hrefLang="pt" href="/pt" />
        <link rel="alternate" hrefLang="ru" href="/ru" />
        <link rel="alternate" hrefLang="ja" href="/ja" />
        <link rel="alternate" hrefLang="de" href="/de" />
        <link rel="alternate" hrefLang="hi" href="/hi" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
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
