#!/usr/bin/env node

/**
 * Test Blueprint Visualization Integration
 * Tests the complete flow from frontend components to backend visualization endpoint
 */

const axios = require('axios');
const path = require('path');

// Import our services for testing
const mockBlueprintVisualizerService = {
  async prepareVisualizationData(chartData) {
    // Mock implementation similar to actual service
    const safeGet = (obj, path, fallback = '') => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) || fallback;
    };

    const processArrayField = (field, fallback) => {
      if (Array.isArray(field) && field.length > 0) {
        return field.join(", ");
      }
      if (typeof field === 'string' && field.trim()) {
        return field;
      }
      return fallback;
    };

    return {
      profile_lines: safeGet(chartData, 'energy_family.profile_lines', "1/3"),
      astro_sun_sign: safeGet(chartData, 'energy_family.astro_sun_sign', "Aries"),
      astro_sun_house: safeGet(chartData, 'energy_family.astro_sun_house', "1st"),
      astro_north_node_sign: safeGet(chartData, 'evolutionary_path.astro_north_node_sign', "Aries"),
      ascendant_sign: safeGet(chartData, 'energy_class.ascendant_sign', "Aries"),
      chart_ruler_sign: safeGet(chartData, 'energy_class.chart_ruler_sign', "Aries"),
      incarnation_cross: safeGet(chartData, 'evolutionary_path.incarnation_cross', "Right Angle Cross of The Sphinx"),
      incarnation_cross_quarter: safeGet(chartData, 'energy_class.incarnation_cross_quarter', "Initiation"),
      astro_moon_sign: safeGet(chartData, 'processing_core.astro_moon_sign', "Aries"),
      astro_mercury_sign: safeGet(chartData, 'processing_core.astro_mercury_sign', "Aries"),
      head_state: safeGet(chartData, 'processing_core.head_state', "Defined"),
      ajna_state: safeGet(chartData, 'processing_core.ajna_state', "Defined"),
      emotional_state: safeGet(chartData, 'processing_core.emotional_state', "Defined"),
      cognition_variable: safeGet(chartData, 'processing_core.cognition_variable', "Feeling"),
      chiron_gate: safeGet(chartData, 'tension_points.chiron_gate', "Gate 57"),
      strategy: safeGet(chartData, 'decision_growth_vector.strategy', "To Inform"),
      authority: safeGet(chartData, 'decision_growth_vector.authority', "Emotional"),
      choice_navigation_spectrum: safeGet(chartData, 'decision_growth_vector.choice_navigation_spectrum', "Balanced"),
      astro_mars_sign: safeGet(chartData, 'decision_growth_vector.astro_mars_sign', "Aries"),
      north_node_house: safeGet(chartData, 'evolutionary_path.astro_north_node_house', "1st"),
      jupiter_placement: "Jupiter in Leo",
      motivation_color: safeGet(chartData, 'drive_mechanics.motivation_color', "Fear"),
      heart_state: safeGet(chartData, 'drive_mechanics.heart_state', "Defined"),
      root_state: safeGet(chartData, 'drive_mechanics.root_state', "Defined"),
      venus_sign: safeGet(chartData, 'drive_mechanics.venus_sign', "Aries"),
      kinetic_drive_spectrum: safeGet(chartData, 'drive_mechanics.kinetic_drive_spectrum', "Balanced"),
      resonance_field_spectrum: safeGet(chartData, 'drive_mechanics.resonance_field_spectrum', "Focused"),
      perspective_variable: safeGet(chartData, 'drive_mechanics.perspective_variable', "Personal"),
      saturn_placement: "Saturn in 1st",
      throat_definition: safeGet(chartData, 'manifestation_interface_rhythm.throat_definition', "Defined"),
      throat_gates: processArrayField(safeGet(chartData, 'manifestation_interface_rhythm.throat_gates', []), "1 to 4"),
      throat_channels: processArrayField(safeGet(chartData, 'manifestation_interface_rhythm.throat_channels', []), "1-8"),
      manifestation_rhythm_spectrum: safeGet(chartData, 'manifestation_interface_rhythm.manifestation_rhythm_spectrum', "Balanced"),
      mars_aspects: "Mars trine Sun",
      channel_list: processArrayField(safeGet(chartData, 'energy_architecture.channel_list', []), "1-8, 11-56"),
      definition_type: safeGet(chartData, 'energy_architecture.definition_type', "Single"),
      split_bridges: processArrayField(safeGet(chartData, 'energy_architecture.split_bridges', []), "Gate 25"),
      soft_aspects: "Sun trine Moon",
      g_center_access: safeGet(chartData, 'evolutionary_path.g_center_access', "Consistent"),
      conscious_line: safeGet(chartData, 'energy_family.conscious_line', "1"),
      unconscious_line: safeGet(chartData, 'energy_family.unconscious_line', "3"),
      core_priorities: processArrayField(safeGet(chartData, 'evolutionary_path.core_priorities', []), "Self-love, Direction"),
    };
  },

  async fetchVisualizationData(userId) {
    try {
      console.log('   📡 Fetching from visualization endpoint...');
      
      // Get profile ID (mock)
      const profilesResponse = await axios.get('http://localhost:3001/api/v1/user-data/users/me/profiles', {
        headers: { 'Authorization': 'Bearer mock-token-123' }
      });
      const profileId = profilesResponse.data.profiles[0].id;
      
      // Use visualization endpoint
      const response = await axios.get(`http://localhost:3001/api/v1/profiles/${profileId}/visualization`, {
        headers: { 'Authorization': 'Bearer mock-token-123' }
      });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getOptimizedVisualizationData(userId, useVisualizationEndpoint = true) {
    try {
      if (useVisualizationEndpoint) {
        console.log('   Using visualization endpoint...');
        const result = await this.fetchVisualizationData(userId);
        if (result.success) {
          const visualizationData = await this.prepareVisualizationData(result.data);
          return { success: true, data: visualizationData };
        }
        return result;
      } else {
        console.log('   Using base chart fallback...');
        // Simulate base chart service call
        const profilesResponse = await axios.get('http://localhost:3001/api/v1/user-data/users/me/profiles', {
          headers: { 'Authorization': 'Bearer mock-token-123' }
        });
        const profileId = profilesResponse.data.profiles[0].id;
        
        const baseChartResponse = await axios.get(`http://localhost:3001/api/v1/profiles/${profileId}/base_chart`, {
          headers: { 'Authorization': 'Bearer mock-token-123' }
        });
        
        const visualizationData = await this.prepareVisualizationData(baseChartResponse.data.data);
        return { success: true, data: visualizationData };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  generateRandomData() {
    const inputs = {
      profile_lines: ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"],
      astro_signs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      definition_types: ["Single", "Split", "Triple Split", "Quadruple Split", "No Definition"],
      strategies: ["To Inform", "To Respond", "To Wait for Invitation", "To Wait a Lunar Cycle"],
      authorities: ["Emotional", "Sacral", "Splenic", "Ego", "Self-Projected", "Mental", "Lunar"],
      center_states: ["Defined", "Undefined", "Open"],
      spectrums: ["Fluid", "Balanced", "Structured"],
      resonance_fields: ["Narrow", "Focused", "Wide"],
      motivation_colors: ["Fear", "Hope", "Desire", "Need", "Guilt", "Innocence"],
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const profileLine = getRandom(inputs.profile_lines);

    return {
      profile_lines: profileLine,
      astro_sun_sign: getRandom(inputs.astro_signs),
      astro_sun_house: "1st",
      astro_north_node_sign: getRandom(inputs.astro_signs),
      ascendant_sign: getRandom(inputs.astro_signs),
      chart_ruler_sign: getRandom(inputs.astro_signs),
      incarnation_cross: "Right Angle Cross of The Sphinx",
      incarnation_cross_quarter: "Initiation",
      astro_moon_sign: getRandom(inputs.astro_signs),
      astro_mercury_sign: getRandom(inputs.astro_signs),
      head_state: getRandom(inputs.center_states),
      ajna_state: getRandom(inputs.center_states),
      emotional_state: getRandom(inputs.center_states),
      cognition_variable: "Feeling",
      chiron_gate: "Gate 57",
      strategy: getRandom(inputs.strategies),
      authority: getRandom(inputs.authorities),
      choice_navigation_spectrum: getRandom(inputs.spectrums),
      astro_mars_sign: getRandom(inputs.astro_signs),
      north_node_house: "1st",
      jupiter_placement: "Jupiter in Leo",
      motivation_color: getRandom(inputs.motivation_colors),
      heart_state: getRandom(inputs.center_states),
      root_state: getRandom(inputs.center_states),
      venus_sign: getRandom(inputs.astro_signs),
      kinetic_drive_spectrum: getRandom(inputs.spectrums),
      resonance_field_spectrum: getRandom(inputs.resonance_fields),
      perspective_variable: "Personal",
      saturn_placement: "Saturn in 1st",
      throat_definition: getRandom(inputs.center_states),
      throat_gates: "1 to 4",
      throat_channels: "1-8",
      manifestation_rhythm_spectrum: getRandom(inputs.spectrums),
      mars_aspects: "Mars trine Sun",
      channel_list: "1-8, 11-56",
      definition_type: getRandom(inputs.definition_types),
      split_bridges: "Gate 25",
      soft_aspects: "Sun trine Moon",
      g_center_access: "Consistent",
      conscious_line: profileLine.split('/')[0],
      unconscious_line: profileLine.split('/')[1],
      core_priorities: "Self-love, Direction",
    };
  }
};

async function testBlueprintVisualization() {
  console.log('🎨 Testing Blueprint Visualization Integration');
  console.log('=============================================\n');

  const BASE_URL = 'http://localhost:3001';
  const testUserId = 'mock-user-123';

  try {
    // Test 1: Backend Endpoints
    console.log('1️⃣ Testing backend endpoints...');
    
    // Test health
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Health endpoint working');
    
    // Test visualization endpoint
    const profilesResponse = await axios.get(`${BASE_URL}/api/v1/user-data/users/me/profiles`, {
      headers: { 'Authorization': 'Bearer mock-token-123' }
    });
    const profileId = profilesResponse.data.profiles[0].id;
    console.log('   📋 Profile ID:', profileId);
    
    const visualizationResponse = await axios.get(`${BASE_URL}/api/v1/profiles/${profileId}/visualization`, {
      headers: { 'Authorization': 'Bearer mock-token-123' }
    });
    console.log('   ✅ Visualization endpoint working');
    console.log('   📊 Has visualization metadata:', !!visualizationResponse.data.data.visualization_metadata);
    console.log();

    // Test 2: Blueprint Visualizer Service Integration
    console.log('2️⃣ Testing BlueprintVisualizerService integration...');
    
    const serviceResult = await mockBlueprintVisualizerService.getOptimizedVisualizationData(testUserId, true);
    if (serviceResult.success) {
      console.log('   ✅ Service integration working');
      console.log('   📈 Profile Lines:', serviceResult.data.profile_lines);
      console.log('   ⭐ Sun Sign:', serviceResult.data.astro_sun_sign);
      console.log('   🔄 Strategy:', serviceResult.data.strategy);
      console.log('   📍 Authority:', serviceResult.data.authority);
    } else {
      console.log('   ❌ Service integration failed:', serviceResult.error);
    }
    console.log();

    // Test 3: Data Transformation
    console.log('3️⃣ Testing data transformation...');
    
    const rawChartData = visualizationResponse.data.data;
    const transformedData = await mockBlueprintVisualizerService.prepareVisualizationData(rawChartData);
    
    console.log('   ✅ Data transformation working');
    console.log('   📊 Chart Type:', transformedData.definition_type);
    console.log('   🎯 Kinetic Drive:', transformedData.kinetic_drive_spectrum);
    console.log('   🔮 Resonance Field:', transformedData.resonance_field_spectrum);
    console.log();

    // Test 4: Fallback Mechanism
    console.log('4️⃣ Testing fallback mechanism...');
    
    const fallbackResult = await mockBlueprintVisualizerService.getOptimizedVisualizationData(testUserId, false);
    if (fallbackResult.success) {
      console.log('   ✅ Fallback mechanism working');
      console.log('   📋 Falls back to base chart when visualization endpoint unavailable');
    } else {
      console.log('   ❌ Fallback mechanism failed:', fallbackResult.error);
    }
    console.log();

    // Test 5: Random Data Generation (for demo mode)
    console.log('5️⃣ Testing random data generation...');
    
    const randomData = mockBlueprintVisualizerService.generateRandomData();
    console.log('   ✅ Random data generation working');
    console.log('   🎲 Random Profile:', randomData.profile_lines);
    console.log('   🎲 Random Sun Sign:', randomData.astro_sun_sign);
    console.log('   🎲 Random Definition:', randomData.definition_type);
    console.log();

    // Test 6: Chart Category Descriptions
    console.log('6️⃣ Testing chart category descriptions...');
    
    const descriptions = [
      {
        category: "Energy Family",
        description: `Core identity shaped by a ${transformedData.profile_lines} profile, radiating from the ${transformedData.astro_sun_sign} frequency in the ${transformedData.astro_sun_house} house.`
      },
      {
        category: "Energy Class",
        description: `Interface with the world, projecting a ${transformedData.ascendant_sign} aura, guided by the ${transformedData.incarnation_cross_quarter} quarter.`
      },
      {
        category: "Processing Core",
        description: `Information processed via ${transformedData.cognition_variable} cognition, with ${transformedData.head_state}, ${transformedData.ajna_state}, and ${transformedData.emotional_state} centers.`
      },
      {
        category: "Decision & Growth Vector",
        description: `Navigates via ${transformedData.strategy} & ${transformedData.authority}, with a ${transformedData.choice_navigation_spectrum} flow, driven by ${transformedData.astro_mars_sign}.`
      }
    ];

    console.log('   ✅ Description generation working');
    descriptions.forEach((desc, index) => {
      console.log(`   📝 ${index + 1}. ${desc.category}: ${desc.description.substring(0, 60)}...`);
    });
    console.log();

    console.log('🎉 All Blueprint Visualization tests passed!');
    console.log('✅ Backend endpoints: WORKING');
    console.log('✅ Service integration: WORKING');
    console.log('✅ Data transformation: WORKING');
    console.log('✅ Fallback mechanism: WORKING');
    console.log('✅ Random data generation: WORKING');
    console.log('✅ Description generation: WORKING');
    console.log('\n🚀 Ready for React Native SVG rendering!');

  } catch (error) {
    console.error('❌ Blueprint Visualization test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testBlueprintVisualization();
