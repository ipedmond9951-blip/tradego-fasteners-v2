// 站内搜索共享口径：归一化 / 分词 / 打分。
// 纯函数、无 Node 依赖，客户端组件与构建脚本/测试脚本共用同一套规则，
// 保证索引侧与查询侧的分词结果一致。
//
// 口径（与需求逐条对应）：
// - 拉丁语系：空白/标点切分 + 小写 + 去重音 + 简单复数归并；
// - 中文 / 日文 / 韩文：无空格语言，做字符 bigram（同时保留单字 unigram，兼容单字查询）；
// - 阿拉伯语：أ إ آ ٱ → ا，去除 tatweel ـ 与变音符号，ة → ه，ى → ي；
// - 排序权重：标题命中 > keywords > 描述；同分产品优先于文章。

export type SearchType = 'product' | 'article' | 'guide'

export interface SearchEntry {
  slug: string
  type: SearchType
  title: string
  metaDescription: string
  keywords: string
  category: string
  image: string
}

/** 由条目类型推导站内路径（索引里不存 URL，省一份重复字段） */
export function entryUrl(entry: SearchEntry, locale: string): string {
  const path = entry.type === 'product' ? 'products' : 'industry'
  return `/${locale}/${path}/${encodeURIComponent(entry.slug)}/`
}

export interface SearchIndex {
  locale: string
  entries: SearchEntry[]
}

const CJK_RUN_RE =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]+/g

const ARABIC_MAP: Record<string, string> = {
  أ: 'ا',
  إ: 'ا',
  آ: 'ا',
  ٱ: 'ا',
  ة: 'ه',
  ى: 'ي',
}

/** 小写 + 去变音/重音 + 阿拉伯字符归一化 */
export function normalizeText(raw: string): string {
  let s = String(raw || '').toLowerCase()
  // 阿拉伯 tatweel 与常见变音符号先剔除
  s = s.replace(/[ـًٌٍَُِّْٰۭ]/g, '')
  // Unicode NFD 后去掉组合重音（拉丁语系去重音 + 阿拉伯残余变音）
  s = s.normalize('NFD').replace(/\p{M}/gu, '')
  s = s.replace(/[أإآٱةى]/g, (ch) => ARABIC_MAP[ch] || ch)
  return s
}

/** 拉丁语简单复数归并：screws→screw，nails→nail，bolts→bolt，categories→category */
function stemLatin(token: string): string {
  if (token.length <= 3) return token
  if (token.endsWith('ies') && token.length > 4) return token.slice(0, -3) + 'y'
  if (/(s|x|z|ch|sh)es$/.test(token)) return token.slice(0, -2)
  if (token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1)
  return token
}

/** 把一段文本切成可匹配的 token 集合（去重） */
export function tokenize(raw: string): string[] {
  const norm = normalizeText(raw)
  const tokens = new Set<string>()

  // 1) 中日韩字符段：bigram + 单字
  const cjkRuns = norm.match(CJK_RUN_RE) || []
  for (const run of cjkRuns) {
    for (let i = 0; i < run.length; i++) {
      tokens.add(run[i])
      if (i + 1 < run.length) tokens.add(run.slice(i, i + 2))
    }
  }
  // 去掉已被 CJK 段覆盖的字符，再按拉丁/其它字母数字切词
  const rest = norm.replace(CJK_RUN_RE, ' ')
  // 保留拉丁、西里尔、天城文、希伯来、阿拉伯字母段
  const words = rest.split(/[^a-z0-9\u0400-\u04ffऀ-ॿא-ת؀-ۿ]+/u).filter(Boolean)
  for (const w of words) {
    if (/^[0-9]+$/.test(w)) {
      tokens.add(w)
      continue
    }
    if (w.length < 2) continue
    tokens.add(stemLatin(w))
  }
  return Array.from(tokens)
}

interface ScoredEntry {
  entry: SearchEntry
  score: number
}

const TYPE_RANK: Record<SearchType, number> = { product: 0, guide: 1, article: 2 }

function entryTokens(entry: SearchEntry): { title: Set<string>; keywords: Set<string>; desc: Set<string> } {
  return {
    title: new Set(tokenize(entry.title)),
    keywords: new Set(tokenize(entry.keywords)),
    desc: new Set(tokenize(entry.metaDescription)),
  }
}

/** 单条打分：标题 5 / keywords 3 / 描述 1；0 表示无命中 */
export function scoreEntry(entry: SearchEntry, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0
  const sets = entryTokens(entry)
  let score = 0
  for (const q of queryTokens) {
    if (sets.title.has(q)) score += 5
    else if (sets.keywords.has(q)) score += 3
    else if (sets.desc.has(q)) score += 1
  }
  return score
}

/** 过滤 + 排序：分数降序，同分产品 > guide > 文章 */
export function runSearch(entries: SearchEntry[], query: string): ScoredEntry[] {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return []
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, queryTokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return TYPE_RANK[a.entry.type] - TYPE_RANK[b.entry.type]
    })
}

// ---- 索引懒加载（公共目录静态 JSON，运行期 fetch，不打进首屏 bundle）----
const indexCache = new Map<string, Promise<SearchIndex>>()

/** 首次调用才请求 /search/{locale}.json；同语种 Promise 复用，避免重复下载。 */
export function loadSearchIndex(locale: string): Promise<SearchIndex> {
  const cached = indexCache.get(locale)
  if (cached) return cached
  const promise = fetch(`/search/${locale}.json`).then((r) => {
    if (!r.ok) throw new Error(`search index ${locale} failed: ${r.status}`)
    return r.json() as Promise<SearchIndex>
  })
  indexCache.set(locale, promise)
  return promise
}

/** 高亮：把命中的 query 词包成 <mark>（客户端渲染用） */
export function highlightParts(text: string, query: string): Array<{ text: string; hit: boolean }> {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return [{ text, hit: false }]
  // 按长度倒序，避免短词先截断长词
  const sorted = [...queryTokens].sort((a, b) => b.length - a.length)
  const parts: Array<{ text: string; hit: boolean }> = []
  let i = 0
  while (i < text.length) {
    let matched: string | null = null
    for (const tok of sorted) {
      if (tok.length === 0) continue
      const slice = text.slice(i, i + tok.length)
      if (normalizeText(slice) === tok) {
        matched = slice
        break
      }
    }
    if (matched) {
      parts.push({ text: matched, hit: true })
      i += matched.length
    } else {
      const next = parts[parts.length - 1]
      if (next && !next.hit) next.text += text[i]
      else parts.push({ text: text[i], hit: false })
      i += 1
    }
  }
  return parts
}
