/**
 * @file WorkflowPatternListItem.tsx
 * @description Component to display a single WorkflowPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkflowPattern } from '../../../../types/humanDesignTools'; // Adjusted path

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
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
    lineHeight: 18,
  },
  metricsText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default WorkflowPatternListItem;
