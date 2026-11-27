'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { type Locale, t } from '@/i18n'
import { categoryLabel } from '@/lib/categoryLabels'
import { optImagePath } from '@/lib/optImages'
import {
  loadSearchIndex,
  runSearch,
  entryUrl,
  highlightParts,
  type SearchEntry,
  type SearchIndex,
} from '@/lib/search'

interface SearchResultsProps {
  locale: Locale
}

const MAX_PER_GROUP = 10

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = highlightParts(text, query)
  return (
    <>
      {parts.map((part, i) =>
        part.hit ? (
          <mark key={i} className="bg-amber-100 text-inherit">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  )
}

function ResultCard({ entry, locale, query }: { entry: SearchEntry; locale: Locale; query: string }) {
  const href = entryUrl(entry, locale)
  // 文章分类走多语映射；产品分组标题已表达品类，不重复打英文 key 徽标
  const badge = entry.type !== 'product' && entry.category
    ? categoryLabel(entry.category, locale)
    : ''
  return (
    <Link
      href={href}
      className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={optImagePath(entry.image, 'thumb')}
          alt={entry.title}
          fill
          loading="lazy"
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-primary-900 md:text-base">
          <Highlighted text={entry.title} query={query} />
        </h3>
        {entry.metaDescription && (
          <p className="mb-1 line-clamp-2 text-xs text-gray-600 md:text-sm">
            <Highlighted text={entry.metaDescription} query={query} />
          </p>
        )}
        {badge && <span className="text-xs text-gray-400">{badge}</span>}
      </div>
    </Link>
  )
}

export default function SearchResults({ locale }: SearchResultsProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchIndex | null>(null)
  const [loadError, setLoadError] = useState(false)

  // q 纯客户端读取（window.location.search），页面壳保持 SSG，不依赖服务端注入 query
  // 用微任务异步落地，避免在 effect 体内同步 setState 触发级联渲染（react-hooks/set-state-in-effect）
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const next = params.get('q') ?? ''
    const timer = setTimeout(() => setQuery(next), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let cancelled = false
    loadSearchIndex(locale)
      .then((idx) => {
        if (!cancelled) setIndex(idx)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  const results = useMemo(() => {
    if (!index) return []
    return runSearch(index.entries, query)
  }, [index, query])

  const productHits = results.filter((r) => r.entry.type === 'product').slice(0, MAX_PER_GROUP)
  const articleHits = results
    .filter((r) => r.entry.type === 'article' || r.entry.type === 'guide')
    .slice(0, MAX_PER_GROUP)

  const trimmed = query.trim()
  const showEmpty = trimmed.length > 0 && index && results.length === 0

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          {t(locale, 'search.title')}
        </h1>

        <form
          method="get"
          action={`/${locale}/search/`}
          role="search"
          className="mx-auto mb-10 flex w-full max-w-xl items-center gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
        >
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        {loadError && (
          <p className="text-center text-sm text-gray-600">{t(locale, 'search.noResultsHint')}</p>
        )}

        {!index && !loadError && trimmed && (
          <p className="text-center text-sm text-gray-500">{t(locale, 'search.hint')}</p>
        )}

        {index && trimmed && (
          <p className="mb-6 text-center text-sm text-gray-600">
            {t(locale, 'search.resultsFor').replace('{q}', trimmed)}
          </p>
        )}

        {productHits.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-primary-900">{t(locale, 'search.groupProducts')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {productHits.map((r) => (
                <ResultCard key={r.entry.slug} entry={r.entry} locale={locale} query={trimmed} />
              ))}
            </div>
          </div>
        )}

        {articleHits.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-primary-900">{t(locale, 'search.groupArticles')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {articleHits.map((r) => (
                <ResultCard key={r.entry.slug} entry={r.entry} locale={locale} query={trimmed} />
              ))}
            </div>
          </div>
        )}

        {showEmpty && (
          <div className="mx-auto max-w-xl rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{t(locale, 'search.noResults')}</h2>
            <p className="mb-6 text-sm text-gray-600">{t(locale, 'search.noResultsHint')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/products/`}
                className="rounded-lg border border-primary-700 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-700 hover:text-white"
              >
                {t(locale, 'search.browseProducts')}
              </Link>
              <Link
                href={`/${locale}/#inquiry`}
                className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              >
                {t(locale, 'products.inquiry')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
