'use client'

import { useEffect, useRef, useState } from 'react'
import { type Locale, t } from '@/i18n'
import { trackGA4Event } from '@/components/Analytics'
import { detectContact, type ContactResult } from '@/lib/leadCapture'

// 频控存储键名（报告中同步写明）：
//  tg_lead_modal_shown_at  — 最近一次弹出/关闭的时间戳，14 天冷却期内不再弹
//  tg_lead_modal_submitted — 已成功提交留资，置 '1' 后永不再弹
const STORAGE_SHOWN_AT = 'tg_lead_modal_shown_at'
const STORAGE_SUBMITTED = 'tg_lead_modal_submitted'
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000
const DWELL_MS = 20000
const SCROLL_RATIO = 0.4

type Status = 'idle' | 'loading' | 'success' | 'error'

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* 私密模式下 localStorage 不可用，静默降级 */
  }
}

export default function LeadCaptureModal({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ContactResult | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [trigger, setTrigger] = useState('')
  const mountedAt = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const openedRef = useRef(false)
  const touchStartY = useRef<number | null>(null)

  const alreadySubmitted = () => readStorage(STORAGE_SUBMITTED) === '1'

  const inCooldown = () => {
    const ts = Number(readStorage(STORAGE_SHOWN_AT) || 0)
    return Number.isFinite(ts) && ts > 0 && Date.now() - ts < COOLDOWN_MS
  }

  const openModal = (reason: string) => {
    if (openedRef.current || open || alreadySubmitted() || inCooldown()) return
    openedRef.current = true
    // 填表时长从弹框出现时起算，避免触发快时被后端 MIN_FILL_MS 误判为脚本
    mountedAt.current = Date.now()
    setTrigger(reason)
    setOpen(true)
    writeStorage(STORAGE_SHOWN_AT, String(Date.now()))
    trackGA4Event('lead_show', { event_category: 'lead_capture', locale, trigger: reason })
  }

  const closeModal = (reason: 'manual' | 'esc' | 'swipe' | 'backdrop') => {
    if (!open) return
    setOpen(false)
    // 关闭同样写入冷却时间戳：14 天内不再弹
    writeStorage(STORAGE_SHOWN_AT, String(Date.now()))
    trackGA4Event('lead_close', { event_category: 'lead_capture', locale, close_method: reason })
  }

  // 触发条件：滚动过视口 40% / 停留 20 秒 / 桌面退出意图，先到即弹；
  // 绝不页面一打开就弹（规避 Google 对移动端 intrusive interstitial 的处罚）
  useEffect(() => {
    mountedAt.current = Date.now()

    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      if (total <= 0) return
      const ratio = window.scrollY / total
      if (ratio >= SCROLL_RATIO) openModal('scroll_40pct')
    }
    const dwellTimer = window.setTimeout(() => openModal('dwell_20s'), DWELL_MS)
    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) openModal('exit_intent')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onExitIntent)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onExitIntent)
      window.clearTimeout(dwellTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 打开后聚焦输入框、Esc 关闭、锁定背景滚动
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal('esc')
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onInput = (raw: string) => {
    setValue(raw)
    setStatus('idle')
    setResult(detectContact(raw, locale))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!result || result.kind === 'invalid') {
      setStatus('error')
      return
    }
    setStatus('loading')

    const payload = {
      name: result.kind === 'email' ? 'Email lead' : 'WhatsApp lead',
      email: result.email || '',
      phone: result.phone || '',
      products: 'lead_modal',
      locale,
      source: 'lead_modal',
      message: 'Lead captured from the website lead capture popup.',
      company: '',
      country: '',
      quantity: '',
      // 反滥用元数据：蜜罐留空 + 真实填表时长（与站内询盘表单同一套后端校验）
      _honeypot: '',
      _elapsed: mountedAt.current ? Date.now() - mountedAt.current : -1,
    }

    try {
      const res = await fetch('/api/inquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await res.json().catch(() => null)) as { delivered?: boolean } | null
      if (res.ok && body?.delivered !== false) {
        writeStorage(STORAGE_SUBMITTED, '1')
        setStatus('success')
        trackGA4Event('lead_submit', {
          event_category: 'lead_capture',
          locale,
          contact_kind: result.kind,
          trigger,
        })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  // 移动端下滑关闭抽屉
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current == null) return
    if (e.touches[0].clientY - touchStartY.current > 80) closeModal('swipe')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      {/* 移动端不压首屏：背景透明；桌面端居中卡片加半透明遮罩 */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => closeModal('backdrop')}
        className="absolute inset-0 bg-transparent md:bg-black/40"
      />
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className="relative w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-5 md:p-6 max-h-[70vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => closeModal('manual')}
          aria-label={t(locale, 'lead.close')}
          className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 text-lg"
        >
          ×
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">✅</div>
            <p className="font-semibold text-primary-900">{t(locale, 'lead.success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 id="lead-modal-title" className="text-lg md:text-xl font-bold text-primary-900 pr-8">
              {t(locale, 'lead.title')}
            </h2>
            <p className="text-sm text-gray-600">{t(locale, 'lead.desc')}</p>

            <div>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onInput(e.target.value)}
                placeholder={t(locale, 'lead.placeholder')}
                aria-label={t(locale, 'lead.placeholder')}
                autoComplete="off"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {/* 规范化结果回显给用户确认，提交时不悄悄改号 */}
              {result?.normalized && result.kind !== 'invalid' && (
                <p className="mt-2 text-sm text-gray-700">
                  {result.kind === 'email' ? '✉️' : '💬'} {result.normalized}
                </p>
              )}
              {result?.kind === 'whatsapp' && (
                <p className="mt-1 text-xs text-gray-500">{t(locale, 'lead.note')}</p>
              )}
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {t(locale, 'lead.error')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors disabled:opacity-50 text-base"
            >
              {status === 'loading' ? '...' : t(locale, 'lead.cta')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
