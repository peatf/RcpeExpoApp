/**
 * @file WelcomeScreen.tsx
 * @description Welcome screen matching mockup design with RCPE branding and main action button
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StackedButton from '../../components/StackedButton';
import { colors, typography, spacing } from '../../constants/theme';

interface WelcomeScreenProps {
  onBeginSession?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBeginSession }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>RCPE</Text>
        </View>
        
        {/* Main Action Section */}
        <View style={styles.actionSection}>
          <StackedButton
            type="circle"
            onPress={() => onBeginSession?.()}
            text="START"
          />
          <Text style={styles.actionLabel}>Begin Session</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusPanel}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>● ALL SYSTEMS NOMINAL</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    fontFamily: 'System',
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -2,
    lineHeight: 64,
  },
  subtitle: {
    ...typography.labelSmall,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  actionSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.labelLarge,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  statusSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.base1,
    backdropFilter: 'blur(10px)',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.labelSmall,
    fontFamily: 'monospace',
    color: colors.accent,
    fontWeight: '600',
  },
});

export default WelcomeScreen;