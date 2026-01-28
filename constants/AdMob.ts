// AdMob configuration
// Test IDs for development - replace with production IDs before publishing
// Get real IDs at https://admob.google.com

const TEST_AD_UNIT_IDS = {
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
  },
};

export const ADMOB_AD_UNIT_IDS = {
  banner: {
    ios: TEST_AD_UNIT_IDS.ios.banner,
    android: TEST_AD_UNIT_IDS.android.banner,
  },
};

// AdMob App IDs (from Google AdMob console)
// Update these with your actual app IDs before publishing
export const ADMOB_APP_IDS = {
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
  android: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
};
