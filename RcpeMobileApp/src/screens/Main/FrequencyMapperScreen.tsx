import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input, Card, Slider } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For button icons
import apiClient from '../../services/api'; // Adjust path as needed

// Define the shape of the data collected in the wizard
interface FrequencyMapData {
  step1Field: string;
  step2SliderValue: number;
  step3Notes: string;
}

const TOTAL_STEPS = 3;

const FrequencyMapperScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FrequencyMapData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof FrequencyMapData, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      // Add validation logic here if needed for the current step
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (currentStep === TOTAL_STEPS) {
      // Add final validation
      if (!formData.step1Field || !formData.step3Notes) {
        Alert.alert('Missing Information', 'Please fill out all required fields.');
        return;
      }

      setIsLoading(true);
      try {
        // Assuming default value for slider if not touched
        const completeFormData: FrequencyMapData = {
          step1Field: formData.step1Field || '',
          step2SliderValue: formData.step2SliderValue === undefined ? 50 : formData.step2SliderValue,
          step3Notes: formData.step3Notes || '',
        };
        console.log('Submitting Frequency Map:', completeFormData);
        // Replace with your actual API call
        const response = await apiClient.post('/ai/frequency-map', completeFormData);
        console.log('API Response:', response.data);
        Alert.alert('Success', 'Frequency Map submitted successfully!');
        // Reset form or navigate away
        setCurrentStep(1);
        setFormData({});
      } catch (error: any) {
        console.error('API Submission Error:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to submit Frequency Map. ' + (error.response?.data?.message || 'Please try again.'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card.Divider>
            <Text style={styles.stepTitle}>Step 1: Basic Information</Text>
            <Input
              placeholder="Enter details for step 1"
              value={formData.step1Field || ''}
              onChangeText={text => handleInputChange('step1Field', text)}
              label="Primary Focus"
              containerStyle={styles.inputContainer}
            />
            {/* Add more fields for step 1 as needed */}
          </Card.Divider>
        );
      case 2:
        return (
          <Card.Divider>
            <Text style={styles.stepTitle}>Step 2: Intensity Scale</Text>
            <Text style={styles.sliderLabel}>Select Intensity: {formData.step2SliderValue === undefined ? 50 : formData.step2SliderValue}</Text>
            <Slider
              value={formData.step2SliderValue === undefined ? 50 : formData.step2SliderValue}
              onValueChange={value => handleInputChange('step2SliderValue', value)}
              minimumValue={0}
              maximumValue={100}
              step={1}
              thumbStyle={{ height: 20, width: 20, backgroundColor: 'tomato' }}
              trackStyle={{ height: 10, borderRadius: 5 }}
              containerStyle={styles.sliderContainer}
            />
            {/* Add more fields for step 2 as needed */}
          </Card.Divider>
        );
      case 3:
        return (
          <Card.Divider>
            <Text style={styles.stepTitle}>Step 3: Additional Notes</Text>
            <Input
              placeholder="Enter any additional notes or observations"
              value={formData.step3Notes || ''}
              onChangeText={text => handleInputChange('step3Notes', text)}
              label="Notes"
              multiline
              numberOfLines={4}
              containerStyle={styles.inputContainer}
            />
            {/* Add more fields for step 3 as needed */}
          </Card.Divider>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Frequency Mapper (Step {currentStep} of {TOTAL_STEPS})</Card.Title>
        {renderStepContent()}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              onPress={prevStep}
              // icon={<Icon name="arrow-left" size={15} color="white" />}
              buttonStyle={[styles.button, styles.prevButton]}
              containerStyle={styles.buttonWrapper}
            />
          )}
          {currentStep < TOTAL_STEPS ? (
            <Button
              title="Next"
              onPress={nextStep}
              // icon={<Icon name="arrow-right" size={15} color="white" />}
              // iconRight
              buttonStyle={[styles.button, styles.nextButton]}
              containerStyle={styles.buttonWrapper}
            />
          ) : (
            <Button
              title="Submit Frequency Map"
              onPress={handleSubmit}
              loading={isLoading}
              // icon={<Icon name="check" size={15} color="white" />}
              buttonStyle={[styles.button, styles.submitButton]}
              containerStyle={styles.buttonWrapper}
            />
          )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 10,
  },
  sliderContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  sliderLabel: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Or 'space-between'
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    flex: 1, // Each button takes equal space
    marginHorizontal: 5, // Add some space between buttons
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  prevButton: {
    backgroundColor: 'gray',
  },
  nextButton: {
    backgroundColor: 'dodgerblue',
  },
  submitButton: {
    backgroundColor: 'green',
  },
});

export default FrequencyMapperScreen;
