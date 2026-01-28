# TeslaDrive Sound Playback & Download Diagnostic Guide

## Overview

This guide explains how to use the Playwright test script (`test-playback.js`) to diagnose sound playback and download issues in the TeslaDrive React Native Expo web app.

## What the Test Does

The test script performs the following diagnostics:

1. **Starts Expo dev server** on `localhost:8081` (web platform)
2. **Opens the app** in a Chromium browser with full debugging
3. **Tests bundled sound playback** (e.g., "Digital Chime")
4. **Tests external sound download** (e.g., from NotATeslaApp or TeslaDeck sources)
5. **Captures network traffic** including failed requests
6. **Records console logs** (errors, warnings, info)
7. **Takes screenshots** at each step
8. **Generates a detailed report** with findings

## Running the Test

### Quick Start (Automated)

```bash
chmod +x run-test.sh
./run-test.sh
```

This script will:
- Install dependencies if needed
- Start the Expo dev server
- Run the Playwright test
- Generate test results in `test-results/` directory
- Clean up and exit

### Manual Run

```bash
# Terminal 1: Start Expo dev server
npm start --web

# Terminal 2: Run the test (after server starts)
node test-playback.js
```

## Test Results

Results are saved in the `test-results/` directory:

### Files Generated

- **`test-report.txt`** - Full diagnostic report with all console logs and network activity
- **`screenshots/01-app-loaded.png`** - App after initial load
- **`screenshots/02-before-bundled-sound-click.png`** - Before clicking bundled sound
- **`screenshots/03-after-bundled-sound-click.png`** - After clicking bundled sound
- **`screenshots/04-scroll-view.png`** - Scrolled view to find external sounds
- **`screenshots/05-before-external-sound-click.png`** - Before clicking external sound
- **`screenshots/06-after-external-sound-click.png`** - After clicking external sound

## Key Diagnostic Information

### 1. Bundled Sound Playback

**Expected behavior:**
- User clicks "Digital Chime" (or other bundled sound)
- Loading spinner appears briefly
- Audio plays (silent in headless browser, but logs show "Playback started")
- Console shows: `useAudioPlayer.playSound - Starting playback`

**What to look for in logs:**
```
[CONSOLE LOG] useAudioPlayer.playSound - Starting playback { soundId: '1', uriType: 'number' }
[CONSOLE LOG] Loading new sound: 1
[CONSOLE LOG] Sound loaded successfully. Status: { isLoaded: true, duration: 1000 }
[CONSOLE LOG] Starting playback: 1
[CONSOLE LOG] Playback started successfully
```

**Common issues:**
- Audio element fails to load (check browser audio policy)
- File not found (check `assets/sounds/` directory exists)
- Audio mode not initialized (check `useAudioPlayer.ts` initialization)

---

### 2. External Sound Download

**Expected behavior:**
- User clicks "Jarvis Defense Protocol" (or other external sound)
- Download starts from external URL
- Loading spinner appears
- Once downloaded, audio plays

**URLs being requested:**
```
https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
https://tesladeck.com/sounds/interstellar-theme.wav
https://via.placeholder.com/300x200?text=... (thumbnails)
```

**What to look for in logs:**
```
[CONSOLE LOG] Playing bundled sound: Jarvis Defense Protocol URI type: string
[CONSOLE LOG] useAudioPlayer.playSound - Starting playback { soundId: 'notateslaapp-ironman-jarvis', uriType: 'string' }
[CONSOLE LOG] Failed to download sound: [Error message]
```

---

## Why Downloads Fail

### Issue 1: Fake/Placeholder URLs

The external sound URLs in `constants/externalSounds.json` are **placeholders and don't actually exist**:

```json
{
  "id": "notateslaapp-ironman-jarvis",
  "audioUrl": "https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav"
}
```

**Expected test output:**
```
[NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
```

**Why:**
- The JSON file uses example URLs for demonstration
- These URLs don't actually host audio files
- In production, you'd replace these with real URLs

### Issue 2: CORS Restrictions

Even if URLs were valid, browser CORS policies may block cross-origin downloads.

**What would appear in logs:**
```
[PAGE ERROR] TypeError: Failed to fetch
[NETWORK ERROR] 0 (Aborted/CORS) - https://www.notateslaapp.com/...
```

**Solution:** Server providing audio files must include proper CORS headers

### Issue 3: File System Limitations (Web)

In the web version, `expo-file-system` has limited functionality compared to native.

**What to look for:**
```
[CONSOLE ERROR] Failed to download sound: Error: File system operation not supported on web
```

---

## Code Flow Analysis

### Bundled Sound Flow
```
User clicks sound
  ↓
index.tsx handlePlaySound()
  ↓
Check: isBuiltIn? Yes
  ↓
uri = require('@/assets/sounds/digital-chime.wav')
  ↓
audioPlayer.playSound('1', uri)
  ↓
useAudioPlayer.ts playSound()
  ↓
Audio.Sound.createAsync({ uri })
  ↓
sound.playAsync()
  ↓
Audio plays (or logs "Playback started")
```

### External Sound Flow
```
User clicks external sound
  ↓
index.tsx handlePlaySound()
  ↓
Check: isBuiltIn? No, it's ExternalSound
  ↓
Check: isDownloaded(soundId)? No
  ↓
downloadSound(externalSound)
  ↓
hooks/useDownloadedSounds.ts downloadSound()
  ↓
soundDownloadService.downloadSound(sound)
  ↓
FileSystem.createDownloadResumable(sound.audioUrl, soundPath)
  ↓
downloadResumable.downloadAsync()
  ↓
[ERROR: URL doesn't exist or CORS issue]
  ↓
catch block: throw error
  ↓
Popup: "Failed to download sound"
```

---

## Analyzing Network Requests

The test logs all network requests and failures. Look for:

### Audio File Requests
```
[NETWORK REQUEST] GET https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
[NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
```

### Thumbnail Requests
```
[NETWORK REQUEST] GET https://via.placeholder.com/300x200?text=Iron+Man
[NETWORK RESPONSE] 200 OK - https://via.placeholder.com/300x200?text=Iron+Man
```

### Asset Requests
```
[NETWORK REQUEST] GET http://localhost:8081/fonts/...
[NETWORK REQUEST] GET http://localhost:8081/assets/sounds/digital-chime.wav
```

---

## Interpreting Test Results

### Success Indicators
- [PASS] Bundled sound found and clickable
- [PASS] No download errors detected (if you fixed URLs)
- Console shows "Playback started successfully"
- Screenshots show loading spinner appears/disappears

### Warning Indicators
- [WARN] External sound not found or visible
- [WARN] Network errors detected during download
- Missing console logs for audio initialization

### Failure Indicators
- [FAIL] Bundled sound not found
- Multiple 404/CORS errors for audio URLs
- PAGE ERROR in console logs

---

## How to Fix Issues

### Fix 1: Use Real Audio URLs

Replace placeholder URLs in `constants/externalSounds.json`:

```json
{
  "audioUrl": "https://real-domain.com/actual-audio-file.wav"
}
```

**Get real audio sources from:**
- Your own server
- CDN service (AWS S3, Firebase Storage, etc.)
- Free audio API (freesound.org, zapsplat.com)

### Fix 2: Add CORS Headers

If hosting on your own server, add CORS headers:

```javascript
// Express example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
```

### Fix 3: Use a Proxy

For testing with external URLs, use CORS proxy:

```javascript
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
audioUrl = proxyUrl + originalUrl;
```

### Fix 4: Mock Audio in Tests

For testing without real files, mock the service:

```javascript
// In test setup
soundDownloadService.downloadSound = jest.fn().mockResolvedValue('file:///mock/path.wav');
```

---

## Expected Test Output Example

```
[2026-01-28T12:00:00.000Z] TESLAUDS SOUND PLAYBACK TEST REPORT
[2026-01-28T12:00:00.100Z] STEP 1: Starting Expo dev server on localhost:8081
[2026-01-28T12:00:03.000Z] STEP 2: Navigating to http://localhost:8081
[2026-01-28T12:00:05.000Z] Successfully loaded app
[2026-01-28T12:00:07.000Z] Found "Digital Chime" bundled sound
[2026-01-28T12:00:07.500Z] Clicking to play bundled sound...
[2026-01-28T12:00:08.000Z] Loading indicator shown
[2026-01-28T12:00:08.500Z] [CONSOLE LOG] useAudioPlayer.playSound - Starting playback...
[2026-01-28T12:00:09.000Z] [CONSOLE LOG] Sound loaded successfully...
[2026-01-28T12:00:09.500Z] [CONSOLE LOG] Playback started successfully
[2026-01-28T12:00:10.000Z] TEST 2: EXTERNAL SOUND DOWNLOAD AND PLAYBACK
[2026-01-28T12:00:10.500Z] Found external sound: Jarvis Defense Protocol
[2026-01-28T12:00:11.000Z] Clicking to download and play external sound...
[2026-01-28T12:00:12.000Z] [NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/...
[2026-01-28T12:00:12.500Z] [CONSOLE ERROR] Failed to download sound: Error: 404 Not Found
[2026-01-28T12:00:13.000Z] SUMMARY AND FINDINGS
[2026-01-28T12:00:13.500Z] [PASS] Bundled sound found and clickable
[2026-01-28T12:00:14.000Z] [INFO] External sound found and clicked
[2026-01-28T12:00:14.500Z] [WARN] 1 network errors detected during download
[2026-01-28T12:00:15.000Z] Key Issues Identified:
[2026-01-28T12:00:15.500Z] 1. External sound URLs return HTTP errors (404)
```

---

## Troubleshooting the Test Script

### Issue: Port 8081 already in use
```bash
# Find and kill existing process
lsof -i :8081
kill -9 <PID>
```

### Issue: Playwright not installed
```bash
npm install --save-dev @playwright/test playwright
npx playwright install
```

### Issue: Test hangs
```bash
# Timeout waiting for page to load
# Try increasing timeout in test-playback.js:
await page.goto('...', { timeout: 60000 });
```

### Issue: Screenshots not captured
```bash
# Check directory permissions
chmod 755 test-results/screenshots
# Check free disk space
df -h
```

---

## Key Files for Understanding Audio

1. **`app/(tabs)/index.tsx`** - Main sound screen UI and playback logic
2. **`hooks/useAudioPlayer.ts`** - Audio playback hook using `expo-av`
3. **`hooks/useDownloadedSounds.ts`** - Download management hook
4. **`services/soundDownloadService.ts`** - Download and file system operations
5. **`hooks/useSounds.ts`** - Sound catalog management
6. **`constants/externalSounds.json`** - External sound metadata with URLs
7. **`types/sounds.ts`** - TypeScript type definitions

---

## Next Steps for Fixing Playback Issues

1. **Verify bundled sounds work** - They should work without external URLs
2. **Get real audio URLs** - Replace placeholder URLs in externalSounds.json
3. **Test with valid URLs** - Re-run test with actual audio files
4. **Monitor CORS headers** - Ensure audio server has proper CORS setup
5. **Test on native platforms** - Mobile will have better file system access than web

---

## Notes on Web vs Native

The web version has significant limitations:

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Bundled assets | ✓ | ✓ | ✓ |
| File downloads | ⚠️ Limited | ✓ | ✓ |
| File system access | ✗ | ✓ | ✓ |
| Audio playback | ✓ | ✓ | ✓ |
| Cache persistence | Browser storage | File system | File system |

For production, test on actual iOS/Android devices.

---

## Support

For debugging audio issues:

1. Check browser DevTools (F12) → Console tab
2. Check Network tab for failed requests
3. Review `test-report.txt` for detailed logs
4. Check `expo-av` documentation: https://docs.expo.dev/versions/latest/sdk/audio/
5. Enable source maps for better error stack traces
