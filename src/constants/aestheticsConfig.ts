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
