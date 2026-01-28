#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');

async function runTest() {
  console.log('==========================================');
  console.log('External Sounds Download Test');
  console.log('==========================================\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleLogs = [];
  const networkRequests = [];

  // Capture console messages
  page.on('console', msg => {
    const log = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleLogs.push(log);
    if (msg.type() === 'error' || msg.text().includes('download') || msg.text().includes('sound')) {
      console.log(log);
    }
  });

  // Track network requests
  page.on('request', request => {
    if (request.url().includes('notateslaapp') || request.url().includes('audio')) {
      networkRequests.push({ method: 'REQUEST', url: request.url() });
    }
  });

  page.on('response', response => {
    if (response.url().includes('notateslaapp') || response.url().includes('audio')) {
      const status = response.status();
      const ok = status === 200 ? '✓' : '✗';
      networkRequests.push({ method: 'RESPONSE', status, url: response.url(), ok });
      console.log(`${ok} [${status}] ${response.url()}`);
    }
  });

  try {
    console.log('Step 1: Navigate to app');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('✓ App loaded\n');

    console.log('Step 2: Click "Not a Tesla App" filter to show external sounds');
    await page.click('text="Not a Tesla App"');
    await page.waitForTimeout(1000);
    console.log('✓ Filter applied\n');

    console.log('Step 3: Look for external sounds in the list');
    const externalSoundCount = await page.locator('text="Jarvis"').count();
    if (externalSoundCount > 0) {
      console.log('✓ Found "Jarvis Defense Protocol" sound\n');
    } else {
      console.log('✗ Could not find external sounds\n');
    }

    console.log('Step 4: Click on Jarvis Defense Protocol to trigger download');
    const jarvisButton = page.locator('text="Jarvis Defense Protocol"').first();
    await jarvisButton.click();
    console.log('✓ Clicked Jarvis sound\n');

    console.log('Step 5: Wait for download and playback');
    await page.waitForTimeout(5000);

    console.log('\nStep 6: Check network requests to notateslaapp.com');
    const audioRequests = networkRequests.filter(r => r.url.includes('notateslaapp'));

    if (audioRequests.length > 0) {
      console.log(`Found ${audioRequests.length} requests to notateslaapp.com:`);
      audioRequests.forEach(req => {
        if (req.method === 'RESPONSE') {
          console.log(`  ${req.ok} [${req.status}] ${req.url.split('/').pop()}`);
        }
      });
    } else {
      console.log('No requests to notateslaapp.com found');
    }

    console.log('\n==========================================');
    console.log('Test Summary');
    console.log('==========================================\n');

    // Look for download-related logs
    const downloadLogs = consoleLogs.filter(log =>
      log.includes('download') ||
      log.includes('failed') ||
      log.includes('success') ||
      log.includes('loading')
    );

    console.log('Download-related logs:');
    if (downloadLogs.length > 0) {
      downloadLogs.forEach(log => console.log('  ' + log));
    } else {
      console.log('  (none found - this is normal on web)');
    }

    console.log('\nLast 20 console messages:');
    consoleLogs.slice(-20).forEach(log => console.log('  ' + log));

    // Save report
    const report = `# External Sound Download Test Report\n\nGenerated: ${new Date().toISOString()}\n\n## Network Requests\n${networkRequests.map(r => `${r.method}: [${r.status || 'N/A'}] ${r.url}`).join('\n')}\n\n## Console Logs\n${consoleLogs.join('\n')}`;
    fs.writeFileSync('/tmp/external-sounds-test.txt', report);
    console.log('\n✓ Report saved to /tmp/external-sounds-test.txt');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
