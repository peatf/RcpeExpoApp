#!/usr/bin/env node

/**
 * Test script to verify the complete profile creation and retrieval flow
 */

// Node.js 18+ has built-in fetch
// const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

async function testProfileFlow() {
  console.log('🧪 Testing Profile Creation Flow...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Profile Creation
    console.log('2️⃣ Testing profile creation...');
    const profilePayload = {
      birth_data: {
        birth_date: '1990-06-15',
        birth_time: '14:30',
        city_of_birth: 'New York',
        country_of_birth: 'USA'
      },
      assessment_responses: {
        typology: {
          'cognitive-alignment': 'analytical-intuitive',
          'perceptual-focus': 'external-patterns',
          'kinetic-drive': 'contemplative-action'
        },
        mastery: {
          'core-q1': 'creative-expression',
          'core-q2': 'intellectual-mastery'
        }
      }
    };

    const createResponse = await fetch(`${API_BASE_URL}/profile/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profilePayload)
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Profile creation failed: ${JSON.stringify(errorData)}`);
    }

    const createData = await createResponse.json();
    console.log('✅ Profile created:', createData);
    const profileId = createData.profile_id;
    console.log('');

    // Test 3: Profile Retrieval
    console.log('3️⃣ Testing profile retrieval...');
    const getResponse = await fetch(`${API_BASE_URL}/profile/${profileId}`);
    
    if (!getResponse.ok) {
      const errorData = await getResponse.json();
      throw new Error(`Profile retrieval failed: ${JSON.stringify(errorData)}`);
    }

    const profileData = await getResponse.json();
    console.log('✅ Profile retrieved:', JSON.stringify(profileData, null, 2));
    console.log('');

    // Test 4: Base Chart Retrieval
    console.log('4️⃣ Testing base chart retrieval...');
    const baseChartResponse = await fetch(`${API_BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
      headers: {
        'Authorization': 'Bearer mock-token-123'
      }
    });

    if (!baseChartResponse.ok) {
      const errorData = await baseChartResponse.json();
      throw new Error(`Base chart retrieval failed: ${JSON.stringify(errorData)}`);
    }

    const baseChartData = await baseChartResponse.json();
    console.log('✅ Base chart retrieved successfully');
    console.log('📊 Base chart metadata:', baseChartData.data.metadata);
    console.log('');

    // Test 5: User Profiles List
    console.log('5️⃣ Testing user profiles list...');
    const profilesResponse = await fetch(`${API_BASE_URL}/api/v1/user-data/users/me/profiles`, {
      headers: {
        'Authorization': 'Bearer mock-token-123'
      }
    });

    if (!profilesResponse.ok) {
      const errorData = await profilesResponse.json();
      throw new Error(`User profiles list failed: ${JSON.stringify(errorData)}`);
    }

    const profilesData = await profilesResponse.json();
    console.log('✅ User profiles list:', profilesData);
    console.log('');

    console.log('🎉 All tests passed! The complete profile flow is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testProfileFlow();
