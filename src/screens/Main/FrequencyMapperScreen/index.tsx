/**
 * @file FrequencyMapperScreen/index.tsx
 * @description Dynamic, Drive Mechanics-personalized Desire Refinement Experience
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import StepTracker from '../../../components/StepTracker';
import { STEP_LABELS, FLOW_STEPS } from '../../../constants/flowSteps';
import ScreenExplainer from '../../../components/ScreenExplainer';
import { SCREEN_EXPLAINERS } from '../../../constants/screenExplainers';
import { colors, spacing, theme } from '../../../constants/theme'; // Import theme
import OnboardingBanner from '../../../components/OnboardingBanner'; // Import OnboardingBanner
import useOnboardingBanner from '../../../hooks/useOnboardingBanner'; // Import useOnboardingBanner

/**
 * FrequencyMapperScreen component
 * 
 * This is a simplified implementation of the FrequencyMapper screen.
 */
const FrequencyMapperScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [desireInput, setDesireInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Frequency Mapper');
  
  // Define our steps 
  const stepLabels = STEP_LABELS.FREQUENCY_MAPPER;
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {!isLoadingBanner && showBanner && (
          <OnboardingBanner
            toolName="Frequency Mapper"
            description="Welcome to the Frequency Mapper! Define your desires and map their energetic qualities."
            onDismiss={dismissBanner}
          />
        )}
        <ScreenExplainer 
          text={SCREEN_EXPLAINERS.REFLECTION} 
        />
        
        <StepTracker 
          currentStep={currentStep + 1} 
          totalSteps={FLOW_STEPS.FREQUENCY_MAPPER} 
          stepLabels={STEP_LABELS.FREQUENCY_MAPPER}
        />
        
        <View style={styles.inputContainer}>
          <Text style={styles.prompt}>What would you like to experience?</Text>
          <TextInput
            style={styles.input}
            value={desireInput}
            onChangeText={setDesireInput}
            placeholder="Enter your desire here..."
            multiline
          />
          
          <View style={styles.buttonContainer}>
            <StackedButton
              shape="rectangle"
              text={isLoading ? 'Processing...' : currentStep === FLOW_STEPS.FREQUENCY_MAPPER - 1 ? 'Complete' : 'Continue'}
              onPress={() => {
                if (isLoading) return; // Prevent action if already loading
                setIsLoading(true);
                // Simulate processing
                setTimeout(() => {
                  setIsLoading(false);
                  if (currentStep < FLOW_STEPS.FREQUENCY_MAPPER - 1) {
                    setCurrentStep(currentStep + 1);
                  }
                }, 1000);
              }}
              // StackedButton doesn't have a disabled prop in its interface,
              // but the onPress logic can check isLoading.
              // Also, StackedButton doesn't show ActivityIndicator internally.
              // The original TouchableOpacity style (styles.button) might need to be removed or adapted
              // if StackedButton provides all necessary layout.
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    // Assuming headerHeight is approx 60, spacing.md is 16.
    // paddingTop: headerHeight + spacing.md (e.g., 60 + 16 = 76)
    // For now, using a fixed value. In a real app, get headerHeight dynamically.
    paddingTop: theme.spacing.xl * 2, // Approx 64, can be adjusted
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputContainer: {
    marginTop: spacing.md,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.base3, // Updated from colors.base2
    borderRadius: 8,
    padding: spacing.sm,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginLeft: spacing.xs,
  }
});

export default FrequencyMapperScreen;
