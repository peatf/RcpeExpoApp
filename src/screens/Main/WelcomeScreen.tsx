/**
 * @file WelcomeScreen.tsx
 * @description Welcome screen matching mockup design with RCPE branding and main action button
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StackedButton from '../../components/StackedButton';
import { colors, spacing, typography, borderRadius, fonts, theme } from '../../constants/theme'; // Import individual theme constants
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons

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
          {/* <Text style={styles.subtitle}>Reality Creation & Perception Engine</Text> */}
        </View>
        
        {/* Main Action Section */}
        <View style={styles.actionSection}>
          <View style={styles.startButtonWrapper}>
            <StackedButton
              shape="circle"
              onPress={() => onBeginSession?.()}
            >
              <Ionicons name="compass-outline" size={48} color={theme.colors.bg} />
              {/* Increased icon size a bit as button is now 120. Color assumes icon is on dark top layer of button */}
            </StackedButton>
          </View>
          <Text style={styles.actionLabel}>Begin Your First Quest</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusPanel}>
            <Text style={styles.statusIndicator}>●</Text>
            <Text style={styles.statusText}>AWAITING YOUR COMMAND</Text>
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
    paddingHorizontal: spacing.lg, // Use theme spacing
    paddingVertical: spacing.xl,   // Use theme spacing
    justifyContent: 'space-between', // Distribute space between sections
  },
  titleSection: {
    flex: 0.8, // Adjusted flex
    alignItems: 'center',
    justifyContent: 'center', // Center logo and subtitle
    // paddingTop: spacing.xl, // Keep or adjust as needed
  },
  actionSection: {
    flex: 1.2, // Takes more available space to potentially lower the button
    alignItems: 'center',
    justifyContent: 'center', // Center button and label
  },
  logo: {
    width: 240, // As per spec
    height: 80, // Example height, adjust to maintain aspect ratio if needed
    resizeMode: 'contain',
    marginBottom: spacing.sm, // Space between logo and subtitle
  },
  // title style removed as it's replaced by logo image
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: typography.labelSmall.fontSize || 12, // Default to 12 if not in theme
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  startButtonWrapper: {
    // flex: 1, // If actionSection is already flex and centering, this might not be needed or could conflict.
                // Per instruction, using flex:1, justifyContent: "center"
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg, // Nudge up or down
  },
  startButton: { // This style is applied to StackedButton's outer TouchableOpacity.
                 // It will make the touchable area 120x120.
                 // The visual layers of StackedButton itself won't scale with this
                 // unless StackedButton is modified to use this style for its layer calculations.
    width: 120,
    height: 120,
  },
  actionLabel: {
    fontFamily: fonts.mono,
    fontSize: typography.labelSmall.fontSize || 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md, // HTML: mt-6 (24px), spacing.md is 16px. Adjust if needed.
  },
  statusSection: {
    // flex: 1, // Let it take natural height or a smaller flex value if needed
    minHeight: 60, // Ensure space for the status panel, adjust as needed
    alignItems: 'center',
    justifyContent: 'flex-end', // Push status panel to bottom of its flex space
    paddingBottom: spacing.md,
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md, // HTML: px-4 (16px)
    paddingVertical: spacing.sm,   // HTML: py-3 (12px)
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: borderRadius.sm, // 8px
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // As per spec
    // backdropFilter: 'blur(10px)', // Not supported in React Native standard components
  },
  statusIndicator: { // This style is for the "●" text now
    color: colors.accent,
    fontSize: typography.labelSmall.fontSize || 12, // Match text size
    marginRight: spacing.sm, // Space between dot and text
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: typography.labelSmall.fontSize || 12, // HTML: text-xs
    color: colors.accent,
    // fontWeight: '600', // If needed, but labelSmall might define it
  },
});

export default WelcomeScreen;