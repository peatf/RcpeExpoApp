/**
 * Simple script to clear AsyncStorage cache for the app
 * This will clear all cached base chart data
 */

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAllCache() {
  try {
    console.log('Clearing all AsyncStorage cache...');
    
    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('Found keys:', allKeys);
    
    // Find base chart cache keys
    const baseChartKeys = allKeys.filter(key => key.startsWith('userBaseChart_'));
    console.log('Base chart cache keys to clear:', baseChartKeys);
    
    if (baseChartKeys.length > 0) {
      await AsyncStorage.multiRemove(baseChartKeys);
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
      console.log('Other user-related cache keys found:', userKeys);
      await AsyncStorage.multiRemove(userKeys);
      console.log(`✅ Cleared ${userKeys.length} user cache entries`);
    }
    
    console.log('🎉 Cache clearing complete!');
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  clearAllCache().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { clearAllCache };
