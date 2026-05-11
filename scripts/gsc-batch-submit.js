/**
 * GSC Batch URL Inspection & Index Request
 * 批量检查URL状态并请求索引
 */

const { chromium } = require('playwright');

// 高优先级页面列表（产品/文章页面）
const PRIORITY_URLS = [
  'https://www.tradego-fasteners.com/en/products',
  'https://www.tradego-fasteners.com/en/industry',
  'https://www.tradego-fasteners.com/en/about',
  'https://www.tradego-fasteners.com/en/contact',
  'https://www.tradego-fasteners.com/en/drywall-screws',
  'https://www.tradego-fasteners.com/en/self-drilling-screws',
  'https://www.tradego-fasteners.com/en/bolts-nuts',
  'https://www.tradego-fasteners.com/en/ibr-nails',
  'https://www.tradego-fasteners.com/en/anchor-bolts',
  'https://www.tradego-fasteners.com/en/washers',
  'https://www.tradego-fasteners.com/en/coach-screws',
  'https://www.tradego-fasteners.com/en/threaded-rods',
  // Articles
  'https://www.tradego-fasteners.com/en/zimbabwe-fasteners-wholesale',
  'https://www.tradego-fasteners.com/en/south-africa-fastener-market',
  'https://www.tradego-fasteners.com/en/kenya-fastener-market',
];

const BASE_URL = 'https://search.google.com/search-console/inspect?resource_id=sc-domain%3Atradego-fasteners.com&q=';

async function batchInspect() {
  console.log('Connecting to Chrome CDP on port 9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  const results = [];
  
  for (const url of PRIORITY_URLS) {
    try {
      console.log(`\n检查: ${url}`);
      
      const inspectUrl = BASE_URL + encodeURIComponent(url);
      await page.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);
      
      // 获取状态
      const pageText = await page.evaluate(() => document.body.innerText);
      
      let status = 'unknown';
      let canRequestIndex = false;
      
      if (pageText.includes('已编入索引')) {
        status = '✅ 已索引';
        canRequestIndex = false;
      } else if (pageText.includes('尚未收录')) {
        status = '❌ 未索引';
        canRequestIndex = true;
      } else if (pageText.includes('已抓取')) {
        status = '⚠️ 已抓取未索引';
        canRequestIndex = true;
      } else {
        status = '❓ 状态不明';
      }
      
      console.log(`  状态: ${status}`);
      results.push({ url, status, canRequestIndex });
      
      // 如果需要请求索引，点击按钮
      if (canRequestIndex && pageText.includes('请求编入索引')) {
        // 查找并点击按钮
        const buttonSelectors = [
          'button:has-text("请求编入索引")',
          '[aria-label*="请求编入索引"]',
          'button:has-text("REQUEST INDEXING")',
        ];
        
        for (const selector of buttonSelectors) {
          const btn = await page.$(selector);
          if (btn) {
            await btn.click();
            console.log(`  ✓ 已点击请求索引`);
            await page.waitForTimeout(2000);
            break;
          }
        }
      }
      
    } catch (err) {
      console.log(`  错误: ${err.message}`);
      results.push({ url, status: 'error', error: err.message });
    }
    
    // 每个URL间隔2秒，避免限流
    await page.waitForTimeout(2000);
  }
  
  console.log('\n\n=== 检查结果汇总 ===\n');
  results.forEach(r => {
    console.log(`${r.status} - ${r.url}`);
  });
  
  await browser.close();
  console.log('\n完成！');
}

batchInspect().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});