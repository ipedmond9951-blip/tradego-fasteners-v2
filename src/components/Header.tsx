'use client'

import { type Locale } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { t } from '@/i18n'

interface HeaderProps { locale?: Locale }

export default function Header({ locale = 'en' }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href={`/${locale}`} className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">TradeGo</span>
            <span className="ml-2 text-lg text-gray-600">Fasteners</span>
          </a>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-6">
              <a href={`/${locale}`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t(locale, 'nav.home')}</a>
              <a href={`/${locale}#products`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t(locale, 'nav.products')}</a>
              <a href={`/${locale}#faq`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t(locale, 'nav.faq')}</a>
              <a href={`/${locale}#about`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t(locale, 'nav.about')}</a>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            
            <a href={`/${locale}#inquiry`} className="hidden sm:inline-flex bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm">
              {t(locale, 'nav.contact')}
            </a>

            <button className="md:hidden text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
