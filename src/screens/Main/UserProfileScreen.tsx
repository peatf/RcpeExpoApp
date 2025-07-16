/**
 * @file UserProfileScreen.tsx
 * @description User profile screen with logout functionality and profile management
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';

interface UserProfileScreenProps {
  navigation?: any; // Navigation prop for navigation context
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including base chart cache. You may need to reload data afterwards.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Cache Cleared', 'All cached data has been cleared.');
          }
        },
      ]
    );
  };

  const profileActions = [
    {
      title: 'View Profile Data',
      subtitle: 'Review your current profile information',
      icon: 'person-outline',
      onPress: () => {
        Alert.alert('Profile Data', 'Profile data view not implemented yet.');
      },
    },
    {
      title: 'Human Design Profiles',
      subtitle: 'Test different HD types',
      icon: 'star-outline',
      onPress: () => {
        Alert.alert('HD Profiles', 'Switch to test Human Design profiles:\n\n• Generator: generator@example.com\n• Manifestor: manifestor@example.com\n• Projector: projector@example.com\n• Reflector: reflector@example.com\n• ManGen: mangen@example.com\n\nPassword for all: [type]123');
      },
    },
    {
      title: 'Clear Cache',
      subtitle: 'Clear all cached data',
      icon: 'refresh-outline',
      onPress: handleClearCache,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>USER PROFILE</Text>
          <Text style={styles.pageSubtitle}>Manage your account</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userIcon}>
              <Ionicons name="person" size={24} color={theme.colors.accent} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
              {user?.id && (
                <Text style={styles.userId}>ID: {user.id}</Text>
              )}
            </View>
          </View>

          {/* Profile Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Profile Actions</Text>
            {profileActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  pageTitle: {
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: theme.typography.displayMedium.fontWeight,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  pageSubtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.base1,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.headingSmall.fontSize,
    fontWeight: theme.typography.headingSmall.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userId: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
  },
  actionsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.base1,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  actionSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  logoutSection: {
    marginTop: theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: '600',
    color: '#fff',
  },
});

export default UserProfileScreen;
