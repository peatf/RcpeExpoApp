import React, { useState, useRef } from 'react';
import { Pressable, View, StyleSheet, Animated, ViewStyle, Text } from 'react-native';

// Define the color palette from the original CSS
const colors = {
    base1: '#e1e1d7',
    base2: '#afafa7',
    base3: '#7c7d76',
    base4: '#4b4c47',
    base5: '#323230',
    base6: '#191917',
};

// Define the properties our component will accept
interface StackedButtonProps {
    shape: 'rectangle' | 'circle';
    onPress?: () => void;
    children?: React.ReactNode;
    text?: string;
    isActive?: boolean;
}

// Define the structure for a single layer's style
interface LayerStyle {
    width: number;
    height: number;
    backgroundColor: string;
    zIndex: number;
    shadowColor?: string;
}

const StackedButton: React.FC<StackedButtonProps> = ({ 
    shape, 
    onPress = () => {}, 
    children, 
    text,
    isActive = false 
}) => {
    // State to track interaction events
    const [isPressed, setIsPressed] = useState(false);
    
    // Animated values for hover and press effects
    const scaleValue = useRef(new Animated.Value(1)).current;
    const layerScales = useRef(
        Array(6).fill(null).map(() => new Animated.Value(1))
    ).current;

    // Layer definitions based on shape - Rectangles are much wider
    const rectLayers: LayerStyle[] = [
        { width: 240, height: 80, backgroundColor: colors.base1, zIndex: 1 }, // 3:1 aspect ratio
        { width: 210, height: 70, backgroundColor: colors.base2, zIndex: 2, shadowColor: colors.base2 }, // 3:1
        { width: 180, height: 60, backgroundColor: colors.base3, zIndex: 3, shadowColor: colors.base3 }, // 3:1
        { width: 150, height: 50, backgroundColor: colors.base4, zIndex: 4, shadowColor: colors.base4 }, // 3:1
        { width: 120, height: 40, backgroundColor: colors.base5, zIndex: 5, shadowColor: colors.base5 }, // 3:1
        { width: 90,  height: 30, backgroundColor: colors.base6, zIndex: 6, shadowColor: colors.base6 }, // 3:1
    ];

    const circleLayers: LayerStyle[] = [
        { width: 52, height: 52, backgroundColor: colors.base1, zIndex: 1 },
        { width: 44, height: 44, backgroundColor: colors.base2, zIndex: 2, shadowColor: colors.base2 },
        { width: 36, height: 36, backgroundColor: colors.base3, zIndex: 3, shadowColor: colors.base3 },
        { width: 28, height: 28, backgroundColor: colors.base4, zIndex: 4, shadowColor: colors.base4 },
        { width: 20, height: 20, backgroundColor: colors.base5, zIndex: 5, shadowColor: colors.base5 },
        { width: 12, height: 12, backgroundColor: colors.base6, zIndex: 6, shadowColor: colors.base6 },
    ];

    const layers = shape === 'rectangle' ? rectLayers : circleLayers;
    const containerSize = {
        width: layers[0].width,
        height: layers[0].height,
    };

    const handlePressIn = () => {
        setIsPressed(true);
        
        // Animate the overall container with a slight scale down
        Animated.spring(scaleValue, {
            toValue: 1.05,
            useNativeDriver: true,
        }).start();

        // Animate each layer with different scales for press-down effect
        const animations = layerScales.map((scale, index) => 
            Animated.spring(scale, {
                toValue: 0.95 - ((layers.length - 1 - index) * 0.01),
                useNativeDriver: true,
            })
        );

        Animated.parallel(animations).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        
        // Reset all animations
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();

        const animations = layerScales.map((scale) => 
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
            })
        );

        Animated.parallel(animations).start();
    };

    const getLayerStyle = (layer: LayerStyle, index: number): ViewStyle => {
        const baseStyle: ViewStyle = {
            position: 'absolute',
            width: layer.width,
            height: layer.height,
            backgroundColor: layer.backgroundColor,
            borderRadius: shape === 'circle' ? layer.width / 2 : 0,
            // Enhanced feathered shadow effect
            shadowColor: layer.shadowColor || 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: layer.shadowColor ? 15 : 0,
            shadowOpacity: layer.shadowColor ? 0.8 : 0,
            elevation: layer.shadowColor ? 8 : 0,
        };

        return baseStyle;
    };

    return (
        <Animated.View 
            style={[
                styles.container,
                containerSize,
                { transform: [{ scale: scaleValue }] }
            ]}
        >
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[StyleSheet.absoluteFill, styles.pressable]}
            >
                {layers.map((layer, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            getLayerStyle(layer, index),
                            {
                                transform: [{ scale: layerScales[index] }],
                                zIndex: layer.zIndex,
                            }
                        ]}
                    />
                ))}
                
                {/* Content container for children and text */}
                <View style={styles.contentContainer}>
                    {children && (
                        <View style={styles.glowContainer}>
                            {children}
                        </View>
                    )}
                    {text && shape === 'rectangle' && (
                        <Text style={styles.buttonText}>{text}</Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        position: 'absolute',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowContainer: {
        // Add glow effect to icons/children
        shadowColor: '#fafaf2',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 0.6,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fafaf2',
        textAlign: 'center',
        // Add text glow effect
        textShadowColor: '#fafaf2',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
});

export default StackedButton;