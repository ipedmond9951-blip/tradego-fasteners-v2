'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tg_consent'

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(STORAGE_KEY) === 'granted'
  } catch {
    return false
  }
}

export default function CookieConsent({ locale }: { locale?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage 仅浏览器端可用，首屏不能出现横幅，必须在挂载后判断
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      /* localStorage 不可用时静默跳过 */
    }
  }, [])

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied')
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('tg-consent-change'))
    setVisible(false)
  }

  if (!visible) return null

  const isZh = locale === 'zh'
  const text = isZh
    ? '我们使用匿名统计了解网站使用情况，用于改进产品和内容。'
    : 'We use anonymous analytics to understand how the site is used, so we can improve it.'
  const acceptLabel = isZh ? '同意' : 'Accept'
  const declineLabel = isZh ? '仅必要' : 'Essential only'

  return (
    <div
      role="dialog"
      aria-label={isZh ? 'Cookie 提示' : 'Cookie notice'}
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        maxWidth: 520,
        margin: '0 auto',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
        padding: '14px 16px',
        fontSize: 13,
        lineHeight: 1.5,
        color: '#1f2937',
      }}
    >
      <p style={{ margin: '0 0 10px' }}>{text}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => decide(false)}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: '#fff',
            color: '#374151',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            border: '1px solid #0A3D62',
            background: '#0A3D62',
            color: '#fff',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  )
}
