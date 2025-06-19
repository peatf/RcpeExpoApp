import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ASYNC_STORAGE_PREFIX = 'onboarding_';

const useOnboardingBanner = (toolName: string) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // To prevent flash of banner

  const storageKey = `${ASYNC_STORAGE_PREFIX}${toolName.replace(/\s+/g, '_')}`; // Sanitize toolName for key

  useEffect(() => {
    const checkBannerState = async () => {
      setIsLoading(true);
      try {
        const hasSeenBanner = await AsyncStorage.getItem(storageKey);
        setShowBanner(hasSeenBanner === null); // Show if key doesn't exist (null)
      } catch (error) {
        console.error(`Error reading AsyncStorage for ${storageKey}:`, error);
        setShowBanner(true); // Default to showing banner on error to be safe
      } finally {
        setIsLoading(false);
      }
    };

    checkBannerState();
  }, [storageKey]);

  const dismissBanner = useCallback(async () => {
    try {
      await AsyncStorage.setItem(storageKey, 'true');
      setShowBanner(false);
    } catch (error) {
      console.error(`Error setting AsyncStorage for ${storageKey}:`, error);
      // Optionally, handle the error, e.g., by trying to dismiss again later
    }
  }, [storageKey]);

  return { showBanner, dismissBanner, isLoadingBanner: isLoading };
};

export default useOnboardingBanner;
