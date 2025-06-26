/**
 * @file ProfileResultStep.tsx
 * @description Step 5: Display profile creation result and fetch full profile
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../../constants/theme'; // Import theme

interface ProfileResultStepProps {
  profileId: string | null;
  profileData: any;
  onFetchProfile: () => void;
  isLoading: boolean;
  onCreateAnother: () => void;
}

export const ProfileResultStep: React.FC<ProfileResultStepProps> = ({
  profileId,
  profileData,
  onFetchProfile,
  isLoading,
  onCreateAnother,
}) => {
  const copyProfileId = async () => {
    if (profileId) {
      await Clipboard.setStringAsync(profileId);
      Alert.alert('Profile ID', 'Copied to clipboard!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Profile Created!</Text>
        <Text style={styles.stepDescription}>
          Your Reality Creation Profile has been successfully generated.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile ID Section */}
        {profileId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile ID</Text>
            <View style={styles.profileIdContainer}>
              <Text style={styles.profileId}>{profileId}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyProfileId}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.idDescription}>
              Save this ID to access your profile later.
            </Text>
          </View>
        )}

        {/* Fetch Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>View Full Profile</Text>
          <Text style={styles.sectionDescription}>
            Fetch your complete astrological and typological profile analysis.
          </Text>
          
          <TouchableOpacity 
            style={[styles.fetchButton, isLoading && styles.disabledButton]} 
            onPress={onFetchProfile}
            disabled={isLoading || !profileId}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.bg} />
                <Text style={styles.loadingText}>Fetching Profile...</Text>
              </View>
            ) : (
              <Text style={styles.fetchButtonText}>Fetch Full Profile</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Data Section */}
        {profileData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Data</Text>
            <View style={styles.profileDataContainer}>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.profileDataScroll}
              >
                <Text style={styles.profileDataText}>
                  {JSON.stringify(profileData, null, 2)}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.createAnotherButton} 
            onPress={onCreateAnother}
          >
            <Text style={styles.createAnotherText}>Create Another Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.accent, // Updated (Note: consider a dedicated success color)
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.bg, // Updated
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 16,
    lineHeight: 20,
  },
  profileIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg, // Updated (ensure distinction via border/shadow if needed)
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1, // Added for distinction
    borderColor: theme.colors.base1 // Added for distinction
  },
  profileId: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    color: theme.colors.textPrimary, // Updated
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: theme.colors.accent, // Updated
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  copyButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 14,
    fontWeight: '600',
  },
  idDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary, // Updated
    fontStyle: 'italic',
  },
  fetchButton: {
    backgroundColor: theme.colors.accent, // Updated
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.base3, // Updated
  },
  fetchButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  profileDataContainer: {
    backgroundColor: theme.colors.bg, // Updated
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
    borderWidth: 1, // Added for distinction
    borderColor: theme.colors.base1 // Added for distinction
  },
  profileDataScroll: {
    flex: 1,
  },
  profileDataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.colors.textPrimary, // Updated
    lineHeight: 18,
  },
  actionsSection: {
    marginTop: 20,
    paddingBottom: 40,
  },
  createAnotherButton: {
    backgroundColor: theme.colors.base3, // Updated
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  createAnotherText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
});
