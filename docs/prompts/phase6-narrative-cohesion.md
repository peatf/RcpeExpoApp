# Phase 6: Finalize Copy and Ensure Narrative Cohesion (Revised)

**Objective:** To completely eradicate all hard-coded, user-facing strings from the application and ensure all copy is sourced from a single, centralized registry.

**To Jules:**

This is the final refactoring phase. Your task is to perform a comprehensive sweep of the entire codebase and replace every user-visible string with a call to a central copy provider. This is a zero-tolerance task for hard-coded content.

**File-by-File Implementation Plan:**

1.  **Create the Master Copy Registry:**
    *   **File:** `src/content/copyRegistry.ts`
    *   **Action:** Create this file.
    *   **Content:** Define and export the `copyRegistry` object. It must have a top-level `research` key. The structure under this key must contain all user-facing strings for the app, from navigation and onboarding to tool labels and category descriptions.

2.  **Implement the Copy Context:**
    *   **File:** `src/content/CopyContext.tsx`
    *   **Action:** Create this file.
    *   **Content:** Implement a `CopyProvider` and a `useCopy` hook. The provider must make the `research` tone from the `copyRegistry` available to all components that use the hook.

3.  **Wrap the App:**
    *   **File:** `App.tsx`
    *   **Action:** Modify this file.
    *   **Logic:** You must wrap your application's providers with the `<CopyProvider>`.

4.  **Execute Global String Replacement:**
    *   **Action:** This is the primary task of this phase. You must search every `.tsx` file in the `src/` directory. Any string literal that a user can see in the UI must be removed and replaced with a call to the `useCopy` hook (e.g., `const copy = useCopy(); ... <Text>{copy.onboardingTitle}</Text>`).
    *   **This is a mandatory, non-negotiable step.** Use your IDE's global search function to find all potential candidates for replacement.

5.  **Decommission Legacy Copy File:**
    *   **File:** `src/constants/narrativeCopy.ts`
    *   **Action:** Delete this file. Its continued existence poses a risk of being used accidentally. It must be removed from the project.

**Acceptance Criteria:**

*   There are **zero** hard-coded user-facing strings in the application's components.
*   Every piece of text visible in the UI is rendered from the `copyRegistry` via the `useCopy` hook.
*   The application's narrative tone is consistently aligned with the "research" theme.
*   The legacy `constants/narrativeCopy.ts` file has been deleted.

**Conclusion:**

Upon successful completion of this phase, the RCPE refactor is complete. The codebase will be stable, scalable, and have a consistent, easily manageable content strategy.
