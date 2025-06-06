/**
 * @file InsightDisplay.tsx
 * @description A simple component to display a single insight or pattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface InsightDisplayProps
 * @description Props for the InsightDisplay component.
 * @property {string} insightText - The main text of the insight to be displayed.
 * @property {string} [source] - Optional source of the insight (e.g., "Pattern Recognition Engine").
 */
export interface InsightDisplayProps {
  insightText: string;
  source?: string;
}

/**
 * InsightDisplay component.
 *
 * @param {InsightDisplayProps} props - The props for the component.
 * @returns {JSX.Element} A view that highlights an insight.
 */
const InsightDisplay: React.FC<InsightDisplayProps> = ({ insightText, source }) => {
  // Dynamic styles based on props
  const insightTextStyle = {
    ...styles.insightText,
    marginBottom: source ? 8 : 0, // Add margin only if source is present
  };

  return (
    <View style={styles.container}>
      <Text style={insightTextStyle}>{insightText}</Text>
      {source && <Text style={styles.sourceText}>Source: {source}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd', // A light blue, often used for informational messages
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: '#b0dcfb',
    borderWidth: 1,
  },
  insightText: {
    fontSize: 16,
    color: '#023e7d', // Darker blue for text
    marginBottom: 8, // Standard bottom margin
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#005a9c', // Slightly lighter blue for the source
    textAlign: 'right',
  },
});

export default InsightDisplay;
