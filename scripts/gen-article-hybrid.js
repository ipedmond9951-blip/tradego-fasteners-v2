#!/usr/bin/env node
/**
 * Hybrid Article Generator (Template A or B + Optional LLM intro override)
 *
 * Usage:
 *   node scripts/gen-article-hybrid.js [topic_slug]
 *   node scripts/gen-article-hybrid.js [topic_slug] --intro "custom intro text EN|zh|es|..."
 *
 * Template selection logic:
 *   - Case Study, Industry Guide, Market Analysis → Template A (5 case studies)
 *   - Procurement Guide, Technical Guide, Reference Guide, Logistics Guide → Template B (specs+comparison+checklist)
 *   - Regional Supplier → falls back to Template A
 *
 * Output: content/articles/[slug].json
 *
 * After running, validate with:
 *   python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py content/articles/[slug].json
 */

const fs = require('fs');
const path = require('path');
const { buildCaseStudyTemplate } = require('../templates/template-a-case-study.js');
const { buildProcurementTemplate } = require('../templates/template-b-procurement.js');

const POOL_FILE = path.join(__dirname, 'seo-topic-pool.json');
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

// Parse args
const args = process.argv.slice(2);
const slug = args[0];
const introFlagIdx = args.indexOf('--intro');
const customIntro = introFlagIdx !== -1 ? args[introFlagIdx + 1] : null;

if (!slug) {
  console.error('Usage: node scripts/gen-article-hybrid.js <slug> [--intro "custom text"]');
  process.exit(1);
}

// Load pool
const pool = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));
const topic = pool.topics.find(t => t.slug === slug);

if (!topic) {
  console.error(`Slug "${slug}" not found in topic pool.`);
  console.error('Available slugs:', pool.topics.map(t => t.slug).join(', '));
  process.exit(1);
}

// Check if already generated
const outFile = path.join(ARTICLES_DIR, `${slug}.json`);
if (fs.existsSync(outFile)) {
  console.error(`File already exists: ${outFile}`);
  console.error('Delete it first or pick a different slug.');
  process.exit(1);
}

// Select template
const category = topic.category || 'Procurement Guide';
const templateA = ['Case Study', 'Industry Guide', 'Market Analysis', 'Regional Supplier'];
const templateB = ['Procurement Guide', 'Technical Guide', 'Reference Guide', 'Logistics Guide'];

let templateName;
let article;

if (templateA.includes(category)) {
  templateName = 'A (Case Study)';
  article = buildCaseStudyTemplate(topic, customIntro);
} else if (templateB.includes(category)) {
  templateName = 'B (Procurement Guide)';
  article = buildProcurementTemplate(topic, customIntro);
} else {
  console.warn(`Unknown category "${category}", defaulting to Template B`);
  templateName = 'B (Procurement Guide, default)';
  article = buildProcurementTemplate(topic, customIntro);
}

// Write file
fs.writeFileSync(outFile, JSON.stringify(article, null, 2), 'utf8');

const fileSize = fs.statSync(outFile).size;
console.log(`✅ Generated: ${slug}.json (${(fileSize / 1024).toFixed(1)} KB)`);
console.log(`   Template: ${templateName}`);
console.log(`   Category: ${category}`);
console.log(`   Region: ${topic.region || 'global'}`);
console.log(`   Sections: ${article.sections.length}`);
console.log(`   Custom intro: ${customIntro ? 'yes' : 'no'}`);
console.log(`   Next: python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py ${outFile}`);
console.log(`   Target: ≥ 90/100 (ideally 100/100 with intro fixup)`);
