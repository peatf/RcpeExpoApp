/**
 * @file LoginScreen.tsx
 * @description Login screen for user authentication
 */
import React, {useState} from 'react';
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
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { theme } from '../../constants/theme'; // Import theme

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false); // Focus state for email
  const [passwordFocused, setPasswordFocused] = useState(false); // Focus state for password
  
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({email: email.trim(), password});
      
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
      // If successful, navigation will be handled by auth state change
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>RCPE Mobile</Text>
          <Text style={styles.subtitle}>Reality Creation Profile Engine</Text>
          
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputPanel, emailFocused && styles.inputPanelFocused]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg, // Use theme spacing
  },
  title: {
    fontFamily: theme.fonts.display, // Or system prominent if display is too much
    fontSize: theme.typography.displayMedium.fontSize, // Adjusted from displayLarge
    fontWeight: theme.typography.displayMedium.fontWeight, // Use themed weight
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm, // Adjusted spacing
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize, // Adjusted from labelLarge
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl, // Increased spacing before form
  },
  form: {
    width: '100%',
  },
  inputGroup: { // Replaces inputContainer
    marginBottom: theme.spacing.lg, // Consistent spacing
  },
  label: {
    fontFamily: theme.fonts.mono, // Or theme.fonts.body
    fontSize: theme.typography.labelSmall.fontSize, // Themed label size
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  inputPanel: { // New style for the input wrapper
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // Padding is applied to TextInput now for better control with label
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 3, // For Android
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md, // Horizontal padding inside panel
    paddingVertical: theme.spacing.md,   // Vertical padding inside panel
    color: theme.colors.textPrimary,
    fontSize: 15, // As per spec
    // No border/borderRadius here, it's on inputPanel
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md, // Use theme border radius
    paddingVertical: theme.spacing.md, // Use theme spacing
    marginTop: theme.spacing.md, // Adjusted from 16
    width: '100%', // Ensure button is full width
  },
  buttonDisabled: {
    backgroundColor: theme.colors.base3, // Use theme color for disabled state
  },
  buttonText: {
    fontFamily: theme.fonts.display, // Use display font for button
    color: theme.colors.bg, // White text
    fontSize: theme.typography.headingMedium.fontSize, // Themed font size
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 95, 247, 0.3)', // Accent color with opacity for glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl, // Increased spacing
  },
  footerText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize, // Consistent body size
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  footerLink: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize, // Consistent body size
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
