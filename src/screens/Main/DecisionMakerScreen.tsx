import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DecisionMakerTab from '../../components/DecisionMakerTab'; // Adjust path if necessary
import { HDType } from '../../types/humanDesign'; // Adjust path if necessary
import { colors, spacing, typography } from '../../constants/theme'; // Assuming theme file exists
import AsyncStorage from '@react-native-async-storage/async-storage';
// React, useState, useEffect are imported once now
import OnboardingBanner from '../../components/OnboardingBanner';
import useOnboardingBanner from '../../hooks/useOnboardingBanner';
import baseChartService from '../../services/baseChartService';
import { useAuth } from '../../contexts/AuthContext';

const DEV_OVERRIDE_HD_TYPE_KEY = 'dev_override_hd_type';

// Hook to fetch user's actual HD type from base chart data
const useUserHDType = (): { userType: HDType | null; isLoading: boolean } => {
  const [userType, setUserType] = useState<HDType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserType = async () => {
      setIsLoading(true);
      try {
        // First check for dev override
        const overrideType = await AsyncStorage.getItem(DEV_OVERRIDE_HD_TYPE_KEY);
        if (overrideType && ['Generator', 'Projector', 'Manifestor', 'Reflector', 'Manifesting Generator'].includes(overrideType)) {
          console.log(`DEV OVERRIDE: Using HDType '${overrideType}' from AsyncStorage.`);
          setUserType(overrideType as HDType);
          return;
        }

        // Check if user is authenticated
        if (!user?.email) {
          console.warn('No authenticated user found, defaulting to Generator');
          setUserType('Generator');
          return;
        }

        // Fetch actual user type from base chart data using user's email as ID
        try {
          const baseChartResponse = await baseChartService.getUserBaseChart(user.email);
          if (baseChartResponse.success && baseChartResponse.data?.hd_type) {
            console.log(`Fetched HD Type from base chart: ${baseChartResponse.data.hd_type}`);
            setUserType(baseChartResponse.data.hd_type as HDType);
          } else {
            console.warn('No HD type found in base chart data, defaulting to Generator');
            setUserType('Generator');
          }
        } catch (baseChartError) {
          console.error('Failed to fetch base chart data:', baseChartError);
          // Fallback to Generator if base chart fetch fails
          setUserType('Generator');
        }
      } catch (e) {
        console.error("Failed to fetch user HD type:", e);
        setUserType('Generator'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, [user]); // Depend on user so it refetches when user changes

  return { userType, isLoading };
};

const DecisionMakerScreen: React.FC = () => {
  const { userType, isLoading: isLoadingUserType } = useUserHDType();
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('DecisionMaker');

  if (isLoadingUserType || isLoadingBanner) { // Combined loading states
    return (
      <View style={styles.centered}>
        <Text style={typography.bodyLarge}>Loading user information...</Text>
        {/* Optionally, add an ActivityIndicator here */}
      </View>
    );
  }

  if (!userType) {
    return (
      <View style={styles.centered}>
        <Text style={typography.bodyLarge}>Could not determine user Human Design type.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screenContainer}>
      {showBanner && (
        <OnboardingBanner
          toolName="Decision Maker"
          description="Tools to help you make decisions aligned with your Human Design type."
          onDismiss={dismissBanner}
        />
      )}
      <View style={styles.headerContainer}>
        <Text style={typography.headingLarge}>Decision-Maker Tools</Text>
        <Text style={typography.bodyMedium}>
          Personalized tools based on your Human Design Type: {userType}
        </Text>
      </View>
      <DecisionMakerTab userType={userType} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Updated
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Updated
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.base1,
  },
});

export default DecisionMakerScreen;
