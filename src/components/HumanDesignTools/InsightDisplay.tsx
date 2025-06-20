/**
 * @file InsightDisplay.tsx
 * @description A simple component to display a single insight or pattern.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme'; // Import full theme

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
  return (
    <View style={styles.container}>
      <Text style={styles.insightText}>{insightText}</Text>
      {source && <Text style={styles.sourceText}>Source: {source}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent', // Let parent (InfoCard) handle background
    paddingVertical: theme.spacing.sm, // Add some vertical padding
    // marginHorizontal: theme.spacing.md, // InfoCard will handle horizontal padding
    // marginVertical: theme.spacing.xs, // Spacing between multiple insights
  },
  insightText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs, // Space if source is present
  },
  sourceText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'right', // Align source to the right
  },
});

export default InsightDisplay;
