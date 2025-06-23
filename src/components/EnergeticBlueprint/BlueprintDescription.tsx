import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, typography, borderRadius } from '../../constants/theme';

interface BlueprintDescriptionProps {
  category: string;
  description: string;
  isHighlighted: boolean;
  onPress: () => void;
}

const BlueprintDescription: React.FC<BlueprintDescriptionProps> = ({
  category,
  description,
  isHighlighted,
  onPress
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isHighlighted && styles.highlighted]} 
      onPress={onPress}
    >
      <Text style={styles.title}>{category.toUpperCase()}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.base1, // Theme color for card background
    borderRadius: borderRadius.sm, // Added for consistency
  },
  highlighted: {
    backgroundColor: colors.accentSecondary, // Theme color for highlighted card
    borderLeftColor: colors.accent, // Theme color for highlight accent
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: typography.labelLarge.fontSize,
    fontWeight: typography.labelLarge.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textTransform: typography.labelLarge.textTransform,
    letterSpacing: typography.labelLarge.letterSpacing,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textSecondary,
    lineHeight: typography.bodyMedium.lineHeight,
  }
});

export default BlueprintDescription;