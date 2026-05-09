#!/usr/bin/env node
/**
 * Add Internal Links to Articles (v4)
 * Single pass: iterate through text, replacing keywords as we encounter them
 * Never modify string indices - always read original, write to result
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const LOCALE = 'en';

const PRODUCT_KEYWORDS = [
  { keyword: 'self-drilling screws', url: '/products#self-drilling-screws' },
  { keyword: 'self drilling screws', url: '/products#self-drilling-screws' },
  { keyword: 'self-drilling screw', url: '/products#self-drilling-screws' },
  { keyword: 'self drilling screw', url: '/products#self-drilling-screws' },
  { keyword: 'drywall screws', url: '/products#drywall-screws' },
  { keyword: 'drywall screw', url: '/products#drywall-screws' },
  { keyword: 'anchor bolts', url: '/products#anchor-bolts' },
  { keyword: 'anchor bolt', url: '/products#anchor-bolts' },
  { keyword: 'foundation bolts', url: '/products#anchor-bolts' },
  { keyword: 'foundation bolt', url: '/products#anchor-bolts' },
  { keyword: 'hex bolts', url: '/products#bolts-nuts' },
  { keyword: 'hex bolt', url: '/products#bolts-nuts' },
  { keyword: 'bolts and nuts', url: '/products#bolts-nuts' },
  { keyword: 'threaded rods', url: '/products#threaded-rods' },
  { keyword: 'threaded rod', url: '/products#threaded-rods' },
  { keyword: 'roofing nails', url: '/products#ibr-nails' },
  { keyword: 'roofing nail', url: '/products#ibr-nails' },
  { keyword: 'IBR nails', url: '/products#ibr-nails' },
  { keyword: 'IBR nail', url: '/products#ibr-nails' },
  { keyword: 'coach screws', url: '/products#coach-screws' },
  { keyword: 'coach screw', url: '/products#coach-screws' },
  { keyword: 'lag screws', url: '/products#coach-screws' },
  { keyword: 'lag screw', url: '/products#coach-screws' },
  { keyword: 'deck screws', url: '/products#coach-screws' },
  { keyword: 'deck screw', url: '/products#coach-screws' },
  { keyword: 'flat washers', url: '/products#washers' },
  { keyword: 'flat washer', url: '/products#washers' },
  { keyword: 'spring washers', url: '/products#washers' },
  { keyword: 'spring washer', url: '/products#washers' },
  { keyword: 'washers', url: '/products#washers' },
  { keyword: 'washer', url: '/products#washers' },
  { keyword: 'lock nuts', url: '/products#bolts-nuts' },
  { keyword: 'lock nut', url: '/products#bolts-nuts' },
  { keyword: 'nuts', url: '/products#bolts-nuts' },
  { keyword: 'bolts', url: '/products#bolts-nuts' },
  { keyword: 'tek screws', url: '/products#self-drilling-screws' },
  { keyword: 'tek screw', url: '/products#self-drilling-screws' },
  { keyword: 'self-tapping screws', url: '/products#self-drilling-screws' },
  { keyword: 'self-tapping screw', url: '/products#self-drilling-screws' },
  { keyword: 'fasteners', url: '/products' },
  { keyword: 'fastener', url: '/products' },
];

// Sort by length descending (longest match first)
PRODUCT_KEYWORDS.sort((a, b) => b.keyword.length - a.keyword.length);

function addLinksToText(text) {
  if (!text) return text;
  
  // Single pass: at each position, check if any keyword matches
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    // Skip existing HTML tags entirely
    if (text[i] === '<') {
      // Find the end of this tag
      const tagEnd = text.indexOf('>', i);
      if (tagEnd === -1) {
        result += text[i];
        i++;
        continue;
      }
      result += text.substring(i, tagEnd + 1);
      i = tagEnd + 1;
      continue;
    }
    
    // Check for keyword matches at this position
    let matched = false;
    for (const { keyword, url } of PRODUCT_KEYWORDS) {
      const substr = text.substring(i, i + keyword.length);
      if (substr.toLowerCase() === keyword.toLowerCase()) {
        // Check word boundary before
        if (i > 0) {
          const prev = text[i - 1];
          if (/[a-zA-Z0-9]/.test(prev)) {
            // Not a word boundary
            continue;
          }
        }
        // Check word boundary after
        const nextChar = text[i + keyword.length];
        if (nextChar && /[a-zA-Z0-9]/.test(nextChar)) {
          // Not a word boundary
          continue;
        }
        
        // Match! Add the link
        const link = `<a href="${url}" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">${substr}</a>`;
        result += link;
        i += keyword.length;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      result += text[i];
      i++;
    }
  }
  
  return result;
}

function processArticle(articlePath) {
  const content = fs.readFileSync(articlePath, 'utf8');
  const article = JSON.parse(content);
  
  let linksAdded = 0;
  let sectionsModified = 0;
  
  if (article.sections) {
    for (let i = 0; i < article.sections.length; i++) {
      const section = article.sections[i];
      if (section.body && section.body[LOCALE]) {
        const originalBody = section.body[LOCALE];
        const linkedBody = addLinksToText(originalBody);
        if (originalBody !== linkedBody) {
          article.sections[i].body[LOCALE] = linkedBody;
          linksAdded++;
          sectionsModified++;
        }
      }
    }
  }
  
  if (article.description && article.description[LOCALE]) {
    const originalDesc = article.description[LOCALE];
    const linkedDesc = addLinksToText(originalDesc);
    if (originalDesc !== linkedDesc) {
      article.description[LOCALE] = linkedDesc;
      linksAdded++;
    }
  }
  
  if (linksAdded > 0) {
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    return { success: true, linksAdded, sectionsModified };
  }
  
  return { success: false, linksAdded: 0, sectionsModified: 0 };
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

console.log('🔗 TradeGo Internal Links Adder v4');
console.log('==================================\n');
console.log(`Found ${files.length} articles\n`);

let totalModified = 0;
let totalLinks = 0;
const results = [];

for (const file of files) {
  const { success, linksAdded, sectionsModified } = processArticle(path.join(ARTICLES_DIR, file));
  if (success) {
    totalModified++;
    totalLinks += linksAdded;
    results.push({ file, linksAdded, sectionsModified, status: '✅' });
  } else {
    results.push({ file, linksAdded: 0, sectionsModified: 0, status: '⚪' });
  }
}

results.sort((a, b) => b.linksAdded - a.linksAdded);
console.log('Results (showing modified articles, top 25):');
console.log('-------------------------------------');
results.filter(r => r.linksAdded > 0).slice(0, 25).forEach(r => {
  console.log(`${r.status} ${r.file} - ${r.linksAdded} link(s) in ${r.sectionsModified} section(s)`);
});

const unmodified = results.filter(r => r.linksAdded === 0);
if (unmodified.length > 0) {
  console.log(`\n⚪ ${unmodified.length} articles had no matching keywords`);
}

console.log(`\n======================================`);
console.log(`📊 Summary:`);
console.log(`   Articles modified: ${totalModified}/${files.length}`);
console.log(`   Total links added: ${totalLinks}`);
