# React Native Conversion Guide for RCPE

## 3. Replace Browser Storage with AsyncStorage

Install AsyncStorage:
```bash
npm install @react-native-async-storage/async-storage
```

Update your AuthService:

```typescript
// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'YOUR_API_BASE_URL'; // Set your actual API URL

export class AuthService {
  // Store token in AsyncStorage
  private async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem('accessToken', token);
  }

  // Store refresh token in AsyncStorage
  private async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem('refreshToken', token);
  }

  // Get token from AsyncStorage
  public async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  // Get refresh token from AsyncStorage
  private async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('refreshToken');
  }

  // Check if token exists and is valid
  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  // Login user with email and password
  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/v1/auth/login`, 
        { email, password }
      );
      
      await this.setToken(response.data.access_token);
      await this.setRefreshToken(response.data.refresh_token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user by removing tokens
  public async logout(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }
}
```

## 4. Replace React Router with React Navigation

Install React Navigation:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
# For iOS
cd ios && pod install
```

Create the navigation structure:

```typescript
// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FrequencyMapperScreen from '../screens/FrequencyMapperScreen';
import CalibrationToolScreen from '../screens/CalibrationToolScreen';
import OracleScreen from '../screens/OracleScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="FrequencyMapper" component={FrequencyMapperScreen} />
      <Tab.Screen name="CalibrationTool" component={CalibrationToolScreen} />
      <Tab.Screen name="Oracle" component={OracleScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 5. Convert Individual Screens

### Login Screen (React Native version):

```typescript
// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Reality Creation Profile Engine</Text>
        <Text style={styles.subtitle}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
```

### Frequency Mapper Screen (React Native version):

```typescript
// screens/FrequencyMapperScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Api } from '../services/api';

const FrequencyMapperScreen = ({ navigation }) => {
  const [rawStatement, setRawStatement] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rawStatement.trim()) {
      Alert.alert('Error', 'Please enter a statement');
      return;
    }

    setLoading(true);
    try {
      const response = await Api.frequencyMapper.processStep({
        raw_statement: rawStatement,
        session_id: sessionId || require('uuid').v4(),
      });

      setCurrentStep(response.data);
      setSessionId(response.data.session_id);
    } catch (error) {
      Alert.alert('Error', 'Failed to process your request');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (optionId, optionText) => {
    setLoading(true);
    try {
      const response = await Api.frequencyMapper.processStep({
        raw_statement: rawStatement,
        session_id: sessionId,
        current_refinement_path: [...(currentStep?.current_refinement_path || []), optionText],
        selected_option_id: optionId,
      });

      if (response.data.step_type === 'final') {
        navigation.navigate('CalibrationTool', {
          frequencyMapperOutput: {
            desired_state: response.data.desired_state,
            source_statement: response.data.source_statement,
            mapped_drive_mechanic: response.data.mapped_drive_mechanic,
            contextual_energy_family: response.data.contextual_energy_family,
          },
        });
      } else {
        setCurrentStep(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process your selection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequency Mapper</Text>
      <Text style={styles.description}>
        The Frequency Mapper helps refine your intentions and desires into a clear frequency statement.
      </Text>

      {!currentStep && (
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textArea}
            placeholder="What do you want to create or experience in your life?"
            value={rawStatement}
            onChangeText={setRawStatement}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !rawStatement.trim()}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Begin Frequency Mapping</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {currentStep && currentStep.step_type === 'refinement' && (
        <View style={styles.refinementSection}>
          <Text style={styles.promptText}>{currentStep.prompt_text}</Text>
          {currentStep.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionButton}
              onPress={() => handleOptionSelect(option.id, option.text)}
              disabled={loading}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  refinementSection: {
    marginTop: 20,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FrequencyMapperScreen;
```

## 6. Update AuthContext for React Native

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '../services/authService';
import { User } from '../interfaces/models';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.login(email, password);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 7. Main App Component

```typescript
// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
```

## 8. iOS-Specific Configurations

Add to `ios/RCPEApp/Info.plist`:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

## 9. Required Dependencies Summary

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "axios": "^1.6.2",
    "jwt-decode": "^4.0.0",
    "uuid": "^9.0.1"
  }
}
```

This conversion provides you with a true native iOS app experience with better performance, native UI components, and proper iOS integration. The main trade-offs are increased development complexity and the need to maintain platform-specific code.
