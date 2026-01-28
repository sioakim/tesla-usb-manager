/**
 * Type definitions for all sound-related functionality in the Tesla USB Manager app.
 * Supports bundled sounds, external sounds from community sources, and user-imported sounds.
 */

/**
 * Represents an external sound source (e.g., Not a Tesla App, TeslaDeck)
 */
export interface ExternalSoundSource {
  id: string;
  name: string;
  shortName: string;
  description: string;
  websiteUrl: string;
  iconUrl?: string;
  lastUpdated: string;
  enabled: boolean;
}

/**
 * Represents an external sound from a community source
 */
export interface ExternalSound {
  id: string;
  name: string;
  sourceId: string;
  sourceName: string;

  // Categorization
  category: string;
  subcategory?: string;
  tags?: string[];

  // Audio file information
  audioUrl: string;
  audioFormat: 'wav' | 'mp3';
  duration: string;
  durationMs?: number;
  fileSize?: number;

  // Visual assets
  thumbnailUrl?: string;
  thumbnailRatio?: string;

  // Metadata
  description?: string;
  originalSource?: string;
  license?: string;

  // Quality indicators
  teslaCompatible: boolean;
  needsConversion: boolean;
  featured?: boolean;
  popularity?: number;
}

/**
 * Root structure for the external sounds catalog
 */
export interface SoundCatalog {
  version: string;
  lastUpdated: string;
  sources: ExternalSoundSource[];
  sounds: ExternalSound[];
}

/**
 * Represents a bundled/built-in sound
 */
export interface LocalSound {
  id: string;
  name: string;
  duration: string;
  category: string;
  isBuiltIn: true;
  audioFile?: any; // For require() imports
}

/**
 * Union type for any sound that can be played
 */
export type UnifiedSound = LocalSound | ExternalSound;

/**
 * Parameters for filtering and searching sounds
 */
export interface SoundFilter {
  searchQuery?: string;
  sourceId?: string;
  category?: string;
  tags?: string[];
  teslaCompatibleOnly?: boolean;
  featuredOnly?: boolean;
}

/**
 * Cached sound metadata
 */
export interface CachedSoundMetadata {
  soundId: string;
  localPath: string;
  downloadedAt: string;
  fileSize: number;
  status: 'cached' | 'downloading' | 'failed';
}

/**
 * Download progress tracking
 */
export interface DownloadProgress {
  soundId: string;
  progress: number; // 0-100
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  error?: string;
}
