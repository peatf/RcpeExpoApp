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
  onPress // This onPress from parent is for highlighting the canvas.
          // We need to reconcile this with expand/collapse.
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCardPress = () => {
    setIsExpanded(!isExpanded);
    // If we still want to call the parent's onPress (for highlighting):
    // onPress();
    // However, this might be confusing UX if a press does two things.
    // For now, card press only toggles expansion.
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isHighlighted && styles.highlighted]} 
      onPress={handleCardPress} // Changed to internal handler
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{category.toUpperCase()}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </View>
      {isExpanded && (
        <Text style={styles.description}>{description}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 3,
    // Keep existing borderLeftColor for non-highlighted, or make it theme.colors.base2
    borderLeftColor: colors.base2,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.base1,
    borderRadius: borderRadius.sm,
  },
  highlighted: {
    backgroundColor: colors.accentSecondary,
    borderLeftColor: colors.accent,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  expandIcon: {
    fontFamily: fonts.mono, // Consistent font
    fontSize: typography.labelMedium.fontSize,
    color: colors.textSecondary,
  }
});

export default BlueprintDescription;