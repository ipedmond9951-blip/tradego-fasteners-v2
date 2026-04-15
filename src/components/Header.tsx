'use client';

import Link from 'next/link';
import { type Locale } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';

interface HeaderProps {
  locale?: Locale;
}

const navText: Partial<Record<Locale, Record<string, string>>> = {
  en: { home: 'Home', products: 'Products', faq: 'FAQ', about: 'About Us', contact: 'Get a Quote' },
  zh: { home: '首页', products: '产品', faq: '常见问题', about: '关于我们', contact: '获取报价' },
};

export default function Header({ locale = 'en' }: HeaderProps) {
  const t = navText[locale] || navText.en || {};

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">TradeGo</span>
            <span className="ml-2 text-lg text-gray-600">Fasteners</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href={`/${locale}`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t.home}</Link>
              <Link href={`/${locale}#products`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t.products}</Link>
              <Link href={`/${locale}#faq`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t.faq}</Link>
              <Link href={`/${locale}#about`} className="text-gray-600 hover:text-blue-600 font-medium text-sm">{t.about}</Link>
            </div>
            
            {/* Switchers - always visible */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            
            {/* CTA Button */}
            <Link 
              href={`/${locale}#inquiry`} 
              className="hidden sm:inline-flex bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm"
            >
              {t.contact}
            </Link>

            {/* Mobile menu */}
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
