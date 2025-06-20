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
import StepTracker from '../../../components/StepTracker';
import { STEP_LABELS, FLOW_STEPS } from '../../../constants/flowSteps';
import ScreenExplainer from '../../../components/ScreenExplainer';
import { SCREEN_EXPLAINERS } from '../../../constants/screenExplainers';
import { colors, spacing } from '../../../constants/theme';

/**
 * FrequencyMapperScreen component
 * 
 * This is a simplified implementation of the FrequencyMapper screen.
 */
const FrequencyMapperScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [desireInput, setDesireInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Define our steps 
  const stepLabels = STEP_LABELS.FREQUENCY_MAPPER;
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
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
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                setIsLoading(true);
                // Simulate processing
                setTimeout(() => {
                  setIsLoading(false);
                  if (currentStep < FLOW_STEPS.FREQUENCY_MAPPER - 1) {
                    setCurrentStep(currentStep + 1);
                  }
                }, 1000);
              }}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : currentStep === FLOW_STEPS.FREQUENCY_MAPPER - 1 ? 'Complete' : 'Continue'}
              </Text>
              {isLoading && <ActivityIndicator color="#fff" style={styles.loader} />}
            </TouchableOpacity>
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
    borderColor: colors.base2,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginLeft: spacing.xs,
  }
});

export default FrequencyMapperScreen;
