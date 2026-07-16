import en from './en.json'
import zh from './zh.json'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export type Messages = typeof en

const messages = { en, zh } as Record<Locale, Messages>

export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages[defaultLocale]
}

// Language display info
export const localeInfo: Record<Locale, { nativeName: string; englishName: string; currency: string }> = {
  en: { nativeName: 'English', englishName: 'English', currency: 'USD' },
  zh: { nativeName: '中文', englishName: 'Chinese', currency: 'CNY' },
}

export function t(locale: Locale, path: string): string {
  const msg = messages[locale] || messages[defaultLocale]
  const keys = path.split('.')
  let result: unknown = msg
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof result === 'string' ? result : path
}
