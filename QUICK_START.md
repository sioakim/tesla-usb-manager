# Quick Start Guide - Audio + Ads Implementation

## What's New

### Audio Playback
- All 10 bundled sounds now play when tapped
- Loading indicator shows while loading
- Play/pause icon toggles based on state
- Auto-stops when finished

### Banner Ads
- Bottom of every screen (Sounds, Light Shows, Music, Guide)
- Test ads display by default
- Safe area friendly (works with notch)

## Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run web preview
npm run web
```

## Testing Audio Playback

1. Navigate to **Sounds** tab
2. Tap any sound name to play
3. Icon changes from ▶️ to ⏸️ while playing
4. Tap again to pause
5. Tap different sound to switch (stops current)

## Testing Ads

1. Check bottom of each screen:
   - Sounds screen ✓
   - Light Shows screen ✓
   - Music screen ✓
   - Guide screen ✓

2. Verify ad doesn't cover content
3. Scroll without issues
4. Switch tabs without lag

## Test Ad Unit IDs
(Already configured - don't change unless updating for production)

- **iOS**: ca-app-pub-3940256099942544/2934735716
- **Android**: ca-app-pub-3940256099942544/6300978111

## Key Files

### New
- `constants/AdMob.ts` - Ad configuration
- `components/AdBanner.tsx` - Ad component
- `hooks/useAudioPlayer.ts` - Audio logic
- `assets/sounds/` - 10 sound files

### Updated
- `app/_layout.tsx` - AdMob init
- `app/(tabs)/index.tsx` - Audio + ads
- `app/(tabs)/lightshows.tsx` - Ads
- `app/(tabs)/music.tsx` - Ads
- `app/(tabs)/guide.tsx` - Ads

## Common Issues & Fixes

### Audio won't play
```
✓ Check sound file exists: assets/sounds/
✓ Check console for errors
✓ Try different sound
✓ Check app has audio permission (if needed)
```

### No ads showing
```
✓ Check internet connection
✓ Wait a few seconds for ad to load
✓ Check console for warnings
✓ Verify AdMob plugin in app.json
```

### Slow performance
```
✓ Restart dev server: npm start
✓ Clear cache: npm start -- --clear
✓ Check device battery
✓ Test on different simulator/emulator
```

## Using Custom Sounds

1. Prepare WAV files (44.1kHz, 16-bit, <1MB)
2. Place in `assets/sounds/`
3. Update `app/(tabs)/index.tsx` - BUNDLED_SOUNDS array
4. Add: `audioFile: require('@/assets/sounds/your-sound.wav')`

## Before Publishing

1. Create AdMob account: https://admob.google.com
2. Get real app IDs (iOS and Android)
3. Update `app.json` with real IDs
4. Update `constants/AdMob.ts` with real unit IDs
5. Test on real devices
6. Submit to App Store/Play Store

## Documentation

- **IMPLEMENTATION_GUIDE.md** - Technical details
- **IMPLEMENTATION_COMPLETE.md** - Verification checklist
- **CHANGELOG.md** - What changed

## Need Help?

- Check documentation files listed above
- Review code comments in new files
- Check console logs for errors
- Test one feature at a time

## Status

✅ Ready to test in simulator
✅ All dependencies installed
✅ Audio playback working
✅ Ad framework integrated
⏳ Awaiting AdMob account setup (for production)
