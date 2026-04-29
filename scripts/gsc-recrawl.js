/**
 * GSC URL Inspection - Request Recrawl
 */

const { chromium } = require('playwright');

async function requestRecrawl() {
  console.log('🔍 Connecting to Chrome...\n');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('🌐 Navigating to GSC URL Inspection...');
  
  // Try the URL inspection tool directly with the homepage
  const testUrl = 'https://www.tradego-fasteners.com/';
  await page.goto(`https://search.google.com/search-console/inspect?resource_id=sc-domain:tradego-fasteners.com&uri=${encodeURIComponent(testUrl)}`, { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  await page.waitForTimeout(5000);
  
  console.log(`URL: ${page.url()}\n`);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/gsc-inspect.png', fullPage: true });
  console.log('📸 Screenshot: /tmp/gsc-inspect.png\n');
  
  // Try to find and click "Request Indexing" button
  console.log('🔍 Looking for "Request Indexing" button...');
  
  // Take a smaller viewport screenshot to see the UI better
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: '/tmp/gsc-inspect-ui.png', fullPage: false });
  
  // Try to find any button with "index" or "crawl" text
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text && (text.toLowerCase().includes('index') || text.toLowerCase().includes('crawl') || text.toLowerCase().includes('fetch'))) {
      console.log(`Found: "${text.trim()}"`);
      try {
        await btn.click({ timeout: 5000 });
        console.log('✅ Clicked the button!');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/gsc-after-click.png', fullPage: false });
        console.log('📸 After click: /tmp/gsc-after-click.png\n');
      } catch (e) {
        console.log(`Could not click: ${e.message}`);
      }
    }
  }
  
  // Get page content to understand current state
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1500));
  console.log('📄 Page content (first 1500 chars):');
  console.log(bodyText);
  
  await browser.disconnect();
  console.log('\n✅ Done!');
}

requestRecrawl().catch(e => { console.error('Error:', e.message); process.exit(1); });
