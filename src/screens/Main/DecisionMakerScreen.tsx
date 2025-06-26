import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DecisionMakerTab from '../../components/DecisionMakerTab'; // Adjust path if necessary
import { HDType } from '../../types/humanDesign'; // Adjust path if necessary
import { colors, spacing, typography } from '../../constants/theme'; // Assuming theme file exists
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import React, { useState, useEffect } from 'react'; // Import useState, useEffect

const DEV_OVERRIDE_HD_TYPE_KEY = 'dev_override_hd_type';

// Placeholder for fetching user type. In a real app, this would come from auth context or a user service.
const useUserHDType = (): { userType: HDType | null; isLoading: boolean } => {
  const [userType, setUserType] = useState<HDType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      setIsLoading(true);
      try {
        const overrideType = await AsyncStorage.getItem(DEV_OVERRIDE_HD_TYPE_KEY);
        if (overrideType && ['Generator', 'Projector', 'Manifestor', 'Reflector', 'Manifesting Generator'].includes(overrideType)) {
          console.log(`DEV OVERRIDE: Using HDType '${overrideType}' from AsyncStorage.`);
          setUserType(overrideType as HDType);
        } else {
          // Simulate fetching actual user type. Replace with actual logic.
          // For now, default to 'Generator' if no override.
          const actualUserType: HDType = 'Generator';
          setUserType(actualUserType);
        }
      } catch (e) {
        console.error("Failed to fetch user HD type or override:", e);
        setUserType('Generator'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, []);

  return { userType, isLoading };
};

const DecisionMakerScreen: React.FC = () => {
  const { userType, isLoading: isLoadingUserType } = useUserHDType();

  if (isLoadingUserType) {
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
