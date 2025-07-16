# Task: Emotional & Aesthetic Enhancements 🎶

## 1. Objective
Add ambient animations, optional soundscapes, and theming capabilities to deepen the user's emotional connection to the quest experience while maintaining accessibility and user control over these enhancements.

## 2. Files to Modify or Create

### Files to Modify:
- `src/screens/Main/QuestMapScreen.tsx`
- Various screen container components (to apply theming)

### **New Files to be Created:**
- `src/contexts/ThemingContext.tsx`
- `src/components/Animations/AmbientBackground.tsx`
- `src/components/Audio/SoundscapeManager.tsx`
- `src/screens/Settings/AestheticsSettingsScreen.tsx`
- `src/hooks/useAesthetics.ts`
- `src/assets/sounds/` (new directory with sound files)
- `src/assets/animations/` (new directory for Lottie files)
- `src/constants/aestheticsConfig.ts`

## 3. Detailed Implementation Steps

### Step 1: Create Aesthetics Configuration
Create `src/constants/aestheticsConfig.ts`:

```typescript
// src/constants/aestheticsConfig.ts
export const aestheticsConfig = {
  animations: {
    ambient: {
      questMap: 'floating-particles.json',
      oracle: 'mystical-orbs.json',
      calibration: 'energy-waves.json',
      general: 'subtle-glow.json',
    },
    intensity: {
      none: 0,
      subtle: 0.3,
      moderate: 0.6,
      full: 1.0,
    },
  },
  soundscapes: {
    ambient: {
      forest: 'forest-ambience.mp3',
      ocean: 'ocean-waves.mp3',
      space: 'cosmic-hum.mp3',
      silence: null,
    },
    volume: {
      muted: 0,
      quiet: 0.2,
      moderate: 0.5,
      loud: 0.8,
    },
  },
  themes: {
    cosmic: {
      primary: '#1a1a2e',
      secondary: '#16213e', 
      accent: '#0f3460',
      highlight: '#e94560',
      text: '#ffffff',
      textSecondary: '#b8b8b8',
    },
    earth: {
      primary: '#2d4a22',
      secondary: '#3e5c35',
      accent: '#5a7c50',
      highlight: '#8fbc8f',
      text: '#ffffff',
      textSecondary: '#d3d3d3',
    },
    default: {
      primary: '#007AFF',
      secondary: '#5856d6',
      accent: '#34c759',
      highlight: '#ff9500',
      text: '#000000',
      textSecondary: '#666666',
    },
  },
} as const;

export type AestheticsConfig = typeof aestheticsConfig;
export type ThemeName = keyof typeof aestheticsConfig.themes;
export type SoundscapeName = keyof typeof aestheticsConfig.soundscapes.ambient;
export type AnimationIntensity = keyof typeof aestheticsConfig.animations.intensity;
```

### Step 2: Create Theming Context
Create `src/contexts/ThemingContext.tsx`:

```typescript
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
  currentTheme: typeof aestheticsConfig.themes.default;
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

const ThemingContext = createContext<ThemingContextType | undefined>(undefined);

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
```

### Step 3: Create AmbientBackground Component
Create `src/components/Animations/AmbientBackground.tsx`:

```typescript
// src/components/Animations/AmbientBackground.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheming } from '../../contexts/ThemingContext';
import { aestheticsConfig } from '../../constants/aestheticsConfig';

interface AmbientBackgroundProps {
  animationType?: keyof typeof aestheticsConfig.animations.ambient;
  style?: any;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ 
  animationType = 'general',
  style 
}) => {
  const { settings } = useTheming();

  if (!settings.enableAnimations || settings.animationIntensity === 'none') {
    return null;
  }

  const animationFile = aestheticsConfig.animations.ambient[animationType];
  const opacity = aestheticsConfig.animations.intensity[settings.