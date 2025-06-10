/**
 * @file blueprintVisualizerService.ts
 * @description Service for managing the Energetic Blueprint Visualizer
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
}

const blueprintVisualizerService = {
  /**
   * Convert base chart data to visualization format
   */
  prepareVisualizationData: (chartData: BaseChartData): VisualizationData => {
    // This adapts the existing chart data structure to match what your visualization expects
    return {
      profile_lines: chartData.energy_family?.profile_lines || "1/3",
      astro_sun_sign: chartData.energy_family?.astro_sun_sign || "Aries",
      astro_sun_house: chartData.energy_family?.astro_sun_house?.toString() || "1st",
      astro_north_node_sign: chartData.evolutionary_path?.astro_north_node_sign || "Aries",
      ascendant_sign: chartData.energy_class?.ascendant_sign || "Aries",
      chart_ruler_sign: chartData.energy_class?.chart_ruler_sign || "Aries",
      incarnation_cross: chartData.evolutionary_path?.incarnation_cross || "Right Angle Cross of The Sphinx",
      incarnation_cross_quarter: chartData.energy_class?.incarnation_cross_quarter || "Initiation",
      astro_moon_sign: chartData.processing_core?.astro_moon_sign || "Aries",
      astro_mercury_sign: chartData.processing_core?.astro_mercury_sign || "Aries",
      head_state: chartData.processing_core?.head_state || "Defined",
      ajna_state: chartData.processing_core?.ajna_state || "Defined",
      emotional_state: chartData.processing_core?.emotional_state || "Defined",
      cognition_variable: chartData.processing_core?.cognition_variable || "Feeling",
      chiron_gate: chartData.tension_points?.chiron_gate?.toString() || "Gate 57",
      strategy: chartData.decision_growth_vector?.strategy || "To Inform",
      authority: chartData.decision_growth_vector?.authority || "Emotional",
      choice_navigation_spectrum: chartData.decision_growth_vector?.choice_navigation_spectrum || "Balanced",
      astro_mars_sign: chartData.decision_growth_vector?.astro_mars_sign || "Aries",
      north_node_house: chartData.evolutionary_path?.astro_north_node_house?.toString() || "1st",
      jupiter_placement: "Jupiter in Leo", // Default since this doesn't exist in the current data model
      motivation_color: chartData.drive_mechanics?.motivation_color || "Fear",
      heart_state: chartData.drive_mechanics?.heart_state || "Defined",
      root_state: chartData.drive_mechanics?.root_state || "Defined",
      venus_sign: chartData.drive_mechanics?.venus_sign || "Aries",
      kinetic_drive_spectrum: chartData.drive_mechanics?.kinetic_drive_spectrum || "Balanced",
      resonance_field_spectrum: chartData.drive_mechanics?.resonance_field_spectrum || "Focused",
      perspective_variable: chartData.drive_mechanics?.perspective_variable || "Personal",
      saturn_placement: "Saturn in 1st", // Default since this doesn't exist in the current data model
      throat_definition: chartData.manifestation_interface_rhythm?.throat_definition || "Defined",
      throat_gates: Array.isArray(chartData.manifestation_interface_rhythm?.throat_gates) 
        ? chartData.manifestation_interface_rhythm.throat_gates[0]?.toString() || "1 to 4"
        : "1 to 4",
      throat_channels: Array.isArray(chartData.manifestation_interface_rhythm?.throat_channels)
        ? chartData.manifestation_interface_rhythm.throat_channels[0] || "1-8"
        : "1-8",
      manifestation_rhythm_spectrum: chartData.manifestation_interface_rhythm?.manifestation_rhythm_spectrum || "Balanced",
      mars_aspects: "Mars trine Sun", // Default since this doesn't exist in the current data model
      channel_list: Array.isArray(chartData.energy_architecture?.channel_list)
        ? chartData.energy_architecture.channel_list.join(", ") || "1-8, 11-56"
        : "1-8, 11-56",
      definition_type: chartData.energy_architecture?.definition_type || "Single",
      split_bridges: Array.isArray(chartData.energy_architecture?.split_bridges)
        ? chartData.energy_architecture.split_bridges.join(", ") || "Gate 25"
        : "Gate 25",
      soft_aspects: "Sun trine Moon", // Default since this doesn't exist in the current data model
      g_center_access: chartData.evolutionary_path?.g_center_access || "Consistent",
      conscious_line: chartData.energy_family?.conscious_line?.toString() || "1",
      unconscious_line: chartData.energy_family?.unconscious_line?.toString() || "3",
      core_priorities: Array.isArray(chartData.evolutionary_path?.core_priorities)
        ? chartData.evolutionary_path.core_priorities.join(", ") || "Self-love, Direction"
        : "Self-love, Direction",
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
  }
};

export default blueprintVisualizerService;