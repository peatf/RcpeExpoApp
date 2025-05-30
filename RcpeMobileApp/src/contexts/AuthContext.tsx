import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import authService from '../services/authService';
import apiClient from '../services/api'; // To set/unset token on axios instance if needed, though interceptor handles Authorization header

// Define the shape of the user object (adjust as per your API response)
interface User {
  id: string;
  email: string;
  // Add other user properties you need
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  // You might add a function to load user profile data here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true to check token status

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await authService.getAccessToken();
        if (token) {
          setAccessToken(token);
          // OPTIONAL: Fetch user profile if token exists
          // For example:
          // const profile = await apiClient.get('/users/me'); // Assuming you have a /me endpoint
          // setUser(profile.data);
          // For now, we'll assume token presence means authenticated, user details can be fetched on pages
        }
      } catch (e) {
        console.error('Restoring token failed', e);
        // Consider calling logout if token is corrupted or invalid
        await authService.logout(); // Ensure clean state if token check fails
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      if (authData && authData.accessToken) {
        setAccessToken(authData.accessToken);
        // Optionally, fetch user profile here after login
        // const profile = await apiClient.get('/users/me');
        // setUser(profile.data);
        // For simplicity, we're not fetching user profile in this basic setup
        // You would typically get user data from the login response or a subsequent call
      } else {
        // Handle login failure (e.g., show error message)
        throw new Error('Login failed: No auth data returned');
      }
    } catch (error) {
      console.error('Login context error:', error);
      setAccessToken(null);
      setUser(null);
      // Re-throw to allow UI to handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setAccessToken(null);
      setUser(null);
      // Clear any other user-related state
    } catch (error) {
      console.error('Logout context error:', error);
      // Even if logout service fails, clear state locally
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!accessToken; // Derived state

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, isAuthenticated, login, logout }}>
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
