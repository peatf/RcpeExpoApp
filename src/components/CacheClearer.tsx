import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseChartService from '../services/baseChartService';

const CacheClearer: React.FC = () => {
  const [clearingStatus, setClearingStatus] = useState<string>('Ready to clear cache');
  const [isClearing, setIsClearing] = useState(false);

  const clearAllCache = async () => {
    try {
      setIsClearing(true);
      setClearingStatus('🧹 Starting cache clear...');
      
      // Get all keys
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('📋 All storage keys:', allKeys);
      setClearingStatus(`Found ${allKeys.length} total storage keys`);
      
      // Clear base chart cache using the service
      await baseChartService.clearAllCache();
      
      // Clear any other user-related cache that might contain stale data
      const userCacheKeys = allKeys.filter(key => 
        key.includes('mock-user') || 
        key.includes('user_') ||
        key.includes('profile_') ||
        key.includes('auth_') ||
        key.includes('token_')
      );
      
      if (userCacheKeys.length > 0) {
        console.log('🔑 Other user cache keys found:', userCacheKeys);
        await AsyncStorage.multiRemove(userCacheKeys);
        setClearingStatus(`✅ Cleared ${userCacheKeys.length} user cache entries`);
      }
      
      setClearingStatus('🎉 Cache clearing complete!');
      Alert.alert(
        'Cache Cleared', 
        'All cached data has been cleared. The app will now use fresh data from the server.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      setClearingStatus('❌ Failed to clear cache');
      Alert.alert('Error', 'Failed to clear cache: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    // Auto-clear cache when component mounts
    clearAllCache();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧹 Cache Clearer</Text>
      <Text style={styles.status}>{clearingStatus}</Text>
      
      {!isClearing && (
        <TouchableOpacity style={styles.button} onPress={clearAllCache}>
          <Text style={styles.buttonText}>Clear Cache Again</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.instructions}>
        Check the console for detailed logs
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CacheClearer;
