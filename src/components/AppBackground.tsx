/**
 * @file AppBackground.tsx
 * @description Background wrapper component with animated grid and floating orbs matching mockup design
 */
import React, { useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { colors } from '../constants/theme';

interface AppBackgroundProps {
  children: React.ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  const gridAnimation = useRef(new Animated.Value(0)).current;
  const orbAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated grid panning
    const gridLoop = Animated.loop(
      Animated.timing(gridAnimation, {
        toValue: 1,
        duration: 120000, // 2 minutes like in the mockup
        useNativeDriver: true,
      })
    );

    // Floating orb animation
    const orbLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnimation, {
          toValue: 1,
          duration: 30000, // 30 seconds
          useNativeDriver: true,
        }),
        Animated.timing(orbAnimation, {
          toValue: 0,
          duration: 30000,
          useNativeDriver: true,
        }),
      ])
    );

    gridLoop.start();
    orbLoop.start();

    return () => {
      gridLoop.stop();
      orbLoop.stop();
    };
  }, []);

  const gridTransform = gridAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 480], // Grid size from mockup
  });

  const orbTransform = orbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const orbTranslateX = orbTransform.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth * 0.1, screenWidth * 0.15],
  });

  const orbTranslateY = orbTransform.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenHeight * 0.15, screenHeight * 0.1],
  });

  const orbRotate = orbTransform.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '50deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/InOSBkimg72x.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{ opacity: 1 }}
        onError={(error) => console.log('Background image failed to load:', error.nativeEvent)}
        onLoad={() => console.log('Background image loaded successfully')}
      >
        {/* Animated Grid */}
        <Animated.View 
          style={[
            styles.animatedGrid,
            {
              transform: [
                { translateX: gridTransform },
                { translateY: gridAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 240], // Half the grid size
                }) }
              ]
            }
          ]}
        />

        {/* Floating Orb */}
        <Animated.View 
          style={[
            styles.floatingOrb,
            {
              transform: [
                { translateX: orbTranslateX },
                { translateY: orbTranslateY },
                { rotate: orbRotate },
              ]
            }
          ]}
        />

        {/* Main Overlay */}
        <View style={styles.overlay}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg, // Fallback background color
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  animatedGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    backgroundColor: 'transparent',
    // Simple grid effect with border pattern
    borderColor: colors.base1,
    borderWidth: 1,
  },
  floatingOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accentSecondary,
    opacity: 0.15,
    top: -screenHeight * 0.1,
    left: -screenWidth * 0.2,
    // Blur effect would require additional library
    shadowColor: colors.accentSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 80,
    elevation: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // Completely transparent to show background image
  },
});

export default AppBackground;