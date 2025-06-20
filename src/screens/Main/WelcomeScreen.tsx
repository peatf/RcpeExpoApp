/**
 * @file WelcomeScreen.tsx
 * @description Welcome screen matching mockup design with RCPE branding and main action button
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StackedButton from '../../components/StackedButton';
import { theme } from '../../constants/theme'; // Import full theme

interface WelcomeScreenProps {
  onBeginSession?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginSession }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title Section */}
        <View style={styles.titleSection}>
          <Image
            source={require('../../../assets/inoslogotextonlycharcoal.png')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>Reality Creation & Perception Engine</Text>
        </View>
        
        {/* Main Action Section */}
        <View style={styles.actionSection}>
          <StackedButton
            type="circle" // type="circle" is 160x160px by default from its own style
            onPress={() => onBeginSession?.()}
            // text prop removed as circle button doesn't use it for a primary label
          />
          <Text style={styles.actionLabel}>Begin Session</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusPanel}>
            <Text style={styles.statusIndicator}>●</Text>
            <Text style={styles.statusText}>ALL SYSTEMS NOMINAL</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Assuming AppBackground provides the actual background image
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg, // Use theme spacing
    paddingVertical: theme.spacing.xl,   // Use theme spacing
    justifyContent: 'space-between', // Distribute space between sections
  },
  titleSection: {
    flex: 1, // Takes available space, pushing others
    alignItems: 'center',
    justifyContent: 'center', // Center logo and subtitle
    // paddingTop: theme.spacing.xl, // Keep or adjust as needed
  },
  logo: {
    width: 240, // As per spec
    height: 80, // Example height, adjust to maintain aspect ratio if needed
    resizeMode: 'contain',
    marginBottom: theme.spacing.sm, // Space between logo and subtitle
  },
  // title style removed as it's replaced by logo image
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize || 12, // Default to 12 if not in theme
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  actionSection: {
    flex: 1, // Takes available space
    alignItems: 'center',
    justifyContent: 'center', // Center button and label
  },
  actionLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize || 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md, // HTML: mt-6 (24px), theme.spacing.md is 16px. Adjust if needed.
  },
  statusSection: {
    // flex: 1, // Let it take natural height or a smaller flex value if needed
    minHeight: 60, // Ensure space for the status panel, adjust as needed
    alignItems: 'center',
    justifyContent: 'flex-end', // Push status panel to bottom of its flex space
    paddingBottom: theme.spacing.md,
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md, // HTML: px-4 (16px)
    paddingVertical: theme.spacing.sm,   // HTML: py-3 (12px)
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm, // 8px
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // As per spec
    // backdropFilter: 'blur(10px)', // Not supported in React Native standard components
  },
  statusIndicator: { // This style is for the "●" text now
    color: theme.colors.accent,
    fontSize: theme.typography.labelSmall.fontSize || 12, // Match text size
    marginRight: theme.spacing.sm, // Space between dot and text
  },
  statusText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize || 12, // HTML: text-xs
    color: theme.colors.accent,
    // fontWeight: '600', // If needed, but labelSmall might define it
  },
});

export default WelcomeScreen;