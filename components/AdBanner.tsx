import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ADMOB_AD_UNIT_IDS } from '@/constants/AdMob';

interface AdBannerProps {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

export function AdBanner({ onAdLoaded, onAdFailedToLoad }: AdBannerProps) {
  const insets = useSafeAreaInsets();
  const [BannerAd, setBannerAd] = useState<any>(null);
  const [isWeb, setIsWeb] = useState(Platform.OS === 'web');

  useEffect(() => {
    // Only load BannerAd on native platforms
    if (!isWeb) {
      try {
        const gma = require('react-native-google-mobile-ads');
        if (gma && gma.BannerAd) {
          setBannerAd(() => gma.BannerAd);
        }
      } catch (e) {
        console.warn('AdMob BannerAd not available:', e.message);
      }
    }
  }, [isWeb]);

  const adUnitId = Platform.select({
    ios: ADMOB_AD_UNIT_IDS.banner.ios,
    android: ADMOB_AD_UNIT_IDS.banner.android,
    default: ADMOB_AD_UNIT_IDS.banner.android,
  });

  const handleAdLoaded = () => {
    console.log('Ad loaded successfully');
    onAdLoaded?.();
  };

  const handleAdFailedToLoad = (error: any) => {
    console.warn('Ad failed to load:', error);
    onAdFailedToLoad?.(error);
  };

  // If BannerAd is not available (e.g., on web), show placeholder
  if (!BannerAd || isWeb) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: insets.bottom,
            height: 50,
          },
        ]}
      >
        <Text style={{ color: '#666', fontSize: 12 }}>Ad Space</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <BannerAd
        unitId={adUnitId}
        size="ADAPTIVE_BANNER"
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
  },
});
