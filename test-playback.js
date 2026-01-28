/**
 * Playwright test script for TeslaDrive sound playback and download diagnostics
 * Tests bundled sound playback and external sound download failures
 * Captures console logs, network requests, errors, and screenshots
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TEST_DIR = 'test-results';
const SCREENSHOT_DIR = path.join(TEST_DIR, 'screenshots');
const LOG_FILE = path.join(TEST_DIR, 'test-report.txt');

// Ensure test directories exist
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Report log
let report = '';
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}`;
  console.log(logEntry);
  report += logEntry + '\n';
}

async function runTest() {
  const browser = await chromium.launch({
    headless: false, // Set to true for CI/CD
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set up console message listener
    page.on('console', (msg) => {
      const logType = msg.type().toUpperCase();
      log(`[CONSOLE ${logType}] ${msg.text()}`);
    });

    // Set up page error listener
    page.on('pageerror', (error) => {
      log(`[PAGE ERROR] ${error.message}\n${error.stack}`);
    });

    // Track network requests and responses
    const networkRequests = [];
    const networkErrors = [];

    page.on('request', (request) => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString(),
        resourceType: request.resourceType(),
      });
    });

    page.on('response', (response) => {
      const isError = response.status() >= 400;
      if (isError) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date().toISOString(),
          resourceType: response.request().resourceType(),
        });
        log(`[NETWORK ERROR] ${response.status()} ${response.statusText()} - ${response.url()}`);
      }
    });

    log('='.repeat(80));
    log('TESLAUDS SOUND PLAYBACK TEST REPORT');
    log('='.repeat(80));
    log('');

    // Step 1: Start dev server
    log('STEP 1: Starting Expo dev server on localhost:8081');
    log('Command: npm start --web');
    log('Waiting 3 seconds for server to start...');

    // Wait for server startup
    await page.waitForTimeout(3000);

    // Step 2: Navigate to app
    log('STEP 2: Navigating to http://localhost:8081');
    try {
      await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 30000 });
      log('Successfully loaded app');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-app-loaded.png') });
    } catch (error) {
      log(`ERROR loading app: ${error.message}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-app-load-error.png') });
    }

    // Step 3: Wait for sounds to load
    log('STEP 3: Waiting for sounds list to load');
    try {
      await page.waitForSelector('[data-testid="sound-list"], .soundList', { timeout: 10000 }).catch(() => {
        log('Note: Sound list selector not found, proceeding anyway');
      });
      await page.waitForTimeout(2000);
      log('Sounds list loaded');
    } catch (error) {
      log(`Note: ${error.message}`);
    }

    // Step 4: Test bundled sound playback
    log('');
    log('='.repeat(80));
    log('TEST 1: BUNDLED SOUND PLAYBACK');
    log('='.repeat(80));
    log('');
    log('Looking for first bundled sound (Lock Sounds tab should be active)');

    // Find all sound items
    const soundItems = await page.locator('text=Digital Chime, Sci-Fi Beep, Soft Bell, Electric Zap, Future Lock, Notification Ping, Retro Game, Crystal Ding, Robot Voice, Horn Melody').all().catch(async () => {
      // Fallback: look for any clickable sound items
      return await page.locator('[role="button"]').filter({ hasText: /Digital|Beep|Bell|Zap|Notification/ }).all();
    });

    let bundledSoundFound = false;
    if (soundItems.length > 0) {
      // Try to find "Digital Chime" specifically
      const digitalChime = await page.locator('text="Digital Chime"').first().catch(() => null);

      if (digitalChime) {
        bundledSoundFound = true;
        log('Found "Digital Chime" bundled sound');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-before-bundled-sound-click.png') });

        log('Clicking to play bundled sound...');
        await digitalChime.click();

        // Wait to see if audio plays (check for loading/playing indicators)
        await page.waitForTimeout(1000);

        // Check for loading indicator
        const loadingSpinner = await page.locator('activity-indicator, [aria-busy="true"]').first().catch(() => null);
        if (loadingSpinner) {
          log('Loading indicator shown');
          await page.waitForTimeout(2000);
        }

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-after-bundled-sound-click.png') });
        log('Bundled sound playback triggered');
      }
    }

    if (!bundledSoundFound) {
      log('WARNING: Could not find bundled sound "Digital Chime"');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-bundled-sound-not-found.png') });
    }

    // Step 5: Scroll to external sounds
    log('');
    log('Scrolling to find external sounds (if visible on screen)');
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-scroll-view.png') });

    // Step 6: Test external sound download/playback
    log('');
    log('='.repeat(80));
    log('TEST 2: EXTERNAL SOUND DOWNLOAD AND PLAYBACK');
    log('='.repeat(80));
    log('');

    // Try to find and click an external sound (e.g., from Not a Tesla App or TeslaDeck)
    const externalSoundSelectors = [
      'text="Jarvis Defense Protocol"',
      'text="Darth Vader Breathing"',
      'text="Inception Horn"',
      'text="Super Mario Coin"',
      'text="Interstellar Theme"',
      'text="Thanos Snap"',
    ];

    let externalSoundFound = false;
    for (const selector of externalSoundSelectors) {
      const soundElement = await page.locator(selector).first().catch(() => null);
      if (soundElement && await soundElement.isVisible().catch(() => false)) {
        log(`Found external sound: ${selector.replace('text="', '').replace('"', '')}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-before-external-sound-click.png') });

        log('Clicking to download and play external sound...');
        await soundElement.click();

        // Wait and check for download
        await page.waitForTimeout(2000);

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-after-external-sound-click.png') });
        log('External sound click triggered (download may have been attempted)');
        externalSoundFound = true;
        break;
      }
    }

    if (!externalSoundFound) {
      log('WARNING: Could not find any external sounds to test');
      // Check if we're on the right tab
      const lockSoundsTab = await page.locator('text="Lock Sounds"').first().catch(() => null);
      if (lockSoundsTab) {
        log('Attempting to click Lock Sounds tab to ensure visibility');
        await lockSoundsTab.click();
        await page.waitForTimeout(1000);
      }
    }

    // Step 7: Analyze network activity
    log('');
    log('='.repeat(80));
    log('NETWORK ANALYSIS');
    log('='.repeat(80));
    log('');
    log(`Total network requests: ${networkRequests.length}`);
    log('');

    // Filter audio-related requests
    const audioRequests = networkRequests.filter(r =>
      r.url.includes('.wav') ||
      r.url.includes('.mp3') ||
      r.url.includes('audio') ||
      r.url.includes('sound')
    );

    log(`Audio-related requests: ${audioRequests.length}`);
    if (audioRequests.length > 0) {
      log('');
      log('Audio Requests Details:');
      audioRequests.forEach((req, idx) => {
        log(`  ${idx + 1}. ${req.method} ${req.url}`);
        log(`     Resource Type: ${req.resourceType}`);
        log(`     Time: ${req.timestamp}`);
      });
    }

    log('');
    log(`Failed requests (4xx/5xx errors): ${networkErrors.length}`);
    if (networkErrors.length > 0) {
      log('');
      log('Failed Request Details:');
      networkErrors.forEach((error, idx) => {
        log(`  ${idx + 1}. ${error.status} ${error.statusText}`);
        log(`     URL: ${error.url}`);
        log(`     Type: ${error.resourceType}`);
        log(`     Time: ${error.timestamp}`);
      });
    }

    // Step 8: Check for external sound URLs being requested
    log('');
    log('='.repeat(80));
    log('EXTERNAL SOUND URL ANALYSIS');
    log('='.repeat(80));
    log('');

    const externalSoundDomains = [
      'www.notateslaapp.com',
      'tesladeck.com',
      'via.placeholder.com'
    ];

    externalSoundDomains.forEach(domain => {
      const requestsForDomain = networkRequests.filter(r => r.url.includes(domain));
      const errorsForDomain = networkErrors.filter(e => e.url.includes(domain));

      if (requestsForDomain.length > 0 || errorsForDomain.length > 0) {
        log(`Domain: ${domain}`);
        log(`  Requests: ${requestsForDomain.length}`);
        if (errorsForDomain.length > 0) {
          log(`  Failed: ${errorsForDomain.length}`);
          errorsForDomain.forEach(e => {
            log(`    - ${e.status} ${e.statusText}`);
          });
        }
      }
    });

    // Step 9: Browser console logs analysis
    log('');
    log('='.repeat(80));
    log('CONSOLE OUTPUT ANALYSIS');
    log('='.repeat(80));
    log('(See full console logs above)');
    log('');

    // Step 10: Summary and findings
    log('');
    log('='.repeat(80));
    log('SUMMARY AND FINDINGS');
    log('='.repeat(80));
    log('');

    if (bundledSoundFound) {
      log('[PASS] Bundled sound found and clickable');
    } else {
      log('[FAIL] Bundled sound not found');
    }

    if (externalSoundFound) {
      log('[INFO] External sound found and clicked');
      if (networkErrors.length === 0) {
        log('[PASS] No download errors detected');
      } else {
        log(`[WARN] ${networkErrors.length} network errors detected during download`);
      }
    } else {
      log('[WARN] External sound not found or visible');
    }

    // Expected external sound URLs that should fail
    const expectedExternalURLs = [
      'https://www.notateslaapp.com/assets/audio/',
      'https://tesladeck.com/sounds/'
    ];

    log('');
    log('Expected External Sound URLs (should be requested if download attempted):');
    expectedExternalURLs.forEach(url => {
      const found = networkRequests.some(r => r.url.includes(url));
      log(`  ${url}... ${found ? '[REQUESTED]' : '[NOT REQUESTED]'}`);
    });

    log('');
    log('Key Issues Identified:');
    if (networkErrors.some(e => e.url.includes('notateslaapp.com') || e.url.includes('tesladeck.com'))) {
      log('1. External sound URLs return HTTP errors (404/other failures)');
      log('   Reason: These are placeholder URLs in externalSounds.json');
      log('   Fix: Use real, accessible URLs or mock server for testing');
    }

    if (audioRequests.length === 0) {
      log('1. No audio files were requested');
      log('   Reason: Either sounds weren\'t clicked or audio loading failed');
    }

    log('');
    log('='.repeat(80));
    log('TEST COMPLETE');
    log('='.repeat(80));

    // Save full report
    fs.writeFileSync(LOG_FILE, report);
    log('');
    log(`Full report saved to: ${LOG_FILE}`);
    log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    log(`FATAL ERROR: ${error.message}`);
    log(error.stack);
  } finally {
    await browser.close();
  }
}

// Run the test
runTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
