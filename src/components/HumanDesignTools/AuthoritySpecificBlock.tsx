/**
 * @file AuthoritySpecificBlock.tsx
 * @description A component that can conditionally render content based on an authorityType prop.
 *              For now, it primarily acts as a wrapper and sets the stage for more complex logic.
 */
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthorityType } from '../../types/humanDesignTools'; // Adjusted path

/**
 * @interface AuthoritySpecificBlockProps
 * @description Props for the AuthoritySpecificBlock component.
 * @property {AuthorityType} authority - The Human Design authority type.
 * @property {ReactNode} children - The content to be rendered within this block.
 * @property {string} [title] - Optional title for the block.
 */
export interface AuthoritySpecificBlockProps {
  authority: AuthorityType;
  children: ReactNode;
  title?: string; // Added an optional title for context
}

/**
 * AuthoritySpecificBlock component.
 * This component can be expanded to render different UI or logic based on the authority.
 * For now, it displays the authority type and renders children.
 *
 * @param {AuthoritySpecificBlockProps} props - The props for the component.
 * @returns {JSX.Element} A view that can adapt to different authority types.
 */
const AuthoritySpecificBlock: React.FC<AuthoritySpecificBlockProps> = ({ authority, children, title }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.blockTitle}>{title}</Text>}
      {/*
        Future enhancement: Conditionally render specific UI elements or apply different styles
        based on the 'authority' prop.
        Example:
        {authority === AuthorityType.Emotional && <Text>Emotional Authority Specific Tip</Text>}
      */}
      <View style={styles.contentContainer}>
        {children}
      </View>
      <Text style={styles.authorityDebugText}>Current Authority Context: {authority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd', // Default border
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  contentContainer: {
    // Styles for the content area
  },
  authorityDebugText: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 10,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  // Example of authority-specific styling (can be expanded)
  // emotionalBorder: {
  //   borderColor: 'blue',
  // },
  // sacralBorder: {
  //   borderColor: 'red',
  // },
});

export default AuthoritySpecificBlock;
