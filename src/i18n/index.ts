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

// 2026-07-16 23:30 修复 GSC 索引问题 (3,259 条未编入索引)
// 8 语言内容/UI/sitemap 都存在, 但 @/i18n 只声明 2 个, 导致:
// - hreflang 只声明 en/zh → 8 语言被 Google 当重复
// - LanguageSwitcher 找不到 localeInfo → 产生 /hiundefined 等 BUG URL
// 修复: 加回 10 locales, 让 hreflang/sitemap/i18n 完整
export const locales = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export type Messages = typeof en

const messages = { en, zh, es, ar, fr, pt, ru, ja, de, hi } as Record<Locale, Messages>

export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages[defaultLocale]
}

// 2026-07-16 23:30 修复: 加全 10 语言 localeInfo (之前只有 en/zh, 导致 LanguageSwitcher BUG URL)
export const localeInfo: Record<Locale, { nativeName: string; englishName: string; currency: string }> = {
  en: { nativeName: 'English', englishName: 'English', currency: 'USD' },
  zh: { nativeName: '中文', englishName: 'Chinese', currency: 'CNY' },
  es: { nativeName: 'Español', englishName: 'Spanish', currency: 'EUR' },
  ar: { nativeName: 'العربية', englishName: 'Arabic', currency: 'AED' },
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
