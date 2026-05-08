/**
 * GSC URL Inspection - 修复逻辑版本
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
  
  if (page.url().includes('not-verified')) {
    // 尝试直接导航到inspect页面加URL参数
    console.log('尝试直接inspect URL...');
    await page.goto(`${GSC_URL}?url=${encodeURIComponent(urlToInspect)}`, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
  }
  
  // 找到URL输入框
  let input = await page.$('input[type="text"][role="combobox"]');
  if (!input) input = await page.$('input[name="url"]');
  
  if (!input) {
    console.log('❌ 未找到URL输入框');
    const content = await page.evaluate(() => document.body.innerText);
    console.log('页面内容:', content.substring(0, 500));
    await browser.close();
    return;
  }
  
  console.log('输入URL:', urlToInspect);
  await input.fill(urlToInspect);
  await page.waitForTimeout(500);
  
  console.log('按Enter提交...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===');
  
  // 正确的判断逻辑 - 包含"尚未"或"未编入索引"表示未索引
  const isNotIndexed = resultText.includes('尚未收录') || 
                       resultText.includes('未编入索引') ||
                       resultText.includes('尚未被 Google 收录');
  
  if (isNotIndexed) {
    console.log('⚠️ URL尚未被索引');
    
    // 打印关键信息
    if (resultText.includes('请求编入索引')) {
      console.log('存在"请求编入索引"按钮');
    }
    
    // 尝试点击请求按钮
    const requestBtn = await page.$('button:has-text("请求编入索引")');
    if (requestBtn) {
      console.log('点击"请求编入索引"...');
      await requestBtn.click();
      await page.waitForTimeout(5000);
      console.log('✅ 请求已提交！');
    }
  } else {
    console.log('✅ URL已经被索引');
  }
  
  await browser.close();
  console.log('完成！');
}

const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
