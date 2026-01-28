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

interface MusicFile {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  size: string;
}

const IMPORTED_MUSIC: MusicFile[] = [];

export default function MusicScreen() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleImportMusic = () => {
    console.log('Import music');
  };

  const handleExportToUSB = () => {
    console.log('Export to USB');
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === IMPORTED_MUSIC.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(IMPORTED_MUSIC.map((file) => file.id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoBanner}>
        <Ionicons name="disc" size={20} color="#e94560" />
        <Text style={styles.infoBannerText}>
          Organize your music files for USB playback in your Tesla.
          Supported formats: MP3, FLAC, AAC, OGG, WAV
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {IMPORTED_MUSIC.length > 0 && (
          <View style={styles.statsBar}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{IMPORTED_MUSIC.length}</Text>
              <Text style={styles.statLabel}>Tracks</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{selectedFiles.length}</Text>
              <Text style={styles.statLabel}>Selected</Text>
            </View>
            <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
              <Ionicons
                name={selectedFiles.length === IMPORTED_MUSIC.length ? 'checkbox' : 'square-outline'}
                size={20}
                color="#e94560"
              />
              <Text style={styles.selectAllText}>
                {selectedFiles.length === IMPORTED_MUSIC.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Your Music Library</Text>
        {IMPORTED_MUSIC.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={64} color="#6c757d" />
            <Text style={styles.emptyStateText}>No music files added</Text>
            <Text style={styles.emptyStateSubtext}>
              Import music from your device to organize and transfer to your Tesla USB drive
            </Text>
            <TouchableOpacity style={styles.importButtonLarge} onPress={handleImportMusic}>
              <Ionicons name="add-circle" size={24} color="#ffffff" />
              <Text style={styles.importButtonLargeText}>Import Music Files</Text>
            </TouchableOpacity>
          </View>
        ) : (
          IMPORTED_MUSIC.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={[
                styles.musicItem,
                selectedFiles.includes(file.id) && styles.musicItemSelected,
              ]}
              onPress={() => toggleFileSelection(file.id)}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => toggleFileSelection(file.id)}
              >
                <Ionicons
                  name={selectedFiles.includes(file.id) ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={selectedFiles.includes(file.id) ? '#16c79a' : '#6c757d'}
                />
              </TouchableOpacity>
              <View style={styles.musicItemInfo}>
                <Text style={styles.musicItemName}>{file.name}</Text>
                <Text style={styles.musicItemMeta}>
                  {file.artist} • {file.album}
                </Text>
              </View>
              <View style={styles.musicItemRight}>
                <Text style={styles.musicItemDuration}>{file.duration}</Text>
                <Text style={styles.musicItemSize}>{file.size}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#e94560" />
            <Text style={styles.tipsTitle}>Tips for Tesla Music</Text>
          </View>
          <Text style={styles.tipsText}>
            • Use MP3 or FLAC for best compatibility{'\n'}
            • Organize by folders (Artist/Album/Track){'\n'}
            • Include album art as folder.jpg{'\n'}
            • Keep file names clean (no special characters){'\n'}
            • USB drive should be formatted as exFAT
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.importButton} onPress={handleImportMusic}>
          <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Add Music</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportButton, selectedFiles.length === 0 && styles.exportButtonDisabled]}
          onPress={handleExportToUSB}
          disabled={selectedFiles.length === 0}
        >
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
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6c757d',
    fontSize: 12,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 6,
  },
  selectAllText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    gap: 12,
  },
  emptyStateText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    color: '#6c757d',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 8,
  },
  importButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e94560',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  importButtonLargeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  musicItemSelected: {
    borderWidth: 1,
    borderColor: '#16c79a',
  },
  checkbox: {
    padding: 4,
  },
  musicItemInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  musicItemName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  musicItemMeta: {
    color: '#6c757d',
    fontSize: 12,
  },
  musicItemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  musicItemDuration: {
    color: '#adb5bd',
    fontSize: 14,
  },
  musicItemSize: {
    color: '#6c757d',
    fontSize: 12,
  },
  tipsCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  tipsText: {
    color: '#adb5bd',
    fontSize: 14,
    lineHeight: 24,
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
  exportButtonDisabled: {
    backgroundColor: '#4d4d6d',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
