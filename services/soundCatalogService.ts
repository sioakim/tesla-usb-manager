/**
 * Sound Catalog Service
 * Handles loading, filtering, and searching the external sounds catalog
 */

import { SoundCatalog, ExternalSound, ExternalSoundSource, SoundFilter } from '@/types/sounds';
import catalogData from '@/constants/externalSounds.json';

class SoundCatalogService {
  private catalog: SoundCatalog | null = null;
  private isLoaded = false;

  /**
   * Load the external sounds catalog
   */
  async loadCatalog(): Promise<SoundCatalog> {
    if (this.isLoaded && this.catalog) {
      return this.catalog;
    }

    try {
      this.catalog = catalogData as SoundCatalog;
      this.isLoaded = true;
      return this.catalog;
    } catch (error) {
      console.error('Failed to load sound catalog:', error);
      throw new Error('Failed to load sound catalog');
    }
  }

  /**
   * Get all enabled sources
   */
  async getSources(): Promise<ExternalSoundSource[]> {
    const catalog = await this.loadCatalog();
    return catalog.sources.filter(source => source.enabled);
  }

  /**
   * Get a specific source by ID
   */
  async getSource(sourceId: string): Promise<ExternalSoundSource | undefined> {
    const catalog = await this.loadCatalog();
    return catalog.sources.find(s => s.id === sourceId);
  }

  /**
   * Get all sounds (optionally filtered)
   */
  async getAllSounds(): Promise<ExternalSound[]> {
    const catalog = await this.loadCatalog();
    return catalog.sounds;
  }

  /**
   * Get sounds by source ID
   */
  async getSoundsBySource(sourceId: string): Promise<ExternalSound[]> {
    const catalog = await this.loadCatalog();
    return catalog.sounds.filter(sound => sound.sourceId === sourceId);
  }

  /**
   * Get sounds by category
   */
  async getSoundsByCategory(category: string): Promise<ExternalSound[]> {
    const catalog = await this.loadCatalog();
    return catalog.sounds.filter(sound => sound.category === category);
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const catalog = await this.loadCatalog();
    const categories = new Set(catalog.sounds.map(sound => sound.category));
    return Array.from(categories).sort();
  }

  /**
   * Search sounds by query (searches name, tags, description, and original source)
   */
  async searchSounds(query: string): Promise<ExternalSound[]> {
    const catalog = await this.loadCatalog();
    const lowerQuery = query.toLowerCase();

    return catalog.sounds.filter(sound => {
      const nameMatch = sound.name.toLowerCase().includes(lowerQuery);
      const descriptionMatch = sound.description?.toLowerCase().includes(lowerQuery);
      const tagsMatch = sound.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const sourceMatch = sound.originalSource?.toLowerCase().includes(lowerQuery);

      return nameMatch || descriptionMatch || tagsMatch || sourceMatch;
    });
  }

  /**
   * Get featured sounds
   */
  async getFeaturedSounds(): Promise<ExternalSound[]> {
    const catalog = await this.loadCatalog();
    return catalog.sounds
      .filter(sound => sound.featured)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  /**
   * Filter sounds based on multiple criteria
   */
  async filterSounds(filter: SoundFilter): Promise<ExternalSound[]> {
    let sounds = await this.getAllSounds();

    // Filter by source
    if (filter.sourceId) {
      sounds = sounds.filter(s => s.sourceId === filter.sourceId);
    }

    // Filter by category
    if (filter.category) {
      sounds = sounds.filter(s => s.category === filter.category);
    }

    // Filter by Tesla compatibility
    if (filter.teslaCompatibleOnly) {
      sounds = sounds.filter(s => s.teslaCompatible && !s.needsConversion);
    }

    // Filter by featured
    if (filter.featuredOnly) {
      sounds = sounds.filter(s => s.featured);
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      sounds = sounds.filter(sound =>
        filter.tags!.some(tag => sound.tags?.includes(tag))
      );
    }

    // Search by query
    if (filter.searchQuery) {
      const lowerQuery = filter.searchQuery.toLowerCase();
      sounds = sounds.filter(sound => {
        const nameMatch = sound.name.toLowerCase().includes(lowerQuery);
        const descriptionMatch = sound.description?.toLowerCase().includes(lowerQuery);
        const tagsMatch = sound.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        const sourceMatch = sound.originalSource?.toLowerCase().includes(lowerQuery);

        return nameMatch || descriptionMatch || tagsMatch || sourceMatch;
      });
    }

    return sounds;
  }

  /**
   * Get unique tags from all sounds
   */
  async getAllTags(): Promise<string[]> {
    const catalog = await this.loadCatalog();
    const tagsSet = new Set<string>();

    catalog.sounds.forEach(sound => {
      sound.tags?.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  }

  /**
   * Validate catalog schema
   */
  async validateCatalog(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      const catalog = await this.loadCatalog();

      // Check version
      if (!catalog.version) {
        errors.push('Missing catalog version');
      }

      // Check lastUpdated
      if (!catalog.lastUpdated) {
        errors.push('Missing lastUpdated date');
      }

      // Check sources
      if (!Array.isArray(catalog.sources)) {
        errors.push('Sources must be an array');
      } else {
        catalog.sources.forEach((source, idx) => {
          if (!source.id) errors.push(`Source ${idx}: missing id`);
          if (!source.name) errors.push(`Source ${idx}: missing name`);
          if (!source.websiteUrl) errors.push(`Source ${idx}: missing websiteUrl`);
        });
      }

      // Check sounds
      if (!Array.isArray(catalog.sounds)) {
        errors.push('Sounds must be an array');
      } else {
        const sourceIds = new Set(catalog.sources.map(s => s.id));
        const soundIds = new Set<string>();

        catalog.sounds.forEach((sound, idx) => {
          // Check required fields
          if (!sound.id) errors.push(`Sound ${idx}: missing id`);
          if (soundIds.has(sound.id)) errors.push(`Sound ${idx}: duplicate id`);
          soundIds.add(sound.id);

          if (!sound.name) errors.push(`Sound ${idx}: missing name`);
          if (!sound.sourceId) errors.push(`Sound ${idx}: missing sourceId`);
          if (!sourceIds.has(sound.sourceId)) {
            errors.push(`Sound ${idx}: invalid sourceId reference`);
          }
          if (!sound.category) errors.push(`Sound ${idx}: missing category`);
          if (!sound.audioUrl) errors.push(`Sound ${idx}: missing audioUrl`);
          if (!sound.audioFormat) errors.push(`Sound ${idx}: missing audioFormat`);
          if (!sound.duration) errors.push(`Sound ${idx}: missing duration`);

          // Validate format
          if (sound.audioFormat && !['wav', 'mp3'].includes(sound.audioFormat)) {
            errors.push(`Sound ${idx}: invalid audioFormat "${sound.audioFormat}"`);
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to validate catalog: ${error}`],
      };
    }
  }

  /**
   * Get catalog statistics
   */
  async getStatistics(): Promise<{
    totalSounds: number;
    totalSources: number;
    enabledSources: number;
    soundsByCategory: Record<string, number>;
    soundsBySource: Record<string, number>;
  }> {
    const catalog = await this.loadCatalog();
    const soundsByCategory: Record<string, number> = {};
    const soundsBySource: Record<string, number> = {};

    catalog.sounds.forEach(sound => {
      soundsByCategory[sound.category] = (soundsByCategory[sound.category] || 0) + 1;
      soundsBySource[sound.sourceId] = (soundsBySource[sound.sourceId] || 0) + 1;
    });

    return {
      totalSounds: catalog.sounds.length,
      totalSources: catalog.sources.length,
      enabledSources: catalog.sources.filter(s => s.enabled).length,
      soundsByCategory,
      soundsBySource,
    };
  }
}

export const soundCatalogService = new SoundCatalogService();
