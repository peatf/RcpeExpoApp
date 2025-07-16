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
import DecisionMakerScreen from '../screens/Main/DecisionMakerScreen';
import ProfileCreationScreen from '../screens/Main/ProfileCreationScreen';
import UserProfileScreen from '../screens/Main/UserProfileScreen';

type ScreenName = 'welcome' | 'frequencyMapper' | 'oracle' | 'baseChart' | 'livingLog' | 'decisionMaker' | 'profileCreation' | 'userProfile';

const MainTabNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(true); // Start collapsed
  // Animated value for navigation panel width
  const navPanelWidth = useRef(new Animated.Value(0)).current; // Start with 0 width
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
    {
      id: 'decisionMaker',
      icon: 'keypad-outline', // Example icon
      label: 'Decision', // Short label for collapsed nav
      component: DecisionMakerScreen,
    },
    {
      id: 'profileCreation',
      icon: 'person',
      label: 'Profile',
      component: ProfileCreationScreen,
    },
    {
      id: 'userProfile',
      icon: 'settings',
      label: 'Settings',
      component: UserProfileScreen,
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
        case 'profileCreation':
          // @ts-ignore - ProfileCreationScreen expects navigation prop
          return <ProfileCreationScreen />;
        case 'userProfile':
          // @ts-ignore - UserProfileScreen expects navigation prop
          return <UserProfileScreen />;
        default:
          return <WelcomeScreen onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
      }
    }
    // Fallback to welcome screen
    return <WelcomeScreen onBeginSession={() => setCurrentScreen('frequencyMapper')} />;
  };

  const toggleNavCollapse = () => {
    const newWidth = isNavCollapsed ? 72 : 0; // 0 width when collapsed
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
        {isNavCollapsed && (
          <View style={styles.openButtonWrapper}>
            <StackedButton
              shape="circle"
              onPress={toggleNavCollapse}
              isActive={false}
            >
              <Ionicons
                name="menu" // Icon for opening the sidebar
                size={24} // Slightly larger for visibility
                color={colors.textPrimary} // Changed to textPrimary as iconDefault is not defined
              />
            </StackedButton>
          </View>
        )}
        <Animated.View style={[styles.navigationPanel, { width: navPanelWidth }]}>
          {/* Collapse/Expand Button - to be styled correctly */}
          {!isNavCollapsed && (
            <View style={styles.navButtonWrapper}>
              <StackedButton
                shape="circle"
                onPress={toggleNavCollapse}
                isActive={false}
              >
                <Ionicons
                  name={'chevron-back'} // Always back when panel is open
                  size={20}
                  color={colors.bg} // Updated
                />
              </StackedButton>
            </View>
          )}

          {/* Navigation Items - Render only if not collapsed */}
          {!isNavCollapsed && navigationItems.map((item) => (
            <View key={item.id} style={styles.navButtonWrapper}>
              <StackedButton
                shape="circle"
                onPress={() => {
                  setCurrentScreen(item.id as ScreenName);
                  // Optionally collapse after selection, if desired UX
                  // toggleNavCollapse();
                }}
                isActive={currentScreen === item.id}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={colors.bg} // Updated
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
    backgroundColor: 'transparent', // Fully transparent nav panel
    borderRightWidth: 1,
    borderRightColor: colors.base1, // Keep border for definition if needed, or remove
    paddingVertical: spacing.md,
    alignItems: 'center', // Center buttons
    // justifyContent: 'flex-start', // Align buttons to top
    overflow: 'hidden', // Hide content when collapsed
  },
  navButtonWrapper: { // Wrapper for each nav button for spacing
    marginBottom: spacing.md, // Space between nav buttons
  },
  openButtonWrapper: { // Style for the open button when sidebar is collapsed
    position: 'absolute', // Position it over the content or fixed
    top: spacing.md, // Adjust as needed
    left: spacing.md, // Adjust as needed
    zIndex: 10, // Ensure it's above other content
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
