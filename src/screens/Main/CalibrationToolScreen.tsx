/**
 * @file CalibrationToolScreen.tsx
 * @description Enhanced Calibration Tool with Frequency Mapper integration and Processing Core personalization
 */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { theme } from '../../constants/theme'; // Import theme
import StepTracker from '../../components/StepTracker'; // Import StepTracker
import { FLOW_STEPS, STEP_LABELS } from '../../constants/flowSteps'; // Import constants
import {Ionicons} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import aiCalibrationToolService, {
  FrequencyMapperHandoff,
  SliderValues,
  CalibrationReflections,
  PersonalizedSliderSet,
  IntegratedCalibrationRecommendation,
  CalibrationToOracleHandoff,
  EnhancedSliderUI
} from '../../services/aiCalibrationToolService';
import OnboardingBanner from '../../components/OnboardingBanner';
import { MicroQuestTracker } from '../../components/Quests/MicroQuestTracker';
import { QuestCompletionToast } from '../../components/Feedback/QuestCompletionToast';
import { useOnboardingBanner, useMicroQuests, useQuestLog, useNarrativeCopy } from '../../hooks';
import { QuestTransition } from '../../components/Transitions/QuestTransition';

interface CalibrationToolScreenProps {
  navigation: any;
  route: any;
}

const CalibrationToolScreen: React.FC<CalibrationToolScreenProps> = ({navigation, route}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('CalibrationTool');
  const { completeMicroQuestAction, showToast, completedQuestTitle, hideToast } = useMicroQuests();
  const { logCalibrationResult } = useQuestLog();
  const { getCopy } = useNarrativeCopy();
  
  // Core state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading your refined desire...');
  const [currentStep, setCurrentStep] = useState<'intro' | 'sliders' | 'reflections' | 'results'>('intro');
  const [visualCurrentStep, setVisualCurrentStep] = useState<number>(1); // State for visual tracker

  // Frequency Mapper integration
  const [handoffData, setHandoffData] = useState<FrequencyMapperHandoff | null>(null);
  const [hasFrequencyMapperData, setHasFrequencyMapperData] = useState<boolean>(false);

  // Slider state
  const [sliderValues, setSliderValues] = useState<SliderValues>({
    belief: 0.5,
    belief_logical: 0.5,
    openness: 0.5,
    openness_acceptance: 0.5,
    worthiness: 0.5,
    worthiness_receiving: 0.5,
  });
  const [personalizedSliders, setPersonalizedSliders] = useState<PersonalizedSliderSet | null>(null);

  // Reflection state
  const [reflections, setReflections] = useState<CalibrationReflections>({
    belief_reflection: '',
    belief_logical_reflection: '',
    openness_reflection: '',
    openness_acceptance_reflection: '',
    worthiness_reflection: '',
    worthiness_receiving_reflection: '',
  });
  const [currentReflectionStep, setCurrentReflectionStep] = useState<'belief' | 'belief_logical' | 'openness' | 'openness_acceptance' | 'worthiness' | 'worthiness_receiving'>('belief');

  // Results state
  const [recommendation, setRecommendation] = useState<IntegratedCalibrationRecommendation | null>(null);
  const [oracleHandoffData, setOracleHandoffData] = useState<CalibrationToOracleHandoff | null>(null);

  // UI state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load data on mount
  useEffect(() => {
    const initializeCalibration = async () => {
      try {
        setLoadingMessage('Connecting to your Frequency Mapper journey...');
        
        // Check for route params first (direct navigation from Frequency Mapper)
        if (route.params?.sessionId) {
          console.log('Calibration: Received route params:', route.params);
          const sessionId = route.params.sessionId;
          const userId = await AsyncStorage.getItem('userId') || 'mock-user-123';
          
          try {
            const data = await aiCalibrationToolService.initializeFromFrequencyMapper(sessionId, userId);
            if (data) {
              setHandoffData(data);
              setHasFrequencyMapperData(true);
              
              setLoadingMessage('Personalizing your experience...');
              const sliders = await aiCalibrationToolService.generatePersonalizedSliders(data);
              setPersonalizedSliders(sliders);
            } else {
              console.warn('No handoff data from API, trying storage fallback');
              throw new Error('API handoff failed');
            }
          } catch (error) {
            console.warn('Route params failed, falling back to storage:', error);
            // Fallback to storage method
            const storedOutput = await AsyncStorage.getItem('frequencyMapperOutput');
            if (storedOutput) {
              const frequencyMapperOutput = JSON.parse(storedOutput);
              
              const mockHandoffData: FrequencyMapperHandoff = {
                session_id: sessionId,
                frequency_mapper_output: frequencyMapperOutput,
                processing_core_summary: 'Emotional Authority, Defined Heart Center, Venus in Taurus',
                decision_growth_summary: 'Generator strategy with emotional clarity',
                tension_points_summary: 'Chiron in Gate 25, themes around self-worth and universal love'
              };
              
              setHandoffData(mockHandoffData);
              setHasFrequencyMapperData(true);
              
              setLoadingMessage('Personalizing your experience...');
              const sliders = await aiCalibrationToolService.generatePersonalizedSliders(mockHandoffData);
              setPersonalizedSliders(sliders);
            }
          }
        } else {
          // Try to load from storage (user navigated manually)
          console.log('Calibration: Checking AsyncStorage for frequencyMapperOutput');
          const storedOutput = await AsyncStorage.getItem('frequencyMapperOutput');
          console.log('Calibration: StoredOutput length:', storedOutput?.length || 'null');
          
          if (storedOutput) {
            const frequencyMapperOutput = JSON.parse(storedOutput);
            console.log('Calibration: Parsed output keys:', Object.keys(frequencyMapperOutput));
            
            // Create mock handoff data for development
            const mockHandoffData: FrequencyMapperHandoff = {
              session_id: frequencyMapperOutput.session_metadata?.session_id || 'mock-session',
              frequency_mapper_output: frequencyMapperOutput,
              processing_core_summary: 'Emotional Authority, Defined Heart Center, Venus in Taurus',
              decision_growth_summary: 'Generator strategy with emotional clarity',
              tension_points_summary: 'Chiron in Gate 25, themes around self-worth and universal love'
            };
            
            setHandoffData(mockHandoffData);
            setHasFrequencyMapperData(true);
            
            setLoadingMessage('Personalizing your experience...');
            const sliders = await aiCalibrationToolService.generatePersonalizedSliders(mockHandoffData);
            setPersonalizedSliders(sliders);
          }
        }
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
        
      } catch (error) {
        console.error('Failed to initialize calibration:', error);
        Alert.alert('Error', 'Failed to load your Frequency Mapper data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCalibration();
  }, [route.params]);

  // Effect to update visualCurrentStep
  useEffect(() => {
    switch (currentStep) {
      case 'intro':
        setVisualCurrentStep(1);
        break;
      case 'sliders':
        // When sliders are shown, we assume they are starting with the first one, "Belief Assessment"
        setVisualCurrentStep(1);
        break;
      case 'reflections':
        switch (currentReflectionStep) {
          case 'belief': setVisualCurrentStep(1); break;
          case 'belief_logical': setVisualCurrentStep(2); break;
          case 'openness': setVisualCurrentStep(3); break;
          case 'openness_acceptance': setVisualCurrentStep(4); break;
          case 'worthiness': setVisualCurrentStep(5); break;
          case 'worthiness_receiving': setVisualCurrentStep(6); break;
          default: setVisualCurrentStep(1);
        }
        break;
      case 'results':
        setVisualCurrentStep(6); // Or a dedicated "Results" step if it were part of labels
        break;
      default:
        setVisualCurrentStep(1);
    }
  }, [currentStep, currentReflectionStep]);

  // Handle slider changes
  const handleSliderChange = (dimension: keyof SliderValues, value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [dimension]: value,
    }));
  };

  // Handle reflection input
  const handleReflectionChange = (dimension: keyof CalibrationReflections, text: string) => {
    setReflections(prev => ({
      ...prev,
      [dimension]: text,
    }));
  };

  // Move to reflection step
  const handleContinueToReflections = () => {
    setCurrentStep('reflections');
  };

  // Process next reflection step
  const handleNextReflection = () => {
    const steps: Array<'belief' | 'belief_logical' | 'openness' | 'openness_acceptance' | 'worthiness' | 'worthiness_receiving'> = ['belief', 'belief_logical', 'openness', 'openness_acceptance', 'worthiness', 'worthiness_receiving'];
    const currentIndex = steps.indexOf(currentReflectionStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentReflectionStep(steps[currentIndex + 1]);
    } else {
      handleProcessCalibration();
    }
  };

  // Process final calibration
  const handleProcessCalibration = async () => {
    if (!handoffData) {
      console.error('Calibration: No handoff data available');
      return;
    }
    
    console.log('Calibration: Starting final processing...');
    setIsProcessing(true);
    setLoadingMessage('Integrating your alignment across all dimensions...');
    
    try {
      console.log('Calibration: Generating integrated recommendation...');
      const recommendation = await aiCalibrationToolService.generateIntegratedRecommendation(
        handoffData,
        sliderValues,
        reflections
      );
      
      console.log('Calibration: Recommendation generated:', !!recommendation);
      setRecommendation(recommendation);
      
      // Prepare Oracle handoff
      console.log('Calibration: Preparing Oracle handoff...');
      const oracleData = await aiCalibrationToolService.prepareOracleHandoff(
        handoffData.session_id,
        {
          frequency_mapper_handoff: handoffData,
          slider_values: sliderValues,
          reflections: reflections,
          integrated_recommendation: recommendation
        }
      );
      
      console.log('Calibration: Oracle handoff prepared:', !!oracleData);
      setOracleHandoffData(oracleData);
      console.log('Calibration: Moving to results view...');
      setCurrentStep('results');
      completeMicroQuestAction('calibration_complete');
      logCalibrationResult(recommendation.map_summary);
      
    } catch (error) {
      console.error('Failed to process calibration:', error);
      Alert.alert('Error', 'Failed to process your calibration. Please try again.');
    } finally {
      console.log('Calibration: Processing complete, stopping loading...');
      setIsProcessing(false);
    }
  };

  // Navigate to Oracle
  const handleNavigateToOracle = () => {
    console.log('Calibration: Navigating to Oracle with data:', {
      hasOracleData: !!oracleHandoffData,
      sessionId: oracleHandoffData?.session_id,
      dataKeys: oracleHandoffData ? Object.keys(oracleHandoffData) : []
    });
    
    if (oracleHandoffData) {
      // @ts-ignore
      navigation.navigate('Oracle', {
        handoffData: oracleHandoffData,
        previousTool: 'calibration'
      });
    } else {
      console.error('Calibration: No Oracle handoff data available');
      Alert.alert('Error', 'No Oracle data available. Please try again.');
    }
  };

  // Save progress
  const handleSaveProgress = async () => {
    try {
      await AsyncStorage.setItem('calibrationResults', JSON.stringify({
        handoffData,
        sliderValues,
        reflections,
        recommendation,
        timestamp: new Date().toISOString()
      }));
      Alert.alert('Saved', 'Your calibration results have been saved.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your progress.');
    }
  };

  // Render loading screen
  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.loadingText}>{loadingMessage}</Text>
      <Text style={styles.loadingSubtext}>
        Preparing your personalized coaching experience...
      </Text>
    </View>
  );

  // Render error/no data screen
  const renderNoDataScreen = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="alert-circle-outline" size={64} color={theme.colors.base2} />
      <Text style={styles.noDataTitle}>No Frequency Mapper Data</Text>
      <Text style={styles.noDataText}>
        Please complete the Frequency Mapper first to calibrate your alignment.
      </Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('FrequencyMapper')}
      >
        <Text style={styles.actionButtonText}>Go to Frequency Mapper</Text>
      </TouchableOpacity>
    </View>
  );

  // Render introduction screen
  const renderIntroScreen = () => {
    if (!handoffData) return null;
    
    // Add safety checks for undefined frequency_mapper_output
    const frequencyOutput = handoffData.frequency_mapper_output || {};
    const { 
      desired_state = "aligned and authentic", 
      energetic_quality = "harmonious energy", 
      refinement_path = ["authentic", "connected"] 
    } = frequencyOutput as {
      desired_state?: string;
      energetic_quality?: string;
      refinement_path?: string[];
    };
    
    return (
      <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
        <View style={styles.desiredStateCard}>
          <Text style={styles.welcomeBack}>Welcome back!</Text>
          <Text style={styles.desiredStateLabel}>You've clarified your desire:</Text>
          <Text style={styles.desiredStateText}>"{desired_state}"</Text>
          <View style={styles.journeyPath}>
            <Text style={styles.journeyLabel}>Your refinement journey:</Text>
            {refinement_path.map((step, index) => (
              <Text key={index} style={styles.journeyStep}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>
          <Text style={styles.energeticQuality}>
            Energy signature: <Text style={styles.energyText}>{energetic_quality}</Text>
          </Text>
        </View>

        <View style={styles.calibrationExplanation}>
          <Text style={styles.explanationTitle}>Now let's calibrate your alignment</Text>
          <Text style={styles.explanationText}>
            We'll measure where you stand across six key dimensions:
          </Text>
          
          <View style={styles.dimensionsList}>
            <View style={styles.dimensionItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.accent} />
              <Text style={styles.dimensionText}>
                <Text style={styles.dimensionLabel}>Belief</Text> - How much you trust it's possible & logical
              </Text>
            </View>
            <View style={styles.dimensionItem}>
              <Ionicons name="heart-circle" size={20} color={theme.colors.accent} />
              <Text style={styles.dimensionText}>
                <Text style={styles.dimensionLabel}>Openness</Text> - Willingness to receive & accept current reality
              </Text>
            </View>
            <View style={styles.dimensionItem}>
              <Ionicons name="star-outline" size={20} color={theme.colors.accent} />
              <Text style={styles.dimensionText}>
                <Text style={styles.dimensionLabel}>Worthiness</Text> - How much you deserve it & comfort receiving
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => setCurrentStep('sliders')}
        >
          <Text style={styles.continueButtonText}>Begin Calibration Quest</Text>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.bg} style={{marginLeft: 8}} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render individual slider
  const renderSlider = (dimension: keyof SliderValues) => {
    if (!personalizedSliders) return null;
    
    const sliderConfig = personalizedSliders[`${dimension}_slider`];
    const value = sliderValues[dimension];
    
    // Add safety check for undefined sliderConfig
    if (!sliderConfig) {
      console.warn(`Missing slider config for ${dimension}_slider`);
      return null;
    }
    
    return (
      <View style={styles.sliderCard}>
        <Text style={styles.sliderLabel}>{sliderConfig.label || `${dimension} Slider`}</Text>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.anchorMin}>{sliderConfig.anchor_min || "Min"}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={value}
            onValueChange={(newValue) => handleSliderChange(dimension, newValue)}
            minimumTrackTintColor={theme.colors.accent}
            maximumTrackTintColor={theme.colors.base1}
            thumbTintColor={theme.colors.accent}
          />
          <Text style={styles.anchorMax}>{sliderConfig.anchor_max || "Max"}</Text>
        </View>
        
        <Text style={styles.microcopy}>{sliderConfig.microcopy || ""}</Text>
        <Text style={styles.processingNote}>{sliderConfig.processing_core_note || ""}</Text>
        
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{Math.round(value * 100)}%</Text>
        </View>
      </View>
    );
  };

  // Render sliders screen
  const renderSlidersScreen = () => (
    <View style={styles.slidersContainer}>
      <Text style={styles.stepTitle}>Calibrate Your Alignment</Text>
      <Text style={styles.stepSubtitle}>
        Adjust each slider to reflect where you honestly are right now
      </Text>
      
      {renderSlider('belief')}
      {renderSlider('belief_logical')}
      {renderSlider('openness')}
      {renderSlider('openness_acceptance')}
      {renderSlider('worthiness')}
      {renderSlider('worthiness_receiving')}
      
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinueToReflections}
      >
        <Text style={styles.continueButtonText}>Continue to Reflection</Text>
        <Ionicons name="arrow-forward" size={18} color={theme.colors.bg} style={{marginLeft: 8}} />
      </TouchableOpacity>
    </View>
  );

  // Render reflection screen
  const renderReflectionScreen = () => {
    if (!personalizedSliders) return null;
    
    const currentSlider = personalizedSliders[`${currentReflectionStep}_slider`];
    const isLastStep = currentReflectionStep === 'worthiness_receiving';
    
    // Format the step name for display
    const getFormattedStepName = (step: string) => {
      const names: Record<string, string> = {
        'belief': 'Belief',
        'belief_logical': 'Logical Belief',
        'openness': 'Openness',
        'openness_acceptance': 'Acceptance',
        'worthiness': 'Worthiness',
        'worthiness_receiving': 'Receiving Comfort'
      };
      return names[step] || step;
    };
    
    return (
      <View style={styles.reflectionContainer}>
        <Text style={styles.stepTitle}>
          Reflect on {getFormattedStepName(currentReflectionStep)}
        </Text>
        
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionPrompt}>{currentSlider.reflection_prompt}</Text>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.reflectionInput}
              placeholder="Share your thoughts..."
              placeholderTextColor={theme.colors.textSecondary}
              value={reflections[`${currentReflectionStep}_reflection` as keyof CalibrationReflections]}
              onChangeText={(text) => handleReflectionChange(`${currentReflectionStep}_reflection` as keyof CalibrationReflections, text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={true}
              selectTextOnFocus={true}
              blurOnSubmit={false}
              autoCapitalize="sentences"
              autoCorrect={true}
              spellCheck={true}
              keyboardType="default"
              returnKeyType="default"
              scrollEnabled={true}
              onFocus={() => {}}
              onBlur={() => {}}
              // Critical props for React Native 0.79.3 + React 19 compatibility
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              importantForAutofill="no"
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleNextReflection}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={theme.colors.bg} />
          ) : (
            <>
              <Text style={styles.continueButtonText}>
                {isLastStep ? 'Process Calibration' : 'Next Reflection'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.bg} style={{marginLeft: 8}} />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render results screen
  const renderResultsScreen = () => {
    if (!recommendation || !handoffData) return null;
    
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.stepTitle}>Your Integrated Alignment</Text>
        
        {/* Map Summary */}
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Alignment Overview</Text>
          <Text style={styles.resultText}>{recommendation.map_summary}</Text>
        </View>

        {/* Core Insights */}
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Key Insights</Text>
          {recommendation.core_insights.map((insight, index) => (
            <View key={index} style={styles.insightRow}>
              <Ionicons name="bulb-outline" size={16} color={theme.colors.accent} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>

        {/* Path Forward */}
        <View style={[
          styles.resultCard,
          recommendation.oracle_preparation.recommended_path === 'shadow' ? styles.shadowCard : styles.expansionCard
        ]}>
          <Text style={styles.resultCardTitle}>Your Path Forward</Text>
          <Text style={styles.pathText}>{recommendation.oracle_preparation.path_reasoning}</Text>
          
          <View style={styles.microPlanContainer}>
            <Text style={styles.microPlanTitle}>Next Steps:</Text>
            <Text style={styles.microPlanStep}>1. {recommendation.micro_plan.step1}</Text>
            <Text style={styles.microPlanStep}>2. {recommendation.micro_plan.step2}</Text>
            <Text style={styles.microPlanStep}>3. {recommendation.micro_plan.step3}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProgress}
          >
            <Text style={styles.saveButtonText}>{recommendation.button_ctas.save_progress}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.oracleButton,
              recommendation.oracle_preparation.recommended_path === 'shadow' ? styles.shadowButton : styles.expansionButton
            ]}
            onPress={handleNavigateToOracle}
          >
            <Text style={styles.oracleButtonText}>{recommendation.button_ctas.oracle_ready}</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.bg} style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Main render
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderLoadingScreen()}
      </SafeAreaView>
    );
  }

  if (!hasFrequencyMapperData) {
    return (
      <SafeAreaView style={styles.container}>
        {renderNoDataScreen()}
      </SafeAreaView>
    );
  }

  return (
    <QuestTransition transitionKey={route.key}>
      <SafeAreaView style={styles.container}>
        <MicroQuestTracker action="calibration_complete" />
        {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Calibration Tool"
          description="Fine-tune your energetic alignment with your stated desires."
          onDismiss={dismissBanner}
        />
      )}
      <QuestCompletionToast
        questTitle={completedQuestTitle}
        visible={showToast}
        onHide={hideToast}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{getCopy('calibration.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>
        <StepTracker
          currentStep={visualCurrentStep}
          totalSteps={FLOW_STEPS.CALIBRATION}
          stepLabels={STEP_LABELS.CALIBRATION}
        />
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 'intro' && renderIntroScreen()}
          {currentStep === 'sliders' && renderSlidersScreen()}
          {currentStep === 'reflections' && renderReflectionScreen()}
          {currentStep === 'results' && renderResultsScreen()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </QuestTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg, // Updated
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.bg, // Updated
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base1, // Updated
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary, // Updated
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginTop: 8,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginTop: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: theme.colors.accent, // Updated
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  actionButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  introContainer: {
    flex: 1,
  },
  desiredStateCard: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent, // Updated
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeBack: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.accent, // Updated
    marginBottom: 8,
  },
  desiredStateLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 8,
  },
  desiredStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    lineHeight: 28,
    marginBottom: 16,
  },
  journeyPath: {
    backgroundColor: theme.colors.base1, // Updated
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  journeyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  journeyStep: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 4,
  },
  energeticQuality: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
  },
  energyText: {
    fontWeight: '500',
    color: theme.colors.accent, // Updated
  },
  calibrationExplanation: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 16,
  },
  dimensionsList: {
    gap: 12,
  },
  dimensionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  dimensionText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary, // Updated
    lineHeight: 20,
  },
  dimensionLabel: {
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: theme.colors.accent, // Updated
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  continueButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  slidersContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  sliderCard: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  anchorMin: {
    fontSize: 12,
    color: theme.colors.textSecondary, // Updated
    width: 80,
    textAlign: 'left',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  anchorMax: {
    fontSize: 12,
    color: theme.colors.textSecondary, // Updated
    width: 80,
    textAlign: 'right',
  },
  microcopy: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 8,
    lineHeight: 20,
  },
  processingNote: {
    fontSize: 12,
    color: theme.colors.accent, // Updated
    fontStyle: 'italic',
    marginBottom: 12,
  },
  valueDisplay: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.accent, // Updated
  },
  reflectionContainer: {
    flex: 1,
  },
  reflectionCard: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reflectionPrompt: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
    lineHeight: 22,
  },
  reflectionInput: {
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.textPrimary, // Added missing text color
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.bg,
    fontFamily: theme.fonts.body, // Added font family for consistency
    // Add these critical props for React Native 0.79.3 compatibility
    includeFontPadding: false,
  },
  inputWrapper: {
    // Wrapper to help with touch handling
    backgroundColor: 'transparent',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.processingCore, // Updated
  },
  expansionCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.driveMechanics, // Updated
  },
  resultCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 12,
  },
  resultText: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
  },
  pathText: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 16,
  },
  microPlanContainer: {
    backgroundColor: theme.colors.base1, // Updated
    padding: 16,
    borderRadius: 12,
  },
  microPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  microPlanStep: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 4,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.base3, // Updated
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  oracleButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  shadowButton: {
    backgroundColor: theme.colors.processingCore, // Updated
  },
  expansionButton: {
    backgroundColor: theme.colors.driveMechanics, // Updated
  },
  oracleButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalibrationToolScreen;