import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
const linking = {
  prefixes: ['rcpe://app', 'https://rcpe.app'], /* Add your app's URL scheme and universal link prefix */
  config: {
    screens: {
      Auth: 'auth',
      Main: {
        path: 'main',
        screens: { /* Screens within MainTabNavigator */
          Dashboard: 'dashboard',
          FrequencyMapper: 'freq-map',
          CalibrationTool: 'calibrate',
          Oracle: 'oracle',
          BaseChart: 'base-chart',
        },
      },
      ToolResult: 'tool_result/:toolName/:resultId', /* Deep link to ToolResultScreen */
      NotFound: '*', /* Catch-all for unmatched routes */
    },
  },
};
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import ToolResultScreen from '../screens/Main/ToolResultScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // For loading indicator

// This helps in defining routes for the root stack if needed, though often not directly navigated to.
export type RootStackParamList = {
  Auth: undefined; // Points to the AuthStackNavigator
  Main: undefined; // Points to the MainTabNavigator
  ToolResult: { toolName: string; resultId: string };
  // Potentially modal screens that can be shown over anything
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading screen while checking auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking} fallback={<View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
        <RootStack.Screen name="ToolResult" component={ToolResultScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
