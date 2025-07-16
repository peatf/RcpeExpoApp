// src/contexts/ThemingContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aestheticsConfig, ThemeName, SoundscapeName, AnimationIntensity } from '../constants/aestheticsConfig';

interface AestheticsSettings {
  theme: ThemeName;
  soundscape: SoundscapeName;
  soundVolume: number;
  animationIntensity: AnimationIntensity;
  enableSoundscapes: boolean;
  enableAnimations: boolean;
}

interface ThemingContextType {
  settings: AestheticsSettings;
  updateSettings: (newSettings: Partial<AestheticsSettings>) => void;
  currentTheme: (typeof aestheticsConfig.themes)[ThemeName];
  isLoading: boolean;
}

const defaultSettings: AestheticsSettings = {
  theme: 'default',
  soundscape: 'silence',
  soundVolume: 0.3,
  animationIntensity: 'subtle',
  enableSoundscapes: false,
  enableAnimations: true,
};

export const ThemingContext = createContext<ThemingContextType | undefined>(undefined);

const STORAGE_KEY = '@aesthetics_settings';

export const ThemingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AestheticsSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load aesthetics settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AestheticsSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.warn('Failed to save aesthetics settings:', error);
    }
  };

  const currentTheme = aestheticsConfig.themes[settings.theme];

  return (
    <ThemingContext.Provider
      value={{
        settings,
        updateSettings,
        currentTheme,
        isLoading,
      }}
    >
      {children}
    </ThemingContext.Provider>
  );
};

export const useTheming = (): ThemingContextType => {
  const context = useContext(ThemingContext);
  if (!context) {
    throw new Error('useTheming must be used within a ThemingProvider');
  }
  return context;
};
