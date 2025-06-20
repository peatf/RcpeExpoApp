/**
 * @file SignUpScreen.tsx
 * @description Sign up screen for new user registration
 */
import React, { useState } from 'react';
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
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { theme } from '../../constants/theme'; // Import theme

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Reality Creation Profile Engine
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
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
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
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
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
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
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
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
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
    backgroundColor: theme.colors.bg, // Use theme background
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
    paddingHorizontal: theme.spacing.lg, // Use theme spacing
    paddingVertical: theme.spacing.xl, // More vertical padding for scrollable content
  },
  title: {
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: theme.typography.displayMedium.fontWeight,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%', // Ensure form takes full width
    marginBottom: theme.spacing.lg, // Space before footer
  },
  inputGroup: { // Replaces inputContainer
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  inputPanel: {
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 3,
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md, // Space above button
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.base3,
  },
  buttonText: {
    fontFamily: theme.fonts.display,
    color: theme.colors.bg,
    fontSize: theme.typography.headingMedium.fontSize,
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
    marginTop: theme.spacing.lg, // Consistent spacing
  },
  footerText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  footerLink: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
