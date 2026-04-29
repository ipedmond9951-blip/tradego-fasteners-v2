/**
 * GSC Sitemap Submission Script
 * Uses Chrome DevTools Protocol via Playwright to submit sitemap to Google Search Console
 */

const { chromium } = require('playwright');

async function submitSitemap() {
  console.log('🔍 Starting GSC Sitemap Submission...\n');

  // Connect to existing Chrome with remote debugging
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  
  // Get all pages/tabs
  const context = browser.contexts()[0];
  const pages = context.pages();
  
  console.log(`Found ${pages.length} existing page(s)`);
  
  // Create a new page/tab for GSC
  const gscPage = await context.newPage();
  console.log('📄 Created new tab for GSC\n');

  try {
    // Navigate to Google Search Console Sitemaps
    console.log('🔗 Navigating to Google Search Console...');
    await gscPage.goto('https://search.google.com/search-console/sitemaps', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to load
    await gscPage.waitForTimeout(3000);

    // Get current URL to check if we're logged in
    const currentUrl = gscPage.url();
    console.log(`Current URL: ${currentUrl}\n`);

    if (currentUrl.includes('signin')) {
      console.log('❌ Not logged in to Google. Please sign in manually.');
      console.log('👤 Opening sign-in page...');
      await gscPage.goto('https://accounts.google.com/signin', { waitUntil: 'networkidle' });
      console.log('Please complete sign-in in the Chrome window, then run this script again.');
    } else {
      console.log('✅ Logged in to Google!\n');

      // Take a screenshot to see the current state
      await gscPage.screenshot({ path: '/tmp/gsc-sitemap.png', fullPage: true });
      console.log('📸 Screenshot saved to /tmp/gsc-sitemap.png\n');

      // Try to find and click the sitemap submission interface
      // Look for the "Add Sitemap" or "Submit" button
      const pageContent = await gscPage.content();
      
      // Check if we can see sitemap list
      if (pageContent.includes('sitemap') || pageContent.includes('Sitemap')) {
        console.log('📋 Sitemap interface detected!');
        
        // Look for any submit/add buttons
        const addButton = await gscPage.$('button:has-text("Add")');
        const submitButton = await gscPage.$('button:has-text("Submit")');
        
        if (addButton) {
          console.log('🖱️ Found "Add" button, clicking...');
          await addButton.click();
          await gscPage.waitForTimeout(2000);
        } else if (submitButton) {
          console.log('🖱️ Found "Submit" button, clicking...');
          await submitButton.click();
          await gscPage.waitForTimeout(2000);
        }
        
        // Try to find input field for sitemap URL
        const input = await gscPage.$('input[type="text"]');
        if (input) {
          console.log('⌨️ Found input field, entering sitemap URL...');
          await input.fill('https://www.tradego-fasteners.com/sitemap.xml');
          await gscPage.waitForTimeout(1000);
          
          // Look for confirm/submit button
          const confirmButton = await gscPage.$('button:has-text("Submit"), button:has-text("Add"), button:has-text("Confirm")');
          if (confirmButton) {
            console.log('🖱️ Submitting sitemap...');
            await confirmButton.click();
            await gscPage.waitForTimeout(3000);
          }
        }
        
        // Take final screenshot
        await gscPage.screenshot({ path: '/tmp/gsc-result.png', fullPage: true });
        console.log('📸 Final screenshot saved to /tmp/gsc-result.png\n');
        
        console.log('✅ Sitemap submission attempted!');
        console.log('📝 Please verify in GSC that the sitemap was submitted successfully.');
      } else {
        console.log('⚠️ Could not detect sitemap interface. Manual submission may be required.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Keep browser connected for user to review
    console.log('\n🔵 Browser session kept open. Close when done.');
    // await browser.close();
  }
}

submitSitemap().catch(console.error);
