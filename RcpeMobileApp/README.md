# RCPE Mobile App (iOS)

This is a React Native application for the Reality Creation Profile Engine (RCPE), primarily targeting iOS deployment. It provides users with AI-driven tools for reality creation and personal development.

## Features

*   **Authentication:** Secure JWT-based authentication (login, logout, token refresh) with optional Biometric login (Face ID/Touch ID).
*   **Dashboard:** Central hub for accessing user information and application features.
*   **Frequency Mapper:** Multi-step wizard to map and submit frequency data.
*   **Calibration Tool:** Slider-based interface for energy calibration.
*   **Oracle Guidance:** Interface to consult an AI Oracle and receive guidance.
*   **User Base Chart:** View astrological base chart data.
*   **Offline Support:** Cached display of User Base Chart when offline.
*   **Deep Linking:** Supports opening specific content (e.g., tool results) via URL schemes (`rcpe://app/...`).
*   **Push Notifications:** Basic setup for receiving push notifications (e.g., Oracle reminders).
*   **Network Awareness:** Detects online/offline status.

## Tech Stack

*   React Native
*   TypeScript
*   React Navigation (v6) - Stack & Bottom Tab navigators
*   Axios (for HTTP requests)
*   `@react-native-async-storage/async-storage` (for local data persistence)
*   `react-native-elements` (UI components)
*   `@react-native-community/netinfo` (network status)
*   `react-native-push-notification` (push notifications)
*   `react-native-keychain` (biometric authentication & secure storage)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd RcpeMobileApp
    ```
3.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```
4.  **Install iOS native dependencies (CocoaPods):**
    ```bash
    cd ios
    pod install
    cd ..
    ```
    *Note: If you encounter issues with pod installation, you might need to run `arch -x86_64 pod install` on Apple Silicon Macs if some pods are not yet fully compatible.*

5.  **Environment Setup:**
    *   (Optional) If API keys or specific configurations are needed in the future, create a `.env` file based on `.env.example` (not currently implemented).

## Running the App

### For iOS

*   **Using React Native CLI:**
    ```bash
    npm run ios
    # OR
    npx react-native run-ios
    ```
    You might need to specify a simulator:
    ```bash
    npx react-native run-ios --simulator="iPhone 14 Pro"
    ```
*   **Using Xcode:**
    Open `RcpeMobileApp/ios/RcpeMobileApp.xcworkspace` in Xcode, select a target simulator or device, and click the "Run" button.

### For Android (Basic setup exists, but iOS is the primary target)

```bash
npm run android
# OR
npx react-native run-android
```

## Project Structure

The main application code resides in the `RcpeMobileApp/src/` directory:

*   `assets/`: Static assets like images, fonts.
*   `components/`: Shared UI components.
*   `contexts/`: Global React contexts (e.g., AuthContext, NetworkContext).
*   `hooks/`: Custom React hooks.
*   `navigation/`: React Navigation setup (navigators, route definitions).
*   `screens/`: Top-level screen components for different parts of the app.
    *   `Auth/`: Authentication-related screens (Login, Register).
    *   `Main/`: Core application screens after login.
*   `services/`: Modules for interacting with APIs, local storage, push notifications, biometrics, etc.
*   `styles/`: Global styles or theme definitions.
*   `types/` (or `interfaces/`): TypeScript type definitions and interfaces.
*   `utils/`: Utility functions.

## API Backend

The application interacts with the RCPE backend API:
*   **Base URL:** `https://reality-creation-profile-engine.vercel.app/api/v1/`

## iOS Deployment Notes

*   **Bundle ID:** Ensure the Bundle Identifier is set to `com.rcpe.realitycreationengine` in Xcode (Target -> General -> Identity).
*   **Signing & Capabilities:** Configure your Apple Developer account for signing. Enable necessary capabilities in Xcode (e.g., Push Notifications, Associated Domains for Universal Links if `https://rcpe.app` is used).
*   **Info.plist:**
    *   **Face ID Usage:** `NSFaceIDUsageDescription` (e.g., "RCPE uses Face ID for quick and secure login.")
    *   **URL Scheme:** For `rcpe://` deep links.
*   Refer to official Apple documentation for full App Store submission guidelines.

## Further Development / TODOs

*   Implement full rich text rendering for Oracle screen responses.
*   Refine session restoration logic with biometric tokens in `AuthContext`.
*   Add a global UI banner for network online/offline status changes.
*   Develop additional features like user profile editing, settings screen, etc.
*   Comprehensive unit and integration testing.

EOF
