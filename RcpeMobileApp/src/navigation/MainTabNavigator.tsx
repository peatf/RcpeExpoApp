import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Main/DashboardScreen';
import FrequencyMapperScreen from '../screens/Main/FrequencyMapperScreen';
import CalibrationToolScreen from '../screens/Main/CalibrationToolScreen';
import OracleScreen from '../screens/Main/OracleScreen';
import UserBaseChartScreen from '../screens/Main/UserBaseChartScreen';
// Import icons from react-native-vector-icons or other library
// import Icon from 'react-native-vector-icons/Ionicons'; // Example

export type MainTabParamList = {
  Dashboard: undefined;
  FrequencyMapper: undefined;
  CalibrationTool: undefined;
  Oracle: undefined;
  BaseChart: undefined; // For User's Base Chart
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ focused, color, size }) => {
        //   let iconName;
        //   if (route.name === 'Dashboard') {
        //     iconName = focused ? 'home' : 'home-outline';
        //   } else if (route.name === 'FrequencyMapper') {
        //     iconName = focused ? 'map' : 'map-outline';
        //   } // Add other icons
        //   return <Icon name={iconName} size={size} color={color} />;
        // },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: true, // Show headers for tab screens, customize as needed
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="FrequencyMapper" component={FrequencyMapperScreen} options={{ title: 'Frequency Map' }} />
      <Tab.Screen name="CalibrationTool" component={CalibrationToolScreen} options={{ title: 'Calibration' }} />
      <Tab.Screen name="Oracle" component={OracleScreen} />
      <Tab.Screen name="BaseChart" component={UserBaseChartScreen} options={{ title: 'My Chart' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
