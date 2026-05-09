#!/usr/bin/env node
/**
 * Fix corrupted anchor tags in articles
 * The previous script had a bug that created malformed HTML like:
 * <a href="...">text</a>ef="/products#...">moretext</a>
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

// Pattern to match corrupted anchor tags
// The corruption looks like: </a>ef="/products#...">text</a>
const CORRUPT_PATTERN = /<\/a>ef="[^"]*"[^>]*>/g;

function fixArticle(articlePath) {
  const content = fs.readFileSync(articlePath, 'utf8');
  const article = JSON.parse(content);
  
  let fixed = 0;
  
  // Fix sections
  if (article.sections) {
    for (let i = 0; i < article.sections.length; i++) {
      const section = article.sections[i];
      if (section.body && section.body.en) {
        const before = section.body.en;
        const after = before.replace(CORRUPT_PATTERN, '');
        if (before !== after) {
          article.sections[i].body.en = after;
          fixed++;
        }
      }
      if (section.body && section.body.zh) {
        const before = section.body.zh;
        const after = before.replace(CORRUPT_PATTERN, '');
        if (before !== after) {
          article.sections[i].body.zh = after;
          fixed++;
        }
      }
    }
  }
  
  // Fix description
  if (article.description && article.description.en) {
    const before = article.description.en;
    const after = before.replace(CORRUPT_PATTERN, '');
    if (before !== after) {
      article.description.en = after;
      fixed++;
    }
  }
  
  if (fixed > 0) {
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    return true;
  }
  return false;
}

// Process all articles
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
let fixed = 0;

for (const file of files) {
  if (fixArticle(path.join(ARTICLES_DIR, file))) {
    fixed++;
    console.log(`✅ Fixed: ${file}`);
  }
}

console.log(`\n📊 Fixed ${fixed}/${files.length} articles`);
