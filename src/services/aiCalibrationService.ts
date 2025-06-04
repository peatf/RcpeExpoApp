/**
 * @file aiCalibrationService.ts
 * @description Service for handling AI calibration tool API requests
 */
import apiClient, { handleApiError } from './api';
import { AxiosError } from 'axios';

// Types matching the backend schema
export interface FrequencyMapperOutput {
  desired_state: string;
  source_statement?: string;
  mapped_drive_mechanic?: string;
  contextual_energy_family?: string;
}

export interface SliderPositions {
  belief: number;
  openness: number;
  worthiness: number;
}

export interface CalibrationMapRequest {
  frequency_mapper_output: FrequencyMapperOutput;
  slider_positions: SliderPositions;
}

export interface SliderUI {
  label: string;
  anchor_min: string;
  anchor_max: string;
  info_microcopy: string;
}

export interface DynamicUIElements {
  belief_slider: SliderUI;
  openness_slider: SliderUI;
  worthiness_slider: SliderUI;
}

export interface PerceptualMapLabels {
  belief: string;
  openness: string;
  worthiness: string;
}

export interface CalibrationButtonTexts {
  shadow_quest: string;
  expansion_path: string;
}

export interface CalibrationRecommendation {
  path_suggestion: 'shadow' | 'expansion' | 'neutral';
  recommendation_text: string;
  button_texts: CalibrationButtonTexts;
}

export interface ProcessingCoreDetails {
  summary_text: string;
  details: {
    moon_sign?: string;
    mercury_sign?: string;
    cognition_variable?: string;
    head_state?: string;
    ajna_state?: string;
    emotional_state?: string;
    chiron_gate?: number;
    [key: string]: any;
  };
}

export interface CalibrationMapResponse {
  dynamic_ui_elements: DynamicUIElements;
  perceptual_map_labels: PerceptualMapLabels;
  processing_core_details_applied: ProcessingCoreDetails;
  calibration_recommendation?: CalibrationRecommendation;
}

const aiCalibrationService = {
  /**
   * Processes the calibration map request and retrieves personalized calibration data
   * @param frequencyMapperOutput The output from the Frequency Mapper tool
   * @param sliderPositions Current slider positions (0.0-1.0) for belief, openness, and worthiness
   * @returns Calibration map response with UI elements and personalized recommendations
   */
  async processCalibrationMap(
    frequencyMapperOutput: FrequencyMapperOutput,
    sliderPositions: SliderPositions,
  ): Promise<CalibrationMapResponse> {
    try {
      const request: CalibrationMapRequest = {
        frequency_mapper_output: frequencyMapperOutput,
        slider_positions: sliderPositions,
      };

      const response = await apiClient.post<CalibrationMapResponse>(
        '/api/v1/ai/calibration-map',
        request,
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error as AxiosError,
        'Failed to process calibration map request',
      );
      throw new Error(errorMessage);
    }
  },
};

export default aiCalibrationService;
