/**
 * Custom hook for managing all sounds (bundled, external, and imported)
 * Provides unified interface for accessing and filtering sounds
 */

import { useEffect, useState } from 'react';
import { UnifiedSound, ExternalSound, LocalSound, SoundFilter } from '@/types/sounds';
import { soundCatalogService } from '@/services/soundCatalogService';

// Bundled sounds constant
const BUNDLED_SOUNDS: LocalSound[] = [
  { id: '1', name: 'Digital Chime', duration: '0:01', category: 'chime', isBuiltIn: true, audioFile: require('@/assets/sounds/digital-chime.wav') },
  { id: '2', name: 'Sci-Fi Beep', duration: '0:01', category: 'sci-fi', isBuiltIn: true, audioFile: require('@/assets/sounds/sci-fi-beep.wav') },
  { id: '3', name: 'Soft Bell', duration: '0:01', category: 'bell', isBuiltIn: true, audioFile: require('@/assets/sounds/soft-bell.wav') },
  { id: '4', name: 'Electric Zap', duration: '0:01', category: 'sci-fi', isBuiltIn: true, audioFile: require('@/assets/sounds/electric-zap.wav') },
  { id: '5', name: 'Future Lock', duration: '0:01', category: 'chime', isBuiltIn: true, audioFile: require('@/assets/sounds/future-lock.wav') },
  { id: '6', name: 'Notification Ping', duration: '0:01', category: 'notification', isBuiltIn: true, audioFile: require('@/assets/sounds/notification-ping.wav') },
  { id: '7', name: 'Retro Game', duration: '0:01', category: 'retro', isBuiltIn: true, audioFile: require('@/assets/sounds/retro-game.wav') },
  { id: '8', name: 'Crystal Ding', duration: '0:01', category: 'bell', isBuiltIn: true, audioFile: require('@/assets/sounds/crystal-ding.wav') },
  { id: '9', name: 'Robot Voice', duration: '0:01', category: 'sci-fi', isBuiltIn: true, audioFile: require('@/assets/sounds/robot-voice.wav') },
  { id: '10', name: 'Horn Melody', duration: '0:01', category: 'horn', isBuiltIn: true, audioFile: require('@/assets/sounds/horn-melody.wav') },
];

export interface UseSoundsReturn {
  allSounds: UnifiedSound[];
  bundledSounds: LocalSound[];
  externalSounds: ExternalSound[];
  isLoading: boolean;
  error: Error | null;
  filterByCategory: (category: string) => UnifiedSound[];
  filterBySource: (sourceId: string) => UnifiedSound[];
  searchSounds: (query: string) => UnifiedSound[];
  featuredSounds: ExternalSound[];
  categories: string[];
  getFilteredSounds: (filter: SoundFilter) => UnifiedSound[];
}

/**
 * Hook for managing all sounds in the app
 * Merges bundled sounds with external catalog sounds
 */
export function useSounds(): UseSoundsReturn {
  const [externalSounds, setExternalSounds] = useState<ExternalSound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredSounds, setFeaturedSounds] = useState<ExternalSound[]>([]);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        setIsLoading(true);
        const allExternal = await soundCatalogService.getAllSounds();
        setExternalSounds(allExternal);

        const allCategories = await soundCatalogService.getCategories();
        setCategories(allCategories);

        const featured = await soundCatalogService.getFeaturedSounds();
        setFeaturedSounds(featured);
      } catch (err) {
        console.error('Failed to load sounds:', err);
        setError(err instanceof Error ? err : new Error('Failed to load sounds'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSounds();
  }, []);

  const allSounds: UnifiedSound[] = [...BUNDLED_SOUNDS, ...externalSounds];

  const filterByCategory = (category: string): UnifiedSound[] => {
    return allSounds.filter(sound => sound.category === category);
  };

  const filterBySource = (sourceId: string): UnifiedSound[] => {
    return externalSounds.filter(
      sound => 'sourceId' in sound && sound.sourceId === sourceId
    );
  };

  const searchSounds = (query: string): UnifiedSound[] => {
    const lowerQuery = query.toLowerCase();
    return allSounds.filter(sound => {
      const nameMatch = sound.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = sound.category.toLowerCase().includes(lowerQuery);

      if ('tags' in sound && sound.tags) {
        const tagsMatch = sound.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        return nameMatch || categoryMatch || tagsMatch;
      }

      return nameMatch || categoryMatch;
    });
  };

  const getFilteredSounds = (filter: SoundFilter): UnifiedSound[] => {
    let externalFiltered = externalSounds;

    // Apply filter criteria
    if (filter.sourceId) {
      externalFiltered = externalFiltered.filter(s => s.sourceId === filter.sourceId);
    }
    if (filter.category) {
      externalFiltered = externalFiltered.filter(s => s.category === filter.category);
    }
    if (filter.teslaCompatibleOnly) {
      externalFiltered = externalFiltered.filter(s => s.teslaCompatible && !s.needsConversion);
    }
    if (filter.featuredOnly) {
      externalFiltered = externalFiltered.filter(s => s.featured);
    }
    if (filter.tags && filter.tags.length > 0) {
      externalFiltered = externalFiltered.filter(sound =>
        filter.tags!.some(tag => sound.tags?.includes(tag))
      );
    }
    if (filter.searchQuery) {
      const lowerQuery = filter.searchQuery.toLowerCase();
      externalFiltered = externalFiltered.filter(sound => {
        const nameMatch = sound.name.toLowerCase().includes(lowerQuery);
        const descriptionMatch = sound.description?.toLowerCase().includes(lowerQuery);
        const tagsMatch = sound.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        return nameMatch || descriptionMatch || tagsMatch;
      });
    }

    const bundledFiltered = BUNDLED_SOUNDS.filter(sound => {
      if (filter.category && sound.category !== filter.category) return false;
      if (filter.searchQuery) {
        const lowerQuery = filter.searchQuery.toLowerCase();
        if (!sound.name.toLowerCase().includes(lowerQuery)) return false;
      }
      return true;
    });

    return [...bundledFiltered, ...externalFiltered];
  };

  return {
    allSounds,
    bundledSounds: BUNDLED_SOUNDS,
    externalSounds,
    isLoading,
    error,
    filterByCategory,
    filterBySource,
    searchSounds,
    featuredSounds,
    categories,
    getFilteredSounds,
  };
}
