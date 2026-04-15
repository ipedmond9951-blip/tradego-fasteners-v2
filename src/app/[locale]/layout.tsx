import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GeoProvider } from '@/contexts/GeoContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { locales, type Locale } from '@/i18n'
import AIChatWidget from '@/components/AIChatWidget'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (locale as Locale) || 'en'
  
  return {
    title: {
      default: loc === 'zh' 
        ? 'TradeGo Fasteners | 专业紧固件制造商' 
        : 'TradeGo Fasteners | Leading Fastener Manufacturer',
      template: '%s | TradeGo Fasteners',
    },
    description: loc === 'zh'
      ? 'TradeGo Fasteners是专业紧固件制造商，主营干墙螺丝、自钻螺丝、螺栓、螺母、IBR钉。20年经验，ISO 9001认证，全球发货。'
      : 'TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified, global delivery.',
    alternates: {
      canonical: `/${loc}`,
      languages: {
        en: '/en',
        zh: '/zh',
      },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a8a" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="zh" href="/zh" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </head>
      <body className="antialiased">
        <GeoProvider>
          <CurrencyProvider>
            <Header locale={loc} />
            <main>{children}</main>
            <Footer locale={loc} />
            <AIChatWidget locale={loc} />
          </CurrencyProvider>
        </GeoProvider>
      </body>
    </html>
  )
}
