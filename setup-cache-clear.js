#!/usr/bin/env node

/**
 * Mobile App Cache Clearing Utility
 * This clears the React Native AsyncStorage cache by creating a temporary script
 */

const fs = require('fs');
const path = require('path');

// Create a cache clearing React Native component
const cacheClearingComponent = `
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CacheClearer = () => {
  useEffect(() => {
    const clearCache = async () => {
      try {
        console.log('🧹 Starting cache clear...');
        
        // Get all keys
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('📋 All storage keys:', allKeys);
        
        // Clear all base chart cache
        const baseChartKeys = allKeys.filter(key => key.startsWith('userBaseChart_'));
        console.log('🗃️ Base chart cache keys:', baseChartKeys);
        
        if (baseChartKeys.length > 0) {
          await AsyncStorage.multiRemove(baseChartKeys);
          console.log(\`✅ Cleared \${baseChartKeys.length} base chart cache entries\`);
        }
        
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
          console.log(\`✅ Cleared \${userCacheKeys.length} user cache entries\`);
        }
        
        console.log('🎉 Cache clearing complete!');
        Alert.alert('Cache Cleared', 'All cached data has been cleared. Please restart the app.');
        
      } catch (error) {
        console.error('❌ Failed to clear cache:', error);
        Alert.alert('Error', 'Failed to clear cache: ' + error.message);
      }
    };
    
    clearCache();
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>
        🧹 Clearing Cache...
      </Text>
      <Text style={{ marginTop: 10, textAlign: 'center', color: '#666' }}>
        Check console for details
      </Text>
    </View>
  );
};

export default CacheClearer;
`;

// Write the cache clearing component
const componentPath = path.join(__dirname, 'src', 'components', 'CacheClearer.tsx');
fs.writeFileSync(componentPath, cacheClearingComponent);

console.log('✅ Created cache clearing component at:', componentPath);
console.log('');
console.log('📋 Instructions:');
console.log('1. Import this component in your app temporarily');
console.log('2. Replace your main component with <CacheClearer />');
console.log('3. Run the app to clear cache');
console.log('4. Restart the app and revert to original component');
console.log('');
console.log('OR run the React Native development server with --reset-cache flag');
