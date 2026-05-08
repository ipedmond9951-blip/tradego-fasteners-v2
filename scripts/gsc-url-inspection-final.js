/**
 * GSC URL Inspection - 最终版，确保点击请求按钮
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
  
  // 找到URL输入框
  let input = await page.$('input[type="text"][role="combobox"]');
  if (!input) input = await page.$('input[name="url"]');
  
  if (!input) {
    console.log('❌ 未找到URL输入框');
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
  
  // 判断是否已索引 - 只有明确包含"已编入索引"/"已收录到 Google"才算已索引
  const isIndexed = resultText.includes('已编入索引') || resultText.includes('已收录到 Google');
  
  if (isIndexed) {
    console.log('✅ URL已经被索引！');
    await browser.close();
    return;
  }
  
  // 未索引，查找请求按钮
  console.log('⚠️ URL尚未被索引，尝试请求...');
  
  const requestBtn = await page.$('button:has-text("请求编入索引")');
  if (requestBtn) {
    console.log('点击"请求编入索引"按钮...');
    await requestBtn.click();
    await page.waitForTimeout(5000);
    
    // 验证请求是否成功
    const afterText = await page.evaluate(() => document.body.innerText);
    if (afterText.includes('请求已提交') || afterText.includes('已提交请求') || afterText.includes('正在处理')) {
      console.log('✅ 请求已成功提交！');
    } else {
      console.log('⚠️ 请求已提交（请手动确认）');
    }
  } else {
    console.log('❌ 未找到"请求编入索引"按钮');
    console.log('原因可能是:');
    console.log('1. 页面自动重定向导致无法请求索引');
    console.log('2. URL有技术问题');
  }
  
  await browser.close();
  console.log('完成！');
}

const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
