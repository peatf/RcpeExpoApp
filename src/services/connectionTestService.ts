/**
 * @file connectionTestService.ts
 * @description Service for testing backend connectivity and API health
 */
import apiClient from './api';
import axios from 'axios';

export interface ConnectionTestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  latency?: number;
}

export const connectionTestService = {
  /**
   * Test basic backend connectivity
   * - Updated to use the correct health endpoint
   */
  testBackendConnection: async (): Promise<ConnectionTestResult> => {
    const startTime = Date.now();

    try {
      console.log('Testing health endpoint...');
      const response = await apiClient.get('/health');
      const latency = Date.now() - startTime;

      console.log('Backend connection successful:', response.data);
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      console.error('Backend connection failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Connection failed',
        timestamp: Date.now(),
        latency,
      };
    }
  },

  /**
   * Test authenticated endpoints
   * - Updated to use correct API path structure
   */
  testAuthenticatedConnection: async (): Promise<ConnectionTestResult> => {
    const startTime = Date.now();

    try {
      // For authenticated endpoint, we'll use the user profile endpoint
      const currentUser = 'me'; // Or get the actual user ID if available
      const response = await apiClient.get(
        `/api/v1/user/${currentUser}/profile`,
      );
      const latency = Date.now() - startTime;

      console.log('Authenticated connection successful:', response.data);
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      console.error('Authenticated connection failed:', error);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.message ||
          'Authentication failed',
        timestamp: Date.now(),
        latency,
      };
    }
  },

  /**
   * Test base chart endpoint specifically
   * - Updated to use correct path format based on API schema
   */
  testBaseChartConnection: async (
    userId: string,
  ): Promise<ConnectionTestResult> => {
    const startTime = Date.now();

    try {
      // The correct endpoint based on OpenAPI schema is:
      // /api/v1/charts/base/{user_id}
      const response = await apiClient.get(`/api/v1/charts/base/${userId}`);
      const latency = Date.now() - startTime;

      console.log('Base chart connection successful:', response.data);
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      console.error('Base chart connection failed:', error);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.message ||
          'Base chart fetch failed',
        timestamp: Date.now(),
        latency,
      };
    }
  },

  /**
   * Run comprehensive connection tests
   */
  runComprehensiveTest: async (
    userId?: string,
  ): Promise<{
    health: ConnectionTestResult;
    auth?: ConnectionTestResult;
    baseChart?: ConnectionTestResult;
    overall: boolean;
  }> => {
    const results = {
      health: await connectionTestService.testBackendConnection(),
      auth: undefined as ConnectionTestResult | undefined,
      baseChart: undefined as ConnectionTestResult | undefined,
      overall: false,
    };

    // Only test authenticated endpoints if we have a user
    if (userId) {
      results.auth = await connectionTestService.testAuthenticatedConnection();
      results.baseChart = await connectionTestService.testBaseChartConnection(
        userId,
      );

      results.overall =
        results.health.success &&
        (results.auth?.success ?? false) &&
        (results.baseChart?.success ?? false);
    } else {
      results.overall = results.health.success;
    }

    return results;
  },
};

export default connectionTestService;
