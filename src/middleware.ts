import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const geoConfig: Record<string, { lang: string; currency: string }> = {
  US: { lang: 'en', currency: 'USD' },
  GB: { lang: 'en', currency: 'GBP' },
  CN: { lang: 'zh', currency: 'CNY' },
  HK: { lang: 'zh', currency: 'CNY' },
  TW: { lang: 'zh', currency: 'CNY' },
  DE: { lang: 'en', currency: 'EUR' },
  FR: { lang: 'en', currency: 'EUR' },
  IT: { lang: 'en', currency: 'EUR' },
  ES: { lang: 'en', currency: 'EUR' },
  NL: { lang: 'en', currency: 'EUR' },
  ZA: { lang: 'en', currency: 'ZAR' },
  NG: { lang: 'en', currency: 'USD' },
  KE: { lang: 'en', currency: 'USD' },
  AU: { lang: 'en', currency: 'USD' },
  JP: { lang: 'en', currency: 'USD' },
  KR: { lang: 'en', currency: 'USD' },
  IN: { lang: 'en', currency: 'USD' },
  BR: { lang: 'en', currency: 'USD' },
  MX: { lang: 'en', currency: 'USD' },
  default: { lang: 'en', currency: 'USD' },
}

const locales = ['en', 'zh']

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

  // Get geo info from Vercel headers
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

  // Set cookie for client-side access
  response.cookies.set('geo-country', country, { path: '/', sameSite: 'lax' })
  response.cookies.set('geo-currency', config.currency, { path: '/', sameSite: 'lax' })
  response.cookies.set('geo-lang', config.lang, { path: '/', sameSite: 'lax' })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|favicon|.*\\..*).*)'],
}
