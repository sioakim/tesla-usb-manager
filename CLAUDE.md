# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TeslaDrive** is a React Native app (built with Expo SDK 54) for managing Tesla USB drive content. It helps users organize lock sounds, boombox sounds, light shows, and music files with proper Tesla-compatible formatting and folder structures.

## Development Commands

### Installation & Setup
```bash
npm install          # Install dependencies
npm start            # Start Expo development server
```

### Running the App
```bash
npm run ios          # Run on iOS Simulator
npm run android      # Run on Android Emulator
npm run web          # Run web preview (Metro bundler)
```

## Tech Stack & Architecture

### Framework & Core
- **React Native** 0.81.5 with **Expo Router** for file-based navigation
- **TypeScript** (5.9.2) with strict mode enabled
- **expo-router** (6.0.22) handles all routing and deep linking via the `app/` directory structure

### Key Dependencies
- **expo-av** - Audio playback and media control
- **expo-file-system** - File I/O operations for managing USB drive content
- **expo-document-picker** - Import files from device storage
- **expo-sharing** - Share exported content
- **react-native-reanimated** - Animations (via new Arch)
- **react-native-screens** & **react-native-safe-area-context** - Navigation platform features

### Directory Structure
- **`app/`** - File-based routing (Expo Router)
  - `_layout.tsx` - Root layout with theme provider and font loading
  - `(tabs)/` - Tab-based navigation (4 main screens)
    - `index.tsx` - Lock & Boombox sounds manager (324 lines)
    - `lightshows.tsx` - Light show (.fseq + audio) manager (373 lines)
    - `music.tsx` - Music file organizer (361 lines)
    - `guide.tsx` - Setup guide & troubleshooting (357 lines)
- **`components/`** - Reusable UI components
  - `Themed.tsx` - Dark/light theme aware components
  - `useColorScheme.ts` - Hook for current system theme
  - `useClientOnlyValue.ts` - SSR-safe value rendering (web specific)
  - Utility hooks for theming and platform-specific behavior
- **`constants/`** - `Colors.ts` defines theme color palettes
- **`assets/`** - Images and fonts

### Design Theme
- Dark-first UI with accent color `#e94560` (vibrant red)
- Header background: `#1a1a2e` (dark navy)
- Tab bar background: `#1a1a2e` with `#2d2d44` border
- Responsive platform styling using `Platform.select()` for iOS/Android differences

## Key Features & Implementation Notes

### 1. Lock Sounds Manager
- Browse bundled sounds (royalty-free from Pixabay)
- Import custom `.wav` files
- Auto-convert to Tesla format (44.1kHz, <1MB, PCM)
- Rename to `LockChime.wav` for Tesla recognition

### 2. Boombox Sounds
- Custom horn sounds with multiple file support
- Organized in `Boombox/` folder on USB drive

### 3. Light Shows
- Pairs `.fseq` (sequence files) with audio files
- Both files must have matching base names
- Organized in `LightShow/` folder
- Links to sources: [Tesla Light Share](https://teslalightshare.io), [xLights Shows](https://xlightshows.io)

### 4. Music Manager
- Multi-select and bulk export
- Creates proper USB folder structure
- Supports MP3, FLAC, and other standard formats

### 5. Setup Guide
- Interactive two-USB-drive setup explanation
- Required folder structure documentation
- Troubleshooting tips

## USB Drive Requirements

### Media Drive Folder Structure
```
/
├── LockChime.wav           # Lock sound (exact name required)
├── Boombox/
│   └── [horn sounds].wav   # Custom boombox sounds
├── LightShow/
│   ├── show1.fseq          # Light show sequence
│   ├── show1.mp3           # Matching audio file
│   └── ...
└── Music/
    └── [music files]       # MP3, FLAC, etc.
```

### Audio Specifications
- Format: WAV (PCM)
- Sample rate: 44.1 kHz
- Bit depth: 16-bit
- Channels: Mono or Stereo
- Max size (lock sound): 1 MB
- Recommended duration (lock sound): 1-3 seconds

## Development Notes

### Current Status
- **Initial scaffold** with tab-based UI structure complete
- **TODO items visible in code**: Audio playback with `expo-av` needs implementation
- **Bundled sounds**: Placeholder data using Pixabay royalty-free sound references

### Routing Pattern
Expo Router automatically creates routes from `app/` file structure:
- `app/(tabs)/index.tsx` → `/` (Sounds tab)
- `app/(tabs)/lightshows.tsx` → `/lightshows`
- `app/(tabs)/music.tsx` → `/music`
- `app/(tabs)/guide.tsx` → `/guide`
- `app/modal.tsx` → `/modal`

### Platform-Specific Configuration
- **iOS**: Bundle ID `com.sioakim.tesladrive`, tablet support enabled
- **Android**: Package `com.sioakim.tesladrive`, adaptive icon support
- **Web**: Metro bundler, static output

### TypeScript Configuration
- Extends `expo/tsconfig.base`
- Path alias `@/*` points to repo root
- Strict mode enabled for type safety

## Building for Production

The project uses Expo's build system. Distribution will involve:
- EAS Build for iOS/Android binaries
- Web deployment via static output to `web-build/`
