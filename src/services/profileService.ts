/**
 * @file profileService.ts
 * @description Service for handling profile creation and retrieval API calls
 */

import { API_CONFIG } from '../config/apiConfig';
import { ProfileCreationPayload, ProfileCreationResponse } from '../types';

const API_BASE_URL = API_CONFIG.BASE_URL;

export class ProfileService {
  /**
   * Create a new profile
   */
  static async createProfile(payload: ProfileCreationPayload): Promise<ProfileCreationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorDetail = result.detail 
          ? (typeof result.detail === 'string' ? result.detail : JSON.stringify(result.detail))
          : `HTTP error! status: ${response.status}`;
        throw new Error(`API Error: ${errorDetail}`);
      }

      return result;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Fetch a profile by ID
   */
  static async getProfile(profileId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE.GET(profileId)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        const errorDetail = result.detail 
          ? (typeof result.detail === 'string' ? result.detail : JSON.stringify(result.detail))
          : `HTTP error! status: ${response.status}`;
        throw new Error(`API Error: ${errorDetail}`);
      }

      return result;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
}

export default ProfileService;
