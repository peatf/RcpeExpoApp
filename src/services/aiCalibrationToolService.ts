/**
 * @file aiCalibrationToolService.ts
 * @description Enhanced AI service for Calibration Tool with Frequency Mapper integration and Processing Core personalization
 */
import apiClient from './api';
import { v4 as uuidv4 } from 'uuid';

// Enhanced interfaces for integrated Calibration Tool
export interface FrequencyMapperHandoff {
  session_id: string;
  frequency_mapper_output: {
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
  };
  processing_core_summary: string;
  decision_growth_summary: string;
  tension_points_summary: string;
}

export interface SliderValues {
  belief: number;
  openness: number;
  worthiness: number;
}

export interface CalibrationReflections {
  belief_reflection: string;
  openness_reflection: string;
  worthiness_reflection: string;
}

export interface EnhancedSliderUI {
  label: string;
  anchor_min: string;
  anchor_max: string;
  microcopy: string;
  reflection_prompt: string;
  processing_core_note: string;
}

export interface PersonalizedSliderSet {
  belief_slider: EnhancedSliderUI;
  openness_slider: EnhancedSliderUI;
  worthiness_slider: EnhancedSliderUI;
}

export interface PathRecommendation {
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

export interface IntegratedCalibrationRecommendation {
  map_summary: string;
  core_insights: string[];
  oracle_preparation: PathRecommendation;
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

export interface CalibrationToOracleHandoff {
  session_id: string;
  frequency_mapper_output: any;
  calibration_results: {
    perceptual_map: SliderValues;
    reflections: CalibrationReflections;
    path_recommendation: PathRecommendation;
    processing_core_alignment: any;
  };
  ready_for_oracle: boolean;
}

export interface CalibrationSession {
  id: string;
  session_id: string;
  user_id: string;
  timestamp: string;
  frequency_mapper_handoff: FrequencyMapperHandoff;
  slider_values: SliderValues;
  reflections: CalibrationReflections;
  personalized_slider_ui: PersonalizedSliderSet;
  integrated_recommendation: IntegratedCalibrationRecommendation;
  ready_for_oracle: boolean;
  oracle_handoff_data?: CalibrationToOracleHandoff;
}

// Enhanced AI Calibration Tool Service
export const aiCalibrationToolService = {
  /**
   * Initialize calibration tool with Frequency Mapper handoff data
   */
  initializeFromFrequencyMapper: async (
    sessionId: string,
    userId: string
  ): Promise<FrequencyMapperHandoff | null> => {
    try {
      console.log('Initializing calibration from Frequency Mapper:', sessionId);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Initialization timeout')), 1000);
      });
      
      // Get Frequency Mapper output from session
      const responsePromise = apiClient.get(`/api/v1/ai/sessions/${sessionId}/frequency-mapper-output`);
      
      // Get Processing Core data
      const processingCorePromise = apiClient.get(`/api/v1/users/${userId}/processing-core-summary`);
      
      const [response, processingCoreResponse] = await Promise.race([
        Promise.all([responsePromise, processingCorePromise]),
        timeoutPromise
      ]);
      
      return {
        session_id: sessionId,
        frequency_mapper_output: response.data.frequency_mapper_output,
        processing_core_summary: processingCoreResponse.data.processing_core_summary,
        decision_growth_summary: processingCoreResponse.data.decision_growth_summary,
        tension_points_summary: processingCoreResponse.data.tension_points_summary
      };
    } catch (error) {
      console.warn('Failed to initialize calibration from Frequency Mapper, using fallback:', error);
      return null;
    }
  },

  /**
   * Generate personalized slider UI based on Frequency Mapper output and Processing Core
   */
  generatePersonalizedSliders: async (
    handoffData: FrequencyMapperHandoff
  ): Promise<PersonalizedSliderSet> => {
    try {
      console.log('Generating personalized sliders');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Slider generation timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/calibration-tool/generate-sliders', {
        template_id: 'calibration_slider_ui_integrated_v2',
        frequency_mapper_context: handoffData.frequency_mapper_output,
        processing_core_summary: handoffData.processing_core_summary,
        tension_points_summary: handoffData.tension_points_summary
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      // Extract data from API response if it's wrapped
      return response.data.data || response.data;
    } catch (error) {
      console.warn('Failed to generate personalized sliders, using fallback:', error);
      // Always fallback to simulation for reliable experience
      return await simulatePersonalizedSliders(handoffData);
    }
  },

  /**
   * Generate integrated calibration recommendation
   */
  generateIntegratedRecommendation: async (
    handoffData: FrequencyMapperHandoff,
    sliderValues: SliderValues,
    reflections: CalibrationReflections
  ): Promise<IntegratedCalibrationRecommendation> => {
    try {
      console.log('Generating integrated recommendation');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Recommendation timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/calibration-tool/generate-recommendation', {
        template_id: 'calibration_recommendation_integrated_v2',
        frequency_mapper_context: handoffData.frequency_mapper_output,
        processing_core_summary: handoffData.processing_core_summary,
        decision_growth_summary: handoffData.decision_growth_summary,
        tension_points_summary: handoffData.tension_points_summary,
        slider_values: sliderValues,
        reflections: reflections
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      return response.data;
    } catch (error) {
      console.warn('Failed to generate integrated recommendation, using fallback:', error);
      // Always fallback to simulation for reliable experience
      return await simulateIntegratedRecommendation(handoffData, sliderValues, reflections);
    }
  },

  /**
   * Prepare Oracle handoff package
   */
  prepareOracleHandoff: async (
    sessionId: string,
    calibrationResults: any
  ): Promise<CalibrationToOracleHandoff> => {
    try {
      console.log('Preparing Oracle handoff package');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Oracle handoff timeout')), 1000);
      });
      
      const apiPromise = apiClient.post('/api/v1/ai/calibration-tool/prepare-oracle', {
        session_id: sessionId,
        calibration_results: calibrationResults
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      return response.data;
    } catch (error) {
      console.warn('Oracle handoff preparation failed, using local data:', error);
      
      // Fallback handoff preparation
      return {
        session_id: sessionId,
        frequency_mapper_output: calibrationResults.frequency_mapper_handoff?.frequency_mapper_output,
        calibration_results: {
          perceptual_map: calibrationResults.slider_values,
          reflections: calibrationResults.reflections,
          path_recommendation: calibrationResults.integrated_recommendation?.oracle_preparation,
          processing_core_alignment: calibrationResults.processing_core_summary
        },
        ready_for_oracle: true
      };
    }
  },

  /**
   * Save calibration session
   */
  saveCalibrationSession: async (
    sessionData: CalibrationSession
  ): Promise<void> => {
    try {
      await apiClient.post('/api/v1/ai/calibration-tool/save-session', sessionData);
    } catch (error) {
      console.warn('Failed to save calibration session:', error);
    }
  }
};

/**
 * Enhanced simulation functions for development/testing
 */
async function simulatePersonalizedSliders(
  handoffData: FrequencyMapperHandoff
): Promise<PersonalizedSliderSet> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Add safety checks for undefined frequency_mapper_output
  const frequencyOutput = handoffData.frequency_mapper_output || {};
  const { 
    desired_state = "aligned and authentic", 
    energetic_quality = "harmonious energy", 
    sensation_preview = "positive sensations" 
  } = frequencyOutput;
  const processingCore = handoffData.processing_core_summary || {};

  return {
    belief_slider: {
      label: `Belief: Trusting "${desired_state}" is Possible`,
      anchor_min: "Feels impossible",
      anchor_max: `Totally possible`,
      microcopy: `Feel into whether you trust that "${desired_state}" can happen right now.`,
      reflection_prompt: `When you think about "${desired_state}", what evidence do you see that it's achievable?`,
      processing_core_note: `Your processing style shows ${processingCore.includes('logical') ? 'analytical trust patterns' : 'intuitive knowing patterns'}.`
    },
    openness_slider: {
      label: `Openness: Willing to Receive Support`,
      anchor_min: "Completely closed",
      anchor_max: "Totally open",
      microcopy: `How willing are you to receive guidance and support toward "${desired_state}"?`,
      reflection_prompt: `What part of you resists the "${energetic_quality}" energy of your desired state?`,
      processing_core_note: `Your authority type shows ${processingCore.includes('defined') ? 'clear decision-making patterns' : 'flow-responsive openness patterns'}.`
    },
    worthiness_slider: {
      label: `Worthiness: Deserving This Experience`,
      anchor_min: "Don't deserve it",
      anchor_max: "Completely worthy",
      microcopy: `Do you feel worthy of experiencing "${sensation_preview}"?`,
      reflection_prompt: `What belief about your value makes experiencing "${sensation_preview}" feel out of reach?`,
      processing_core_note: `Your chart shows ${handoffData.tension_points_summary.includes('self-worth') ? 'areas for compassionate self-value work' : 'natural self-acceptance patterns'}.`
    }
  };
}

async function simulateIntegratedRecommendation(
  handoffData: FrequencyMapperHandoff,
  sliderValues: SliderValues,
  reflections: CalibrationReflections
): Promise<IntegratedCalibrationRecommendation> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const frequencyOutput = handoffData.frequency_mapper_output || {};
  const { 
    desired_state = "aligned and authentic", 
    energetic_quality = "harmonious energy", 
    source_statement = "personal growth" 
  } = frequencyOutput;
  
  const lowestDimension = getLowestDimension(sliderValues);
  const averageAlignment = (sliderValues.belief + sliderValues.openness + sliderValues.worthiness) / 3;
  const recommendedPath = averageAlignment < 0.5 ? 'shadow' : averageAlignment > 0.7 ? 'expansion' : 'balanced';

  return {
    map_summary: `Your journey from "${source_statement}" to "${desired_state}" reveals a ${averageAlignment > 0.6 ? 'strong' : averageAlignment > 0.4 ? 'moderate' : 'emerging'} alignment pattern. Your ${energetic_quality} energy signature is strongest in ${getHighestDimension(sliderValues)} and seeks nourishment in ${lowestDimension}.`,
    core_insights: [
      `Your refinement path shows you've moved from uncertainty to clarity about "${desired_state}".`,
      `Your Processing Core patterns appear most clearly in your ${lowestDimension} alignment, revealing opportunities for growth.`,
      `${recommendedPath === 'shadow' ? 'Shadow work around ' + lowestDimension + ' will unlock deeper alignment' : 'Expansion work can leverage your strong ' + getHighestDimension(sliderValues) + ' foundation'}.`
    ],
    oracle_preparation: {
      recommended_path: recommendedPath as 'shadow' | 'expansion' | 'balanced',
      path_reasoning: `Your ${lowestDimension} score of ${Math.round(sliderValues[lowestDimension as keyof SliderValues] * 100)}% ${recommendedPath === 'shadow' ? 'indicates shadow work will be most supportive' : 'suggests expansion work can build on your strengths'}.`,
      oracle_preparation: {
        primary_focus_area: lowestDimension as 'belief' | 'openness' | 'worthiness',
        energy_signature: energetic_quality,
        processing_style: handoffData.processing_core_summary || 'adaptive flow',
        specific_shadow_theme: recommendedPath === 'shadow' ? `${lowestDimension} blocks around "${desired_state}"` : undefined,
        expansion_leverage_point: recommendedPath === 'expansion' ? `Strong ${getHighestDimension(sliderValues)} foundation` : undefined
      }
    },
    micro_plan: {
      step1: `Awareness practice: Notice when ${lowestDimension} patterns show up around "${desired_state}".`,
      step2: `Energetic activation: Use your ${handoffData.processing_core_summary?.includes('defined') ? 'clear authority' : 'responsive authority'} to feel into alignment.`,
      step3: `Integration habit: Daily check-in with your "${energetic_quality}" energy signature.`
    },
    button_ctas: {
      oracle_ready: recommendedPath === 'shadow' ? 'Begin Shadow Quest' : 'Continue to Expansion Path',
      save_progress: 'Save My Calibration'
    }
  };
}

// Helper functions
function getLowestDimension(sliderValues: SliderValues): string {
  const entries = Object.entries(sliderValues);
  const lowest = entries.reduce((min, current) => current[1] < min[1] ? current : min);
  return lowest[0];
}

function getHighestDimension(sliderValues: SliderValues): string {
  const entries = Object.entries(sliderValues);
  const highest = entries.reduce((max, current) => current[1] > max[1] ? current : max);
  return highest[0];
}

export default aiCalibrationToolService;