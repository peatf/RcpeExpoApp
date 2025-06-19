import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme'; // Assuming theme.ts exists

interface OnboardingBannerProps {
  toolName: string;
  description: string;
  onDismiss: () => void;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  toolName,
  description,
  onDismiss
}) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.title}>Welcome to {toolName}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
        <Text style={styles.dismissButtonText}>Got it</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.accentSecondary, // A light, noticeable color
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  title: {
    ...typography.headingMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dismissButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start', // Or 'center', 'flex-end'
  },
  dismissButtonText: {
    ...typography.labelLarge,
    color: '#fff', // White text on accent background
  },
});

export default OnboardingBanner;
