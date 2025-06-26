import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme'; // Import full theme

interface StepTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const StepTracker: React.FC<StepTrackerProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.max(1, Math.min(currentStep, totalSteps));

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>
          Step {safeCurrentStep} of {totalSteps}
        </Text>
        {stepLabels && stepLabels[safeCurrentStep - 1] && (
          <Text style={styles.stepLabel}>
            {stepLabels[safeCurrentStep - 1]}
          </Text>
        )}
      </View>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < safeCurrentStep ? styles.completedDot : styles.pendingDot,
              index === safeCurrentStep -1 && styles.currentDot, // Highlight current step dot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,     // Use theme spacing
    paddingHorizontal: theme.spacing.md,   // Use theme spacing
    backgroundColor: 'transparent',        // Changed from theme.colors.base1
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base2, // Use theme color
  },
  textContainer: {
    marginBottom: theme.spacing.sm,        // Use theme spacing
    alignItems: 'center',
  },
  stepText: {
    fontFamily: theme.fonts.mono,          // Use theme font
    fontSize: theme.typography.labelSmall.fontSize, // Use theme typography
    color: theme.colors.textPrimary,       // Use theme color
    fontWeight: 'bold',
  },
  stepLabel: {
    fontFamily: theme.fonts.mono,          // Use theme font
    fontSize: theme.typography.labelSmall.fontSize, // Use theme typography
    color: theme.colors.textSecondary,     // Use theme color
    marginTop: theme.spacing.xs,           // Use theme spacing
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 8, // Slightly smaller dots for a tighter look
    height: 8,
    borderRadius: theme.borderRadius.full, // Use theme border radius (e.g., 4 for 8x8 dot)
    marginHorizontal: theme.spacing.xs,    // Use theme spacing
    // backgroundColor is set by specific states (pending, completed, current)
  },
  pendingDot: { // For steps not yet completed and not current
    backgroundColor: theme.colors.base3,   // Use theme color for inactive/pending
    opacity: 0.7,
  },
  completedDot: { // For steps completed (and not current)
    backgroundColor: theme.colors.accent,  // Use theme color for completed
  },
  currentDot: { // Specific style for the current step's dot
    backgroundColor: theme.colors.accent,  // Use theme color for current
    transform: [{ scale: 1.3 }],         // Make it slightly larger
    // elevation: 1, // Optional: add a slight shadow for current dot
  }
});

// As suggested in docs, memoize for performance if it becomes an issue.
// For now, default export is fine. If profiling shows it's needed:
// export default React.memo(StepTracker);
export default StepTracker;
