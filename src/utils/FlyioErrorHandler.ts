/**
 * @file FlyioErrorHandler.ts
 * @description Utility for handling Fly.io specific API error responses
 */

import axios, {AxiosError} from 'axios';

export interface FlyioErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  status?: number | string;
  code?: string;
}

export interface FormattedApiError {
  message: string;
  statusCode?: number;
  isNetworkError: boolean;
  errorCode?: string;
  rawError?: any;
}

/**
 * Format API error response in a consistent way
 * Handles Fly.io specific error responses
 */
export const formatApiError = (error: unknown): FormattedApiError => {
  // Default error response
  const defaultError: FormattedApiError = {
    message: 'An unknown error occurred',
    isNetworkError: false,
  };

  if (!error) {
    return defaultError;
  }

  // Check if it's an Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<FlyioErrorResponse>;

    // Network error (no response from server)
    if (axiosError.code === 'ECONNABORTED' || !axiosError.response) {
      return {
        message: 'Network error: Could not connect to the server',
        isNetworkError: true,
        errorCode: axiosError.code,
        rawError: axiosError,
      };
    }

    // Server responded with an error
    const statusCode = axiosError.response.status;
    const responseData = axiosError.response.data;

    // Extract error message based on Fly.io error format
    const errorMessage =
      responseData?.detail ||
      responseData?.message ||
      responseData?.error ||
      `Error ${statusCode}`;

    return {
      message: errorMessage,
      statusCode,
      isNetworkError: false,
      errorCode: responseData?.code,
      rawError: axiosError,
    };
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      message: error.message || 'An application error occurred',
      isNetworkError: false,
      rawError: error,
    };
  }

  // For any other type of error
  return {
    message: String(error) || defaultError.message,
    isNetworkError: false,
    rawError: error,
  };
};

/**
 * Helper to check if an error is a network connectivity issue
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response || error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Helper to check if an error is an authentication error (401)
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.status === 401;
  }
  return false;
};

/**
 * Handle different API error types and provide user-friendly messages
 */
export const getFriendlyErrorMessage = (error: unknown): string => {
  const formattedError = formatApiError(error);

  switch (formattedError.statusCode) {
    case 400:
      return 'The request was invalid. Please check your input.';
    case 401:
      return 'Authentication failed. Please login again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource could not be found.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'The server encountered an error. Please try again later.';
    default:
      return formattedError.isNetworkError
        ? 'Unable to connect to the server. Please check your internet connection.'
        : formattedError.message;
  }
};

const FlyioErrorHandler = {
  formatApiError,
  isNetworkError,
  isAuthError,
  getFriendlyErrorMessage,
};

export default FlyioErrorHandler;
