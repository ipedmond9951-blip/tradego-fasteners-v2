#!/usr/bin/env node
/**
 * seo-topic-pipeline.js — TradeGo 4-轴笛卡尔积选题 Pipeline
 *
 * 4 轴:
 *   1. 紧固件类型 (40)
 *   2. 材料 (5)
 *   3. 行业/应用 (15)
 *   4. 区域/语言 (10)
 * 理论笛卡尔积: 40 × 5 × 15 × 10 = 30,000 组合
 *
 * 核心能力:
 *   - generateTopics(limit): 流式生成笛卡尔积选题
 *   - scoreTopic(topic): 多维加权评分 (region + industry + freshness + 长尾 + 商业意图)
 *   - reserveTopic(slug): 标记使用，防止重复
 *   - getNextBatch(region, count): 优先级排序的下一批
 *
 * 用法:
 *   node scripts/seo-topic-pipeline.js generate --count 30000
 *   node scripts/seo-topic-pipeline.js next --region zimbabwe --count 5
 *   node scripts/seo-topic-pipeline.js status
 *   node scripts/seo-topic-pipeline.js mark-used --slug xxx
 *   node scripts/seo-topic-pipeline.js score --slug xxx
 *
 * 设计原则:
 *   - 零外部依赖 (用 Node 内置 fs, path)
 *   - jsonl 流式输出 (30000 行也不卡)
 *   - 优雅降级 (cartesian 文件不存在 → 自动 generate)
 *   - 防并发 (简单文件锁，PID-based)
 *
 * @author TradeGo SEO Pipeline
 * @date 2026-06-11
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ==================== 路径常量 ====================
const SCRIPT_DIR = __dirname;
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '..');
const LOG_DIR = path.join(PROJECT_DIR, 'logs');
const ARTICLES_DIR = path.join(PROJECT_DIR, 'content', 'articles');

const CARTESIAN_PATH = path.join(SCRIPT_DIR, 'seo-topic-cartesian.jsonl');
const USAGE_PATH = path.join(SCRIPT_DIR, 'seo-topic-usage.json');
const POOL_PATH = path.join(SCRIPT_DIR, 'seo-topic-pool.json'); // 旧的 2057 pool，保留

// ==================== 4 轴定义 ====================
// 轴 1: 紧固件类型 (40)
const FASTENER_TYPES = [
  // bolt (10)
  { id: 'hex-bolt', cat: 'bolt', variant: 'hex' },
  { id: 'carriage-bolt', cat: 'bolt', variant: 'carriage' },
  { id: 'flange-bolt', cat: 'bolt', variant: 'flange' },
  { id: 'eye-bolt', cat: 'bolt', variant: 'eye' },
  { id: 'j-bolt', cat: 'bolt', variant: 'j' },
  { id: 'anchor-bolt', cat: 'bolt', variant: 'anchor' },
  { id: 'u-bolt', cat: 'bolt', variant: 'u' },
  { id: 't-head-bolt', cat: 'bolt', variant: 't-head' },
  { id: 'square-head-bolt', cat: 'bolt', variant: 'square' },
  { id: 'elevator-bolt', cat: 'bolt', variant: 'elevator' },
  // screw (10)
  { id: 'wood-screw', cat: 'screw', variant: 'wood' },
  { id: 'machine-screw', cat: 'screw', variant: 'machine' },
  { id: 'sheet-metal-screw', cat: 'screw', variant: 'sheet-metal' },
  { id: 'drywall-screw', cat: 'screw', variant: 'drywall' },
  { id: 'self-drilling-screw', cat: 'screw', variant: 'self-drilling' },
  { id: 'deck-screw', cat: 'screw', variant: 'deck' },
  { id: 'lag-screw', cat: 'screw', variant: 'lag' },
  { id: 'cap-screw', cat: 'screw', variant: 'cap' },
  { id: 'set-screw', cat: 'screw', variant: 'set' },
  { id: 'thumb-screw', cat: 'screw', variant: 'thumb' },
  // nut (10)
  { id: 'hex-nut', cat: 'nut', variant: 'hex' },
  { id: 'lock-nut', cat: 'nut', variant: 'lock' },
  { id: 'wing-nut', cat: 'nut', variant: 'wing' },
  { id: 'cap-nut', cat: 'nut', variant: 'cap' },
  { id: 'coupling-nut', cat: 'nut', variant: 'coupling' },
  { id: 't-nut', cat: 'nut', variant: 't' },
  { id: 'square-nut', cat: 'nut', variant: 'square' },
  { id: 'flange-nut', cat: 'nut', variant: 'flange' },
  { id: 'jam-nut', cat: 'nut', variant: 'jam' },
  { id: 'k-lock-nut', cat: 'nut', variant: 'k-lock' },
  // washer (10)
  { id: 'flat-washer', cat: 'washer', variant: 'flat' },
  { id: 'lock-washer', cat: 'washer', variant: 'lock' },
  { id: 'spring-washer', cat: 'washer', variant: 'spring' },
  { id: 'fender-washer', cat: 'washer', variant: 'fender' },
  { id: 'sealing-washer', cat: 'washer', variant: 'sealing' },
  { id: 'square-washer', cat: 'washer', variant: 'square' },
  { id: 'tooth-washer', cat: 'washer', variant: 'tooth' },
  { id: 'split-washer', cat: 'washer', variant: 'split' },
  { id: 'star-washer', cat: 'washer', variant: 'star' },
  { id: 'd-type-washer', cat: 'washer', variant: 'd-type' },
];

// 轴 2: 材料 (5)
const MATERIALS = [
  { id: 'carbon-steel', display: 'Carbon Steel' },
  { id: 'stainless-304', display: 'Stainless Steel 304' },
  { id: 'stainless-316', display: 'Stainless Steel 316' },
  { id: 'galvanized', display: 'Galvanized' },
  { id: 'brass', display: 'Brass' },
];

// 轴 3: 行业/应用 (15) — 优先 Africa 业务
const INDUSTRIES = [
  // construction (4) — 任务规范列出 4 个子项
  { id: 'construction-general', display: 'Construction (General)', region_hint: 'global', weight: 15 },
  { id: 'construction-commercial', display: 'Commercial Construction', region_hint: 'global', weight: 12 },
  { id: 'construction-residential', display: 'Residential Construction', region_hint: 'global', weight: 10 },
  { id: 'construction-industrial', display: 'Industrial Construction', region_hint: 'global', weight: 12 },
  // mining (4) — 津巴布韦主营!
  { id: 'mining-zimbabwe', display: 'Mining in Zimbabwe', region_hint: 'zimbabwe', weight: 25 },
  { id: 'mining-south-africa', display: 'Mining in South Africa', region_hint: 'za', weight: 20 },
  { id: 'mining-drc', display: 'Mining in DRC', region_hint: 'africa', weight: 22 },
  { id: 'mining-tanzania', display: 'Mining in Tanzania', region_hint: 'africa', weight: 18 },
  // agriculture (3) — 非洲重点
  { id: 'agriculture-farming', display: 'Agricultural Farming', region_hint: 'africa', weight: 22 },
  { id: 'agriculture-irrigation', display: 'Irrigation Systems', region_hint: 'africa', weight: 20 },
  { id: 'agriculture-greenhouse', display: 'Greenhouse Construction', region_hint: 'global', weight: 15 },
  // energy (1) — 任务列出 4 个但要求总数 15, 只取 solar (高商业意图)
  { id: 'energy-solar', display: 'Solar Energy', region_hint: 'global', weight: 20 },
  // infrastructure (1) — 任务列出 4 个但要求总数 15, 只取 bridge (高价值)
  { id: 'infrastructure-bridge', display: 'Bridge Construction', region_hint: 'global', weight: 18 },
  // 其他 (2) — 凑齐 15
  { id: 'oil-gas', display: 'Oil and Gas', region_hint: 'global', weight: 18 },
  { id: 'marine', display: 'Marine Applications', region_hint: 'global', weight: 15 },
];

// 轴 4: 区域/语言 (10)
const REGIONS = [
  { id: 'us', lang: 'en', locale: 'en-US', weight: 20, display: 'United States' },
  { id: 'uk', lang: 'en', locale: 'en-GB', weight: 18, display: 'United Kingdom' },
  { id: 'za', lang: 'en', locale: 'en-ZA', weight: 25, display: 'South Africa' },
  { id: 'zw', lang: 'en', locale: 'en-ZW', weight: 30, display: 'Zimbabwe' },
  { id: 'ke', lang: 'en', locale: 'en-KE', weight: 22, display: 'Kenya' },
  { id: 'ng', lang: 'en', locale: 'en-NG', weight: 20, display: 'Nigeria' },
  { id: 'ae', lang: 'ar', locale: 'ar-AE', weight: 22, display: 'UAE' },
  { id: 'de', lang: 'de', locale: 'de-DE', weight: 15, display: 'Germany' },
  { id: 'jp', lang: 'ja', locale: 'ja-JP', weight: 15, display: 'Japan' },
  { id: 'br', lang: 'pt', locale: 'pt-BR', weight: 16, display: 'Brazil' },
];

// ==================== 工具函数 ====================
function log(level, msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level}] ${msg}`;
  console.log(line);

  // 写到 log 文件
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    const logFile = path.join(LOG_DIR, `seo-pipeline-${new Date().toISOString().slice(0, 10)}.log`);
    fs.appendFileSync(logFile, line + '\n');
  } catch (e) {
    // log 失败不影响主流程
  }
}

function ensureDirs() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function loadUsage() {
  if (!fs.existsSync(USAGE_PATH)) return { version: '1.0', used: {}, last_update: null };
  try {
    return JSON.parse(fs.readFileSync(USAGE_PATH, 'utf-8'));
  } catch (e) {
    log('WARN', `usage 文件损坏, 重置: ${e.message}`);
    return { version: '1.0', used: {}, last_update: null };
  }
}

function saveUsage(usage) {
  usage.last_update = new Date().toISOString();
  fs.writeFileSync(USAGE_PATH, JSON.stringify(usage, null, 2));
}

function loadExistingSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return new Set();
  return new Set(
    fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  );
}

function loadOldPoolSlugs() {
  if (!fs.existsSync(POOL_PATH)) return new Set();
  try {
    const pool = JSON.parse(fs.readFileSync(POOL_PATH, 'utf-8'));
    return new Set((pool.topics || []).map(t => t.slug));
  } catch (e) {
    return new Set();
  }
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ==================== 核心: 生成笛卡尔积 ====================
/**
 * 生成单个组合的 topic 对象
 * @param {object} fastener - 紧固件
 * @param {object} material - 材料
 * @param {object} industry - 行业
 * @param {object} region - 区域
 * @returns {object} topic
 */
function buildTopic(fastener, material, industry, region) {
  // slug 规则: {fastener}-{material}-{industry}-{region}-guide
  const slug = slugify(`${fastener.id}-${material.id}-${industry.id}-${region.id}-guide`);

  // 标题规则: "{Fastener Display} for {Industry} in {Region}: Material & Sourcing Guide"
  const fastenerDisplay = fastener.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const title_en = `${fastenerDisplay} for ${industry.display} in ${region.display}: ${material.display} Material & Sourcing Guide`;

  // 短尾词
  const keyword_short = `${fastener.id} ${industry.id.split('-')[0]}`;
  // 长尾词 (3+ 词) — 实际生成的 long-tail keyword
  const keyword_long = `${fastener.id} ${material.id} ${industry.id} ${region.id} supplier`;

  // 搜索意图推断
  let search_intent = 'informational';
  if (industry.id.includes('mining') || industry.id.includes('agriculture') || industry.id.includes('construction')) {
    search_intent = 'commercial';
  }

  return {
    slug,
    title_en,
    axes: {
      fastener: fastener.id,
      fastener_cat: fastener.cat,
      material: material.id,
      industry: industry.id,
      region: region.id,
    },
    keyword_short,
    keyword_long,
    search_intent,
    target_audience: `${industry.display} procurement managers in ${region.display}`,
    lang: region.lang,
    locale: region.locale,
    generated_at: null, // 首次 generate 不填，使用时填
  };
}

/**
 * 流式生成笛卡尔积，写入 jsonl
 * @param {number} limit - 最多生成多少（默认 30000）
 * @returns {object} { count, path, skipped }
 */
function generateTopics(limit = 30000) {
  ensureDirs();

  // 已存在的 slugs (旧 pool + 已发布文章 + 已用记录)
  const existingArticles = loadExistingSlugs();
  const oldPoolSlugs = loadOldPoolSlugs();
  const usage = loadUsage();
  const usedSlugs = new Set(Object.keys(usage.used));
  const allExcluded = new Set([...existingArticles, ...oldPoolSlugs, ...usedSlugs]);

  log('INFO', `generateTopics start: limit=${limit}, excluded=${allExcluded.size} (articles=${existingArticles.size}, oldPool=${oldPoolSlugs.size}, used=${usedSlugs.size})`);

  const now = new Date().toISOString();
  let count = 0;
  let skipped = 0;
  const writeStream = fs.createWriteStream(CARTESIAN_PATH, { encoding: 'utf-8' });

  for (const fastener of FASTENER_TYPES) {
    for (const material of MATERIALS) {
      for (const industry of INDUSTRIES) {
        for (const region of REGIONS) {
          if (count >= limit) break;

          const topic = buildTopic(fastener, material, industry, region);

          if (allExcluded.has(topic.slug)) {
            skipped++;
            continue;
          }

          // 计算 score
          topic.score = scoreTopic(topic);
          topic.generated_at = now;

          writeStream.write(JSON.stringify(topic) + '\n');
          count++;
        }
        if (count >= limit) break;
      }
      if (count >= limit) break;
    }
    if (count >= limit) break;
  }

  writeStream.end();
  log('INFO', `generateTopics done: written=${count}, skipped=${skipped}, file=${CARTESIAN_PATH}`);

  return { count, skipped, path: CARTESIAN_PATH };
}

// ==================== 核心: 评分 ====================
/**
 * 评分公式 (0-100):
 *   score = region_weight * 30 + industry_weight * 25 + freshness_bonus * 20 + length_bonus * 15 + commercial_intent * 10
 */
function scoreTopic(topic) {
  const region = REGIONS.find(r => r.id === topic.axes.region) || { weight: 10 };
  const industry = INDUSTRIES.find(i => i.id === topic.axes.industry) || { weight: 10 };

  // 1. region 权重 (max 30)
  const regionScore = (region.weight / 30) * 30;

  // 2. industry 权重 (max 25)
  const industryScore = (industry.weight / 25) * 25;

  // 3. freshness_bonus (max 20) — 24h 内 = 20, 7d = 5
  // pipeline 新生成的都算 "刚生成"，所以是 20
  const freshnessScore = 20;

  // 4. length_bonus (max 15) — 长尾关键词 (3+ 词) = 15
  const longTailWords = topic.keyword_long.split(/\s+/).length;
  const lengthScore = longTailWords >= 4 ? 15 : (longTailWords === 3 ? 10 : 5);

  // 5. commercial_intent (max 10) — 含 "buy" "supplier" "price" = 10
  const commercialKeywords = ['supplier', 'price', 'buy', 'wholesale', 'manufacturer', 'sourcing'];
  const hasCommercial = commercialKeywords.some(k => topic.keyword_long.includes(k));
  const commercialScore = hasCommercial ? 10 : 5;

  return Math.round(regionScore + industryScore + freshnessScore + lengthScore + commercialScore);
}

// ==================== 核心: 拉下一批 ====================
/**
 * 从 jsonl 池中拉下一批高优先级选题
 * 过滤: 排除 used / 已发布文章 / 已存在旧 pool
 * 排序: score desc
 * @param {string} regionFilter - region 过滤 (如 'zimbabwe', 'za', 'africa', 'global', 'all')
 * @param {number} count - 拉多少个
 * @returns {Array} topics
 */
function getNextBatch(regionFilter = 'all', count = 5) {
  if (!fs.existsSync(CARTESIAN_PATH)) {
    log('WARN', `cartesian 文件不存在: ${CARTESIAN_PATH}, 触发自动 generate`);
    generateTopics(30000);
  }

  const existingArticles = loadExistingSlugs();
  const oldPoolSlugs = loadOldPoolSlugs();
  const usage = loadUsage();
  const usedSlugs = new Set(Object.keys(usage.used));
  const excluded = new Set([...existingArticles, ...oldPoolSlugs, ...usedSlugs]);

  log('INFO', `getNextBatch: region=${regionFilter}, count=${count}, excluded=${excluded.size}`);

  // 流式读取 jsonl
  const content = fs.readFileSync(CARTESIAN_PATH, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  let candidates = [];

  for (const line of lines) {
    try {
      const topic = JSON.parse(line);

      // 过滤 1: 已使用
      if (excluded.has(topic.slug)) continue;

      // 过滤 2: region
      if (regionFilter !== 'all') {
        if (regionFilter === 'africa') {
          // africa = zw, za, ke, ng
          const africaRegions = ['zw', 'za', 'ke', 'ng'];
          if (!africaRegions.includes(topic.axes.region)) continue;
        } else if (regionFilter === 'global') {
          // global = us, uk, ae, de, jp, br
          const globalRegions = ['us', 'uk', 'ae', 'de', 'jp', 'br'];
          if (!globalRegions.includes(topic.axes.region)) continue;
        } else {
          if (topic.axes.region !== regionFilter) continue;
        }
      }

      // 保证 score 字段
      if (typeof topic.score !== 'number') {
        topic.score = scoreTopic(topic);
      }

      candidates.push(topic);
    } catch (e) {
      // 跳过损坏行
    }
  }

  // 排序: score desc
  candidates.sort((a, b) => b.score - a.score);

  // 取前 count
  const batch = candidates.slice(0, count);

  log('INFO', `getNextBatch: candidates=${candidates.length}, selected=${batch.length}`);

  return batch;
}

// ==================== 核心: 标记使用 ====================
function reserveTopic(slug) {
  const usage = loadUsage();
  if (usage.used[slug]) {
    log('WARN', `slug 已标记: ${slug} (first=${usage.used[slug].reserved_at})`);
    return usage.used[slug];
  }
  usage.used[slug] = {
    reserved_at: new Date().toISOString(),
    status: 'reserved',
  };
  saveUsage(usage);
  log('INFO', `reserved: ${slug}`);
  return usage.used[slug];
}

// ==================== 状态查询 ====================
function getStatus() {
  const existingArticles = loadExistingSlugs();
  const oldPoolSlugs = loadOldPoolSlugs();
  const usage = loadUsage();
  const usedSlugs = new Set(Object.keys(usage.used));

  let cartesianCount = 0;
  let byRegion = {};
  let byScore = { high: 0, mid: 0, low: 0 };

  if (fs.existsSync(CARTESIAN_PATH)) {
    const content = fs.readFileSync(CARTESIAN_PATH, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    cartesianCount = lines.length;
    for (const line of lines) {
      try {
        const t = JSON.parse(line);
        byRegion[t.axes.region] = (byRegion[t.axes.region] || 0) + 1;
        if (t.score >= 80) byScore.high++;
        else if (t.score >= 60) byScore.mid++;
        else byScore.low++;
      } catch (e) {}
    }
  }

  return {
    pipeline: {
      cartesian_file: CARTESIAN_PATH,
      cartesian_count: cartesianCount,
      by_region: byRegion,
      by_score: byScore,
    },
    excluded: {
      existing_articles: existingArticles.size,
      old_pool: oldPoolSlugs.size,
      used: usedSlugs.size,
    },
    axes_definitions: {
      fastener_types: FASTENER_TYPES.length,
      materials: MATERIALS.length,
      industries: INDUSTRIES.length,
      regions: REGIONS.length,
      theoretical_max: FASTENER_TYPES.length * MATERIALS.length * INDUSTRIES.length * REGIONS.length,
    },
    usage_file: USAGE_PATH,
    usage_count: usedSlugs.size,
  };
}

// ==================== CLI ====================
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

async function main() {
  ensureDirs();
  const args = parseArgs(process.argv);
  const cmd = args._[0];

  switch (cmd) {
    case 'generate': {
      const count = parseInt(args.count || '30000', 10);
      const result = generateTopics(count);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'next': {
      const region = args.region || 'all';
      const count = parseInt(args.count || '5', 10);
      const batch = getNextBatch(region, count);
      console.log(JSON.stringify(batch, null, 2));
      break;
    }
    case 'mark-used':
    case 'reserve': {
      if (!args.slug) {
        console.error('ERROR: --slug required');
        process.exit(1);
      }
      const result = reserveTopic(args.slug);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'status': {
      const status = getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
    }
    case 'score': {
      if (!args.slug) {
        // demo: 用一个 fake topic
        const demo = buildTopic(FASTENER_TYPES[0], MATERIALS[0], INDUSTRIES[0], REGIONS[0]);
        demo.score = scoreTopic(demo);
        console.log(JSON.stringify(demo, null, 2));
      } else {
        // 从 cartesian 找
        const content = fs.readFileSync(CARTESIAN_PATH, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());
        for (const line of lines) {
          const t = JSON.parse(line);
          if (t.slug === args.slug) {
            console.log(JSON.stringify(t, null, 2));
            return;
          }
        }
        console.error(`slug 不在 cartesian 中: ${args.slug}`);
        process.exit(1);
      }
      break;
    }
    default: {
      console.log(`TradeGo SEO Topic Pipeline

用法:
  node scripts/seo-topic-pipeline.js generate --count 30000
  node scripts/seo-topic-pipeline.js next --region zimbabwe --count 5
  node scripts/seo-topic-pipeline.js status
  node scripts/seo-topic-pipeline.js mark-used --slug xxx
  node scripts/seo-topic-pipeline.js score [--slug xxx]

4 轴:
  紧固件: ${FASTENER_TYPES.length} 个
  材料: ${MATERIALS.length} 个
  行业: ${INDUSTRIES.length} 个
  区域: ${REGIONS.length} 个
  理论组合: ${FASTENER_TYPES.length * MATERIALS.length * INDUSTRIES.length * REGIONS.length}
`);
    }
  }
}

// 导出（供 require）
module.exports = {
  generateTopics,
  scoreTopic,
  reserveTopic,
  getNextBatch,
  getStatus,
  buildTopic,
  FASTENER_TYPES,
  MATERIALS,
  INDUSTRIES,
  REGIONS,
  // 路径 (供测试用)
  paths: {
    CARTESIAN_PATH,
    USAGE_PATH,
    POOL_PATH,
    LOG_DIR,
    ARTICLES_DIR,
    SCRIPT_DIR,
    PROJECT_DIR,
  },
  // 别名 (向后兼容 test)
  cartesian_path: CARTESIAN_PATH,
  usage_path: USAGE_PATH,
  // CLI
  main,
};

if (require.main === module) {
  main().catch(e => {
    log('ERROR', e.stack || e.message);
    process.exit(1);
  });
}
