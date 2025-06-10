#!/usr/bin/env node

/**
 * Test scr        // Test 3: Base Chart (for comparison)
        console.log('3️⃣ Testing base chart endpoint...');
        const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        }); to verify the new chart visualization endpoint is working
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_USER_ID = 'mock-user-123';

async function testVisualizationEndpoint() {
  console.log('🧪 Testing Chart Visualization Endpoint');
  console.log('==========================================\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log();

    // Test 2: User Profiles (with auth)
    console.log('2️⃣ Testing user profiles endpoint...');
    try {
      const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
        headers: {
          'Authorization': 'Bearer mock-token-123'
        }
      });
      console.log('✅ User profiles retrieved:', profilesResponse.data);
      
      if (profilesResponse.data.profiles && profilesResponse.data.profiles.length > 0) {
        const profileId = profilesResponse.data.profiles[0].id;
        console.log(`📋 Using profile ID: ${profileId}\n`);
        
        // Test 3: Base Chart (for comparison)
        console.log('3️⃣ Testing base chart endpoint...');
        const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        });
        console.log('✅ Base chart retrieved successfully!');
        console.log('📊 Base chart data structure:');
        console.log('  - Status:', baseChartResponse.data.status);
        console.log('  - HD Type:', baseChartResponse.data.data.hd_type);
        console.log('  - Has Energy Family:', !!baseChartResponse.data.data.energy_family);
        console.log('  - Has Processing Core:', !!baseChartResponse.data.data.processing_core);
        console.log();

        // Test 4: NEW Visualization Endpoint
        console.log('4️⃣ Testing NEW visualization endpoint...');
        try {
          const visualizationResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/visualization`, {
            headers: {
              'Authorization': 'Bearer mock-token-123'
            }
          });
          console.log('✅ Visualization endpoint retrieved successfully!');
          console.log('🎨 Visualization data structure:');
          console.log('  - Status:', visualizationResponse.data.status);
          console.log('  - HD Type:', visualizationResponse.data.data.hd_type);
          console.log('  - Has Energy Family:', !!visualizationResponse.data.data.energy_family);
          console.log('  - Has Processing Core:', !!visualizationResponse.data.data.processing_core);
          console.log('  - Has Visualization Metadata:', !!visualizationResponse.data.data.visualization_metadata);
          
          if (visualizationResponse.data.data.visualization_metadata) {
            console.log('  - Optimized for Visualization:', visualizationResponse.data.data.visualization_metadata.optimized_for_visualization);
            console.log('  - API Version:', visualizationResponse.data.data.visualization_metadata.api_version);
          }
          console.log();

          // Test 5: Compare data sizes
          console.log('5️⃣ Comparing endpoint data sizes...');
          const baseChartSize = JSON.stringify(baseChartResponse.data).length;
          const visualizationSize = JSON.stringify(visualizationResponse.data).length;
          
          console.log(`📏 Base chart response size: ${baseChartSize} characters`);
          console.log(`📏 Visualization response size: ${visualizationSize} characters`);
          console.log(`📊 Size difference: ${baseChartSize - visualizationSize} characters`);
          console.log();

        } catch (visualizationError) {
          console.log('❌ Visualization endpoint failed:', visualizationError.response?.status || visualizationError.message);
          if (visualizationError.response?.data) {
            console.log('Error details:', visualizationError.response.data);
          }
          console.log('⚠️ This means the new endpoint is not available yet or has an error');
        }
      }
    } catch (authError) {
      console.log('⚠️ Auth required for profiles endpoint (expected)');
      console.log('🔄 Testing with fallback profile ID...');
      
      // Test with default profile ID
      const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/default-profile-123/base_chart`, {
        headers: {
          'Authorization': 'Bearer mock-token-123'
        }
      });
      console.log('✅ Base chart retrieved with fallback profile!');
      console.log();

      // Test visualization endpoint with fallback
      try {
        const visualizationResponse = await axios.get(`${BASE_URL}/api/v1/profiles/default-profile-123/visualization`, {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        });
        console.log('✅ Visualization endpoint working with fallback profile!');
      } catch (error) {
        console.log('❌ Visualization endpoint not available:', error.response?.status || error.message);
      }
    }

    console.log('🎉 Visualization endpoint tests completed!');
    console.log('✅ Backend connectivity: WORKING');
    console.log('✅ Base chart functionality: WORKING');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the tests
testVisualizationEndpoint();
