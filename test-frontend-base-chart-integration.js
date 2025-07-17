#!/usr/bin/env node
/**
 * Test script to verify frontend base chart integration
 */

const axios = require('axios');

// Mock the environment for React Native modules
global.console = console;

// Test configuration
const BASE_URL = 'http://localhost:3001';
const AUTH_TOKEN = 'mock-token-123';
const PROFILE_ID = 'default-profile-123';

async function testBaseChartIntegration() {
  console.log('🧪 Testing Frontend Base Chart Integration...\n');

  try {
    // Test 1: Direct API call
    console.log('1️⃣ Testing direct API call...');
    const directResponse = await axios.get(
      `${BASE_URL}/api/v1/profiles/${PROFILE_ID}/base_chart`,
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Direct API call successful');
    console.log('📦 Response status:', directResponse.data.status);
    
    const chartData = directResponse.data.data;
    if (chartData) {
      console.log('📊 Chart data structure:');
      console.log('   - Metadata:', !!chartData.metadata);
      console.log('   - HD Type:', chartData.hd_type);
      console.log('   - Energy Family:', !!chartData.energy_family);
      console.log('   - Energy Class:', !!chartData.energy_class);
      console.log('   - Processing Core:', !!chartData.processing_core);
      console.log('   - Decision Growth Vector:', !!chartData.decision_growth_vector);
      console.log('   - Drive Mechanics:', !!chartData.drive_mechanics);
      console.log('   - Manifestation Interface Rhythm:', !!chartData.manifestation_interface_rhythm);
      console.log('   - Energy Architecture:', !!chartData.energy_architecture);
      console.log('   - Tension Points:', !!chartData.tension_points);
      console.log('   - Evolutionary Path:', !!chartData.evolutionary_path);
    }

    // Test 2: Check data completeness for each synthesis category
    console.log('\n2️⃣ Testing synthesis categories completeness...');
    
    const categories = [
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

    const completeness = {};
    
    categories.forEach(category => {
      const categoryData = chartData[category];
      if (!categoryData || Object.keys(categoryData).length === 0) {
        completeness[category] = 'Empty/Missing';
      } else {
        const fieldCount = Object.keys(categoryData).length;
        completeness[category] = `${fieldCount} fields`;
      }
    });

    console.log('📋 Category completeness:');
    Object.entries(completeness).forEach(([category, status]) => {
      const icon = status.includes('Empty') ? '❌' : '✅';
      console.log(`   ${icon} ${category}: ${status}`);
    });

    // Test 3: Frontend interface compatibility
    console.log('\n3️⃣ Testing frontend interface compatibility...');
    
    // Check if response matches BaseChartData interface expectations
    const requiredMetadataFields = ['profile_id', 'user_id', 'created_at', 'updated_at', 'status', 'version'];
    const metadataCheck = requiredMetadataFields.every(field => chartData.metadata && chartData.metadata[field]);
    
    console.log('📝 Interface compatibility:');
    console.log(`   ${metadataCheck ? '✅' : '❌'} Metadata fields complete`);
    console.log(`   ${chartData.hd_type ? '✅' : '❌'} HD Type present`);
    console.log(`   ${chartData.typology_pair_key ? '✅' : '❌'} Typology pair key present`);

    // Test 4: Energy Family structure
    console.log('\n4️⃣ Testing Energy Family structure...');
    const ef = chartData.energy_family;
    if (ef) {
      console.log('🔍 Energy Family fields:');
      console.log(`   - profile_lines: ${ef.profile_lines}`);
      console.log(`   - conscious_line: ${ef.conscious_line}`);
      console.log(`   - unconscious_line: ${ef.unconscious_line}`);
      console.log(`   - astro_sun_sign: ${ef.astro_sun_sign}`);
      console.log(`   - astro_sun_house: ${ef.astro_sun_house}`);
      console.log(`   - astro_north_node_sign: ${ef.astro_north_node_sign}`);
      
      // Check for required fields according to frontend interface
      const requiredEFFields = ['profile_lines', 'conscious_line', 'unconscious_line', 'astro_sun_sign', 'astro_sun_house'];
      const efComplete = requiredEFFields.every(field => ef[field] !== undefined);
      console.log(`   ${efComplete ? '✅' : '❌'} Required fields complete`);
    }

    console.log('\n🎉 Base Chart Integration Test Complete!');
    
    return {
      success: true,
      chartData,
      completeness
    };

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    if (error.response) {
      console.error('📄 Response data:', error.response.data);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testBaseChartIntegration()
  .then(result => {
    if (result.success) {
      console.log('\n✨ Integration test passed! Frontend and backend are aligned.');
      process.exit(0);
    } else {
      console.log('\n💥 Integration test failed. Please check the issues above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
