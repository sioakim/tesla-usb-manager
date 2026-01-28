#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTest() {
  console.log('==========================================');
  console.log('Simple Sound Playback Test');
  console.log('==========================================\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleLogs = [];
  const pageErrors = [];

  // Capture console messages
  page.on('console', msg => {
    const log = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleLogs.push(log);
    console.log(log);
  });

  // Capture page errors
  page.on('pageerror', error => {
    const err = `[PAGE ERROR] ${error.message}`;
    pageErrors.push(err);
    console.error(err);
  });

  try {
    console.log('Step 1: Navigate to app');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    console.log('✓ App loaded\n');

    // Wait for page to settle
    await page.waitForTimeout(3000);

    console.log('Step 2: Check if sounds are visible in the DOM');
    const soundCount = await page.locator('text=Digital Chime').count();
    if (soundCount > 0) {
      console.log('✓ Found "Digital Chime" sound in DOM\n');
    } else {
      console.log('✗ Could not find "Digital Chime" sound\n');
    }

    console.log('Step 3: Get HTML content of sounds container');
    const scrollView = await page.locator('div').filter({ hasText: 'Digital Chime' }).first();
    const soundsHtml = await page.locator('body').innerHTML();

    if (soundsHtml.includes('Digital Chime')) {
      console.log('✓ "Digital Chime" found in HTML\n');
    }

    console.log('Step 4: Try to click on Digital Chime');
    try {
      const digitalChimeButton = page.locator('text="Digital Chime"').first();
      await digitalChimeButton.click();
      console.log('✓ Clicked on Digital Chime\n');

      // Wait a bit for playback to start
      await page.waitForTimeout(2000);

      console.log('Step 5: Check console logs for playback messages');
      const playbackLogs = consoleLogs.filter(log =>
        log.includes('playSound') ||
        log.includes('Playback') ||
        log.includes('Loading')
      );

      if (playbackLogs.length > 0) {
        console.log('✓ Found playback-related logs:');
        playbackLogs.forEach(log => console.log('  ' + log));
      } else {
        console.log('✗ No playback logs found');
        console.log('All console logs:', consoleLogs.slice(-10));
      }
    } catch (clickError) {
      console.log('✗ Failed to click:', clickError.message);
    }

    console.log('\n==========================================');
    console.log('Test Summary');
    console.log('==========================================\n');
    console.log('Total console logs:', consoleLogs.length);
    console.log('Page errors:', pageErrors.length);

    if (pageErrors.length > 0) {
      console.log('\nPage Errors:');
      pageErrors.forEach(err => console.log('  ' + err));
    }

    console.log('\nLast 15 console messages:');
    consoleLogs.slice(-15).forEach(log => console.log('  ' + log));

    // Save report
    const reportContent = `# Sound Playback Test Report\n\nGenerated: ${new Date().toISOString()}\n\n## Console Logs\n${consoleLogs.join('\n')}\n\n## Page Errors\n${pageErrors.join('\n')}`;
    fs.writeFileSync('/tmp/sound-test-report.txt', reportContent);
    console.log('\n✓ Report saved to /tmp/sound-test-report.txt');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
