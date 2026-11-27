'use client'

import { useState } from 'react'
import { type Locale, t } from '@/i18n'
import { loadSearchIndex } from '@/lib/search'

interface ProductSearchBoxProps {
  locale: Locale
}

/**
 * 首页产品区上方的站内搜索框。
 * - 受控输入，回车或点按钮走原生 GET 表单，跳 /{locale}/search/?q=（trailingSlash 带尾斜杠）；
 * - 索引不在首屏加载：仅在聚焦或首次输入时懒加载对应语种 JSON（模块级 Promise 缓存）；
 * - 输入框字号 16px（text-base），避免 iOS 聚焦自动缩放。
 */
export default function ProductSearchBox({ locale }: ProductSearchBoxProps) {
  const [q, setQ] = useState('')

  // 聚焦 / 首次输入时预热索引；搜索结果页会复用同一份缓存 Promise。
  const warmUp = () => {
    void loadSearchIndex(locale)
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <form
        method="get"
        action={`/${locale}/search/`}
        role="search"
        className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
      >
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            warmUp()
          }}
          onFocus={warmUp}
          placeholder={t(locale, 'search.placeholder')}
          aria-label={t(locale, 'search.placeholder')}
          autoComplete="off"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary-700 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-primary-800"
        >
          {t(locale, 'search.button')}
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-gray-500">{t(locale, 'search.hint')}</p>
    </div>
  )
}
