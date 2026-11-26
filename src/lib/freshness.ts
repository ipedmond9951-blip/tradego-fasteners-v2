import fs from 'fs'
import path from 'path'

/**
 * 文章新鲜度缓存的构建期读取层。
 *
 * 数据源是 scripts/content-freshness.py 生成的 content/freshness.json：
 *  - published: 校正后的发布日（min(JSON date, 首次落库提交日)，只许往早）
 *  - modified:  真实更新日（git 最后提交与 JSON updated/updatedDate 取较晚者）
 *
 * 页面 schema 与 sitemap 都从这里取日期，不允许各自再写一套 git/JSON 取数逻辑。
 * 缓存缺失或字段为空时返回 null，调用方按原有 JSON 字段兜底。
 */
export interface FreshnessEntry {
  published: string | null
  modified: string | null
  unknown?: boolean
}

const CACHE_PATH = path.join(process.cwd(), 'content', 'freshness.json')

let cache: Record<string, FreshnessEntry> | null = null

function loadCache(): Record<string, FreshnessEntry> {
  if (cache) return cache
  try {
    const payload = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) as {
      articles?: Record<string, FreshnessEntry>
    }
    cache = payload.articles || {}
  } catch {
    cache = {}
  }
  return cache
}

export function getFreshness(slug: string): FreshnessEntry | null {
  const entry = loadCache()[slug]
  return entry || null
}

/**
 * 归一化后的文章日期对：保证 modified ≥ published。
 * 任一缺失时回退到调用方传入的 JSON 原值（rawPublished / rawModified）。
 */
export function resolveArticleDates(
  slug: string,
  rawPublished: string,
  rawModified?: string,
): { published: string; modified: string } {
  const fresh = getFreshness(slug)
  const published = fresh?.published || rawPublished
  let modified = fresh?.modified || rawModified || published
  if (modified < published) modified = published
  return { published, modified }
}
