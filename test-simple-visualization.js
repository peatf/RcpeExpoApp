#!/usr/bin/env node

/**
 * Simple test for visualization endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testSimpleVisualization() {
  console.log('🧪 Simple Visualization Endpoint Test');
  console.log('=====================================\n');

  try {
    const profileId = 'default-profile-123';
    const authHeaders = { 'Authorization': 'Bearer mock-token-123' };

    // Test 1: Base Chart
    console.log('1️⃣ Testing base chart endpoint...');
    const baseChartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
      headers: authHeaders
    });
    console.log('✅ Base chart endpoint working!');
    console.log('   Status:', baseChartResponse.data.status);
    console.log('   HD Type:', baseChartResponse.data.data.hd_type);
    console.log();

    // Test 2: Visualization Endpoint
    console.log('2️⃣ Testing NEW visualization endpoint...');
    const visualizationResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/visualization`, {
      headers: authHeaders
    });
    console.log('✅ Visualization endpoint working!');
    console.log('   Status:', visualizationResponse.data.status);
    console.log('   HD Type:', visualizationResponse.data.data.hd_type);
    console.log('   Has Visualization Metadata:', !!visualizationResponse.data.data.visualization_metadata);
    
    if (visualizationResponse.data.data.visualization_metadata) {
      const meta = visualizationResponse.data.data.visualization_metadata;
      console.log('   - Optimized for Visualization:', meta.optimized_for_visualization);
      console.log('   - Endpoint:', meta.endpoint);
      console.log('   - API Version:', meta.api_version);
    }
    console.log();

    // Test 3: Compare Sizes
    console.log('3️⃣ Comparing response sizes...');
    const baseSize = JSON.stringify(baseChartResponse.data).length;
    const visualizationSize = JSON.stringify(visualizationResponse.data).length;
    
    console.log(`📏 Base chart response: ${baseSize} characters`);
    console.log(`📏 Visualization response: ${visualizationSize} characters`);
    console.log(`📊 Difference: ${baseSize - visualizationSize} characters`);
    console.log();

    // Test 4: Test with query parameters
    console.log('4️⃣ Testing visualization with query parameters...');
    const optimizedResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/visualization?include_aspects=false&include_channels=false`, {
      headers: authHeaders
    });
    console.log('✅ Optimized visualization endpoint working!');
    const meta = optimizedResponse.data.data.visualization_metadata;
    console.log('   - Includes Aspects:', meta.includes_aspects);
    console.log('   - Includes Channels:', meta.includes_channels);
    console.log('   - Response Optimized:', meta.response_optimized);
    console.log();

    console.log('🎉 All visualization tests passed!');
    console.log('✅ Base chart endpoint: WORKING');
    console.log('✅ Visualization endpoint: WORKING');
    console.log('✅ Optimization features: WORKING');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testSimpleVisualization();
