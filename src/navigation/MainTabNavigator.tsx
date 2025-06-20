/**
 * @file MainTabNavigator.tsx
 * @description Main app layout with side navigation matching mockup design
 */
import React, { useState, useRef } from 'react'; // Added useRef
import { View, StyleSheet, Text, ScrollView, Animated } from 'react-native'; // Added Text, ScrollView, Animated
import { Ionicons } from '@expo/vector-icons';
import StackedButton from '../components/StackedButton';
import { theme } from '../constants/theme'; // Import full theme
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
  // Animated value for navigation panel width
  const navPanelWidth = useRef(new Animated.Value(72)).current;

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

  const toggleNavCollapse = () => {
    const newWidth = isNavCollapsed ? 72 : 50; // Collapsed width to 50px
    Animated.timing(navPanelWidth, {
      toValue: newWidth,
      duration: 300, // Animation duration
      useNativeDriver: false, // width animation not supported by native driver
    }).start();
    setIsNavCollapsed(!isNavCollapsed);
  };

  // Placeholder for actual Header, NavPanel, ContentArea components/styles
  // This diff focuses on the main structure.

  return (
    <View style={styles.appShell}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>RCPE_OS</Text>
        <Text style={styles.headerUserText}>USER: peathefeary</Text>
      </View>

      {/* Main Body (Nav Panel + Content Area) */}
      <View style={styles.mainBodyContainer}>
        {/* Navigation Panel */}
        <Animated.View style={[styles.navigationPanel, { width: navPanelWidth }]}>
          {/* Collapse/Expand Button - to be styled correctly */}
          <View style={styles.navButtonWrapper}>
            <StackedButton
              type="nav"
              onPress={toggleNavCollapse}
              isActive={false} // Or some other visual cue
            >
              <Ionicons
                name={isNavCollapsed ? 'chevron-forward' : 'chevron-back'}
                size={20} // Adjusted size
                // Color will be handled by StackedButton's cloneElement
              />
            </StackedButton>
          </View>

          {/* Navigation Items - Always map, StackedButton will handle icon-only view if panel is narrow */}
          {navigationItems.map((item) => (
            <View key={item.id} style={styles.navButtonWrapper}>
              <StackedButton
                type="nav"
                onPress={() => setCurrentScreen(item.id as ScreenName)}
                isActive={currentScreen === item.id}
              >
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  // Color handled by StackedButton
                />
              </StackedButton>
            </View>
          ))}
        </Animated.View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {getCurrentComponent()}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: theme.colors.bg, // Base background for the entire app shell
  },
  headerContainer: {
    height: 64, // As per spec
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base1,
  },
  headerTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 18, // Example size
    fontWeight: 'bold', // Example weight
    color: theme.colors.textPrimary,
    letterSpacing: 1.5, // Wider spacing
  },
  headerUserText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12, // Example size
    color: theme.colors.textSecondary,
  },
  mainBodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  navigationPanel: {
    // width: 72, // Initial width, now controlled by Animated.Value
    backgroundColor: theme.colors.bg, // Or a slight variant if needed
    borderRightWidth: 1,
    borderRightColor: theme.colors.base1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center', // Center buttons
    // justifyContent: 'flex-start', // Align buttons to top
  },
  navButtonWrapper: { // Wrapper for each nav button for spacing
    marginBottom: theme.spacing.md, // Space between nav buttons
  },
  contentArea: {
    flex: 1,
    backgroundColor: theme.colors.bg, // Ensure content area bg matches
    overflow: 'hidden', // For x-axis, ScrollView handles y-axis
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // Potential padding for scroll content if needed
    // flexGrow: 1, // Ensures content can take full height if not scrolling
  },
  // Old styles have been removed.
});

export default MainTabNavigator;
