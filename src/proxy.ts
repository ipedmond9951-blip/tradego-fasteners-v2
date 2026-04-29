import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']

// Country code → locale + currency mapping
const geoConfig: Record<string, { lang: string; currency: string }> = {
  // === ENGLISH SPEAKING ===
  // Global English
  US: { lang: 'en', currency: 'USD' },
  GB: { lang: 'en', currency: 'GBP' },
  AU: { lang: 'en', currency: 'AUD' },
  NZ: { lang: 'en', currency: 'NZD' },
  CA: { lang: 'en', currency: 'CAD' },
  IE: { lang: 'en', currency: 'EUR' },
  // Africa - English speaking
  NG: { lang: 'en', currency: 'USD' },
  KE: { lang: 'en', currency: 'USD' },
  ZA: { lang: 'en', currency: 'ZAR' },
  ZW: { lang: 'en', currency: 'USD' },
  GH: { lang: 'en', currency: 'GHS' },
  TZ: { lang: 'en', currency: 'TZS' },
  UG: { lang: 'en', currency: 'UGX' },
  ET: { lang: 'en', currency: 'ETB' },
  BW: { lang: 'en', currency: 'BWP' },
  ZM: { lang: 'en', currency: 'ZMW' },
  MW: { lang: 'en', currency: 'MWK' },
  MU: { lang: 'en', currency: 'MUR' },
  NA: { lang: 'en', currency: 'NAD' },
  SZ: { lang: 'en', currency: 'SZL' },
  LS: { lang: 'en', currency: 'LSL' },
  RW: { lang: 'en', currency: 'RWF' },
  SS: { lang: 'en', currency: 'SSP' },
  // Other English markets
  IN: { lang: 'hi', currency: 'INR' },
  KR: { lang: 'en', currency: 'KRW' },

  // === CHINESE ===
  CN: { lang: 'zh', currency: 'CNY' },
  HK: { lang: 'zh', currency: 'CNY' },
  TW: { lang: 'zh', currency: 'CNY' },
  MO: { lang: 'zh', currency: 'CNY' },

  // === SPANISH ===
  MX: { lang: 'es', currency: 'MXN' },
  AR: { lang: 'es', currency: 'ARS' },
  CO: { lang: 'es', currency: 'COP' },
  CL: { lang: 'es', currency: 'CLP' },
  PE: { lang: 'es', currency: 'PEN' },
  EC: { lang: 'es', currency: 'USD' },
  VE: { lang: 'es', currency: 'USD' },
  CU: { lang: 'es', currency: 'USD' },
  ES: { lang: 'es', currency: 'EUR' },

  // === ARABIC ===
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
  LY: { lang: 'ar', currency: 'LYD' },
  SD: { lang: 'ar', currency: 'SDG' },

  // === FRENCH ===
  FR: { lang: 'fr', currency: 'EUR' },
  CM: { lang: 'fr', currency: 'XAF' },
  CG: { lang: 'fr', currency: 'XAF' },
  CD: { lang: 'fr', currency: 'CDF' },
  SN: { lang: 'fr', currency: 'XOF' },
  CI: { lang: 'fr', currency: 'XOF' },
  BF: { lang: 'fr', currency: 'XOF' },
  ML: { lang: 'fr', currency: 'XOF' },
  NE: { lang: 'fr', currency: 'XOF' },
  TD: { lang: 'fr', currency: 'XAF' },
  GA: { lang: 'fr', currency: 'XAF' },
  DJ: { lang: 'fr', currency: 'DJF' },
  MG: { lang: 'fr', currency: 'MGA' },
  BE: { lang: 'fr', currency: 'EUR' },
  CH: { lang: 'fr', currency: 'CHF' },

  // === PORTUGUESE ===
  BR: { lang: 'pt', currency: 'BRL' },
  PT: { lang: 'pt', currency: 'EUR' },
  MZ: { lang: 'pt', currency: 'MZN' },
  AO: { lang: 'pt', currency: 'AOA' },
  GW: { lang: 'pt', currency: 'XOF' },

  // === RUSSIAN ===
  RU: { lang: 'ru', currency: 'RUB' },
  UA: { lang: 'ru', currency: 'UAH' },
  BY: { lang: 'ru', currency: 'BYN' },
  KZ: { lang: 'ru', currency: 'KZT' },
  UZ: { lang: 'ru', currency: 'UZS' },
  TJ: { lang: 'ru', currency: 'TJS' },
  TM: { lang: 'ru', currency: 'TMT' },
  KG: { lang: 'ru', currency: 'KGS' },

  // === JAPANESE ===
  JP: { lang: 'ja', currency: 'JPY' },

  // === GERMAN ===
  DE: { lang: 'de', currency: 'EUR' },
  AT: { lang: 'de', currency: 'EUR' },
  LI: { lang: 'de', currency: 'CHF' },

  // === EUROPEAN DEFAULTS ===
  IT: { lang: 'en', currency: 'EUR' },
  NL: { lang: 'en', currency: 'EUR' },
  PL: { lang: 'en', currency: 'PLN' },
  SE: { lang: 'en', currency: 'SEK' },
  DK: { lang: 'en', currency: 'DKK' },
  FI: { lang: 'en', currency: 'EUR' },
  GR: { lang: 'en', currency: 'EUR' },
  CZ: { lang: 'en', currency: 'CZK' },
  RO: { lang: 'en', currency: 'RON' },
  HU: { lang: 'en', currency: 'HUF' },
  NO: { lang: 'en', currency: 'NOK' },
  SK: { lang: 'en', currency: 'EUR' },

  // === Default fallback ===
  default: { lang: 'en', currency: 'USD' },
}

// geo-routing based on x-vercel-ip-country header
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get country from Vercel's geo header
  const country = request.headers.get('x-vercel-ip-country') || 'default'
  const config = geoConfig[country] || geoConfig.default

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Redirect root "/" to detected locale
  if (!pathnameHasLocale) {
    const locale = config.lang
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
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
  // Match all paths except API routes, static files, and _next
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
