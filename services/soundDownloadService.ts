/**
 * Sound Download and Cache Service
 * Handles downloading external sounds and managing local cache using expo-file-system and AsyncStorage
 */

import * as FileSystemModule from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExternalSound, CachedSoundMetadata, DownloadProgress } from '@/types/sounds';

// Use the document directory for caching files
const CACHE_DIR = `${FileSystemModule.documentDirectory}sounds/`;
const THUMBNAIL_CACHE_DIR = `${FileSystemModule.documentDirectory}thumbnails/`;

// Re-export commonly used functions
const FileSystem = FileSystemModule;

const STORAGE_KEYS = {
  DOWNLOADED_SOUNDS: 'downloaded_sounds',
  CACHE_SIZE: 'cache_size',
  LAST_DOWNLOAD: 'last_download_date',
  DOWNLOAD_PROGRESS: 'download_progress',
};

class SoundDownloadService {
  private downloadProgress = new Map<string, number>();
  private activeDownloads = new Map<string, AbortController>();

  /**
   * Ensure cache directories exist
   */
  async ensureCacheDirectory(): Promise<void> {
    try {
      const soundDir = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!soundDir.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }

      const thumbnailDir = await FileSystem.getInfoAsync(THUMBNAIL_CACHE_DIR);
      if (!thumbnailDir.exists) {
        await FileSystem.makeDirectoryAsync(THUMBNAIL_CACHE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to create cache directories:', error);
    }
  }

  /**
   * Download a sound from URL and cache it
   */
  async downloadSound(sound: ExternalSound): Promise<string> {
    await this.ensureCacheDirectory();

    const soundPath = this.getSoundCachePath(sound.id);

    // Check if already cached
    try {
      const fileInfo = await FileSystem.getInfoAsync(soundPath);
      if (fileInfo.exists) {
        return soundPath;
      }
    } catch {
      // File doesn't exist, proceed with download
    }

    try {
      // Create abort controller for this download
      const abortController = new AbortController();
      this.activeDownloads.set(sound.id, abortController);

      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(
        sound.audioUrl,
        soundPath,
        {}
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult) {
        throw new Error('Download failed');
      }

      // Update metadata
      await this.updateCacheMetadata(sound.id, soundPath, sound.audioFormat);

      // Clear from active downloads
      this.activeDownloads.delete(sound.id);

      return soundPath;
    } catch (error) {
      console.error(`Failed to download sound ${sound.id}:`, error);
      this.activeDownloads.delete(sound.id);
      throw error;
    }
  }

  /**
   * Download multiple sounds (batch operation)
   */
  async downloadMultipleSounds(sounds: ExternalSound[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const sound of sounds) {
      try {
        const path = await this.downloadSound(sound);
        results.set(sound.id, path);
      } catch (error) {
        console.error(`Failed to download sound ${sound.id}:`, error);
        // Continue with next sound
      }
    }

    return results;
  }

  /**
   * Get cached sound file path
   */
  getSoundCachePath(soundId: string, format: string = 'wav'): string {
    return `${CACHE_DIR}${soundId}.${format}`;
  }

  /**
   * Check if a sound is cached locally
   */
  async isSoundCached(soundId: string): Promise<boolean> {
    try {
      // Try both formats
      const wavPath = this.getSoundCachePath(soundId, 'wav');
      const mp3Path = this.getSoundCachePath(soundId, 'mp3');

      const wavInfo = await FileSystem.getInfoAsync(wavPath);
      if (wavInfo.exists) return true;

      const mp3Info = await FileSystem.getInfoAsync(mp3Path);
      return mp3Info.exists;
    } catch {
      return false;
    }
  }

  /**
   * Get the cached file path for a sound (returns actual path if cached)
   */
  async getCachedSoundPath(soundId: string): Promise<string | null> {
    try {
      const wavPath = this.getSoundCachePath(soundId, 'wav');
      const wavInfo = await FileSystem.getInfoAsync(wavPath);
      if (wavInfo.exists) return wavPath;

      const mp3Path = this.getSoundCachePath(soundId, 'mp3');
      const mp3Info = await FileSystem.getInfoAsync(mp3Path);
      if (mp3Info.exists) return mp3Path;

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Clear all cached sounds
   */
  async clearCache(): Promise<void> {
    try {
      // Cancel any active downloads
      this.activeDownloads.forEach(controller => controller.abort());
      this.activeDownloads.clear();

      // Delete cache directory
      try {
        await FileSystem.deleteAsync(CACHE_DIR);
        await FileSystem.deleteAsync(THUMBNAIL_CACHE_DIR);
      } catch {
        // Directory might not exist
      }

      // Clear AsyncStorage entries
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.DOWNLOADED_SOUNDS,
        STORAGE_KEYS.CACHE_SIZE,
      ]);

      this.downloadProgress.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Get total cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!dirInfo.exists) return 0;

      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      let totalSize = 0;

      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${CACHE_DIR}${file}`);
        if (fileInfo.exists && 'size' in fileInfo) {
          totalSize += (fileInfo as any).size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }

  /**
   * Delete a specific cached sound
   */
  async deleteCachedSound(soundId: string): Promise<void> {
    try {
      const wavPath = this.getSoundCachePath(soundId, 'wav');
      const mp3Path = this.getSoundCachePath(soundId, 'mp3');

      await Promise.all([
        FileSystem.deleteAsync(wavPath).catch(() => {}),
        FileSystem.deleteAsync(mp3Path).catch(() => {}),
      ]);

      // Remove from cache metadata
      const cached = await this.getCachedSounds();
      delete cached[soundId];
      await AsyncStorage.setItem(
        STORAGE_KEYS.DOWNLOADED_SOUNDS,
        JSON.stringify(cached)
      );
    } catch (error) {
      console.error(`Failed to delete cached sound ${soundId}:`, error);
    }
  }

  /**
   * Get all cached sounds
   */
  async getCachedSounds(): Promise<Record<string, CachedSoundMetadata>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADED_SOUNDS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get cached sounds:', error);
      return {};
    }
  }

  /**
   * Update cache metadata in AsyncStorage
   */
  private async updateCacheMetadata(
    soundId: string,
    localPath: string,
    format: string
  ): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      const cached = await this.getCachedSounds();

      cached[soundId] = {
        soundId,
        localPath,
        downloadedAt: new Date().toISOString(),
        fileSize: (fileInfo.exists && 'size' in fileInfo) ? (fileInfo as any).size || 0 : 0,
        status: 'cached',
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.DOWNLOADED_SOUNDS,
        JSON.stringify(cached)
      );

      // Update last download timestamp
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DOWNLOAD, new Date().toISOString());
    } catch (error) {
      console.error('Failed to update cache metadata:', error);
    }
  }

  /**
   * Download and cache a thumbnail
   */
  async downloadThumbnail(url: string, thumbnailId: string): Promise<string | null> {
    try {
      await this.ensureCacheDirectory();

      const thumbnailPath = `${THUMBNAIL_CACHE_DIR}${thumbnailId}.jpg`;

      // Check if already cached
      const fileInfo = await FileSystem.getInfoAsync(thumbnailPath);
      if (fileInfo.exists) {
        return thumbnailPath;
      }

      // Download thumbnail
      await FileSystem.downloadAsync(url, thumbnailPath);
      return thumbnailPath;
    } catch (error) {
      console.error(`Failed to download thumbnail ${thumbnailId}:`, error);
      return null;
    }
  }

  /**
   * Get cached thumbnail path
   */
  async getCachedThumbnailPath(thumbnailId: string): Promise<string | null> {
    try {
      const thumbnailPath = `${THUMBNAIL_CACHE_DIR}${thumbnailId}.jpg`;
      const fileInfo = await FileSystem.getInfoAsync(thumbnailPath);
      return fileInfo.exists ? thumbnailPath : null;
    } catch {
      return null;
    }
  }

  /**
   * Set download progress for UI updates
   */
  setDownloadProgress(soundId: string, progress: number): void {
    this.downloadProgress.set(soundId, Math.min(100, Math.max(0, progress)));
  }

  /**
   * Get download progress
   */
  getDownloadProgress(soundId: string): number {
    return this.downloadProgress.get(soundId) || 0;
  }

  /**
   * Cancel active download
   */
  cancelDownload(soundId: string): void {
    const controller = this.activeDownloads.get(soundId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(soundId);
      this.downloadProgress.delete(soundId);
    }
  }

  /**
   * Format bytes to human-readable size
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const soundDownloadService = new SoundDownloadService();
