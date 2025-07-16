// src/hooks/useOnboarding.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = (toolKey: string) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkBannerStatus = async () => {
      const bannerSeen = await AsyncStorage.getItem(`@banner_seen_${toolKey}`);
      if (!bannerSeen) {
        setShowBanner(true);
      }
    };
    checkBannerStatus();
  }, [toolKey]);

  const dismissBanner = async () => {
    await AsyncStorage.setItem(`@banner_seen_${toolKey}`, 'true');
    setShowBanner(false);
  };

  return { showBanner, dismissBanner };
};
