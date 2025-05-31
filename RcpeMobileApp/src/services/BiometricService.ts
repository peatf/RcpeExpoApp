/**
 * @file BiometricService.ts
 * @description Service for managing biometric authentication using react-native-keychain.
 * Provides functions to check support, store/retrieve credentials securely with biometrics,
 * and reset stored credentials.
 */
import * as Keychain from 'react-native-keychain';
import { Alert, Platform } from 'react-native';

const KEYCHAIN_SERVICE_ID = 'com.rcpe.realitycreationengine.biometrics'; // Unique identifier for your app's keychain entries

interface StoredCredentials {
  // For this example, let's assume we're storing a user identifier (like email or userID)
  // and a token (e.g., a refresh token or a dummy auth token for re-authentication)
  identifier: string;
  token: string; // This should ideally be a refresh token or an auth token
}

export const biometricService = {
  isSupported: async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const biometricType = await Keychain.getSupportedBiometryType();
      return !!biometricType; // Returns true if FaceID, TouchID, or OpticID is supported
    } else if (Platform.OS === 'android') {
      // For Android, react-native-keychain relies on Keystore.
      // Biometric check often happens when accessing a keychain item marked for biometric use.
      // You might need a library like react-native-biometrics for explicit check,
      // but react-native-keychain's access control should suffice for prompting.
      // Let's assume support if the library functions without error.
      try {
        // A lightweight check, actual biometric prompt happens on access.
        await Keychain.setInternetCredentials('biometric_check', 'user', 'pass', {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
            storage: Keychain.STORAGE_TYPE.AES, // Recommended for Android
        });
        await Keychain.resetInternetCredentials('biometric_check');
        return true;
      } catch (error) {
        console.warn("Biometric check/support error:", error);
        return false;
      }
    }
    return false;
  },

  storeCredentials: async (identifier: string, token: string): Promise<boolean> => {
    try {
      // For iOS, BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE means FaceID/TouchID or Passcode.
      // BIOMETRY_CURRENT_SET means only FaceID/TouchID.
      // For Android, this uses Keystore with biometric protection if available.
      await Keychain.setGenericPassword(identifier, token, {
        service: KEYCHAIN_SERVICE_ID,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE, // Or BIOMETRY_CURRENT_SET for stricter biometrics
        accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY, // Good security option
        storage: Platform.OS === 'android' ? Keychain.STORAGE_TYPE.AES : undefined, // AES for Android
      });
      console.log('Credentials stored with biometric protection.');
      return true;
    } catch (error) {
      console.error('Failed to store credentials with biometric protection:', error);
      Alert.alert('Biometric Setup Failed', 'Could not save credentials for biometric login.');
      return false;
    }
  },

  getCredentials: async (): Promise<StoredCredentials | null> => {
    try {
      // The prompt for biometrics will appear here if credentials were stored with biometric protection.
      const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE_ID });
      if (credentials) {
        console.log('Credentials retrieved with biometrics.');
        return { identifier: credentials.username, token: credentials.password };
      }
      return null;
    } catch (error) {
      // Error can occur if user cancels biometric prompt, or no credentials found, etc.
      console.log('Failed to retrieve credentials with biometrics or none found:', error);
      // Don't show alert here as it might be intrusive if called on app start.
      // Let the calling function decide how to handle null/error.
      return null;
    }
  },

  resetCredentials: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_ID });
      console.log('Biometric credentials reset.');
      return true;
    } catch (error) {
      console.error('Failed to reset biometric credentials:', error);
      return false;
    }
  },
};
