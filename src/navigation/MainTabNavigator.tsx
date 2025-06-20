/**
 * @file MainTabNavigator.tsx
 * @description Main app layout with side navigation matching mockup design
 */
import React, { useState, useRef } from 'react'; // Added useRef
import { View, StyleSheet, ScrollView, Animated } from 'react-native'; // Added ScrollView, Animated
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StackedButton from '../components/StackedButton';
import { colors, fonts, spacing, borderRadius } from '../constants/theme'; // Import individual constants
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
  const insets = useSafeAreaInsets();

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
      
      // Safely render different component types with appropriate props
      switch (currentItem.id) {
        case 'welcome':
          return <WelcomeScreen onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
        case 'frequencyMapper':
          // @ts-ignore - FrequencyMapperScreen doesn't need navigation prop in our simplified implementation
          return <FrequencyMapperScreen />;
        case 'oracle':
          // @ts-ignore - OracleScreen may have different prop requirements
          return <OracleScreen />;
        case 'baseChart':
          // @ts-ignore - UserBaseChartScreen may have different prop requirements  
          return <UserBaseChartScreen />;
        case 'livingLog':
          // @ts-ignore - LivingLogScreen may have different prop requirements
          return <LivingLogScreen />;
        case 'decisionMaker':
          // @ts-ignore - DecisionMakerScreen may have different prop requirements
          return <DecisionMakerScreen />;
        default:
          return <WelcomeScreen onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
      }
    }
    // Fallback to welcome screen
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
    <View style={[styles.appShell, { paddingTop: insets.top }]}>
      {/* Main Body (Nav Panel + Content Area) */}
      <View style={styles.mainBodyContainer}>
        {/* Navigation Panel */}
        <Animated.View style={[styles.navigationPanel, { width: navPanelWidth }]}>
          {/* Collapse/Expand Button - to be styled correctly */}
          <View style={styles.navButtonWrapper}>
            <StackedButton
              shape="circle"
              onPress={toggleNavCollapse}
              isActive={false}
            >
              <Ionicons
                name={isNavCollapsed ? 'chevron-forward' : 'chevron-back'}
                size={20}
                color="#fafaf2"
              />
            </StackedButton>
          </View>

          {/* Navigation Items - Always map, StackedButton will handle icon-only view if panel is narrow */}
          {navigationItems.map((item) => (
            <View key={item.id} style={styles.navButtonWrapper}>
              <StackedButton
                shape="circle"
                onPress={() => setCurrentScreen(item.id as ScreenName)}
                isActive={currentScreen === item.id}
              >
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color="#fafaf2"
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
    backgroundColor: 'transparent', // Allow AppBackground to show through
  },
  mainBodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  navigationPanel: {
    // width: 72, // Initial width, now controlled by Animated.Value
    backgroundColor: 'rgba(250, 250, 242, 0.9)', // Semi-transparent nav panel
    borderRightWidth: 1,
    borderRightColor: colors.base1,
    paddingVertical: spacing.md,
    alignItems: 'center', // Center buttons
    // justifyContent: 'flex-start', // Align buttons to top
  },
  navButtonWrapper: { // Wrapper for each nav button for spacing
    marginBottom: spacing.md, // Space between nav buttons
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent', // Allow background to show through
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
