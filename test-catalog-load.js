#!/usr/bin/env node

const { chromium } = require('playwright');

async function runTest() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('sound') || text.includes('catalog') || text.includes('external') || text.includes('Jarvis') || text.includes('error') || text.includes('warn')) {
      console.log(`[${msg.type().toUpperCase()}] ${text}`);
    }
  });

  try {
    console.log('Loading app...');
    await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    console.log('\n=== Checking DOM structure ===\n');

    // Check if sounds exist in DOM
    const allText = await page.evaluate(() => document.body.innerText);

    console.log('Looking for key strings in page:');
    console.log('  "Digital Chime":', allText.includes('Digital Chime') ? '✓ FOUND' : '✗ NOT FOUND');
    console.log('  "Jarvis":', allText.includes('Jarvis') ? '✓ FOUND' : '✗ NOT FOUND');
    console.log('  "Built-in":', allText.includes('Built-in') ? '✓ FOUND' : '✗ NOT FOUND');
    console.log('  "Not a Tesla App":', allText.includes('Not a Tesla App') ? '✓ FOUND' : '✗ NOT FOUND');

    // Check sound items
    const soundButtons = await page.locator('button').count();
    console.log(`\nFound ${soundButtons} buttons in the page`);

    // Look for text nodes
    const digitals = await page.locator('text=/Digital Chime/i').count();
    const jarvises = await page.locator('text=/Jarvis/i').count();

    console.log(`\nLocator results:`);
    console.log(`  "Digital Chime" matches: ${digitals}`);
    console.log(`  "Jarvis" matches: ${jarvises}`);

    // Check React state
    console.log('\n=== React Component State ===\n');
    const componentState = await page.evaluate(() => {
      // Try to find React internals (might not work in all cases)
      const root = document.getElementById('root');
      if (!root) return 'Root element not found';
      return `Root element found: ${root.innerHTML.substring(0, 100)}...`;
    });
    console.log(componentState);

    // Take a screenshot
    await page.screenshot({ path: '/tmp/catalog-test-screenshot.png' });
    console.log('\n✓ Screenshot saved to /tmp/catalog-test-screenshot.png');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
