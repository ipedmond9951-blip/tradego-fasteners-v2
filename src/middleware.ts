import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

// Country → locale + currency mapping
const geoConfig: Record<string, { lang: string; currency: string }> = {
  // English
  US: { lang: 'en', currency: 'USD' },
  GB: { lang: 'en', currency: 'GBP' },
  AU: { lang: 'en', currency: 'AUD' },
  NZ: { lang: 'en', currency: 'NZD' },
  CA: { lang: 'en', currency: 'CAD' },
  NG: { lang: 'en', currency: 'USD' },
  KE: { lang: 'en', currency: 'USD' },
  ZA: { lang: 'en', currency: 'ZAR' },
  // Chinese
  CN: { lang: 'zh', currency: 'CNY' },
  HK: { lang: 'zh', currency: 'CNY' },
  TW: { lang: 'zh', currency: 'CNY' },
  // Spanish
  MX: { lang: 'es', currency: 'MXN' },
  AR: { lang: 'es', currency: 'ARS' },
  CO: { lang: 'es', currency: 'COP' },
  CL: { lang: 'es', currency: 'CLP' },
  PE: { lang: 'es', currency: 'PEN' },
  EC: { lang: 'es', currency: 'USD' },
  VE: { lang: 'es', currency: 'USD' },
  CU: { lang: 'es', currency: 'USD' },
  // Arabic
  SA: { lang: 'ar', currency: 'SAR' },
  AE: { lang: 'ar', currency: 'AED' },
  EG: { lang: 'ar', currency: 'EGP' },
  IQ: { lang: 'ar', currency: 'IQD' },
  KW: { lang: 'ar', currency: 'KWD' },
  QA: { lang: 'ar', currency: 'QAR' },
  BH: { lang: 'ar', currency: 'BHD' },
  OM: { lang: 'ar', currency: 'OMR' },
  JO: { lang: 'ar', currency: 'JOD' },
  LB: { lang: 'ar', currency: 'LBP' },
  DZ: { lang: 'ar', currency: 'DZD' },
  MA: { lang: 'ar', currency: 'MAD' },
  TN: { lang: 'ar', currency: 'TND' },
  // French
  FR: { lang: 'fr', currency: 'EUR' },
  SN: { lang: 'fr', currency: 'XOF' },
  CI: { lang: 'fr', currency: 'XOF' },
  CM: { lang: 'fr', currency: 'XAF' },
  MG: { lang: 'fr', currency: 'MGA' },
  // Portuguese
  BR: { lang: 'pt', currency: 'BRL' },
  PT: { lang: 'pt', currency: 'EUR' },
  MZ: { lang: 'pt', currency: 'MZN' },
  AO: { lang: 'pt', currency: 'AOA' },
  // Russian
  RU: { lang: 'ru', currency: 'RUB' },
  UA: { lang: 'ru', currency: 'UAH' },
  BY: { lang: 'ru', currency: 'BYN' },
  KZ: { lang: 'ru', currency: 'KZT' },
  UZ: { lang: 'ru', currency: 'UZS' },
  // Japanese
  JP: { lang: 'ja', currency: 'JPY' },
  // German
  DE: { lang: 'de', currency: 'EUR' },
  AT: { lang: 'de', currency: 'EUR' },
  CH: { lang: 'de', currency: 'CHF' },
  // Hindi
  IN: { lang: 'hi', currency: 'INR' },
  // European defaults
  IT: { lang: 'en', currency: 'EUR' },
  ES: { lang: 'es', currency: 'EUR' },
  NL: { lang: 'en', currency: 'EUR' },
  BE: { lang: 'en', currency: 'EUR' },
  PL: { lang: 'en', currency: 'PLN' },
  SE: { lang: 'en', currency: 'SEK' },
  DK: { lang: 'en', currency: 'DKK' },
  FI: { lang: 'en', currency: 'EUR' },
  IE: { lang: 'en', currency: 'EUR' },
  GR: { lang: 'en', currency: 'EUR' },
  CZ: { lang: 'en', currency: 'CZK' },
  RO: { lang: 'en', currency: 'RON' },
  HU: { lang: 'en', currency: 'HUF' },
  NO: { lang: 'en', currency: 'NOK' },
  KR: { lang: 'en', currency: 'KRW' },
  // Default
  default: { lang: 'en', currency: 'USD' },
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const country = request.headers.get('x-vercel-ip-country') || 'default'
  const config = geoConfig[country] || geoConfig.default

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Redirect to locale path if missing
  if (!pathnameHasLocale) {
    const locale = config.lang
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Set geo headers for downstream use
  const response = NextResponse.next()
  response.headers.set('x-geo-country', country)
  response.headers.set('x-geo-currency', config.currency)
  response.headers.set('x-geo-lang', config.lang)

  // Set cookies for client-side access
  response.cookies.set('geo-country', country, { path: '/', sameSite: 'lax' })
  response.cookies.set('geo-currency', config.currency, { path: '/', sameSite: 'lax' })
  response.cookies.set('geo-lang', config.lang, { path: '/', sameSite: 'lax' })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|favicon|.*\\..*).*)'],
}
