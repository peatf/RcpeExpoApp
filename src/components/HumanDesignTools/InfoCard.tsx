/**
 * @file InfoCard.tsx
 * @description A versatile card component for displaying titled sections of information or insights.
 */
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  content: {
    // Additional styling for content area if needed
  },
});

export default InfoCard;
