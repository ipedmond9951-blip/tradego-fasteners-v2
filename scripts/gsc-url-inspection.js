/**
 * GSC URL Inspection - 检查URL索引状态并请求编入索引
 * 
 * 使用方法: node scripts/gsc-url-inspection.js <URL>
 * 示例: node scripts/gsc-url-inspection.js https://www.tradego-fasteners.com
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
  
  // 检查是否需要登录
  if (page.url().includes('signin') || page.url().includes('accounts.google.com')) {
    console.log('❌ 需要登录Google账号');
    console.log('请确保Chrome已登录 ipedmond9951@gmail.com');
    await browser.close();
    return;
  }
  
  // 截图保存当前状态
  await page.screenshot({ path: '/tmp/gsc-inspect-initial.png', fullPage: true });
  
  // 找到URL输入框 - GSC URL Inspection使用搜索框样式
  // 尝试多种选择器
  let inputSelectors = [
    'input[aria-label="检查网址"]',
    'input[placeholder*="检查网址"]',
    'input[placeholder*="URL"]',
    'input[type="text"][role="combobox"]',
    'textarea[name="url"]',
    'input[name="url"]',
    '.威力引擎 input',  // 中文GSC
    'input#lst-ib',  // 旧版Google搜索
  ];
  
  let input = null;
  for (const selector of inputSelectors) {
    input = await page.$(selector);
    if (input) {
      console.log(`✅ 找到输入框，使用选择器: ${selector}`);
      break;
    }
  }
  
  if (!input) {
    console.log('❌ 未找到URL输入框');
    // 截图保存
    await page.screenshot({ path: '/tmp/gsc-inspect-no-input.png', fullPage: true });
    
    // 获取页面内容以便调试
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('页面内容预览:', bodyText.substring(0, 500));
    
    await browser.close();
    return;
  }
  
  // 输入URL
  console.log('输入URL:', urlToInspect);
  await input.click();
  await input.fill('');
  await page.waitForTimeout(200);
  await input.type(urlToInspect, { delay: 50 });
  await page.waitForTimeout(500);
  
  // 截图保存输入后状态
  await page.screenshot({ path: '/tmp/gsc-inspect-after-input.png', fullPage: true });
  
  // 按Enter提交
  console.log('按Enter提交...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);  // 等待检查完成
  
  // 截图保存检查结果
  await page.screenshot({ path: '/tmp/gsc-inspect-result.png', fullPage: true });
  
  // 获取检查结果
  const resultText = await page.evaluate(() => document.body.innerText);
  console.log('\n=== 检查结果 ===');
  console.log(resultText.substring(0, 3000));
  
  // 检查是否有"请求编入索引"按钮
  const requestIndexBtn = await page.$('button:has-text("请求编入索引")');
  if (requestIndexBtn) {
    console.log('\n✅ 找到"请求编入索引"按钮，点击...');
    await requestIndexBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/gsc-inspect-after-request.png', fullPage: true });
    console.log('✅ 请求已提交！');
  } else {
    // 尝试英文按钮
    const requestIndexBtnEn = await page.$('button:has-text("REQUEST INDEXING")');
    if (requestIndexBtnEn) {
      console.log('\n✅ 找到"REQUEST INDEXING"按钮，点击...');
      await requestIndexBtnEn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/tmp/gsc-inspect-after-request.png', fullPage: true });
      console.log('✅ 请求已提交！');
    } else {
      console.log('\n⚠️ 未找到"请求编入索引"按钮');
      console.log('可能原因:');
      console.log('1. URL已经被索引');
      console.log('2. URL有技术问题无法请求');
      console.log('3. 页面还在加载中');
    }
  }
  
  await browser.close();
  console.log('\n完成！截图保存在 /tmp/gsc-inspect-*.png');
}

// 主函数
const urlToInspect = process.argv[2] || BASE_URL;
inspectUrl(urlToInspect).catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
