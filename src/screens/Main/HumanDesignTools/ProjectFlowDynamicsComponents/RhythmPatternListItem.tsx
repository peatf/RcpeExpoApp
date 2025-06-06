/**
 * @file RhythmPatternListItem.tsx
 * @description Component to display a single RhythmPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RhythmPattern } from '../../../../types/humanDesignTools'; // Adjust path as needed

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
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745', // Green title for rhythm
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
    lineHeight: 18,
  },
  effectivenessContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  effectivenessTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  effectivenessDetail: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
  projectMatchContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  projectMatchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  projectMatchDetail: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  }
});

export default RhythmPatternListItem;
