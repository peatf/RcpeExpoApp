/**
 * @file LogInput.tsx
 * @description A text input component specifically for logging experiences.
 */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import StackedButton from '../StackedButton';
import { colors, typography, spacing } from '../../constants/theme';

/**
 * @interface LogInputProps
 * @description Props for the LogInput component.
 * @property {(text: string) => void} onSubmit - Callback function when the log is submitted.
 * @property {string} [placeholder] - Optional placeholder text for the input.
 */
export interface LogInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

/**
 * LogInput component.
 *
 * @param {LogInputProps} props - The props for the component.
 * @returns {JSX.Element} An input field and a submit button for logging.
 */
const LogInput: React.FC<LogInputProps> = ({ onSubmit, placeholder = "What's on your mind?" }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText(''); // Clear input after submission
      Keyboard.dismiss(); // Dismiss keyboard
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputPanel}>
        <TextInput
          style={styles.formElement}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
      <StackedButton
        type="rect"
        text="LOG ENTRY"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  inputPanel: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    minHeight: 80,
  },
  formElement: {
    width: '100%',
    backgroundColor: 'transparent',
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default LogInput;
