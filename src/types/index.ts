/**
 * @file types.ts
 * @description TypeScript type definitions for the RCPE mobile app
 */

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  error?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base Chart types
export interface BaseChartData {
  energy_family?: Record<string, any>;
  energy_class?: Record<string, any>;
  processing_core?: Record<string, any>;
  fetchedAt?: number;
}

// Profile Creation types
export interface BirthData {
  birth_date: string; // YYYY-MM-DD format
  birth_time: string; // HH:MM:SS format
  city_of_birth: string;
  country_of_birth: string;
}

export interface TypologyResponse {
  'cognitive-alignment'?: string;
  'perceptual-focus'?: string;
  'kinetic-drive'?: string;
  'choice-navigation'?: string;
  'resonance-field'?: string;
  'manifestation-rhythm'?: string;
}

export interface MasteryResponse {
  [questionId: string]: string; // e.g., "core-q1": "creative-expression"
}

export interface AssessmentResponses {
  typology: TypologyResponse;
  mastery: MasteryResponse;
}

export interface ProfileCreationPayload {
  birth_data: BirthData;
  assessment_responses: AssessmentResponses;
}

export interface ProfileCreationResponse {
  profile_id: string;
  success?: boolean;
  detail?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface TypologySpectrum {
  id: string;
  name: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  questions: QuizQuestion[];
}

export interface MasterySection {
  id: string;
  title: string;
  description: string;
  progress: number;
  questions: QuizQuestion[];
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  FrequencyMapper: undefined;
  CalibrationTool: undefined;
  Oracle: undefined;
  UserBaseChart: undefined;
  ProfileCreation: undefined;
};

// Screen props
export interface BaseScreenProps {
  navigation: any;
  route: any;
}

// Component props
export interface LoadingProps {
  visible: boolean;
  message?: string;
}

export interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

// Form types
export interface FormField {
  label: string;
  value: string;
  error?: string;
  required?: boolean;
}

// Connection test types
export interface ConnectionTestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  latency?: number;
}
