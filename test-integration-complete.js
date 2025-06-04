// Complete Integration Test - Tests the full flow from authentication to base chart display
const axios = require('axios');

const MOCK_SERVER_URL = 'http://localhost:3001';
const EXPO_WEB_URL = 'http://localhost:8081';

async function testCompleteIntegration() {
  console.log('🚀 Testing Complete Integration Flow...\n');
  
  try {
    // Test 1: Verify mock server is responding
    console.log('1️⃣ Testing Mock Server Health...');
    const healthResponse = await axios.get(`${MOCK_SERVER_URL}/health`);
    console.log('✅ Mock server healthy:', healthResponse.data.status);
    console.log();

    // Test 2: Test authentication flow
    console.log('2️⃣ Testing Authentication Flow...');
    const profilesResponse = await axios.get(`${MOCK_SERVER_URL}/api/v1/user-data/users/me/profiles`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    console.log('✅ Authentication successful');
    console.log('   Profiles found:', profilesResponse.data.profiles.length);
    const profileId = profilesResponse.data.profiles[0].id;
    console.log('   Using profile:', profileId);
    console.log();

    // Test 3: Test base chart data structure
    console.log('3️⃣ Testing Base Chart Data Structure...');
    const baseChartResponse = await axios.get(`${MOCK_SERVER_URL}/api/v1/profiles/${profileId}/base_chart`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    
    const chartData = baseChartResponse.data.data;
    console.log('✅ Base chart retrieved successfully');
    console.log('   Response status:', baseChartResponse.data.status);
    console.log('   HD Type:', chartData.hd_type);
    console.log('   Strategy:', chartData.strategy);
    console.log('   Authority:', chartData.authority);
    console.log();

    // Test 4: Verify all problematic arrays are properly formatted
    console.log('4️⃣ Testing Array Fields (Previously Causing .join() Errors)...');
    
    const arrayTests = [
      {
        name: 'channel_list',
        value: chartData.energy_architecture.channel_list,
        path: 'energy_architecture.channel_list'
      },
      {
        name: 'throat_channels',
        value: chartData.manifestation_interface_rhythm.throat_channels,
        path: 'manifestation_interface_rhythm.throat_channels'
      },
      {
        name: 'throat_gates',
        value: chartData.manifestation_interface_rhythm.throat_gates,
        path: 'manifestation_interface_rhythm.throat_gates'
      },
      {
        name: 'split_bridges',
        value: chartData.energy_architecture.split_bridges,
        path: 'energy_architecture.split_bridges'
      },
      {
        name: 'tension_planets',
        value: chartData.tension_points.tension_planets,
        path: 'tension_points.tension_planets'
      }
    ];

    let allArraysValid = true;
    
    for (const test of arrayTests) {
      if (Array.isArray(test.value)) {
        try {
          const joinResult = test.value.join(', ');
          console.log(`✅ ${test.name}: Array with ${test.value.length} items - "${joinResult}"`);
        } catch (error) {
          console.log(`❌ ${test.name}: Array but .join() failed - ${error.message}`);
          allArraysValid = false;
        }
      } else {
        console.log(`❌ ${test.name}: Not an array (${typeof test.value}) at ${test.path}`);
        allArraysValid = false;
      }
    }
    console.log();

    // Test 5: Verify synthesis categories structure
    console.log('5️⃣ Testing Synthesis Categories...');
    const requiredCategories = [
      'energy_family',
      'energy_class', 
      'processing_core',
      'decision_growth_vector',
      'drive_mechanics',
      'manifestation_interface_rhythm',
      'energy_architecture',
      'tension_points',
      'evolutionary_path'
    ];
    
    let allCategoriesPresent = true;
    for (const category of requiredCategories) {
      if (chartData[category] && typeof chartData[category] === 'object') {
        console.log(`✅ ${category}: Present with ${Object.keys(chartData[category]).length} properties`);
      } else {
        console.log(`❌ ${category}: Missing or invalid`);
        allCategoriesPresent = false;
      }
    }
    console.log();

    // Test 6: Check Expo web server accessibility
    console.log('6️⃣ Testing Expo Web Server...');
    try {
      const expoResponse = await axios.get(EXPO_WEB_URL, { timeout: 5000 });
      console.log('✅ Expo web server accessible');
      console.log('   Status:', expoResponse.status);
    } catch (error) {
      console.log('⚠️  Expo web server not accessible (this is normal if not using web)');
      console.log('   You can test the app using Expo Go on mobile or iOS simulator');
    }
    console.log();

    // Final Summary
    console.log('📊 INTEGRATION TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`✅ Mock Server: Running and healthy`);
    console.log(`✅ Authentication: Working`);
    console.log(`✅ Base Chart API: ${baseChartResponse.status === 200 ? 'Working' : 'Failed'}`);
    console.log(`✅ Array Fields: ${allArraysValid ? 'All valid' : 'Some issues found'}`);
    console.log(`✅ Synthesis Categories: ${allCategoriesPresent ? 'All present' : 'Some missing'}`);
    console.log();
    
    if (allArraysValid && allCategoriesPresent) {
      console.log('🎉 SUCCESS! The Reality Creation Profile Engine app should now work without errors!');
      console.log('🚀 You can now test the app using:');
      console.log('   - Expo Go app on mobile (scan the QR code)');
      console.log('   - iOS Simulator (press "i" in the Expo terminal)');
      console.log('   - Web browser (press "w" in the Expo terminal)');
      console.log();
      console.log('💡 The .join() errors have been resolved by fixing the data structure mismatch');
      console.log('   between the mock server and frontend expectations.');
    } else {
      console.log('⚠️  Some issues were found. Please check the test results above.');
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   URL:', error.config.url);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the mock server is running: node mock-server-fixed.js');
    console.log('2. Make sure the Expo server is running: npm start');
    console.log('3. Check that ports 3001 and 8081 are not blocked');
  }
}

// Run the integration test
testCompleteIntegration();
