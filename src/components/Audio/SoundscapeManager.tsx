// src/components/Audio/SoundscapeManager.tsx
import React, { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useTheming } from '../../contexts/ThemingContext';
import { aestheticsConfig } from '../../constants/aestheticsConfig';

export const SoundscapeManager: React.FC = () => {
  const { settings } = useTheming();
  const sound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const manageSound = async () => {
      if (sound.current) {
        await sound.current.unloadAsync();
        sound.current = null;
      }

      if (settings.enableSoundscapes && settings.soundscape !== 'silence') {
        const soundFile = aestheticsConfig.soundscapes.ambient[settings.soundscape];
        if (soundFile) {
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              soundFile as any,
              {
                isLooping: true,
                volume: settings.soundVolume,
              }
            );
            sound.current = newSound;
            await sound.current.playAsync();
          } catch (error) {
            console.error('Failed to load soundscape:', error);
          }
        }
      }
    };

    manageSound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, [settings.enableSoundscapes, settings.soundscape, settings.soundVolume]);

  return null;
};
