/**
 * @file authService.ts
 * @description Service for handling authentication logic, including login, logout,
 * token storage (using AsyncStorage), and token refresh operations.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, AuthTokens, AuthResponse, LoginCredentials} from '../types';

// Define token keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Helper function to generate user ID and token based on email
const generateUserAuth = (email: string) => {
  const emailPrefix = email.split('@')[0].toLowerCase();
  let userId: string;
  let token: string;

  if (emailPrefix.includes('alice')) {
    userId = 'alice';
    token = 'alice-token';
  } else if (emailPrefix.includes('bob')) {
    userId = 'bob';
    token = 'bob-token';
  } else {
    userId = 'mock-user-123';
    token = 'mock-token-123';
  }

  return { userId, token };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email && credentials.password) {
        const { userId, token } = generateUserAuth(credentials.email);
        
        const mockUser: User = {
          id: userId,
          email: credentials.email,
          name: credentials.email.split('@')[0],
          created_at: new Date().toISOString(),
        };
        
        const mockTokens: AuthTokens = {
          access_token: token,
          refresh_token: token + '-refresh',
          token_type: 'Bearer',
          expires_in: 3600,
        };
        
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, mockTokens.access_token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, mockTokens.refresh_token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        
        return {
          success: true,
          user: mockUser,
          tokens: mockTokens,
        };
      } else {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { userId, token } = generateUserAuth(userData.email);
      
      const mockUser: User = {
        id: userId,
        email: userData.email,
        name: userData.name,
        created_at: new Date().toISOString(),
      };
      
      const mockTokens: AuthTokens = {
        access_token: token,
        refresh_token: token + '-refresh',
        token_type: 'Bearer',
        expires_in: 3600,
      };
      
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, mockTokens.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, mockTokens.refresh_token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      
      return {
        success: true,
        user: mockUser,
        tokens: mockTokens,
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Logout failed:', error);
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

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
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
      // Mock refresh token since we don't have a backend auth system yet
      // In production, this would make an API call to refresh the token
      
      // For now, just generate a new mock token
      const newAccessToken = 'mock-access-token-' + Date.now();
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await authService.logout();
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await authService.getAccessToken();
    return !!token;
  },
};

export default authService;
