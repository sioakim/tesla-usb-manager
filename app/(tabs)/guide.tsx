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
import { AdBanner } from '@/components/AdBanner';

interface GuideSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'overview',
    title: 'Why Two USB Drives?',
    icon: 'help-circle',
    content: [
      'Tesla uses USB drives for two purposes: TeslaCam/Sentry Mode recordings and media playback.',
      'TeslaCam requires specific partitioning (a dedicated TeslaCam folder structure).',
      'Using a USB hub with TWO separate drives avoids complex partitioning:',
      '• Drive 1: TeslaCam (formatted for dashcam recordings)',
      '• Drive 2: Media (your sounds, light shows, music)',
      'This app manages Drive 2 - your media drive.',
    ],
  },
  {
    id: 'hardware',
    title: 'What You Need',
    icon: 'hardware-chip',
    content: [
      '✓ USB Hub (powered recommended for reliability)',
      '✓ USB Drive 1: For TeslaCam (32GB+ recommended)',
      '✓ USB Drive 2: For Media (any size works)',
      '✓ Both drives formatted as exFAT or FAT32',
      '',
      '💡 Tip: Get a compact hub that fits in the center console',
      '💡 Tip: Use quality USB drives (SanDisk, Samsung) for durability',
    ],
  },
  {
    id: 'teslacam',
    title: 'Setting Up TeslaCam Drive',
    icon: 'videocam',
    content: [
      '1. Insert USB Drive 1 into your Tesla',
      '2. On the touchscreen, go to: Controls → Safety → Format USB Drive',
      '3. Tesla will format and create TeslaCam folder structure',
      '4. Done! This drive records Sentry Mode and dashcam footage',
      '',
      "⚠️ Don't mix TeslaCam with media files - use separate drives",
    ],
  },
  {
    id: 'media',
    title: 'Setting Up Media Drive',
    icon: 'musical-notes',
    content: [
      '1. Format USB Drive 2 as exFAT (or FAT32) using your computer',
      '2. Use this app to add sounds, light shows, and music',
      '3. Export to the USB drive when connected to your phone',
      '4. Plug both drives into your USB hub',
      '5. Connect hub to your Tesla',
      '',
      'This app creates the correct folder structure automatically!',
    ],
  },
  {
    id: 'structure',
    title: 'Media Drive Folder Structure',
    icon: 'folder-open',
    content: [
      'Your media USB should look like this:',
      '',
      '📁 USB Drive',
      '├── 🔊 LockChime.wav',
      '├── 📁 Boombox/',
      '│   └── 🔊 [horn sounds].wav',
      '├── 📁 LightShow/',
      '│   ├── 🎬 show1.fseq',
      '│   ├── 🎵 show1.mp3',
      '│   └── ...',
      '└── 📁 Music/',
      '    └── 🎵 [your music]',
    ],
  },
  {
    id: 'locksound',
    title: 'Lock Sound Requirements',
    icon: 'lock-closed',
    content: [
      '• File must be named exactly: LockChime.wav',
      '• Format: WAV (PCM)',
      '• Sample rate: 44.1 kHz',
      '• Bit depth: 16-bit',
      '• Channels: Mono or Stereo',
      '• Max file size: 1 MB',
      '• Duration: Keep it short (1-3 seconds)',
      '',
      'This app automatically converts sounds to the correct format!',
    ],
  },
  {
    id: 'boombox',
    title: 'Boombox Sound Requirements',
    icon: 'megaphone',
    content: [
      '• Place files in the Boombox/ folder',
      '• Format: WAV (same as lock sounds)',
      '• Can have multiple sounds',
      '• Select from touchscreen: Toybox → Boombox',
      '',
      '⚠️ Boombox only works when parked (not while driving)',
      '⚠️ Pedestrian Warning System must be enabled',
    ],
  },
  {
    id: 'lightshow',
    title: 'Light Show Requirements',
    icon: 'flash',
    content: [
      '• Requires TWO files per show:',
      '  - .fseq sequence file (controls lights)',
      '  - .mp3 or .wav audio file',
      '• Both files must have the same name (e.g., show.fseq + show.mp3)',
      '• Place in LightShow/ folder',
      '• Access from: Toybox → Light Show',
      '',
      'Find shows at teslalightshare.io or xlightshows.io',
    ],
  },
  {
    id: 'externalsounds',
    title: 'External Sound Sources',
    icon: 'cloud-download',
    content: [
      'This app includes sounds from community websites:',
      '',
      '🎬 Not a Tesla App',
      '→ 50+ curated sounds from movies, TV, games, and more',
      '→ Website: notateslaapp.com',
      '',
      '🎮 TeslaDeck',
      '→ Popular sounds and community collections',
      '→ Website: tesladeck.com',
      '',
      '✨ How External Sounds Work:',
      '• Browse and preview sounds in the app',
      '• Tap to download and cache locally for offline playback',
      '• Downloaded sounds show a checkmark icon',
      '• Export to your USB drive just like bundled sounds',
      '',
      '📱 Data & Privacy:',
      '• Sounds are downloaded on-demand (not included in app)',
      '• Cache is stored on your device locally',
      '• You can clear cache anytime from settings',
      '',
      '🔗 Attribution: Sounds are sourced from community creators',
      'Using this app respects their work and contributions',
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'build',
    content: [
      "❓ Tesla doesn't see my media files",
      '→ Check USB is formatted as exFAT (not NTFS)',
      '→ Ensure folder names are exact (case-sensitive)',
      '→ Try unplugging and replugging the hub',
      '',
      "❓ Lock sound doesn't play",
      '→ File must be named LockChime.wav (exact)',
      '→ Check file format (must be WAV, not MP3)',
      '→ Keep file under 1 MB',
      '',
      "❓ Light show won't load",
      '→ Both .fseq and audio file must have same name',
      '→ Files must be in LightShow folder (not subfolders)',
      '',
      "❓ Can't download external sounds",
      '→ Check your internet connection',
      '→ Ensure you have enough device storage',
      '→ Try clearing cache if storage is full',
    ],
  },
];

export default function GuideScreen() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAll = () => {
    setExpandedSections(GUIDE_SECTIONS.map((s) => s.id));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton} onPress={expandAll}>
          <Ionicons name="expand" size={18} color="#e94560" />
          <Text style={styles.headerButtonText}>Expand All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={collapseAll}>
          <Ionicons name="contract" size={18} color="#e94560" />
          <Text style={styles.headerButtonText}>Collapse All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Ionicons name="car-sport" size={40} color="#e94560" />
          <Text style={styles.welcomeTitle}>Tesla USB Setup Guide</Text>
          <Text style={styles.welcomeText}>
            Learn how to set up USB drives for custom sounds, light shows, and music in your Tesla
          </Text>
        </View>

        {GUIDE_SECTIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionIcon}>
                  <Ionicons name={section.icon} size={20} color="#e94560" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Ionicons
                name={expandedSections.includes(section.id) ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#6c757d"
              />
            </TouchableOpacity>
            {expandedSections.includes(section.id) && (
              <View style={styles.sectionContent}>
                {section.content.map((line, index) => (
                  <Text key={index} style={styles.sectionText}>
                    {line}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.supportCard}>
          <Ionicons name="heart" size={24} color="#e94560" />
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <Text style={styles.supportText}>
            Check the Tesla forums or Reddit r/teslamotors for community tips and troubleshooting
          </Text>
        </View>
      </ScrollView>

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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButtonText: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeCard: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeText: {
    color: '#adb5bd',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sectionContent: {
    backgroundColor: '#1a1a2e',
    marginTop: 2,
    padding: 16,
    paddingTop: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  sectionText: {
    color: '#adb5bd',
    fontSize: 14,
    lineHeight: 22,
  },
  supportCard: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  supportTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    color: '#adb5bd',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
