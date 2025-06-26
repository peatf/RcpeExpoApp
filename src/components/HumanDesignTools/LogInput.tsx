/**
 * @file LogInput.tsx
 * @description A text input component specifically for logging experiences.
 */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import StackedButton from '../StackedButton';
import { theme } from '../../constants/theme'; // Import full theme

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
  const [isFocused, setIsFocused] = useState(false); // For focus state

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText(''); // Clear input after submission
      Keyboard.dismiss(); // Dismiss keyboard
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputPanel, isFocused && styles.inputPanelFocused]}>
        {/* No explicit .input-panel-label here, placeholder serves that role */}
        <TextInput
          style={styles.formElement}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary} // Use theme
          multiline
          // numberOfLines={3} // minHeight on inputPanel and flex on formElement manage height
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      <StackedButton
        shape="rectangle" // Changed from type="rect"
        text="LOG ENTRY"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md, // Use theme
  },
  inputPanel: { // Styles for .input-panel
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm, // 8px
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // position: 'relative', // Not needed if no absolute label inside
    minHeight: 120, // Or adjust based on typical content, HTML h-48 is 192px
    padding: 0, // Padding will be on the TextInput itself
    // marginBottom: theme.spacing.lg, // Handled by parent gap if any
  },
  inputPanelFocused: { // Focus state styling
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 5,
  },
  formElement: { // Styles for .form-element (TextInput)
    flex: 1, // To fill the panel height
    backgroundColor: 'transparent',
    padding: theme.spacing.md, // 16px
    color: theme.colors.textPrimary,
    fontSize: 15, // From HTML ref
    lineHeight: 22.5, // 1.5 * 15px
    textAlignVertical: 'top',
    // minHeight: 60, // Ensure a minimum touch area and visible lines
  },
});

export default LogInput;
