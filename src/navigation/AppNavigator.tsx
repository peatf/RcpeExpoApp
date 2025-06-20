/**
 * @file AppNavigator.tsx
 * @description Main navigation structure for the RCPE Expo app
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import {RootStackParamList} from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    // You could add a loading screen component here
    return null;
  }

  return (
    <NavigationContainer theme={{
      dark: false,
      colors: {
        background: 'transparent',
        primary: 'rgb(0, 122, 255)',
        card: 'transparent',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)'
      },
      fonts: {
        regular: {
          fontFamily: 'Inter',
          fontWeight: 'normal',
        },
        medium: {
          fontFamily: 'Inter',
          fontWeight: '500',
        },
        bold: {
          fontFamily: 'Inter',
          fontWeight: 'bold',
        },
        heavy: {
          fontFamily: 'Syne',
          fontWeight: '800',
        }
      }
    }}>
      <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: 'transparent'}}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
