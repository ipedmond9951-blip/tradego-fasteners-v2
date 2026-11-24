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

  // 2026-11-24 额度治理: apex → www 的 301 已由 Vercel 域名层直接处理
  // (PATCH /v9/projects/<id>/domains 的 redirect 字段, 实测 curl tradego-fasteners.com/en/ → 301),
  // 请求根本到不了 middleware, 这里再判 host 属死代码, 每次请求读 header 的微成本一并去掉。

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

  // Check if pathname already has a locale prefix (with or without trailing slash)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}` || pathname === `/${locale}/`
  )

  // Redirect root "/" to detected locale
  if (!pathnameHasLocale) {
    const locale = config.lang
    // trailingSlash: true → always end with /
    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '/' : pathname.endsWith('/') ? pathname : pathname + '/'}`
    return NextResponse.redirect(request.nextUrl)
  }

  // 2026-11-24 额度治理: geo cookie / x-geo-* 头在本仓库里没有任何消费方(grep 全仓 0 命中),
  // 但每个页面响应都带 Set-Cookie, 导致响应 Cache-Control 变成 must-revalidate、CDN 无法缓存,
  // 每次访问都要过 middleware 并回源 —— 这是 Fast Origin Transfer 19GB / ISR Reads 2.5M /
  // Fluid CPU 3h54m 三项一起越线的主因。这里只保留 www 跳转和根路径按国家跳语种, 其余直接放行。
  return NextResponse.next()
}

export const config = {
  // 2026-11-24 额度治理: matcher 收窄为「根路径 + 不属于任何语种前缀的路径」。
  // 语种页面(/en/... /zh/... 等, 占全部 4400 页)不再进 middleware —— 它们本来只走到
  // NextResponse.next() 那一行, 白付一次函数调用。仍保留无前缀旧路径 → /{国家语言}/ 的跳转。
  matcher: [
    '/',
    '/((?!en/|zh/|es/|fr/|pt/|ar/|ru/|ja/|de/|hi/|api|_next|favicon|.*\\.).*)',
  ],
}
