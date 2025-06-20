/**
 * @file SkipStepPatternListItem.tsx
 * @description Component to display a single SkipStepPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkipStepPattern } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme

export interface SkipStepPatternListItemProps {
  pattern: SkipStepPattern;
}

const SkipStepPatternListItem: React.FC<SkipStepPatternListItemProps> = ({ pattern }) => {
  const getEffectivenessStyle = (effectiveness: string) => {
    switch (effectiveness?.toLowerCase()) { // Added null check and toLowerCase
      case 'positive':
        return styles.positiveEffect;
      case 'negative':
        return styles.negativeEffect;
      default: // 'neutral' or undefined
        return styles.neutralEffect;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skipped: {pattern.skippedStep}</Text>
      <View style={[styles.effectivenessChip, getEffectivenessStyle(pattern.effectiveness)]}>
        <Text style={styles.effectivenessText}>
          {pattern.effectiveness?.toUpperCase() || 'NEUTRAL'} (Conf: {pattern.confidence.toFixed(2)})
        </Text>
      </View>
      <Text style={styles.descriptionText}>{pattern.description}</Text>
      <Text style={styles.detailText}>Applies to: {pattern.projectTypes.join(', ')}</Text>

      <View style={styles.impactContainer}>
        <Text style={styles.sectionTitle}>Impact:</Text>
        <Text style={styles.impactDetail}>Time: {pattern.impact.timeImpact > 0 ? `+${pattern.impact.timeImpact}` : pattern.impact.timeImpact} hrs</Text>
        <Text style={styles.impactDetail}>Quality: {pattern.impact.qualityImpact}/5</Text>
        <Text style={styles.impactDetail}>Frustration: {pattern.impact.frustrationImpact}/5</Text>
        <Text style={styles.impactDetail}>Collaboration: {pattern.impact.collaborationImpact}/5</Text>
      </View>

      {pattern.recommendedFor.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Recommended For:</Text>
          <Text style={styles.recommendationsText}>{pattern.recommendedFor.join('; ')}</Text>
        </View>
      )}
      {pattern.cautionsFor.length > 0 && (
         <View style={styles.cautionsContainer}>
          <Text style={styles.sectionTitle}>Cautions:</Text>
          <Text style={styles.cautionsText}>{pattern.cautionsFor.join('; ')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { // Styled as .input-panel
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: 'bold',
    color: theme.colors.accent, // Use accent for title
    marginBottom: theme.spacing.sm,
  },
  effectivenessChip: { // Wrapper for the text for padding and borderRadius
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  effectivenessText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize - 2, // Smaller for chip
    fontWeight: 'bold',
    // Color is set by specific effect styles
  },
  positiveEffect: {
    backgroundColor: theme.colors.accentSecondary, // Light accent bg
    borderColor: theme.colors.accent, // Accent border
    borderWidth: 1,
  },
  negativeEffect: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)', // Example: Light red from bootstrap danger, adjust with theme
    borderColor: 'rgb(220, 53, 69)',
    borderWidth: 1,
  },
  neutralEffect: {
    backgroundColor: theme.colors.base2, // Neutral background
    borderColor: theme.colors.base3,
    borderWidth: 1,
  },
  descriptionText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.bodyMedium.lineHeight,
  },
  detailText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: { // Reusable for Impact, Recommendations, Cautions titles
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize + 2,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm, // Add top margin for sections
    marginBottom: theme.spacing.xs,
  },
  impactContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2,
  },
  impactDetail: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    lineHeight: theme.typography.labelSmall.lineHeight,
  },
  recommendationsContainer: { marginTop: theme.spacing.xs },
  recommendationsText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.accent, // Positive connotation
  },
  cautionsContainer: { marginTop: theme.spacing.xs },
  cautionsText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.base4, // A cautionary color, could be a red/orange from theme if available
  },
});

export default SkipStepPatternListItem;
