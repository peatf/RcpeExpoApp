/**
 * @file InfoCard.tsx
 * @description A versatile card component for displaying titled sections of information or insights.
 */
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

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
    borderColor: colors.base1,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: colors.bg,
    paddingHorizontal: 6,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  content: {
    paddingTop: spacing.xs,
  },
});

export default InfoCard;
