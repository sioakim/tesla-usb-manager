# TeslaDrive Audio Playback & Download Test Suite

## Quick Start

```bash
# Run the complete test (automatic setup and cleanup)
chmod +x run-test.sh
./run-test.sh
```

Results will be in `test-results/` directory.

---

## What You Get

### Generated Files

1. **`test-results/test-report.txt`** - Complete diagnostic report
   - All console logs (errors, warnings, info)
   - All network requests and failures
   - Step-by-step test execution logs
   - Summary with findings

2. **`test-results/screenshots/`** - Visual progression
   - `01-app-loaded.png` - App after page load
   - `02-before-bundled-sound-click.png` - Before clicking bundled sound
   - `03-after-bundled-sound-click.png` - After clicking bundled sound
   - `04-scroll-view.png` - Scrolled view
   - `05-before-external-sound-click.png` - Before external sound click
   - `06-after-external-sound-click.png` - After external sound click

### Key Information in Report

```
NETWORK ANALYSIS
├── Total requests
├── Audio-related requests
└── Failed requests (404, CORS, etc.)

CONSOLE OUTPUT ANALYSIS
├── Audio playback logs
├── Download attempt logs
└── Error messages

EXTERNAL SOUND URL ANALYSIS
├── notateslaapp.com requests
└── tesladeck.com requests

SUMMARY AND FINDINGS
├── [PASS/FAIL] Bundled sound test
├── [PASS/FAIL] External sound test
└── Key issues identified
```

---

## Running the Test

### Automated (Recommended)

```bash
./run-test.sh
```

This does everything:
1. Installs dependencies if needed
2. Kills any existing Expo servers
3. Starts new Expo dev server
4. Waits for server to be ready
5. Runs Playwright test
6. Generates report and screenshots
7. Cleans up processes
8. Shows results summary

### Manual (For Debugging)

**Terminal 1 - Start the server:**
```bash
npm install  # If needed
npm start --web
# Wait until you see: "Expo is running..." or "Ready on http://localhost:8081"
```

**Terminal 2 - Run the test:**
```bash
# Wait 10+ seconds for server to fully start
node test-playback.js
```

---

## Understanding the Test

### What It Does

1. **Starts Expo dev server** on localhost:8081
2. **Opens app in Chromium browser** with debugging enabled
3. **Captures console logs** - All logging from app
4. **Monitors network** - All HTTP requests and failures
5. **Tests bundled sounds** - Clicks "Digital Chime" sound
6. **Tests external downloads** - Clicks "Jarvis Defense Protocol" and waits for download
7. **Captures screenshots** - At each major step
8. **Generates report** - Complete findings and analysis

### Why the Test Is Useful

- **Bundled sounds should work** - Tests that local audio playback is functional
- **External sounds will fail** - Confirms that placeholder URLs in externalSounds.json need to be replaced
- **Shows network errors** - Identifies exactly why downloads fail (404, CORS, etc.)
- **Captures all logs** - Useful for debugging without opening DevTools manually
- **Visual evidence** - Screenshots prove what happened at each step

---

## Expected Test Results

### What You'll See

#### Success Indicators
```
[PASS] Bundled sound found and clickable
[INFO] External sound found and clicked
[CONSOLE LOG] Playback started successfully
```

#### Expected Failures
```
[NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/...
[CONSOLE ERROR] Failed to download sound: Error: Download failed
[WARN] Network errors detected during download
```

#### Key Issues
```
Key Issues Identified:
1. External sound URLs return HTTP errors (404)
   Reason: These are placeholder URLs in externalSounds.json
   Fix: Use real, accessible URLs or mock server for testing
```

---

## Interpreting Results

### In `test-report.txt`

#### Audio Playback Logs
```
[CONSOLE LOG] Playing bundled sound: Digital Chime URI type: number
[CONSOLE LOG] useAudioPlayer.playSound - Starting playback...
[CONSOLE LOG] Loading new sound: 1
[CONSOLE LOG] Sound loaded successfully. Status: { isLoaded: true, duration: 1000 }
[CONSOLE LOG] Starting playback: 1
[CONSOLE LOG] Playback started successfully
```

This means bundled sounds work correctly.

#### Download Failure Logs
```
[CONSOLE LOG] Playing bundled sound: Jarvis Defense Protocol URI type: string
[NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
[CONSOLE ERROR] Failed to download sound: Error: Download failed
```

This means external sound download failed (expected - URL is placeholder).

#### Network Request Summary
```
Audio-related requests: 2
  1. GET https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
  2. GET http://localhost:8081/assets/sounds/digital-chime.wav

Failed requests (4xx/5xx errors): 1
  1. 404 Not Found
     URL: https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
```

### In Screenshots

| Screenshot | What to Look For |
|-----------|-----------------|
| `01-app-loaded.png` | App UI loaded, tabs visible, "Lock Sounds" active |
| `02-before-bundled-sound-click.png` | "Digital Chime" sound item visible, play icon shown |
| `03-after-bundled-sound-click.png` | Loading spinner may appear briefly |
| `04-scroll-view.png` | External sounds visible below bundled sounds |
| `05-before-external-sound-click.png` | External sound (e.g., "Jarvis Defense Protocol") visible |
| `06-after-external-sound-click.png` | Loading spinner, then error/alert may appear |

---

## Troubleshooting

### Issue: "Server failed to start after 30 seconds"

```bash
# Check what's running on port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>

# Try again
./run-test.sh
```

### Issue: "Playwright not found"

```bash
# Install Playwright
npm install --save-dev @playwright/test playwright

# Install browsers
npx playwright install
```

### Issue: Test hangs or times out

The test has a 30-second timeout for page load. If it hangs:

```bash
# Kill the script
Ctrl+C

# Check Expo server logs
tail -f /tmp/expo-server.log

# Manually kill Expo server
pkill -f "expo start"

# Clean and restart
rm -rf .expo node_modules/.bin/expo
npm install
```

### Issue: No audio files found

Make sure audio assets exist:

```bash
ls -la assets/sounds/
# Should show: digital-chime.wav, sci-fi-beep.wav, etc.
```

If missing, create dummy WAV files or download from Pixabay.

### Issue: Screenshots not generated

Check disk space and permissions:

```bash
# Check disk space
df -h

# Check permissions
ls -la test-results/screenshots/

# Fix permissions if needed
chmod -R 755 test-results/
```

---

## Manual Testing (Alternative)

If you prefer to test manually:

```bash
# Start dev server
npm start --web

# Open in browser
open http://localhost:8081
# or
firefox http://localhost:8081

# Open DevTools (F12)
# Go to Console tab

# Click on a bundled sound (e.g., Digital Chime)
# Look for "Playback started successfully" in console

# Click on external sound (e.g., Jarvis Defense Protocol)
# Look for 404 errors in Network tab and console
```

---

## Analyzing the Report

### Step 1: Check for Errors
```bash
grep -i "error\|failed\|404" test-results/test-report.txt
```

### Step 2: Check Network Requests
```bash
grep -i "network\|request\|https://" test-results/test-report.txt
```

### Step 3: Check Audio Logs
```bash
grep -i "audio\|playback\|sound" test-results/test-report.txt
```

### Step 4: View Full Report
```bash
cat test-results/test-report.txt

# Or with less for pagination
less test-results/test-report.txt
```

---

## Key Files Referenced by Test

### App Code
- `app/(tabs)/index.tsx` - Sound list and playback logic
- `hooks/useAudioPlayer.ts` - Audio playback (expo-av)
- `hooks/useDownloadedSounds.ts` - Download management
- `services/soundDownloadService.ts` - File downloads
- `constants/externalSounds.json` - External sound URLs

### Test Files
- `test-playback.js` - Main test script
- `run-test.sh` - Test runner script
- `PLAYBACK_DIAGNOSTIC_GUIDE.md` - Detailed diagnostic guide
- `AUDIO_PLAYBACK_ANALYSIS.md` - Technical analysis
- `TEST_README.md` - This file

---

## Next Steps After Testing

### If Bundled Sounds Work (Expected)
- Bundled sounds should play without issues
- Audio API is configured correctly

### If External Sounds Fail (Expected)
1. Review `AUDIO_PLAYBACK_ANALYSIS.md` for details
2. Replace placeholder URLs in `constants/externalSounds.json`
3. Use real audio file URLs or set up a mock server
4. Re-run test to verify downloads now work

### To Fix External Sounds
```javascript
// In constants/externalSounds.json
// Replace this:
"audioUrl": "https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav"

// With real URLs:
"audioUrl": "https://your-server.com/sounds/ironman-jarvis.wav"
// or
"audioUrl": "http://localhost:3000/sounds/ironman-jarvis.wav"
```

---

## Test Execution Flow

```
./run-test.sh
    ↓
Check dependencies (npm list @playwright/test)
    ↓
Kill existing Expo servers
    ↓
npm start --web (in background)
    ↓
Wait 10 seconds for server startup
    ↓
Verify server is ready (curl http://localhost:8081)
    ↓
node test-playback.js
    ├─ Launch browser
    ├─ Navigate to localhost:8081
    ├─ Wait for page load
    ├─ Click bundled sound ("Digital Chime")
    ├─ Wait 2 seconds
    ├─ Take screenshot
    ├─ Scroll and find external sounds
    ├─ Click external sound ("Jarvis Defense Protocol")
    ├─ Wait 2 seconds
    ├─ Take screenshot
    ├─ Collect all console logs and network errors
    ├─ Generate test-report.txt
    └─ Close browser
    ↓
Kill Expo server
    ↓
Display results
    ↓
Exit
```

---

## Report Location

After running the test, find results at:

```
test-results/
├── test-report.txt          # Full diagnostic report
└── screenshots/
    ├── 01-app-loaded.png
    ├── 02-before-bundled-sound-click.png
    ├── 03-after-bundled-sound-click.png
    ├── 04-scroll-view.png
    ├── 05-before-external-sound-click.png
    └── 06-after-external-sound-click.png
```

View the report:
```bash
cat test-results/test-report.txt

# View specific sections
grep "SUMMARY AND FINDINGS" -A 20 test-results/test-report.txt
```

---

## Tips

- Run test in morning/evening when network is stable
- Keep other apps closed to reduce noise in network logs
- Check `/tmp/expo-server.log` if server fails to start
- Use `npm run web` instead of `npm start -- --web` if needed
- Test on different networks (WiFi vs cellular) for CORS issues

---

## Questions?

Refer to:
- `PLAYBACK_DIAGNOSTIC_GUIDE.md` - Comprehensive diagnostic guide
- `AUDIO_PLAYBACK_ANALYSIS.md` - Technical deep dive
- Test script comments in `test-playback.js`
- Expo docs: https://docs.expo.dev/versions/latest/sdk/audio/

---

## Success Criteria

- [ ] Test runs without crashing
- [ ] Screenshots are captured
- [ ] test-report.txt is generated
- [ ] Bundled sound shows playback logs
- [ ] External sound shows 404 errors
- [ ] You can identify the exact issue (placeholder URLs)
