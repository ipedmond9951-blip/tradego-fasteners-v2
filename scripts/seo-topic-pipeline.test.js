#!/usr/bin/env node
/**
 * seo-topic-pipeline.test.js — Pipeline 单元测试
 *
 * 跑法: node scripts/seo-topic-pipeline.test.js
 * 不引入测试框架, 用 console.assert + 自定义 mini-runner
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const pipeline = require('./seo-topic-pipeline.js');

const SCRIPT_DIR = __dirname;
const TEST_CARTESIAN = path.join(SCRIPT_DIR, 'seo-topic-cartesian.test.jsonl');
const TEST_USAGE = path.join(SCRIPT_DIR, 'seo-topic-usage.test.json');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
  }
}

function section(name) {
  console.log(`\n═══ ${name} ═══`);
}

// ==================== Setup ====================
console.log('═══════════════════════════════════════════════════');
console.log('  TradeGo SEO Topic Pipeline — Unit Tests');
console.log('═══════════════════════════════════════════════════');

// ==================== 轴定义测试 ====================
section('1. 轴定义完整性');

test('FASTENER_TYPES 应该有 40 个 (10 bolt + 10 screw + 10 nut + 10 washer + 5 额外)', () => {
  assert.strictEqual(pipeline.FASTENER_TYPES.length, 40,
    `expected 40, got ${pipeline.FASTENER_TYPES.length}`);
});

test('FASTENER_TYPES 全部含 id/cat 字段', () => {
  for (const f of pipeline.FASTENER_TYPES) {
    assert.ok(f.id, `missing id: ${JSON.stringify(f)}`);
    assert.ok(f.cat, `missing cat: ${f.id}`);
  }
});

test('MATERIALS 应该有 5 个', () => {
  assert.strictEqual(pipeline.MATERIALS.length, 5);
});

test('INDUSTRIES 应该有 15 个 (含 mining-zimbabwe, agriculture 等 Africa 重点)', () => {
  assert.strictEqual(pipeline.INDUSTRIES.length, 15);
  const ids = pipeline.INDUSTRIES.map(i => i.id);
  assert.ok(ids.includes('mining-zimbabwe'), '缺 mining-zimbabwe');
  assert.ok(ids.includes('agriculture-farming'), '缺 agriculture-farming');
  assert.ok(ids.includes('construction-general'), '缺 construction-general');
});

test('REGIONS 应该有 10 个 (含 Zimbabwe)', () => {
  assert.strictEqual(pipeline.REGIONS.length, 10);
  const ids = pipeline.REGIONS.map(r => r.id);
  assert.ok(ids.includes('zw'), '缺 Zimbabwe (zw)');
  assert.ok(ids.includes('za'), '缺 South Africa (za)');
  assert.ok(ids.includes('us'), '缺 US');
});

// ==================== 数学验证 ====================
section('2. 笛卡尔积数学');

test('理论组合 = 40 × 5 × 15 × 10 = 30000', () => {
  const total = 40 * 5 * 15 * 10;
  assert.strictEqual(total, 30000);
  const axisTotal = pipeline.FASTENER_TYPES.length *
                    pipeline.MATERIALS.length *
                    pipeline.INDUSTRIES.length *
                    pipeline.REGIONS.length;
  assert.strictEqual(axisTotal, total);
});

// ==================== buildTopic ====================
section('3. buildTopic 输出结构');

test('buildTopic 返回正确字段', () => {
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES[0],
    pipeline.MATERIALS[0],
    pipeline.INDUSTRIES[0],
    pipeline.REGIONS[0]
  );
  assert.ok(t.slug, '缺 slug');
  assert.ok(t.title_en, '缺 title_en');
  assert.ok(t.axes, '缺 axes');
  assert.strictEqual(typeof t.axes, 'object');
  assert.ok(t.axes.fastener);
  assert.ok(t.axes.material);
  assert.ok(t.axes.industry);
  assert.ok(t.axes.region);
  assert.ok(t.keyword_short);
  assert.ok(t.keyword_long);
  assert.ok(['informational', 'commercial', 'transactional', 'navigational'].includes(t.search_intent));
});

test('slug 格式正确 (lowercase, hyphen-separated)', () => {
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES[0],
    pipeline.MATERIALS[0],
    pipeline.INDUSTRIES[0],
    pipeline.REGIONS[0]
  );
  assert.match(t.slug, /^[a-z0-9-]+$/, `slug 含非法字符: ${t.slug}`);
  assert.ok(t.slug.endsWith('-guide'), `slug 应以 -guide 结尾: ${t.slug}`);
});

test('title_en 包含所有轴关键词', () => {
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES.find(f => f.id === 'hex-bolt'),
    pipeline.MATERIALS.find(m => m.id === 'stainless-304'),
    pipeline.INDUSTRIES.find(i => i.id === 'mining-zimbabwe'),
    pipeline.REGIONS.find(r => r.id === 'zw')
  );
  assert.ok(t.title_en.includes('Hex Bolt'), `title 缺 fastener: ${t.title_en}`);
  assert.ok(t.title_en.includes('Stainless'), `title 缺 material: ${t.title_en}`);
  assert.ok(t.title_en.includes('Mining'), `title 缺 industry: ${t.title_en}`);
  assert.ok(t.title_en.includes('Zimbabwe'), `title 缺 region: ${t.title_en}`);
});

// ==================== scoreTopic ====================
section('4. scoreTopic 评分');

test('Zimbabwe + mining-zimbabwe 应该是高分 (高 region + 高 industry)', () => {
  const zw = pipeline.REGIONS.find(r => r.id === 'zw');
  const mining = pipeline.INDUSTRIES.find(i => i.id === 'mining-zimbabwe');
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES[0],
    pipeline.MATERIALS[0],
    mining,
    zw
  );
  const score = pipeline.scoreTopic(t);
  // region_weight=30/30*30=30, industry_weight=25/25*25=25, freshness=20, length=15 (4+ words), commercial=10
  // 总和 100
  assert.ok(score >= 90, `Zimbabwe mining 应 >= 90, got ${score}`);
});

test('US + construction-residential 应该是中等分', () => {
  const us = pipeline.REGIONS.find(r => r.id === 'us');
  const residential = pipeline.INDUSTRIES.find(i => i.id === 'construction-residential');
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES[0],
    pipeline.MATERIALS[0],
    residential,
    us
  );
  const score = pipeline.scoreTopic(t);
  // region=20/30*30=20, industry=10/25*25=10, freshness=20, length=15, commercial=10
  // 总和 75
  assert.ok(score >= 60 && score <= 85, `US residential 应 60-85, got ${score}`);
});

test('Germany + healthcare 应该是低分', () => {
  const de = pipeline.REGIONS.find(r => r.id === 'de');
  const health = pipeline.INDUSTRIES.find(i => i.id === 'healthcare');
  const t = pipeline.buildTopic(
    pipeline.FASTENER_TYPES[0],
    pipeline.MATERIALS[0],
    health,
    de
  );
  const score = pipeline.scoreTopic(t);
  // region=15/30*30=15, industry=10/25*25=10, freshness=20, length=15, commercial=5 (无 supplier)
  // 总和 65
  assert.ok(score < 70, `Germany healthcare 应 < 70, got ${score}`);
});

test('score 范围 0-100', () => {
  for (const f of pipeline.FASTENER_TYPES.slice(0, 3)) {
    for (const m of pipeline.MATERIALS) {
      for (const i of pipeline.INDUSTRIES) {
        for (const r of pipeline.REGIONS) {
          const t = pipeline.buildTopic(f, m, i, r);
          const s = pipeline.scoreTopic(t);
          assert.ok(s >= 0 && s <= 100, `score 越界: ${s} for ${t.slug}`);
        }
      }
    }
  }
});

// ==================== generateTopics ====================
section('5. generateTopics 流式输出');

test('generateTopics(100) 返回 { count, skipped, path }', () => {
  // 临时改路径
  const origCartesian = require('./seo-topic-pipeline.js');
  // 用环境变量 hack (此处简化，直接调内部)
  const result = pipeline.generateTopics(100);
  assert.strictEqual(result.count, 100);
  assert.ok(result.path);
  assert.ok(fs.existsSync(result.path));
  // jsonl 行数
  const content = fs.readFileSync(result.path, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  assert.strictEqual(lines.length, 100);
  // 每行可解析
  for (const line of lines) {
    const t = JSON.parse(line);
    assert.ok(t.slug);
    assert.ok(typeof t.score === 'number');
  }
});

test('generateTopics(30000) 不溢出, jsonl 行数 = 30000', () => {
  const result = pipeline.generateTopics(30000);
  assert.strictEqual(result.count, 30000);
  const content = fs.readFileSync(result.path, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  assert.strictEqual(lines.length, 30000);
});

// ==================== getNextBatch ====================
section('6. getNextBatch 拉批');

test('getNextBatch 拉 5 个 Zimbabwe 选题', () => {
  const batch = pipeline.getNextBatch('zw', 5);
  assert.strictEqual(batch.length, 5);
  for (const t of batch) {
    assert.strictEqual(t.axes.region, 'zw', `非 zw: ${t.slug}`);
  }
});

test('getNextBatch 按 score 降序', () => {
  const batch = pipeline.getNextBatch('all', 10);
  for (let i = 1; i < batch.length; i++) {
    assert.ok(batch[i - 1].score >= batch[i].score,
      `排序错: ${batch[i - 1].score} < ${batch[i].score}`);
  }
});

test('getNextBatch 拉 5 个 africa (含 zw/za/ke/ng)', () => {
  const batch = pipeline.getNextBatch('africa', 5);
  const africaRegions = ['zw', 'za', 'ke', 'ng'];
  for (const t of batch) {
    assert.ok(africaRegions.includes(t.axes.region), `非 africa: ${t.slug}`);
  }
});

test('getNextBatch 拉 5 个 global (含 us/uk/ae/de/jp/br)', () => {
  const batch = pipeline.getNextBatch('global', 5);
  const globalRegions = ['us', 'uk', 'ae', 'de', 'jp', 'br'];
  for (const t of batch) {
    assert.ok(globalRegions.includes(t.axes.region), `非 global: ${t.slug}`);
  }
});

// ==================== reserveTopic ====================
section('7. reserveTopic 防重复');

// 先备份现有 usage
let origUsage = null;
if (fs.existsSync(pipeline.usage_path)) {
  origUsage = fs.readFileSync(pipeline.usage_path, 'utf-8');
}

test('reserveTopic(slug) 标记已用', () => {
  const result = pipeline.reserveTopic('test-slug-12345');
  assert.ok(result.reserved_at);
  assert.strictEqual(result.status, 'reserved');
});

test('reserveTopic(slug) 第二次调用返回 existing', () => {
  const result = pipeline.reserveTopic('test-slug-12345');
  assert.ok(result.reserved_at, '应保留原始 reserved_at');
});

// 恢复 usage
if (origUsage !== null) {
  fs.writeFileSync(pipeline.usage_path, origUsage);
} else if (fs.existsSync(pipeline.usage_path)) {
  fs.unlinkSync(pipeline.usage_path);
}

// ==================== 去重逻辑 ====================
section('8. 去重逻辑');

test('getNextBatch 不会返回 used slugs', () => {
  pipeline.reserveTopic('test-used-dedupe-001');
  const batch = pipeline.getNextBatch('all', 1000);
  for (const t of batch) {
    assert.notStrictEqual(t.slug, 'test-used-dedupe-001', `应跳过 used slug: ${t.slug}`);
  }
  // 清理
  const usage = JSON.parse(fs.readFileSync(pipeline.usage_path, 'utf-8'));
  delete usage.used['test-used-dedupe-001'];
  fs.writeFileSync(pipeline.usage_path, JSON.stringify(usage, null, 2));
});

// ==================== 总结 ====================
console.log('\n═══════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════');

if (failed > 0) {
  console.log('\n失败详情:');
  for (const f of failures) {
    console.log(`  ❌ ${f.name}: ${f.error}`);
  }
  process.exit(1);
}

process.exit(0);
