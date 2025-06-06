/**
 * @file authorityService.ts
 * @description Service for detecting and managing user Human Design authority.
 */

import { AuthorityType } from "../types/humanDesignTools";

// Mock apiClient - replace with actual import from ./api when available
const apiClient = {
  get: async <T>(endpoint: string): Promise<{ data: T }> => {
    console.log(`Mock API GET request to ${endpoint}`);
    if (endpoint === "/api/v1/user/authority") {
      // Simulate a successful API response
      // Change this to test different scenarios, e.g.,
      // return { data: { authority: "Sacral", guidanceText: "Trust your gut response." } as any };
      // return { data: { authority: "NonExistentType", guidanceText: "This type is not handled." } as any };
      return new Promise((resolve) => setTimeout(() => resolve({ data: { authority: "Emotional", guidanceText: "Wait for clarity." } as any }), 500));
      // Simulate an API error
      // return Promise.reject(new Error("API Error: Failed to fetch authority."));
      // Simulate authority not set
      // return { data: { authority: null, guidanceText: "Authority not set." } as any };
    }
    return Promise.reject(new Error(`Unknown endpoint: ${endpoint}`));
  },
};

/**
 * @interface UserAuthorityResponse
 * @description Expected response structure from the /api/v1/user/authority endpoint.
 */
interface UserAuthorityResponse {
  authority: string | null;
  guidanceText?: string;
}

/**
 * Detects the user's Human Design authority by making an API call.
 * Maps the string value from the API to the AuthorityType enum.
 *
 * @async
 * @function detectUserAuthority
 * @returns {Promise<AuthorityType>} The user's authority type, or AuthorityType.Unknown if detection fails or authority is not set.
 */
export const detectUserAuthority = async (): Promise<AuthorityType> => {
  try {
    const response = await apiClient.get<UserAuthorityResponse>("/api/v1/user/authority");
    const authorityString = response.data?.authority;

    if (authorityString) {
      // Attempt to map the string to our enum
      const mappedAuthority = Object.values(AuthorityType).find(
        (value) => typeof value === 'string' && value.toLowerCase() === authorityString.toLowerCase()
      ) as AuthorityType | undefined;

      if (mappedAuthority && Object.values(AuthorityType).includes(mappedAuthority)) {
        return mappedAuthority;
      } else {
        console.warn(`Unknown authority type received from API: "${authorityString}"`);
        return AuthorityType.Unknown; // Or handle as a specific error/type
      }
    } else {
      // This case handles null or undefined authority string from API
      return AuthorityType.NotSet; // Authority is explicitly not set or null
    }
  } catch (error) {
    console.error("Failed to detect user authority:", error);
    return AuthorityType.Unknown; // Default to Unknown in case of API errors
  }
};

// Example of how to use the service:
// detectUserAuthority().then(authority => {
//   console.log("Detected Authority:", authority);
// });
