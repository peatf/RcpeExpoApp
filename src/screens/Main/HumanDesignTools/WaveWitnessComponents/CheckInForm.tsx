/**
 * @file CheckInForm.tsx
 * @description Component for submitting an energy check-in.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthorityType } from '../../../../types/humanDesignTools'; // Adjusted path
import { RecordCheckInPayload } from '../../../../services/waveWitnessService'; // Adjusted path

/**
 * @interface CheckInFormProps
 * @description Props for the CheckInForm component.
 * @property {(payload: RecordCheckInPayload) => Promise<void>} onSubmit - Callback when the form is submitted.
 * @property {AuthorityType} userAuthority - The user's authority type for context.
 */
export interface CheckInFormProps {
  onSubmit: (payload: RecordCheckInPayload) => Promise<void>;
  userAuthority: AuthorityType; // To provide context for authorityData
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit, userAuthority }) => {
  const [energyLevel, setEnergyLevel] = useState<string>('5');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = async () => {
    const level = parseInt(energyLevel, 10);
    if (isNaN(level) || level < 1 || level > 10) {
      Alert.alert("Invalid Input", "Please enter a valid energy level (1-10).");
      return;
    }

    const payload: RecordCheckInPayload = {
      timestamp: new Date().toISOString(),
      checkInType: "manual_form", // Differentiate from potentially other check-in methods
      authorityData: { type: userAuthority.toString(), notes: "Form submission" }, // Example, can be more detailed
      energyLevel: level,
      contextData: { notes: notes || undefined }, // Only include notes if present
    };

    await onSubmit(payload);
    // Optionally clear form if onSubmit doesn't handle unmounting/resetting
    // setEnergyLevel('5');
    // setNotes('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Current Energy Level (1-10):</Text>
      <TextInput
        style={styles.input}
        value={energyLevel}
        onChangeText={setEnergyLevel}
        keyboardType="number-pad"
        maxLength={2}
        placeholder="5"
      />
      <Text style={styles.label}>Notes (optional):</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Any context, feelings, or specific authority sensations?"
        multiline
        numberOfLines={3}
      />
      <Button title="Submit Check-In" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 10, // Reduced padding as it's inside an InfoCard
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top', // For multiline
  },
});

export default CheckInForm;
