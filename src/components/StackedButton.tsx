/**
 * @file StackedButton.tsx
 * @description Enhanced stacked button component with proper depth and shadows matching HTML mockup
 */
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Animated } from 'react-native';
import { colors } from '../constants/theme';

interface StackedButtonProps {
  onPress: () => void;
  type: 'nav' | 'circle' | 'rect';
  children?: React.ReactNode;
  text?: string;
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StackedButton: React.FC<StackedButtonProps> = ({
  onPress,
  type,
  children,
  text,
  isActive = false,
  size = 'medium'
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const layerAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      ...layerAnims.map((anim, index) => 
        Animated.spring(anim, {
          toValue: index * 2,
          useNativeDriver: true,
        })
      )
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      ...layerAnims.map(anim => 
        Animated.spring(anim, {
          toValue: 0,
          useNativeDriver: true,
        })
      )
    ]).start();
  };

  const getLayerColors = () => [colors.base1, colors.base2, colors.base3, colors.base4, colors.base5, colors.base6];

  const getLayerStyle = (layerIndex: number) => {
    const layerColors = getLayerColors();
    const baseLayerStyle = styles[`${type}L${layerIndex + 1}` as keyof typeof styles];
    
    return {
      position: 'absolute' as const,
      backgroundColor: layerIndex === 3 && type === 'nav' && isActive ? colors.accent : layerColors[layerIndex],
      ...baseLayerStyle,
      transform: [
        { 
          translateY: layerAnims[layerIndex].interpolate({
            inputRange: [0, 10],
            outputRange: [0, -layerIndex * (type === 'circle' ? 3 : 2)],
          })
        }
      ],
      shadowColor: layerIndex < 3 ? colors.base3 : colors.base5,
      shadowOffset: { width: 0, height: layerIndex + 1 },
      shadowOpacity: 0.3 + (layerIndex * 0.1),
      shadowRadius: (layerIndex + 1) * 2,
      elevation: layerIndex + 2,
      zIndex: 6 - layerIndex,
    };
  };

  const containerStyle = type === 'nav' ? styles.navContainer : 
                        type === 'circle' ? styles.circleContainer : 
                        styles.rectContainer;

  return (
    <Animated.View style={[styles.button, containerStyle, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
        style={styles.touchable}
      >
        {/* Render all 6 layers */}
        {[0, 1, 2, 3, 4, 5].map(layerIndex => (
          <Animated.View
            key={layerIndex}
            style={getLayerStyle(layerIndex)}
          />
        ))}
        
        {/* Content */}
        {children && (
          <View style={styles.content}>
            {children}
          </View>
        )}
        {text && (
          <Text style={[styles.buttonText, type === 'rect' && styles.rectButtonText]}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    position: 'absolute',
    zIndex: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 16,
  },
  rectButtonText: {
    color: colors.bg,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: colors.base4,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Nav button styles
  navContainer: {
    width: 52,
    height: 52,
  },
  navL1: {
    width: 52,
    height: 52,
    borderRadius: 26,
    left: 0,
    top: 0,
  },
  navL2: {
    width: 44,
    height: 44,
    borderRadius: 22,
    left: 4,
    top: 2,
  },
  navL3: {
    width: 36,
    height: 36,
    borderRadius: 18,
    left: 8,
    top: 4,
  },
  navL4: {
    width: 28,
    height: 28,
    borderRadius: 14,
    left: 12,
    top: 6,
  },
  navL5: {
    width: 20,
    height: 20,
    borderRadius: 10,
    left: 16,
    top: 8,
  },
  navL6: {
    width: 12,
    height: 12,
    borderRadius: 6,
    left: 20,
    top: 10,
  },

  // Circle button styles (large action button)
  circleContainer: {
    width: 160,
    height: 160,
  },
  circleL1: {
    width: 160,
    height: 160,
    borderRadius: 80,
    left: 0,
    top: 0,
  },
  circleL2: {
    width: 136,
    height: 136,
    borderRadius: 68,
    left: 12,
    top: 4,
  },
  circleL3: {
    width: 112,
    height: 112,
    borderRadius: 56,
    left: 24,
    top: 8,
  },
  circleL4: {
    width: 88,
    height: 88,
    borderRadius: 44,
    left: 36,
    top: 12,
  },
  circleL5: {
    width: 64,
    height: 64,
    borderRadius: 32,
    left: 48,
    top: 16,
  },
  circleL6: {
    width: 40,
    height: 40,
    borderRadius: 20,
    left: 60,
    top: 20,
  },

  // Rectangular button styles
  rectContainer: {
    width: '100%',
    height: 90,
  },
  rectL1: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    left: 0,
    top: 0,
  },
  rectL2: {
    width: '90%',
    height: 75,
    borderRadius: 12,
    left: '5%',
    top: 3,
  },
  rectL3: {
    width: '80%',
    height: 60,
    borderRadius: 12,
    left: '10%',
    top: 6,
  },
  rectL4: {
    width: '70%',
    height: 45,
    borderRadius: 12,
    left: '15%',
    top: 9,
  },
  rectL5: {
    width: '60%',
    height: 30,
    borderRadius: 12,
    left: '20%',
    top: 12,
  },
  rectL6: {
    width: '50%',
    height: 15,
    borderRadius: 12,
    left: '25%',
    top: 15,
  },
});

export default StackedButton;