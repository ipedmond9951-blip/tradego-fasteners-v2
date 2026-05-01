#!/usr/bin/env node
/**
 * Add Internal Links to Articles (Fixed Version)
 * Scans articles for product keywords and inserts links to product pages
 * Only works on text content, not inside HTML tag attributes
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const LOCALE = 'en'; // Primary locale for keyword matching

// Product keyword mapping: keywords → product URL suffix
// Sorted by length (longest first) to match more specific terms first
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

/**
 * Add internal links to text content only (not inside HTML tags)
 * Uses a single-pass approach to avoid nested HTML issues
 */
function addLinksToText(text) {
  if (!text) return text;
  
  // Find all matches with their positions first
  const matches = [];
  
  for (const { keyword, url } of PRODUCT_KEYWORDS) {
    const regex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Check if this match is inside an HTML tag attribute
      // by looking at the text before the match
      const beforeMatch = text.substring(0, match.index);
      const afterMatch = text.substring(match.index + match[0].length);
      
      // If we're inside an HTML tag (unclosed < before match and > after), skip
      const lastOpenTag = beforeMatch.lastIndexOf('<');
      const lastCloseTag = beforeMatch.lastIndexOf('>');
      
      if (lastOpenTag > lastCloseTag) {
        // We're inside a tag - check if it's inside an attribute value
        const afterOpen = beforeMatch.substring(lastOpenTag);
        if (!afterOpen.includes('>')) {
          // The tag is not closed yet - we're in an attribute
          continue;
        }
      }
      
      // Check if we're inside an href value
      const recentHref = beforeMatch.lastIndexOf('href="');
      const recentHrefClose = beforeMatch.lastIndexOf('"', recentHref + 6);
      if (recentHref > recentHrefClose) {
        // We're inside an href attribute value
        continue;
      }
      
      // Also check if the match itself looks like it's part of a tag
      const charBefore = beforeMatch.charAt(beforeMatch.length - 1);
      if (charBefore === '"' || charBefore === "'" || charBefore === '=') {
        continue;
      }
      
      // Check if this exact position is already linked
      // by checking if there's already an <a> tag starting at this position
      const alreadyLinked = matches.some(m => m.index === match.index);
      if (alreadyLinked) continue;
      
      matches.push({
        index: match.index,
        length: match[0].length,
        original: match[0],
        replacement: `<a href="${url}" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">${match[0]}</a>`
      });
    }
  }
  
  // Sort matches by index (descending) so we can replace from end to start
  matches.sort((a, b) => b.index - a.index);
  
  // Apply replacements
  let result = text;
  for (const m of matches) {
    result = result.substring(0, m.index) + m.replacement + result.substring(m.index + m.length);
  }
  
  return result;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processArticle(articlePath) {
  const content = fs.readFileSync(articlePath, 'utf8');
  const article = JSON.parse(content);
  
  let linksAdded = 0;
  let sectionsModified = 0;
  
  // Process each section's body text
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
  
  // Also process description if it contains product keywords
  if (article.description && article.description[LOCALE]) {
    const originalDesc = article.description[LOCALE];
    const linkedDesc = addLinksToText(originalDesc);
    if (originalDesc !== linkedDesc) {
      article.description[LOCALE] = linkedDesc;
      linksAdded++;
    }
  }
  
  // Write back if modified
  if (linksAdded > 0) {
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    return { success: true, linksAdded, sectionsModified };
  }
  
  return { success: false, linksAdded: 0, sectionsModified: 0 };
}

function main() {
  console.log('🔗 TradeGo Internal Links Adder (Fixed)');
  console.log('======================================\n');
  
  // Get all article files
  const articleFiles = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${articleFiles.length} articles\n`);
  
  let totalArticlesModified = 0;
  let totalLinksAdded = 0;
  const results = [];
  
  for (const file of articleFiles) {
    const articlePath = path.join(ARTICLES_DIR, file);
    const { success, linksAdded, sectionsModified } = processArticle(articlePath);
    
    if (success) {
      totalArticlesModified++;
      totalLinksAdded += linksAdded;
      results.push({ file, linksAdded, sectionsModified, status: '✅' });
    } else {
      results.push({ file, linksAdded: 0, sectionsModified: 0, status: '⚪' });
    }
  }
  
  // Sort by links added (modified first)
  results.sort((a, b) => b.linksAdded - a.linksAdded);
  
  console.log('Results (showing top 20):');
  console.log('------------------------');
  results.slice(0, 20).forEach(r => {
    if (r.linksAdded > 0) {
      console.log(`${r.status} ${r.file} - ${r.linksAdded} link(s) in ${r.sectionsModified} section(s)`);
    }
  });
  
  // Show summary of unmodified articles
  const unmodified = results.filter(r => r.linksAdded === 0);
  if (unmodified.length > 0) {
    console.log(`\n⚪ ${unmodified.length} articles had no matching product keywords`);
  }
  
  console.log(`\n======================================`);
  console.log(`📊 Summary:`);
  console.log(`   Articles modified: ${totalArticlesModified}/${articleFiles.length}`);
  console.log(`   Total links added: ${totalLinksAdded}`);
  
  if (totalArticlesModified > 0) {
    console.log(`\n⚠️  Remember to run 'npm run build' to test changes locally`);
  }
}

main();
