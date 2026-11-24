import fs from 'fs'
import path from 'path'

// 2026-11-25 额度整改: 原实现每次请求都进函数 + 自己 fetch 一次 /llms.txt(回源),
// AI 爬虫对 llms.txt 抓取很频繁, 是 Fast Origin Transfer / Fluid CPU 的固定损耗。
// 改为构建期读 public/llms.txt 生成 10 份静态文本, 之后由 CDN 直接返回, 内容逻辑不变。
export const dynamic = 'force-static'
export const revalidate = false
export const dynamicParams = false

const locales = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi'] as const

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params

  const file = path.join(process.cwd(), 'public', 'llms.txt')
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '# TradeGo Fasteners\n'
  const header = localeHeaders[locale] || localeHeaders.en
  const localizedText = text.replace(/^# TradeGo Fasteners.*$/m, header)

  return new Response(localizedText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
