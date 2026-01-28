# External Sounds Catalog Schema

This document describes the structure and fields of `constants/externalSounds.json`.

## Root Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | ✓ | Schema version (e.g., "1.0.0") |
| `lastUpdated` | string | ✓ | ISO 8601 date when catalog was last updated |
| `sources` | array | ✓ | Array of sound source definitions |
| `sounds` | array | ✓ | Array of external sounds |

## Source Object

Defines a sound source website/provider.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (lowercase, no spaces) e.g., "notateslaapp" |
| `name` | string | ✓ | Display name e.g., "Not a Tesla App" |
| `shortName` | string | ✓ | Abbreviated name for badges e.g., "NATA" |
| `description` | string | ✗ | Brief description of the source |
| `websiteUrl` | string | ✗ | URL to the source website |
| `enabled` | boolean | ✓ | Whether to include sounds from this source |
| `lastUpdated` | string | ✗ | ISO 8601 date when this source was last checked |

## Sound Object

Defines a single external sound.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier. Format: `{sourceId}-{uniqueKey}` e.g., "notateslaapp-jarvis" |
| `name` | string | Display name e.g., "Jarvis Defense Protocol Activated Sir" |
| `sourceId` | string | References `sources[].id` - must match an enabled source |
| `sourceName` | string | Denormalized source name for easy display (e.g., "Not a Tesla App") |
| `category` | string | Main category: "movies", "tv", "games", "retro", "cartoons", "general" |
| `audioUrl` | string | Direct HTTPS URL to the audio file |
| `audioFormat` | string | Audio format: "wav" or "mp3" |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `subcategory` | string | Optional subcategory e.g., "Iron Man", "Star Wars", "Super Mario" |
| `tags` | array | Searchable tags for filtering e.g., ["jarvis", "marvel", "ai", "tony stark"] |
| `duration` | string | Display format for duration e.g., "0:02", "0:03" |
| `description` | string | Human-friendly description of the sound |
| `originalSource` | string | Original media source e.g., "Iron Man (2008)", "Windows 98" |
| `needsConversion` | boolean | Whether format conversion is needed (default: false) |
| `featured` | boolean | Whether to highlight in featured section (default: false) |
| `popularity` | number | Popularity score 0-100 for sorting (default: not set) |

## Field Descriptions

### `id` (Required)
- Unique identifier within the catalog
- Format: `{sourceId}-{slug}` where slug is lowercase and hyphenated
- Examples: `notateslaapp-jarvis`, `notateslaapp-mario-coin`

### `sourceId` (Required)
- Must match exactly with a `sources[].id` entry
- Used for filtering by source
- Example: `"notateslaapp"`

### `category` (Required)
- Main category for filtering and organization
- Valid values: `"movies"`, `"tv"`, `"games"`, `"retro"`, `"cartoons"`, `"general"`
- Determines which filter chip the sound appears under

### `audioUrl` (Required)
- Must be HTTPS URL (never HTTP)
- URL must be directly accessible and return HTTP 200
- Should point to audio file, not a download page
- Examples:
  - ✓ `https://www.notateslaapp.com/assets/audio/shows-movies/iron-man_jarvis-defense-protocol-activated-sir.wav`
  - ✗ `https://www.notateslaapp.com/sounds/download?id=123`

### `audioFormat` (Required)
- Must be `"wav"` or `"mp3"`
- All sounds should be compatible with Tesla (44.1kHz, <1MB)

### `tags` (Optional)
- Array of lowercase, hyphenated tags for search functionality
- Examples: `["jarvis", "marvel", "ai", "tony stark"]`
- Used for full-text search in the UI

### `featured` (Optional)
- Boolean flag to highlight sounds in featured section
- Keep to 6-8 sounds with highest popularity
- Example: `true` for top sounds like Jarvis, iPhone Lock, Mario Theme

### `popularity` (Optional)
- Numeric score 0-100 for ranking
- Higher values = more popular
- Used for sorting within featured section
- Example: `99` for most popular, `63` for least popular

## Example Entry

```json
{
  "id": "notateslaapp-jarvis",
  "name": "Jarvis Defense Protocol Activated Sir",
  "sourceId": "notateslaapp",
  "sourceName": "Not a Tesla App",
  "category": "movies",
  "subcategory": "Iron Man",
  "tags": ["jarvis", "marvel", "ai", "tony stark"],
  "audioUrl": "https://www.notateslaapp.com/assets/audio/shows-movies/iron-man_jarvis-defense-protocol-activated-sir.wav",
  "audioFormat": "wav",
  "duration": "0:02",
  "description": "Jarvis announces defense protocol activation",
  "originalSource": "Iron Man (2008)",
  "needsConversion": false,
  "featured": true,
  "popularity": 99
}
```

## Validation Rules

1. **Unique IDs**: All sound `id` values must be unique
2. **Valid Source References**: All `sourceId` values must reference an existing enabled source
3. **URL Format**: All URLs must be HTTPS and return HTTP 200
4. **Category Consistency**: All sounds with same `sourceId` should span all categories if possible
5. **Featured Limit**: Keep `featured: true` to 6-8 sounds maximum
6. **Popularity Range**: If used, keep values between 0-100
7. **Format Compatibility**: Ensure all audio files are Tesla-compatible

## Updating the Catalog

When adding new sounds:

1. Choose next available ID based on source and name
2. Verify audioUrl returns HTTP 200
3. Test the URL directly in browser
4. Add to appropriate category
5. Add relevant tags for searching
6. Set `featured: true` only for popular sounds (max 8 total)
7. Assign popularity score relative to existing sounds
8. Update `lastUpdated` in root object to current ISO date
9. Run validation if available (e.g., `npm run validate-sounds`)

## Size Considerations

- JSON file should remain <500KB even with 200+ sounds
- Current version: 35 sounds from notateslaapp.com
- Target expansion: 100+ sounds across multiple sources
- Audio files stored separately (not in JSON)
