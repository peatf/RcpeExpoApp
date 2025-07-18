/**
 * @file SignUpScreen.tsx
 * @description Sign up screen for new user registration
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useNarrativeCopy } from '../../hooks/useNarrativeCopy';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, spacing, typography, shadows, borderRadius, fonts } from '../../constants/theme'; // Import individual theme constants

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
  const { getCopy } = useNarrativeCopy();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  // Focus states for input panels
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  // Refs for TextInput components
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { signUp } = useAuth();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!formData.password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        enabled={true}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>{getCopy('auth.signUp.title')}</Text>
            <Text style={styles.subtitle}>
              {getCopy('auth.signUp.subtitle')}
            </Text>

            <View style={styles.form}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputPanel, nameFocused && styles.inputPanelFocused]}>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => updateFormData('name', value)}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    editable={!loading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputPanel, emailFocused && styles.inputPanelFocused]}>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    editable={!loading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputPanel, passwordFocused && styles.inputPanelFocused]}>
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    editable={!loading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputPanel, confirmPasswordFocused && styles.inputPanelFocused]}>
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                    returnKeyType="done"
                    editable={!loading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    onSubmitEditing={handleSignUp}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Embarking...' : getCopy('auth.signUp.button')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{getCopy('auth.signUp.footer')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg, // Use theme background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: { // For ScrollView
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: { // Inner content View
    // flex: 1, // Not needed if ScrollView's contentContainerStyle handles flexGrow
    justifyContent: 'center',
    paddingHorizontal: spacing.lg, // Use theme spacing
    paddingVertical: spacing.xl, // More vertical padding for scrollable content
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
  form: {
    width: '100%', // Ensure form takes full width
    marginBottom: spacing.lg, // Space before footer
  },
  inputGroup: { // Replaces inputContainer
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: typography.labelSmall.fontSize,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputPanel: {
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 44, // Ensure adequate touch target
    justifyContent: 'center', // Center the TextInput vertically
    // Prevent touch interference
    pointerEvents: 'box-none',
  },
  inputPanelFocused: {
    borderColor: colors.accent,
    ...shadows.small, // Consistent with LoginScreen and theme
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    minHeight: 44, // Ensure adequate touch target
    borderWidth: 0, // Remove any default border
    // Add these critical props for React Native 0.79.3 compatibility
    includeFontPadding: false,
    textAlignVertical: 'center',
    // Ensure input receives touches
    zIndex: 1,
    position: 'relative',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md, // Space above button
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.base3,
  },
  buttonText: {
    fontFamily: fonts.display,
    color: colors.bg,
    fontSize: typography.headingMedium.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 95, 247, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg, // Consistent spacing
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  footerLink: {
    fontFamily: fonts.body,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.accent,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
