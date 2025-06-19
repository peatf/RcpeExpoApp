/**
 * @file MainTabNavigator.tsx
 * @description Main app layout with side navigation matching mockup design
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StackedButton from '../components/StackedButton';
import { colors, spacing } from '../constants/theme';
import WelcomeScreen from '../screens/Main/WelcomeScreen';
import FrequencyMapperScreen from '../screens/Main/FrequencyMapperScreen';
import OracleScreen from '../screens/Main/OracleScreen';
import UserBaseChartScreen from '../screens/Main/UserBaseChartScreen';
import LivingLogScreen from '../screens/Main/HumanDesignTools/LivingLogScreen';
import DecisionMakerScreen from '../screens/Main/DecisionMakerScreen'; // Added import

type ScreenName = 'welcome' | 'frequencyMapper' | 'oracle' | 'baseChart' | 'livingLog' | 'decisionMaker'; // Added screen

const MainTabNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);

  const navigationItems = [
    {
      id: 'welcome',
      icon: 'home',
      label: 'Home',
      component: WelcomeScreen,
    },
    {
      id: 'frequencyMapper',
      icon: 'add',
      label: 'Mapper',
      component: FrequencyMapperScreen,
    },
    {
      id: 'oracle',
      icon: 'eye',
      label: 'Oracle',
      component: OracleScreen,
    },
    {
      id: 'baseChart',
      icon: 'globe',
      label: 'Chart',
      component: UserBaseChartScreen,
    },
    {
      id: 'livingLog',
      icon: 'document-text',
      label: 'Log',
      component: LivingLogScreen,
    },
    { // Added new navigation item
      id: 'decisionMaker',
      icon: 'keypad-outline', // Example icon
      label: 'Decision', // Short label for collapsed nav
      component: DecisionMakerScreen,
    },
  ];

  const getCurrentComponent = () => {
    const currentItem = navigationItems.find(item => item.id === currentScreen);
    if (currentItem) {
      const Component = currentItem.component;
      if (Component === WelcomeScreen) {
        return <Component onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
      }
      // @ts-ignore - These components don't expect props but have different interfaces
      return <Component />;
    }
    return <WelcomeScreen onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.appContainer}>
        <View style={styles.mainContent}>
          {/* Side Navigation */}
          <View style={[styles.navigation, isNavCollapsed && styles.navigationCollapsed]}>
            {/* Collapse/Expand Button */}
            <View style={styles.collapseButtonContainer}>
              <StackedButton
                type="nav"
                onPress={() => setIsNavCollapsed(!isNavCollapsed)}
                isActive={false}
              >
                <Ionicons 
                  name={isNavCollapsed ? 'chevron-forward' : 'chevron-back'} 
                  size={16} 
                  color={colors.base2}
                  style={styles.navIcon}
                />
              </StackedButton>
            </View>

            {!isNavCollapsed && (
              <>
                {navigationItems.map((item, index) => (
                  <View key={item.id} style={[styles.navButtonContainer, index > 0 && styles.navButtonSpacing]}>
                    <StackedButton
                      type="nav"
                      onPress={() => setCurrentScreen(item.id as ScreenName)}
                      isActive={currentScreen === item.id}
                    >
                      <Ionicons 
                        name={item.icon as keyof typeof Ionicons.glyphMap} 
                        size={20} 
                        color={currentScreen === item.id ? '#fff' : colors.base2}
                        style={styles.navIcon}
                      />
                    </StackedButton>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {getCurrentComponent()}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  navigation: {
    width: 72,
    backgroundColor: 'rgba(250, 250, 242, 0.9)',
    borderRightWidth: 1,
    borderRightColor: colors.base1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingTop: spacing.xl, // Add padding for status bar
  },
  navigationCollapsed: {
    width: 24,
  },
  collapseButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  navButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonSpacing: {
    marginTop: spacing.md,
  },
  navIcon: {
    textShadowColor: 'rgba(50, 50, 48, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MainTabNavigator;
