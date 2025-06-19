import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AppBackground from './src/components/AppBackground';

export default function App() {
  return (
    <AppBackground>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </AppBackground>
  );
}
