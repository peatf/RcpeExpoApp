/**
 * @file TextInputTest.tsx
 * @description Simple test component to verify TextInput functionality
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fonts, borderRadius } from '../constants/theme';

const TextInputTest: React.FC = () => {
  const [testValue, setTestValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleTest = () => {
    Alert.alert(
      'TextInput Test', 
      `Value: "${testValue}"\nLength: ${testValue.length}\nFocused: ${focused}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TextInput Compatibility Test</Text>
      <Text style={styles.subtitle}>React Native 0.79.3 + React 19</Text>
      
      <View style={styles.testSection}>
        <Text style={styles.label}>Test Input:</Text>
        <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.textInput}
            value={testValue}
            onChangeText={setTestValue}
            placeholder="Type here to test..."
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            // React Native 0.79.3 + React 19 compatibility props
            allowFontScaling={false}
            underlineColorAndroid="transparent"
            importantForAutofill="no"
            textAlignVertical="center"
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            selectTextOnFocus={true}
          />
        </View>
        
        <TouchableOpacity style={styles.testButton} onPress={handleTest}>
          <Text style={styles.testButtonText}>Test Value</Text>
        </TouchableOpacity>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: {testValue.length > 0 ? '✅ Working' : '⏳ Waiting for input'}
          </Text>
          <Text style={styles.statusText}>
            Focus: {focused ? '🎯 Focused' : '😴 Not focused'}
          </Text>
          <Text style={styles.statusText}>
            Value: "{testValue}"
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: typography.displayMedium.fontSize,
    fontWeight: typography.displayMedium.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  testSection: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: typography.labelMedium.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 44,
    marginBottom: spacing.md,
  },
  inputContainerFocused: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(0, 95, 247, 0.05)',
  },
  textInput: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 44,
  },
  testButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  testButtonText: {
    fontFamily: fonts.mono,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.bg,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: typography.bodySmall.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default TextInputTest;
