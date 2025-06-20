/**
 * @file LunarCheckInForm.tsx
 * @description Component for submitting a daily Lunar Check-In.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'; // Removed Button
import { RecordLunarCheckInPayload } from '../../../../services/environmentalAttunementService';
import { theme } from '../../../../constants/theme'; // Import full theme
import StackedButton from '../../../../components/StackedButton'; // Import StackedButton

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
  const [environmentName, setEnvironmentName] = useState('Current Location');
  const [people, setPeople] = useState('');

  // Focus states for input panels
  const [wellbeingFocused, setWellbeingFocused] = useState(false);
  const [clarityFocused, setClarityFocused] = useState(false);
  const [environmentFocused, setEnvironmentFocused] = useState(false);
  const [peopleFocused, setPeopleFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Overall Wellbeing (0-10):</Text>
        <View style={[styles.inputPanel, wellbeingFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.input}
            value={wellbeing}
            onChangeText={setWellbeing}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setWellbeingFocused(true)}
            onBlur={() => setWellbeingFocused(false)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Clarity Level (0-10):</Text>
        <View style={[styles.inputPanel, clarityFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.input}
            value={clarity}
            onChangeText={setClarity}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setClarityFocused(true)}
            onBlur={() => setClarityFocused(false)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Environment:</Text>
        <View style={[styles.inputPanel, environmentFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.input}
            value={environmentName}
            onChangeText={setEnvironmentName}
            placeholder="e.g., Home Office, Park"
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setEnvironmentFocused(true)}
            onBlur={() => setEnvironmentFocused(false)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Key People/Interactions (comma-separated):</Text>
        <View style={[styles.inputPanel, peopleFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.input}
            value={people}
            onChangeText={setPeople}
            placeholder="e.g., Partner, Team Meeting"
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setPeopleFocused(true)}
            onBlur={() => setPeopleFocused(false)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes / Observations:</Text>
        <View style={[styles.inputPanel, notesFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.inputMulti}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3} // This is a suggestion, actual height controlled by minHeight of inputMulti
            placeholder="How are you feeling? What did you notice about your environment or interactions?"
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setNotesFocused(true)}
            onBlur={() => setNotesFocused(false)}
          />
        </View>
      </View>
      <StackedButton text="Log Lunar Check-In" onPress={handleSubmit} type="rect" />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: theme.spacing.xs,
    gap: theme.spacing.md,
  },
  inputGroup: {
    // marginBottom: theme.spacing.sm, // Handled by parent gap
  },
  label: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputPanel: {
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // No direct padding here, TextInput inside will have padding
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 3,
  },
  input: { // For single line TextInput
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm, // Adjusted for typical single line input height
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  inputMulti: { // For multiline TextInput (Notes)
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md, // More padding for multiline
    color: theme.colors.textPrimary,
    fontSize: 15,
    minHeight: 80, // Good default for multiline
    textAlignVertical: 'top',
    // Temporary borders removed
  },
  infoText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  }
});

export default LunarCheckInForm;
