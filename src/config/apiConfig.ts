/**
 * @file apiConfig.ts
 * @description Configuration for API endpoints and paths
 * Updated to match the Fly.io API structure
 */

// API Version constant
const API_VERSION = 'v1';

// Base URL for API requests
import { Platform } from 'react-native';

export const API_CONFIG = {
  // Base URL - Updated to use localhost for profile creation
  // Use 10.0.2.2 for Android emulator, localhost for iOS simulator or physical device
  BASE_URL: Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001', // Development: local backend for profile creation
  // BASE_URL: 'https://reality-creation-profile-engine.fly.dev', // Production: deployed on Fly.io

  // API Version path component (for versioned endpoints)
  API_VERSION,

  // Endpoints
  ENDPOINTS: {
    // Health check endpoint (not under /api/v1)
    HEALTH: '/health',

    // Root status endpoint
    ROOT: '/',

    // Profile creation endpoints
    PROFILE: {
      CREATE: '/profile/create',
      GET: (profileId: string) => `/profile/${profileId}`,
    },

    // Base chart endpoint
    BASE_CHART: (userId: string) => `/api/${API_VERSION}/charts/base/${userId}`,

    // User profile endpoint
    USER_PROFILE: (userId: string) =>
      `/api/${API_VERSION}/user/${userId}/profile`,

    // User data management endpoints
    USER_DATA: {
      MY_PROFILES: `/api/${API_VERSION}/user-data/users/me/profiles`,
    },

    // Authentication endpoints - not confirmed yet, may need adjustment
    AUTH: {
      LOGIN: `/api/${API_VERSION}/auth/login`,
      REFRESH: `/api/${API_VERSION}/auth/refresh`,
      LOGOUT: `/api/${API_VERSION}/auth/logout`,
    },
  },
};

export default API_CONFIG;
