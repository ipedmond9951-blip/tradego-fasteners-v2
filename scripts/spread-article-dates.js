#!/usr/bin/env node
/**
 * TradeGo Article Date Spreader
 * 将现有文章的日期分散到过去6-12个月，避免时间聚集
 * 模拟"自然生长"的内容更新模式
 * 
 * 使用方法: node scripts/spread-article-dates.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
const BACKUP_DIR = path.join(process.cwd(), 'content', 'articles', 'backup', 'date-spread');

// ========================================
// 配置
// ========================================

const DRY_RUN = process.argv.includes('--dry-run');

// 日期范围配置
const DATE_CONFIG = {
  // 分散到过去6-18个月
  minMonthsBack: 6,
  maxMonthsBack: 18,
  
  // 更新时间分散到过去30-90天
  minDaysBack: 30,
  maxDaysBack: 90
};

// ========================================
// 工具函数
// ========================================

/**
 * 生成随机日期（在过去N个月内）
 */
function randomDate(monthsBackMin, monthsBackMax) {
  const now = new Date();
  const minMonths = monthsBackMin || 1;
  const maxMonths = monthsBackMax || 6;
  const monthsBack = minMonths + Math.random() * (maxMonths - minMonths);
  
  const pastDate = new Date(now);
  pastDate.setMonth(now.getMonth() - monthsBack);
  
  // 在这个月内随机选一天
  const startOfRange = new Date(pastDate);
  const endOfRange = new Date(Math.min(now.getTime(), new Date(pastDate).setMonth(pastDate.getMonth() + 1)));
  
  const randomTime = startOfRange.getTime() + Math.random() * (endOfRange.getTime() - startOfRange.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * 生成随机更新时间
 */
function randomUpdated(daysBackMin, daysBackMax) {
  const now = new Date();
  const daysBack = daysBackMin + Math.random() * (daysBackMax - daysBackMin);
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - daysBack);
  return pastDate.toISOString().split('T')[0];
}

/**
 * 计算两个日期之间的天数差异
 */
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)));
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// ========================================
// 主程序
// ========================================

function main() {
  log('🚀 TradeGo Article Date Spreader');
  log(`📋 Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  log('==========================================');
  
  if (!fs.existsSync(ARTICLES_DIR)) {
    log(`❌ Articles directory not found: ${ARTICLES_DIR}`);
    process.exit(1);
  }
  
  // 获取所有JSON文件
  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !f.includes('backup'))  // 跳过backup目录
    .map(f => path.join(ARTICLES_DIR, f));
  
  log(`📊 Found ${files.length} articles to process`);
  log('');
  
  // 创建备份目录
  if (!DRY_RUN) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // 统计
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  // 按原始日期排序（早的先处理，避免完全随机导致顺序混乱）
  const articles = files.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      return { filepath: f, data, originalDate: data.date || '2020-01-01' };
    } catch (e) {
      return { filepath: f, data: null, error: e.message };
    }
  }).filter(a => a.data);
  
  // 按原始日期排序
  articles.sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));
  
  // 计算新的日期分布
  // 确保日期分散，不要聚集
  const now = new Date();
  const totalArticles = articles.length;
  
  articles.forEach((item, index) => {
    try {
      const article = item.data;
      
      // 跳过已经有分散日期的文章（如果updated已经是过去的日期）
      if (article.updated) {
        const updatedDate = new Date(article.updated);
        const daysSinceUpdate = daysBetween(article.updated, now.toISOString().split('T')[0]);
        if (daysSinceUpdate > DATE_CONFIG.maxDaysBack * 2) {
          skipped++;
          return;
        }
      }
      
      // 生成新的分散日期
      // 使用index来帮助分散，这样相邻的文章不太可能有完全相同的日期
      const spreadFactor = index / totalArticles;
      const monthsBack = DATE_CONFIG.minMonthsBack + 
        spreadFactor * (DATE_CONFIG.maxMonthsBack - DATE_CONFIG.minMonthsBack) +
        (Math.random() - 0.5) * 3;  // 加一点随机性
      
      const newDate = new Date(now);
      newDate.setMonth(now.getMonth() - monthsBack);
      const newDateStr = newDate.toISOString().split('T')[0];
      
      // 更新时间（分散到过去30-90天）
      const updatedDaysBack = getRandomInt(DATE_CONFIG.minDaysBack, DATE_CONFIG.maxDaysBack);
      const newUpdated = new Date(now);
      newUpdated.setDate(now.getDate() - updatedDaysBack);
      const updatedStr = newUpdated.toISOString().split('T')[0];
      
      if (DRY_RUN) {
        log(`[DRY] ${path.basename(item.filepath)}:`);
        log(`       date: ${article.date} → ${newDateStr}`);
        log(`       updated: ${article.updated || 'none'} → ${updatedStr}`);
      } else {
        // 备份原文件
        const backupPath = path.join(BACKUP_DIR, path.basename(item.filepath));
        fs.writeFileSync(backupPath, JSON.stringify(article, null, 2), 'utf8');
        
        // 更新日期
        article.date = newDateStr;
        article.updated = updatedStr;
        
        // 写入修改后的文件
        fs.writeFileSync(item.filepath, JSON.stringify(article, null, 2), 'utf8');
        
        log(`✅ ${path.basename(item.filepath)}:`);
        log(`    date: ${newDateStr}, updated: ${updatedStr}`);
      }
      
      updated++;
    } catch (e) {
      log(`❌ Error processing ${path.basename(item.filepath)}: ${e.message}`);
      errors++;
    }
  });
  
  log('');
  log('==========================================');
  log(`📊 Summary:`);
  log(`   Updated: ${updated}`);
  log(`   Skipped: ${skipped}`);
  log(`   Errors: ${errors}`);
  if (!DRY_RUN) {
    log(`📁 Backup: ${BACKUP_DIR}`);
  }
  log('==========================================');
  
  if (DRY_RUN) {
    log('');
    log('💡 This was a dry run. Run without --dry-run to apply changes.');
  }
}

main();
