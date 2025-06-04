/**
 * @file AuthContext.tsx
 * @description Authentication context for managing user authentication state
 */
import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import authService from '../services/authService';
import {User, AuthTokens, LoginCredentials} from '../types';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{success: boolean; error?: string}>;
  signUp: (userData: {name: string; email: string; password: string}) => Promise<{success: boolean; error?: string}>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  // Initialize auth state on app startup
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already logged in
      const accessToken = await authService.getAccessToken();
      const storedUser = await authService.getCurrentUser();
      
      if (accessToken && storedUser) {
        const refreshToken = await authService.getRefreshToken();
        setUser(storedUser);
        setTokens({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success && result.user && result.tokens) {
        setUser(result.user);
        setTokens(result.tokens);
        return {success: true};
      } else {
        return {
          success: false,
          error: result.error || 'Login failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: {name: string; email: string; password: string}) => {
    try {
      setIsLoading(true);
      const result = await authService.register(userData);
      
      if (result.success && result.user && result.tokens) {
        setUser(result.user);
        setTokens(result.tokens);
        return {success: true};
      } else {
        return {
          success: false,
          error: result.error || 'Sign up failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear state even if logout API call fails
      setUser(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        setTokens(prev => prev ? {...prev, access_token: newToken} : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, logout the user
      await logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    signUp,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
