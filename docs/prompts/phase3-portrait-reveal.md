# Phase 3: Build the Portrait Reveal Guided Tour (Revised)

**Objective:** To replace the outdated `UserBaseChartScreen` with a new, guided `PortraitRevealScreen` that uses the central `RealityProfile` and introduces the user to their design step-by-step.

**To Jules:**

You will now build the primary UI for displaying the user's energetic blueprint. The key is to use the centralized data and copy you established in the previous phases.

**File-by-File Implementation Plan:**

1.  **Create the Central Copy File:**
    *   **File:** `src/content/synthesisCategoryCopy.ts`
    *   **Action:** Create this file.
    *   **Content:** Define and export the `categoryCopy` object. This object **must** contain the `label`, `shortIntro`, `deepIntro`, and `fields` for each of the 9 synthesis categories, as specified in the audit.

2.  **Create the Tour Builder Logic:**
    *   **File:** `src/domain/profile/buildPortraitTour.ts`
    *   **Action:** Create this file.
    *   **Content:** Implement the `buildPortraitTour` function. It must take the `RealityProfile` and use the `categoryCopy` object to generate an array of `PortraitTourStep` objects for the UI.

3.  **Create the New Screen:**
    *   **File:** `src/screens/Main/PortraitRevealScreen.tsx`
    *   **Action:** Create this file.
    *   **Content:** This component must:
        *   Use the `useProfile()` hook to get the profile data.
        *   Call `buildPortraitTour` to get the steps.
        *   Render the steps in a `FlatList` or similar component that shows one step at a time.
        *   Include an expandable section for the `deepIntro` and `dataPoints`.
        *   Have a "Continue" button that advances the tour and finally navigates to `TodayCanvas`.

4.  **Update the Blueprint Canvas:**
    *   **File:** `src/components/EnergeticBlueprint/BlueprintCanvas.tsx`
    *   **Action:** Modify this component.
    *   **Logic:**
        *   Add a new prop: `highlightCategory: SynthesisCategoryKey`.
        *   The component's rendering logic must be updated to check this prop and apply a visual highlight to the corresponding part of the canvas.
        *   **Crucially, you must not change the existing visual design of the canvas itself.** The only permitted change is the addition of the highlight effect.

5.  **Update Navigation:**
    *   **File:** Your main navigator (e.g., `src/navigation/MainTabNavigator.tsx`)
    *   **Action:** Modify the navigator stack.
    *   **Logic:**
        *   Add a route for the new `PortraitRevealScreen`.
        *   Remove the route for the old `UserBaseChartScreen`. It must no longer be accessible.
        *   Ensure that any code that previously navigated to `UserBaseChartScreen` now navigates to `PortraitRevealScreen`.

**Acceptance Criteria:**

*   The `PortraitRevealScreen` successfully replaces the `UserBaseChartScreen`.
*   The tour presents the foundational categories one by one.
*   The `BlueprintCanvas` correctly highlights the active category in the tour.
*   All text displayed on the screen is sourced from the `synthesisCategoryCopy.ts` file.
*   The visual design of the `BlueprintCanvas` is preserved, with the exception of the new highlighting feature.

**Warning:** Hard-coding any labels or descriptions in the `PortraitRevealScreen` will be considered a failure to meet the requirements of this phase. All content must come from the central copy registry.
