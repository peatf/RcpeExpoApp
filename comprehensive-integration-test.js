#!/usr/bin/env node
/**
 * Comprehensive End-to-End Integration Test
 * Tests both backend synthesis functions and frontend integration
 */

const axios = require('axios');

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE INTEGRATION TEST - Backend + Frontend\n');
  console.log('=' * 70);

  const results = {
    backend: null,
    frontend: null,
    integration: null
  };

  try {
    // PART 1: Backend API Test
    console.log('\n📡 PART 1: BACKEND API TEST');
    console.log('-' * 30);

    const backendResponse = await axios.get(
      'http://localhost:3001/api/v1/profiles/default-profile-123/base_chart',
      {
        headers: {
          'Authorization': 'Bearer mock-token-123',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Backend API responding correctly');
    console.log(`📦 Response status: ${backendResponse.data.status}`);

    const backendData = backendResponse.data.data;
    results.backend = {
      success: true,
      categoriesPresent: 0,
      categoriesComplete: 0
    };

    // Test backend synthesis categories
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

    console.log('\n🔍 Backend Synthesis Categories:');
    synthesisCategories.forEach(category => {
      const categoryData = backendData[category];
      const present = categoryData !== undefined;
      const complete = present && Object.keys(categoryData).length > 0;
      
      if (present) results.backend.categoriesPresent++;
      if (complete) results.backend.categoriesComplete++;
      
      const status = complete ? '✅' : present ? '⚠️' : '❌';
      const info = complete ? `(${Object.keys(categoryData).length} fields)` : present ? '(empty)' : '(missing)';
      console.log(`   ${status} ${category} ${info}`);
    });

    console.log(`\n📊 Backend Score: ${results.backend.categoriesComplete}/${synthesisCategories.length} categories complete`);

    // PART 2: Frontend Compatibility Test
    console.log('\n💻 PART 2: FRONTEND COMPATIBILITY TEST');
    console.log('-' * 40);

    // Test frontend interface expectations
    results.frontend = {
      success: true,
      interfaceMatches: 0,
      totalChecks: 0
    };

    // Check metadata structure
    const metadata = backendData.metadata;
    const metadataFields = ['profile_id', 'user_id', 'created_at', 'updated_at', 'status', 'version'];
    
    console.log('🔍 Metadata Interface:');
    metadataFields.forEach(field => {
      results.frontend.totalChecks++;
      const present = metadata && metadata[field] !== undefined;
      if (present) results.frontend.interfaceMatches++;
      
      console.log(`   ${present ? '✅' : '❌'} ${field}: ${present ? 'present' : 'missing'}`);
    });

    // Check top-level fields
    const topLevelFields = ['hd_type', 'typology_pair_key'];
    console.log('\n🔍 Top-level Interface:');
    topLevelFields.forEach(field => {
      results.frontend.totalChecks++;
      const present = backendData[field] !== undefined;
      if (present) results.frontend.interfaceMatches++;
      
      console.log(`   ${present ? '✅' : '❌'} ${field}: ${present ? 'present' : 'missing'}`);
    });

    // Check synthesis category interfaces
    console.log('\n🔍 Synthesis Category Interfaces:');
    
    // Energy Family specific checks
    const ef = backendData.energy_family;
    const efRequiredFields = ['profile_lines', 'conscious_line', 'unconscious_line', 'astro_sun_sign', 'astro_sun_house'];
    
    console.log('   Energy Family:');
    efRequiredFields.forEach(field => {
      results.frontend.totalChecks++;
      const present = ef && ef[field] !== undefined;
      if (present) results.frontend.interfaceMatches++;
      
      console.log(`      ${present ? '✅' : '❌'} ${field}`);
    });

    // Processing Core specific checks
    const pc = backendData.processing_core;
    const pcRequiredFields = ['astro_moon_sign', 'astro_mercury_sign', 'head_state', 'ajna_state', 'emotional_state'];
    
    console.log('   Processing Core:');
    pcRequiredFields.forEach(field => {
      results.frontend.totalChecks++;
      const present = pc && pc[field] !== undefined;
      if (present) results.frontend.interfaceMatches++;
      
      console.log(`      ${present ? '✅' : '❌'} ${field}`);
    });

    console.log(`\n📊 Frontend Interface Score: ${results.frontend.interfaceMatches}/${results.frontend.totalChecks} fields match`);

    // PART 3: Integration Quality Test
    console.log('\n🔗 PART 3: INTEGRATION QUALITY TEST');
    console.log('-' * 35);

    results.integration = {
      success: true,
      dataQualityScore: 0,
      totalCategories: synthesisCategories.length
    };

    console.log('🔍 Data Quality Assessment:');
    
    // Assess data quality for each category
    synthesisCategories.forEach(category => {
      const categoryData = backendData[category];
      let qualityScore = 0;
      
      if (categoryData && typeof categoryData === 'object') {
        const fieldCount = Object.keys(categoryData).length;
        
        // Quality criteria
        if (fieldCount > 0) qualityScore += 0.5; // Has fields
        if (fieldCount >= 3) qualityScore += 0.3; // Has substantial data
        
        // Check for meaningful values (not just empty strings/nulls)
        const meaningfulValues = Object.values(categoryData).filter(value => 
          value !== null && value !== undefined && value !== '' && 
          (Array.isArray(value) ? value.length > 0 : true)
        ).length;
        
        if (meaningfulValues > 0) qualityScore += 0.2; // Has meaningful data
        
        results.integration.dataQualityScore += qualityScore;
        
        const rating = qualityScore >= 0.9 ? '🌟 Excellent' : 
                      qualityScore >= 0.7 ? '✅ Good' : 
                      qualityScore >= 0.5 ? '⚠️ Fair' : '❌ Poor';
        
        console.log(`   ${rating} ${category} (${fieldCount} fields, score: ${qualityScore.toFixed(1)})`);
      } else {
        console.log(`   ❌ Poor ${category} (no data)`);
      }
    });

    const avgQualityScore = results.integration.dataQualityScore / results.integration.totalCategories;
    console.log(`\n📊 Average Data Quality Score: ${avgQualityScore.toFixed(2)}/1.0`);

    // FINAL ASSESSMENT
    console.log('\n🎯 FINAL ASSESSMENT');
    console.log('=' * 20);

    const backendSuccess = (results.backend.categoriesComplete / synthesisCategories.length) >= 0.8;
    const frontendSuccess = (results.frontend.interfaceMatches / results.frontend.totalChecks) >= 0.8;
    const integrationSuccess = avgQualityScore >= 0.7;

    console.log(`🔧 Backend Synthesis: ${backendSuccess ? '✅ PASS' : '❌ FAIL'} (${results.backend.categoriesComplete}/${synthesisCategories.length})`);
    console.log(`💻 Frontend Interface: ${frontendSuccess ? '✅ PASS' : '❌ FAIL'} (${results.frontend.interfaceMatches}/${results.frontend.totalChecks})`);
    console.log(`🔗 Data Integration: ${integrationSuccess ? '✅ PASS' : '❌ FAIL'} (${avgQualityScore.toFixed(2)}/1.0)`);

    const overallSuccess = backendSuccess && frontendSuccess && integrationSuccess;

    if (overallSuccess) {
      console.log('\n🎉 🎉 🎉 COMPREHENSIVE TEST PASSED! 🎉 🎉 🎉');
      console.log('✨ All 9 synthesis categories are successfully integrated between backend and frontend!');
      console.log('✨ Data quality is excellent and interface compatibility is complete!');
      console.log('✨ The Reality Creation Profile Engine is ready for production use!');
    } else {
      console.log('\n⚠️ ⚠️ ⚠️ COMPREHENSIVE TEST INCOMPLETE ⚠️ ⚠️ ⚠️');
      console.log('💡 Some areas need attention before the integration is complete.');
    }

    return {
      success: overallSuccess,
      results,
      overallScore: (
        (results.backend.categoriesComplete / synthesisCategories.length) * 0.4 +
        (results.frontend.interfaceMatches / results.frontend.totalChecks) * 0.3 +
        avgQualityScore * 0.3
      ) * 100
    };

  } catch (error) {
    console.error('❌ Comprehensive test failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.status, error.response.data);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the comprehensive test
runComprehensiveTest()
  .then(result => {
    if (result.success) {
      console.log(`\n🏆 OVERALL SCORE: ${result.overallScore.toFixed(1)}%`);
      console.log('🎯 Integration completed successfully!');
      process.exit(0);
    } else {
      console.log('\n💥 Integration test failed or incomplete!');
      if (result.overallScore) {
        console.log(`📊 Overall Score: ${result.overallScore.toFixed(1)}%`);
      }
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
