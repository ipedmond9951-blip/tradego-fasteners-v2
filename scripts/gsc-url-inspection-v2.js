/**
 * GSC URL Inspection - 改进版v2
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://www.tradego-fasteners.com';
const GSC_URL = 'https://search.google.com/search-console/inspect';

async function inspectUrl(urlToInspect, clickRequest = true) {
  console.log('Connecting to Chrome CDP...');
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('Navigating to GSC URL Inspection...');
  await page.goto(GSC_URL, { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  await page.waitForTimeout(3000);
  console.log('Current URL:', page.url());
  
  if (page.url().includes('signin') || page.url().includes('accounts.google.com')) {
    console.log('❌ 需要登录Google账号');
    await browser.close();
    return;
  }
  
  await page.screenshot({ path: '/tmp/gsc-v2-initial.png', fullPage: true });
  
  // 找到URL输入框 - 不要先click，直接用fill
  let input = await page.$('input[type="text"][role="combobox"]');
  if (!input) {
    input = await page.$('input[name="url"]');
  }
  if (!input) {
    input = await page.$('textarea[name="url"]');
  }
  
  if (!input) {
    console.log('❌ 未找到URL输入框');
    await page.screenshot({ path: '/tmp/gsc-v2-no-input.png', fullPage: true });
    const content = await page.evaluate(() => document.body.innerText);
    console.log('页面内容:', content.substring(0, 1000));
    await browser.close();
    return;
  }
  
  console.log('输入URL:', urlToInspect);
  await input.fill(urlToInspect);
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: '/tmp/gsc-v2-after-input.png', fullPage: true });
  
  console.log('按Enter提交...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: '/tmp/gsc-v2-result.png', fullPage: true });
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===');
  console.log(resultText.substring(0, 3000));
  
  // 检查是否已索引
  if (resultText.includes('已编入索引') || resultText.includes('已收录')) {
    console.log('\n✅ URL已经被索引！');
    await browser.close();
    return;
  }
  
  // 如果未索引且需要请求，找按钮
  if (clickRequest) {
    console.log('\nURL未索引，查找"请求编入索引"按钮...');
    
    // 获取所有按钮
    const buttons = await page.$$('button');
    console.log(`找到 ${buttons.length} 个按钮`);
    
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      const ariaLabel = await btn.evaluate(el => el.getAttribute('aria-label'));
      if (text || ariaLabel) {
        console.log(`  按钮: "${text}" aria-label="${ariaLabel}"`);
      }
    }
    
    // 点击请求索引按钮
    const requestBtn = await page.$('button:has-text("请求编入索引")');
    if (requestBtn) {
      const isVisible = await requestBtn.isVisible();
      console.log('按钮可见性:', isVisible);
      if (isVisible) {
        await requestBtn.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/gsc-v2-after-request.png', fullPage: true });
        console.log('✅ 请求已提交！');
      }
    } else {
      console.log('\n⚠️ 未找到请求编入索引按钮');
    }
  }
  
  await browser.close();
  console.log('\n完成！');
}

// 主函数
const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
