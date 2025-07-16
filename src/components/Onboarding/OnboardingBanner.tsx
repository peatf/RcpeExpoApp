// src/components/Onboarding/OnboardingBanner.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface OnboardingBannerProps {
  toolName: string;
  description: string;
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ toolName, description, onDismiss }) => (
  <View style={styles.bannerContainer}>
    <Text style={styles.bannerTitle}>New Quest: Discover the {toolName}</Text>
    <Text style={styles.bannerDescription}>{description}</Text>
    <Button title="Got it" onPress={onDismiss} />
  </View>
);

const styles = StyleSheet.create({
  bannerContainer: { padding: 15, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 8 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bannerDescription: { fontSize: 14 },
});
