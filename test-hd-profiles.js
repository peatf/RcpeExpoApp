/**
 * Test Human Design Mock Profiles
 * This script tests all 5 Human Design type profiles and their authentication
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test credentials for all Human Design types
const HD_TEST_USERS = {
  generator: {
    name: 'Sarah Generator',
    email: 'generator@example.com',
    password: 'generator123',
    token: 'generator-token',
    expectedType: 'Generator'
  },
  manifestor: {
    name: 'Marcus Manifestor',
    email: 'manifestor@example.com',
    password: 'manifestor123', 
    token: 'manifestor-token',
    expectedType: 'Manifestor'
  },
  projector: {
    name: 'Patricia Projector',
    email: 'projector@example.com',
    password: 'projector123',
    token: 'projector-token',
    expectedType: 'Projector'
  },
  reflector: {
    name: 'Riley Reflector',
    email: 'reflector@example.com',
    password: 'reflector123',
    token: 'reflector-token',
    expectedType: 'Reflector'
  },
  manifestingGenerator: {
    name: 'Morgan ManGen',
    email: 'mangen@example.com',
    password: 'mangen123',
    token: 'mangen-token',
    expectedType: 'Manifesting Generator'
  }
};

async function testHumanDesignProfiles() {
  console.log('🧪 Testing Human Design Mock Profiles...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.data.status);
    
    // Test 2: Test each Human Design type
    console.log('\n2️⃣ Testing Human Design Type Profiles...');
    
    for (const [type, user] of Object.entries(HD_TEST_USERS)) {
      console.log(`\n🔮 Testing ${type.toUpperCase()} type (${user.name}):`);
      
      try {
        // Test authentication
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: ${user.password}`);
        console.log(`   🎫 Token: ${user.token}`);
        
        // Test profile retrieval
        const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (profilesResponse.data.profiles && profilesResponse.data.profiles.length > 0) {
          const profile = profilesResponse.data.profiles[0];
          console.log(`   ✅ Profile found: ${profile.name || 'Unknown'}`);
          console.log(`   📋 Profile ID: ${profile.id}`);
          
          // Test base chart retrieval
          const chartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profile.id}/base_chart`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (chartResponse.data && chartResponse.data.data) {
            const chartData = chartResponse.data.data;
            console.log(`   📊 HD Type: ${chartData.hd_type}`);
            console.log(`   🎯 Strategy: ${chartData.energy_family?.strategy || 'Not defined'}`);
            console.log(`   ⚖️ Authority: ${chartData.processing_core?.name || 'Not defined'}`);
            console.log(`   🔢 Profile: ${chartData.energy_family?.profile_lines || 'Not defined'}`);
            
            // Verify expected type matches
            if (chartData.hd_type === user.expectedType) {
              console.log(`   ✅ Type verification PASSED`);
            } else {
              console.log(`   ❌ Type verification FAILED: Expected ${user.expectedType}, got ${chartData.hd_type}`);
            }
          } else {
            console.log(`   ❌ Base chart data missing`);
          }
        } else {
          console.log(`   ❌ No profiles found for ${user.email}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing ${type}:`, error.response?.status, error.response?.statusText);
        if (error.response?.data) {
          console.log(`   📝 Error details:`, error.response.data);
        }
      }
    }
    
    // Test 3: Test unauthenticated request
    console.log('\n3️⃣ Testing unauthorized access...');
    try {
      await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`);
      console.log('❌ Should have failed for unauthenticated request');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly rejected unauthenticated request');
      } else {
        console.log('⚠️ Unexpected error status:', error.response?.status);
      }
    }
    
    console.log('\n🎉 Human Design Profile Testing Complete!');
    console.log('\n📋 LOGIN INFORMATION SUMMARY:');
    console.log('==========================================');
    
    Object.entries(HD_TEST_USERS).forEach(([type, user]) => {
      console.log(`\n${type.toUpperCase()} (${user.expectedType}):`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Token: ${user.token}`);
    });
    
    console.log('\n==========================================');
    console.log('💡 Use these credentials to log into the app and test each Human Design type!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testHumanDesignProfiles();
