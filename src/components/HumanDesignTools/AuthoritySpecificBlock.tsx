/**
 * @file AuthoritySpecificBlock.tsx
 * @description A component that can conditionally render content based on an authorityType prop.
 *              For now, it primarily acts as a wrapper and sets the stage for more complex logic.
 */
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthorityType } from '../../types/humanDesignTools';
import { theme } from '../../constants/theme'; // Import theme

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
    marginVertical: theme.spacing.sm,     // Use theme spacing
    // marginHorizontal: theme.spacing.md, // Consider if this should be applied by parent or here
    padding: theme.spacing.md,            // Use theme spacing
    borderWidth: 1,
    borderColor: theme.colors.base2,      // Themed border color
    borderRadius: theme.borderRadius.md,  // Themed border radius
    backgroundColor: theme.colors.base1,  // Themed background (e.g., a light off-white/gray)
  },
  blockTitle: {
    fontFamily: theme.fonts.mono, // Or display/body if more prominent
    fontSize: theme.typography.headingSmall.fontSize, // Themed heading size
    fontWeight: theme.typography.headingSmall.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,        // Use theme spacing
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base3, // Themed border color
    paddingBottom: theme.spacing.xs,       // Use theme spacing
  },
  contentContainer: {
    // Styles for the content area if needed, e.g., marginTop if title is present
  },
  authorityDebugText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelXSmall.fontSize, // Very small for debug
    color: theme.colors.textSecondary,    // Themed color
    marginTop: theme.spacing.sm,          // Use theme spacing
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
