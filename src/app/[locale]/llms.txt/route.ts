import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  
  // Re-use root llms.txt, prepend a locale note
  const rootUrl = new URL('/llms.txt', request.url)
  const res = await fetch(rootUrl)
  const text = await res.text()
  
  // Detect locale and prepend a localized header
  const localeHeaders: Record<string, string> = {
    en: '# English Version (TradeGo Fasteners - llms.txt)',
    zh: '# 中文版本 (TradeGo 紧固件 - llms.txt)',
    es: '# Versión en Español (TradeGo Fasteners - llms.txt)',
    ar: '# النسخة العربية (TradeGo Fasteners - llms.txt)',
    fr: '# Version Française (TradeGo Fasteners - llms.txt)',
    pt: '# Versão em Português (TradeGo Fasteners - llms.txt)',
    ru: '# Русская версия (TradeGo Fasteners - llms.txt)',
    ja: '# 日本語版 (TradeGo Fasteners - llms.txt)',
    de: '# Deutsche Version (TradeGo Fasteners - llms.txt)',
    hi: '# हिंदी संस्करण (TradeGo Fasteners - llms.txt)',
  }
  
  const header = localeHeaders[locale] || localeHeaders.en
  const localizedText = text.replace(/^# TradeGo Fasteners.*$/m, header)
  
  return new Response(localizedText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}