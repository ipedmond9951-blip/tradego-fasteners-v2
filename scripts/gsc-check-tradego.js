/**
 * GSC Index检查 for tradego-fasteners.com
 */

const { chromium } = require('playwright');

const GSC_URL = 'https://search.google.com/search-console/index?resource_id=sc-domain:tradego-fasteners.com&hl=zh-CN';

async function check() {
  console.log('Connecting to Chrome CDP on port 9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('Navigating to GSC Index page...');
  await page.goto(GSC_URL, { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== GSC Index 检查结果 ===\n');
  console.log(resultText.substring(0, 5000));
  
  await browser.close();
  console.log('\n完成！');
}

check().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
