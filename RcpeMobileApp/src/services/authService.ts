import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Assuming api.ts will handle base URL and interceptors

// Define token keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// API details (replace with your actual API base URL)
// It's better to have this in a central api.ts or config file
const API_BASE_URL = 'https://reality-creation-profile-engine.vercel.app/api/v1';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  // Add other fields your login endpoint returns, e.g., user details
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string; // Or your API might return a new refresh token
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse | null> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials);
      if (response.data.accessToken && response.data.refreshToken) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        // You might want to set the token in your API client (axios instance) here if not handled by interceptors
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error appropriately in UI
      throw error; // Re-throw to be caught by the calling function
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      // Optionally, call a backend logout endpoint
      // await axios.post(`${API_BASE_URL}/auth/logout`);
      // Clear token from API client (axios instance)
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error appropriately
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  },

  refreshToken: async (): Promise<string | null> => {
    const currentRefreshToken = await authService.getRefreshToken();
    if (!currentRefreshToken) {
      console.log('No refresh token available.');
      return null;
    }

    try {
      const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      // If your API sends back a new refresh token, store it. Otherwise, the old one might still be valid.
      if (newRefreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }

      // You might want to set the new token in your API client (axios instance) here
      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails (e.g., refresh token expired), log out the user
      await authService.logout();
      return null;
    }
  },

  // Helper to check if user is authenticated (e.g., has an access token)
  isAuthenticated: async (): Promise<boolean> => {
    const token = await authService.getAccessToken();
    return !!token; // Returns true if token exists, false otherwise
  },
};

export default authService;
