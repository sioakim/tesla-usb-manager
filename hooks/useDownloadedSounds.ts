/**
 * Custom hook for managing downloaded/cached sounds
 * Tracks which sounds are cached and manages download operations
 */

import { useEffect, useState, useCallback } from 'react';
import { soundDownloadService } from '@/services/soundDownloadService';
import { ExternalSound, CachedSoundMetadata } from '@/types/sounds';

// Helper to access static method
const SoundDownloadServiceHelper = {
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

export interface UseDownloadedSoundsReturn {
  downloadedSounds: Map<string, string>;
  downloadSound: (sound: ExternalSound) => Promise<string>;
  downloadMultipleSounds: (sounds: ExternalSound[]) => Promise<void>;
  isDownloaded: (soundId: string) => boolean;
  isDownloading: (soundId: string) => boolean;
  downloadProgress: number;
  clearCache: () => Promise<void>;
  cacheSize: number;
  cacheStats: { totalSounds: number; totalSize: string };
  cancelDownload: (soundId: string) => void;
  deleteCachedSound: (soundId: string) => Promise<void>;
}

/**
 * Hook for managing cached sounds
 */
export function useDownloadedSounds(): UseDownloadedSoundsReturn {
  const [downloadedSounds, setDownloadedSounds] = useState<Map<string, string>>(new Map());
  const [cacheSize, setCacheSize] = useState(0);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize cache on mount
  useEffect(() => {
    const initializeCache = async () => {
      try {
        await soundDownloadService.ensureCacheDirectory();
        const cached = await soundDownloadService.getCachedSounds();

        const downloadMap = new Map<string, string>();
        Object.entries(cached).forEach(([soundId, metadata]) => {
          downloadMap.set(soundId, (metadata as CachedSoundMetadata).localPath);
        });

        setDownloadedSounds(downloadMap);
        const size = await soundDownloadService.getCacheSize();
        setCacheSize(size);
      } catch (error) {
        console.error('Failed to initialize cache:', error);
      }
    };

    initializeCache();
  }, []);

  const downloadSound = useCallback(
    async (sound: ExternalSound): Promise<string> => {
      // Check if already cached
      if (downloadedSounds.has(sound.id)) {
        return downloadedSounds.get(sound.id)!;
      }

      try {
        setDownloadingIds(prev => new Set([...prev, sound.id]));

        const localPath = await soundDownloadService.downloadSound(sound);

        // Update state
        const newDownloaded = new Map(downloadedSounds);
        newDownloaded.set(sound.id, localPath);
        setDownloadedSounds(newDownloaded);

        // Update cache size
        const newSize = await soundDownloadService.getCacheSize();
        setCacheSize(newSize);

        setDownloadingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(sound.id);
          return newSet;
        });

        return localPath;
      } catch (error) {
        console.error(`Failed to download sound ${sound.id}:`, error);
        setDownloadingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(sound.id);
          return newSet;
        });
        throw error;
      }
    },
    [downloadedSounds]
  );

  const downloadMultipleSounds = useCallback(
    async (sounds: ExternalSound[]): Promise<void> => {
      const soundsToDownload = sounds.filter(s => !downloadedSounds.has(s.id));

      if (soundsToDownload.length === 0) {
        return;
      }

      try {
        const results = await soundDownloadService.downloadMultipleSounds(soundsToDownload);

        const newDownloaded = new Map(downloadedSounds);
        results.forEach((path, soundId) => {
          newDownloaded.set(soundId, path);
        });

        setDownloadedSounds(newDownloaded);

        const newSize = await soundDownloadService.getCacheSize();
        setCacheSize(newSize);

        setDownloadingIds(new Set());
      } catch (error) {
        console.error('Failed to download multiple sounds:', error);
        setDownloadingIds(new Set());
      }
    },
    [downloadedSounds]
  );

  const isDownloaded = useCallback(
    (soundId: string): boolean => {
      return downloadedSounds.has(soundId);
    },
    [downloadedSounds]
  );

  const isDownloading = useCallback(
    (soundId: string): boolean => {
      return downloadingIds.has(soundId);
    },
    [downloadingIds]
  );

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await soundDownloadService.clearCache();
      setDownloadedSounds(new Map());
      setCacheSize(0);
      setDownloadingIds(new Set());
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }, []);

  const cancelDownload = useCallback((soundId: string): void => {
    soundDownloadService.cancelDownload(soundId);
    setDownloadingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(soundId);
      return newSet;
    });
  }, []);

  const deleteCachedSound = useCallback(
    async (soundId: string): Promise<void> => {
      try {
        await soundDownloadService.deleteCachedSound(soundId);

        const newDownloaded = new Map(downloadedSounds);
        newDownloaded.delete(soundId);
        setDownloadedSounds(newDownloaded);

        const newSize = await soundDownloadService.getCacheSize();
        setCacheSize(newSize);
      } catch (error) {
        console.error(`Failed to delete cached sound ${soundId}:`, error);
        throw error;
      }
    },
    [downloadedSounds]
  );

  const cacheStats = {
    totalSounds: downloadedSounds.size,
    totalSize: SoundDownloadServiceHelper.formatBytes(cacheSize),
  };

  return {
    downloadedSounds,
    downloadSound,
    downloadMultipleSounds,
    isDownloaded,
    isDownloading,
    downloadProgress,
    clearCache,
    cacheSize,
    cacheStats,
    cancelDownload,
    deleteCachedSound,
  };
}
