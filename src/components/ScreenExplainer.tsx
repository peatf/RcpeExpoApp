import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme'; // Import full theme

interface ScreenExplainerProps {
  text: string;
  maxWords?: number;
}

const ScreenExplainer: React.FC<ScreenExplainerProps> = ({ text, maxWords = 40 }) => {
  const wordCount = text.split(' ').length;

  if (wordCount > maxWords) {
    console.warn(
      `ScreenExplainer: Text for explainer exceeds ${maxWords} words. Word count: ${wordCount}. Text: "${text}"`
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg, // Use theme spacing
    paddingVertical: theme.spacing.md,   // Use theme spacing
    backgroundColor: theme.colors.base1, // Subtle background
    borderRadius: theme.borderRadius.sm, // Add border radius
    marginBottom: theme.spacing.md,      // Add margin bottom
    alignItems: 'center',
    // borderBottomWidth: 1, // Removed border as per new spec (more like a contextual inline block)
    // borderBottomColor: theme.colors.base2,
  },
  text: {
    fontFamily: theme.fonts.body, // Use theme font
    fontSize: theme.typography.bodySmall.fontSize, // Use specified size
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: (theme.typography.bodySmall.lineHeight || (theme.typography.bodySmall.fontSize || 12) * 1.4) * 1.3, // Adjusted line height calculation
  },
});

export default ScreenExplainer;
