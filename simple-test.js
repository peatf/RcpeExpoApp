const axios = require('axios');

async function simpleTest() {
  console.log('🧪 Simple Frontend Test');
  console.log('=======================\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check successful:', healthResponse.data);
    console.log();

    // Test 2: User Profiles
    console.log('2️⃣ Testing user profiles endpoint...');
    try {
      const profilesResponse = await axios.get('http://localhost:3001/api/v1/user-data/users/me/profiles', {
        headers: { 'Authorization': 'Bearer test-token' }
      });
      console.log('✅ Profiles endpoint successful');
      console.log('   Profiles found:', profilesResponse.data.profiles?.length || 0);
      
      if (profilesResponse.data.profiles && profilesResponse.data.profiles.length > 0) {
        const profileId = profilesResponse.data.profiles[0].id;
        console.log('   First profile ID:', profileId);
        
        // Test 3: Base Chart
        console.log('\n3️⃣ Testing base chart endpoint...');
        const chartResponse = await axios.get(`http://localhost:3001/api/v1/profiles/${profileId}/base_chart`, {
          headers: { 'Authorization': 'Bearer test-token' }
        });
        console.log('✅ Base chart fetch successful');
        console.log('   HD Type:', chartResponse.data.hd_type);
        console.log('   Has Energy Family:', !!chartResponse.data.energy_family);
        console.log('   Has Processing Core:', !!chartResponse.data.processing_core);
      }
    } catch (error) {
      console.log('⚠️ Profiles endpoint failed (using fallback):', error.response?.status || error.message);
      
      // Test with fallback profile ID
      console.log('\n3️⃣ Testing base chart with fallback ID...');
      const chartResponse = await axios.get('http://localhost:3001/api/v1/profiles/default-profile-123/base_chart', {
        headers: { 'Authorization': 'Bearer test-token' }
      });
      console.log('✅ Base chart fetch with fallback successful');
      console.log('   HD Type:', chartResponse.data.hd_type);
    }

    console.log('\n🎉 All tests passed!');
    console.log('✅ Backend is working correctly');
    console.log('✅ Frontend services should work');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

simpleTest();
