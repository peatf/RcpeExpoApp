/**
 * @file MainTabNavigator.tsx
 * @description Bottom tab navigation for the main app screens
 */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import DashboardScreen from '../screens/Main/DashboardScreen';
import FrequencyMapperScreen from '../screens/Main/FrequencyMapperScreen';
import CalibrationToolScreen from '../screens/Main/CalibrationToolScreen';
import OracleScreen from '../screens/Main/OracleScreen';
import UserBaseChartScreen from '../screens/Main/UserBaseChartScreen';
import ProfileCreationScreen from '../screens/Main/ProfileCreationScreen';
import {MainTabParamList} from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'FrequencyMapper':
              iconName = focused ? 'radio' : 'radio-outline';
              break;
            case 'CalibrationTool':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case 'Oracle':
              iconName = focused ? 'eye' : 'eye-outline';
              break;
            case 'UserBaseChart':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'ProfileCreation':
              iconName = focused ? 'person-add' : 'person-add-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="FrequencyMapper" 
        component={FrequencyMapperScreen}
        options={{
          tabBarLabel: 'Frequency',
        }}
      />
      <Tab.Screen 
        name="CalibrationTool" 
        component={CalibrationToolScreen}
        options={{
          tabBarLabel: 'Calibrate',
        }}
      />
      <Tab.Screen 
        name="Oracle" 
        component={OracleScreen}
        options={{
          tabBarLabel: 'Oracle',
        }}
      />
      <Tab.Screen 
        name="UserBaseChart" 
        component={UserBaseChartScreen}
        options={{
          tabBarLabel: 'Chart',
        }}
      />
      <Tab.Screen 
        name="ProfileCreation" 
        component={ProfileCreationScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
