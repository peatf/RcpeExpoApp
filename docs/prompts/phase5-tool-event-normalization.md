# Phase 5: Normalize Tool Events and Create the Insight Layer (Revised)

**Objective:** To implement a unified event system that captures significant user actions as structured data, making the application "live" and responsive.

**To Jules:**

This phase is about data generation. You will create a system for logging events from all "Lab Tools" into a centralized store. This is the foundation for all future pattern-recognition features.

**File-by-File Implementation Plan:**

1.  **Define the Event Schema:**
    *   **File:** `src/domain/events/types.ts`
    *   **Action:** Create this file.
    *   **Content:** Define the `RcpeEvent` interface. It **must** match the schema from the audit document precisely (`id`, `ts`, `tool`, `userId`, `summary`, `payload`, `tags`). No deviation is permitted.

2.  **Create the Events Redux Slice:**
    *   **File:** `src/state/events/eventsSlice.ts`
    *   **Action:** Create this file using Redux Toolkit.
    *   **Content:** The slice must manage an array of `RcpeEvent` objects. It must include reducers for `eventAdded`, `eventsLoaded`, and `eventsCleared`. The event array must be capped at 250 items (a ring buffer).
    *   **File:** `src/state/events/persistence.ts`
    *   **Action:** Create this file.
    *   **Content:** Implement helpers to save the event slice to `AsyncStorage` and load it on startup.

3.  **Integrate Events Slice into Store:**
    *   **File:** `src/state/store.ts`
    *   **Action:** Add the `eventsReducer` to the `configureStore` call.
    *   **File:** `App.tsx`
    *   **Action:** On application startup, you must dispatch an action to load events from storage. You must also subscribe to the store to persist the event log whenever it changes.

4.  **Create the Event Logging Hook:**
    *   **File:** `src/domain/events/logEvent.ts`
    *   **Action:** Create this file.
    *   **Content:** Export a `useLogEvent` hook. This hook will provide a function that constructs a valid `RcpeEvent` object (including a new UUID and timestamp) and dispatches the `eventAdded` action.

5.  **Instrument All Lab Tools:**
    *   **Action:** You must modify every "Lab Tool" screen (`LivingLogScreen`, `CalibrationToolScreen`, etc.).
    *   **Logic:** In each tool, use the `useLogEvent` hook. When the user completes the tool's primary action (e.g., saving a log, submitting a score), you must call the `logEvent` function with the appropriate `tool` name, a human-readable `summary`, and a structured `payload`.

6.  **Activate the "Recent Signals" Feed:**
    *   **File:** `src/screens/Main/TodayCanvasScreen.tsx`
    *   **Action:** Modify this screen.
    *   **Logic:** Create a `useRecentEvents` hook that selects the latest events from the Redux store. Use this hook to replace the mock data in the "Recent Signals" feed with live data.

**Acceptance Criteria:**

*   Actions taken in every Lab Tool generate a corresponding `RcpeEvent` that is added to the Redux store and persisted to `AsyncStorage`.
*   The "Recent Signals" feed on the `TodayCanvasScreen` accurately displays a list of the user's most recent actions.
*   The event logging system is robust, and all generated events strictly adhere to the defined `RcpeEvent` schema.
*   The visual design of the tool screens is not altered.

**Warning:** If a tool is not instrumented, the "living map" will have blind spots. You must ensure every tool correctly logs its events.
