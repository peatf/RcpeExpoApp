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
  const opacity = aestheticsConfig.animations.intensity[settings.animationIntensity];

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={animationFile}
        autoPlay
        loop
        style={[styles.lottie, { opacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
