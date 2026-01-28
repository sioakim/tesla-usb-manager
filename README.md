# TeslaDrive 🚗⚡

A React Native app for managing Tesla USB drive content - custom lock sounds, boombox sounds, light shows, and music.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Expo](https://img.shields.io/badge/expo-SDK%2054-black)

## Features

### 🔊 Lock Sounds Manager
- Browse built-in royalty-free lock sounds
- Import your own .wav files
- Automatic conversion to Tesla-compatible format (44.1kHz, <1MB, WAV)
- Auto-rename to `LockChime.wav`

### 📢 Boombox Sounds
- Manage custom horn sounds
- Multiple sound support
- Organize in `Boombox/` folder

### 💡 Light Show Manager
- Import `.fseq` + audio file pairs
- Links to popular light show sources
- Organize in `LightShow/` folder

### 🎵 Music Manager
- Organize music files for USB playback
- Multi-select and bulk export
- Create proper folder structure

### 📖 Setup Guide
- Detailed two-USB-drive setup explanation
- Folder structure requirements
- Troubleshooting tips

## Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript**
- **expo-router** for file-based navigation
- **expo-av** for audio playback
- **expo-file-system** for file operations
- **expo-document-picker** for file import

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your device

### Installation

```bash
# Clone the repo
git clone https://github.com/sioakim/tesla-usb-manager.git
cd tesla-usb-manager

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web (preview)
npm run web
```

## USB Drive Setup

This app works with a **two USB drive setup**:

1. **Drive 1 (TeslaCam)**: Formatted by Tesla for dashcam/Sentry recordings
2. **Drive 2 (Media)**: Managed by this app for sounds, light shows, music

Use a USB hub to connect both drives to your Tesla.

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

## Audio Requirements

### Lock Sound (`LockChime.wav`)
- Format: WAV (PCM)
- Sample rate: 44.1 kHz
- Bit depth: 16-bit
- Channels: Mono or Stereo
- Max size: 1 MB
- Recommended duration: 1-3 seconds

### Boombox Sounds
- Same format as lock sounds
- Multiple files allowed
- Place in `Boombox/` folder

## Light Shows

Light shows require:
- `.fseq` sequence file (controls lights)
- Audio file (`.mp3` or `.wav`)
- Both files must have the same base name

Find light shows at:
- [Tesla Light Share](https://teslalightshare.io)
- [xLights Shows](https://xlightshows.io)

## Bundled Sounds

The app includes royalty-free sounds from [Pixabay](https://pixabay.com/sound-effects/):
- Digital chimes
- Sci-fi beeps
- Notification sounds
- Retro game sounds

All bundled sounds are royalty-free and require no attribution.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This app is not affiliated with, endorsed by, or sponsored by Tesla, Inc. Tesla and all related marks are trademarks of Tesla, Inc.

---

Made with ❤️ for the Tesla community
