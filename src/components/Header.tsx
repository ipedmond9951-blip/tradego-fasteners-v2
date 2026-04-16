'use client'

import { useState } from 'react'
import { type Locale, t } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'

interface HeaderProps { locale?: Locale }

export default function Header({ locale = 'en' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  const navItems: Array<{ href?: string; label: string; children?: Array<{ href: string; label: string; anchor?: string; icon?: string }> }> = [
    { href: `/${locale}`, label: t(locale, 'nav.home') },
    {
      label: t(locale, 'nav.products'),
      children: [
        { href: `/${locale}/products`, label: t(locale, 'products.allProducts') },
        { href: `/${locale}/product-upload`, label: t(locale, 'nav.uploadProduct'), icon: '📤' },
      ],
    },
    {
      label: t(locale, 'nav.industry'),
      children: [
        { href: `/${locale}/industry`, label: t(locale, 'nav.articles') },
        { href: `/${locale}/industry`, label: t(locale, 'nav.market'), anchor: 'market' },
        { href: `/${locale}/industry`, label: t(locale, 'nav.geoOptim'), anchor: 'geo' },
      ],
    },
    { href: `/${locale}#faq`, label: t(locale, 'nav.faq') },
    { href: `/${locale}#about`, label: t(locale, 'nav.about') },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          <a href={`/${locale}`} className="flex items-center flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold text-blue-600">TradeGo</span>
            <span className="ml-1 md:ml-2 text-sm md:text-lg text-gray-600 hidden sm:inline">Fasteners</span>
          </a>

          {/* Desktop Nav with Dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              'children' in item ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    {item.label}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {dropdown === item.label && (
                    <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                      {item.children && item.children.map((child) => (
                        <a
                          key={child.href + (child.anchor || '')}
                          href={child.href + (child.anchor ? `#${child.anchor}` : '')}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {(child as any).icon && <span>{(child as any).icon}</span>}
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a key={item.href} href={item.href} className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors">{item.label}</a>
              )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            <a href={`/${locale}#inquiry`} className="hidden md:inline-flex bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-xs md:text-sm whitespace-nowrap">
              {t(locale, 'nav.contact')}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => (
              'children' in item ? (
                <div key={item.label}>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                  {item.children && item.children.map((child) => (
                    <a key={child.href} href={child.href + (child.anchor ? `#${child.anchor}` : '')} onClick={() => setMenuOpen(false)} className="block pl-8 pr-4 py-2 text-gray-700 hover:text-blue-600 text-sm">
                      {(child as any).icon && <span className="mr-2">{(child as any).icon}</span>}
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">{item.label}</a>
              )
            ))}
            <div className="flex items-center gap-3 pt-3 px-4 border-t border-gray-100 mt-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
            <a href={`/${locale}#inquiry`} onClick={() => setMenuOpen(false)} className="block mx-4 mt-2 bg-blue-900 text-white text-center py-2.5 rounded-lg font-semibold text-sm">
              {t(locale, 'nav.contact')}
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
