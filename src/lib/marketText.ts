// 地域页正文统一取文案：优先级 语种覆盖文件 → markets.ts 的 en/zh
import { getMarket } from '@/lib/markets'
import { marketTextOverrides } from '@/lib/marketsI18n'
import { marketTextEsJa } from '@/lib/marketsI18nEsJa'
import { marketTextRu } from '@/lib/marketsI18nRu'
import { marketTextAr } from '@/lib/marketsI18nAr'
import { marketTextDeHi } from '@/lib/marketsI18nDeHi'

const SOURCES = [marketTextOverrides, marketTextEsJa, marketTextRu, marketTextAr, marketTextDeHi]

export function marketText(slug: string, locale: string) {
  const m = getMarket(slug)
  if (!m) return null
  const ov = SOURCES.map(src => src[slug]?.[locale]).find(Boolean)
  return {
    hero: ov?.hero || m.hero[locale] || m.hero.en,
    ports: ov?.ports || m.ports[locale] || m.ports.en,
    docs: ov?.docs || m.docs[locale] || m.docs.en,
    lines: ov?.lines || m.lines[locale] || m.lines.en,
    faq: ov?.faq || m.faq[locale] || m.faq.en,
  }
}
