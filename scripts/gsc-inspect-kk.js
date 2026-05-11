/**
 * GSC URL Inspection for kk-electric.com
 */

const { chromium } = require('playwright');

const GSC_URL = 'https://search.google.com/search-console/inspect?resource_id=sc-domain%3Akk-electric.com&q=https%3A%2F%2Fkk-electric.com';

async function inspect() {
  console.log('Connecting to Chrome CDP on port 9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('Navigating to GSC URL Inspection...');
  await page.goto(GSC_URL, { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===\n');
  console.log(resultText.substring(0, 3000));
  
  await browser.close();
  console.log('\n完成！');
}

inspect().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
