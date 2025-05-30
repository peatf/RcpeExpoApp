import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Slider, Button, Card, Icon } from 'react-native-elements';
import apiClient from '../../services/api'; // Adjust path as needed

// Define the shape of the calibration data
interface CalibrationData {
  focusIntensity: number;
  clarityLevel: number;
  energyProjection: number;
}

const CalibrationToolScreen = () => {
  const [calibrationValues, setCalibrationValues] = useState<CalibrationData>({
    focusIntensity: 50, // Default value (0-100)
    clarityLevel: 50,   // Default value (0-100)
    energyProjection: 50 // Default value (0-100)
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (name: keyof CalibrationData, value: number) => {
    setCalibrationValues(prev => ({ ...prev, [name]: Math.round(value) })); // Ensure whole numbers if needed
  };

  const handleSubmitCalibration = async () => {
    setIsLoading(true);
    try {
      console.log('Submitting Calibration Data:', calibrationValues);
      // Replace with your actual API call
      const response = await apiClient.post('/ai/calibration-map', calibrationValues);
      console.log('API Response:', response.data);
      Alert.alert('Success', 'Calibration Map submitted successfully!');
      // Optionally reset sliders or give other feedback
    } catch (error: any) {
      console.error('API Submission Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit Calibration Map. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Energy Calibration Tool</Card.Title>
        <Card.Divider />

        {/* Focus Intensity Slider */}
        <Text style={styles.sliderLabel}>Focus Intensity: {calibrationValues.focusIntensity}</Text>
        <Slider
          value={calibrationValues.focusIntensity}
          onValueChange={value => handleSliderChange('focusIntensity', value)}
          minimumValue={0}
          maximumValue={100}
          step={1}
          thumbTintColor='tomato'
          minimumTrackTintColor='tomato'
          maximumTrackTintColor='#b0b0b0'
          thumbStyle={styles.thumbStyle}
          trackStyle={styles.trackStyle}
          style={styles.slider}
        />

        {/* Clarity Level Slider */}
        <Text style={styles.sliderLabel}>Clarity Level: {calibrationValues.clarityLevel}</Text>
        <Slider
          value={calibrationValues.clarityLevel}
          onValueChange={value => handleSliderChange('clarityLevel', value)}
          minimumValue={0}
          maximumValue={100}
          step={1}
          thumbTintColor='deepskyblue'
          minimumTrackTintColor='deepskyblue'
          maximumTrackTintColor='#b0b0b0'
          thumbStyle={styles.thumbStyle}
          trackStyle={styles.trackStyle}
          style={styles.slider}
        />

        {/* Energy Projection Slider */}
        <Text style={styles.sliderLabel}>Energy Projection: {calibrationValues.energyProjection}</Text>
        <Slider
          value={calibrationValues.energyProjection}
          onValueChange={value => handleSliderChange('energyProjection', value)}
          minimumValue={0}
          maximumValue={100}
          step={1}
          thumbTintColor='limegreen'
          minimumTrackTintColor='limegreen'
          maximumTrackTintColor='#b0b0b0'
          thumbStyle={styles.thumbStyle}
          trackStyle={styles.trackStyle}
          style={styles.slider}
        />

        <Button
          title="Submit Calibration"
          onPress={handleSubmitCalibration}
          loading={isLoading}
          icon={<Icon name="send" type="material-community" color="white" containerStyle={styles.buttonIconContainer}/>}
          buttonStyle={styles.submitButton}
          containerStyle={styles.buttonContainer}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10, // Align with slider
  },
  slider: {
    marginHorizontal: 10,
  },
  thumbStyle: {
    height: 24,
    width: 24,
    // Add shadow or other styling for native feel if desired
  },
  trackStyle: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#2089dc', // react-native-elements primary blue
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonIconContainer: {
    marginRight: 10,
  }
});

export default CalibrationToolScreen;
