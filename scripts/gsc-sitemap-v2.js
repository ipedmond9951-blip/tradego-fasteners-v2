/**
 * GSC Sitemap Submit - v2 (more stable)
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('🔍 Connecting to Chrome...\n');
  
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  
  // Create new page for GSC
  const page = await context.newPage();
  
  console.log('🌐 Navigating to GSC Sitemaps...');
  
  // Navigate with domcontentloaded instead of networkidle (faster and more reliable)
  await page.goto('https://search.google.com/search-console/sitemaps', { 
    waitUntil: 'domcontentloaded', 
    timeout: 30000 
  });
  
  // Wait for page to be interactive
  await page.waitForTimeout(5000);
  
  console.log(`URL: ${page.url()}\n`);
  
  // Take screenshot of current state
  await page.screenshot({ path: '/tmp/gsc-01-initial.png', fullPage: true });
  console.log('📸 Initial state: /tmp/gsc-01-initial.png\n');

  // Look for the sitemap input form
  // GSC sitemap interface usually has an input field near "Add Sitemap" button
  
  // Try to find and click the "Add Sitemap" button first
  console.log('🔍 Looking for sitemap input interface...');
  
  // Method 1: Look for any text input that might be for sitemap URL
  const inputs = await page.$$('input[type="text"], input[type="url"], input:not([type])');
  console.log(`Found ${inputs.length} text inputs`);
  
  // Method 2: Try to find buttons with "Add", "Submit", "Sitemap" text
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text && (text.toLowerCase().includes('add') || text.toLowerCase().includes('submit') || text.toLowerCase().includes('sitemap'))) {
      console.log(`Found button: "${text.trim()}"`);
    }
  }
  
  // Method 3: Check for any form elements
  const forms = await page.$$('form');
  console.log(`Found ${forms.length} forms`);
  
  // Try clicking whatever "Add" or submit button exists
  try {
    // Look for primary action button (usually has darker background)
    const addBtn = await page.$('button.primary, button[aria-label*="add" i], button[aria-label*="sitemap" i]');
    if (addBtn) {
      console.log('\n🖱️ Clicking add sitemap button...');
      await addBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/tmp/gsc-02-after-click.png', fullPage: true });
      console.log('📸 After click: /tmp/gsc-02-after-click.png\n');
    }
  } catch (e) {
    console.log(`Button click error: ${e.message}`);
  }
  
  // Check the page content for any error messages or forms
  const content = await page.content();
  
  // If we see a dialog or modal, try to fill it
  if (content.includes('dialog') || content.includes('modal') || content.includes('overlay')) {
    console.log('📋 Detected dialog/modal, trying to interact...');
    
    // Find any visible text input
    const visibleInput = await page.$('input:visible');
    if (visibleInput) {
      console.log('⌨️ Found visible input, entering sitemap URL...');
      await visibleInput.fill('https://www.tradego-fasteners.com/sitemap.xml');
      await page.waitForTimeout(1000);
      
      // Look for submit/confirm button
      const submitBtn = await page.$('button[type="submit"], button:has-text("Submit"), button:has-text("Add")');
      if (submitBtn) {
        console.log('🖱️ Submitting...');
        await submitBtn.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/gsc-03-after-submit.png', fullPage: true });
        console.log('📸 Result: /tmp/gsc-03-after-submit.png\n');
      }
    }
  }
  
  // Final state
  console.log('\n📋 Final page state:');
  console.log(`URL: ${page.url()}`);
  await page.screenshot({ path: '/tmp/gsc-final.png', fullPage: true });
  console.log('📸 Final: /tmp/gsc-final.png\n');
  
  await browser.disconnect();
  console.log('✅ Done!');
}

submitSitemap().catch(e => { 
  console.error('❌ Error:', e.message); 
  process.exit(1); 
});
