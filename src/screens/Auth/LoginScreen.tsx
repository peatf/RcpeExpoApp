/**
 * @file LoginScreen.tsx
 * @description Login screen for user authentication
 */
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useNarrativeCopy } from '../../hooks/useNarrativeCopy';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, spacing, typography, shadows, borderRadius, fonts } from '../../constants/theme'; // Import individual theme constants

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { getCopy } = useNarrativeCopy();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false); // Focus state for email
  const [passwordFocused, setPasswordFocused] = useState(false); // Focus state for password
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  
  // Refs for manual focus control
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  
  // Focus lock to prevent rapid focus/blur cycling
  const emailFocusLock = useRef(false);
  const passwordFocusLock = useRef(false);

  const handleLogin = async () => {
    // Input validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password.');
      return;
    }
    
    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Login logic with loading state
    setIsLoading(true);
    try {
      // Simulate API request with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await login({ email, password });
      
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Invalid email or password. Please try again.');
      }
      
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        enabled={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{getCopy('auth.login.title')}</Text>
          <Text style={styles.subtitle}>{getCopy('auth.login.subtitle')}</Text>
          
          <View style={styles.panel}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TouchableOpacity 
                  style={[styles.inputPanel, emailFocused && styles.inputPanelFocused]}
                  activeOpacity={1}
                  onPress={() => {
                    emailRef.current?.focus();
                  }}
                >
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    editable={!isLoading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => {
                      emailFocusLock.current = true;
                      setEmailFocused(true);
                      // Prevent immediate blur for 500ms
                      setTimeout(() => {
                        emailFocusLock.current = false;
                      }, 500);
                    }}
                    onBlur={() => {
                      // Only blur if not locked
                      if (!emailFocusLock.current) {
                        setEmailFocused(false);
                      } else {
                        setTimeout(() => emailRef.current?.focus(), 10);
                      }
                    }}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    // Additional focus retention props
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity 
                  style={[styles.inputPanel, passwordFocused && styles.inputPanelFocused]}
                  activeOpacity={1}
                  onPress={() => {
                    passwordRef.current?.focus();
                  }}
                >
                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    editable={!isLoading}
                    selectTextOnFocus={false}
                    clearButtonMode="never"
                    onFocus={() => {
                      passwordFocusLock.current = true;
                      setPasswordFocused(true);
                      // Prevent immediate blur for 500ms
                      setTimeout(() => {
                        passwordFocusLock.current = false;
                      }, 500);
                    }}
                    onBlur={() => {
                      // Only blur if not locked
                      if (!passwordFocusLock.current) {
                        setPasswordFocused(false);
                      } else {
                        setTimeout(() => passwordRef.current?.focus(), 10);
                      }
                    }}
                    onSubmitEditing={handleLogin}
                    // Critical props for React Native 0.79.3 + React 19 compatibility
                    allowFontScaling={false}
                    underlineColorAndroid="transparent"
                    importantForAutofill="yes"
                    // Additional focus retention props
                    contextMenuHidden={false}
                    spellCheck={false}
                    autoFocus={false}
                  />
                </TouchableOpacity>
              </View>
              
              {/* Forgot Password Link */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Password Reset', 'Password reset functionality is not implemented yet.')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              
              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Resuming...' : getCopy('auth.login.button')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>{getCopy('auth.login.footer')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
    width: '100%',
  },
  inputGroup: {
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
  },
  inputPanelFocused: {
    borderColor: colors.accent,
    ...shadows.small,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    color: colors.textPrimary,
    fontSize: 16,
    minHeight: 44, // Ensure adequate touch target
    backgroundColor: 'transparent',
    borderWidth: 0, // Remove any default border
    // Add these critical props for React Native 0.79.3 compatibility
    includeFontPadding: false,
    textAlignVertical: 'center',
    // Ensure input receives touches
    zIndex: 1,
    position: 'relative',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontFamily: fonts.mono,
    fontSize: typography.labelMedium.fontSize,
    color: colors.accent,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    ...shadows.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginVertical: 16,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 0,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.mono,
    fontSize: 16,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signupText: {
    color: colors.textSecondary,
    marginRight: spacing.xs,
    fontFamily: fonts.body,
  },
  signupLink: {
    color: colors.accent,
    fontWeight: '600',
    fontFamily: fonts.body,
  },
});

export default LoginScreen;
