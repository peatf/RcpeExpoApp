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

  const getLayerStyle = (layerIndex: number) => {
    switch (type) {
      case 'nav':
        return {
          ...styles.layer,
          ...styles[`navL${layerIndex + 1}` as keyof typeof styles],
          backgroundColor: layerIndex === 3 && isActive ? colors.accent : 
            layerIndex === 0 ? colors.base1 :
            layerIndex === 1 ? colors.base2 :
            layerIndex === 2 ? colors.base3 :
            layerIndex === 3 ? colors.base4 :
            layerIndex === 4 ? colors.base5 : colors.base6,
          transform: [
            { 
              translateY: layerAnims[layerIndex].interpolate({
                inputRange: [0, 10],
                outputRange: [0, -layerIndex * 2],
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
      case 'circle':
        return {
          ...styles.layer,
          ...styles[`circleL${layerIndex + 1}` as keyof typeof styles],
          backgroundColor: 
            layerIndex === 0 ? colors.base1 :
            layerIndex === 1 ? colors.base2 :
            layerIndex === 2 ? colors.base3 :
            layerIndex === 3 ? colors.base4 :
            layerIndex === 4 ? colors.base5 : colors.base6,
          transform: [
            { 
              translateY: layerAnims[layerIndex].interpolate({
                inputRange: [0, 10],
                outputRange: [0, -layerIndex * 3],
              })
            }
          ],
          shadowColor: layerIndex < 3 ? colors.base3 : colors.base5,
          shadowOffset: { width: 0, height: layerIndex + 2 },
          shadowOpacity: 0.4 + (layerIndex * 0.1),
          shadowRadius: (layerIndex + 2) * 3,
          elevation: layerIndex + 3,
          zIndex: 6 - layerIndex,
        };
      case 'rect':
        return {
          ...styles.layer,
          ...styles[`rectL${layerIndex + 1}` as keyof typeof styles],
          backgroundColor: 
            layerIndex === 0 ? colors.base1 :
            layerIndex === 1 ? colors.base2 :
            layerIndex === 2 ? colors.base3 :
            layerIndex === 3 ? colors.base4 :
            layerIndex === 4 ? colors.base5 : colors.base6,
          transform: [
            { 
              translateY: layerAnims[layerIndex].interpolate({
                inputRange: [0, 10],
                outputRange: [0, -layerIndex * 2],
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
      default:
        return {};
    }
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
    top: '50%',
    left: '50%',
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
    marginLeft: -26,
    marginTop: -26,
  },
  navL2: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: -22,
    marginTop: -22,
  },
  navL3: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: -18,
    marginTop: -18,
  },
  navL4: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -14,
    marginTop: -14,
  },
  navL5: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    marginTop: -10,
  },
  navL6: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    marginTop: -6,
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
    marginLeft: -80,
    marginTop: -80,
  },
  circleL2: {
    width: 136,
    height: 136,
    borderRadius: 68,
    marginLeft: -68,
    marginTop: -68,
  },
  circleL3: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginLeft: -56,
    marginTop: -56,
  },
  circleL4: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginLeft: -44,
    marginTop: -44,
  },
  circleL5: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: -32,
    marginTop: -32,
  },
  circleL6: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -20,
    marginTop: -20,
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
    marginLeft: '-50%',
    marginTop: -45,
  },
  rectL2: {
    width: '85%',
    height: 75,
    borderRadius: 12,
    marginLeft: '-42.5%',
    marginTop: -37.5,
  },
  rectL3: {
    width: '70%',
    height: 59,
    borderRadius: 12,
    marginLeft: '-35%',
    marginTop: -29.5,
  },
  rectL4: {
    width: '55%',
    height: 41,
    borderRadius: 12,
    marginLeft: '-27.5%',
    marginTop: -20.5,
  },
  rectL5: {
    width: '41%',
    height: 27,
    borderRadius: 12,
    marginLeft: '-20.5%',
    marginTop: -13.5,
  },
  rectL6: {
    width: '27%',
    height: 14,
    borderRadius: 12,
    marginLeft: '-13.5%',
    marginTop: -7,
  },
});

export default StackedButton;