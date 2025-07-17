#!/usr/bin/env node
/**
 * Test frontend baseChartService against mock server
 */

// Mock React Native modules
const AsyncStorageMock = {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve())
};

global.AsyncStorage = AsyncStorageMock;

// Mock the entire AsyncStorage module
jest.mock('@react-native-async-storage/async-storage', () => AsyncStorageMock);

// Mock axios for API client
const axios = require('axios');

const mockAxios = {
  create: jest.fn(() => mockAxios),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

// Set up axios mock responses
mockAxios.get.mockImplementation((url) => {
  console.log('Mock API call to:', url);
  
  if (url.includes('/api/v1/user-data/users/me/profiles')) {
    return Promise.resolve({
      status: 200,
      data: {
        profiles: [
          {
            id: 'default-profile-123',
            user_id: 'mock-user-123',
            name: 'Test Profile',
            status: 'completed'
          }
        ],
        total: 1
      }
    });
  }
  
  if (url.includes('/api/v1/profiles/default-profile-123/base_chart')) {
    return Promise.resolve({
      status: 200,
      data: {
        status: 'success',
        data: {
          metadata: {
            profile_id: 'default-profile-123',
            user_id: 'mock-user-123',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'completed',
            version: '1.0'
          },
          hd_type: 'Manifestor',
          typology_pair_key: 'ENFP-Leo',
          energy_family: {
            profile_lines: '6/2',
            conscious_line: 6,
            unconscious_line: 2,
            astro_sun_sign: 'Gemini',
            astro_sun_house: 5,
            astro_north_node_sign: 'Gemini'
          },
          energy_class: {
            ascendant_sign: 'Virgo',
            chart_ruler_sign: 'Mercury',
            chart_ruler_house: 11,
            incarnation_cross: 'Right Angle Cross of Eden',
            incarnation_cross_quarter: 'Quarter of Initiation',
            profile_type: 'Role Model/Hermit'
          },
          processing_core: {
            astro_moon_sign: 'Pisces',
            astro_moon_house: 7,
            astro_mercury_sign: 'Cancer',
            astro_mercury_house: 11,
            head_state: 'Defined',
            ajna_state: 'Undefined',
            emotional_state: 'Defined',
            cognition_variable: 'Strategic',
            chiron_gate: 51
          },
          decision_growth_vector: {
            strategy: 'To Inform',
            authority: 'Emotional',
            choice_navigation_spectrum: 'Measured response',
            astro_mars_sign: 'Aries',
            north_node_house: 3
          },
          drive_mechanics: {
            motivation_color: 'Need',
            heart_state: 'Defined',
            root_state: 'Undefined',
            venus_sign: 'Taurus',
            kinetic_drive_spectrum: 'Sustainable momentum',
            resonance_field_spectrum: 'Magnetic attraction',
            perspective_variable: 'Active'
          },
          manifestation_interface_rhythm: {
            throat_definition: 'Connected',
            throat_gates: [20, 31, 8],
            throat_channels: ['20-34', '31-7'],
            manifestation_rhythm_spectrum: 'Rhythmic manifestation'
          },
          energy_architecture: {
            definition_type: 'Single Definition',
            channel_list: ['20-34', '31-7', '1-8'],
            split_bridges: []
          },
          tension_points: {
            chiron_gate: 51,
            tension_planets: ['Mars square Saturn', 'Moon opposite Pluto']
          },
          evolutionary_path: {
            g_center_access: 'Fixed Identity',
            incarnation_cross: 'Right Angle Cross of Eden',
            astro_north_node_sign: 'Gemini',
            astro_north_node_house: 3,
            conscious_line: 6,
            unconscious_line: 2,
            core_priorities: ['Expression', 'Connection', 'Growth']
          }
        }
      }
    });
  }
  
  return Promise.reject(new Error('Unknown endpoint'));
});

// Mock the api module
jest.mock('../src/services/api', () => mockAxios);

async function testFrontendService() {
  console.log('🧪 Testing Frontend BaseChartService...\n');

  try {
    // Import the service after mocking
    const { default: baseChartService } = require('../src/services/baseChartService');

    // Test 1: Get base chart for user
    console.log('1️⃣ Testing baseChartService.getBaseChart()...');
    
    const result = await baseChartService.getBaseChart('mock-user-123');
    
    console.log('📦 Service result:', {
      success: result.success,
      hasData: !!result.data,
      error: result.error,
      fromCache: result.fromCache
    });

    if (result.success && result.data) {
      console.log('✅ Service call successful!');
      
      // Test 2: Validate data structure
      console.log('\n2️⃣ Validating data structure...');
      
      const data = result.data;
      const requiredFields = [
        'metadata',
        'hd_type', 
        'typology_pair_key',
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

      const validationResults = {};
      requiredFields.forEach(field => {
        const hasField = data[field] !== undefined;
        const hasContent = hasField && (
          typeof data[field] === 'string' ? data[field].length > 0 : 
          typeof data[field] === 'object' ? Object.keys(data[field]).length > 0 :
          true
        );
        validationResults[field] = { hasField, hasContent };
        
        const status = hasField && hasContent ? '✅' : hasField ? '⚠️' : '❌';
        console.log(`   ${status} ${field}: ${hasField ? 'present' : 'missing'} ${hasContent ? '(with content)' : '(empty)'}`);
      });

      // Test 3: Synthesis categories validation
      console.log('\n3️⃣ Testing synthesis categories...');
      
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

      synthesisCategories.forEach(category => {
        const categoryData = data[category];
        if (categoryData && typeof categoryData === 'object') {
          const fieldCount = Object.keys(categoryData).length;
          console.log(`   ✅ ${category}: ${fieldCount} fields`);
        } else {
          console.log(`   ❌ ${category}: missing or invalid`);
        }
      });

      console.log('\n🎉 Frontend service test completed successfully!');
      return { success: true, data: result.data };

    } else {
      console.log('❌ Service call failed:', result.error);
      return { success: false, error: result.error };
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Configure Jest
global.jest = require('jest');
global.console = console;

// Run the test
testFrontendService()
  .then(result => {
    if (result.success) {
      console.log('\n✨ Frontend service integration test PASSED!');
      process.exit(0);
    } else {
      console.log('\n💥 Frontend service integration test FAILED!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
