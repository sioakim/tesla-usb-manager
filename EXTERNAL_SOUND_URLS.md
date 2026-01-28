# Complete List of External Sound URLs

This file documents all external sound URLs in the app. All of these URLs are **placeholders** and don't actually host audio files.

## Source 1: Not a Tesla App (notateslaapp) - 18 Sounds

### Movies (6 sounds)
```
https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
└─ Jarvis Defense Protocol (2s)

https://www.notateslaapp.com/assets/audio/movies/darthvader-breathing.wav
└─ Darth Vader Breathing (3s)

https://www.notateslaapp.com/assets/audio/movies/inception-horn.wav
└─ Inception Horn (5s)

https://www.notateslaapp.com/assets/audio/movies/transformers-transform.wav
└─ Transformers Transform (4s)

https://www.notateslaapp.com/assets/audio/movies/batman-theme.wav
└─ Batman Theme (2s)

https://www.notateslaapp.com/assets/audio/movies/missionimpossible.wav
└─ Mission Impossible Theme (3s)
```

### Games (5 sounds)
```
https://www.notateslaapp.com/assets/audio/games/mario-coin.wav
└─ Super Mario Coin (1s)

https://www.notateslaapp.com/assets/audio/games/zelda-fanfare.wav
└─ Zelda Fanfare (3s)

https://www.notateslaapp.com/assets/audio/games/halo-theme.wav
└─ Halo Theme (3s)

https://www.notateslaapp.com/assets/audio/games/portal-achievement.wav
└─ Portal Achievement (2s)

https://www.notateslaapp.com/assets/audio/games/gameover.wav
└─ Game Over (1s)
```

### General (5 sounds)
```
https://www.notateslaapp.com/assets/audio/general/notification.wav
└─ Notification Ping (1s)

https://www.notateslaapp.com/assets/audio/general/airhorn.wav
└─ Air Horn (2s)

https://www.notateslaapp.com/assets/audio/general/applause.wav
└─ Applause (2s)

https://www.notateslaapp.com/assets/audio/general/bell.wav
└─ Bell Chime (1s)

https://www.notateslaapp.com/assets/audio/general/notification-drum.wav
└─ Notification Drum (1s)

https://www.notateslaapp.com/assets/audio/general/metallic-ding.wav
└─ Metallic Ding (1s)

https://www.notateslaapp.com/assets/audio/general/booshka.wav
└─ Booshka (1s)
```

### Sci-Fi (1 sound)
```
https://www.notateslaapp.com/assets/audio/scifi/laser.wav
└─ Laser Blaster (1s)
```

### TV (1 sound)
```
https://www.notateslaapp.com/assets/audio/tv/batman-theme.wav
└─ Batman Theme (2s)
```

---

## Source 2: TeslaDeck (tesladeck) - 15 Sounds

### Movies (2 sounds)
```
https://tesladeck.com/sounds/interstellar-theme.wav
└─ Interstellar Theme (3s)

https://tesladeck.com/sounds/thanos-snap.wav
└─ Thanos Snap (2s)
```

### TV (1 sound)
```
https://tesladeck.com/sounds/mandalorian-theme.wav
└─ Mandalorian Theme (3s)
```

### Games (2 sounds)
```
https://tesladeck.com/sounds/minecraft-hurt.wav
└─ Minecraft Hurt Sound (0.5s)

https://tesladeck.com/sounds/pokemon-battle.wav
└─ Pokémon Battle (2s)
```

### General (9 sounds)
```
https://tesladeck.com/sounds/ding.wav
└─ Ding (0.8s)

https://tesladeck.com/sounds/ping.wav
└─ Ping (0.6s)

https://tesladeck.com/sounds/dubstep-drop.wav
└─ Dubstep Drop (3s)

https://tesladeck.com/sounds/alarm-clock.wav
└─ Alarm Clock (2s)

https://tesladeck.com/sounds/success-chime.wav
└─ Success Chime (1s)

https://tesladeck.com/sounds/glass-break.wav
└─ Glass Break (1.2s)

https://tesladeck.com/sounds/futuristic-beep.wav
└─ Futuristic Beep (0.8s)

https://tesladeck.com/sounds/error-buzz.wav
└─ Error Buzz (0.6s)
```

---

## Thumbnail URLs

All thumbnail URLs use a placeholder service:

```
https://via.placeholder.com/300x200?text=Iron+Man
https://via.placeholder.com/300x200?text=Star+Wars
https://via.placeholder.com/300x200?text=Inception
https://via.placeholder.com/300x200?text=Mario
https://via.placeholder.com/300x200?text=Zelda
https://via.placeholder.com/300x200?text=Halo
https://via.placeholder.com/300x200?text=Interstellar
https://via.placeholder.com/300x200?text=Thanos
https://via.placeholder.com/300x200?text=Mandalorian
https://via.placeholder.com/300x200?text=Minecraft
https://via.placeholder.com/300x200?text=Pokemon
https://via.placeholder.com/300x200?text=Portal
https://via.placeholder.com/300x200?text=Batman
https://via.placeholder.com/300x200?text=Mission+Impossible
https://via.placeholder.com/300x200?text=Transformers
```

---

## Why These Are Placeholders

1. **Non-existent paths** - The URLs point to paths that don't actually exist on these domains
2. **No actual files** - Even if you visit notateslaapp.com, this specific path structure doesn't exist
3. **For demonstration** - The JSON file was created with example URLs to show the structure

---

## Replacing These URLs

### Option 1: Use Your Own Server
Replace all instances of:
```
https://www.notateslaapp.com/assets/audio/...
https://tesladeck.com/sounds/...
```

With your own URLs:
```
https://your-api.com/sounds/ironman-jarvis.wav
https://your-cdn.com/audio/darth-vader.wav
http://localhost:3000/sounds/mario-coin.wav
```

### Option 2: Use a CDN
```
https://your-bucket.s3.amazonaws.com/sounds/ironman-jarvis.wav
https://firebasestorage.googleapis.com/.../ironman-jarvis.wav
https://cdn.yourservice.com/sounds/ironman-jarvis.wav
```

### Option 3: Use Free Audio Services
```
https://freesound.org/api/sounds/123456/download/
https://api.zapsplat.com/download/sound/123
https://archive.org/download/audio_collection/ironman.wav
```

### Option 4: Local/Mock Server for Testing
```
http://localhost:3000/sounds/ironman-jarvis.wav
http://127.0.0.1:8000/audio/darth-vader.wav
```

---

## URL Statistics

- **Total external sounds:** 33
- **Total sources:** 2
- **Total audio URLs:** 33 (all placeholder)
- **Total thumbnail URLs:** ~15
- **Domains used:**
  - www.notateslaapp.com (18 sounds)
  - tesladeck.com (15 sounds)
  - via.placeholder.com (thumbnails)

---

## Testing These URLs

When you run the test script, it will attempt to download from all audio URLs and report:

```
[NETWORK ERROR] 404 Not Found - https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav
```

This is expected because these URLs don't actually work.

---

## Finding Real Audio URLs

### Legitimate Sound Libraries
1. **Freesound.org** - https://freesound.org
2. **Zapsplat** - https://www.zapsplat.com
3. **Pixabay Sounds** - https://pixabay.com/sound-effects
4. **BBC Sound Effects** - https://sound-effects.bbcrewind.co.uk
5. **OpenGameArt.org** - https://opengameart.org

### Recording Your Own
1. Use Audacity to record and export as WAV
2. Host on S3, Firebase Storage, or your own server
3. Update the audioUrl field in externalSounds.json

### Using Free Samples
```json
{
  "audioUrl": "https://freesound.org/api/sounds/12345/download/",
  "audioUrl": "https://pixabay.com/api/download/sound-file.wav",
  "audioUrl": "https://your-hosting.com/sounds/custom-chime.wav"
}
```

---

## Quick Replace Example

Current (broken):
```json
{
  "id": "notateslaapp-ironman-jarvis",
  "name": "Jarvis Defense Protocol",
  "audioUrl": "https://www.notateslaapp.com/assets/audio/movies/ironman-jarvis.wav"
}
```

Fixed (with real URL):
```json
{
  "id": "notateslaapp-ironman-jarvis",
  "name": "Jarvis Defense Protocol",
  "audioUrl": "https://your-bucket.s3.amazonaws.com/sounds/ironman-jarvis.wav"
}
```

Repeat for all 33 sounds.

---

## HTTP Status Codes You'll See

When test runs against these URLs:

- **404 Not Found** - Most common (URL doesn't exist)
- **403 Forbidden** - If server blocks access
- **500 Server Error** - If placeholder service is down
- **CORS Error** - If server doesn't allow cross-origin requests

All are expected for placeholder URLs.

---

## Next Steps

1. **Identify real audio sources** - Choose where to get actual audio files
2. **Download or generate audio files** - WAV format, <1MB for Tesla compatibility
3. **Host the files** - S3, Firebase, your own server
4. **Update externalSounds.json** - Replace all placeholder URLs
5. **Re-test** - Run test-playback.js again to verify downloads work

---

## Notes

- All URLs in externalSounds.json currently point to non-existent resources
- Test script will correctly identify these as 404 errors
- This is expected for a scaffold/demo app
- For production, you must provide real, accessible URLs
- Test script helps identify exactly which downloads fail and why
