/**
 * GSC URL Inspection - 简化稳定版
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://www.tradego-fasteners.com';
const GSC_URL = 'https://search.google.com/search-console/inspect';

async function inspectUrl(urlToInspect) {
  console.log('Connecting to Chrome CDP...');
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('Navigating to GSC URL Inspection...');
  await page.goto(GSC_URL, { 
    waitUntil: 'networkidle', 
    timeout: 30000 
  });
  
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());
  
  // 输入URL - 使用更稳定的方式
  console.log('输入URL:', urlToInspect);
  
  // 直接用keyboard.type模拟打字，因为某些input可能不支持fill
  await page.keyboard.type(urlToInspect, { delay: 100 });
  await page.waitForTimeout(500);
  
  console.log('按Enter提交...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);
  
  await page.screenshot({ path: '/tmp/gsc-v4-result.png', fullPage: true });
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===');
  console.log(resultText.substring(0, 2500));
  
  // 检查是否已索引
  if (resultText.includes('已编入索引') || resultText.includes('已收录到 Google')) {
    console.log('\n✅ URL已经被索引！');
    await browser.close();
    return;
  }
  
  // URL未索引，查找请求按钮
  if (resultText.includes('尚未收录') || resultText.includes('未编入索引')) {
    console.log('\n⚠️ URL尚未被索引，尝试请求...');
    
    // 直接尝试多种方式点击按钮
    const btnText = '请求编入索引';
    const btn = await page.getByText(btnText, { exact: false }).first();
    if (btn) {
      try {
        await btn.click({ timeout: 5000 });
        console.log('✅ 点击成功');
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/tmp/gsc-v4-after-request.png', fullPage: true });
        console.log('✅ 请求已提交！');
      } catch (e) {
        console.log('点击失败:', e.message);
      }
    }
  }
  
  await browser.close();
  console.log('\n完成！');
}

const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
