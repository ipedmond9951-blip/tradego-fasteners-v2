import Script from 'next/script'
import { locales, type Locale, getMessages, t } from '@/i18n'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ProductGrid from '@/components/ProductGrid'
import FAQSection from '@/components/FAQSection'
import InquiryForm from '@/components/InquiryForm'
import TeamCard from '@/components/TeamCard'
import { GeoPromotion } from '@/components/GeoContent'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = (localeParam as Locale) || 'en'
  const msgs = getMessages(locale)
  const BASE_URL = 'https://tradego-fasteners-v2.vercel.app'

  return (
    <>
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TradeGo Fasteners',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            description: msgs.hero.subtitle,
            foundingDate: '2004',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Weifang',
              addressCountry: 'CN',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+86-159-6340-9951',
              contactType: 'sales',
              email: 'info@tradegofasteners.com',
              availableLanguage: ['English', 'Chinese', 'Spanish', 'Arabic', 'French', 'Portuguese', 'Russian', 'Japanese', 'German', 'Hindi'],
            },
          }),
        }}
      />

      <HeroSection locale={locale} />

      <div className="container mx-auto px-4">
        <GeoPromotion />
      </div>

      <AboutSection locale={locale} />
      <TeamCard locale={locale} />
      <ProductGrid locale={locale} />
      <FAQSection locale={locale} />
      <InquiryForm locale={locale} />
    </>
  )
}
