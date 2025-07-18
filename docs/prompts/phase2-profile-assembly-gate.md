# Phase 2: Implement the Profile Assembly Gate (Revised)

**Objective:** To create a single, reliable source of profile data (`RealityProfile`) and a navigation gate that prevents the app from rendering until this data is ready.

**To Jules:**

You will now write code to establish the core data layer. Follow these instructions precisely. Any deviation will compromise the architecture.

**File-by-File Implementation Plan:**

1.  **Create Directory:**
    *   Create a new directory: `src/domain/profile/`.

2.  **Define Profile Types:**
    *   **File:** `src/domain/profile/types.ts`
    *   **Action:** Create this file.
    *   **Content:** Add the `RealityProfile`, `SynthesisCategoryKey`, and `CategoryMeta` interfaces exactly as defined in the audit document. Do not modify them.

3.  **Implement Profile Composition Logic:**
    *   **File:** `src/domain/profile/composeProfile.ts`
    *   **Action:** Create this file.
    *   **Content:** Implement the `composeRealityProfile` function as specified in the audit. This function's sole responsibility is to merge data from different sources into the single `RealityProfile` shape.

4.  **Create the Profile Context:**
    *   **File:** `src/domain/profile/ProfileContext.tsx`
    *   **Action:** Create this file.
    *   **Content:** Implement the `ProfileProvider` using React Context. It **must** manage the state machine (`UNAUTHENTICATED`, `CHECKING_FOR_PROFILE`, `FETCHING`, `COMPOSING`, `READY`, `MISSING`, `ERROR`). The logic for fetching, caching (in `AsyncStorage`), and composing the profile must reside here.

5.  **Create the `useProfile` Hook:**
    *   **File:** `src/domain/profile/useProfile.ts`
    *   **Action:** Create this file.
    *   **Content:** This hook must provide a simple, clean interface to the `ProfileContext`.

6.  **Gate the Root Navigator:**
    *   **File:** `src/navigation/AppNavigator.tsx`
    *   **Action:** Modify this file.
    *   **Logic:** You must replace the simple `user` check with a switch based on the `status` from `useProfile()`.
        *   `'MISSING'`: Render `ProfileCreationScreen`.
        *   `'LOADING'`/`'FETCHING'`/`'COMPOSING'`: Render a `ProfileLoadingGate` screen.
        *   `'READY'`: Render `MainTabNavigator`.
        *   `'ERROR'`: Render an error screen or fallback to `ProfileCreationScreen`.

7.  **Update the Profile Creation Flow:**
    *   **File:** `src/screens/Main/ProfileCreationScreen.tsx`
    *   **Action:** Modify the `handleSubmitProfile` function.
    *   **Logic:** After a successful API call, you must call the `onProfileCreated()` function from the `ProfileContext` to trigger a refresh of the profile data.

8.  **Wrap the App:**
    *   **File:** `App.tsx`
    *   **Action:** Modify this file.
    *   **Logic:** Wrap the `ThemingProvider` and its children with your new `<ProfileProvider>`. It must be a child of `AuthProvider`.

**Acceptance Criteria:**

*   The app **does not** render the main UI until the `useProfile()` hook reports a `READY` status.
*   A loading indicator is shown to the user while the profile is being assembled.
*   The `RealityProfile` is fetched, composed, and stored in the `ProfileContext`.
*   The data is cached in `AsyncStorage` to speed up subsequent launches.
*   The visual design of the application is unchanged.

**Warning:** Failure to implement the navigation gate correctly will result in UI components attempting to render with null data, causing crashes and unpredictable behavior.
