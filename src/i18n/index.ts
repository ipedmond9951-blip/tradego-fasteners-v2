import en from './en.json'
import zh from './zh.json'
import es from './es.json'
import ar from './ar.json'
import fr from './fr.json'
import pt from './pt.json'
import ru from './ru.json'
import ja from './ja.json'
import de from './de.json'
import hi from './hi.json'

export const locales = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export type Messages = typeof en

const messages = { en, zh, es, ar, fr, pt, ru, ja, de, hi } as Record<Locale, Messages>

export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages[defaultLocale]
}

// Language display info
export const localeInfo: Record<Locale, { nativeName: string; englishName: string; currency: string }> = {
  en: { nativeName: 'English', englishName: 'English', currency: 'USD' },
  zh: { nativeName: '中文', englishName: 'Chinese', currency: 'CNY' },
  es: { nativeName: 'Español', englishName: 'Spanish', currency: 'EUR' },
  ar: { nativeName: 'العربية', englishName: 'Arabic', currency: 'SAR' },
  fr: { nativeName: 'Français', englishName: 'French', currency: 'EUR' },
  pt: { nativeName: 'Português', englishName: 'Portuguese', currency: 'BRL' },
  ru: { nativeName: 'Русский', englishName: 'Russian', currency: 'RUB' },
  ja: { nativeName: '日本語', englishName: 'Japanese', currency: 'JPY' },
  de: { nativeName: 'Deutsch', englishName: 'German', currency: 'EUR' },
  hi: { nativeName: 'हिन्दी', englishName: 'Hindi', currency: 'INR' },
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
