#!/usr/bin/env node
/**
 * Simple test to verify frontend service can fetch from mock server
 */

const axios = require('axios');

// Create a simple API client similar to the frontend
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-token-123'
  }
});

async function testFrontendFlow() {
  console.log('🧪 Testing Frontend Flow with Live Mock Server...\n');

  try {
    // Step 1: Get user profiles (like frontend does)
    console.log('1️⃣ Fetching user profiles...');
    const profilesResponse = await apiClient.get('/api/v1/user-data/users/me/profiles');
    
    console.log('📦 Profiles response:', {
      status: profilesResponse.status,
      profileCount: profilesResponse.data.profiles?.length,
      profiles: profilesResponse.data.profiles?.map(p => ({ id: p.id, name: p.name }))
    });

    const profiles = profilesResponse.data.profiles;
    if (!profiles || profiles.length === 0) {
      throw new Error('No profiles found for user');
    }

    const profileId = profiles[0].id;
    console.log('✅ Using profile ID:', profileId);

    // Step 2: Fetch base chart (main test)
    console.log('\n2️⃣ Fetching base chart...');
    const baseChartResponse = await apiClient.get(`/api/v1/profiles/${profileId}/base_chart`);
    
    console.log('📊 Base chart response:', {
      status: baseChartResponse.status,
      dataStatus: baseChartResponse.data.status,
      hasData: !!baseChartResponse.data.data
    });

    if (baseChartResponse.data.status !== 'success') {
      throw new Error('Base chart fetch was not successful');
    }

    const chartData = baseChartResponse.data.data;
    
    // Step 3: Validate complete response structure
    console.log('\n3️⃣ Validating response structure...');
    
    const requiredTopLevel = ['metadata', 'hd_type', 'typology_pair_key'];
    const synthesisCategories = [
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

    console.log('🔍 Top-level fields:');
    requiredTopLevel.forEach(field => {
      const present = chartData[field] !== undefined;
      console.log(`   ${present ? '✅' : '❌'} ${field}: ${present ? 'present' : 'missing'}`);
    });

    console.log('\n🔍 Synthesis categories:');
    const categoryResults = {};
    synthesisCategories.forEach(category => {
      const categoryData = chartData[category];
      const present = categoryData !== undefined;
      const hasContent = present && (
        typeof categoryData === 'object' ? Object.keys(categoryData).length > 0 : true
      );
      
      categoryResults[category] = { present, hasContent };
      const status = present && hasContent ? '✅' : present ? '⚠️' : '❌';
      const fieldCount = hasContent ? Object.keys(categoryData).length : 0;
      
      console.log(`   ${status} ${category}: ${present ? 'present' : 'missing'} ${hasContent ? `(${fieldCount} fields)` : '(empty)'}`);
    });

    // Step 4: Test specific synthesis category structures
    console.log('\n4️⃣ Testing specific category structures...');
    
    // Energy Family detailed check
    const ef = chartData.energy_family;
    if (ef) {
      console.log('🔍 Energy Family structure:');
      const efFields = ['profile_lines', 'conscious_line', 'unconscious_line', 'astro_sun_sign', 'astro_sun_house'];
      efFields.forEach(field => {
        const present = ef[field] !== undefined;
        console.log(`      ${present ? '✅' : '❌'} ${field}: ${present ? ef[field] : 'missing'}`);
      });
    }

    // Processing Core detailed check
    const pc = chartData.processing_core;
    if (pc) {
      console.log('🔍 Processing Core structure:');
      const pcFields = ['astro_moon_sign', 'astro_mercury_sign', 'head_state', 'ajna_state', 'emotional_state'];
      pcFields.forEach(field => {
        const present = pc[field] !== undefined;
        console.log(`      ${present ? '✅' : '❌'} ${field}: ${present ? pc[field] : 'missing'}`);
      });
    }

    // Step 5: Overall assessment
    console.log('\n5️⃣ Overall assessment...');
    
    const totalCategories = synthesisCategories.length;
    const completeCategories = Object.values(categoryResults).filter(r => r.present && r.hasContent).length;
    const partialCategories = Object.values(categoryResults).filter(r => r.present && !r.hasContent).length;
    const missingCategories = totalCategories - completeCategories - partialCategories;

    console.log(`📊 Category completion:`)
    console.log(`   ✅ Complete: ${completeCategories}/${totalCategories}`);
    console.log(`   ⚠️ Partial: ${partialCategories}/${totalCategories}`);
    console.log(`   ❌ Missing: ${missingCategories}/${totalCategories}`);

    const successRate = (completeCategories / totalCategories) * 100;
    console.log(`📈 Success rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 90) {
      console.log('\n🎉 EXCELLENT! Frontend-backend integration is working perfectly!');
    } else if (successRate >= 70) {
      console.log('\n✅ GOOD! Frontend-backend integration is mostly working!');
    } else {
      console.log('\n⚠️ NEEDS WORK! Frontend-backend integration has significant gaps!');
    }

    return {
      success: true,
      successRate,
      chartData,
      categoryResults
    };

  } catch (error) {
    console.error('❌ Frontend flow test failed:', error.message);
    if (error.response) {
      console.error('📄 Response status:', error.response.status);
      console.error('📄 Response data:', error.response.data);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testFrontendFlow()
  .then(result => {
    if (result.success && result.successRate >= 80) {
      console.log('\n✨ Frontend integration test PASSED!');
      process.exit(0);
    } else {
      console.log('\n💥 Frontend integration test FAILED or INCOMPLETE!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
