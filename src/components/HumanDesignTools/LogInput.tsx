/**
 * @file LogInput.tsx
 * @description A text input component specifically for logging experiences.
 */
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard } from 'react-native';

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
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Log</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 60, // For multiline input
    textAlignVertical: 'top', // Align text to top for multiline
    marginBottom: 12,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007bff', // A common primary blue
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogInput;
