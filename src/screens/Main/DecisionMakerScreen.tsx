import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DecisionMakerTab from '../../components/DecisionMakerTab'; // Adjust path if necessary
import { HDType } from '../../types/humanDesign'; // Adjust path if necessary
import { colors, spacing, typography } from '../../constants/theme'; // Assuming theme file exists

// Placeholder for fetching user type. In a real app, this would come from auth context or a user service.
const useUserHDType = (): HDType | null => {
  // Simulate fetching user type. Replace with actual logic.
  // For testing, you can cycle through types:
  // const types: HDType[] = ['Generator', 'Projector', 'Manifestor', 'Reflector', 'Manifesting Generator'];
  // return types[Math.floor(Math.random() * types.length)];
  return 'Generator'; // Default to Generator for now
};

const DecisionMakerScreen: React.FC = () => {
  const userType = useUserHDType();

  // In a real app, you might want to show a loading state while userType is being determined.
  if (!userType) {
    return (
      <View style={styles.centered}>
        <Text style={typography.bodyLarge}>Loading user information...</Text>
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
    backgroundColor: colors.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.base1,
  },
});

export default DecisionMakerScreen;
