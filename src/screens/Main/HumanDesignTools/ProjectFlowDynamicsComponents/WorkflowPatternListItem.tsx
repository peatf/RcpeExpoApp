/**
 * @file WorkflowPatternListItem.tsx
 * @description Component to display a single WorkflowPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkflowPattern } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme

export interface WorkflowPatternListItemProps {
  pattern: WorkflowPattern;
}

const WorkflowPatternListItem: React.FC<WorkflowPatternListItemProps> = ({ pattern }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pattern.description} (Confidence: {pattern.confidence.toFixed(2)})</Text>
      <Text style={styles.detailText}>Projects: {pattern.projectTypes.join(', ')}</Text>
      <Text style={styles.detailText}>Sequence: {pattern.steps.sequence.join(' → ')}</Text>
      {pattern.steps.skipSteps.length > 0 && (
        <Text style={styles.detailText}>Skips: {pattern.steps.skipSteps.join(', ')}</Text>
      )}
      <Text style={styles.metricsText}>
        Completion: {(pattern.metrics.completionRate * 100).toFixed(0)}% |
        Satisfaction: {pattern.metrics.averageSatisfaction}/10 |
        Energy Efficiency: {(pattern.metrics.energyEfficiency * 100).toFixed(0)}%
      </Text>
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
  title: { // Description is the main "title" here
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  detailText: { // For sequence, skips
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize, // Slightly larger for better readability of sequences
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.labelMedium.lineHeight,
  },
  metricsText: { // For completion, satisfaction, energy efficiency
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.accentSecondary, // Use a different color for metrics, or textSecondary
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2,
    paddingTop: theme.spacing.sm,
  },
});

export default WorkflowPatternListItem;
