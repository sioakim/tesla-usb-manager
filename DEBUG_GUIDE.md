# Debugging Guide - iOS Simulator Issues

## Issues Found and Fixed

### 1. **BannerAdSize Import Issue**
**Problem**: `BannerAdSize.ADAPTIVE_BANNER` wasn't available in the library
**Solution**: Changed to use string `"ADAPTIVE_BANNER"` instead
**File**: `components/AdBanner.tsx` (Line 41)

### 2. **AdBanner Robustness**
**Problem**: BannerAd component might not be available in all scenarios
**Solution**: Added fallback rendering with placeholder when BannerAd is unavailable
**File**: `components/AdBanner.tsx` (entire component)

### 3. **MobileAds Initialization**
**Problem**: Initialization might fail if AdMob isn't properly set up
**Solution**: Wrapped in try/catch to handle gracefully
**File**: `app/_layout.tsx` (Lines 36-41)

## Current Status

✅ All fixes applied
✅ AdBanner now has fallback rendering
✅ Audio player should work independently of ads
✅ Server restarts cleanly

## Testing Steps

1. **Kill existing server** (if needed):
   ```bash
   pkill -f "expo start"
   sleep 2
   ```

2. **Start fresh dev server**:
   ```bash
   npm start --ios
   ```

3. **Expected behavior**:
   - App should load
   - Audio playback should work (even if ads fail)
   - Ads show as placeholder if not available
   - No crashes in console

## If Still Having Issues

### Check Console Errors
Run dev server and look for specific errors:
```bash
npm start 2>&1 | grep -i error
```

### Isolate Audio Player
If app doesn't load, temporarily disable audio:
```typescript
// In app/(tabs)/index.tsx
// const audioPlayer = useAudioPlayer();  // Comment this out
```

### Isolate AdBanner
If ads cause issues, the component should fail gracefully now and show placeholder.

## Port Already In Use

If you get "Port 8081 is running this app in another window":

```bash
# Kill all Expo processes
pkill -f "expo start"
pkill -f "node.*expo"
sleep 2

# Start fresh
npm start --ios
```

## Common Errors & Solutions

### "Cannot find module '@/components/AdBanner'"
- Check tsconfig.json has `"@/*": ["./*"]` path mapping
- Make sure file exists: `ls components/AdBanner.tsx`

### "Audio won't play"
- Check file exists: `ls assets/sounds/digital-chime.wav`
- Check file is valid WAV format
- Check console for specific audio errors

### "BannerAd not working"
- This is now handled gracefully with placeholder
- Check AdMob configuration in `constants/AdMob.ts`
- Check app IDs in `app.json`

## Verification

After fixes applied:

- [ ] App loads without crashing
- [ ] Audio player appears in Sounds screen
- [ ] Sound files are visible in list
- [ ] Tapping sound shows loading indicator (might be fast for 1-second files)
- [ ] Ad space shows at bottom (either real ad or placeholder)
- [ ] No errors in console
- [ ] Tab switching works smoothly

## Next Steps

1. Test audio playback works
2. Verify ad rendering (real or placeholder)
3. If ready: Set up AdMob account for production
4. If not ready: Placeholders serve as space reservations

## Advanced Debugging

### Enable Verbose Logging
Add to `app/_layout.tsx`:
```typescript
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(false); // Show all warnings
```

### Check React DevTools
- Use React DevTools browser extension
- Check component tree
- Monitor hook state

### Metro Bundler Cache
If weird errors persist:
```bash
rm -rf node_modules/.cache
npm start -- --clear
```
