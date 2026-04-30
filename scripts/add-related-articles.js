#!/usr/bin/env node
/**
 * add-related-articles.js
 * 
 * Analyzes all articles and adds relatedArticles field to each JSON file.
 * Uses keyword overlap (title + keywords) to find related articles.
 * 
 * Usage: node scripts/add-related-articles.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const articlesDir = path.join(process.cwd(), 'content', 'articles');
const BACKUP_DIR = path.join(process.cwd(), 'content', 'articles', 'backup-' + Date.now());

// Load all articles
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
const articles = files.map(f => {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf-8'));
  return { 
    file: f, 
    slug: data.slug, 
    category: data.category,
    title: data.title?.en || '',
    keywords: data.keywords || [],
    data 
  };
});

console.log(`Found ${articles.length} articles`);
if (DRY_RUN) console.log('DRY RUN MODE - no files will be modified');

// Find related articles based on keyword/title overlap
// Keywords is a comma-separated string, split it into words
function getKeywords(keywords) {
  if (!keywords || typeof keywords !== 'string') return [];
  return keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 2);
}

function findRelated(article, allArticles, count = 3) {
  const articleWords = new Set([
    ...(article.title.toLowerCase().split(/[\s\-_,.!?;:()（）、，。【】]+/)),
    ...getKeywords(article.keywords)
  ].filter(w => w.length > 3));
  
  if (articleWords.size < 3) {
    // Fallback: use category
    if (article.category) {
      return allArticles
        .filter(a => a.slug !== article.slug && a.category === article.category)
        .slice(0, count)
        .map(a => ({ slug: a.slug, title: a.title }));
    }
    return [];
  }
  
  const scored = allArticles
    .filter(a => a.slug !== article.slug)
    .map(a => {
      const otherWords = new Set([
        ...(a.title.toLowerCase().split(/[\s\-_,.!?;:()（）、，。【】]+/)),
        ...getKeywords(a.keywords)
      ].filter(w => w.length > 3));
      
      let score = 0;
      articleWords.forEach(w => { if (otherWords.has(w)) score++; });
      return { slug: a.slug, title: a.title, score };
    })
    .filter(a => a.score > 1) // At least 2 keyword matches
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, count).map(a => ({ slug: a.slug, title: a.title }));
}

// Create backup
if (!DRY_RUN) {
  console.log('Creating backup directory...');
  fs.mkdirSync(BACKUP_DIR);
}

// Process each article
let modified = 0;
articles.forEach(article => {
  const related = findRelated(article, articles, 3);
  
  if (related.length > 0) {
    // Add relatedArticles to the article data
    article.data.relatedArticles = related;
    
    if (DRY_RUN) {
      console.log(`\n[DRY RUN] ${article.file}`);
      console.log(`  Title: ${article.title.substring(0, 60)}...`);
      console.log(`  Related: ${related.map(r => r.slug).join(', ')}`);
    } else {
      // Backup original
      fs.copyFileSync(
        path.join(articlesDir, article.file),
        path.join(BACKUP_DIR, article.file)
      );
      
      // Write updated JSON
      fs.writeFileSync(
        path.join(articlesDir, article.file),
        JSON.stringify(article.data, null, 2),
        'utf-8'
      );
      
      console.log(`Updated: ${article.file} (${related.length} related)`);
    }
    modified++;
  }
});

if (!DRY_RUN) {
  console.log(`\nDone! Modified ${modified} articles.`);
  console.log(`Backup created at: ${BACKUP_DIR}`);
  console.log(`To restore: cp ${BACKUP_DIR}/*.json ${articlesDir}/`);
} else {
  console.log(`\nDRY RUN: Would modify ${modified} articles`);
}
