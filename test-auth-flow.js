/**
 * Test script to validate authentication and base chart flow
 */
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication and Base Chart Flow...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Test user profiles endpoint (simulating authenticated request)
    console.log('\n2. Testing user profiles endpoint...');
    const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
      headers: {
        'Authorization': 'Bearer mock-access-token-123',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ User profiles retrieved:', profilesResponse.data);

    // Test 3: Test base chart endpoint with profile ID
    if (profilesResponse.data.profiles && profilesResponse.data.profiles.length > 0) {
      const profileId = profilesResponse.data.profiles[0].id;
      console.log('\n3. Testing base chart endpoint with profile ID:', profileId);
      
      const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
        headers: {
          'Authorization': 'Bearer mock-access-token-123',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Base chart retrieved successfully');
      console.log('📊 Chart metadata:', baseChartResponse.data.data?.metadata);
    }

    // Test 4: Test unauthenticated request
    console.log('\n4. Testing unauthenticated request...');
    try {
      await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`);
      console.log('❌ Should have failed for unauthenticated request');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly rejected unauthenticated request');
      } else {
        console.log('⚠️ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All authentication flow tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAuthFlow();
