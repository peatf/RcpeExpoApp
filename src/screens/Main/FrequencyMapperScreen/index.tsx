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
import OnboardingBanner from '../../../components/OnboardingBanner';
import useOnboardingBanner from '../../../hooks/useOnboardingBanner';
import ChoiceCard from '../../../components/FrequencyMapper/ChoiceCard'; // Import ChoiceCard

/**
 * FrequencyMapperScreen component
 * 
 * This is a simplified implementation of the FrequencyMapper screen.
 */
const FrequencyMapperScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Desire Input, 1: Choice Selection, 2: Further step...
  const [desireInput, setDesireInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Frequency Mapper');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const mockChoices = [
    { id: 'essence', title: 'Essence', description: "Explore the core vibrational nature of your desire." },
    { id: 'density', title: 'Density', description: "Understand the material and energetic weight of this experience." },
    { id: 'form', title: 'Form', description: "Define the specific shape and structure it might take." },
  ];

  // Define our steps - extending for the new choice step
  const totalSteps = FLOW_STEPS.FREQUENCY_MAPPER + 1; // Added a choice step
  const currentVisualStep = currentStep + 1;
  
  const handleNextStep = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Handle completion of all steps
        console.log("Frequency Mapper complete!");
      }
    }, 1000);
  };
  
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
        {/* ScreenExplainer could be step-specific */}
        {currentStep === 0 && <ScreenExplainer text={SCREEN_EXPLAINERS.REFLECTION} />}
        {currentStep === 1 && <ScreenExplainer text="Select the aspect you want to focus on for your desire." />}
        
        <StepTracker 
          currentStep={currentVisualStep}
          totalSteps={totalSteps}
          stepLabels={[...STEP_LABELS.FREQUENCY_MAPPER.slice(0,1), "Refinement Choice", ...STEP_LABELS.FREQUENCY_MAPPER.slice(1)]}
        />
        
        {currentStep === 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.prompt}>What would you like to experience?</Text>
            <TextInput
              style={styles.input}
              value={desireInput}
              onChangeText={setDesireInput}
              placeholder="Enter your desire here..."
              multiline
              editable={true}
              selectTextOnFocus={true}
              blurOnSubmit={false}
              textAlignVertical="top"
              autoCapitalize="sentences"
              autoCorrect={true}
              spellCheck={true}
            />
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.choiceContainer}>
            <Text style={styles.prompt}>Which aspect of '{desireInput || "your desire"}' feels most relevant to explore now?</Text>
            {mockChoices.map(choice => (
              <ChoiceCard
                key={choice.id}
                title={choice.title}
                description={choice.description} // Passing description here
                onPress={() => setSelectedChoice(choice.id)}
                isSelected={selectedChoice === choice.id}
              />
            ))}
          </View>
        )}

        {/* Placeholder for other steps */}
        {currentStep > 1 && (
          <View style={styles.inputContainer}>
            <Text style={styles.prompt}>Further refinement for {selectedChoice} (Step {currentVisualStep})</Text>
            {/* Add relevant inputs or content for subsequent steps */}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <StackedButton
            shape="rectangle"
            text={isLoading ? 'Processing...' : currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
            onPress={handleNextStep}
          />
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
  choiceContainer: { // Added style for the choice card area
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
