import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme'; // Assuming theme.ts

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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.base1, // Light background for the tracker
    borderBottomWidth: 1,
    borderBottomColor: colors.base2,
  },
  textContainer: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  stepText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  stepLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.base3, // Default for pending
  },
  pendingDot: {
    backgroundColor: colors.base2,
    opacity: 0.7,
  },
  completedDot: {
    backgroundColor: colors.accent,
  },
  currentDot: { // Specific style for the current step's dot
    backgroundColor: colors.accent, // Same as completed for now
    transform: [{ scale: 1.2 }], // Make it slightly larger
    // You could also use a different color or an outline
  }
});

// As suggested in docs, memoize for performance if it becomes an issue.
// For now, default export is fine. If profiling shows it's needed:
// export default React.memo(StepTracker);
export default StepTracker;
