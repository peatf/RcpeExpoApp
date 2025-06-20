/**
 * @file api.ts
 * @description Configures the main Axios instance for API communication.
 * Includes interceptors to automatically attach JWT tokens to requests
 * and handle token refresh logic using authService.
 */
import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import authService from './authService';
import API_CONFIG from '../config/apiConfig';
import FlyioErrorHandler from '../utils/FlyioErrorHandler';

// Define your API base URL - Configure this for your backend
const API_BASE_URL = API_CONFIG.BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (__DEV__) {
        console.log('Adding auth token to request:', {
          url: config.url,
          method: config.method,
          token: token.substring(0, 10) + '...', // Log only part of token for security
          baseURL: config.baseURL || '',
          fullURL: (config.baseURL || '') + (config.url || ''),
        });
      }
    } else {
      if (__DEV__) {
        console.warn('No auth token available for request:', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL || '',
          fullURL: (config.baseURL || '') + (config.url || ''),
        });
      }
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        hasData: !!response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log the error for debugging
    if (__DEV__) {
      console.error('API Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await authService.refreshToken();
        if (newAccessToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          // If refresh token is invalid or refresh fails, logout
          await authService.logout();
          console.error('Refresh token failed, logging out.');
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await authService.logout();
        console.error('Critical refresh error, logging out.', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// Export utility for handling API errors in components
export const handleApiError = (
  error: unknown,
  fallbackMessage: string = 'An error occurred',
): string => {
  return FlyioErrorHandler.getFriendlyErrorMessage(error) || fallbackMessage;
};

export default apiClient;
