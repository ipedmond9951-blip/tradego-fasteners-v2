import Link from 'next/link'
import { type Locale, t } from '@/i18n'

interface FooterProps { locale?: Locale }

export default function Footer({ locale = 'en' }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Company */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg md:text-xl font-bold mb-3">TradeGo Fasteners</h3>
            <p className="text-gray-400 text-xs md:text-sm mb-0">{t(locale, 'footer.companyDesc')}</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t(locale, 'footer.quickLinks')}</h4>
            <div className="space-y-1.5 text-xs md:text-sm">
              <Link href={`/${locale}`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.home')}</Link>
              <Link href={`/${locale}#products`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.products')}</Link>
              <Link href={`/${locale}#about`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.about')}</Link>
              <Link href={`/${locale}#inquiry`} className="block text-gray-400 hover:text-white">{t(locale, 'nav.contact')}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t(locale, 'footer.contactUs')}</h4>
            <div className="space-y-1.5 text-xs md:text-sm text-gray-400">
              <p>📍 {t(locale, 'footer.address')}</p>
              <p>📧 {t(locale, 'footer.email')}</p>
              <p>📱 WhatsApp: +86 159 6340 9951</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">{t(locale, 'nav.products')}</h4>
            <div className="space-y-1.5 text-xs md:text-sm text-gray-400">
              <p>Drywall Screws</p>
              <p>Self-Drilling Screws</p>
              <p>Bolts & Nuts</p>
              <p>IBR Nails</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-xs md:text-sm">
          © {new Date().getFullYear()} TradeGo Fasteners. {t(locale, 'footer.rights')}
        </div>
      </div>
    </footer>
  )
}
