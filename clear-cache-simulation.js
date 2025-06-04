#!/usr/bin/env node

/**
 * Manual cache clearing script using React Native AsyncStorage mock
 * This simulates clearing the cache that would be stored in the app
 */

// Mock AsyncStorage for Node.js environment
const mockAsyncStorage = {
  storage: new Map(),
  
  async getItem(key) {
    return this.storage.get(key) || null;
  },
  
  async setItem(key, value) {
    this.storage.set(key, value);
  },
  
  async removeItem(key) {
    this.storage.delete(key);
    console.log(`🗑️  Removed cache key: ${key}`);
  },
  
  async multiRemove(keys) {
    for (const key of keys) {
      this.storage.delete(key);
      console.log(`🗑️  Removed cache key: ${key}`);
    }
  },
  
  async getAllKeys() {
    return Array.from(this.storage.keys());
  },
  
  async clear() {
    const keys = Array.from(this.storage.keys());
    this.storage.clear();
    console.log(`🧹 Cleared all ${keys.length} cache entries`);
    return keys;
  }
};

// Simulate some cached data that might exist
const BASE_CHART_CACHE_KEY = 'userBaseChart_';

// Add some mock cached data to simulate what might be in the app
mockAsyncStorage.storage.set('userBaseChart_mock-user-123', JSON.stringify({
  energy_architecture: {
    channel_list: undefined // This would cause the join error
  },
  metadata: {
    user_id: 'mock-user-123'
  },
  fetchedAt: Date.now() - 1000000 // Old timestamp
}));

mockAsyncStorage.storage.set('userBaseChart_bob@example.com', JSON.stringify({
  energy_architecture: {
    channel_list: ['1-8', '7-31', '13-33']
  },
  metadata: {
    user_id: 'bob@example.com'
  },
  fetchedAt: Date.now() - 1000000 // Old timestamp
}));

mockAsyncStorage.storage.set('auth_token', 'old-auth-token');
mockAsyncStorage.storage.set('user_profile_data', 'old-profile-data');

async function clearAllCache() {
  console.log('🧹 Starting cache clear simulation...');
  
  try {
    // Get all keys
    const allKeys = await mockAsyncStorage.getAllKeys();
    console.log('📋 All storage keys:', allKeys);
    
    // Find base chart cache keys
    const baseChartKeys = allKeys.filter(key => key.startsWith(BASE_CHART_CACHE_KEY));
    console.log('🗃️ Base chart cache keys to clear:', baseChartKeys);
    
    if (baseChartKeys.length > 0) {
      await mockAsyncStorage.multiRemove(baseChartKeys);
      console.log(`✅ Cleared ${baseChartKeys.length} base chart cache entries`);
    } else {
      console.log('ℹ️  No base chart cache entries found');
    }
    
    // Also clear any other user-related cache
    const userKeys = allKeys.filter(key => 
      key.includes('mock-user') || 
      key.includes('user') || 
      key.includes('profile') ||
      key.includes('auth')
    );
    
    if (userKeys.length > 0) {
      console.log('🔑 Other user-related cache keys found:', userKeys);
      await mockAsyncStorage.multiRemove(userKeys);
      console.log(`✅ Cleared ${userKeys.length} user cache entries`);
    }
    
    console.log('🎉 Cache clearing simulation complete!');
    console.log('');
    console.log('📱 To clear actual app cache:');
    console.log('1. The app should be running with the CacheClearer component');
    console.log('2. Check the simulator/device console for clearing confirmation');
    console.log('3. Restart the app with the original App.tsx');
    
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
  }
}

// Run the simulation
clearAllCache();
