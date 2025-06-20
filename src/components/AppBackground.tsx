/**
 * @file AppBackground.tsx
 * @description Background wrapper component with a static background image.
 */
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

interface AppBackgroundProps {
  children: React.ReactNode;
}

const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/InOSBkimg72x.png')}
        style={StyleSheet.absoluteFill} // Ensure it covers the entire screen
        resizeMode="cover"
        imageStyle={{ opacity: 1 }} // Ensure image is fully opaque
        onError={(error) => console.log('Background image failed to load:', error.nativeEvent.error)}
        // onLoad={() => console.log('Background image loaded successfully')} // Optional: for debugging
      >
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
    backgroundColor: colors.bg, // Fallback background color, useful if image fails to load
  },
  // backgroundImage style is now directly StyleSheet.absoluteFill in the component
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // Must be transparent to show the image underneath
  },
});

export default AppBackground;