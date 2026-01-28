import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SoundCategory = 'lock' | 'boombox';

interface Sound {
  id: string;
  name: string;
  duration: string;
  category: string;
  isBuiltIn: boolean;
}

// Placeholder bundled sounds (royalty-free from Pixabay)
const BUNDLED_SOUNDS: Sound[] = [
  { id: '1', name: 'Digital Chime', duration: '0:02', category: 'chime', isBuiltIn: true },
  { id: '2', name: 'Sci-Fi Beep', duration: '0:01', category: 'sci-fi', isBuiltIn: true },
  { id: '3', name: 'Soft Bell', duration: '0:02', category: 'bell', isBuiltIn: true },
  { id: '4', name: 'Electric Zap', duration: '0:01', category: 'sci-fi', isBuiltIn: true },
  { id: '5', name: 'Future Lock', duration: '0:02', category: 'chime', isBuiltIn: true },
  { id: '6', name: 'Notification Ping', duration: '0:01', category: 'notification', isBuiltIn: true },
  { id: '7', name: 'Retro Game', duration: '0:02', category: 'retro', isBuiltIn: true },
  { id: '8', name: 'Crystal Ding', duration: '0:01', category: 'bell', isBuiltIn: true },
  { id: '9', name: 'Robot Voice', duration: '0:03', category: 'sci-fi', isBuiltIn: true },
  { id: '10', name: 'Horn Melody', duration: '0:04', category: 'horn', isBuiltIn: true },
];

export default function SoundsScreen() {
  const [activeCategory, setActiveCategory] = useState<SoundCategory>('lock');
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySound = (soundId: string) => {
    if (selectedSound === soundId && isPlaying) {
      setIsPlaying(false);
      setSelectedSound(null);
    } else {
      setSelectedSound(soundId);
      setIsPlaying(true);
      // TODO: Implement actual audio playback with expo-av
      setTimeout(() => {
        setIsPlaying(false);
        setSelectedSound(null);
      }, 2000);
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

      {/* Sound List */}
      <ScrollView style={styles.soundList}>
        <Text style={styles.sectionTitle}>Built-in Sounds (Royalty Free)</Text>
        {BUNDLED_SOUNDS.map((sound) => (
          <TouchableOpacity
            key={sound.id}
            style={[
              styles.soundItem,
              selectedSound === sound.id && styles.soundItemActive,
            ]}
            onPress={() => handlePlaySound(sound.id)}
          >
            <View style={styles.soundItemLeft}>
              <Ionicons
                name={selectedSound === sound.id && isPlaying ? 'pause-circle' : 'play-circle'}
                size={40}
                color="#e94560"
              />
              <View style={styles.soundItemInfo}>
                <Text style={styles.soundItemName}>{sound.name}</Text>
                <Text style={styles.soundItemMeta}>
                  {sound.duration} • {sound.category}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => console.log('Select sound:', sound.id)}
            >
              <Ionicons name="checkmark-circle-outline" size={28} color="#16c79a" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

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
  soundList: {
    flex: 1,
    paddingHorizontal: 16,
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
  },
  soundItemInfo: {
    gap: 4,
  },
  soundItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  soundItemMeta: {
    color: '#6c757d',
    fontSize: 12,
  },
  selectButton: {
    padding: 4,
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
