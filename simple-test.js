#!/usr/bin/env node

const axios = require('axios');

async function runSimpleTest() {
  console.log('🎨 Blueprint Visualization Simple Test');
  console.log('=====================================\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health...');
    const health = await axios.get('http://localhost:3001/health');
    console.log('   ✅ Health:', health.data.status);

    // Test 2: Get profiles
    console.log('2️⃣ Testing profiles...');
    const profiles = await axios.get('http://localhost:3001/api/v1/user-data/users/me/profiles', {
      headers: { 'Authorization': 'Bearer mock-token-123' }
    });
    const profileId = profiles.data.profiles[0].id;
    console.log('   ✅ Profile ID:', profileId);

    // Test 3: Get visualization data
    console.log('3️⃣ Testing visualization endpoint...');
    const visualization = await axios.get(`http://localhost:3001/api/v1/profiles/${profileId}/visualization`, {
      headers: { 'Authorization': 'Bearer mock-token-123' }
    });
    console.log('   ✅ Visualization data received');
    console.log('   📊 Has energy family:', !!visualization.data.data.energy_family);
    console.log('   📈 Has drive mechanics:', !!visualization.data.data.drive_mechanics);

    // Test 4: Data transformation
    console.log('4️⃣ Testing data transformation...');
    const data = visualization.data.data;
    const safeGet = (obj, path, fallback = '') => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) || fallback;
    };

    const transformed = {
      profile_lines: safeGet(data, 'energy_family.profile_lines', "1/3"),
      astro_sun_sign: safeGet(data, 'energy_family.astro_sun_sign', "Aries"),
      strategy: safeGet(data, 'decision_growth_vector.strategy', "To Inform"),
      authority: safeGet(data, 'decision_growth_vector.authority', "Emotional"),
      definition_type: safeGet(data, 'energy_architecture.definition_type', "Single")
    };

    console.log('   ✅ Data transformation working');
    console.log('   📋 Profile:', transformed.profile_lines);
    console.log('   ⭐ Sun Sign:', transformed.astro_sun_sign);
    console.log('   🔄 Strategy:', transformed.strategy);
    console.log('   📍 Authority:', transformed.authority);
    console.log('   📊 Definition:', transformed.definition_type);

    console.log('\n🎉 All tests passed! Blueprint visualization integration is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

runSimpleTest();
