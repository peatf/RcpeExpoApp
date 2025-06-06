/**
 * @file waveWitnessService.ts
 * @description Service for managing Wave Witness energy check-ins, patterns, and predictions.
 */

import { EnergyCheckIn, EnergyPattern, TimelinePoint, ClarityPrediction, AuthorityType } from '../types/humanDesignTools';

// Mock apiClient - replace with actual import from ./api when available
const apiClient = {
  post: async <T_Response, T_Request = any>(endpoint: string, payload: T_Request): Promise<{ data: T_Response }> => {
    console.log(`Mock API POST request to ${endpoint} with payload:`, payload);
    if (endpoint === '/api/v1/wave-witness/check-in') {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, entry_id: `mock_checkin_${Date.now()}` } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown POST endpoint: ${endpoint}`));
  },
  get: async <T_Response>(endpoint: string, params?: any): Promise<{ data: T_Response }> => {
    console.log(`Mock API GET request to ${endpoint} with params:`, params);
    if (endpoint === '/api/v1/wave-witness/patterns') {
      const mockPatterns: EnergyPattern[] = [
        { id: 'ep1', description: 'Energy tends to be higher on weekday mornings.', confidence: 0.75, patternType: 'energy-peak', timeframe: { timeOfDay: ['Morning'] } },
        { id: 'ep2', description: 'Clarity window often appears mid-week for 2 days.', confidence: 0.6, patternType: 'clarity-window', timeframe: { cycleLength: 7, peakDays: [2,3]} },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { patterns: mockPatterns, insights: ['Mornings seem to be your energetic peak.'] } as any }), 500));
    }
    if (endpoint === '/api/v1/wave-witness/timeline') {
      const mockTimelinePoints: TimelinePoint[] = [
        { timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), energyLevel: 7, authorityMetrics: { type: AuthorityType.Sacral, state: 'yes'} },
        { timestamp: new Date(Date.now() - 86400000).toISOString(), energyLevel: 5, authorityMetrics: { type: AuthorityType.Sacral, state: 'neutral'} },
        { timestamp: new Date().toISOString(), energyLevel: 8, authorityMetrics: { type: AuthorityType.Sacral, state: 'yes'} },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { timelinePoints: mockTimelinePoints, annotations: [{ point_id: 'tp1', note: 'Big decision day'}] } as any }), 500));
    }
    if (endpoint === '/api/v1/wave-witness/clarity-prediction') {
      const mockPredictions: ClarityPrediction[] = [
        { startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 * 2).toISOString(), clarityLevel: 0.8, authorityBasis: 'Based on your typical 7-day cycle', recommendedUse: 'Ideal for strategic planning.' },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { predictions: mockPredictions, confidence: 0.7 } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown GET endpoint: ${endpoint}`));
  },
  put: async <T_Response, T_Request = any>(endpoint: string, payload: T_Request): Promise<{ data: T_Response }> => {
    console.log(`Mock API PUT request to ${endpoint} with payload:`, payload);
    if (endpoint === '/api/v1/wave-witness/decision-outcome') {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, updatedInsights: ['Satisfaction recorded, this may refine future predictions.'] } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown PUT endpoint: ${endpoint}`));
  }
};

/** @description Payload for recording an energy check-in. */
export interface RecordCheckInPayload {
  timestamp: string;
  checkInType: string; // e.g., "morning", "evening", "adhoc"
  authorityData: object; // To be defined more specifically based on authority needs
  energyLevel: number; // 1-10
  contextData?: object; // e.g., location, activities, people
}

/** @description Filters for fetching energy patterns. */
export interface GetEnergyPatternsFilters {
  timeframe?: "week" | "month" | "year";
  patternTypes?: string[]; // e.g., ["energy-peak", "clarity-window"]
}

/** @description Filters for fetching timeline data. */
export interface GetTimelineDataFilters {
  startDate: string;
  endDate: string;
  resolution: "day" | "week" | "month";
}

/** @description Payload for recording a decision outcome. */
export interface RecordDecisionOutcomePayload {
  decisionId: string;
  satisfaction: number; // 1-10
  notes: string;
}

/**
 * Records an energy check-in for the user.
 * @async
 * @param {RecordCheckInPayload} payload - The check-in data.
 * @returns {Promise<{ success: boolean, entry_id: string }>} Confirmation and ID of the new check-in.
 */
export const recordCheckIn = async (
  payload: RecordCheckInPayload
): Promise<{ success: boolean; entry_id: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; entry_id: string }, RecordCheckInPayload>(
      '/api/v1/wave-witness/check-in',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error recording check-in:', error);
    return { success: false, entry_id: '' };
  }
};

/**
 * Fetches authority-specific energy patterns.
 * @async
 * @param {GetEnergyPatternsFilters} [filters] - Optional filters for querying patterns.
 * @returns {Promise<{ patterns: EnergyPattern[], insights: string[] }>} Detected patterns and insights.
 */
export const getEnergyPatterns = async (
  filters?: GetEnergyPatternsFilters
): Promise<{ patterns: EnergyPattern[]; insights: string[] }> => {
  try {
    const response = await apiClient.get<{ patterns: EnergyPattern[]; insights: string[] }>(
      '/api/v1/wave-witness/patterns',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching energy patterns:', error);
    return { patterns: [], insights: [] };
  }
};

/**
 * Fetches timeline data for visualizing energy levels and other metrics.
 * @async
 * @param {GetTimelineDataFilters} filters - Filters for specifying the timeline data range and resolution.
 * @returns {Promise<{ timelinePoints: TimelinePoint[], annotations: any[] }>} Timeline points and annotations.
 */
export const getTimelineData = async (
  filters: GetTimelineDataFilters
): Promise<{ timelinePoints: TimelinePoint[]; annotations: any[] }> => {
  try {
    const response = await apiClient.get<{ timelinePoints: TimelinePoint[]; annotations: any[] }>(
      '/api/v1/wave-witness/timeline',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return { timelinePoints: [], annotations: [] };
  }
};

/**
 * Fetches authority-specific clarity predictions.
 * @async
 * @returns {Promise<{ predictions: ClarityPrediction[], confidence: number }>} Clarity predictions and overall confidence.
 */
export const getClarityPredictions = async (): Promise<{ predictions: ClarityPrediction[]; confidence: number }> => {
  try {
    const response = await apiClient.get<{ predictions: ClarityPrediction[]; confidence: number }>(
      '/api/v1/wave-witness/clarity-prediction'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching clarity predictions:', error);
    return { predictions: [], confidence: 0 };
  }
};

/**
 * Records the outcome of a decision for correlation with energy patterns.
 * @async
 * @param {RecordDecisionOutcomePayload} payload - The decision outcome data.
 * @returns {Promise<{ success: boolean, updatedInsights?: string[] }>} Confirmation and potentially updated insights.
 */
export const recordDecisionOutcome = async (
  payload: RecordDecisionOutcomePayload
): Promise<{ success: boolean; updatedInsights?: string[] }> => {
  try {
    const response = await apiClient.put<{ success: boolean; updatedInsights?: string[] }, RecordDecisionOutcomePayload>(
      '/api/v1/wave-witness/decision-outcome',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error recording decision outcome:', error);
    return { success: false };
  }
};
