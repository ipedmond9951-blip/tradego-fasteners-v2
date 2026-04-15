'use client'

import { useState } from 'react'
import { type Locale } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { t } from '@/i18n'

interface HeaderProps { locale?: Locale }

export default function Header({ locale = 'en' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}`, label: t(locale, 'nav.home') },
    { href: `/${locale}#products`, label: t(locale, 'nav.products') },
    { href: `/${locale}#faq`, label: t(locale, 'nav.faq') },
    { href: `/${locale}#about`, label: t(locale, 'nav.about') },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold text-blue-600">TradeGo</span>
            <span className="ml-1 md:ml-2 text-sm md:text-lg text-gray-600 hidden sm:inline">Fasteners</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 font-medium text-sm whitespace-nowrap">{link.label}</a>
            ))}
          </div>

          {/* Right side: switchers + CTA */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            <a href={`/${locale}#inquiry`} className="hidden md:inline-flex bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-xs md:text-sm whitespace-nowrap">
              {t(locale, 'nav.contact')}
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium text-base py-2"
              >
                {link.label}
              </a>
            ))}
            {/* Mobile switchers */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            <a
              href={`/${locale}#inquiry`}
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-blue-900 text-white text-center py-2.5 rounded-lg font-semibold text-sm"
            >
              {t(locale, 'nav.contact')}
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
