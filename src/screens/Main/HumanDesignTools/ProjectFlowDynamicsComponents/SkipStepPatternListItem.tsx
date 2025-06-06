/**
 * @file SkipStepPatternListItem.tsx
 * @description Component to display a single SkipStepPattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkipStepPattern } from '../../../../types/humanDesignTools'; // Adjust path as needed

export interface SkipStepPatternListItemProps {
  pattern: SkipStepPattern;
}

const SkipStepPatternListItem: React.FC<SkipStepPatternListItemProps> = ({ pattern }) => {
  const getEffectivenessStyle = (effectiveness: string) => {
    switch (effectiveness) {
      case 'positive':
        return styles.positiveEffect;
      case 'negative':
        return styles.negativeEffect;
      default:
        return styles.neutralEffect;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skipped: {pattern.skippedStep}</Text>
      <Text style={[styles.effectivenessText, getEffectivenessStyle(pattern.effectiveness)]}>
        Effectiveness: {pattern.effectiveness.toUpperCase()} (Confidence: {pattern.confidence.toFixed(2)})
      </Text>
      <Text style={styles.descriptionText}>{pattern.description}</Text>
      <Text style={styles.detailText}>Applies to: {pattern.projectTypes.join(', ')}</Text>
      <View style={styles.impactContainer}>
        <Text style={styles.impactTitle}>Impact:</Text>
        <Text style={styles.impactDetail}>Time: {pattern.impact.timeImpact > 0 ? `+${pattern.impact.timeImpact}` : pattern.impact.timeImpact} hrs</Text>
        <Text style={styles.impactDetail}>Quality: {pattern.impact.qualityImpact}/5</Text>
        <Text style={styles.impactDetail}>Frustration: {pattern.impact.frustrationImpact}/5</Text>
        <Text style={styles.impactDetail}>Collaboration: {pattern.impact.collaborationImpact}/5</Text>
      </View>
      {pattern.recommendedFor.length > 0 && (
        <Text style={styles.recommendationsText}>Recommended For: {pattern.recommendedFor.join('; ')}</Text>
      )}
      {pattern.cautionsFor.length > 0 && (
        <Text style={styles.cautionsText}>Cautions: {pattern.cautionsFor.join('; ')}</Text>
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
    color: '#007bff', // Blue title
    marginBottom: 4,
  },
  effectivenessText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    alignSelf: 'flex-start', // So background only covers text
  },
  positiveEffect: {
    backgroundColor: '#d4edda', // Light green
    color: '#155724', // Dark green
  },
  negativeEffect: {
    backgroundColor: '#f8d7da', // Light red
    color: '#721c24', // Dark red
  },
  neutralEffect: {
    backgroundColor: '#e2e3e5', // Light gray
    color: '#383d41', // Dark gray
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    lineHeight: 20,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  impactContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  impactDetail: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
  recommendationsText: {
    fontSize: 12,
    color: '#28a745', // Green
    marginTop: 6,
  },
  cautionsText: {
    fontSize: 12,
    color: '#dc3545', // Red
    marginTop: 4,
  },
});

export default SkipStepPatternListItem;
