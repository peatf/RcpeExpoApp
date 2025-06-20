/**
 * @file CheckInForm.tsx
 * @description Component for submitting an energy check-in.
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'; // Removed Button
import Slider from '@react-native-community/slider'; // Import Slider
import { AuthorityType } from '../../../../types/humanDesignTools';
import { RecordCheckInPayload } from '../../../../services/waveWitnessService';
import { theme } from '../../../../constants/theme'; // Import theme
import StackedButton from '../../../../components/StackedButton'; // Import StackedButton

/**
 * @interface CheckInFormProps
 * @description Props for the CheckInForm component.
 * @property {(payload: RecordCheckInPayload) => Promise<void>} onSubmit - Callback when the form is submitted.
 * @property {AuthorityType} userAuthority - The user's authority type for context.
 */
export interface CheckInFormProps {
  onSubmit: (payload: RecordCheckInPayload) => Promise<void>;
  userAuthority: AuthorityType;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit, userAuthority }) => {
  const [energyLevel, setEnergyLevel] = useState<number>(5); // Changed to number for Slider
  const [notes, setNotes] = useState<string>('');
  const [notesFocused, setNotesFocused] = useState(false); // Focus state for notes

  const handleSubmit = async () => {
    // energyLevel is already a number from the Slider
    if (energyLevel < 1 || energyLevel > 10) { // Should not happen with slider but good check
      Alert.alert("Invalid Input", "Energy level is out of range.");
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
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current Energy Level: {energyLevel}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={energyLevel}
          onValueChange={setEnergyLevel}
          minimumTrackTintColor={theme.colors.accent}
          maximumTrackTintColor={theme.colors.base3}
          thumbTintColor={theme.colors.accent}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (optional):</Text>
        <View style={[styles.inputPanel, notesFocused && styles.inputPanelFocused]}>
          <TextInput
            style={styles.textInputMulti}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any context, feelings, or specific authority sensations?"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            onFocus={() => setNotesFocused(true)}
            onBlur={() => setNotesFocused(false)}
          />
        </View>
      </View>
      <StackedButton text="Submit Check-In" onPress={handleSubmit} type="rect" />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    // padding: theme.spacing.xs, // InfoCard already provides padding
    gap: theme.spacing.md,
  },
  inputGroup: {
    // marginBottom: theme.spacing.md, // Handled by parent gap
  },
  label: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize, // Slightly larger for slider label
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm, // More space for slider
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40, // Standard slider height
  },
  inputPanel: { // For Notes TextInput
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80, // For multiline notes
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 3,
  },
  textInputMulti: { // For Notes
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 15,
    flex: 1, // Take up available height in inputPanel
    textAlignVertical: 'top',
  },
});

export default CheckInForm;
