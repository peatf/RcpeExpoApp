# Phase 4: Design and Implement "Today's Canvas" Home Screen (Revised)

**Objective:** To replace the static `DashboardScreen` with a dynamic, profile-aware home screen named "Today's Canvas" that will serve as the user's main entry point to the app.

**To Jules:**

You will now create the new home screen for the application. This screen is the central hub and must be implemented according to these specifications to ensure a cohesive user experience.

**File-by-File Implementation Plan:**

1.  **Enhance the Profile Context:**
    *   **File:** `src/domain/profile/ProfileContext.tsx`
    *   **Action:** Modify the context.
    *   **Logic:** You must add a new state property, `hasViewedPortrait`, and a function, `markPortraitViewed`. This function must persist a boolean flag to `AsyncStorage`. This is not optional; it is required for the navigation logic.

2.  **Update Root Navigator Logic:**
    *   **File:** `src/navigation/AppNavigator.tsx`
    *   **Action:** Modify the navigator's gating logic.
    *   **Logic:** When the profile `status` is `READY`, you must check the `hasViewedPortrait` flag.
        *   If `false`, you must route the user to `PortraitRevealScreen`.
        *   If `true`, you must route the user to `TodayCanvasScreen`.

3.  **Create the Today's Canvas Screen:**
    *   **File:** `src/screens/Main/TodayCanvasScreen.tsx`
    *   **Action:** Create this new screen file.
    *   **Content:** The screen must be composed of these specific components, with all copy sourced from your copy registry:
        *   **Contextual Prompt Banner:** A text banner at the top.
        *   **Portrait Tile:** A tappable card that summarizes the user's profile and navigates to the `PortraitRevealScreen`.
        *   **Lab Tools List:** A list of the app's tools, using the updated "research-driven" names.
        *   **Recent Signals Feed (Stub):** A placeholder list for now. You must use mock data for this section.

4.  **Update the Main Tab Navigator:**
    *   **File:** `src/navigation/MainTabNavigator.tsx`
    *   **Action:** Modify the "Home" tab.
    *   **Logic:** You must replace the `DashboardScreen` component with your new `TodayCanvasScreen` for the primary home route.

5.  **Decommission the Old Dashboard:**
    *   **File:** `src/screens/Main/DashboardScreen.tsx`
    *   **Action:** Delete this file. It is now obsolete and must be removed from the codebase to prevent confusion.

**Acceptance Criteria:**

*   The app correctly routes users to either the `PortraitRevealScreen` or the `TodayCanvasScreen` based on the `hasViewedPortrait` flag.
*   The `TodayCanvasScreen` is the new home screen and displays all required components (prompt, portrait tile, lab tools, stubbed signals feed).
*   All labels and tool names on the `TodayCanvasScreen` are sourced from the central copy registry.
*   The `DashboardScreen.tsx` file has been deleted from the project.
*   The visual design of the application is otherwise unchanged.

**Warning:** Failing to properly implement the `hasViewedPortrait` logic will break the intended user flow. Deleting the `DashboardScreen` is a required step.
