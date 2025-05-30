import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

const LoginScreen = ({ navigation }: any) => { // Add navigation prop type if using @react-navigation/native-stack
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Replace with actual credentials from input fields
      await login({ email: 'user@example.com', password: 'password' });
      // Navigation to main app is handled by AppNavigator's logic based on isAuthenticated
    } catch (error) {
      console.error('Login failed:', error);
      // Show error message to user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button title="Login (Dummy)" onPress={handleLogin} />
      {/* Add input fields for email and password here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});

export default LoginScreen;
