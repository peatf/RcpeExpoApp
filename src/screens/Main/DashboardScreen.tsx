/**
 * @file DashboardScreen.tsx
 * @description Main dashboard screen showing app overview and navigation
 */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import connectionTestService from '../../services/connectionTestService';

const DashboardScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, logout} = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await connectionTestService.testBackendConnection();
      setConnectionStatus(result.success ? 'Connected' : 'Connection Failed');
    } catch (error) {
      setConnectionStatus('Connection Failed');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: logout},
      ]
    );
  };

  const menuItems = [
    {
      title: 'Frequency Mapper',
      subtitle: 'Map and analyze frequency patterns',
      onPress: () => navigation.navigate('FrequencyMapper'),
    },
    {
      title: 'Calibration Tool',
      subtitle: 'Calibrate your profile settings',
      onPress: () => navigation.navigate('CalibrationTool'),
    },
    {
      title: 'Oracle',
      subtitle: 'Get insights and guidance',
      onPress: () => navigation.navigate('Oracle'),
    },
    {
      title: 'Base Chart',
      subtitle: 'View your base energy chart',
      onPress: () => navigation.navigate('UserBaseChart'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to RCPE</Text>
          <Text style={styles.subtitle}>
            Hello, {user?.name || user?.email || 'User'}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Backend: </Text>
            <Text style={[
              styles.statusText,
              {color: connectionStatus === 'Connected' ? '#28a745' : '#dc3545'}
            ]}>
              {connectionStatus}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
