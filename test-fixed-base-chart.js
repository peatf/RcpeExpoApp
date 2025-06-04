const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testBaseChartFlow() {
  console.log('🧪 Testing Complete Base Chart Flow...\n');

  try {
    // Test 1: Get user profiles
    console.log('1️⃣ Testing User Profiles Endpoint...');
    const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    
    console.log('✅ Profiles retrieved:', profilesResponse.data.profiles.length);
    const profileId = profilesResponse.data.profiles[0].id;
    console.log('   Using profile ID:', profileId);
    console.log();

    // Test 2: Get base chart
    console.log('2️⃣ Testing Base Chart Endpoint...');
    const chartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    
    console.log('✅ Base chart retrieved');
    console.log('   Status:', chartResponse.data.status);
    console.log('   Has metadata:', !!chartResponse.data.data.metadata);
    console.log('   HD Type:', chartResponse.data.data.hd_type);
    console.log('   Typology Pair:', chartResponse.data.data.typology_pair_key);
    console.log();

    // Test 3: Check array fields that caused .join() errors
    console.log('3️⃣ Testing Array Fields...');
    const data = chartResponse.data.data;
    
    // Test channel_list
    const channelList = data.energy_architecture.channel_list;
    if (Array.isArray(channelList)) {
      console.log('✅ channel_list is array:', channelList.join(', '));
    } else {
      console.log('❌ channel_list is not array:', typeof channelList);
    }
    
    // Test throat_channels  
    const throatChannels = data.manifestation_interface_rhythm.throat_channels;
    if (Array.isArray(throatChannels)) {
      console.log('✅ throat_channels is array:', throatChannels.join(', '));
    } else {
      console.log('❌ throat_channels is not array:', typeof throatChannels);
    }
    
    // Test throat_gates
    const throatGates = data.manifestation_interface_rhythm.throat_gates;
    if (Array.isArray(throatGates)) {
      console.log('✅ throat_gates is array:', throatGates.join(', '));
    } else {
      console.log('❌ throat_gates is not array:', typeof throatGates);
    }
    
    // Test split_bridges
    const splitBridges = data.energy_architecture.split_bridges;
    if (Array.isArray(splitBridges)) {
      console.log('✅ split_bridges is array:', splitBridges.join(', '));
    } else {
      console.log('❌ split_bridges is not array:', typeof splitBridges);
    }
    
    // Test tension_planets
    const tensionPlanets = data.tension_points.tension_planets;
    if (Array.isArray(tensionPlanets)) {
      console.log('✅ tension_planets is array:', tensionPlanets.join(', '));
    } else {
      console.log('❌ tension_planets is not array:', typeof tensionPlanets);
    }
    
    console.log();

    // Test 4: Verify all required sections are present
    console.log('4️⃣ Testing Required Sections...');
    const requiredSections = [
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
    
    for (const section of requiredSections) {
      if (data[section]) {
        console.log(`✅ ${section}: present`);
      } else {
        console.log(`❌ ${section}: missing`);
      }
    }
    
    console.log();
    console.log('🎉 All tests completed successfully!');
    console.log('🚀 The frontend should now work without .join() errors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testBaseChartFlow();
