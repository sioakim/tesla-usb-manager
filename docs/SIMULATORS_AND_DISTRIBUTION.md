# Expo Development & Distribution Guide

Complete guide for running simulators, debugging, and publishing TeslaDrive to App Store and Google Play.

## Table of Contents
1. [Running Simulators](#running-simulators)
2. [Common Development Commands](#common-development-commands)
3. [Debugging & Testing](#debugging--testing)
4. [Building for Production](#building-for-production)
5. [Submitting to App Stores](#submitting-to-app-stores)
6. [Pre-Submission Checklist](#pre-submission-checklist)

---

## Running Simulators

### iOS Simulator

#### Prerequisites
- macOS with Xcode installed
- Xcode Command Line Tools

#### Starting iOS Simulator

**Option 1: Automatic (Recommended)**
```bash
npm run ios
```
This starts Metro bundler and automatically launches the iOS Simulator with Expo Go.

**Option 2: Manual Control**
```bash
# Start development server (without opening simulator)
npm start

# Then press 'i' to open iOS Simulator
# Or manually open simulator first, then select 'i'
```

**Option 3: Specify Simulator**
```bash
# List available simulators
xcrun simctl list devices

# Start with specific simulator
npm start -- --ios --simulator "iPhone 17 Pro"
```

#### Common iOS Simulator Keyboard Shortcuts
- `Cmd + Shift + H` - Home button
- `Cmd + Left` - Rotate to landscape
- `Cmd + Right` - Rotate to portrait
- `Cmd + K` - Toggle keyboard
- `Cmd + Z` - Shake gesture (trigger dev menu)

---

### Android Emulator

#### Prerequisites
- Android Studio installed
- Android SDK (API Level 21+)
- Emulator created in Android Studio

#### Creating an Android Emulator
1. Open Android Studio
2. Go to: **Tools → Device Manager**
3. Click **Create Device**
4. Select device (Pixel 7 recommended)
5. Select Android version (API 34+ recommended)
6. Click **Finish**

#### Starting Android Emulator

**Option 1: Automatic (Recommended)**
```bash
npm run android
```
This starts Metro bundler and automatically launches the Android Emulator with Expo Go.

**Option 2: Manual**
```bash
# Start development server
npm start

# Then press 'a' to open Android Emulator
# Or manually start emulator from Android Studio first
```

**Option 3: Command Line**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_7_API_34
```

#### Common Android Emulator Controls
- `Esc` - Back button
- `Home` - Home button
- `Ctrl + F12` (or `Cmd + F12`) - Toggle fullscreen
- `Ctrl + T` (or `Cmd + T`) - Open app drawer
- `F2` - Toggle menu
- `Ctrl + M` (or `Cmd + M` on Mac) - Trigger dev menu (shake gesture)

---

## Common Development Commands

### Basic Commands

```bash
# Start development server (interactive menu)
npm start

# iOS only
npm run ios

# Android only
npm run android

# Web preview
npm run web
```

### Interactive Menu in Development

When you run `npm start`, you get this menu:

```
Press ? │ help
Press a │ open Android
Press i │ open iOS
Press w │ open web
Press e │ send link via email
Press s │ send link via SMS
Press j │ open Debugger
Press r │ reload app
Press m │ toggle menu
Press o │ open project code in your editor
Press x │ clear all
Press c │ show QR code
Press q │ quit
```

### Key Commands Explained

| Command | What It Does |
|---------|-------------|
| `r` | Hot reload the app (for JS changes) |
| `j` | Open React Native Debugger / Chrome DevTools |
| `m` | Show developer menu on simulator/device |
| `c` | Display QR code (for Expo Go app on physical device) |
| `s` | Send development link via SMS to test on physical device |
| `w` | Open web version in browser |
| `a` / `i` | Open Android / iOS Emulator |
| `x` | Clear bundler cache (use if stuck) |

---

## Debugging & Testing

### React Native Debugger

**Start debugging:**
```bash
npm start
# Press 'j' to open debugger
```

**Or use Chrome DevTools:**
```bash
npm start
# Press 'j' → Opens Chrome at localhost:8081/debugger-ui
```

**What you can do:**
- Inspect component props and state
- Set breakpoints
- View console logs
- Profile performance

### Log Viewing

```bash
# View all logs from development
npm start

# Watch only iOS logs
npm start -- --ios

# Watch only Android logs
npm start -- --android

# Using adb for Android logs specifically
adb logcat | grep RN
```

### Testing on Physical Device

**iOS:**
```bash
npm start
# Press 's' to send SMS with development link
# User opens link in Expo Go app

# Or manually:
# 1. Install Expo Go from App Store
# 2. Run 'npm start'
# 3. Show QR code (press 'c')
# 4. Scan with phone camera or Expo Go app
```

**Android:**
```bash
npm start
# Press 's' or 'e' to send link
# User installs Expo Go and scans QR code

# Or:
adb install expo-go.apk
```

### Common Debugging Tips

**App won't reload:**
```bash
npm start
# Press 'x' to clear bundler cache, then 'r' to reload
```

**Stuck on splash screen:**
```bash
# Restart the development server
npm start

# Or hard reset simulator
# iOS: Cmd + Shift + H (home), then swipe up on app
# Android: Long-press app, select Force Stop
```

**Network issues:**
```bash
# Check if Metro bundler is running
# Should see: "Waiting on http://localhost:8081"

# If stuck, kill and restart:
lsof -i :8081  # Find process
kill -9 <PID>  # Kill it
npm start      # Restart
```

### TypeScript Errors

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Watch mode for continuous checking
npx tsc --watch --noEmit
```

---

## Building for Production

### Prerequisites

1. **Create Expo Account** (if you don't have one)
   ```bash
   npm install -g eas-cli
   eas auth:login
   # Or: eas auth:register
   ```

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Initialize EAS in Project**
   ```bash
   eas build:configure
   # This creates eas.json
   ```

### Building Apps

#### iOS Build

**For Testing (Simulator)**
```bash
eas build --platform ios --local
# Outputs: .app file for simulator testing
```

**For App Store**
```bash
eas build --platform ios
# Managed by Expo's build servers
# Outputs: .ipa file (iOS app package)
# Takes 10-20 minutes
```

#### Android Build

**For Testing (Emulator)**
```bash
eas build --platform android --profile preview
# Outputs: .apk file for emulator
```

**For Google Play Store**
```bash
eas build --platform android --profile production
# Outputs: .aab file (Android App Bundle)
# Takes 10-20 minutes
```

#### Build Both Platforms
```bash
eas build --platform all
# Builds iOS and Android in parallel
```

### Monitoring Build Status

```bash
# View all your builds
eas build:list

# View specific build details
eas build:view <BUILD_ID>

# Get build logs
eas build:view <BUILD_ID> --log
```

### Downloading Built Apps

```bash
# After build completes
eas build:list

# Download .ipa (iOS) or .apk/.aab (Android)
# You can download from EAS dashboard or:
eas build:view <BUILD_ID>
```

---

## Submitting to App Stores

### App Store (iOS)

#### Prerequisites
- Apple Developer Account ($99/year)
- App Store Connect access
- Code signing certificate
- Provisioning profile

#### Step-by-Step Submission

**Option 1: Using EAS Submit (Easiest)**
```bash
# Build first
eas build --platform ios

# Then submit
eas submit --platform ios
# EAS handles all signing and submission automatically
```

**Option 2: Manual Submission**
1. Download .ipa file from EAS
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Create new app entry
4. Use Transporter app (Mac) to upload .ipa
5. Fill in metadata and pricing
6. Submit for review

#### Required App Store Information
- App name: **TeslaDrive**
- Description: ~500 characters about the app
- Keywords: tesla, usb, music, sounds, light shows
- Category: Utilities or Music
- Screenshots: 5-10 per device type (iPhone, iPad)
- Preview video (optional)
- Privacy policy URL
- Support URL
- Ratings/Age rating information

#### App Store Review Timeline
- **Typical**: 1-2 days
- **Complex apps**: Up to 24 hours
- **Rejected**: You'll get reasons and can resubmit

### Google Play Store (Android)

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- Google Play Store access
- Signing key (EAS manages this automatically)

#### Step-by-Step Submission

**Option 1: Using EAS Submit (Easiest)**
```bash
# Build first
eas build --platform android --profile production

# Then submit
eas submit --platform android
# EAS handles signing and Play Store upload
```

**Option 2: Manual Submission**
1. Download .aab file from EAS
2. Go to [Google Play Console](https://play.google.com/console)
3. Create new app
4. Upload .aab file
5. Fill in content rating questionnaire
6. Add privacy policy and permissions
7. Add app store listing information
8. Set pricing and distribution
9. Submit for review

#### Required Google Play Information
- App name: **TeslaDrive**
- Short description: ~80 characters
- Full description: ~4000 characters
- Screenshots: 2-8 per phone size
- Feature graphic: 1024×500px
- App icon: 512×512px
- Privacy policy URL
- Content rating questionnaire
- Permissions explanation

#### Google Play Review Timeline
- **Typical**: A few hours to 1 day
- **Faster than Apple**: Usually same day approval
- **Issues**: You'll get detailed feedback

---

## Pre-Submission Checklist

### Code Quality

- [ ] No console.log statements (or use proper logging)
- [ ] No TODO comments left in code
- [ ] Remove debug/test code
- [ ] TypeScript strict mode passes: `npx tsc --noEmit`
- [ ] All imports are used (no unused imports)
- [ ] No hardcoded API keys or secrets

**Check these:**
```bash
# Run type checking
npx tsc --noEmit

# Look for console.log in code
grep -r "console.log" app/

# Look for TODO comments
grep -r "TODO" app/
```

### Functionality Testing

- [ ] All 4 main tabs work (Sounds, Light Shows, Music, Guide)
- [ ] Navigation between screens works
- [ ] Back button works correctly
- [ ] No crashes on startup
- [ ] Guide content is complete and accurate
- [ ] Theme switching works (dark/light mode if applicable)
- [ ] Icons load correctly on all tabs

**Test on both:**
- [ ] iOS Simulator (latest version)
- [ ] Android Emulator (API 21+)

### Performance & Optimization

- [ ] App launches in <3 seconds
- [ ] Tab switching is smooth (no lag)
- [ ] Scrolling is smooth (no frame drops)
- [ ] Memory usage is reasonable
- [ ] No unnecessary re-renders

**Check:**
```bash
npm start
# Press 'j' to open debugger
# Check Performance tab in Chrome DevTools
```

### Device Compatibility

- [ ] Works on iPhone 12 and newer
- [ ] Works on Android 6.0+ (API 21+)
- [ ] Portrait orientation works correctly
- [ ] Landscape orientation works (if supported)
- [ ] Safe area insets handled correctly
- [ ] Notch/Dynamic Island not cutting off content

### Branding & Assets

- [ ] App icon looks good (check in CLAUDE.md for asset paths)
- [ ] Splash screen displays correctly
- [ ] App name is correct everywhere
- [ ] Bundle IDs match what's in app.json:
  - iOS: `com.sioakim.tesladrive`
  - Android: `com.sioakim.tesladrive`

### Platform-Specific Requirements

#### iOS (App Store)
- [ ] Privacy Policy URL provided
- [ ] Support URL provided
- [ ] App icon 1024×1024px provided
- [ ] At least 2 screenshots per device size
- [ ] App category selected
- [ ] Age rating questionnaire completed
- [ ] IDFA permission required? (check if tracking)
- [ ] No app clips or watch extensions required

#### Android (Google Play)
- [ ] Privacy Policy URL provided
- [ ] Content rating questionnaire completed
- [ ] Feature graphic 1024×500px
- [ ] Icon 512×512px
- [ ] At least 2 screenshots
- [ ] App permissions explained to user
- [ ] Required permissions: Check what's needed
  - [ ] File system access (for USB drive features)
  - [ ] Audio playback (for sound preview)
  - [ ] Document picker (for importing files)

### Content Compliance

- [ ] No misleading claims about functionality
- [ ] All bundled sounds have proper licenses (they do - Pixabay)
- [ ] No copyrighted content
- [ ] Appropriate for all ages (no adult content)
- [ ] Disclaimer about Tesla affiliation included in description

**Update app description:**
```
TeslaDrive helps you manage custom media for your Tesla vehicle's USB drive.

Supported Features:
- Custom lock sounds (WAV format)
- Boombox horn sounds
- Light show files (.fseq + audio)
- Music library organization

DISCLAIMER: This app is not affiliated with, endorsed by, or sponsored by Tesla, Inc.
```

### Permissions & Privacy

- [ ] Request only necessary permissions
- [ ] Privacy policy covers what data you collect
- [ ] No tracking or analytics (unless disclosed)
- [ ] No user data sent to servers
- [ ] File access limited to necessary directories

**Review what TeslaDrive accesses:**
- [ ] Document picker (file import)
- [ ] File system (USB operations)
- [ ] Audio playback (sound preview)

### Version & Release Notes

- [ ] Version number updated in package.json (currently 1.0.0)
- [ ] Release notes written (1-2 sentences for first release)
- [ ] Build number incremented for updates

**Example first release notes:**
```
Initial Release

TeslaDrive helps you easily manage custom lock sounds, horn sounds,
light shows, and music for your Tesla's USB drive media system.

Features:
- Browse and select from built-in royalty-free sounds
- Import your own WAV and audio files
- Comprehensive setup guide
- Support for light show files and music organization
```

### Account & Credentials

#### Apple Developer Account
- [ ] Create account at [developer.apple.com](https://developer.apple.com)
- [ ] Enroll in App Store Connect
- [ ] Accept agreements
- [ ] Add payment method
- [ ] Generate App ID in Certificates, Identifiers & Profiles
- [ ] Create provisional profile for signing

#### Google Play Account
- [ ] Create account at [play.google.com/console](https://play.google.com/console)
- [ ] Accept Play Developer Agreement
- [ ] Set up payment method
- [ ] Create app entry

#### EAS Account (Recommended)
- [ ] Create account at [expo.dev](https://expo.dev)
- [ ] Link Apple and Google accounts to EAS for easy submission
- [ ] EAS handles certificates and signing automatically

### Final Pre-Submission Checks

```bash
# 1. Clear everything and do a fresh build
npm start
# Press 'x' to clear cache
# Test thoroughly on simulator

# 2. Build for production
eas build --platform ios
eas build --platform android --profile production

# 3. Test the built apps locally if possible
# Download and test the .ipa and .aab files

# 4. Double-check all content
# Review screenshots, description, keywords, etc.

# 5. Submit!
eas submit --platform ios
eas submit --platform android
```

---

## What's Currently Missing for App Store Submission

Based on TeslaDrive's current state, here's what still needs to be done:

### 1. **Core Functionality** (Critical)
- [ ] Implement audio playback (expo-av) - Currently stub with TODO
- [ ] Implement file import (expo-document-picker) - Currently stub with TODO
- [ ] Implement USB export (expo-file-system + expo-sharing) - Currently stub with TODO
- [ ] Implement audio file conversion (to WAV 44.1kHz) - Not implemented
- [ ] Add state persistence (AsyncStorage or SQLite) - Not implemented

**Effort**: 2-4 weeks for a complete implementation

### 2. **Testing & Stability** (Critical)
- [ ] Comprehensive testing on multiple iOS versions
- [ ] Comprehensive testing on multiple Android versions
- [ ] Error handling for file operations
- [ ] Network error handling (if backend features added later)
- [ ] Battery/memory profiling

**Effort**: 1-2 weeks

### 3. **Assets & Branding** (Required)
- [ ] App icons (1024×1024 for App Store, 512×512 for Play)
- [ ] Splash screen (currently has placeholder)
- [ ] Feature graphic for Android (1024×500px)
- [ ] Screenshots for both stores (5+ per device)
- [ ] App preview video (optional but recommended)

**Effort**: 1-2 days (unless you want custom graphics)

### 4. **Documentation & Compliance** (Required)
- [ ] Privacy policy (need URL or create one)
- [ ] Terms of service (optional but recommended)
- [ ] Support page/email
- [ ] Update app description (currently basic)
- [ ] Create release notes

**Effort**: 1-2 days

### 5. **Developer Accounts** (Required)
- [ ] Apple Developer account ($99/year) - Not set up
- [ ] Google Play Developer account ($25 one-time) - Not set up
- [ ] EAS account (free with paid tier optional) - Not set up

**Cost**: $124 one-time + $99/year for Apple

### 6. **Certificates & Signing** (Required)
- [ ] iOS code signing certificate - Can be automated by EAS
- [ ] iOS provisioning profile - Can be automated by EAS
- [ ] Android signing key - Can be automated by EAS
- [ ] Play Store app signing - Managed by Play Store

**Effort**: 1-2 hours (with EAS automation)

### 7. **Optional Enhancements**
- [ ] Unit tests (currently has 1 snapshot test)
- [ ] Integration tests
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance optimization
- [ ] Analytics (Google Analytics or similar)

---

## Quick Start: From Zero to Submission (Roadmap)

### Week 1: Setup
- [ ] Day 1: Install dev accounts (Apple, Google, EAS)
- [ ] Day 2: Configure EAS (`eas build:configure`)
- [ ] Day 3: Build and test iOS
- [ ] Day 4: Build and test Android
- [ ] Day 5: Review and fix any issues

### Week 2: Prepare Store Listings
- [ ] Days 1-2: Create app icons and assets
- [ ] Days 3-4: Take screenshots and create descriptions
- [ ] Day 5: Final testing and cleanup

### Week 3: Implement Functionality
- [ ] Days 1-3: Implement audio playback, file import, USB export
- [ ] Days 4-5: Test thoroughly on real devices if possible

### Week 4+: Submit & Iterate
- [ ] Day 1: Final pre-submission checklist
- [ ] Days 2-3: Submit to App Store and Google Play
- [ ] Days 4+: Monitor reviews and respond to feedback

---

## Helpful Resources

- [Expo Docs - Building & Deploying](https://docs.expo.dev/build/setup/)
- [Expo Docs - Submitting to Stores](https://docs.expo.dev/submit/ios/)
- [Apple App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [React Native Documentation](https://reactnative.dev/)

---

## Common Commands Quick Reference

```bash
# Development
npm start                           # Start dev server (interactive)
npm run ios                         # Run iOS Simulator
npm run android                     # Run Android Emulator
npm run web                         # Run web preview

# Testing
npx tsc --noEmit                    # Check TypeScript errors
npm test                            # Run Jest tests (if configured)

# Building
eas build --platform ios            # Build for App Store
eas build --platform android        # Build for Play Store
eas build --platform all            # Build both

# Submission
eas submit --platform ios           # Submit to App Store
eas submit --platform android       # Submit to Google Play

# Account
eas auth:login                      # Login to EAS
eas auth:logout                     # Logout from EAS
eas account:view                    # View account info
```

