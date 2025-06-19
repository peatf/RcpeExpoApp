/**
 * @file blueprintVisualizerService.ts
 * @description Enhanced service for managing the Energetic Blueprint Visualizer
 */
import baseChartService, { BaseChartData } from './baseChartService';
import apiClient from './api';

export interface VisualizationData {
  profile_lines: string;
  astro_sun_sign: string;
  astro_sun_house: string;
  astro_north_node_sign: string;
  ascendant_sign: string;
  chart_ruler_sign: string;
  incarnation_cross: string;
  incarnation_cross_quarter: string;
  astro_moon_sign: string;
  astro_mercury_sign: string;
  head_state: string;
  ajna_state: string;
  emotional_state: string;
  cognition_variable: string;
  chiron_gate: string;
  strategy: string;
  authority: string;
  choice_navigation_spectrum: string;
  astro_mars_sign: string;
  north_node_house: string;
  jupiter_placement: string;
  motivation_color: string;
  heart_state: string;
  root_state: string;
  venus_sign: string;
  kinetic_drive_spectrum: string;
  resonance_field_spectrum: string;
  perspective_variable: string;
  saturn_placement: string;
  throat_definition: string;
  throat_gates: string;
  throat_channels: string;
  manifestation_rhythm_spectrum: string;
  mars_aspects: string;
  channel_list: string;
  definition_type: string;
  split_bridges: string;
  soft_aspects: string;
  g_center_access: string;
  conscious_line: string;
  unconscious_line: string;
  core_priorities: string;
  tension_planets?: { name: string; gate: string; }[]; // Added tension_planets
}

const blueprintVisualizerService = {
  /**
   * Convert base chart data to visualization format
   */
  prepareVisualizationData: (chartData: BaseChartData): VisualizationData => {
    // Helper function to safely get nested properties
    const safeGet = (obj: any, path: string, fallback: any = '') => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) || fallback;
    };

    // Helper function to process array fields
    const processArrayField = (field: any, fallback: string): string => {
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
      tension_planets: safeGet(chartData, 'tension_points.tension_planets', []),
    };
  },
  
  /**
   * Create placeholder data for blueprint visualization
   */
  createPlaceholderData: (): VisualizationData => {
    return {
      profile_lines: "1/3",
      astro_sun_sign: "Aries",
      astro_sun_house: "1st",
      astro_north_node_sign: "Aries",
      ascendant_sign: "Aries",
      chart_ruler_sign: "Aries",
      incarnation_cross: "Right Angle Cross of The Sphinx",
      incarnation_cross_quarter: "Initiation",
      astro_moon_sign: "Aries",
      astro_mercury_sign: "Aries",
      head_state: "Defined",
      ajna_state: "Defined",
      emotional_state: "Defined",
      cognition_variable: "Feeling",
      chiron_gate: "Gate 57",
      strategy: "To Inform",
      authority: "Emotional",
      choice_navigation_spectrum: "Balanced",
      astro_mars_sign: "Aries",
      north_node_house: "1st",
      jupiter_placement: "Jupiter in Leo",
      motivation_color: "Fear",
      heart_state: "Defined",
      root_state: "Defined",
      venus_sign: "Aries",
      kinetic_drive_spectrum: "Balanced",
      resonance_field_spectrum: "Focused",
      perspective_variable: "Personal",
      saturn_placement: "Saturn in 1st",
      throat_definition: "Defined",
      throat_gates: "1 to 4",
      throat_channels: "1-8",
      manifestation_rhythm_spectrum: "Balanced",
      mars_aspects: "Mars trine Sun",
      channel_list: "1-8, 11-56",
      definition_type: "Single",
      split_bridges: "Gate 25",
      soft_aspects: "Sun trine Moon",
      g_center_access: "Consistent",
      conscious_line: "1",
      unconscious_line: "3",
      core_priorities: "Self-love, Direction",
      tension_planets: [],
    };
  },

  /**
   * Fetch visualization data directly from the new backend endpoint
   */
  fetchVisualizationData: async (userId: string): Promise<{success: boolean; data?: BaseChartData; error?: string}> => {
    try {
      console.log('Fetching visualization data from backend for user:', userId);
      
      // First, get the user's profile ID
      const profileId = await baseChartService.getUserProfileId(userId);
      if (!profileId) {
        return {
          success: false,
          error: 'Could not determine profile ID for user',
        };
      }

      console.log('Using profile ID for visualization:', profileId);
      
      // Use the new visualization endpoint: /api/v1/profiles/{profile_id}/visualization
      const response = await apiClient.get(`/api/v1/profiles/${profileId}/visualization`);

      console.log('Visualization API response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });

      if (response.data && response.data.data) {
        // Backend returns { status: "success", data: BaseChart }
        const visualizationData = response.data.data;
        
        return {
          success: true,
          data: visualizationData,
        };
      } else {
        console.warn('No visualization data in response:', response.data);
        return {
          success: false,
          error: 'No visualization data found for this user',
        };
      }
    } catch (error: any) {
      console.error('Failed to fetch visualization data from API:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch visualization data';

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get visualization data optimized for the frontend
   * This method can use either the base chart or the specialized visualization endpoint
   */
  getOptimizedVisualizationData: async (
    userId: string, 
    useVisualizationEndpoint: boolean = true
  ): Promise<{success: boolean; data?: VisualizationData; error?: string}> => {
    try {
      let chartData: BaseChartData;
      
      if (useVisualizationEndpoint) {
        // Use the new specialized visualization endpoint
        const result = await blueprintVisualizerService.fetchVisualizationData(userId);
        if (!result.success || !result.data) {
          return {
            success: false,
            error: result.error || 'Failed to fetch visualization data'
          };
        }
        chartData = result.data;
      } else {
        // Fallback to base chart service
        const result = await baseChartService.getUserBaseChart(userId);
        if (!result.success || !result.data) {
          return {
            success: false,
            error: result.error || 'Failed to fetch base chart data'
          };
        }
        chartData = result.data;
      }

      // Convert to visualization format
      const visualizationData = blueprintVisualizerService.prepareVisualizationData(chartData);
      
      return {
        success: true,
        data: visualizationData
      };
    } catch (error: any) {
      console.error('Failed to get optimized visualization data:', error);
      return {
        success: false,
        error: error.message || 'Failed to process visualization data'
      };
    }
  },

  /**
   * Generate random data for demo/testing purposes
   */
  generateRandomData: (): VisualizationData => {
    const inputs = {
      profile_lines: ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"],
      astro_signs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
      houses: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"],
      definition_types: ["Single", "Split", "Triple Split", "Quadruple Split", "No Definition"],
      strategies: ["To Inform", "To Respond", "To Wait for Invitation", "To Wait a Lunar Cycle"],
      authorities: ["Emotional", "Sacral", "Splenic", "Ego", "Self-Projected", "Mental", "Lunar"],
      center_states: ["Defined", "Undefined", "Open"],
      spectrums: ["Fluid", "Balanced", "Structured"],
      resonance_fields: ["Narrow", "Focused", "Wide"],
      motivation_colors: ["Fear", "Hope", "Desire", "Need", "Guilt", "Innocence"],
    };

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const profileLine = getRandom(inputs.profile_lines);

    return {
      profile_lines: profileLine,
      astro_sun_sign: getRandom(inputs.astro_signs),
      astro_sun_house: getRandom(inputs.houses),
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
      north_node_house: getRandom(inputs.houses),
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
      tension_planets: [],
    };
  }
};

export default blueprintVisualizerService;