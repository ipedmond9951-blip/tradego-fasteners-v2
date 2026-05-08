/**
 * GSC URL Inspection - 最终修复版
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
  
  // 找到URL输入框
  let input = await page.$('input[type="text"][role="combobox"]');
  if (!input) input = await page.$('input[name="url"]');
  
  if (!input) {
    console.log('❌ 未找到URL输入框');
    const content = await page.evaluate(() => document.body.innerText);
    console.log('页面内容:', content.substring(0, 1000));
    await browser.close();
    return;
  }
  
  console.log('输入URL:', urlToInspect);
  await input.fill(urlToInspect);
  await page.waitForTimeout(500);
  
  console.log('按Enter提交...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: '/tmp/gsc-v3-result.png', fullPage: true });
  
  // 获取页面内容
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===');
  console.log(resultText.substring(0, 2000));
  
  // 正确判断是否已索引 - 查找"尚未"表示未索引
  const isNotIndexed = resultText.includes('尚未收录') || resultText.includes('未编入索引');
  
  if (isNotIndexed) {
    console.log('\n⚠️ URL尚未被索引，尝试请求...');
    
    // 打印所有按钮文本用于调试
    const buttons = await page.$$('button');
    console.log(`\n找到 ${buttons.length} 个按钮:`);
    for (let i = 0; i < buttons.length; i++) {
      const text = (await buttons[i].evaluate(el => el.textContent)).trim();
      const ariaLabel = await buttons[i].evaluate(el => el.getAttribute('aria-label'));
      const disabled = await buttons[i].evaluate(el => el.disabled);
      console.log(`  [${i}] text="${text}" aria-label="${ariaLabel}" disabled=${disabled}`);
    }
    
    // 点击请求按钮
    const requestBtn = await page.$('button:has-text("请求编入索引")');
    if (requestBtn) {
      console.log('\n点击"请求编入索引"按钮...');
      await requestBtn.click();
      await page.waitForTimeout(5000);
      await page.screenshot({ path: '/tmp/gsc-v3-after-request.png', fullPage: true });
      
      const afterText = await page.evaluate(() => document.body.innerText);
      if (afterText.includes('请求已提交') || afterText.includes('已提交请求')) {
        console.log('✅ 请求已成功提交！');
      } else {
        console.log('⚠️ 提交结果未知，请查看截图');
      }
    } else {
      console.log('\n❌ 未找到"请求编入索引"按钮');
      console.log('可能原因:');
      console.log('1. 页面自动重定向导致无法请求索引');
      console.log('2. Google正在处理之前的请求');
      console.log('3. 按钮位置在iframe或shadow DOM中');
    }
  } else {
    console.log('\n✅ URL已经被索引！');
  }
  
  await browser.close();
  console.log('\n完成！');
}

const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
