/**
 * GSC Debug - Analyze page structure
 */

const { chromium } = require('playwright');

async function debugGSC() {
  console.log('🔍 Connecting to Chrome...\n');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();
  
  console.log('🌐 Navigating to GSC (direct URL with resource_id)...\n');
  
  // Try with explicit resource_id
  const url = 'https://search.google.com/search-console/sitemaps?resource_id=sc-domain:tradego-fasteners.com';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  console.log(`URL: ${page.url()}\n`);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/gsc-debug-01.png', fullPage: true });
  
  // Get page title
  const title = await page.title();
  console.log(`Title: ${title}\n`);
  
  // Check for any blocking elements
  const overlay = await page.$('.dialog-overlay, .modal-overlay, [role="dialog"], [role="alertdialog"]');
  if (overlay) {
    console.log('⚠️ Found overlay dialog!');
    const overlayBox = await overlay.boundingBox();
    console.log(`Overlay box: ${JSON.stringify(overlayBox)}`);
  }
  
  // Try to get all visible text inputs and their states
  const inputs = await page.evaluate(() => {
    const allInputs = document.querySelectorAll('input');
    const result = [];
    allInputs.forEach((inp, i) => {
      const style = window.getComputedStyle(inp);
      result.push({
        index: i,
        type: inp.type,
        placeholder: inp.placeholder,
        value: inp.value.substring(0, 50),
        disabled: inp.disabled,
        readOnly: inp.readOnly,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0,
        display: style.display,
        pointerEvents: style.pointerEvents
      });
    });
    return result;
  });
  
  console.log('📋 Input fields found:');
  inputs.forEach((inp, i) => {
    console.log(`  [${i}] type=${inp.type}, placeholder="${inp.placeholder}", value="${inp.value}", disabled=${inp.disabled}, visible=${inp.visible}, pointerEvents=${inp.pointerEvents}`);
  });
  
  // Try clicking on body first to dismiss any overlay
  console.log('\n🖱️ Clicking on body to dismiss potential overlay...');
  await page.click('body', { force: true });
  await page.waitForTimeout(1000);
  
  // Try to find and interact with the sitemap input
  console.log('\n🔍 Trying to find sitemap input field...');
  
  // Try different selectors for the sitemap URL input
  const selectors = [
    'input[placeholder*="sitemap" i]',
    'input[placeholder*="feed" i]',
    'input[aria-label*="sitemap" i]',
    'input[aria-label*="feed" i]',
    'input[type="text"]:not([type="search"]):not([type="email"]):not([type="password"]):not([type="hidden"])'
  ];
  
  let foundInput = null;
  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        const box = await el.boundingBox();
        if (box) {
          console.log(`Found potential input with "${sel}": box=${JSON.stringify(box)}`);
          foundInput = { el, selector: sel, box };
          break;
        }
      }
    } catch (e) {}
  }
  
  if (foundInput) {
    console.log(`\n✅ Attempting to fill sitemap input (${foundInput.selector})...`);
    try {
      await page.fill(foundInput.selector, 'https://www.tradego-fasteners.com/sitemap.xml', { force: true });
      console.log('✅ Filled successfully!');
      await page.waitForTimeout(1000);
      
      // Try to find submit button
      const submitSel = 'button[type="submit"], button:has-text("Submit"), button:has-text("Add"), button:has-text("Confirm")';
      const submitBtn = await page.$(submitSel);
      if (submitBtn) {
        console.log('🖱️ Clicking submit...');
        await submitBtn.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/gsc-debug-02-result.png', fullPage: true });
        console.log('📸 Result: /tmp/gsc-debug-02-result.png');
      }
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
    }
  } else {
    console.log('\n❌ Could not find sitemap input field');
  }
  
  // Get visible text content to understand the page
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('\n📄 Page content (first 2000 chars):');
  console.log(bodyText);
  
  await page.screenshot({ path: '/tmp/gsc-debug-final.png', fullPage: true });
  console.log('\n📸 Final screenshot: /tmp/gsc-debug-final.png');
  
  await browser.disconnect();
}

debugGSC().catch(e => { 
  console.error('❌ Error:', e.message); 
  process.exit(1); 
});
