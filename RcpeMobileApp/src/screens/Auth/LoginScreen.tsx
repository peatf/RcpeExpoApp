import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { biometricService } from '../../services/BiometricService';

// Type for navigation prop if using @react-navigation/native-stack
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
// type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
// const LoginScreen = ({ navigation }: Props) => {

const LoginScreen = ({ navigation }: any) => {
  const { login, setIsLoading: setAuthLoading, isLoading: authIsLoading } = useAuth(); // Assuming AuthContext exposes setIsLoading
  const [email, setEmail] = useState(''); // Replace with actual test user if needed
  const [password, setPassword] = useState(''); // Replace with actual test user if needed

  const [biometricSupportChecked, setBiometricSupportChecked] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [canAttemptBiometricLogin, setCanAttemptBiometricLogin] = useState(false);
  const [isAttemptingBiometric, setIsAttemptingBiometric] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const supported = await biometricService.isSupported();
      setIsBiometricSupported(supported);
      if (supported) {
        // Check if credentials exist that can be used for biometric login
        const creds = await biometricService.getCredentials(); // This might prompt if called without context
        if (creds && creds.identifier && creds.token) { // Check if creds are actually stored
             // Don't prompt here, just set flag. Prompt on button press or specific user action.
            setCanAttemptBiometricLogin(true);
        }
      }
      setBiometricSupportChecked(true);
    };
    checkBiometricSupport();
  }, []);

  const handleBiometricLogin = async () => {
    if (!isBiometricSupported) {
      Alert.alert("Not Supported", "Biometric authentication is not supported on this device.");
      return;
    }
    setIsAttemptingBiometric(true);
    setAuthLoading(true); // Use auth context's loading state
    try {
      const credentials = await biometricService.getCredentials(); // This will trigger biometric prompt
      if (credentials && credentials.identifier && credentials.token) {
        // Here, you'd typically use the retrieved token to authenticate the user
        // For example, by setting it in AuthContext or calling a specific "/auth/verify_token" endpoint
        // For this demo, let's assume the 'token' is enough, or it's a refresh token.
        // If it's a refresh token, you'd call authService.refreshToken(credentials.token)
        // Or, if you stored email/pass (not recommended), you'd call login({email, password})
        Alert.alert('Biometric Login Success', `Authenticated as ${credentials.identifier}. Implement session restoration with token: ${credentials.token.substring(0,10)}...`);
        // Example: Simulate login success for now (replace with actual logic)
        // This would involve calling a function in AuthContext to set the user as authenticated
        // await login({ email: credentials.identifier, password: "biometric_placeholder_password" }); // DONT DO THIS WITH REAL PASSWORDS
        // A better way: use the retrieved token to validate session with backend, then update AuthContext
        console.log("Biometric login successful with stored token/identifier. Implement session restoration.");
        // For now, we don't have a direct way to set auth state from just a token without calling login.
        // This part needs to be integrated with how AuthContext handles session restoration from a token.
      } else {
        Alert.alert("Biometric Login Failed", "Could not retrieve stored credentials or biometric authentication failed/cancelled.");
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert("Biometric Error", "An error occurred during biometric authentication.");
    } finally {
      setIsAttemptingBiometric(false);
      setAuthLoading(false);
    }
  };

  const handleStandardLogin = async () => {
    if (!email || !password) {
      Alert.alert("Input Required", "Please enter email and password.");
      return;
    }
    setAuthLoading(true);
    try {
      await login({ email, password });
      // After successful login, ask to enable biometrics
      // This part would be in AuthContext or called from there ideally
      if (isBiometricSupported) {
        Alert.alert(
          "Enable Biometric Login?",
          "Would you like to use biometrics for faster login next time?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes",
              onPress: async () => {
                // For demo, storing email and a dummy token. In real app, store a refresh token.
                const success = await biometricService.storeCredentials(email, "dummy-auth-token-for-"+email);
                if (success) Alert.alert("Biometric Login Enabled!");
              }
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unknown error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!biometricSupportChecked && !authIsLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      <Button title={authIsLoading ? "Logging in..." : "Login"} onPress={handleStandardLogin} disabled={authIsLoading || isAttemptingBiometric} />

      {isBiometricSupported && ( // Only show if supported
        <View style={styles.biometricContainer}>
          <Button
            title={isAttemptingBiometric ? "Checking..." : "Login with Biometrics"}
            onPress={handleBiometricLogin}
            disabled={authIsLoading || isAttemptingBiometric || !canAttemptBiometricLogin} // Disable if no creds stored
          />
          {!canAttemptBiometricLogin && biometricSupportChecked &&
            <Text style={styles.biometricInfo}>No biometric credentials saved. Login normally to enable.</Text>
          }
        </View>
      )}
      {/* Add button to go to RegisterScreen if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 30, fontWeight: 'bold' },
  inputContainer: { marginBottom: 15, width: '100%' },
  biometricContainer: { marginTop: 20, width: '100%', alignItems: 'center' },
  biometricInfo: { fontSize: 12, color: 'grey', marginTop: 5 },
});

export default LoginScreen;
