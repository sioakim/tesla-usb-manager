import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdBanner } from '@/components/AdBanner';

interface LightShow {
  id: string;
  name: string;
  artist: string;
  duration: string;
  source: 'imported' | 'online';
  hasFseq: boolean;
  hasAudio: boolean;
}

const IMPORTED_SHOWS: LightShow[] = [];

const POPULAR_SOURCES = [
  {
    name: 'Tesla Light Share',
    url: 'https://teslalightshare.io',
    description: 'Community light show library',
  },
  {
    name: 'xLights Shows',
    url: 'https://xlightshows.io',
    description: 'xLights compatible shows',
  },
];

export default function LightShowsScreen() {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  const handleImportShow = () => {
    console.log('Import light show');
  };

  const handleExportToUSB = () => {
    console.log('Export to USB');
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoBanner}>
        <Ionicons name="bulb" size={20} color="#e94560" />
        <Text style={styles.infoBannerText}>
          Light shows require a .fseq sequence file paired with an audio file (.mp3 or .wav).
          Place both in the LightShow folder on your USB drive.
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your Light Shows</Text>
        {IMPORTED_SHOWS.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flash-outline" size={48} color="#6c757d" />
            <Text style={styles.emptyStateText}>No light shows imported</Text>
            <Text style={styles.emptyStateSubtext}>
              Import .fseq files from your device or download from online sources
            </Text>
          </View>
        ) : (
          IMPORTED_SHOWS.map((show) => (
            <TouchableOpacity
              key={show.id}
              style={[
                styles.showItem,
                selectedShow === show.id && styles.showItemActive,
              ]}
              onPress={() => setSelectedShow(show.id)}
            >
              <View style={styles.showItemLeft}>
                <View style={styles.showIcon}>
                  <Ionicons name="flash" size={24} color="#e94560" />
                </View>
                <View style={styles.showItemInfo}>
                  <Text style={styles.showItemName}>{show.name}</Text>
                  <Text style={styles.showItemMeta}>
                    {show.artist} • {show.duration}
                  </Text>
                  <View style={styles.fileBadges}>
                    <View style={[styles.badge, show.hasFseq && styles.badgeSuccess]}>
                      <Text style={styles.badgeText}>.fseq</Text>
                    </View>
                    <View style={[styles.badge, show.hasAudio && styles.badgeSuccess]}>
                      <Text style={styles.badgeText}>audio</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.selectButton}>
                <Ionicons name="checkmark-circle-outline" size={28} color="#16c79a" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>Find Light Shows Online</Text>
        <Text style={styles.sectionSubtitle}>
          Download shows from community websites, then import them here
        </Text>
        {POPULAR_SOURCES.map((source, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sourceItem}
            onPress={() => openExternalLink(source.url)}
          >
            <View style={styles.sourceItemLeft}>
              <View style={styles.sourceIcon}>
                <Ionicons name="globe" size={24} color="#16c79a" />
              </View>
              <View>
                <Text style={styles.sourceItemName}>{source.name}</Text>
                <Text style={styles.sourceItemDesc}>{source.description}</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={24} color="#6c757d" />
          </TouchableOpacity>
        ))}

        <View style={styles.tutorialCard}>
          <View style={styles.tutorialHeader}>
            <Ionicons name="help-circle" size={24} color="#e94560" />
            <Text style={styles.tutorialTitle}>How Light Shows Work</Text>
          </View>
          <Text style={styles.tutorialText}>
            1. Download a light show (.fseq + audio file){'\n'}
            2. Import both files using the button below{'\n'}
            3. Export to your USB drive{'\n'}
            4. In your Tesla: Entertainment → Toybox → Light Show{'\n'}
            5. Select your show and enjoy!
          </Text>
          <Text style={styles.tutorialNote}>
            ⚠️ Light shows work best when parked in a dark area
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.importButton} onPress={handleImportShow}>
          <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Import Show</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportToUSB}>
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Export to USB</Text>
        </TouchableOpacity>
      </View>

      {/* Ad Banner */}
      <AdBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    margin: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#6c757d',
    fontSize: 13,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
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
    paddingHorizontal: 20,
  },
  showItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  showItemActive: {
    borderWidth: 1,
    borderColor: '#e94560',
  },
  showItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  showIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showItemInfo: {
    gap: 4,
    flex: 1,
  },
  showItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  showItemMeta: {
    color: '#6c757d',
    fontSize: 12,
  },
  fileBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#2d2d44',
    borderRadius: 4,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(22, 199, 154, 0.2)',
  },
  badgeText: {
    color: '#adb5bd',
    fontSize: 10,
    fontWeight: '600',
  },
  selectButton: {
    padding: 4,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sourceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(22, 199, 154, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sourceItemDesc: {
    color: '#6c757d',
    fontSize: 12,
  },
  tutorialCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tutorialTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  tutorialText: {
    color: '#adb5bd',
    fontSize: 14,
    lineHeight: 24,
  },
  tutorialNote: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
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
