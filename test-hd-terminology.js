// Test Human Design Terminology Fix
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testHumanDesignTerminology() {
  console.log('🧪 Testing Human Design Terminology Fix...\n');

  try {
    // Get profiles first
    const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    const profileId = profilesResponse.data.profiles[0].id;

    // Get base chart
    const chartResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
      headers: { Authorization: 'Bearer mock-token-123' }
    });
    
    const driveMechanics = chartResponse.data.data.drive_mechanics;
    
    console.log('🔍 Testing Drive Mechanics Human Design Fields...\n');
    
    // Test Motivation Color
    console.log('1️⃣ Motivation Color:');
    console.log(`   Value: "${driveMechanics.motivation_color}"`);
    const isValidMotivation = driveMechanics.motivation_color.includes('–') && 
                             (driveMechanics.motivation_color.includes('Strategic') || 
                              driveMechanics.motivation_color.includes('Receptive'));
    console.log(`   ✅ Valid HD terminology: ${isValidMotivation ? 'YES' : 'NO'}`);
    console.log(`   ❌ Old format (Red/Blue/etc): ${isValidMotivation ? 'NO' : 'YES'}`);
    console.log();

    // Test Perspective Variable
    console.log('2️⃣ Perspective Variable:');
    console.log(`   Value: "${driveMechanics.perspective_variable}"`);
    const isValidPerspective = driveMechanics.perspective_variable.includes('(') && 
                              (driveMechanics.perspective_variable.includes('Focused') || 
                               driveMechanics.perspective_variable.includes('Peripheral'));
    console.log(`   ✅ Valid HD terminology: ${isValidPerspective ? 'YES' : 'NO'}`);
    console.log(`   ❌ Old format (Strategic/Personal/etc): ${isValidPerspective ? 'NO' : 'YES'}`);
    console.log();

    // Test other fields
    console.log('3️⃣ Other HD Fields:');
    console.log(`   Heart State: ${driveMechanics.heart_state}`);
    console.log(`   Root State: ${driveMechanics.root_state}`);
    console.log(`   Kinetic Drive: ${driveMechanics.kinetic_drive_spectrum}`);
    console.log(`   Resonance Field: ${driveMechanics.resonance_field_spectrum}`);
    console.log();

    // Test that all expected motivations are in the pool
    console.log('4️⃣ Testing Multiple Requests for Variety...');
    const motivations = new Set();
    const perspectives = new Set();
    
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/base_chart`, {
        headers: { Authorization: 'Bearer mock-token-123' }
      });
      motivations.add(response.data.data.drive_mechanics.motivation_color);
      perspectives.add(response.data.data.drive_mechanics.perspective_variable);
    }
    
    console.log(`   Motivation varieties found: ${motivations.size}`);
    console.log(`   Perspective varieties found: ${perspectives.size}`);
    console.log();
    
    console.log('5️⃣ Sample Values:');
    console.log('   Motivations:');
    Array.from(motivations).slice(0, 3).forEach(m => console.log(`     • ${m}`));
    console.log('   Perspectives:');
    Array.from(perspectives).slice(0, 3).forEach(p => console.log(`     • ${p}`));
    console.log();

    if (isValidMotivation && isValidPerspective) {
      console.log('🎉 SUCCESS: Human Design terminology is now properly implemented!');
      console.log('✅ Frontend should display proper HD terminology instead of colors');
    } else {
      console.log('❌ ISSUE: Some fields still use incorrect terminology');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHumanDesignTerminology();
