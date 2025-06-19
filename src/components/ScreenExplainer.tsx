import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants/theme'; // Assuming theme.ts

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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.base1, // A subtle background color
    borderBottomWidth: 1,
    borderBottomColor: colors.base2,
    alignItems: 'center', // Center text if it's short
  },
  text: {
    ...typography.bodyMedium, // Using bodyMedium for readability
    color: colors.textSecondary, // Using secondary text color
    textAlign: 'center',
    lineHeight: typography.bodyMedium.lineHeight ? typography.bodyMedium.lineHeight * 1.3 : undefined, // Slightly more line height
  },
});

export default ScreenExplainer;
