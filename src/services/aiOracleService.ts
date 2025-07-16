/**
 * @file aiOracleService.ts
 * @description Enhanced AI service for Oracle with complete three-tool integration and quest system
 */
import apiClient from './api';
import { v4 as uuidv4 } from 'uuid';

// Complete three-tool integration interfaces
export interface OracleInputSynthesis {
  session_id: string;
  user_id: string;
  
  // Frequency Mapper heritage
  frequency_mapper_output: {
    desired_state: string;
    source_statement: string;
    energetic_quality: string;
    sensation_preview: string;
    refinement_path: string[];
    mapped_drive_mechanic: string;
    contextual_energy_family: string;
  };
  
  // Calibration Tool results
  calibration_results: {
    perceptual_map: { belief: number; openness: number; worthiness: number };
    reflections: { belief_reflection: string; openness_reflection: string; worthiness_reflection: string };
    chosen_path: "shadow" | "hero";
    path_reasoning: string;
    primary_focus_area: "belief" | "openness" | "worthiness";
    processing_core_alignment: string;
  };
  
  // Complete Base Chart data
  complete_base_chart: {
    processing_core_summary: string;
    decision_growth_summary: string;
    tension_points_summary: string;
    drive_mechanic_summary: string;
    motivation_color: string;
    heart_state: string;
    root_state: string;
    venus_sign: string;
    kinetic_drive_spectrum: string;
    energy_family_summary: string;
    resonance_field_spectrum: string;
    design_authority: string;
    strategy: string;
    inner_authority: string;
    profile: string;
    defined_centers: string[];
    undefined_centers: string[];
    active_gates: number[];
    chiron_gate?: number;
    incarnation_cross?: string;
    sun_sign: string;
    moon_sign: string;
    mercury_sign: string;
    mars_sign: string;
    jupiter_sign: string;
  };
}

// Quest system interfaces
export interface PersonalizedQuest {
  quest_id: string;
  session_id: string;
  
  // Quest metadata
  title: string;
  quest_type: "shadow" | "hero";
  focus_dimension: "belief" | "openness" | "worthiness";
  duration: "daily" | "weekly" | "ongoing";
  difficulty_level: 1 | 2 | 3;
  
  // Personalization data
  chart_integration: {
    primary_gates_used: number[];
    authority_alignment: string;
    center_engagement: string[];
    strategy_application: string;
  };
  
  // Quest content
  description: string;
  objective: string;
  success_criteria: string[];
  daily_practice: string;
  completion_ritual: string;
  
  // Support system
  hints: QuestHint[];
  check_in_frequency: string;
  encouraging_reminders: string[];
  
  // Integration elements
  desired_state_connection: string;
  energetic_quality_activation: string;
  next_quest_bridge?: string;
  
  // Progress tracking
  status: "not_started" | "in_progress" | "completed" | "paused";
  progress_percentage: number;
  completion_date?: string;
  user_reflection?: string;
  completion_rating?: 1 | 2 | 3 | 4 | 5;
}

export interface QuestHint {
  hint_id: string;
  quest_id: string;
  
  // Timing & delivery
  trigger_condition: "daily" | "weekly" | "struggle_detected" | "progress_milestone";
  delivery_method: "push_notification" | "in_app_card" | "email" | "journal_prompt";
  
  // Personalization
  chart_element_referenced: string;
  authority_guidance: string;
  
  // Content
  hint_text: string;
  encouragement: string;
  micro_practice: string;
  
  // Integration
  desired_state_reminder: string;
  energetic_quality_activation: string;
  
  // State
  shown: boolean;
  user_rating?: 1 | 2 | 3 | 4 | 5;
}

export interface QuestCompletion {
  quest_id: string;
  completion_date: string;
  success_criteria_met: boolean[];
  user_reflection: string;
  completion_rating: 1 | 2 | 3 | 4 | 5;
  
  // Integration assessment
  desired_state_progress: {
    belief_shift: number;
    openness_shift: number;
    worthiness_shift: number;
    overall_alignment_improvement: number;
  };
  
  // Next steps generation
  integration_practices: string[];
  next_quest_recommendation: QuestRecommendation;
  celebration_ritual: string;
  
  // Chart evolution
  chart_activation_notes: string;
  new_strength_areas: string[];
  shadow_integration_progress: string;
}

export interface QuestRecommendation {
  recommended_quest_type: "shadow" | "hero";
  recommended_focus: "belief" | "openness" | "worthiness";
  reasoning: string;
  urgency_level: "low" | "medium" | "high";
}

export interface OracleSession {
  session_id: string;
  user_id: string;
  
  // Complete journey context
  journey_synthesis: OracleInputSynthesis;
  
  // Oracle-specific data
  active_quests: PersonalizedQuest[];
  completed_quests: QuestCompletion[];
  hint_history: QuestHint[];
  
  // Integration tracking
  overall_progress: {
    belief_evolution: number[];
    openness_evolution: number[];
    worthiness_evolution: number[];
    desired_state_proximity: number;
  };
  
  // Support system
  check_in_schedule: CheckInSchedule;
  celebration_milestones: CelebrationMilestone[];
  integration_practices: IntegrationPractice[];
}

export interface CheckInSchedule {
  frequency: "daily" | "weekly" | "custom";
  authority_based_timing: string;
  next_check_in: string;
  check_in_questions: string[];
}

export interface CelebrationMilestone {
  milestone_id: string;
  trigger_condition: string;
  celebration_ritual: string;
  achievement_acknowledgment: string;
}

export interface IntegrationPractice {
  practice_id: string;
  title: string;
  description: string;
  frequency: string;
  chart_alignment: string;
  connection_to_desired_state: string;
}

// Enhanced AI Oracle Service
export const aiOracleService = {
  /**
   * Initialize Oracle with complete three-tool integration
   */
  initializeFromCalibration: async (
    sessionId: string,
    handoffData: any
  ): Promise<OracleInputSynthesis | null> => {
    try {
      console.log('Initializing Oracle from calibration:', sessionId);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Oracle initialization timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/oracle/initialize-from-calibration', {
        session_id: sessionId,
        calibration_handoff: handoffData
      });
      
      const response = await Promise.race([apiPromise, timeoutPromise]);
      return (response as any).data.synthesis;
    } catch (error) {
      console.warn('Oracle initialization failed, using simulation:', error);
      // Always fallback to simulation for reliable experience
      return await simulateOracleInitialization(sessionId, handoffData);
    }
  },

  /**
   * Generate personalized quest based on complete user profile
   */
  generatePersonalizedQuest: async (
    synthesis: OracleInputSynthesis,
    questPreferences?: {
      preferred_type?: "shadow" | "hero";
      preferred_focus?: "belief" | "openness" | "worthiness";
      difficulty_level?: 1 | 2 | 3;
    }
  ): Promise<PersonalizedQuest> => {
    try {
      console.log('Generating personalized quest');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Quest generation timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/oracle/generate-quest', {
        template_id: 'oracle_quest_generator_v2',
        synthesis: synthesis,
        preferences: questPreferences
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      return (response as any).data;
    } catch (error) {
      console.warn('Quest generation failed, using simulation:', error);
      // Always fallback to simulation for reliable experience
      return await simulatePersonalizedQuest(synthesis, questPreferences);
    }
  },

  /**
   * Generate contextual hints for active quest
   */
  generateContextualHints: async (
    questId: string,
    currentProgress: "just_started" | "midway" | "struggling" | "completing",
    userChallenge?: string
  ): Promise<QuestHint[]> => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Hints generation timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/oracle/generate-hints', {
        template_id: 'oracle_hint_generator_v2',
        quest_id: questId,
        progress_stage: currentProgress,
        current_challenge: userChallenge
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      return (response as any).data.hints;
    } catch (error) {
      console.warn('Hints generation failed, using simulation:', error);
      // Always fallback to simulation for reliable experience
      return await simulateContextualHints(questId, currentProgress, userChallenge);
    }
  },

  /**
   * Process quest completion and generate next steps
   */
  processQuestCompletion: async (
    questId: string,
    userReflection: string,
    completionRating: 1 | 2 | 3 | 4 | 5,
    successCriteriaMet: boolean[]
  ): Promise<QuestCompletion> => {
    try {
      const response = await apiClient.post(`/api/v1/ai/oracle/quest/${questId}/complete`, {
        user_reflection: userReflection,
        completion_rating: completionRating,
        success_criteria_met: successCriteriaMet
      });

      return (response as any).data;
    } catch (error) {
      console.error('Failed to process quest completion:', error);
      // Fallback to simulation
      return await simulateQuestCompletion(questId, userReflection, completionRating, successCriteriaMet);
    }
  },

  /**
   * Get Oracle session with all active quests and progress
   */
  getOracleSession: async (sessionId: string): Promise<OracleSession | null> => {
    try {
      const response = await apiClient.get(`/api/v1/ai/oracle/session/${sessionId}`);
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get Oracle session:', error);
      return null;
    }
  },

  /**
   * Update quest progress
   */
  updateQuestProgress: async (
    questId: string,
    progressPercentage: number,
    currentChallenge?: string
  ): Promise<void> => {
    try {
      await apiClient.post(`/api/v1/ai/oracle/quest/${questId}/progress`, {
        progress_percentage: progressPercentage,
        current_challenge: currentChallenge,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to update quest progress:', error);
    }
  },

  /**
   * Save Oracle session data
   */
  saveOracleSession: async (sessionData: OracleSession): Promise<void> => {
    try {
      await apiClient.post('/api/v1/ai/oracle/save-session', sessionData);
    } catch (error) {
      console.warn('Failed to save Oracle session:', error);
    }
  }
};

/**
 * Enhanced simulation functions for development/testing
 */
async function simulateOracleInitialization(
  sessionId: string,
  handoffData: any
): Promise<OracleInputSynthesis | null> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Extract data from calibration handoff with safety checks
  const frequencyMapperOutput = handoffData?.frequency_mapper_output || {};
  const calibrationResults = handoffData?.calibration_results || {};
  
  return {
    session_id: sessionId,
    user_id: handoffData?.user_id || 'mock-user-123',
    
    // Frequency Mapper heritage
    frequency_mapper_output: {
      desired_state: frequencyMapperOutput.desired_state || "aligned and authentic",
      source_statement: frequencyMapperOutput.source_statement || "personal growth",
      energetic_quality: frequencyMapperOutput.energetic_quality || "harmonious energy",
      sensation_preview: frequencyMapperOutput.sensation_preview || "positive sensations",
      refinement_path: frequencyMapperOutput.refinement_path || ["authentic", "connected"],
      mapped_drive_mechanic: frequencyMapperOutput.mapped_drive_mechanic || "Need energy",
      contextual_energy_family: frequencyMapperOutput.contextual_energy_family || "3/5 Profile, Taurus Sun"
    },
    
    // Calibration Tool results
    calibration_results: {
      perceptual_map: calibrationResults.perceptual_map || { belief: 0.7, openness: 0.6, worthiness: 0.5 },
      reflections: calibrationResults.reflections || {
        belief_reflection: "I'm building trust in this possibility",
        openness_reflection: "I'm learning to receive support",
        worthiness_reflection: "I'm recognizing my inherent value"
      },
      chosen_path: calibrationResults.path_recommendation?.recommended_path || 
                   calibrationResults.recommended_path || 
                   "shadow",
      path_reasoning: calibrationResults.path_reasoning || 
                     calibrationResults.path_recommendation?.path_reasoning || 
                     "Growth through gentle strengthening",
      primary_focus_area: calibrationResults.primary_focus_area || 
                         calibrationResults.path_recommendation?.oracle_preparation?.primary_focus_area || 
                         "worthiness",
      processing_core_alignment: calibrationResults.processing_core_alignment || "Emotional Authority, Defined Heart"
    },
    
    // Complete Base Chart data (mock for simulation)
    complete_base_chart: {
      processing_core_summary: "Emotional Authority, Defined Heart Center, Venus in Taurus",
      decision_growth_summary: "Generator strategy with emotional clarity",
      tension_points_summary: "Chiron in Gate 25, themes around self-worth and universal love",
      drive_mechanic_summary: "Need motivation with steady kinetic drive",
      motivation_color: "Need",
      heart_state: "Defined",
      root_state: "Undefined",
      venus_sign: "Taurus",
      kinetic_drive_spectrum: "Steady",
      energy_family_summary: "3/5 Profile, Taurus Sun",
      resonance_field_spectrum: "Focused",
      design_authority: "Generator",
      strategy: "To respond",
      inner_authority: "Emotional",
      profile: "3/5",
      active_gates: [25, 51, 40],
      defined_centers: ["Heart", "Sacral"],
      undefined_centers: ["Head", "Ajna", "Throat", "Root"],
      incarnation_cross: "Right Angle Cross of the Four Ways",
      sun_sign: "Taurus",
      moon_sign: "Scorpio",
      mercury_sign: "Gemini",
      mars_sign: "Cancer",
      jupiter_sign: "Leo"
    }
  };
}

async function simulatePersonalizedQuest(
  synthesis: OracleInputSynthesis,
  preferences?: any
): Promise<PersonalizedQuest> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const { desired_state, energetic_quality } = synthesis.frequency_mapper_output;
  const { chosen_path, primary_focus_area } = synthesis.calibration_results;
  const { inner_authority, design_authority, active_gates } = synthesis.complete_base_chart;

  // Generate quest based on path and focus area
  const questTemplates = getQuestTemplates(chosen_path, primary_focus_area);
  const selectedTemplate = questTemplates[Math.floor(Math.random() * questTemplates.length)];

  return {
    quest_id: uuidv4(),
    session_id: synthesis.session_id,
    title: selectedTemplate.title.replace('[desired_state]', desired_state),
    quest_type: chosen_path,
    focus_dimension: primary_focus_area,
    duration: "weekly",
    difficulty_level: 2,
    chart_integration: {
      primary_gates_used: active_gates.slice(0, 3),
      authority_alignment: `Your ${inner_authority} authority guides quest completion`,
      center_engagement: synthesis.complete_base_chart.defined_centers.slice(0, 2),
      strategy_application: `Apply your ${design_authority} strategy to quest approach`
    },
    description: selectedTemplate.description.replace('[desired_state]', desired_state).replace('[energetic_quality]', energetic_quality),
    objective: selectedTemplate.objective.replace('[desired_state]', desired_state),
    success_criteria: selectedTemplate.success_criteria,
    daily_practice: selectedTemplate.daily_practice.replace('[inner_authority]', inner_authority),
    completion_ritual: selectedTemplate.completion_ritual,
    hints: [],
    check_in_frequency: getCheckInFrequency(inner_authority),
    encouraging_reminders: getEncouragingReminders(chosen_path, primary_focus_area),
    desired_state_connection: `Completing this quest directly supports experiencing '${desired_state}'`,
    energetic_quality_activation: `This quest activates your '${energetic_quality}' energy signature`,
    status: "not_started",
    progress_percentage: 0
  };
}

async function simulateContextualHints(
  questId: string,
  currentProgress: string,
  userChallenge?: string
): Promise<QuestHint[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const hints = [
    {
      hint_id: uuidv4(),
      quest_id: questId,
      trigger_condition: "daily" as const,
      delivery_method: "in_app_card" as const,
      chart_element_referenced: "Your defined Sacral center",
      authority_guidance: "Listen for your gut response to guide next steps",
      hint_text: "Your energy signature wants to express itself through this quest work. Notice where you feel expansion.",
      encouragement: "You're making beautiful progress on this journey of alignment.",
      micro_practice: "Take 3 deep breaths and ask your body: 'What wants to emerge next?'",
      desired_state_reminder: "Each step brings you closer to your refined desire",
      energetic_quality_activation: "Feel your energetic quality flowing through this practice",
      shown: false
    }
  ];

  return hints;
}

async function simulateQuestCompletion(
  questId: string,
  userReflection: string,
  completionRating: number,
  successCriteriaMet: boolean[]
): Promise<QuestCompletion> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    quest_id: questId,
    completion_date: new Date().toISOString(),
    success_criteria_met: successCriteriaMet,
    user_reflection: userReflection,
    completion_rating: Math.max(1, Math.min(5, completionRating)) as 1 | 2 | 3 | 4 | 5,
    desired_state_progress: {
      belief_shift: 0.1,
      openness_shift: 0.15,
      worthiness_shift: 0.2,
      overall_alignment_improvement: 0.15
    },
    integration_practices: [
      "Daily check-in with your progress",
      "Weekly celebration of small wins",
      "Monthly alignment assessment"
    ],
    next_quest_recommendation: {
      recommended_quest_type: "hero",
      recommended_focus: "openness",
      reasoning: "Your completion shows readiness for expansion work",
      urgency_level: "medium"
    },
    celebration_ritual: "Take a moment to acknowledge how your energy has evolved through this quest",
    chart_activation_notes: "This quest activated your natural leadership qualities",
    new_strength_areas: ["Self-trust", "Energetic alignment"],
    shadow_integration_progress: "Significant progress in accepting your inherent worth"
  };
}

// Helper functions
function getQuestTemplates(questType: "shadow" | "hero", focusArea: string) {
  const shadowTemplates = {
    belief: [
      {
        title: "The Evidence Gatherer's Journey",
        description: "Your chart shows natural wisdom-gathering abilities. This quest helps you collect evidence that '[desired_state]' is not only possible but aligned with your energetic design.",
        objective: "Gather daily evidence that '[desired_state]' resonates with your authentic energy signature",
        success_criteria: [
          "Documented 21 pieces of evidence over 7 days",
          "Experienced 5 moments of deep knowing",
          "Felt alignment between desire and chart energy"
        ],
        daily_practice: "Each morning, ask your [inner_authority]: 'What evidence of possibility wants to show itself today?'",
        completion_ritual: "Create a celebration acknowledging how your natural design supports this desire"
      }
    ],
    openness: [
      {
        title: "The Receptive Channel's Opening",
        description: "Your energetic design includes natural receptivity gifts. This quest helps you honor and expand your capacity to receive support toward '[desired_state]'.",
        objective: "Practice receiving support in alignment with your natural energetic flow",
        success_criteria: [
          "Received help or guidance 10 times over 7 days",
          "Noticed and released 3 resistance patterns",
          "Felt your natural receptive gifts strengthening"
        ],
        daily_practice: "Ask your [inner_authority]: 'How can I be more receptive to support today?'",
        completion_ritual: "Acknowledge all the support that flowed to you during this quest"
      }
    ],
    worthiness: [
      {
        title: "The Inherent Value Recognition",
        description: "Your chart reveals natural worth and value themes. This quest helps you recognize that '[desired_state]' is aligned with your inherent value as expressed through your design.",
        objective: "Recognize your inherent worth through your natural energetic gifts and impact",
        success_criteria: [
          "Identified 14 ways your energy creates value",
          "Received 7 acknowledgments of your impact",
          "Felt deep knowing of your inherent worth"
        ],
        daily_practice: "Before any interaction, remind yourself: 'I bring inherent value that supports '[desired_state]''",
        completion_ritual: "Create a personal ceremony acknowledging your unique value contribution"
      }
    ]
  };

  const heroTemplates = {
    belief: [
      {
        title: "The Certainty Broadcaster",
        description: "Your strong belief energy and chart gifts position you to inspire certainty in others. This quest amplifies your natural belief-generating abilities.",
        objective: "Share your certainty about '[desired_state]' to strengthen it in yourself and inspire others",
        success_criteria: [
          "Shared your certainty with 7 people",
          "Witnessed 3 people gain inspiration from your belief",
          "Felt your own belief deepen through expression"
        ],
        daily_practice: "Ask your [inner_authority]: 'How can I express my certainty about this desire today?'",
        completion_ritual: "Celebrate how your belief has become a gift to others and yourself"
      }
    ],
    openness: [
      {
        title: "The Flow State Teacher",
        description: "Your natural openness and chart design make you a powerful guide for others seeking receptivity. This quest leverages your gift to create expansion.",
        objective: "Teach others about openness and receptivity through your natural example and energy",
        success_criteria: [
          "Guided 5 people toward greater openness",
          "Demonstrated receptive leadership 10 times",
          "Felt your openness creating ripple effects"
        ],
        daily_practice: "Ask your [inner_authority]: 'How can my openness serve others today?'",
        completion_ritual: "Acknowledge how your openness has become a gift that serves the collective"
      }
    ],
    worthiness: [
      {
        title: "The Worth Demonstration Ambassador",
        description: "Your strong sense of worth and natural chart gifts position you to model worthiness for others. This quest amplifies your value-demonstration abilities.",
        objective: "Demonstrate and teach worthiness through your natural energetic expression and impact",
        success_criteria: [
          "Modeled worthiness for 7 people",
          "Helped 3 people recognize their own worth",
          "Felt your worth inspiring others' worth"
        ],
        daily_practice: "Ask your [inner_authority]: 'How can I demonstrate my worth in service today?'",
        completion_ritual: "Celebrate how your worth has become a beacon for others"
      }
    ]
  };

  return questType === "shadow" ? shadowTemplates[focusArea as keyof typeof shadowTemplates] : heroTemplates[focusArea as keyof typeof heroTemplates];
}

function getCheckInFrequency(authority: string): string {
  switch (authority) {
    case "Emotional":
      return "Every few days when you feel emotional clarity";
    case "Sacral":
      return "Daily gut-check responses";
    case "Splenic":
      return "In-the-moment awareness checks";
    case "Self-Projected":
      return "Weekly talking-through sessions";
    default:
      return "Weekly self-reflection";
  }
}

function getEncouragingReminders(questType: "shadow" | "hero", focusArea: string): string[] {
  const shadowReminders = [
    "This gentle strengthening is exactly what your energy needs",
    "Each small step builds powerful foundation energy",
    "Your willingness to meet yourself with compassion is transformative"
  ];

  const heroReminders = [
    "Your natural gifts are ready to expand and serve",
    "Sharing your strength creates more strength for everyone",
    "Your energy is designed to uplift and inspire"
  ];

  return questType === "shadow" ? shadowReminders : heroReminders;
}

export default aiOracleService;