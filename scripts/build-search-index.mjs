// 站内搜索索引生成脚本（纯 node，无后端 / 无外部搜索服务）。
//
// 产物：public/search/{locale}.json，每语种一份。
// 条目字段：title / metaDescription / keywords / slug / type / category / image / url。
// 铁律：绝不把正文（sections）塞进索引——正文约 64MB，浏览器装不下。
// 带 redirectTo 的旧 slug 别名文章直接跳过。
//
// 运行：
//   node --experimental-strip-types scripts/build-search-index.mjs
// （Node 22 需要 strip-types 读取 src/lib 下的 TS 数据源；loader 桩见 search-index-loader.mjs）

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { register } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

register('./search-index-loader.mjs', import.meta.url)

const LOCALES = ['en', 'zh', 'es', 'ar', 'fr', 'pt', 'ru', 'ja', 'de', 'hi']
const FALLBACK_ARTICLE_IMAGE = '/images/og-image.webp'
const OUT_DIR = path.join(ROOT, 'public', 'search')

// 体积口径（只影响体积，不动召回/分词/排序逻辑）
// 说明：原始 <150KB 是硬目标；天城文/西里尔/阿拉伯/中日文为多字节编码，
// desc 若放到 140 字符会超标，故按实测压到 40 字符并在词边界收尾（desc 仅 1 分权重，
// 召回主靠 title/keywords）。可用 SEARCH_DESC_CAP 环境变量覆盖调参。
const DESC_CAP = Number(process.env.SEARCH_DESC_CAP || 40)
const TITLE_CAP = 90 // title 不动
const KEYWORD_MAX_TOKENS = 8
const KEYWORD_MAX_CHARS = 35
const KEYWORD_MAX_TOTAL = 70

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

/** 词边界截断：超限回退到最后一个空格，不留半个词 */
function truncateWord(s, n) {
  const str = String(s || '').replace(/\s+/g, ' ').trim()
  if (str.length <= n) return str
  const cut = str.slice(0, n)
  const lastSpace = cut.lastIndexOf(' ')
  const safe = lastSpace > Math.floor(n * 0.6) ? cut.slice(0, lastSpace) : cut
  return safe.trimEnd() + '…'
}

/** keywords：逗号拆分 → 大小写不敏感去重 → 单项 ≤40 字符 → 最多 12 个 → 总长 ≤120 字符 */
function normalizeKeywords(raw) {
  const seen = new Set()
  const out = []
  let total = 0
  for (const part of String(raw || '').split(',')) {
    const tok = part.trim().replace(/\s+/g, ' ')
    if (!tok || tok.length > KEYWORD_MAX_CHARS) continue
    const key = tok.toLowerCase()
    if (seen.has(key)) continue
    if (out.length > 0 && total + 2 + tok.length > KEYWORD_MAX_TOTAL) break
    seen.add(key)
    out.push(tok)
    total += (out.length > 1 ? 2 : 0) + tok.length
    if (out.length === KEYWORD_MAX_TOKENS) break
  }
  return out.join(', ')
}

function pickLocalized(dict, locale) {
  if (!dict) return ''
  return dict[locale] || dict.en || ''
}

function resolveImage(img) {
  if (!img) return FALLBACK_ARTICLE_IMAGE
  if (img.startsWith('http')) return img
  const abs = path.join(ROOT, 'public', img.replace(/^\//, ''))
  return fs.existsSync(abs) ? img : FALLBACK_ARTICLE_IMAGE
}

async function loadSources() {
  const [productsMod, i18nMod, catsMod, guidesMod] = await Promise.all([
    import(pathToFileURL(path.join(ROOT, 'src/lib/products.ts')).href),
    import(pathToFileURL(path.join(ROOT, 'src/lib/productI18n.ts')).href),
    import(pathToFileURL(path.join(ROOT, 'src/lib/productCategories.ts')).href),
    import(pathToFileURL(path.join(ROOT, 'src/lib/productGuides.ts')).href),
  ])
  return {
    allProducts: productsMod.allProducts,
    productNames: i18nMod.productNames,
    productDescriptions: i18nMod.productDescriptions,
    productCategories: catsMod.productCategories,
    productGuides: guidesMod.productGuides,
  }
}

function loadArticles() {
  const dir = path.join(ROOT, 'content', 'articles')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(dir, f)))
}

async function main() {
  const sourcesPromise = loadSources()
  const articles = loadArticles()
  const sources = await sourcesPromise

  // 产品 slug → 品类 key
  const slugToCategory = new Map()
  for (const cat of sources.productCategories) {
    for (const slug of cat.slugs || []) slugToCategory.set(slug, cat.key)
  }
  // 指南文章 slug 集合（productGuides 的值即文章 slug）
  const guideSlugs = new Set(Object.values(sources.productGuides))

  // 跳过 redirectTo 旧别名
  const indexableArticles = articles.filter((a) => !a.redirectTo)
  const skippedRedirect = articles.length - indexableArticles.length

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const summary = []

  for (const locale of LOCALES) {
    const entries = []

    // ---- 产品 ----
    for (const p of sources.allProducts) {
      const title = pickLocalized(sources.productNames[p.slug], locale)
        || pickLocalized(sources.productNames[p.slug], 'en')
        || p.slug
      const metaDescription = pickLocalized(sources.productDescriptions[p.slug], locale)
        || pickLocalized(sources.productDescriptions[p.slug], 'en')
      // keywords：英文品名 + 规格（标准/材质/表面处理）+ 前 3 条特征；
      // 应用场景不列，控制索引体积。语言中性规格词（HDG / DIN 933 等）保留。
      const kwTokens = [
        pickLocalized(sources.productNames[p.slug], 'en'),
        p.specs?.standard,
        p.specs?.material,
        p.specs?.finish,
      ].filter(Boolean)

      entries.push({
        slug: p.slug,
        type: 'product',
        title: truncateWord(title, TITLE_CAP),
        metaDescription: truncateWord(metaDescription, DESC_CAP),
        keywords: normalizeKeywords(kwTokens.join(', ')),
        category: slugToCategory.get(p.slug) || '',
        image: resolveImage(p.image),
      })
    }

    // ---- 文章 / 指南 ----
    for (const a of indexableArticles) {
      const title = a.title?.[locale] || a.title?.en || a.slug
      const metaDescription =
        a.metaDescription?.[locale] || a.description?.[locale] ||
        a.metaDescription?.en || a.description?.en || ''
      entries.push({
        slug: a.slug,
        type: guideSlugs.has(a.slug) ? 'guide' : 'article',
        title: truncateWord(title, TITLE_CAP),
        metaDescription: truncateWord(metaDescription, DESC_CAP),
        keywords: normalizeKeywords(a.keywords || ''),
        category: a.category || '',
        image: resolveImage(a.image),
      })
    }

    const payload = { locale, generatedAt: new Date().toISOString(), entries }
    const outFile = path.join(OUT_DIR, `${locale}.json`)
    fs.writeFileSync(outFile, JSON.stringify(payload))

    const bytes = fs.statSync(outFile).size
    const productCount = entries.filter((e) => e.type === 'product').length
    const guideCount = entries.filter((e) => e.type === 'guide').length
    const articleCount = entries.filter((e) => e.type === 'article').length
    summary.push({ locale, bytes, total: entries.length, productCount, guideCount, articleCount })
  }

  console.log('Search index built.')
  console.log(`articles total=${articles.length} skippedRedirect=${skippedRedirect} indexable=${indexableArticles.length}`)
  for (const s of summary) {
    console.log(
      `${s.locale}: ${s.bytes} bytes, entries=${s.total} (product=${s.productCount}, guide=${s.guideCount}, article=${s.articleCount})`
    )
  }
}

// ESM top-level await
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
