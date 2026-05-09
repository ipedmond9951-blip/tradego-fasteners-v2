#!/usr/bin/env node
/**
 * Add Internal Links to Articles (Corrected v3)
 * Track offset as we replace from end to start
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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addLinksToText(text) {
  if (!text) return text;
  
  // Find all matches in original text with positions
  const matches = [];
  const originalText = text;
  
  for (const { keyword, url } of PRODUCT_KEYWORDS) {
    const escaped = escapeRegex(keyword);
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(originalText)) !== null) {
      // Check if match position is inside an existing <a> tag
      const beforeMatch = originalText.substring(0, match.index);
      const openTags = (beforeMatch.match(/<a[^>]*>/g) || []).length;
      const closeTags = (beforeMatch.match(/<\/a>/g) || []).length;
      
      if (openTags > closeTags) continue;
      
      // Check if inside href attribute
      const lastHrefStart = beforeMatch.lastIndexOf('href="');
      const lastHrefEnd = beforeMatch.lastIndexOf('"', lastHrefStart + 6);
      if (lastHrefStart > lastHrefEnd) continue;
      
      // Avoid exact duplicates
      const exists = matches.some(m => m.index === match.index && m.length === match[0].length);
      if (!exists) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          url
        });
      }
    }
  }
  
  // Sort by index descending (to replace from end to start)
  matches.sort((a, b) => b.index - a.index);
  
  // Apply replacements, tracking offset
  let offset = 0;
  for (const m of matches) {
    const link = `<a href="${m.url}" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">${m.text}</a>`;
    const actualIndex = m.index + offset;
    text = text.substring(0, actualIndex) + link + text.substring(actualIndex + m.length);
    offset += link.length - m.length;
  }
  
  return text;
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

// Reset articles first
const gitResetCmd = `git checkout 6ea8429 -- content/articles/`;
require('child_process').execSync(gitResetCmd, { cwd: path.join(__dirname, '..') });

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

console.log('🔗 TradeGo Internal Links Adder v3');
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
console.log('Results (showing modified articles):');
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
