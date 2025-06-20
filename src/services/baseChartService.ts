/**
 * @file baseChartService.ts
 * @description Enhanced service for fetching and managing base chart data
 */
import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Updated interface to match backend BaseChartResponse structure
export interface BaseChartData {
  metadata: {
    profile_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    status: string;
    version: string;
  };
  hd_type: string;
  typology_pair_key: string;
  energy_family: {
    profile_lines: string;
    conscious_line: number;
    unconscious_line: number;
    astro_sun_sign: string;
    astro_sun_house: number;
    astro_north_node_sign?: string;
  };
// No duplicate declaration needed
  energy_class: {
    ascendant_sign: string;
    chart_ruler_sign: string;
    chart_ruler_house?: number;
    incarnation_cross: string;
    incarnation_cross_quarter: string;
    profile_type?: string;
  };
  processing_core: {
    astro_moon_sign: string;
    astro_moon_house?: number;
    astro_mercury_sign: string;
    astro_mercury_house?: number;
    head_state: string;
    ajna_state: string;
    emotional_state: string;
    cognition_variable?: string;
    chiron_gate?: number;
  };
  decision_growth_vector: {
    strategy: string;
    authority: string;
    choice_navigation_spectrum: string;
    astro_mars_sign?: string;
    north_node_house?: number;
  };
  drive_mechanics: {
    motivation_color?: string;
    heart_state: string;
    root_state: string;
    venus_sign?: string;
    kinetic_drive_spectrum: string;
    resonance_field_spectrum: string;
    perspective_variable?: string;
  };
  manifestation_interface_rhythm: {
    throat_definition: string;
    throat_gates?: number[];
    throat_channels?: string[];
    manifestation_rhythm_spectrum: string;
  };
  energy_architecture: {
    definition_type: string;
    channel_list: string[];
    split_bridges?: string[];
  };
  tension_points: {
    chiron_gate?: number;
    tension_planets?: string[];
  };
  evolutionary_path: {
    g_center_access?: string;
    incarnation_cross: string;
    astro_north_node_sign: string;
    astro_north_node_house?: number;
    conscious_line: number;
    unconscious_line: number;
    core_priorities?: string[];
  };
  dominant_mastery_values?: string[];
  manifestation_dimensions?: Record<string, number>;
  fetchedAt?: number;
}

export interface BaseChartResponse {
  success: boolean;
  data?: BaseChartData;
  error?: string;
  fromCache?: boolean;
  isMockData?: boolean;
}

const BASE_CHART_CACHE_KEY = 'userBaseChart_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const baseChartService = {
  /**
   * Get user's profile ID by user ID
   */
  getUserProfileId: async (userId: string): Promise<string | null> => {
    try {
      console.log('Fetching profile ID for user:', userId);
      
      // Get the user's profiles from the new backend endpoint
      const response = await apiClient.get('/api/v1/user-data/users/me/profiles');
      
      if (response.data && response.data.profiles && response.data.profiles.length > 0) {
        // Use the most recently created profile (first in the ordered list)
        const primaryProfile = response.data.profiles[0];
        console.log(`Found ${response.data.profiles.length} profile(s) for user, using primary profile: ${primaryProfile.id}`);
        return primaryProfile.id;
      }
      
      // No profiles found for user
      console.warn('No profiles found for user:', userId);
      return null;
    } catch (error: any) {
      console.error('Failed to get profile ID for user:', userId, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });
      
      // If it's a 403/401 error, the user might not be authenticated properly
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.warn('Authentication issue - proceeding with fallback profile ID');
        // For development/testing, return a default profile ID
        return 'default-profile-123';
      }
      
      // For network errors, also provide fallback
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        console.warn('Network error - using fallback profile ID');
        return 'default-profile-123';
      }
      
      return null;
    }
  },
  getStorageKey: (userId: string): string => {
    return `${BASE_CHART_CACHE_KEY}${userId}`;
  },

  /**
   * Save base chart to cache
   */
  saveToCache: async (userId: string, data: BaseChartData): Promise<void> => {
    try {
      const dataWithTimestamp = {...data, fetchedAt: Date.now()};
      const storageKey = baseChartService.getStorageKey(userId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(dataWithTimestamp));
      console.log('Base chart saved to cache for user:', userId);
    } catch (error) {
      console.error('Failed to save base chart to cache:', error);
    }
  },

  /**
   * Load base chart from cache
   */
  loadFromCache: async (userId: string): Promise<BaseChartData | null> => {
    try {
      const storageKey = baseChartService.getStorageKey(userId);
      const cachedData = await AsyncStorage.getItem(storageKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as BaseChartData;

        // Check if cache is still valid
        if (
          parsedData.fetchedAt &&
          Date.now() - parsedData.fetchedAt < CACHE_DURATION
        ) {
          console.log('Base chart loaded from cache for user:', userId);
          return parsedData;
        } else {
          console.log('Cache expired for user:', userId);
          // Remove expired cache
          await AsyncStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Failed to load base chart from cache:', error);
    }

    return null;
  },

  /**
   * Clear cache for a user
   */
  clearCache: async (userId: string): Promise<void> => {
    try {
      const storageKey = baseChartService.getStorageKey(userId);
      await AsyncStorage.removeItem(storageKey);
      console.log('Base chart cache cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear base chart cache:', error);
    }
  },

  /**
   * Clear all base chart cache data
   */
  clearAllCache: async (): Promise<void> => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const baseChartKeys = allKeys.filter(key => key.startsWith(BASE_CHART_CACHE_KEY));
      
      if (baseChartKeys.length > 0) {
        await AsyncStorage.multiRemove(baseChartKeys);
        console.log(`Cleared ${baseChartKeys.length} base chart cache entries:`, baseChartKeys);
      } else {
        console.log('No base chart cache entries found to clear');
      }
    } catch (error) {
      console.error('Failed to clear all base chart cache:', error);
    }
  },

  /**
   * Fetch base chart from API
   * - Updated to use correct backend profile-based endpoint
   */
  fetchFromAPI: async (userId: string): Promise<BaseChartResponse> => {
    try {
      console.log('Fetching base chart from API for user:', userId);
      
      // First, get the user's profile ID
      const profileId = await baseChartService.getUserProfileId(userId);
      if (!profileId) {
        console.error('Could not determine profile ID for user:', userId);
        return {
          success: false,
          error: 'Could not determine profile ID for user',
        };
      }

      console.log('Using profile ID:', profileId);
      
      // Use the correct backend endpoint: /api/v1/profiles/{profile_id}/base_chart
      const endpoint = `/api/v1/profiles/${profileId}/base_chart`;
      console.log('Making API request to endpoint:', endpoint);
      
      const response = await apiClient.get(endpoint);

      console.log('Base chart API response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });

      if (response.data && response.data.data) {
        // Backend returns { status: "success", data: BaseChart }
        const baseChartData = response.data.data;
        console.log('Successfully received base chart data with keys:', Object.keys(baseChartData));
        
        // Save to cache using user ID for convenience
        await baseChartService.saveToCache(userId, baseChartData);

        return {
          success: true,
          data: baseChartData,
          fromCache: false,
        };
      } else {
        console.warn('No base chart data in response:', response.data);
        return {
          success: false,
          error: 'No base chart data found for this user',
        };
      }
    } catch (error: any) {
      console.error('Failed to fetch base chart from API:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch base chart';

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get mock base chart data for fallback
   * This provides emergency fallback data when the server isn't responding
   */
  getMockBaseChartData: (userId: string): BaseChartData => {
    console.log('Generating mock base chart data for:', userId);
    return {
      metadata: {
        profile_id: 'mock-profile-fallback',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'completed',
        version: '1.0.0'
      },
      hd_type: 'Generator',
      typology_pair_key: 'adaptive-fluid',
      energy_family: {
        profile_lines: '4/6',
        conscious_line: 4,
        unconscious_line: 6,
        astro_sun_sign: 'Leo',
        astro_sun_house: 8,
      },
      energy_class: {
        ascendant_sign: 'Virgo',
        chart_ruler_sign: 'Mercury',
        chart_ruler_house: 3,
        incarnation_cross: 'Right Angle Cross of Planning',
        incarnation_cross_quarter: 'Quarter of Initiation',
        profile_type: 'Opportunist/Role Model',
      },
      processing_core: {
        astro_moon_sign: 'Cancer',
        astro_moon_house: 9,
        astro_mercury_sign: 'Virgo',
        astro_mercury_house: 2,
        head_state: 'undefined',
        ajna_state: 'defined',
        emotional_state: 'defined',
        cognition_variable: 'Right-brained',
      },
      decision_growth_vector: {
        strategy: 'Wait to Respond',
        authority: 'Emotional',
        choice_navigation_spectrum: 'Adaptive',
      },
      drive_mechanics: {
        heart_state: 'undefined',
        root_state: 'defined',
        kinetic_drive_spectrum: 'Adaptive',
        resonance_field_spectrum: 'Grounded',
      },
      manifestation_interface_rhythm: {
        throat_definition: 'undefined',
        throat_gates: [12, 23, 35],
        throat_channels: ['Channel of Community'],
        manifestation_rhythm_spectrum: 'Fluid',
      },
      energy_architecture: {
        definition_type: 'Split',
        channel_list: ['Channel of Curiosity', 'Channel of Awareness'],
        split_bridges: ['Root to Solar Plexus', 'G Center to Heart'],
      },
      tension_points: {},
      evolutionary_path: {
        g_center_access: 'Developing',
        incarnation_cross: 'Right Angle Cross of Planning',
        astro_north_node_sign: 'Taurus',
        astro_north_node_house: 7,
        conscious_line: 4,
        unconscious_line: 6,
        core_priorities: ['Community', 'Stability', 'Growth', 'Wisdom'],
      },
      dominant_mastery_values: ['Innovation', 'Connection', 'Exploration'],
      fetchedAt: Date.now()
    };
  },

  /**
   * Get user base chart (tries cache first, then API)
   */
  getUserBaseChart: async (
    userId: string,
    forceRefresh = false,
  ): Promise<BaseChartResponse> => {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
      };
    }

    // Try cache first unless forced refresh
    if (!forceRefresh) {
      const cachedData = await baseChartService.loadFromCache(userId);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          fromCache: true,
        };
      }
    }

    // Fetch from API
    try {
      const apiResponse = await baseChartService.fetchFromAPI(userId);
      
      // If API call fails, use mock data as fallback but only in development
      if (!apiResponse.success && __DEV__) {
        console.warn('API failed, using mock data fallback');
        const mockData = baseChartService.getMockBaseChartData(userId);
        // Save mock data to cache to prevent repeated failures
        await baseChartService.saveToCache(userId, mockData);
        return {
          success: true,
          data: mockData,
          fromCache: false,
          isMockData: true
        };
      }
      
      return apiResponse;
    } catch (error) {
      console.error('Critical error in getUserBaseChart:', error);
      
      // Ultimate fallback - provide mock data even after API errors
      if (__DEV__) {
        console.warn('Critical failure, using emergency mock data');
        const mockData = baseChartService.getMockBaseChartData(userId);
        return {
          success: true,
          data: mockData,
          fromCache: false,
          isMockData: true
        };
      }
      
      return {
        success: false,
        error: 'Failed to load chart data'
      };
    }
  },

  /**
   * Force refresh all user data - clears cache and fetches fresh data
   */
  forceRefreshUserData: async (userId: string): Promise<BaseChartResponse> => {
    console.log('🔄 Force refreshing user data for:', userId);
    
    // Clear all cache
    await baseChartService.clearAllCache();
    
    // Force refresh from API
    return await baseChartService.getUserBaseChart(userId, true);
  },

  /**
   * Format key names for display
   */
  formatKey: (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Get chart sections for rendering
   * Updated to work with new backend data structure
   */
  getChartSections: (
    data: BaseChartData,
  ): Array<{title: string; data: any}> => {
    // Validate data before processing
    data = baseChartService.validateProfileLines(data);
    data = baseChartService.validateGCenterAccess(data);

    const sections = [];

    // Map the comprehensive backend data to display sections
    if (data.energy_family) {
      sections.push({
        title: 'Energy Family',
        data: {
          'Profile Lines': data.energy_family.profile_lines,
          'Conscious Line': data.energy_family.conscious_line,
          'Unconscious Line': data.energy_family.unconscious_line,
          'Sun Sign': data.energy_family.astro_sun_sign,
          'Sun House': data.energy_family.astro_sun_house,
          'North Node Sign': data.energy_family.astro_north_node_sign || 'N/A',
        },
      });
    }

    if (data.energy_class) {
      sections.push({
        title: 'Energy Class',
        data: {
          'Ascendant Sign': data.energy_class.ascendant_sign,
          'Chart Ruler': data.energy_class.chart_ruler_sign,
          'Chart Ruler House': data.energy_class.chart_ruler_house || 'N/A',
          'Incarnation Cross': data.energy_class.incarnation_cross,
          'Incarnation Cross Quarter': data.energy_class.incarnation_cross_quarter,
          'Profile Type': data.energy_class.profile_type || 'N/A',
        },
      });
    }

    if (data.processing_core) {
      sections.push({
        title: 'Processing Core',
        data: {
          'Moon Sign': data.processing_core.astro_moon_sign,
          'Moon House': data.processing_core.astro_moon_house || 'N/A',
          'Mercury Sign': data.processing_core.astro_mercury_sign,
          'Mercury House': data.processing_core.astro_mercury_house || 'N/A',
          'Head State': data.processing_core.head_state,
          'Ajna State': data.processing_core.ajna_state,
          'Emotional State': data.processing_core.emotional_state,
          'Cognition Variable': data.processing_core.cognition_variable || 'N/A',
        },
      });
    }

    if (data.decision_growth_vector) {
      sections.push({
        title: 'Decision & Growth Vector',
        data: {
          'Strategy': data.decision_growth_vector.strategy,
          'Authority': data.decision_growth_vector.authority,
          'Choice Navigation': data.decision_growth_vector.choice_navigation_spectrum,
          'Mars Sign': data.decision_growth_vector.astro_mars_sign || 'N/A',
          'North Node House': data.decision_growth_vector.north_node_house || 'N/A',
        },
      });
    }

    if (data.drive_mechanics) {
      sections.push({
        title: 'Drive Mechanics',
        data: {
          'Heart State': data.drive_mechanics.heart_state,
          'Root State': data.drive_mechanics.root_state,
          'Venus Sign': data.drive_mechanics.venus_sign || 'N/A',
          'Kinetic Drive': data.drive_mechanics.kinetic_drive_spectrum,
          'Resonance Field': data.drive_mechanics.resonance_field_spectrum,
          'Motivation Color': data.drive_mechanics.motivation_color || 'N/A',
        },
      });
    }

    if (data.manifestation_interface_rhythm) {
      sections.push({
        title: 'Manifestation Interface',
        data: {
          'Throat Definition': data.manifestation_interface_rhythm.throat_definition,
          'Manifestation Rhythm': data.manifestation_interface_rhythm.manifestation_rhythm_spectrum,
          'Throat Gates': data.manifestation_interface_rhythm.throat_gates?.join(', ') || 'N/A',
          'Throat Channels': data.manifestation_interface_rhythm.throat_channels?.join(', ') || 'N/A',
        },
      });
    }

    if (data.energy_architecture) {
      sections.push({
        title: 'Energy Architecture',
        data: {
          'Definition Type': data.energy_architecture.definition_type,
          'Channels': Array.isArray(data.energy_architecture.channel_list) 
            ? data.energy_architecture.channel_list.join(', ') 
            : 'N/A',
          'Split Bridges': Array.isArray(data.energy_architecture.split_bridges) 
            ? data.energy_architecture.split_bridges.join(', ') 
            : 'N/A',
        },
      });
    }

    if (data.tension_points) {
      sections.push({
        title: 'Tension Points',
        data: {
          'Chiron Gate': data.tension_points.chiron_gate || 'N/A',
          'Tension Planets': data.tension_points.tension_planets?.join(', ') || 'N/A',
        },
      });
    }

    if (data.evolutionary_path) {
      sections.push({
        title: 'Evolutionary Path',
        data: {
          'Incarnation Cross': data.evolutionary_path.incarnation_cross,
          'North Node Sign': data.evolutionary_path.astro_north_node_sign,
          'North Node House': data.evolutionary_path.astro_north_node_house || 'N/A',
          'Conscious Line': data.evolutionary_path.conscious_line,
          'Unconscious Line': data.evolutionary_path.unconscious_line,
          'G Center Access': data.evolutionary_path.g_center_access || 'N/A',
        },
      });
    }

    // Add metadata section
    if (data.metadata) {
      sections.push({
        title: 'Profile Info',
        data: {
          'Profile ID': data.metadata.profile_id,
          'HD Type': data.hd_type,
          'Typology Pair': data.typology_pair_key,
          'Status': data.metadata.status,
          'Created': new Date(data.metadata.created_at).toLocaleDateString(),
          'Version': data.metadata.version,
        },
      });
    }

    return sections;
  },

  /**
   * Validates profile lines to ensure they match a valid Human Design profile
   * Valid profiles: 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3
   */
  validateProfileLines: (data: BaseChartData): BaseChartData => {
    if (data.energy_family) {
      const profileLines = data.energy_family.profile_lines;
      
      if (profileLines) {
        // Parse profile line values
        const [conscLine, uncLine] = profileLines.split('/').map(Number);
        
        // Valid HD profile combinations
        const validProfiles = [
          [1,3], [1,4], [2,4], [2,5], [3,5], [3,6],
          [4,6], [4,1], [5,1], [5,2], [6,2], [6,3]
        ];
        
        const isValid = validProfiles.some(([c, u]) => c === conscLine && u === uncLine);
        
        // If invalid profile, fix to a default valid profile
        if (!isValid) {
          console.warn(`Invalid profile lines ${profileLines}, using default 1/3`);
          data.energy_family.profile_lines = "1/3";
          data.energy_family.conscious_line = 1;
          data.energy_family.unconscious_line = 3;
          
          // Also fix in evolutionary path if present
          if (data.evolutionary_path) {
            data.evolutionary_path.conscious_line = 1;
            data.evolutionary_path.unconscious_line = 3;
          }
        } else {
          // Ensure consistency between profile_lines and conscious/unconscious lines
          if (data.energy_family.conscious_line !== conscLine) {
            data.energy_family.conscious_line = conscLine;
          }
          
          if (data.energy_family.unconscious_line !== uncLine) {
            data.energy_family.unconscious_line = uncLine;
          }
          
          // Also ensure consistency in evolutionary path if present
          if (data.evolutionary_path) {
            data.evolutionary_path.conscious_line = conscLine;
            data.evolutionary_path.unconscious_line = uncLine;
          }
        }
      }
    }
    
    return data;
  },

  /**
   * Validates G Center access to ensure it has a proper value
   */
  validateGCenterAccess: (data: BaseChartData): BaseChartData => {
    if (data.evolutionary_path) {
      const gCenterAccess = data.evolutionary_path.g_center_access;
      
      // If g_center_access is missing or invalid, set it to a default
      if (!gCenterAccess || !['Fixed Identity', 'Fluid Identity'].includes(gCenterAccess)) {
        console.warn(`Invalid G Center Access: ${gCenterAccess}, using default 'Fixed Identity'`);
        data.evolutionary_path.g_center_access = 'Fixed Identity';
      }
    }
    
    return data;
  }
};

export default baseChartService;
