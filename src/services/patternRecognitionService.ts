/**
 * @file patternRecognitionService.ts
 * @description Service for fetching and managing recognized patterns and insights.
 */

import {
  PatternRecognitionPattern,
  PatternDetail,
  AuthorityPattern,
  SupportingPoint, // Will use this for type hint, actual data as any[] for now
  AuthorityType
} from '../types/humanDesignTools';

// Mock apiClient - replace with actual import from ./api when available
const apiClient = {
  get: async <T_Response>(endpoint: string, params?: any): Promise<{ data: T_Response }> => {
    console.log(`Mock API GET request to ${endpoint} with params:`, params);
    if (endpoint === '/api/v1/patterns/recognition') {
      const mockPatterns: PatternRecognitionPattern[] = [
        { id: 'prp1', title: 'Morning Focus', description: 'Increased focus and productivity in morning hours.', category: 'energy', confidence: 0.85, discoveredAt: new Date().toISOString(), dataPoints: 20, authorityRelevance: 'Sacral response stronger', impactDomains: ['work', 'productivity'] },
        { id: 'prp2', title: 'Weekend Slump', description: 'Noticeable dip in energy on weekends.', category: 'energy', confidence: 0.70, discoveredAt: new Date().toISOString(), dataPoints: 15, authorityRelevance: 'Less sacral engagement', impactDomains: ['personal', 'energy'] },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { patterns: mockPatterns, insights: ['You seem to be a morning person.', 'Weekend activities might need re-evaluation.'], confidence: 0.78 } as any }), 500));
    }
    if (endpoint.startsWith('/api/v1/patterns/detail/')) {
        const patternId = endpoint.split('/').pop();
        const mockDetail: PatternDetail = {
            id: patternId || 'prp_detail_mock', title: 'Detailed Morning Focus', description: 'Further details on morning productivity.', category: 'energy', confidence: 0.88, discoveredAt: new Date().toISOString(), dataPoints: 25, authorityRelevance: 'Sacral response consistently positive', impactDomains: ['work', 'creativity'],
            timeframe: { start: new Date(Date.now() - 86400000 * 30).toISOString(), end: new Date().toISOString() },
            frequencyMetrics: { occurrences: 25, consistency: 0.9, trend: 'stable' },
            correlatedPatterns: [{ patternId: 'prp2', correlationStrength: -0.5, description: 'Opposite of Weekend Slump' }],
            visualizationData: { type: 'bar_chart', values: [10,12,15,11,13] }
        };
      return new Promise((resolve) => setTimeout(() => resolve({ data: { pattern: mockDetail, supportingData: [{ timestamp: new Date().toISOString(), dataSource: 'living-log', value: 'High energy today' }] as SupportingPoint[], recommendations: ['Try starting your most important tasks by 10 AM.'] } as any }), 500));
    }
    if (endpoint === '/api/v1/patterns/authority-specific') {
      const mockAuthorityPatterns: AuthorityPattern[] = [
        { id: 'ap1', authorityType: AuthorityType.Sacral.toString(), patternName: 'Sacral Yes Consistency', description: 'Consistent positive outcomes when following initial sacral "yes".', confidence: 0.9, recommendedActions: ['Continue to trust initial gut response.'], impactScore: 8 },
      ];
      return new Promise((resolve) => setTimeout(() => resolve({ data: { authorityPatterns: mockAuthorityPatterns, priorityInsights: ['Following your Sacral authority leads to high satisfaction.'] } as any }), 500));
    }
    if (endpoint.startsWith('/api/v1/patterns/correlation/')) {
        return new Promise((resolve) => setTimeout(() => resolve({ data: { correlationStrength: 0.67, significance: 0.05, insights: ['Strong positive correlation found.'] } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown GET endpoint: ${endpoint}`));
  },
  put: async <T_Response, T_Request = any>(endpoint: string, payload: T_Request): Promise<{ data: T_Response }> => {
    console.log(`Mock API PUT request to ${endpoint} with payload:`, payload);
    if (endpoint.startsWith('/api/v1/patterns/') && endpoint.endsWith('/feedback')) {
      return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true, updatedConfidence: 0.82 } as any }), 500));
    }
    return Promise.reject(new Error(`Unknown PUT endpoint: ${endpoint}`));
  }
};

/** @description Filters for fetching detected patterns. */
export interface GetDetectedPatternsFilters {
  timeframe?: "week" | "month" | "all";
  category?: string;
  limit?: number;
}

/** @description Payload for submitting feedback on a pattern. */
export interface SubmitPatternFeedbackPayload {
  isAccurate: boolean;
  notes?: string;
  adjustmentFactors?: string[];
}

/**
 * Fetches detected patterns based on specified filters.
 * @async
 * @param {GetDetectedPatternsFilters} [filters] - Optional filters for querying patterns.
 * @returns {Promise<{ patterns: PatternRecognitionPattern[], insights: string[], confidence: number }>} Detected patterns, insights, and overall confidence.
 */
export const getDetectedPatterns = async (
  filters?: GetDetectedPatternsFilters
): Promise<{ patterns: PatternRecognitionPattern[]; insights: string[]; confidence: number }> => {
  try {
    const response = await apiClient.get<{ patterns: PatternRecognitionPattern[]; insights: string[]; confidence: number }>(
      '/api/v1/patterns/recognition',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching detected patterns:', error);
    return { patterns: [], insights: [], confidence: 0 };
  }
};

/**
 * Fetches detailed information about a specific pattern.
 * @async
 * @param {string} patternId - The ID of the pattern to fetch details for.
 * @returns {Promise<{ pattern: PatternDetail, supportingData: any[], recommendations: string[] }>} Detailed pattern information.
 */
export const getPatternDetail = async (
  patternId: string
): Promise<{ pattern: PatternDetail | null; supportingData: SupportingPoint[]; recommendations: string[] }> => {
  try {
    // Explicitly type the expected structure for response.data
    const response = await apiClient.get<{ pattern: PatternDetail, supportingData: SupportingPoint[], recommendations: string[] }>(
      `/api/v1/patterns/detail/${patternId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pattern detail for ${patternId}:`, error);
    return { pattern: null, supportingData: [], recommendations: [] };
  }
};

/**
 * Submits user feedback on a pattern's accuracy.
 * @async
 * @param {string} patternId - The ID of the pattern to submit feedback for.
 * @param {SubmitPatternFeedbackPayload} payload - The feedback data.
 * @returns {Promise<{ success: boolean, updatedConfidence: number }>} Confirmation and updated confidence score.
 */
export const submitPatternFeedback = async (
  patternId: string,
  payload: SubmitPatternFeedbackPayload
): Promise<{ success: boolean; updatedConfidence: number }> => {
  try {
    const response = await apiClient.put<{ success: boolean; updatedConfidence: number }, SubmitPatternFeedbackPayload>(
      `/api/v1/patterns/${patternId}/feedback`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Error submitting feedback for pattern ${patternId}:`, error);
    return { success: false, updatedConfidence: 0 };
  }
};

/**
 * Fetches authority-specific pattern insights.
 * @async
 * @returns {Promise<{ authorityPatterns: AuthorityPattern[], priorityInsights: string[] }>} Authority-specific patterns and insights.
 */
export const getAuthoritySpecificPatterns = async (): Promise<{ authorityPatterns: AuthorityPattern[]; priorityInsights: string[] }> => {
  try {
    const response = await apiClient.get<{ authorityPatterns: AuthorityPattern[]; priorityInsights: string[] }>(
      '/api/v1/patterns/authority-specific'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching authority-specific patterns:', error);
    return { authorityPatterns: [], priorityInsights: [] };
  }
};

/**
 * Fetches correlation between two data points or patterns.
 * @async
 * @param {string} sourceId - The ID of the source data point/pattern.
 * @param {string} targetId - The ID of the target data point/pattern.
 * @returns {Promise<{ correlationStrength: number, significance: number, insights: string[] }>} Correlation analysis results.
 */
export const getPatternCorrelation = async (
  sourceId: string,
  targetId: string
): Promise<{ correlationStrength: number; significance: number; insights: string[] }> => {
  try {
    const response = await apiClient.get<{ correlationStrength: number; significance: number; insights: string[] }>(
      `/api/v1/patterns/correlation/${sourceId}/${targetId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pattern correlation between ${sourceId} and ${targetId}:`, error);
    return { correlationStrength: 0, significance: 0, insights: [] };
  }
};
