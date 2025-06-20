/**
 * @file RhythmPatternListItem.tsx
 * @description Component to display a single RhythmPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RhythmPattern } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme

export interface RhythmPatternListItemProps {
  pattern: RhythmPattern;
}

const RhythmPatternListItem: React.FC<RhythmPatternListItemProps> = ({ pattern }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rhythm: {pattern.pattern}</Text>
      <Text style={styles.detailText}>
        Durations: Focus {pattern.durationMinutes.focus}m | Transition {pattern.durationMinutes.transition}m | Rest {pattern.durationMinutes.rest}m
      </Text>
      <Text style={styles.detailText}>Optimal Times: {pattern.timeOfDay.join(', ')}</Text>
      <View style={styles.effectivenessContainer}>
        <Text style={styles.effectivenessTitle}>Effectiveness:</Text>
        <Text style={styles.effectivenessDetail}>Energy Sustainability: {(pattern.effectiveness.energySustainability * 100).toFixed(0)}%</Text>
        <Text style={styles.effectivenessDetail}>Completion Rate: {(pattern.effectiveness.completionRate * 100).toFixed(0)}%</Text>
        <Text style={styles.effectivenessDetail}>Satisfaction: {pattern.effectiveness.satisfactionLevel}/10</Text>
      </View>
      {pattern.projectTypeMatch && Object.keys(pattern.projectTypeMatch).length > 0 && (
        <View style={styles.projectMatchContainer}>
          <Text style={styles.projectMatchTitle}>Project Type Match Score (Effectiveness):</Text>
          {Object.entries(pattern.projectTypeMatch).map(([type, score]) => (
            <Text key={type} style={styles.projectMatchDetail}>{type}: {score * 100}%</Text>
          ))}
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
    fontFamily: theme.fonts.body, // Or mono if preferred for titles in lists
    fontSize: theme.typography.bodyLarge.fontSize, // Prominent title
    fontWeight: 'bold',
    color: theme.colors.accent, // Use accent for pattern titles
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.bodyMedium.lineHeight,
  },
  effectivenessContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2, // Use a subtle border
  },
  effectivenessTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize, // Consistent label style
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  effectivenessDetail: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm, // Indent details
    lineHeight: theme.typography.labelSmall.lineHeight,
  },
  projectMatchContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2,
  },
  projectMatchTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  projectMatchDetail: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    lineHeight: theme.typography.labelSmall.lineHeight,
  }
});

export default RhythmPatternListItem;
