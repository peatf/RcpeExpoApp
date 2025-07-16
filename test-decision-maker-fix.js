/**
 * Test script to verify Decision Maker tool gets correct HD type
 */

const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

// Test profiles
const TEST_PROFILES = [
  { email: 'generator@example.com', password: 'generator123', expectedType: 'Generator' },
  { email: 'manifestor@example.com', password: 'manifestor123', expectedType: 'Manifestor' },
  { email: 'projector@example.com', password: 'projector123', expectedType: 'Projector' },
  { email: 'reflector@example.com', password: 'reflector123', expectedType: 'Reflector' },
  { email: 'mangen@example.com', password: 'mangen123', expectedType: 'Manifesting Generator' }
];

async function loginUser(email, password) {
  console.log(`\n🔑 Logging in as ${email}...`);
  
  // Mock login - just return the token format expected by server
  const token = email.replace('@example.com', '-token');
  console.log(`✅ Login successful, token: ${token}`);
  return token;
}

async function getBaseChart(token) {
  console.log('📊 Fetching base chart...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/profiles/default-profile-123/base_chart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      console.log(`✅ Base chart fetched successfully`);
      console.log(`   HD Type: ${data.data.hd_type}`);
      console.log(`   Strategy: ${data.data.decision_growth_vector?.strategy || 'N/A'}`);
      console.log(`   Authority: ${data.data.decision_growth_vector?.authority || 'N/A'}`);
      return data.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ Failed to fetch base chart:', error.message);
    return null;
  }
}

async function testProfile(profile) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing ${profile.expectedType} Profile: ${profile.email}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    // Login
    const token = await loginUser(profile.email, profile.password);
    
    // Get base chart
    const baseChart = await getBaseChart(token);
    
    if (baseChart) {
      // Verify HD type matches expected
      if (baseChart.hd_type === profile.expectedType) {
        console.log(`✅ PASS: HD Type matches expected (${profile.expectedType})`);
        return true;
      } else {
        console.log(`❌ FAIL: HD Type mismatch!`);
        console.log(`   Expected: ${profile.expectedType}`);
        console.log(`   Got: ${baseChart.hd_type}`);
        return false;
      }
    } else {
      console.log(`❌ FAIL: Could not fetch base chart`);
      return false;
    }
  } catch (error) {
    console.log(`❌ FAIL: Test error - ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Testing Decision Maker HD Type Detection Fix');
  console.log('This verifies that each profile returns the correct HD type from base chart');
  
  let passed = 0;
  let failed = 0;
  
  for (const profile of TEST_PROFILES) {
    const success = await testProfile(profile);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 TEST SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${TEST_PROFILES.length}`);
  
  if (failed === 0) {
    console.log(`\n🎉 ALL TESTS PASSED! Decision Maker should now show correct tools for each HD type.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Check the base chart endpoint implementation.`);
  }
}

// Run the tests
runAllTests().catch(console.error);
