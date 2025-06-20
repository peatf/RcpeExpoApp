/**
 * @file InfoCard.tsx
 * @description A versatile card component for displaying titled sections of information or insights.
 */
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme'; // Import full theme

/**
 * @interface InfoCardProps
 * @description Props for the InfoCard component.
 * @property {string} title - The title to be displayed at the top of the card.
 * @property {ReactNode} children - The content to be rendered inside the card.
 */
export interface InfoCardProps {
  title: string;
  children: ReactNode;
}

/**
 * InfoCard component.
 *
 * @param {InfoCardProps} props - The props for the component.
 * @returns {JSX.Element} A card view with a title and content.
 */
const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.base1, // Use theme
    borderRadius: theme.borderRadius.md, // Use theme, sm or md depending on desired look (8px or 12px)
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly more subtle than input panels, or same if preferred
    padding: theme.spacing.md, // Use theme
    marginBottom: theme.spacing.lg, // Use theme
    // position: 'relative', // Already present
  },
  title: { // This style is similar to .input-panel-label
    position: 'absolute',
    top: -12, // Adjust to ensure it sits nicely on the border
    left: theme.spacing.md, // Consistent padding
    backgroundColor: theme.colors.bg, // To cover the border
    paddingHorizontal: theme.spacing.sm,
    // Use a themed heading style, e.g., headingSmall or a label style
    fontFamily: theme.fonts.mono, // As per .input-panel-label
    fontSize: theme.typography.labelSmall.fontSize, // As per .input-panel-label
    fontWeight: theme.typography.labelSmall.fontWeight, // As per .input-panel-label
    color: theme.colors.textSecondary, // As per .input-panel-label
    textTransform: 'uppercase', // As per .input-panel-label
    letterSpacing: theme.typography.labelSmall.letterSpacing, // As per .input-panel-label
    zIndex: 1, // Ensure title is above the content's potential background elements
  },
  content: {
    paddingTop: theme.spacing.sm, // Add some space so content doesn't overlap with absolute positioned title
  },
});

export default InfoCard;
