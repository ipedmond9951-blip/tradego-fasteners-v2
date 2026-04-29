/**
 * GSC Sitemap Re-submission Script - Final Version
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('🔍 Connecting to Chrome...\n');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  
  // Create new page for GSC
  const page = await context.newPage();
  
  console.log('🌐 Navigating to GSC Sitemaps page...');
  
  // Navigate with domcontentloaded instead of networkidle (more reliable)
  await page.goto('https://search.google.com/search-console/sitemaps?resource_id=sc-domain:tradego-fasteners.com', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  // Wait for page to be interactive
  await page.waitForTimeout(5000);
  
  console.log(`URL: ${page.url()}\n`);
  
  // Take screenshot of current state
  await page.screenshot({ path: '/tmp/gsc-01-initial.png', fullPage: true });
  console.log('📸 Initial state: /tmp/gsc-01-initial.png\n');

  // Get visible text content
  const visibleText = await page.evaluate(() => document.body.innerText);
  console.log('📄 Page content (first 1000 chars):');
  console.log(visibleText.substring(0, 1000));
  console.log('...\n');

  // Look for any "Add Sitemap" or similar buttons
  const addButtons = await page.$$('button');
  console.log(`Found ${addButtons.length} buttons on page`);
  
  for (const btn of addButtons) {
    const text = await btn.textContent();
    const disabled = await btn.getAttribute('disabled');
    if (text && text.trim().length > 0) {
      console.log(`  Button: "${text.trim().substring(0, 50)}" disabled=${disabled}`);
    }
  }
  
  // Try to find the input field for adding sitemap
  // Look for inputs with sitemap-related placeholders
  const inputSelectors = [
    'input[placeholder*="sitemap" i]',
    'input[placeholder*="站点地图" i]',
    'input[aria-label*="sitemap" i]',
    'input[aria-label*="站点地图" i]',
    'input[type="url"]',
    'input[type="text"]'
  ];
  
  let sitemapInput = null;
  for (const sel of inputSelectors) {
    try {
      const input = await page.$(sel);
      if (input) {
        const box = await input.boundingBox();
        if (box && box.width > 100) {  // Only consider visible, sized inputs
          console.log(`\n✅ Found sitemap input: "${sel}"`);
          console.log(`   Bounding box: x=${box.x}, y=${box.y}, w=${box.width}, h=${box.height}`);
          sitemapInput = { sel, input, box };
          break;
        }
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  if (sitemapInput) {
    console.log('\n⌨️ Attempting to fill sitemap URL...');
    try {
      // Click on the input first to focus it
      await page.click(sitemapInput.sel, { timeout: 5000 });
      await page.waitForTimeout(500);
      
      // Try to fill using different methods
      try {
        await page.fill(sitemapInput.sel, 'https://www.tradego-fasteners.com/sitemap.xml', { timeout: 5000 });
        console.log('✅ Filled using page.fill()');
      } catch (e1) {
        console.log('page.fill failed, trying type()...');
        await page.click(sitemapInput.sel);
        await page.waitForTimeout(300);
        await page.type(sitemapInput.sel, 'https://www.tradego-fasteners.com/sitemap.xml', { timeout: 5000 });
        console.log('✅ Filled using page.type()');
      }
      
      await page.waitForTimeout(1000);
      
      // Take screenshot after filling
      await page.screenshot({ path: '/tmp/gsc-02-after-fill.png', fullPage: true });
      console.log('📸 After filling: /tmp/gsc-02-after-fill.png\n');
      
      // Now try to find and click submit button
      // Look for any submit/add/confirm button
      const submitButtons = await page.$$('button:not([disabled])');
      console.log(`Found ${submitButtons.length} enabled buttons`);
      
      for (const btn of submitButtons) {
        const text = await btn.textContent();
        const className = await btn.getAttribute('class') || '';
        if (text && (text.includes('Submit') || text.includes('Add') || text.includes('提交') || text.includes('添加') || text.includes('Confirm'))) {
          console.log(`\n🖱️ Clicking submit button: "${text.trim()}"`);
          await btn.click({ force: true });
          await page.waitForTimeout(5000);
          await page.screenshot({ path: '/tmp/gsc-03-after-submit.png', fullPage: true });
          console.log('📸 After submit: /tmp/gsc-03-after-submit.png\n');
          break;
        }
      }
      
      // Check final state
      const finalUrl = page.url();
      const finalText = await page.evaluate(() => document.body.innerText);
      
      console.log('\n📊 Final State:');
      console.log(`URL: ${finalUrl}`);
      if (finalText.includes('sitemap.xml') || finalText.includes('已提交')) {
        console.log('✅ Sitemap appears to be submitted!');
      }
      
    } catch (e) {
      console.log(`❌ Error during submission: ${e.message}`);
    }
  } else {
    console.log('\n❌ Could not find sitemap input field');
  }
  
  // Final screenshot
  await page.screenshot({ path: '/tmp/gsc-final.png', fullPage: true });
  console.log('\n📸 Final screenshot: /tmp/gsc-final.png\n');
  
  // Get the updated page content
  const finalContent = await page.evaluate(() => document.body.innerText);
  console.log('📄 Final page content (first 1500 chars):');
  console.log(finalContent.substring(0, 1500));
  
  console.log('\n✅ Script completed!');
  
  await browser.close();
}

submitSitemap().catch(e => { 
  console.error('❌ Error:', e.message); 
  process.exit(1); 
});
