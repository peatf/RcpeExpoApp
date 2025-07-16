/**
 * @file environmentalAttunementService.ts
 * @description Service for Reflector Environmental Attunement features.
 */

import {
  LunarCheckIn,
  LunarPattern,
  ClarityWindow,
  EnvironmentAnalysis,
  RelationshipAnalysis,
  TimingWindow,
  // AuthorityType, // Not strictly needed for mock data here but good for consistency if used
} from '../types/humanDesignTools';

// Mock apiClient - replace with actual import from ./api when available
const apiClient = {
  post: async <T_Response, T_Request = any>(endpoint: string, payload: T_Request): Promise<{ data: T_Response }> => {
    console.log(`Mock API POST request to ${endpoint} with payload:`, payload);
    if (endpoint === '/api/v1/lunar/check-in') {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, checkInId: `mock_lc_${Date.now()}`, insights: ['Check-in recorded.'], patternUpdates: {} } as any }), 500));
    }
    if (endpoint === '/api/v1/environment/assessment') {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, environmentId: `mock_env_${Date.now()}`, recommendations: ['This seems like a supportive environment.'] } as any }), 500));
    }
    if (endpoint === '/api/v1/relationship/assessment') {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, relationshipId: `mock_rel_${Date.now()}`, insights: ['Relationship impact noted.'] } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown POST endpoint: ${endpoint}`));
  },
  get: async <T_Response>(endpoint: string, params?: any): Promise<{ data: T_Response }> => {
    console.log(`Mock API GET request to ${endpoint} with params:`, params);
    if (endpoint === '/api/v1/lunar/cycle') {
      const mockCycleData: LunarCheckIn[] = [
        { id: 'lc1', userId: 'uR1', timestamp: new Date(Date.now() - 86400000*2).toISOString(), lunarDay: 27, lunarPhase: 'Waning Crescent', wellbeing: { overall: 8, physical: 7,emotional: 8, mental: 9, social: 7}, clarity: {level: 9, areas:['work'], insights:['Clear on next steps for project A.']}, environment: {name: 'Home Office', type:'work', attributes:['quiet', 'focused'], duration:8, impact: 2}, relationships:{people:['partner'], dynamics:['supportive'], impact:1}, significant: true },
        { id: 'lc2', userId: 'uR1', timestamp: new Date(Date.now() - 86400000).toISOString(), lunarDay: 28, lunarPhase: 'New Moon', wellbeing: { overall: 7, physical: 8,emotional: 7, mental: 7, social: 6}, clarity: {level: 8, areas:['personal'], insights:['Need more rest.']}, environment: {name: 'Park', type:'nature', attributes:['calm', 'open'], duration:2, impact: 1}, relationships:{people:[], dynamics:[], impact:0}, significant: false },
      ];
      const mockPatterns: LunarPattern[] = [ { id: 'lp1', description: 'Clarity peaks around days 25-28 of the lunar cycle.', confidence: 0.8, cyclePosition: { days: [25,26,27,28] }, attributes: { wellbeing: 'high', clarity: 'high', environmentFactors: ['quiet'], relationshipFactors: ['solitude or trusted few'] }, consistency: { acrossCycles:0.7, withinPhases:0.8, exceptions:[]}, recommendations: ['Schedule important decisions during these days.'] }];
      const mockWindows: ClarityWindow[] = [ { startDay:25, endDay:28, confidence:0.8, decisionTypes:['major life choices'], environmentRecommendations:['Quiet, familiar spaces'], preparation:['Review journal entries from cycle.']} ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { cycleData: mockCycleData, patterns: mockPatterns, predictedWindows: mockWindows } as any }), 500));
    }
    if (endpoint === '/api/v1/environment/analytics') {
      const mockEnvironments: EnvironmentAnalysis[] = [
        { id: 'envA', name: 'Home Office', type: 'Work', frequency: 20, lunarCorrelation:{bestDays:[25,26,27], challengingDays:[10,11], neutralDays:[]}, impact:{wellbeing:1, clarity:2, energy:0, authenticity:1}, attributes:{supportive:['quiet', 'private'], challenging:['isolated sometimes'], neutral:[]}, recommendations:{timing:['mornings'], duration:'4 hours max bursts', preparation:[], integration:[]} },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { environments: mockEnvironments, insights: ['Home office is generally good for clarity.'], recommendations: ['Ensure regular breaks.'] } as any }), 500));
    }
    if (endpoint === '/api/v1/decisions/timing') {
      const mockTimingWindows: TimingWindow[] = [ { startDate: new Date(Date.now() + 86400000*20).toISOString(), endDate: new Date(Date.now() + 86400000*23).toISOString(), lunarDays: [25,26,27,28], confidence:0.85, recommendedEnvironments:['Home', 'Quiet Cafe'], recommendedConsultations:['Trusted Friend A'], preparation:['Journal for a full cycle.'], notes:'Optimal window for major decisions.'} ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { recommendedWindows: mockTimingWindows, waitingPeriod: 'Full Lunar Cycle (approx 28 days)', environmentSuggestions: ['Visit multiple environments before deciding.'] } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown GET endpoint: ${endpoint}`));
  },
};

/** @description Payload for recording a lunar check-in. */
export type RecordLunarCheckInPayload = Omit<LunarCheckIn, 'id' | 'userId' | 'timestamp' | 'lunarPhase'>;

/** @description Filters for fetching lunar cycle analytics. */
export interface GetLunarCycleAnalyticsFilters {
  cycleStart: string; // ISO date string for the start of the cycle to analyze
  includePatterns: boolean;
  focusArea?: string; // e.g., "work", "relationships"
}

/** @description Simplified payload for recording an environment assessment. */
export interface RecordEnvironmentAssessmentPayload {
  name: string;
  type: string;
  attributes: string[]; // e.g., ["quiet", "natural light", "crowded"]
  impact_wellbeing: number; // -10 to 10
  impact_clarity: number;   // -10 to 10
  impact_energy: number;    // -10 to 10
  impact_authenticity: number; // -10 to 10
  lunarDay: number; // Current lunar day of the check-in
  photos?: string[]; // URLs to photos
  notes?: string;
}

/** @description Filters for fetching environment impact analytics. */
export interface GetEnvironmentImpactAnalyticsFilters {
  timeframe: string; // e.g., "current_cycle", "last_3_cycles", "all"
  sortBy: "wellbeing" | "clarity" | "consistency"; // Add more as needed
  environmentType?: string;
}

/** @description Simplified payload for recording relationship impact. */
export interface RecordRelationshipImpactPayload {
  person: string; // Name or identifier
  type: string;   // e.g., "friend", "colleague", "family"
  impact_wellbeing: number;
  impact_clarity: number;
  impact_energy: number;
  impact_authenticity: number;
  context: object; // e.g., { interactionType: "one-on-one", durationMinutes: 60 }
  lunarDay: number;
  notes?: string;
}

/** @description Filters for fetching decision timing recommendations. */
export interface GetDecisionTimingRecommendationsFilters {
  decisionType: string; // e.g., "major_life", "work_project", "relationship"
  importance: number; // 1-10
  timeframe: string; // Desired timeframe for decision, e.g., "next_cycle", "asap"
}


/** Records a daily lunar cycle check-in. */
export const recordLunarCheckIn = async (
  payload: RecordLunarCheckInPayload
): Promise<{ success: boolean; checkInId: string; insights?: string[]; patternUpdates?: object }> => {
  try {
    const response = await apiClient.post<any, RecordLunarCheckInPayload>('/api/v1/lunar/check-in', payload);
    return response.data;
  } catch (error) {
    console.error('Error recording lunar check-in:', error);
    return { success: false, checkInId: '', insights: [], patternUpdates: {} };
  }
};

/** Fetches lunar cycle analytics. */
export const getLunarCycleAnalytics = async (
  filters: GetLunarCycleAnalyticsFilters
): Promise<{ cycleData: LunarCheckIn[]; patterns: LunarPattern[]; predictedWindows: ClarityWindow[] }> => {
  try {
    const response = await apiClient.get<any>('/api/v1/lunar/cycle', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching lunar cycle analytics:', error);
    return { cycleData: [], patterns: [], predictedWindows: [] };
  }
};

/** Records an assessment of an environment. */
export const recordEnvironmentAssessment = async (
  payload: RecordEnvironmentAssessmentPayload
): Promise<{ success: boolean; environmentId: string; recommendations?: string[] }> => {
  try {
    const response = await apiClient.post<any, RecordEnvironmentAssessmentPayload>('/api/v1/environment/assessment', payload);
    return response.data;
  } catch (error) {
    console.error('Error recording environment assessment:', error);
    return { success: false, environmentId: '', recommendations: [] };
  }
};

/** Fetches analytics on environment impact. */
export const getEnvironmentImpactAnalytics = async (
  filters: GetEnvironmentImpactAnalyticsFilters
): Promise<{ environments: EnvironmentAnalysis[]; insights: string[]; recommendations: string[] }> => {
  try {
    const response = await apiClient.get<any>('/api/v1/environment/analytics', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching environment impact analytics:', error);
    return { environments: [], insights: [], recommendations: [] };
  }
};

/** Records the impact of a relationship interaction. */
export const recordRelationshipImpact = async (
  payload: RecordRelationshipImpactPayload
): Promise<{ success: boolean; relationshipId: string; insights?: string[] }> => {
  try {
    const response = await apiClient.post<any, RecordRelationshipImpactPayload>('/api/v1/relationship/assessment', payload);
    return response.data;
  } catch (error) {
    console.error('Error recording relationship impact:', error);
    return { success: false, relationshipId: '', insights: [] };
  }
};

/** Fetches decision timing recommendations based on the lunar cycle. */
export const getDecisionTimingRecommendations = async (
  filters: GetDecisionTimingRecommendationsFilters
): Promise<{ recommendedWindows: TimingWindow[]; waitingPeriod: string; environmentSuggestions: string[] }> => {
  try {
    const response = await apiClient.get<any>('/api/v1/decisions/timing', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching decision timing recommendations:', error);
    return { recommendedWindows: [], waitingPeriod: '', environmentSuggestions: [] };
  }
};
