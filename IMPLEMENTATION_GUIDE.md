# AdMob Integration + Audio Playback - Implementation Guide

## Quick Reference

### What Was Done
This implementation adds Google AdMob banner advertising and audio playback functionality to all screens of the Tesla USB Manager app.

### New Capabilities
- **Audio Playback**: Users can preview bundled lock/boombox sounds
- **Monetization**: Banner ads display on all 4 main screens
- **Professional UX**: Loading indicators, proper state management, clean integration

## Architecture Overview

### Audio Playback System

```typescript
useAudioPlayer Hook
├── State Management
│   ├── isPlaying: boolean
│   ├── isLoading: boolean
│   ├── currentSoundId: string | null
│   ├── progress: number (0-1)
│   └── duration: number (ms)
├── Methods
│   ├── playSound(soundId, uri)
│   ├── pauseSound()
│   ├── stopSound()
│   └── seekTo(position)
└── Auto-Cleanup on Unmount
```

### Ad System

```typescript
AdBanner Component
├── Platform Selection (iOS/Android)
├── Adaptive Sizing
├── Error Handling
└── Safe Area Support
```

## Component Integration

### Sounds Screen Flow
```
User taps sound item
    ↓
handlePlaySound(sound)
    ↓
audioPlayer.playSound(id, audioFile)
    ↓
Loading indicator shows
    ↓
Audio loads and plays
    ↓
Icon updates (play → pause)
    ↓
User can pause/resume or select different sound
```

### Ad Display Flow
```
Screen renders
    ↓
AdBanner component mounts
    ↓
BannerAd loads from AdMob
    ↓
Test ads display (or real ads if configured)
    ↓
Ad respects safe areas and device layout
```

## File Structure

### New Files
```
constants/
  └── AdMob.ts                 # Ad unit IDs and app IDs
components/
  └── AdBanner.tsx            # Reusable banner ad component
hooks/
  └── useAudioPlayer.ts       # Audio management hook
assets/sounds/
  ├── digital-chime.wav
  ├── sci-fi-beep.wav
  ├── soft-bell.wav
  ├── electric-zap.wav
  ├── future-lock.wav
  ├── notification-ping.wav
  ├── retro-game.wav
  ├── crystal-ding.wav
  ├── robot-voice.wav
  └── horn-melody.wav
```

### Modified Files
```
package.json                   # Added react-native-google-mobile-ads
app.json                      # Added AdMob plugin
app/_layout.tsx               # Initialize MobileAds
app/(tabs)/
  ├── index.tsx              # Audio playback + ads
  ├── lightshows.tsx         # Added ads
  ├── music.tsx              # Added ads
  └── guide.tsx              # Added ads
```

## Implementation Details

### Audio Playback

The `useAudioPlayer` hook provides a clean interface for audio management:

```typescript
// Usage in component
const audioPlayer = useAudioPlayer();

// Handle play
const handlePlaySound = async (sound) => {
  if (audioPlayer.currentSoundId === sound.id && audioPlayer.isPlaying) {
    await audioPlayer.pauseSound();
  } else {
    await audioPlayer.playSound(sound.id, sound.audioFile);
  }
};

// Access state
{audioPlayer.isLoading && <ActivityIndicator />}
{audioPlayer.isPlaying && <Text>Now playing...</Text>}
```

### AdMob Integration

The `AdBanner` component handles all ad logic:

```typescript
// Usage
import { AdBanner } from '@/components/AdBanner';

export default function Screen() {
  return (
    <>
      {/* Screen content */}
      <AdBanner onAdLoaded={() => console.log('Ad loaded')} />
    </>
  );
}
```

Platform detection happens automatically:
```typescript
const adUnitId = Platform.select({
  ios: ADMOB_AD_UNIT_IDS.banner.ios,
  android: ADMOB_AD_UNIT_IDS.banner.android,
  default: ADMOB_AD_UNIT_IDS.banner.android,
});
```

### Configuration

Test Ad Unit IDs (for development):
- iOS: `ca-app-pub-3940256099942544/2934735716`
- Android: `ca-app-pub-3940256099942544/6300978111`

These show sample ads and won't be rejected by Google.

## Customization Guide

### Replacing Audio Files

Audio files are located in `assets/sounds/`. Each file should be:
- **Format**: WAV (PCM)
- **Sample Rate**: 44.1 kHz
- **Bit Depth**: 16-bit
- **Channels**: Mono or Stereo
- **File Size**: < 1 MB recommended

To use different sounds:
1. Place new WAV files in `assets/sounds/`
2. Update file references in `app/(tabs)/index.tsx` BUNDLED_SOUNDS array
3. Update duration metadata if needed

### Updating Ad Configuration

Before publishing to app stores:

1. Create AdMob account: https://admob.google.com
2. Get app IDs and ad unit IDs
3. Update `constants/AdMob.ts`:
   ```typescript
   export const ADMOB_AD_UNIT_IDS = {
     banner: {
       ios: 'ca-app-pub-YOUR-ID-HERE',
       android: 'ca-app-pub-YOUR-ID-HERE',
     },
   };
   ```
4. Update `app.json`:
   ```json
   "plugins": [
     ["react-native-google-mobile-ads", {
       "androidAppId": "ca-app-pub-YOUR-APP-ID",
       "iosAppId": "ca-app-pub-YOUR-APP-ID"
     }]
   ]
   ```

### Adding More Screens with Ads

To add ads to additional screens:

```typescript
import { AdBanner } from '@/components/AdBanner';

export default function NewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Your content */}

      {/* Add banner at bottom */}
      <AdBanner />
    </SafeAreaView>
  );
}
```

### Custom Ad Callbacks

Handle ad events if needed:

```typescript
<AdBanner
  onAdLoaded={() => console.log('Ad ready')}
  onAdFailedToLoad={(error) => console.error('Ad failed:', error)}
/>
```

## Testing

### Audio Playback Testing
```
[ ] Tap first sound - should show loading, then play
[ ] Icon changes from play to pause
[ ] Tap pause - sound stops, icon reverts
[ ] Tap different sound - previous stops, new plays
[ ] Sound finishes - icon returns to play, ready for next
[ ] Works on iOS simulator
[ ] Works on Android emulator
```

### Ad Testing
```
[ ] Ad appears at bottom of each screen
[ ] Ad doesn't overlap content or buttons
[ ] Safe areas respected (notch, bottom bar)
[ ] Ad loads without errors
[ ] Scrolling doesn't cause issues
[ ] Switching tabs doesn't cause lag
```

### Performance Testing
```
[ ] No memory leaks (check DevTools)
[ ] Tab switching is smooth
[ ] Audio loads within 1-2 seconds
[ ] No jank when ads load
[ ] Battery impact is minimal
```

## Troubleshooting

### Audio Won't Play
1. Check file format (must be WAV)
2. Verify file path in BUNDLED_SOUNDS
3. Check console for error messages
4. Test file exists: `ls assets/sounds/`

### Ads Not Showing
1. Verify test device configuration
2. Check app IDs in app.json
3. Confirm internet connection
4. Check AdMob console for errors
5. Wait a few seconds after loading screen

### Loading Indicator Stays
1. Check sound file exists
2. Verify file is valid WAV
3. Check file size (should be ~88KB for 1 second)
4. Look for errors in console

## Dependencies

```json
{
  "expo-av": "~16.0.8",                    // Already installed
  "react-native-google-mobile-ads": "^16.0.2"  // Newly added
}
```

No other new dependencies added. Existing expo and React Native packages are sufficient.

## Best Practices

### Audio Management
- Always clean up sounds when component unmounts
- Use the provided hook instead of managing Audio directly
- Show loading states for better UX
- Handle file not found errors gracefully

### Ad Monetization
- Use test IDs during development
- Only switch to production IDs when publishing
- Monitor ad performance in AdMob dashboard
- Test on real devices before publishing

### Performance
- Audio files should be < 1 MB
- Keep sound duration short (1-3 seconds)
- Use ADAPTIVE_BANNER for flexible sizing
- Test on low-end devices

## Migration Notes

If updating from previous version:
1. No breaking changes to existing code
2. Audio playback is optional - UI works without it
3. Ads load independently and don't block content
4. Existing buttons and navigation unchanged

## Support & Documentation

- **Expo Docs**: https://docs.expo.dev
- **expo-av**: https://docs.expo.dev/versions/latest/sdk/av/
- **react-native-google-mobile-ads**: https://github.com/invertase/react-native-google-mobile-ads
- **AdMob**: https://admob.google.com

## Future Enhancements

Potential improvements:
- [ ] Replace placeholder sounds with actual Tesla sounds
- [ ] Add sound duration display during playback
- [ ] Implement audio format conversion
- [ ] Add interstitial ads on export
- [ ] Add rewarded video ads
- [ ] Custom progress slider
- [ ] Sound preview in music screen
