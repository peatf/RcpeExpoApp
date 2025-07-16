/**
 * @file CompatibleTextInput.tsx
 * @description TextInput component with React Native 0.79.3 + React 19 compatibility fixes
 */
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, Platform } from 'react-native';

interface CompatibleTextInputProps extends TextInputProps {
  // Additional props for compatibility
}

const CompatibleTextInput = forwardRef<TextInput, CompatibleTextInputProps>((props, ref) => {
  // Default props for React Native 0.79.3 + React 19 compatibility
  const compatibilityProps = {
    allowFontScaling: false,
    underlineColorAndroid: 'transparent',
    importantForAutofill: (props.autoComplete ? 'yes' : 'no') as 'yes' | 'no',
    // Fix font padding issues on Android
    includeFontPadding: false,
    // Ensure proper text alignment
    textAlignVertical: (props.multiline ? 'top' : 'center') as 'top' | 'center',
    // Improved focus handling
    blurOnSubmit: props.multiline ? false : true,
    // Better keyboard handling
    keyboardShouldPersistTaps: 'handled',
    ...props, // User props override defaults
  };

  return (
    <TextInput
      ref={ref}
      {...compatibilityProps}
    />
  );
});

CompatibleTextInput.displayName = 'CompatibleTextInput';

export default CompatibleTextInput;
