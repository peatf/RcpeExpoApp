// src/components/Transitions/QuestTransition.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

interface QuestTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export const QuestTransition: React.FC<QuestTransitionProps> = ({
  children,
  transitionKey
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and animate on transition key change
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [transitionKey, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};
