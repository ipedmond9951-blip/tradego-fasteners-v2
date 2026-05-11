/**
 * GSC 详细问题分析
 * 分析314个自动重定向和374个已抓取未索引的具体原因
 */

const { chromium } = require('playwright');

async function analyzeIssues() {
  console.log('Connecting to Chrome CDP on port 9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('1. 检查"自动重定向"问题...\n');
  
  // 访问GSC Pages页面，筛选"自动重定向"
  await page.goto('https://search.google.com/search-console/pages?resource_id=sc-domain:tradego-fasteners.com&state=1&filter=%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  await page.waitForTimeout(5000);
  
  let pageText = await page.evaluate(() => document.body.innerText);
  console.log('自动重定向页面 (前2000字符):\n');
  console.log(pageText.substring(0, 2000));
  
  console.log('\n\n2. 检查"已抓取 - 尚未编入索引"问题...\n');
  
  // 筛选已抓取未索引
  await page.goto('https://search.google.com/search-console/pages?resource_id=sc-domain:tradego-fasteners.com&state=1&filter=%E5%B7%B2%E6%8A%93%E5%8F%96', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  await page.waitForTimeout(5000);
  
  pageText = await page.evaluate(() => document.body.innerText);
  console.log('已抓取未索引页面 (前2000字符):\n');
  console.log(pageText.substring(0, 2000));
  
  console.log('\n\n3. 检查"已发现 - 尚未编入索引"问题...\n');
  
  // 筛选已发现未索引
  await page.goto('https://search.google.com/search-console/pages?resource_id=sc-domain:tradego-fasteners.com&state=1&filter=%E5%B7%B2%E5%8F%91%E7%8E%B0', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  await page.waitForTimeout(5000);
  
  pageText = await page.evaluate(() => document.body.innerText);
  console.log('已发现未索引页面 (前2000字符):\n');
  console.log(pageText.substring(0, 2000));
  
  await browser.close();
  console.log('\n分析完成！');
}

analyzeIssues().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});