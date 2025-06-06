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
  CalibrationTool: {
    sessionId?: string;
    frequencyMapperOutput?: FrequencyMapperOutput;
    previousTool?: 'frequency_mapper';
  } | undefined;
  Oracle: {
    handoffData?: any;
    previousTool?: 'calibration' | 'frequency_mapper';
  } | undefined;
  UserBaseChart: undefined;
  ProfileCreation: undefined;
  LivingLog: undefined;
  WaveWitness: undefined;
  ResponseIntelligence: undefined;
  ProjectFlowDynamics: undefined;
  ImpulseIntegration: undefined;
  RecognitionNavigation: undefined;
  EnvironmentalAttunement: undefined; // Added now
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

// AI Tool Session Management types
export interface AIToolSession {
  user_id: string;
  session_id: string;
  current_tool: 'frequency_mapper' | 'calibration_tool' | 'oracle';
  started_at: string;
  tools_completed: string[];
  frequency_mapper_output?: FrequencyMapperOutput;
  calibration_tool_output?: CalibrationToolOutput;
  oracle_output?: OracleOutput;
}

// Frequency Mapper specific types
export interface FrequencyMapperOutput {
  desired_state: string;
  source_statement: string;
  mapped_drive_mechanic: string;
  contextual_energy_family: string;
  energetic_quality: string;
  sensation_preview: string;
  refinement_path: string[];
  session_metadata: {
    session_id: string;
    completion_timestamp: string;
    rounds_completed: number;
  };
}

export interface ReflectionOutput {
  reflection_insight: string;
  deepening_questions: string[];
  energetic_observation: string;
}

export interface ChoiceOption {
  title: string;
  description: string;
  energy_quality: string;
}

export interface ChoiceOutput {
  choice_a: ChoiceOption;
  choice_b: ChoiceOption;
  choice_context: string;
}

export interface CrystallizationOutput {
  desired_state: string;
  energetic_quality: string;
  sensation_preview: string;
  drive_mechanics_connection: string;
  calibration_preparation: string;
}

// Enhanced Calibration Tool Types
export interface CalibrationSliderValues {
  belief: number;
  openness: number;
  worthiness: number;
}

export interface CalibrationReflections {
  belief_reflection: string;
  openness_reflection: string;
  worthiness_reflection: string;
}

export interface CalibrationPathRecommendation {
  recommended_path: 'shadow' | 'expansion' | 'balanced';
  path_reasoning: string;
  oracle_preparation: {
    primary_focus_area: 'belief' | 'openness' | 'worthiness';
    energy_signature: string;
    processing_style: string;
    specific_shadow_theme?: string;
    expansion_leverage_point?: string;
  };
}

export interface CalibrationToolOutput {
  perceptual_map: CalibrationSliderValues;
  reflections: CalibrationReflections;
  path_recommendation: CalibrationPathRecommendation;
  processing_core_alignment: any;
  map_summary: string;
  core_insights: string[];
  micro_plan: {
    step1: string;
    step2: string;
    step3: string;
  };
  button_ctas: {
    oracle_ready: string;
    save_progress: string;
  };
}

// Oracle Output (placeholder for future implementation)
export interface OracleOutput {
  guidance_type: 'quest' | 'hint' | 'reflection';
  content: string;
  personalization_applied: Record<string, any>;
}

// Drive Mechanics types for enhanced personalization
export type MotivationColor = 'Need' | 'Want' | 'Desire' | 'Transfer';
export type HeartState = 'Defined' | 'Undefined';
export type RootState = 'Defined' | 'Undefined';
export type VenusSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
export type KineticDriveSpectrum = 'Steady' | 'Dynamic';

export interface DriveProfile {
  motivation_color?: MotivationColor;
  heart_state?: HeartState;
  root_state?: RootState;
  venus_sign?: VenusSign;
  kinetic_drive_spectrum?: KineticDriveSpectrum;
  resonance_field_spectrum?: string;
}

// AI Template interfaces
export interface AITemplateInputs {
  raw_statement: string;
  drive_mechanic_summary: string;
  motivation_color?: string;
  heart_state?: string;
  venus_sign?: string;
  previous_choices?: string[];
  round_type?: string;
  refinement_path?: string[];
  energy_family_summary?: string;
}

export interface AIServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  session_id?: string;
  timestamp?: string;
}
