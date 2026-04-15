import en from './en.json'
import zh from './zh.json'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

// Export message types
export type Messages = typeof en

const messages: Record<Locale, Messages> = { en, zh }

export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages[defaultLocale]
}

export function t(locale: Locale, path: string): string {
  const msg = messages[locale] || messages[defaultLocale]
  const keys = path.split('.')
  let result: unknown = msg
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path // fallback to key
    }
  }
  return typeof result === 'string' ? result : path
}
