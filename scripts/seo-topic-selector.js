#!/usr/bin/env node
/**
 * SEO Article Topic Selector
 * 
 * 由 cron agent 在生成文章前调用, 获取今日 5 个选题
 * 输出: JSON 数组, 每个 topic 包含完整生成指令
 * 
 * Usage: node scripts/seo-topic-selector.js [count]
 */

const fs = require('fs');
const path = require('path');

const POOL_FILE = path.join(__dirname, 'seo-topic-pool.json');
const HISTORY_FILE = path.join(__dirname, '.seo-generator-history.json');
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

const count = parseInt(process.argv[2] || '5', 10);

// 加载选题池
const pool = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));

// 加载历史
let history = { generated: [] };
if (fs.existsSync(HISTORY_FILE)) {
  history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
}

// 加载现有文章
const existingArticles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

// 排除已生成
const recentSlugs = history.generated
  .filter(g => Date.now() - new Date(g.date).getTime() < 14 * 86400000)
  .map(g => g.slug);

// 排除已存在的文章 slug
const availableTopics = pool.topics.filter(t => 
  !recentSlugs.includes(t.slug) && !existingArticles.includes(t.slug)
);

// 类别平衡 + 优先未用过类别
const usedCategories = new Set();
const selected = [];

for (const topic of availableTopics) {
  if (selected.length >= count) break;
  if (!usedCategories.has(topic.category)) {
    selected.push(topic);
    usedCategories.add(topic.category);
  }
}

// 补齐
for (const topic of availableTopics) {
  if (selected.length >= count) break;
  if (!selected.find(t => t.slug === topic.slug)) {
    selected.push(topic);
  }
}

console.log(JSON.stringify({
  success: true,
  count: selected.length,
  topics: selected,
  instructions: {
    workflow: [
      "1. For each topic, use web_search to find 2-3 high-quality reference articles",
      "2. Use web_fetch to extract key information from references",
      "3. Synthesize and create original 10-language article with sections, FAQ, E-E-A-T, data sources, internal links",
      "4. Save to content/articles/[slug].json",
      "5. Validate with: python3 ~/.agents/skills/seo-universal-author/scripts/validate-article.py content/articles/[slug].json",
      "6. Target score: >= 90/100",
    ],
    quality_requirements: [
      "10 languages: en, zh, es, ar, fr, pt, ru, ja, de, hi (each with actual translated content)",
      "1500-2500 words English equivalent",
      "5-7 sections + 3-5 FAQ items",
      "Each section body 500-800 chars with 1-2 internal links",
      "Internal links format: <a href=\"/path\" class=\"text-primary-600 hover:text-primary-800 underline underline-offset-2\">anchor</a> (NOT nested)",
      "Real ISO/ASTM/DIN/GB standards with numbers",
      "Complete E-E-A-T author structure",
      "5 authoritative data sources (ISO.org, ASTM.org, trade.gov, etc.)",
      "Use TradeGo products: hex bolts, anchor bolts, concrete screws, etc.",
      "Target TradeGo markets: China-Africa B2B fastener export, African markets (Zimbabwe, Kenya, South Africa, etc.)",
    ],
    article_template: {
      slug: "kebab-case-slug",
      category: "Technical Guide | Industry Guide | Market Analysis | Regional Supplier | Reference Guide | Procurement Guide | Logistics Guide | Case Study",
      date: "YYYY-MM-DD (random within last 7 days)",
      readTime: 8,
      image: "/images/articles/[slug].jpg",
      title: "{10 languages}",
      description: "{10 languages, 155 chars}",
      keywords: "comma,separated,keywords,5-10",
      sections: [
        {
          id: "intro",
          heading: "{10 languages}",
          body: "{10 languages, 500-800 chars each, 1-2 internal links}"
        }
      ],
      faqItems: [
        {
          question: "{10 languages}",
          answer: "{10 languages, 200-300 chars each}"
        }
      ],
      dataSource: [
        { name: "ISO 898-1", url: "https://www.iso.org/standard/" }
      ],
      author: {
        name: "Chen Wei",
        title: "Senior Fastener Trade Analyst",
        bio: "12 years in China-Africa fastener trade",
        credentials: "ISO 9001 Lead Auditor, MSc Materials Engineering"
      },
      imageAlt: "{10 languages}",
      cta: {
        text: "{10 languages}",
        link: "/quote",
        buttonText: "{10 languages}"
      },
      relatedProducts: ["hex-bolts", "anchor-bolts"],
      relatedArticles: ["slug-of-related-article"],
    },
  },
}, null, 2));
