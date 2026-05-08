/**
 * GSC URL Inspection - 批量请求索引
 * 
 * 使用方法: node scripts/gsc-batch-inspect.js [URL文件]
 */

const { chromium } = require('playwright');
const fs = require('fs');

const GSC_URL = 'https://search.google.com/search-console/inspect';

// 重要URL列表 - 产品和分类页面优先
const URLs = [
  'https://www.tradego-fasteners.com/en/products',
  'https://www.tradego-fasteners.com/en/industry',
  'https://www.tradego-fasteners.com/en/about',
  'https://www.tradego-fasteners.com/en/contact',
  'https://www.tradego-fasteners.com/en/zimbabwe-fasteners-wholesale',
  'https://www.tradego-fasteners.com/en/drywall-screws',
  'https://www.tradego-fasteners.com/en/self-drilling-screws',
  'https://www.tradego-fasteners.com/en/hex-bolts-nuts',
  'https://www.tradego-fasteners.com/en/ibr-roofing-nails',
  'https://www.tradego-fasteners.com/en/anchor-bolts',
  'https://www.tradego-fasteners.com/en/washers',
  'https://www.tradego-fasteners.com/en/coach-screws',
  'https://www.tradego-fasteners.com/en/threaded-rods',
  'https://www.tradego-fasteners.com/zw/products',
  'https://www.tradego-fasteners.com/zw/industry',
  'https://www.tradego-fasteners.com/za/products',
  'https://www.tradego-fasteners.com/za/industry',
  'https://www.tradego-fasteners.com/zm/products',
  'https://www.tradego-fasteners.com/zm/industry',
];

async function inspectAndRequestIndex(browser, url) {
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  process.stdout.write(`\n检查: ${url}\n`);
  
  try {
    await page.goto(GSC_URL, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });
    
    await page.waitForTimeout(2000);
    
    // 检查是否重定向到not-verified
    if (page.url().includes('not-verified')) {
      console.log('  ❌ 未登录GSC');
      await page.close();
      return 'NOT_LOGGED_IN';
    }
    
    // 输入URL
    const input = await page.$('input[type="text"][role="combobox"]');
    if (!input) {
      console.log('  ❌ 未找到输入框');
      await page.close();
      return 'NO_INPUT';
    }
    
    await input.fill(url);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // 获取结果
    const resultText = await page.evaluate(() => document.body.innerText);
    
    // 判断状态
    if (resultText.includes('已编入索引') || resultText.includes('已收录到 Google')) {
      console.log('  ✅ 已索引');
      await page.close();
      return 'INDEXED';
    }
    
    if (resultText.includes('尚未收录') || resultText.includes('未编入索引')) {
      console.log('  ⚠️ 未索引 - 尝试请求...');
      
      // 查找并点击请求按钮
      const requestBtn = await page.$('button:has-text("请求编入索引")');
      if (requestBtn) {
        await requestBtn.click();
        await page.waitForTimeout(3000);
        console.log('  ✅ 请求已提交');
        await page.close();
        return 'REQUESTED';
      } else {
        console.log('  ⚠️ 未找到请求按钮');
        await page.close();
        return 'NO_BUTTON';
      }
    }
    
    console.log('  ❓ 状态未知');
    await page.close();
    return 'UNKNOWN';
    
  } catch (e) {
    console.log(`  ❌ 错误: ${e.message}`);
    await page.close();
    return 'ERROR';
  }
}

async function main() {
  console.log('Connecting to Chrome CDP...');
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  
  console.log('开始批量URL Inspection...\n');
  console.log('========================================');
  
  let results = {
    indexed: 0,
    requested: 0,
    notIndexed: 0,
    errors: []
  };
  
  for (const url of URLs) {
    const result = await inspectAndRequestIndex(browser, url);
    
    if (result === 'INDEXED') results.indexed++;
    else if (result === 'REQUESTED') results.requested++;
    else if (result === 'NOT_LOGGED_IN' || result === 'NO_INPUT') {
      console.log('\n❌ 致命错误，停止执行');
      break;
    }
    else results.errors.push({ url, result });
    
    // 每个URL间隔2秒，避免过快请求
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n========================================');
  console.log('\n📊 批量检查结果:');
  console.log(`  ✅ 已索引: ${results.indexed}`);
  console.log(`  ⚠️ 已请求: ${results.requested}`);
  console.log(`  ❌ 错误: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n错误详情:');
    results.errors.forEach(e => console.log(`  ${e.url}: ${e.result}`));
  }
  
  await browser.close();
  console.log('\n完成！');
}

main().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
