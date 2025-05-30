import React from 'react';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexts/AuthContext'; // Adjust path as needed
import { NetworkProvider } from './src/contexts/NetworkContext';
import AppNavigator from './src/navigation/AppNavigator';   // Adjust path as needed
import { pushNotificationService } from './src/services/PushNotificationService';
// import { SafeAreaProvider } from 'react-native-safe-area-context'; // Good for handling notches and system UI

const App = () => {
  useEffect(() => {
    pushNotificationService.configure();
    // Create default channel for Android
    if (Platform.OS === 'android') {
      pushNotificationService.createDefaultChannels();
    }
    // Example: Test local notification after 5 seconds
    // setTimeout(() => {
    //   pushNotificationService.localNotification('Hello!', 'This is a test local notification.');
    // }, 5000);
  }, []);
  return (
    // <SafeAreaProvider>
    <NetworkProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NetworkProvider>
    // </SafeAreaProvider>
  );
};

export default App;
