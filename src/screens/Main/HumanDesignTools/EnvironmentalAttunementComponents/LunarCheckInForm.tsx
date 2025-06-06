/**
 * @file LunarCheckInForm.tsx
 * @description Component for submitting a daily Lunar Check-In.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RecordLunarCheckInPayload } from '../../../../services/environmentalAttunementService'; // Adjusted path

// Helper to get current lunar day (very simplified mock - should match screen's or be passed)
const getMockLunarDay = () => {
  const dayOfMonth = new Date().getDate();
  return (dayOfMonth % 28) + 1;
};

export interface LunarCheckInFormProps {
  onSubmit: (payload: RecordLunarCheckInPayload) => Promise<void>;
  currentLunarDay: number; // Pass this in for display and accuracy
}

const LunarCheckInForm: React.FC<LunarCheckInFormProps> = ({ onSubmit, currentLunarDay }) => {
  const [wellbeing, setWellbeing] = useState('7');
  const [clarity, setClarity] = useState('7');
  const [notes, setNotes] = useState('');
  const [environmentName, setEnvironmentName] = useState('Current Location'); // Simple input for now
  const [people, setPeople] = useState(''); // Simple comma-separated string for now

  const handleSubmit = async () => {
    const wellbeingScore = parseInt(wellbeing, 10);
    const clarityScore = parseInt(clarity, 10);

    if (isNaN(wellbeingScore) || isNaN(clarityScore) || wellbeingScore < 0 || wellbeingScore > 10 || clarityScore < 0 || clarityScore > 10) {
      Alert.alert("Invalid Input", "Please enter scores for wellbeing and clarity between 0 and 10.");
      return;
    }

    const payload: RecordLunarCheckInPayload = {
      lunarDay: currentLunarDay,
      wellbeing: {
        overall: wellbeingScore,
        // In a real form, these could be separate inputs:
        physical: wellbeingScore,
        emotional: wellbeingScore,
        mental: wellbeingScore,
        social: wellbeingScore
      },
      clarity: {
        level: clarityScore,
        areas: notes ? [notes.substring(0, 30)] : ["general observation"], // Example: take first 30 chars of notes as an area
        insights: notes ? [notes] : ["general feeling day " + currentLunarDay]
      },
      environment: {
        name: environmentName || "Unspecified Environment",
        type: "mixed", // Could be a picker
        attributes: ["general"], // Could be tags input
        duration: 2, // Example, could be input
        impact: 0 // Example, could be input or slider
      },
      relationships: {
        people: people.split(',').map(p=>p.trim()).filter(p => p.length > 0),
        impact: 0 // Example
      },
      significant: notes.length > 50 || Math.abs(wellbeingScore - 5) > 2 || Math.abs(clarityScore - 5) > 2, // Example significance logic
      notes: notes,
    };

    await onSubmit(payload);
    // Optionally clear form if onSubmit in parent doesn't handle unmounting/resetting state
    // setWellbeing('7');
    // setClarity('7');
    // setNotes('');
    // setEnvironmentName('Current Location');
    // setPeople('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.infoText}>Lunar Day: {currentLunarDay}</Text>

      <Text style={styles.label}>Overall Wellbeing (0-10):</Text>
      <TextInput style={styles.input} value={wellbeing} onChangeText={setWellbeing} keyboardType="number-pad" maxLength={2}/>

      <Text style={styles.label}>Clarity Level (0-10):</Text>
      <TextInput style={styles.input} value={clarity} onChangeText={setClarity} keyboardType="number-pad" maxLength={2}/>

      <Text style={styles.label}>Primary Environment:</Text>
      <TextInput style={styles.input} value={environmentName} onChangeText={setEnvironmentName} placeholder="e.g., Home Office, Park"/>

      <Text style={styles.label}>Key People/Interactions (comma-separated):</Text>
      <TextInput style={styles.input} value={people} onChangeText={setPeople} placeholder="e.g., Partner, Team Meeting"/>

      <Text style={styles.label}>Notes / Observations:</Text>
      <TextInput
        style={styles.inputMulti}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        placeholder="How are you feeling? What did you notice about your environment or interactions?"
      />
      <Button title="Log Lunar Check-In" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
  },
  label: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#cbd5e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 8,
    color: '#2d3748',
  },
  inputMulti: {
    backgroundColor: '#fff',
    borderColor: '#cbd5e0',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    color: '#2d3748',
  },
  infoText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  }
});

export default LunarCheckInForm;
