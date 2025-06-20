/**
 * @file StackedButton.tsx
 * @description Enhanced stacked button component with proper depth and shadows matching HTML mockup
 */
import React, { useRef } from 'react'; // Import useRef
import { Pressable, View, StyleSheet, Text, ViewStyle, Animated } from 'react-native'; // Import Animated
import { theme } from '../constants/theme';

const { colors, typography, borderRadius: br } = theme;

interface StackedButtonProps {
  onPress: () => void;
  type: 'nav' | 'circle' | 'rect';
  children?: React.ReactNode;
  text?: string;
  isActive?: boolean;
  // size prop removed as sizes are now intrinsic to the type
}

const NUM_LAYERS = 6;

// Component body will be replaced in the next diff
const StackedButton: React.FC<StackedButtonProps> = ({
  onPress,
  type,
  children,
  text,
  isActive = false,
}) => {
  const pressAnimTranslateY = useRef(new Animated.Value(0)).current;
  const pressAnimScale = useRef(new Animated.Value(1)).current;

  // Animated values for individual layers (scale and translateY)
  const layerAnims = useRef(
    Array(NUM_LAYERS)
      .fill(null)
      .map(() => ({
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0),
      }))
  ).current;

  const handlePressIn = () => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.spring(pressAnimTranslateY, { toValue: -5, useNativeDriver: true }),
      Animated.spring(pressAnimScale, { toValue: 0.95, useNativeDriver: true }),
    ];

    layerAnims.forEach((anim, index) => {
      if (type === 'circle' && index > 0) { // L1 (index 0) usually doesn't animate itself
        animations.push(
          Animated.spring(anim.scale, { toValue: 1 + index * 0.02, useNativeDriver: true }),
          Animated.spring(anim.translateY, { toValue: -(index * 2), useNativeDriver: true })
        );
      } else if (type === 'rect' && index > 0) {
        animations.push(
          Animated.spring(anim.translateY, { toValue: -(index * 1.5), useNativeDriver: true })
          // Rect layers only translate, no scale mentioned for individual layers on hover
        );
      }
    });
    Animated.parallel(animations).start();
  };

  const handlePressOut = () => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.spring(pressAnimTranslateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(pressAnimScale, { toValue: 1, useNativeDriver: true }),
    ];

    layerAnims.forEach(anim => {
      animations.push(
        Animated.spring(anim.scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(anim.translateY, { toValue: 0, useNativeDriver: true })
      );
    });
    Animated.parallel(animations).start();
  };

  const layerColorValues = [colors.base1, colors.base2, colors.base3, colors.base4, colors.base5, colors.base6];

  const getLayerStyle = (layerIndex: number): Animated.AnimatedProps<ViewStyle> => {
    const currentLayerColor = layerColorValues[layerIndex];
    let specificLayerStyle: ViewStyle = {};

    // Determine the base style for the current layer based on button type
    switch (type) {
      case 'nav':
        specificLayerStyle = styles[`navL${layerIndex + 1}` as keyof typeof styles];
        break;
      case 'circle':
        specificLayerStyle = styles[`circleL${layerIndex + 1}` as keyof typeof styles];
        break;
      case 'rect':
        specificLayerStyle = styles[`rectL${layerIndex + 1}` as keyof typeof styles];
        break;
    }

    // Base style applicable to all layers
    const style: Animated.AnimatedProps<ViewStyle> = { // Ensure type is Animated compatible
      ...styles.layerBase,
      backgroundColor: currentLayerColor,
      zIndex: layerIndex + 1,
      ...specificLayerStyle,
      // Apply individual layer animations
      transform: [
        { scale: layerAnims[layerIndex].scale },
        { translateY: layerAnims[layerIndex].translateY },
      ],
    };

    // Apply basic active state for nav button's 4th layer (index 3)
    if (type === 'nav' && layerIndex === 3 && isActive) {
      style.backgroundColor = colors.accent;
      // Add accent glow shadow for active nav L4
      style.shadowColor = colors.accentGlow;
      style.shadowOffset = { width: 0, height: 0 };
      style.shadowRadius = 8; // CSS: 0 0 15px
      style.shadowOpacity = 1; // CSS: var(--color-accent-glow) implies full opacity of the glow color
      style.elevation = (layerIndex + 1) * 3; // Higher elevation for active glow
    } else {
      // Apply "feathered" shadow for other specified layers
      const hasFeatheredShadow =
        (type === 'nav' && (layerIndex === 1 || layerIndex === 2)) || // L2, L3 for nav
        ((type === 'circle' || type === 'rect') && layerIndex >= 1 && layerIndex < NUM_LAYERS); // L2-L6 for circle/rect

      if (hasFeatheredShadow) {
        style.shadowColor = currentLayerColor; // Shadow color is the layer's own color
        style.shadowOffset = { width: 0, height: 0 };
        style.shadowRadius = 7.5; // CSS: 0 0 15px 2px (blur radius 15px / 2 = 7.5)
                                  // The 2px spread is not directly translatable, affects perceived size/intensity
        style.shadowOpacity = 0.65; // Adjusted for a less intense but visible feathering
        style.elevation = (layerIndex + 1) * 2; // Basic elevation
      }
    }
    return style;
  };

  // Determine the container style based on button type
  const containerStyle =
    type === 'nav' ? styles.navContainer :
    type === 'circle' ? styles.circleContainer :
    styles.rectContainer;

  // Style for text, specifically for rectangular buttons
  const textStyle = type === 'rect' ? styles.rectButtonText : {};

  const animatedRootStyle = {
    transform: [
      { translateY: pressAnimTranslateY },
      { scale: pressAnimScale },
    ],
  };

  return (
    <Animated.View style={[styles.button, containerStyle, animatedRootStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableFull} // Ensures Pressable covers the Animated.View area
      >
        {/* Render the 6 layers */}
        {Array.from({ length: NUM_LAYERS }).map((_, index) => (
          <Animated.View
            key={index}
            style={getLayerStyle(index)} // Renamed function call
          />
        ))}
        
        {/* Container for children (like icons) or text */}
      <View style={[styles.contentContainer, type === 'nav' && styles.navIconContainer]}>
        {children && type === 'nav' && React.isValidElement(children) ?
          React.cloneElement(children as React.ReactElement<any>, {
            color: isActive ? colors.bg : colors.base2, // White on active, base2 otherwise
            // size prop might also be useful to pass if icons have it
          })
          : children
        }
        {text && type === 'rect' && (
          <Text style={textStyle}>{text}</Text>
        )}
      </View>
    </Pressable>
  );
};

// Styles definition
const styles = StyleSheet.create({
  button: { // Base container for all button types, ensures centering of layers
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerBase: { // Common properties for all layers
    position: 'absolute',
    // Layers are centered by the parent `button` style.
    // Width, height, and borderRadius will be defined by type-specific styles.
  },
  contentContainer: { // Container for text or children (e.g., icons)
    position: 'absolute', // Positioned on top of all layers
    zIndex: NUM_LAYERS + 1, // Ensures content is visually above all 6 layers
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,255,0,0.1)', // Uncomment for debugging layout
  },
  pressableFull: { // Style for the Pressable component to fill its parent Animated.View
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectButtonText: { // Specific text styling for 'rect' type buttons
    fontFamily: typography.display.fontFamily || theme.fonts.displayFallback,
    fontWeight: typography.displayMedium.fontWeight || '700', // Fallback if not in theme
    fontSize: typography.displayMedium.fontSize || 18, // Fallback if not in theme
    color: colors.bg, // Text color should contrast with button layers
    // Text shadow to match CSS reference (simplified for React Native)
    textShadowColor: colors.base4,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1, // CSS "1px 1px 1px var(--color-base-4)"
    // The second CSS shadow "0 0 10px rgba(250, 250, 242, 0.7)" is harder to replicate directly.
    // It could be approximated with another Text component or platform-specific elevation/shadow on text.
  },
  navIconContainer: { // Specific for nav button icons to apply drop shadow
    // The filter: drop-shadow from CSS is best replicated by shadow props on the icon container View
    shadowColor: 'rgba(50, 50, 48, 0.4)', // colors.base5 or a dark color with alpha
    shadowOffset: { width: 0, height: 1 }, // CSS: 0 1px 2px
    shadowRadius: 2, // Blur radius
    shadowOpacity: 1, // Ensures shadow is visible
    // elevation: NUM_LAYERS + 2, // Optional: for Android shadow visibility
  },

  // Nav button type: Container and Layer styles
  navContainer: { width: 52, height: 52 },
  navL1: { width: 52, height: 52, borderRadius: 26 }, // Outermost
  navL2: { width: 44, height: 44, borderRadius: 22 },
  navL3: { width: 36, height: 36, borderRadius: 18 },
  navL4: { width: 28, height: 28, borderRadius: 14 }, // This layer gets accent color if active
  navL5: { width: 20, height: 20, borderRadius: 10 },
  navL6: { width: 12, height: 12, borderRadius: 6 },   // Innermost

  // Circle button type: Container and Layer styles
  // Uses percentages for responsive sizing within the container.
  circleContainer: { width: 160, height: 160 }, // Fixed size for the example circle button
  circleL1: { width: '100%', height: '100%', borderRadius: (160 * 1.0) / 2 },
  circleL2: { width: '85%', height: '85%', borderRadius: (160 * 0.85) / 2 },
  circleL3: { width: '70%', height: '70%', borderRadius: (160 * 0.70) / 2 },
  circleL4: { width: '55%', height: '55%', borderRadius: (160 * 0.55) / 2 },
  circleL5: { width: '40%', height: '40%', borderRadius: (160 * 0.40) / 2 },
  circleL6: { width: '25%', height: '25%', borderRadius: (160 * 0.25) / 2 },

  // Rectangular button type: Container and Layer styles
  // Assumes the button takes full width from parent, height is fixed.
  // Percentages for width/height are relative to the rectContainer.
  rectContainer: { width: '80%', height: 90, alignSelf: 'center' }, // Example: 80% of parent, or set fixed.
  rectL1: { width: '100%', height: '100%', borderRadius: br.md }, // e.g., 12px from theme
  rectL2: { width: '85%', height: '83%', borderRadius: br.md },
  rectL3: { width: '70%', height: '65%', borderRadius: br.md },
  rectL4: { width: '55%', height: '45%', borderRadius: br.md },
  rectL5: { width: '41%', height: '30%', borderRadius: br.md },
  rectL6: { width: '27%', height: '15%', borderRadius: br.md },
});

export default StackedButton;