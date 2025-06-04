/**
 * @file CalibrationToolScreen.tsx
 * @description Screen for calibrating user profile settings using the AI Calibration Tool API
 */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import aiCalibrationService, { 
  CalibrationMapResponse,
  SliderPositions,
  FrequencyMapperOutput,
  DynamicUIElements,
  PerceptualMapLabels,
  ProcessingCoreDetails,
  CalibrationRecommendation
} from '../../services/aiCalibrationService';

const MOCK_DESIRED_STATE = "Feel calm and focused at work";

const CalibrationToolScreen: React.FC<{navigation: any}> = ({navigation}) => {
  // Core state
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Slider positions
  const [sliderValues, setSliderValues] = useState<SliderPositions>({
    belief: 0.5,
    openness: 0.5,
    worthiness: 0.5,
  });

  // Response data
  const [dynamicUI, setDynamicUI] = useState<DynamicUIElements | null>(null);
  const [perceptualLabels, setPerceptualLabels] = useState<PerceptualMapLabels | null>(null);
  const [processingCoreDetails, setProcessingCoreDetails] = useState<ProcessingCoreDetails | null>(null);
  const [recommendation, setRecommendation] = useState<CalibrationRecommendation | null>(null);
  
  // Whether calibration has been performed at least once
  const [calibrationPerformed, setCalibrationPerformed] = useState(false);

  // Handles slider changes
  const handleSliderChange = (sliderName: 'belief' | 'openness' | 'worthiness', value: number) => {
    setSliderValues(prev => ({
      ...prev,
      [sliderName]: value,
    }));
  };
  
  // Render a calibration slider with its dynamic UI elements
  const renderSlider = (type: 'belief' | 'openness' | 'worthiness') => {
    // Use the dynamic UI if available, otherwise fallback to defaults
    const sliderUI = dynamicUI ? dynamicUI[`${type}_slider`] : null;
    const label = sliderUI?.label || capitalizeFirst(type);
    const minAnchor = sliderUI?.anchor_min || 'Low';
    const maxAnchor = sliderUI?.anchor_max || 'High';
    const microcopy = sliderUI?.info_microcopy || '';
    const qualitativeLabel = perceptualLabels ? perceptualLabels[type] : '';

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabelRow}>
          <Text style={styles.sliderLabel}>{label}</Text>
          {qualitativeLabel && (
            <Text style={styles.qualitativeLabel}>{qualitativeLabel}</Text>
          )}
        </View>
        
        <View style={styles.sliderWithAnchors}>
          <Text style={styles.anchorText}>{minAnchor}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={sliderValues[type]}
            onValueChange={(value) => handleSliderChange(type, value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#007AFF"
          />
          <Text style={styles.anchorText}>{maxAnchor}</Text>
        </View>
        
        {microcopy && (
          <Text style={styles.microcopyText}>{microcopy}</Text>
        )}
      </View>
    );
  };

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Process calibration against the API
  const handleStartCalibration = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    
    try {
      // In a real implementation, this would come from the FrequencyMapper tool
      // For now, we'll use a mock desired state
      const frequencyMapperOutput: FrequencyMapperOutput = {
        desired_state: MOCK_DESIRED_STATE,
      };
      
      // Call the calibration API
      const response = await aiCalibrationService.processCalibrationMap(
        frequencyMapperOutput,
        sliderValues
      );
      
      // Update state with response data
      setDynamicUI(response.dynamic_ui_elements);
      setPerceptualLabels(response.perceptual_map_labels);
      setProcessingCoreDetails(response.processing_core_details_applied);
      setRecommendation(response.calibration_recommendation || null);
      
      setCalibrationPerformed(true);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      Alert.alert('Calibration Error', 'Failed to process calibration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Calibration Tool</Text>
          <Text style={styles.subtitle}>
            Fine-tune your perceptual state for accurate manifestation
          </Text>
        </View>

        <View style={styles.content}>
          {/* Slider Section - moved outside JSX */}
          <View style={styles.slidersSection}>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Current Desired State</Text>
              <Text style={styles.desiredStateText}>
                {MOCK_DESIRED_STATE}
              </Text>
              <Text style={styles.cardText}>
                Adjust the sliders below to reflect your current perceptual state regarding this
                desired outcome. This helps the system calibrate personalized recommendations.
              </Text>
            </View>
            
            {/* Sliders - moved outside JSX */}
            {renderSlider('belief')}
            {renderSlider('openness')}
            {renderSlider('worthiness')}
            
            {/* Calibration Button - moved outside JSX */}
            <TouchableOpacity
              style={[styles.calibrateButton, isLoading && styles.buttonDisabled]}
              onPress={handleStartCalibration}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : 'Process Calibration'}
              </Text>
              {isLoading && (
                <ActivityIndicator size="small" color="#ffffff" style={styles.buttonLoader} />
              )}
            </TouchableOpacity>
          </View>

          {/* Results Section - moved outside JSX */}
          {calibrationPerformed && !isLoading && (
            <View style={styles.resultsSection}>
              {/* Processing Core Details - moved outside JSX */}
              {processingCoreDetails && (
                <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>Your Processing Core</Text>
                  <Text style={styles.cardText}>{processingCoreDetails.summary_text}</Text>
                  
                  {/* Key Details - moved outside JSX */}
                  {Object.entries(processingCoreDetails.details).length > 0 && (
                    <View style={styles.detailsContainer}>
                      {Object.entries(processingCoreDetails.details).map(([key, value]) => (
                        value && (
                          <View key={key} style={styles.detailRow}>
                            <Text style={styles.detailLabel}>{key.replace(/_/g, ' ')}:</Text>
                            <Text style={styles.detailValue}>{value}</Text>
                          </View>
                        )
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Recommendation - moved outside JSX */}
              {recommendation && (
                <View style={[
                  styles.infoCard, 
                  recommendation.path_suggestion === 'shadow' ? styles.shadowCard :
                  recommendation.path_suggestion === 'expansion' ? styles.expansionCard :
                  styles.neutralCard
                ]}>
                  <Text style={styles.cardTitle}>Your Calibration Path</Text>
                  <Text style={styles.cardText}>{recommendation.recommendation_text}</Text>
                  
                  {/* Action Buttons - moved outside JSX */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={[
                        styles.actionButton,
                        recommendation.path_suggestion === 'shadow' ? styles.shadowButton : styles.expansionButton
                      ]}
                      onPress={() => Alert.alert('Action Selected', 'This would navigate to the selected action path.')}
                    >
                      <Text style={styles.actionButtonText}>
                        {recommendation.button_texts.shadow_quest}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        recommendation.path_suggestion === 'expansion' ? styles.expansionButton : styles.neutralButton
                      ]}
                      onPress={() => Alert.alert('Action Selected', 'This would navigate to the selected action path.')}
                    >
                      <Text style={styles.actionButtonText}>
                        {recommendation.button_texts.expansion_path}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Error Message - moved outside JSX */}
          {isError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Calibration Error</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleStartCalibration}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  slidersSection: {
    marginBottom: 24,
  },
  resultsSection: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#7952b3',
  },
  expansionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  neutralCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  desiredStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 12,
  },
  sliderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  qualitativeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    fontStyle: 'italic',
  },
  sliderWithAnchors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  anchorText: {
    fontSize: 12,
    color: '#666',
    width: 70,
    textAlign: 'center',
  },
  microcopyText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  calibrateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLoader: {
    marginLeft: 10,
  },
  detailsContainer: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 120,
    color: '#444',
    textTransform: 'capitalize',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shadowButton: {
    backgroundColor: '#7952b3',
  },
  expansionButton: {
    backgroundColor: '#28a745',
  },
  neutralButton: {
    backgroundColor: '#17a2b8',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CalibrationToolScreen;
