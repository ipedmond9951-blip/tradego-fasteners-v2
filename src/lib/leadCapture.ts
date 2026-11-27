/**
 * LeadCaptureModal 联系方式识别 / 归一化纯函数模块。
 *
 * 这里刻意不依赖 React、不依赖 '@/i18n' 别名，保证可以被 node 直接 import 做纯函数自测
 * （scripts/test-lead-capture.mjs）。组件层只负责 UI 与提交。
 *
 * 识别规则：
 *  - 含 '@' → 邮箱，做小写归一化；格式不合法判 invalid。
 *  - 其余按手机号 / WhatsApp 处理：去空格、括号、连字符、点号；按 E.164 归一化。
 *  - 带 '+' 或 '00' 开头：保留用户给的国家码；'0' 开头按本地长途前缀剥离后补默认国家码；
 *    其余数字直接补默认国家码。
 *  - 默认国家码按站点 locale 猜（en 对应主力市场津巴布韦 +263；其余按语言区映射），
 *    但归一化结果必须回显给用户确认，不允许在提交时悄悄改号。
 */

export type ContactKind = 'email' | 'whatsapp' | 'invalid'

export interface ContactResult {
  kind: ContactKind
  /** 合法邮箱（小写），否则 null */
  email: string | null
  /** E.164 归一化后的手机号，否则 null */
  phone: string | null
  /** 回显给用户确认的规范化结果 */
  normalized: string | null
  /** invalid 时的机器可读原因 */
  reason: string | null
}

// locale → 默认国家码（无国家码的本地号码按此补）
// en 面向非洲采购商，主力市场津巴布韦；zh/hi/ja 等按语言区映射
const DEFAULT_COUNTRY_CODES: Record<string, string> = {
  en: '+263',
  zh: '+86',
  hi: '+91',
  ja: '+81',
  ar: '+971',
  es: '+34',
  fr: '+33',
  pt: '+351',
  ru: '+7',
  de: '+49',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// E.164：+ 后 8–15 位数字，首位非 0
const E164_RE = /^\+[1-9]\d{7,14}$/

export function defaultCountryCode(locale: string): string {
  return DEFAULT_COUNTRY_CODES[locale] || '+263'
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

/**
 * 归一化手机号为 E.164。返回 null 表示无法识别为合法号码。
 */
export function normalizePhone(raw: string, locale: string): string | null {
  const cleaned = raw.replace(/[^\d+]/g, '')
  if (!cleaned) return null

  let prefix = ''
  let digits = cleaned

  if (cleaned.startsWith('+')) {
    prefix = '+'
    digits = cleaned.slice(1)
  } else if (cleaned.startsWith('00')) {
    prefix = '+'
    digits = cleaned.slice(2)
  } else if (cleaned.startsWith('0')) {
    // 本地长途前缀（如 0771…），剥掉后补默认国家码
    prefix = defaultCountryCode(locale)
    digits = cleaned.slice(1)
  } else {
    prefix = defaultCountryCode(locale)
  }

  digits = digits.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) return null

  const candidate = prefix + digits
  return E164_RE.test(candidate) ? candidate : null
}

/**
 * 单输入框识别入口。
 */
export function detectContact(rawInput: string, locale: string): ContactResult {
  const raw = (rawInput || '').trim()
  if (!raw) {
    return { kind: 'invalid', email: null, phone: null, normalized: null, reason: 'empty' }
  }

  if (raw.includes('@')) {
    const email = raw.toLowerCase()
    if (isValidEmail(email)) {
      return { kind: 'email', email, phone: null, normalized: email, reason: null }
    }
    return { kind: 'invalid', email: null, phone: null, normalized: null, reason: 'bad_email' }
  }

  const phone = normalizePhone(raw, locale)
  if (phone) {
    return { kind: 'whatsapp', email: null, phone, normalized: phone, reason: null }
  }

  return { kind: 'invalid', email: null, phone: null, normalized: null, reason: 'unrecognized' }
}
