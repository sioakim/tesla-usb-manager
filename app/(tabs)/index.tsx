import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSounds } from '@/hooks/useSounds';
import { useDownloadedSounds } from '@/hooks/useDownloadedSounds';
import { AdBanner } from '@/components/AdBanner';
import { ExternalSound, LocalSound } from '@/types/sounds';

type SoundCategory = 'lock' | 'boombox';

type Sound = LocalSound | ExternalSound;

export default function SoundsScreen() {
  const [activeCategory, setActiveCategory] = useState<SoundCategory>('lock');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedSounds, setDisplayedSounds] = useState<Sound[]>([]);
  const [visibleSounds, setVisibleSounds] = useState<Set<string>>(new Set());

  const audioPlayer = useAudioPlayer();
  const { bundledSounds, externalSounds, isLoading: catalogLoading, categories, getFilteredSounds } = useSounds();
  const { downloadedSounds, isDownloaded, downloadSound, isDownloading, cacheStats } = useDownloadedSounds();

  // Get all sources from external sounds
  const allSources = Array.from(new Set(externalSounds.map(s => s.sourceId))).map(sourceId => {
    const sound = externalSounds.find(s => s.sourceId === sourceId);
    return sound ? { id: sourceId, name: sound.sourceName } : null;
  }).filter(Boolean) as Array<{ id: string; name: string }>;

  // Filter sounds based on current selections
  useEffect(() => {
    const filterSounds = async () => {
      let filtered: Sound[] = [];

      // If search query exists, search across all sounds
      if (searchQuery.trim()) {
        filtered = [...bundledSounds, ...externalSounds].filter(sound => {
          const nameMatch = sound.name.toLowerCase().includes(searchQuery.toLowerCase());
          if ('tags' in sound && sound.tags) {
            const tagsMatch = sound.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return nameMatch || tagsMatch;
          }
          return nameMatch;
        });
      } else if (selectedSourceId === 'builtin') {
        // Show only bundled sounds
        filtered = bundledSounds;
      } else if (selectedSourceId) {
        // Filter by specific source
        filtered = externalSounds.filter(s => s.sourceId === selectedSourceId);
      } else {
        // Show all sounds (for now, prioritize bundled for testing)
        filtered = [...bundledSounds, ...externalSounds];
      }

      // Filter by category
      if (activeCategory === 'lock') {
        filtered = filtered.filter(s => ['movies', 'games', 'tv', 'sci-fi', 'general', 'chime', 'bell', 'notification'].includes(s.category));
      }

      setDisplayedSounds(filtered);
    };

    filterSounds();
  }, [searchQuery, selectedSourceId, activeCategory, bundledSounds, externalSounds]);

  const handlePlaySound = async (sound: Sound) => {
    // If same sound is playing, pause it
    if (audioPlayer.currentSoundId === sound.id && audioPlayer.isPlaying) {
      await audioPlayer.pauseSound();
      return;
    }

    try {
      let uri: string | any;

      if ('isBuiltIn' in sound && sound.isBuiltIn) {
        // Bundled sound - pass audioFile directly (can be require() result or URI string)
        uri = sound.audioFile;
        console.log('Playing bundled sound:', sound.name, 'URI type:', typeof uri);
      } else if ('audioUrl' in sound) {
        // External sound - check if cached, otherwise download
        const externalSound = sound as ExternalSound;
        const cached = isDownloaded(externalSound.id);

        if (cached) {
          // Use cached version
          const cachedPath = downloadedSounds.get(externalSound.id);
          if (cachedPath) {
            uri = cachedPath;
          } else {
            // Fallback to downloading
            uri = await downloadSound(externalSound);
          }
        } else {
          // Download and play
          try {
            uri = await downloadSound(externalSound);
          } catch (downloadError) {
            console.error('Failed to download sound:', downloadError);
            alert('Failed to download sound. Check your internet connection.');
            return;
          }
        }
      } else {
        return;
      }

      await audioPlayer.playSound(sound.id, uri);
    } catch (error) {
      console.error('Error playing sound:', error);
      alert('Error playing sound. Please try again.');
    }
  };

  const handleImportSound = () => {
    // TODO: Implement file picker with expo-document-picker
    console.log('Import sound');
  };

  const handleExportToUSB = () => {
    // TODO: Implement USB export
    console.log('Export to USB');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          style={[
            styles.categoryTab,
            activeCategory === 'lock' && styles.categoryTabActive,
          ]}
          onPress={() => setActiveCategory('lock')}
        >
          <Ionicons
            name="lock-closed"
            size={20}
            color={activeCategory === 'lock' ? '#e94560' : '#6c757d'}
          />
          <Text
            style={[
              styles.categoryTabText,
              activeCategory === 'lock' && styles.categoryTabTextActive,
            ]}
          >
            Lock Sounds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryTab,
            activeCategory === 'boombox' && styles.categoryTabActive,
          ]}
          onPress={() => setActiveCategory('boombox')}
        >
          <Ionicons
            name="megaphone"
            size={20}
            color={activeCategory === 'boombox' ? '#e94560' : '#6c757d'}
          />
          <Text
            style={[
              styles.categoryTabText,
              activeCategory === 'boombox' && styles.categoryTabTextActive,
            ]}
          >
            Boombox
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color="#e94560" />
        <Text style={styles.infoBannerText}>
          {activeCategory === 'lock'
            ? 'Lock sound plays when you lock your Tesla. Must be named LockChime.wav'
            : 'Boombox sounds play from external speaker. Place in Boombox folder.'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sounds..."
          placeholderTextColor="#6c757d"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#6c757d" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Source Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSourceId === null && styles.filterChipActive,
          ]}
          onPress={() => setSelectedSourceId(null)}
        >
          <Text style={[
            styles.filterChipText,
            selectedSourceId === null && styles.filterChipTextActive,
          ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedSourceId === 'builtin' && styles.filterChipActive,
          ]}
          onPress={() => setSelectedSourceId('builtin')}
        >
          <Text style={[
            styles.filterChipText,
            selectedSourceId === 'builtin' && styles.filterChipTextActive,
          ]}>
            Built-in
          </Text>
        </TouchableOpacity>
        {allSources.map(source => (
          <TouchableOpacity
            key={source.id}
            style={[
              styles.filterChip,
              selectedSourceId === source.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedSourceId(source.id)}
          >
            <Text style={[
              styles.filterChipText,
              selectedSourceId === source.id && styles.filterChipTextActive,
            ]}>
              {source.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sound List */}
      <ScrollView style={styles.soundList}>
        {catalogLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e94560" />
            <Text style={styles.loadingText}>Loading sounds...</Text>
          </View>
        ) : displayedSounds.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-note-outline" size={48} color="#6c757d" />
            <Text style={styles.emptyStateText}>No sounds found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or search
            </Text>
          </View>
        ) : (
          <>
            {displayedSounds.map((sound) => {
              const isExternal = 'sourceId' in sound;
              const isBuiltIn = 'isBuiltIn' in sound && sound.isBuiltIn;
              const cached = isExternal ? isDownloaded(sound.id) : false;
              const downloading = isExternal ? isDownloading(sound.id) : false;

              return (
                <TouchableOpacity
                  key={sound.id}
                  style={[
                    styles.soundItem,
                    audioPlayer.currentSoundId === sound.id && styles.soundItemActive,
                  ]}
                  onPress={() => handlePlaySound(sound)}
                  disabled={audioPlayer.isLoading && audioPlayer.currentSoundId === sound.id}
                >
                  <View style={styles.soundItemLeft}>
                    {audioPlayer.isLoading && audioPlayer.currentSoundId === sound.id ? (
                      <ActivityIndicator size={40} color="#e94560" />
                    ) : (
                      <Ionicons
                        name={audioPlayer.currentSoundId === sound.id && audioPlayer.isPlaying ? 'pause-circle' : 'play-circle'}
                        size={40}
                        color="#e94560"
                      />
                    )}
                    <View style={styles.soundItemInfo}>
                      <View style={styles.soundItemNameRow}>
                        <Text style={styles.soundItemName}>{sound.name}</Text>
                        {isExternal && (
                          <View style={styles.sourceBadge}>
                            <Text style={styles.sourceBadgeText}>{('sourceName' in sound) ? sound.sourceName : 'External'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.soundItemMeta}>
                        {sound.duration} • {sound.category}
                        {isExternal && 'popularity' in sound && sound.popularity ? ` • ⭐ ${sound.popularity}` : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.soundItemRight}>
                    {isExternal && !cached && !downloading && (
                      <Ionicons name="cloud-download-outline" size={24} color="#6c757d" />
                    )}
                    {downloading && (
                      <ActivityIndicator size={24} color="#e94560" />
                    )}
                    {cached && (
                      <Ionicons name="checkmark-circle" size={24} color="#16c79a" />
                    )}
                    {isBuiltIn && (
                      <Ionicons name="star" size={24} color="#e94560" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        <Text style={styles.sectionTitle}>Your Sounds</Text>
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={48} color="#6c757d" />
          <Text style={styles.emptyStateText}>No imported sounds yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Import your own .wav files to use as custom sounds
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.importButton} onPress={handleImportSound}>
          <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Import Sound</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportToUSB}>
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Export to USB</Text>
        </TouchableOpacity>
      </View>

      {/* Ad Banner */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    gap: 8,
  },
  categoryTabActive: {
    backgroundColor: '#2d2d44',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  categoryTabText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#e94560',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    color: '#adb5bd',
    fontSize: 12,
    lineHeight: 18,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingVertical: 10,
  },
  filterChipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 50,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  filterChipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  filterChipText: {
    color: '#6c757d',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  soundList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: '#adb5bd',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  soundItemActive: {
    borderWidth: 1,
    borderColor: '#e94560',
  },
  soundItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  soundItemInfo: {
    gap: 4,
    flex: 1,
  },
  soundItemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  soundItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  soundItemMeta: {
    color: '#6c757d',
    fontSize: 12,
  },
  soundItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderRadius: 4,
  },
  sourceBadgeText: {
    color: '#e94560',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyStateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    color: '#6c757d',
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
  },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d44',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e94560',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
