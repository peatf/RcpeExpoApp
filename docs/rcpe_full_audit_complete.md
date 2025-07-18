Final Analysis and Recommendations

After a thorough review of the rcpe_full_audit_complete.md document and the application's source code, I can provide the following assessment:

Go/No-Go on the Proposed Plan:

Go. The six-phase implementation plan proposed in the audit is an excellent, robust, and well-sequenced strategy for transforming the RCPE app into the "living reality map" you envision. It directly addresses the primary architectural and UX issues that are currently preventing the app from delivering a cohesive and research-driven experience. My direct inspection of the code confirms the audit's findings of fragmentation, missing data gates, and a "quest"-based narrative that is misaligned with your current vision.

Architectural, UX, and Technical Assessment:

Blind Spots & Missed Opportunities: The audit is remarkably thorough. It correctly identifies the lack of a central RealityProfile, the absence of a navigation gate to ensure data readiness, and the scattered, hard-coded nature of the synthesis categories as the most critical issues. The proposed solutions—a ProfileProvider, a guided PortraitRevealScreen, and a centralized copyRegistry—are modern, best-practice solutions to these problems.
Sequencing and Domain Boundaries: The proposed sequencing is optimal. Starting with the ProfileAssemblyGate (Phase 1) is the most critical step, as it provides the foundational data layer that all other features will depend on. The introduction of clear domain boundaries (/domain/profile, /domain/events) will significantly improve the codebase's maintainability and scalability.
Migration Steps: The migration steps outlined in each phase are logical and designed to minimize risk. The plan allows for incremental, testable changes that can be rolled out without major disruptions to the user experience.
Alternative Patterns, Tools, or Frameworks:

Given your current stack (React Native, Redux), the recommended tools and patterns are appropriate.

State Management: The use of React's Context API for the ProfileProvider is a good choice for managing profile data, as it is relatively simple and avoids the boilerplate of Redux for this specific use case. The continued use of Redux for the eventsSlice is also appropriate, as Redux is well-suited for managing a stream of actions.
Async Data: The plan correctly identifies the need for a more robust approach to asynchronous data handling. The introduction of a useProfileReady hook and a more structured data fetching lifecycle will significantly improve the app's reliability and user experience.
Recommendations for a Smooth Rollout and Future Evolution:

Prioritize the Copy Registry: While the audit places the copy registry in Phase 6, I would recommend prioritizing it earlier. Centralizing all user-facing copy will not only ensure a consistent tone and voice but also simplify future internationalization efforts.
Invest in a Robust Navigation Strategy: The audit suggests using inline conditional rendering for navigation as a transitional step. I would recommend moving to a more robust navigation strategy, such as a root switch navigator, as early as possible. This will provide more granular control over navigation flows and improve the user experience.
Establish a Clear Caching Policy: The audit mentions a simple AsyncStorage cache for the user profile. I would recommend establishing a clear caching policy that includes background refreshing and a well-defined cache invalidation strategy. This will ensure that the app remains performant and that you always have access to the most up-to-date data.
Key Risks to Watch For:

Backend Dependencies: The success of this plan is highly dependent on the backend services providing the necessary data in a timely and reliable manner. Any delays or issues with the backend will have a significant impact on the project timeline.
Data Model Complexity: The RealityProfile data model is complex and will require careful management to ensure its consistency and accuracy.
Scope Creep: The plan is ambitious, and there is a risk of scope creep. It will be important to maintain a clear focus on the core vision and to prioritize features accordingly.

Below is **Step 1: Index & Map** — a structured reconnaissance of the repo you provided (`/mnt/data/RcpeExpoApp-main.zip`, extracted from current `main` at the time you downloaded). I’ve mapped project structure, traced where *profile‑ish* data is sourced, located every screen you flagged (or closest existing analogs), and built an early “fragmentation heatmap” for the 9 synthesis categories. This will set us up for the Phase‑by‑Phase deep audit you asked for (Profile Assembly Gate next).

I’ve kept this concise but concrete: key file paths, representative line refs, and red‑flag notes you can hand to another AI or dev without losing fidelity.

---

# Step 1: Index & Map (Repo Recon)

## 1. High‑Level Project Topography

**Project root:** `RcpeExpoApp-main/`
**Primary app entry:** `App.tsx` (plus a stale `App.tsx.backup`).
**Core source root:** `src/`

Top‑level subdirs of `src/` (trimmed to essentials):

| Dir           | Purpose (observed)                                                                                       | Notes                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `contexts/`   | Auth & theming providers.                                                                                | No profile/data context.                                     |
| `navigation/` | AppNavigator, MainTabNavigator, AuthNavigator.                                                           | No blocking data gate; user flows route on auth alone.       |
| `screens/`    | All user‑facing UI: Auth, Dashboard, ProfileCreation, Base Chart, Tools, HumanDesignTools legacy.        | “Quest” & “Tool” era co‑exist.                               |
| `components/` | Visual + flow components: EnergeticBlueprint (BlueprintCanvas), ProfileCreation multi‑step, Quests, etc. | Shows layering of multiple conceptual eras.                  |
| `state/`      | Redux store + `questSlice` only.                                                                         | No global profile, events, or signals slice.                 |
| `services/`   | API wrappers: `baseChartService`, `blueprintVisualizerService`, `authService`, etc.                      | *Where category data shape lives today.*                     |
| `constants/`  | Narrative copy, labels, theme, flows.                                                                    | Copy is “Quest” heavy; no mapping of 9 synthesis categories. |
| `data/`       | `quizData.ts` (typology / mastery surveys).                                                              | Not integrated into a multi‑source profile object.           |

---

## 2. Primary Flow Skeleton (Observed vs Intended)

### Intended (per your prompt)

**Auth → Onboarding (Birth + Typology + Mastery) → Profile Assembly Gate (compose Typology + HD + Astro → RealityProfile) → Portrait Reveal Guided Tour → Today’s Canvas Home (dynamic) → Lab Tools (event‑driven).**

### Observed in code

**Auth → MainNavigator (immediate) → Dashboard static menu tiles**; user can *optionally* open **ProfileCreationScreen**; **UserBaseChartScreen** independently fetches base chart; tools do not appear to wait on or feed a shared profile state.

**No gating:** Navigation decisions are made solely on `user` auth presence. See `AppNavigator.tsx` \~L10‑35 — conditional render `<AuthNavigator/>` vs `<MainTabNavigator/>` but *no profile readiness check*.

> **Ref:** `src/navigation/AppNavigator.tsx` L10‑31 (imports & setup) and L43‑60 (conditional rendering by `user` only).

---

## 3. Where the 9 Synthesis Categories Live

They *do* appear in the codebase — but **as scattered literal strings**, **type shapes in a service**, and **manually assembled description arrays in screens**. There is **no central category registry**; no enum; no key→copy map; no RealityProfile store.

### Category Signal Sources

| Source Type                 | Files                                                   | Notes                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime data shape**      | `src/services/baseChartService.ts`                      | Defines TS interface w/ nested objects for all 9 categories (`energy_family`, `energy_class`, etc.). This is the *closest thing* to a canonical profile schema. |
| **Visualization adapter**   | `src/services/blueprintVisualizerService.ts`            | Extracts and defensive‑defaults category subfields for visualizer; does not re‑expose the full structure consistently.                                          |
| **UI description scaffold** | `src/screens/Main/UserBaseChartScreen.tsx`              | Builds an array of `{category, description}` using **template strings with inline fallback copy**. Hard‑coded category labels.                                  |
| **Canvas logic**            | `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` | Per‑category rendering branches (`isHighlighted('Energy Family')` …). Hard‑coded.                                                                               |
| **Dev diagnostic script**   | `/verify-categories.js`                                 | Greps `BlueprintCanvas.tsx` for expected category blocks; used as sanity check but not in build.                                                                |

### Quick literal frequency scan

Approx. counts across repo (code + docs):

* Energy Family (43 mentions / 21 files)
* Processing Core (39 / 21)
* Drive Mechanics (35 / 19)
* Energy Class (22 / 15)
* Energy Architecture (22 / 13)
* Evolutionary Path (21 / 13)
* Decision Growth Vector (19 / 9)
* Manifestation Interface Rhythm (15 / 8)
* Tension Points (13 / 9)

> **Interpretation:** Strings are widespread; drift risk high; impossible to guarantee alignment of label, key path, copy, and visuals.

---

## 4. Core Files You Asked About (Found / Not Found)

| Requested                                 | Found?      | Path                                                              | Notes                                                                                                                                                                  |
| ----------------------------------------- | ----------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App.tsx**                               | ✅           | `App.tsx`                                                         | Entry. Wraps providers. No profile gate.                                                                                                                               |
| **RootNavigator**                         | ❌ (no file) | —                                                                 | Equivalent layer split into `AppNavigator.tsx` + `MainTabNavigator.tsx`.                                                                                               |
| **/src/domain/profile/composeProfile.ts** | ❌           | —                                                                 | No `domain/` dir. Composition logic scattered: onboarding steps capture fragments; services fetch chart.                                                               |
| **PortraitRevealScreen.tsx**              | ❌           | —                                                                 | Closest = `UserBaseChartScreen.tsx` (data + descriptions) and `EnergeticBlueprintScreen.tsx` (visual). There is also `ProfileResultStep.tsx` inside the creation flow. |
| **verify-categories.js**                  | ✅           | root `verify-categories.js`                                       | Local dev sanity script; greps Canvas for highlight support.                                                                                                           |
| **UserBaseChartScreen.tsx**               | ✅           | `src/screens/Main/UserBaseChartScreen.tsx`                        | Hard‑codes category descriptions.                                                                                                                                      |
| **DashboardScreen.tsx**                   | ✅           | `src/screens/Main/DashboardScreen.tsx`                            | Static tool tiles; no profile context.                                                                                                                                 |
| **QuestMapScreen.tsx**                    | ✅           | `src/screens/Main/QuestMapScreen.tsx`                             | Legacy quest layer; not wired to 9 categories.                                                                                                                         |
| **LivingLogScreen.tsx**                   | ✅           | `src/screens/Main/HumanDesignTools/LivingLogScreen.tsx`           | Legacy HD “tool.” Not normalized events.                                                                                                                               |
| **CalibrationToolScreen.tsx**             | ✅           | `src/screens/Main/CalibrationToolScreen.tsx`                      | Standalone; uses copy about calibration, not category‑aware.                                                                                                           |
| **FrequencyMapperScreen.tsx**             | ✅           | `src/screens/Main/FrequencyMapperScreen.tsx` (& `/index.tsx` alt) | Legacy mapping tool; emits no global events.                                                                                                                           |
| **OracleScreen.tsx**                      | ✅           | `src/screens/Main/OracleScreen.tsx`                               | Standalone; copy uses quest/completion language.                                                                                                                       |
| **DecisionMakerScreen.tsx**               | ✅           | `src/screens/Main/DecisionMakerScreen.tsx`                        | Placeholder logic; not connected to profile.                                                                                                                           |
| **eventsSlice.ts**                        | ❌           | —                                                                 | No events slice in `state/`; only `questSlice.ts`.                                                                                                                     |
| **synthesisCategoryCopy.ts**              | ❌           | —                                                                 | No central category copy file.                                                                                                                                         |
| **prompts.ts**                            | ❌           | —                                                                 | Copy spread across `constants/narrativeCopy.ts`, per‑screen strings, docs.                                                                                             |

---

## 5. Representative Evidence (Line Refs)

> Line numbers approximate file state in the ZIP; if you re‑pull, please diff.

### 5.1 No Profile Gate in Navigation

**`src/navigation/AppNavigator.tsx`**

* L10‑18: Imports Auth / Main navigators; no profile logic.
* L43‑60 *(render stack)*: chooses `<AuthNavigator/>` if no `user`; otherwise `<MainTabNavigator/>`. No wait for profile assembly / categories load.

### 5.2 Dashboard Ignores Profile / Categories

**`src/screens/Main/DashboardScreen.tsx`**

* L44‑62: `menuItems` static array; each entry hard‑routes to a tool screen by name. No dynamic label, no portrait tile, no signals feed.

  ```ts
  { title: 'Frequency Mapper', ... onPress: () => navigation.navigate('FrequencyMapper') } // L48‑52
  { title: 'Calibration Tool', ... } // L53‑57
  { title: 'Oracle', ... } // L58‑62
  { title: 'Base Chart', ... } // L63‑67
  ```

### 5.3 UserBaseChart Hard‑Codes the 9 Categories

**`src/screens/Main/UserBaseChartScreen.tsx`**

* L220‑256: Returns array of `{ category: "Energy Family", description: \`Core identity shaped by...\` }`etc. All nine labels inlined; data pulled piecemeal from`chartData\`. No central copy; no dynamic intro lengths; no 3‑6 foundational subset logic.
* L132‑140: Handles `tension_points` fallback; suggests shape mismatch vs service.

### 5.4 BlueprintCanvas Category Blocks

**`src/components/EnergeticBlueprint/BlueprintCanvas.tsx`**

* L805‑808: `if (isHighlighted('Energy Family')) { ... }`
* L494‑504: Energy Class block.
* Similar repeated guard patterns for each category; styling & alpha logic duplicated. This is where **verify-categories.js** checks for highlight support.

### 5.5 Category Schema Exists (But UI Doesn’t Consume Centrally)

**`src/services/baseChartService.ts`**

* L20‑84: TS interface defines *all 9* category payload shapes (`energy_family`, `energy_class`, `processing_core`, etc.).
* L316‑370+: Maps API JSON into safe object; sets default fallbacks.
* L651‑686+: Post‑fetch line normalization patches (lines, G Center access). Indicates schema wrangling occurs *after* fetch each time.

### 5.6 Visualization Adapter Pulls Fragments

**`src/services/blueprintVisualizerService.ts`**

* L89‑137: Extracts per‑category fields individually w/ `safeGet` calls; loses full nested structure; duplicates fallback logic separate from `baseChartService`.

### 5.7 No Events Layer

**`src/state/`**

* Only `store.ts` + `quests/questSlice.ts`. No global slice for signals, events, or profile. Tools dispatch nothing normalized.

### 5.8 Copy Scattered / Quest‑Heavy

**`src/constants/narrativeCopy.ts`**

* L1‑\~80: Auth & navigation copy themed around “Quest,” “Journey,” not research / pattern mapping.
* No keys for 9 synthesis categories; no micro prompts.

---

## 6. Fragmentation Heatmap (Severity Snapshot)

| Layer                   | What We Want                                                                                               | What Exists                                                                                                         | Risk                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Auth → Profile Gate** | Must *block UI* until Typology, Birth, Mastery resolved + backend chart returns; produce `RealityProfile`. | Auth only; user dropped directly into app; profile optional & late.                                                 | **High** – Tools run w/ null/partial data.                           |
| **Profile Store**       | Single `RealityProfile` accessible via hook/context/store.                                                 | None. Data pulled ad‑hoc from screens + services.                                                                   | **High** – Inconsistent category usage, repeated fetches, race bugs. |
| **Portrait Reveal**     | Guided, data‑driven; 3‑6 foundational categories; short/long copy variants.                                | `UserBaseChartScreen` lists 9 w/ fallback interpolation; `EnergeticBlueprintScreen` separate; no guided sequencing. | **High** – Overwhelm, incoherence, copy drift.                       |
| **Home Surface**        | “Today’s Canvas” w/ dynamic prompt, portrait tile, lab tools contextualized, recent signals.               | `DashboardScreen` static tile list; `QuestMapScreen` legacy.                                                        | **High** – No sense of living map.                                   |
| **Events / Signals**    | Normalized event stream (LOG\_SIGNAL, TOOL\_RUN, etc.) feeding insights.                                   | No events slice; quest slice unrelated.                                                                             | **High** – Can’t generate pattern cards or adaptive prompts.         |
| **Copy Registry**       | Central map: category→{label, microPrompt, shortIntro, deepIntro, toolHint}.                               | Quest copy registry only; category copy inline in screens.                                                          | **Med‑High** – Update friction; inconsistent tone.                   |

---

## 7. Legacy Artifacts That Undermine “Living Research Map”

| Artifact                                     | Where                                                                                                  | Why It’s a Problem                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| “Quest” framing baked into navigation + copy | `MainTabNavigator.tsx` imports `QuestMapScreen`; `constants/narrativeCopy.ts` uses “Quest” throughout. | Conflicts w/ your updated “research‑driven map for pattern‑lovers” framing; raises user expectation of gamification you don’t want to surface. |
| HumanDesignTools legacy sub‑screens          | `screens/Main/HumanDesignTools/*`                                                                      | Parallel tool stack with different metaphors; increases cognitive load.                                                                        |
| Completion UI bits                           | e.g., `components/Quests/CompletionModal.tsx`, `QuestCompletionToast.tsx`                              | Suggests old reward loop; distracts from subtle insight banners you now prefer.                                                                |
| Multiple App entry backups                   | `App.tsx.backup`                                                                                       | Drift risk if anyone copies from stale backup lacking fonts/providers or adding wrong gating.                                                  |

---

## 8. Quick Data Path Trace (Where Profile Pieces Come From)

**Birth / Typology / Mastery capture**
→ `src/screens/Main/ProfileCreationScreen.tsx` orchestrates step components (BirthDataStep, TypologyQuizStep, MasteryQuizStep, ReviewStep). *No evidence that completed data is persisted to a global profile store.* (Search found no compose or dispatch.)

**Base chart fetch**
→ `src/services/baseChartService.ts` fetches backend (mock or live) & produces full category tree object. Called by **UserBaseChartScreen.tsx** & **blueprintVisualizerService.ts**.

**Visualizer**
→ `BlueprintCanvas.tsx` expects flattened `VisualizationData` — *a transformed subset*, not the full base chart.

**Implication:** Without a unifying `RealityProfile`, different screens see different slices of “you.” Users will sense choppiness when values don’t match or appear missing.

---

## 9. Gaps vs Your Requested Audit Areas

Below I’m marking each of your audit focus areas with a **Current Coverage Snapshot** so you can see where we’ll go next.

| Audit Area                         | Current State (Observed)                                                                         | Immediate Questions for Phase 2                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Profile Domain & Assembly Gate** | *Missing.* Composition implied but not implemented; no `domain/profile`; nav doesn’t wait.       | Where should composed profile live? Redux? Context? Query cache?                                     |
| **Portrait Reveal & Guided Tour**  | `UserBaseChartScreen` static; `EnergeticBlueprintScreen` visual; no stepper; copy inline.        | Which 3‑6 categories are “foundational” for first reveal? Should we use severity or canonical order? |
| **Innerface OS Home**              | `DashboardScreen` static; `QuestMapScreen` legacy alt; neither draws live categories or signals. | Combine? Replace? Hide QuestMap?                                                                     |
| **Tool Integration & Event Log**   | Tools standalone; only `questSlice` tracks quest progress.                                       | Define event schema + minimal reducer in Phase 3?                                                    |
| **Narrative & Copy Registry**      | `constants/narrativeCopy.ts` quest language; no category copy.                                   | Confirm tone shift (pattern‑lab vs quest) before rewrite.                                            |

---

## 10. Suggested Audit Delivery Plan (Based on Your “Whatever Gets Best Result” Answer)

Because depth matters and you’ll be copying this to another AI, I recommend **phased reports**, each closing with *clear patch targets*. That lets you iterate + delegate safely.

**Phase 2 – Centralized Copy / Narrative Realignment (Priority 2 & 1)**

* `src/content/synthesisCategoryCopy.ts` to hold label + microPrompt + shortIntro + toolHints for each category.
* Update `narrativeCopy.ts` to de‑quest main flows (or keep optional theme toggles).

**Phase 3 – Profile Assembly Gate (Priority 6)**

* Trace what data onboarding collects.
* Define a `RealityProfile` TypeScript interface unifying: `baseChartService.BaseChartData` + Typology + Mastery survey results.
* Propose `ProfileProvider` (React context) or Redux slice; choose based on existing store usage.
* Add gating hook `useProfileReady()` consumed in `AppNavigator` to block UI until assembled.
* Move to a more robust navigation strategy, such as a root switch navigator, as early as possible.
* Establish a clear caching policy that includes background refreshing and a well-defined cache invalidation strategy.

**Phase 4 – Portrait Reveal Guided Tour (Priority 5)**

* Replace / wrap `UserBaseChartScreen` w/ new `PortraitRevealScreen`.
* Build `buildPortraitTour(profile, opts)` to select 3‑6 categories (foundational) and load copy from registry.

**Phase 5 – Today’s Canvas Home (Priority 4)**

* Replace `DashboardScreen` w/ composable Canvas: prompt, portrait tile, lab tools (renamed), recent signals feed.

**Phase 6 – Tool Event Normalization + Insight Layer (Priority 3)**

* Minimal `eventsSlice` + event dispatcher hooks.
* Rules engine stub to emit pattern cards.

---

## 11. Quick Evidence Snippets (Copy/Paste Ready)

### A. AppNavigator has no profile gating

```ts
// src/navigation/AppNavigator.tsx  (excerpt)
const AppNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
```

> No loading / error branches for profile fetch; user enters app with no assembled data.

---

### B. Dashboard does not surface portrait / signals

```ts
// src/screens/Main/DashboardScreen.tsx  (excerpt L44-67)
const menuItems = [
  { title: 'Frequency Mapper', onPress: () => navigation.navigate('FrequencyMapper') },
  { title: 'Calibration Tool', onPress: () => navigation.navigate('CalibrationTool') },
  { title: 'Oracle',            onPress: () => navigation.navigate('Oracle') },
  { title: 'Base Chart',        onPress: () => navigation.navigate('UserBaseChart') },
];
```

> Static tool list; zero profile awareness.

---

### C. Nine categories hard‑coded (no copy registry)

```ts
// src/screens/Main/UserBaseChartScreen.tsx  (excerpt L220-256)
return [
  { category: "Energy Family", description: `Core identity shaped by ${chartData.energy_family?...}` },
  { category: "Energy Class",  description: `Interface with the world...` },
  { category: "Processing Core", ... },
  { category: "Decision Growth Vector", ... },
  { category: "Drive Mechanics", ... },
  { category: "Manifestation Interface Rhythm", ... },
  { category: "Energy Architecture", ... },
  { category: "Tension Points", ... },
  { category: "Evolutionary Path", ... },
];
```

> Inline fallback strings; some truncated; values stitched per screen.

---

### D. BlueprintCanvas manual highlight branches

```ts
// src/components/EnergeticBlueprint/BlueprintCanvas.tsx  (~L805)
if (isHighlighted('Energy Family')) {
  const color = getColor('Energy Family');
  // draw...
}
```

> Repeated for each category; no dynamic mapping loop.

---

### E. Category schema defined but siloed in service

```ts
// src/services/baseChartService.ts (excerpt L20-84)
export interface BaseChartData {
  ...
  energy_family: { profile_lines: string; conscious_line: number; ... };
  energy_class: { strategy: string; aura: string; incarnation_cross_quarter: string; ... };
  processing_core: { cognition_variable: string; ... };
  decision_growth_vector: { authority: string; ... };
  drive_mechanics: { heart_state: string; ... };
  manifestation_interface_rhythm: { manifestation_rhythm_spectrum: string; throat_definition: string; ... };
  energy_architecture: { definition: string; channel_list: string[]; ... };
  tension_points: { chiron_gate: string; ... };
  evolutionary_path: { g_center_access: string; conscious_line: number; ... };
}
```

> This should feed the *RealityProfile* root.

---

## 12. Early Technical Observations (Pre‑Recommendation)

**A. Two inconsistent data entry points:**
Onboarding collects user input but does not immediately round‑trip to base chart fetch; separate screens fetch chart later. Race leads to incomplete portrait.

**B. Visualization vs Data Divergence:**
`BlueprintCanvas` consumes `VisualizationData` (flattened) from `blueprintVisualizerService`, which itself partly re‑maps from `baseChartService` output — duplication = drift.

**C. Missing derived fields for Tour:**
No place to store computed category weight, status (“complete/inferred”), or “foundational” flag for first reveal. We’ll need a `derivePortraitMeta()` layer.

**D. No event plumbing:**
Tools create UI state; nothing persisted to global store — so “living map” can’t shift in response to user actions.

---

## 13. Ready for **Phase 2: Profile Assembly Gate**?

Unless you want changes, I’ll proceed next by:

1. **Tracing data capture** across `ProfileCreationScreen.tsx` step components to see what we *actually* collect (Birth, Typology, Mastery).
2. **Mapping backend BaseChart payload** (from `baseChartService.ts`) to a candidate `RealityProfile` interface.
3. **Proposing ProfileStore** (context or Redux slice) + `useProfile()` / `useProfileReady()` API.
4. **Suggesting gating changes** in `AppNavigator.tsx` (or wrapper) to ensure no main UI until profile assembled (or show “Synthesizing Your Blueprint…” screen).

Below is **Phase 2: Profile Assembly Gate** — how to ensure *no one* reaches the main app shell until we’ve composed a coherent **RealityProfile** (Typology + Mastery + BirthData → backend compute → BaseChart 9 synthesis categories). This is the #1 stabilizer for cohesion across the whole product: if every downstream screen reads from one canonical object, the “living, research‑driven map” becomes possible; without it, everything remains choppy, inconsistent, and user‑eroding.

I’ve structured this as:

1. **Goal & Why It Matters**
2. **What Exists Now (Evidence)**
3. **Gap Analysis**
4. **Target Data Model: `RealityProfile`**
5. **Profile Assembly Lifecycle (state machine)**
6. **Implementation Plan (stepwise; file‑level)**
7. **Patches / Code Sketches (safely copy‑pasteable)**
8. **Migration Notes & Risk Flags**
9. **Short Next‑Step Checklist (your reply needed)**

---

## 1. Goal & Why It Matters

> **Guarantee that all user‑facing flows (Portrait, Home, Tools) operate on a *fully composed* `RealityProfile` object.**
> This prevents mismatched copy, missing category data, or tools that behave as if the user has no profile.

Without a gate, users can:

* Open tools before any profile exists (no context = “why am I here?”).
* See partial data (Birth submitted but BaseChart not fetched yet).
* Encounter inconsistent labels for the 9 categories.

Locking UI behind a synthesis gate is the single biggest unifier you can implement quickly.

---

## 2. What Exists Now (Evidence)

**Navigation bypasses data readiness.**
`AppNavigator` renders `MainTabNavigator` as soon as `user` is truthy; no profile readiness check. (See `src/navigation/AppNavigator.tsx`: conditional at render; only auth state considered.)

**Profile creation collects data but does not hydrate global state.**
`ProfileCreationScreen` builds payload in `handleSubmitProfile()` (L100‑104) and sends to `ProfileService.createProfile`; on success, stores returned `profileId` locally and advances to next step — but no global store or auto‑fetch of chart. (See `src/screens/Main/ProfileCreationScreen.tsx` L91‑112.)

**Result step is passive.**
`ProfileResultStep` requires user to tap “Fetch Profile” to manually load data; nothing drives navigation into the portrait reveal automatically.

**Base chart + 9 categories fetched *per screen*.**
`UserBaseChartScreen` calls `baseChartService.getUserBaseChart(user.id)` directly (L\~232 region). No caching across app; other screens can diverge.

**No unified profile store or domain.**
No `src/domain/profile/`; Redux store only has `quests` slice; `AuthContext` knows user but not profile.

---

## 3. Gap Analysis (Critical)

| Required for Gate                                                | Current State                                                         | Impact                                      | Fix Priority |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- | ------------ |
| Detect whether a profile exists for logged‑in user               | `baseChartService.getUserProfileId()` exists but unused in navigation | Users land in empty app; must manually hunt | **High**     |
| Compose *single* profile object from backend + local survey data | Pieces scattered; no compose fn                                       | Tools read different slices                 | **High**     |
| Persist profile & freshness metadata                             | None                                                                  | Re‑fetch churn, offline blank states        | Med‑High     |
| Loading/generation UX (“Synthesizing…”)                          | None                                                                  | Confusion during long compute               | Med          |
| Error fallback (prompt to create profile)                        | None                                                                  | Dead nav loops                              | Med          |

---

## 4. Target Data Model: `RealityProfile`

A minimal but forward‑compatible composite that every screen can consume.

```ts
// src/domain/profile/types.ts
export interface RealityProfile {
  id: string;
  userId: string;

  // Raw / source fragments
  birth: BirthData;
  typologyResponses: Record<string, any>;
  masteryResponses: Record<string, any>;
  baseChart: BaseChartData;        // full 9 category payload from backend

  // Convenience shortcuts
  styleKey?: string;                // typology_pair_key from baseChart or resolved
  hdType?: string;                  // hd_type
  authority?: string;               // decision_growth_vector.authority
  strategy?: string;                // energy_class.strategy or hd_type mapping

  // Derived portrait metadata
  categoryMeta: Record<SynthesisCategoryKey, CategoryMeta>;
  foundationalCategoryOrder: SynthesisCategoryKey[]; // first reveal subset
  lastUpdated: number;
  version: string;                  // from baseChart.metadata.version
}

export type SynthesisCategoryKey =
  | 'energy_family'
  | 'energy_class'
  | 'processing_core'
  | 'decision_growth_vector'
  | 'drive_mechanics'
  | 'manifestation_interface_rhythm'
  | 'energy_architecture'
  | 'tension_points'
  | 'evolutionary_path';

export interface CategoryMeta {
  label: string;        // UI label
  present: boolean;     // data exists
  confidence?: number;  // if backend computes quality scores later
  shortIntro?: string;  // from content registry
}
```

---

## 5. Profile Assembly Lifecycle (State Machine)

We want a provider that manages these states:

```
UNAUTHENTICATED
   ↓ (Auth user)
CHECKING_FOR_PROFILE   (call baseChartService.getUserProfileId + maybe profileService.getProfile minimal)
   ↓ found
FETCHING_BASE_CHART
   ↓ success
COMPOSING_PROFILE      (merge + derive)
   ↓ ready
READY
   ↓ error path
ERROR_NO_PROFILE | ERROR_FETCH | ERROR_COMPOSE
```

From consumer screens: `useProfile()` returns `{profile, status, error, refreshProfile(), createNewProfile()}`.

---

## 6. Implementation Plan (Stepwise; File‑Level)

### Step A – Create Profile Domain

Add dir: `src/domain/profile/`

* `types.ts` (above)
* `composeProfile.ts` – merge sources & derive metadata
* `ProfileContext.tsx` – React context + provider
* `useProfile.ts` – hook wrapper
* `profileStateMachine.ts` – optional enumerated statuses

### Step B – Compose Function

Consume:

* Backend `ProfileService.getProfile(profileId)` (birth + survey responses)
* Backend `baseChartService.getUserBaseChart(userId)` (full categories)
* Fallback to local copies if offline (persist to AsyncStorage under `rp_${userId}`).

### Step C – Provider Behavior

On mount (after Auth user resolved):

1. If no user → `UNAUTHENTICATED`.
2. Else try cached composite from storage; mark `CHECKING_FOR_PROFILE`.
3. Call `baseChartService.getUserProfileId(user.id)`:

   * If none → `MISSING` (drive to Onboarding).
   * If id → fetch `ProfileService.getProfile(id)` + `BaseChart`.
4. Compose + set `READY`.

### Step D – Gate Navigation

Patch `AppNavigator.tsx`:

* Replace `user ? <MainTabNavigator/> : <AuthNavigator/>` with profile‑aware branch:

  * No user → Auth
  * User + `status === MISSING` → route to `ProfileCreationStack`
  * User + `status === LOADING` → `<ProfileLoadingGate/>`
  * User + `status === READY` → `<MainTabNavigator/>`

### Step E – Hook Profile Creation Flow Back to Provider

When `ProfileCreationScreen` successfully creates profile (line \~105):

* Call `ProfileContext.refreshProfile()` (or `onProfileCreated(newId)`).
* After compose complete, auto‑navigate to **PortraitRevealScreen** (new) rather than “ResultStep”.

### Step F – Persist & Version

Use `baseChart.metadata.version` + timestamp; rebuild if stale > 24h or if user triggers refresh.

---

## 7. Patches / Code Sketches

> Copy‑paste friendly; adjust imports to your lint rules.
> (I’ve used relative paths assuming new `domain/profile` folder at `src/domain/profile/`.)

---

### 7.1 `src/domain/profile/types.ts`

```ts
// src/domain/profile/types.ts
import type { BirthData, TypologyResponse, MasteryResponse } from '../../types';
import type { BaseChartData } from '../../services/baseChartService';

export type SynthesisCategoryKey =
  | 'energy_family'
  | 'energy_class'
  | 'processing_core'
  | 'decision_growth_vector'
  | 'drive_mechanics'
  | 'manifestation_interface_rhythm'
  | 'energy_architecture'
  | 'tension_points'
  | 'evolutionary_path';

export interface CategoryMeta {
  key: SynthesisCategoryKey;
  label: string;
  present: boolean;
  shortIntro?: string;
  microPrompt?: string;
  confidence?: number;
}

export interface RealityProfile {
  id: string;
  userId: string;

  birth: BirthData;
  typologyResponses: Record<string, TypologyResponse>;
  masteryResponses: Record<string, MasteryResponse>;

  baseChart: BaseChartData;

  styleKey?: string;   // typology_pair_key, fallback to derived
  hdType?: string;     // baseChart.hd_type
  authority?: string;  // baseChart.decision_growth_vector.authority
  strategy?: string;   // baseChart.energy_class.strategy

  categoryMeta: Record<SynthesisCategoryKey, CategoryMeta>;
  foundationalCategoryOrder: SynthesisCategoryKey[];

  version: string;     // baseChart.metadata.version
  lastUpdated: number; // ms epoch
}
```

---

### 7.2 `src/domain/profile/composeProfile.ts`

```ts
// src/domain/profile/composeProfile.ts
import { RealityProfile, SynthesisCategoryKey, CategoryMeta } from './types';
import type { ProfileCreationResponse } from '../../types';
import type { BaseChartData } from '../../services/baseChartService';
import { categoryCopy } from '../../content/synthesisCategoryCopy'; // will add in later phase

// fallback label mapping until copy registry lands
const FALLBACK_LABELS: Record<SynthesisCategoryKey, string> = {
  energy_family: 'Energy Family',
  energy_class: 'Energy Class',
  processing_core: 'Processing Core',
  decision_growth_vector: 'Decision Growth Vector',
  drive_mechanics: 'Drive Mechanics',
  manifestation_interface_rhythm: 'Manifestation Interface Rhythm',
  energy_architecture: 'Energy Architecture',
  tension_points: 'Tension Points',
  evolutionary_path: 'Evolutionary Path',
};

export interface ComposeOptions {
  // if you'd like to shorten first reveal
  foundationalMax?: number; // default 6
}

export function composeRealityProfile(
  userId: string,
  profileApi: ProfileCreationResponse,
  baseChart: BaseChartData,
  opts: ComposeOptions = {}
): RealityProfile {
  const foundationalMax = opts.foundationalMax ?? 6;
  const birth = profileApi?.birth_data ?? {
    birth_date: '',
    birth_time: '',
    city_of_birth: '',
    country_of_birth: '',
  };
  const typologyResponses = profileApi?.assessment_responses?.typology ?? {};
  const masteryResponses  = profileApi?.assessment_responses?.mastery ?? {};

  // Build category metadata
  const catMetaEntries: [SynthesisCategoryKey, CategoryMeta][] = (
    Object.keys(FALLBACK_LABELS) as SynthesisCategoryKey[]
  ).map((k) => {
    const src = (baseChart as any)[k];
    const present = !!src && Object.keys(src).length > 0;
    const copy = (categoryCopy?.[k] ?? {}) as any;
    return [
      k,
      {
        key: k,
        label: copy.label ?? FALLBACK_LABELS[k],
        present,
        shortIntro: copy.shortIntro,
        microPrompt: copy.microPrompt,
      },
    ];
  });

  // naive foundational ordering: always start with 4 core engagement axes
  const defaultOrder: SynthesisCategoryKey[] = [
    'energy_family',
    'energy_class',
    'processing_core',
    'decision_growth_vector',
    'drive_mechanics',
    'manifestation_interface_rhythm',
    'energy_architecture',
    'tension_points',
    'evolutionary_path',
  ];

  const foundational = defaultOrder.slice(0, foundationalMax);

  const rp: RealityProfile = {
    id: baseChart.metadata.profile_id ?? profileApi?.id ?? '',
    userId,
    birth,
    typologyResponses,
    masteryResponses,
    baseChart,
    styleKey: baseChart.typology_pair_key,
    hdType: baseChart.hd_type,
    authority: baseChart.decision_growth_vector?.authority,
    strategy: baseChart.energy_class?.strategy,
    categoryMeta: Object.fromEntries(catMetaEntries),
    foundationalCategoryOrder: foundational,
    version: baseChart.metadata?.version ?? '0',
    lastUpdated: Date.now(),
  };

  return rp;
}
```

---

### 7.3 `src/domain/profile/ProfileContext.tsx`

```tsx
// src/domain/profile/ProfileContext.tsx
import React, { createContext, useContext, useEffect, useCallback, useState, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import baseChartService from '../../services/baseChartService';
import ProfileService from '../../services/profileService';
import { composeRealityProfile } from './composeProfile';
import type { RealityProfile } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProfileStatus =
  | 'UNAUTHENTICATED'
  | 'CHECKING_FOR_PROFILE'
  | 'MISSING'
  | 'FETCHING'
  | 'COMPOSING'
  | 'READY'
  | 'ERROR';

interface ProfileContextValue {
  status: ProfileStatus;
  profile: RealityProfile | null;
  error?: string;
  refreshProfile: () => Promise<void>;
  onProfileCreated: (profileId: string) => Promise<void>;
  clearProfileCache: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue>({
  status: 'UNAUTHENTICATED',
  profile: null,
  refreshProfile: async () => {},
  onProfileCreated: async () => {},
  clearProfileCache: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

const CACHE_KEY_PREFIX = 'rp_cache_';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<ProfileStatus>('UNAUTHENTICATED');
  const [profile, setProfile] = useState<RealityProfile | null>(null);
  const [error, setError] = useState<string | undefined>();

  const cacheKey = user ? `${CACHE_KEY_PREFIX}${user.id}` : null;

  const loadFromCache = useCallback(async () => {
    if (!cacheKey) return null;
    try {
      const raw = await AsyncStorage.getItem(cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      setProfile(parsed);
      return parsed as RealityProfile;
    } catch {
      return null;
    }
  }, [cacheKey]);

  const saveToCache = useCallback(async (rp: RealityProfile) => {
    if (!cacheKey) return;
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(rp));
    } catch {}
  }, [cacheKey]);

  const fetchAndCompose = useCallback(
    async (profileId: string) => {
      try {
        setStatus('FETCHING');
        const [profileApi, baseChartResp] = await Promise.all([
          ProfileService.getProfile(profileId),
          baseChartService.getUserBaseChart(user?.id || '', true),
        ]);
        if (!baseChartResp?.data) {
          throw new Error('Base chart missing.');
        }
        setStatus('COMPOSING');
        const rp = composeRealityProfile(
          user!.id,
          profileApi,
          baseChartResp.data,
          { foundationalMax: 6 },
        );
        setProfile(rp);
        await saveToCache(rp);
        setStatus('READY');
      } catch (err: any) {
        setError(err?.message ?? 'Profile compose error');
        setStatus('ERROR');
      }
    },
    [user, saveToCache],
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    setStatus('CHECKING_FOR_PROFILE');
    try {
      const existingId = await baseChartService.getUserProfileId(user.id);
      if (!existingId) {
        setStatus('MISSING');
        return;
      }
      await fetchAndCompose(existingId);
    } catch (err: any) {
      setError(err?.message ?? 'Profile lookup error');
      setStatus('ERROR');
    }
  }, [user, fetchAndCompose]);

  const onProfileCreated = useCallback(async (newId: string) => {
    // Called after onboarding create
    await fetchAndCompose(newId);
  }, [fetchAndCompose]);

  const clearProfileCache = useCallback(async () => {
    if (!cacheKey) return;
    await AsyncStorage.removeItem(cacheKey);
    setProfile(null);
  }, [cacheKey]);

  // bootstrap
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setStatus('UNAUTHENTICATED');
      setProfile(null);
      return;
    }
    (async () => {
      const cached = await loadFromCache();
      // Show cached instantly, but still refresh
      if (cached) setStatus('READY');
      await refreshProfile();
    })();
  }, [isAuthenticated, user, loadFromCache, refreshProfile]);

  return (
    <ProfileContext.Provider
      value={{ status, profile, error, refreshProfile, onProfileCreated, clearProfileCache }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
```

---

### 7.4 `src/screens/System/ProfileLoadingGate.tsx`

```tsx
// src/screens/System/ProfileLoadingGate.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export function ProfileLoadingGate({ message = "Synthesizing Your Blueprint…" }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  msg: { marginTop:16, color:theme.colors.textPrimary, fontSize:18, textAlign:'center' },
});
```

---

### 7.5 Patch `App.tsx` to Mount `ProfileProvider`

Add import + wrap children:

```diff
@@
-import AppNavigator from './src/navigation/AppNavigator';
+import AppNavigator from './src/navigation/AppNavigator';
+import { ProfileProvider } from './src/domain/profile/ProfileContext';
@@
     <Provider store={store}>
       <AuthProvider>
-        <ThemingProvider theme={theme}>
-          <AppBackground>
-            <AppNavigator />
-          </AppBackground>
-        </ThemingProvider>
+        <ProfileProvider>
+          <ThemingProvider theme={theme}>
+            <AppBackground>
+              <AppNavigator />
+            </AppBackground>
+          </ThemingProvider>
+        </ProfileProvider>
       </AuthProvider>
     </Provider>
```

---

### 7.6 Patch `src/navigation/AppNavigator.tsx` to Gate on Profile

```diff
 import AppNavigator from '@react-navigation/native'; // (keep existing imports)
+import { useProfile } from '../domain/profile/ProfileContext';
+import { ProfileLoadingGate } from '../screens/System/ProfileLoadingGate';
+import ProfileCreationScreen from '../screens/Main/ProfileCreationScreen'; // or stack

 const AppNavigator = () => {
   const { user } = useAuth();
+  const { status } = useProfile();

   return (
     <NavigationContainer>
-      {user ? <MainTabNavigator /> : <AuthNavigator />}
+      {!user && <AuthNavigator />}
+      {user && status === 'MISSING' && <ProfileCreationScreen />}
+      {user && (status === 'CHECKING_FOR_PROFILE' || status === 'FETCHING' || status === 'COMPOSING') && (
+        <ProfileLoadingGate />
+      )}
+      {user && status === 'READY' && <MainTabNavigator />}
+      {user && status === 'ERROR' && (
+        <ProfileCreationScreen /> /* fallback; could route error screen */
+      )}
     </NavigationContainer>
   );
 };
```

> **If you prefer a proper Navigator stack**: Instead of inline components, define a stack with named routes; above diff is conceptual sketch.

---

### 7.7 Patch `src/screens/Main/ProfileCreationScreen.tsx` to Notify Provider

Add from provider:

```diff
-import ProfileService from '../../services/profileService';
+import ProfileService from '../../services/profileService';
+import { useProfile } from '../../domain/profile/ProfileContext';
@@
 export const ProfileCreationScreen = ({ navigation }) => {
+  const { onProfileCreated } = useProfile();
@@
   const handleSubmitProfile = async () => {
@@
-      const response = await ProfileService.createProfile(payload);
+      const response = await ProfileService.createProfile(payload);
       // Assume response.id ...
       if (response?.id) {
         setProfileId(response.id);
-        handleNextStep();
+        // Immediately compose full profile via provider
+        await onProfileCreated(response.id);
+        // Navigate straight to PortraitReveal (new screen)
+        navigation.replace('PortraitReveal');
       } else {
         throw new Error('No profile ID received');
       }
```

Also: remove manual “Fetch Profile” step or demote to debug.

---

### 7.8 Minimal `PortraitRevealScreen` Stub (Phase 3 will flesh out)

For now, just read `useProfile()` and show foundational category list:

```tsx
// src/screens/Main/PortraitRevealScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useProfile } from '../../domain/profile/ProfileContext';
import { theme } from '../../constants/theme';

export function PortraitRevealScreen() {
  const { profile } = useProfile();
  if (!profile) return null;

  const { foundationalCategoryOrder, categoryMeta } = profile;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Portrait</Text>
      {foundationalCategoryOrder.map((k) => {
        const m = categoryMeta[k];
        return (
          <View key={k} style={styles.card}>
            <Text style={styles.cat}>{m.label}</Text>
            {m.shortIntro && <Text style={styles.intro}>{m.shortIntro}</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:24},
  title:{fontSize:28,fontWeight:'700',color:theme.colors.textPrimary,marginBottom:16},
  card:{marginBottom:24},
  cat:{fontSize:20,fontWeight:'600',color:theme.colors.accent},
  intro:{marginTop:4,color:theme.colors.textSecondary,lineHeight:22}
});
```

---

## 8. Migration Notes & Risk Flags

**1. Async Storage Race:**
If you show cached READY profile then refresh in background, ensure downstream screens subscribe to `profile.version` changes and re‑render.

**2. Backend shape drift:**
`baseChartService` manually patches inconsistent fields (see fix blocks \~L650+). Compose step should *trust the service* as canonical but log missing categories; you can optionally validate all 9 exist.

**3. Large Payloads:**
BaseChartData is fairly wide; storing full object in AsyncStorage is fine short‑term (<\~100KB typical) but watch growth if you add daily events.

**4. Navigation Loops:**
When gating, ensure you don’t mount two Navigators at once. Ideally make an outer stack: `Auth`, `ProfileSetup`, `AppMain`.

**5. Back Button Behavior:**
Once `READY`, you probably don’t want the user to back‑swipe into onboarding; use `navigation.reset` after compose.

---

Proceeding with **Phase 3: Portrait Reveal Guided Tour**.

Because you replied “ready” without revising the open checklist, I’m moving forward using **sensible defaults** (you can override later):

**Working Defaults**

1. **Navigator Strategy:** Root gating stack (Auth → ProfileSetup → AppMain); inline conditional shim acceptable during migration.
2. **Profile Refresh:** On each cold launch (and onProfileCreated); background refresh allowed.
3. **Foundational Categories in First Reveal:** 6 (Energy Family, Energy Class, Processing Core, Decision Growth Vector, Drive Mechanics, Manifestation Interface Rhythm).
4. **Auto‑Reveal After Profile Create:** Yes (replace ProfileCreation stack w/ PortraitReveal).
5. **Offline Cache:** Lightweight restore (AsyncStorage) already built in Phase 2 draft; good enough for MVP.

If any of these should change, let me know and I’ll patch.

---

# Phase 3: Portrait Reveal Guided Tour

**Objective:** Replace the current static `UserBaseChartScreen` + scattered Blueprint visualization with a **data‑driven, step‑sequenced Portrait Reveal** that:

* Draws directly from the composed **RealityProfile** (Phase 2).
* Introduces **3–6 foundational synthesis categories** first (short, digestible).
* Offers **expanded detail on demand** (tap to expand, or “Continue your map” stage).
* Highlights the category region in the Blueprint visualization as each step is introduced.
* Pulls copy from a *central registry* (Phase 6 will deepen copy; for now minimal scaffolding).
* Cleanly hands off to **Today’s Canvas Home** at the end.

---

## 1. Problems in Current Implementation (Evidence)

| Problem                                               | Where Seen                                           | Impact on User                       | Fix in Phase 3                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Hard‑coded 9 category array; template string mashups  | `src/screens/Main/UserBaseChartScreen.tsx` L220‑256  | Inconsistent, brittle, walls of text | Replace w/ dynamic `buildPortraitTour()` using `RealityProfile.categoryMeta` + central copy.       |
| No sequencing / guided experience                     | Same screen; plain scroll list                       | Overwhelm; no narrative flow         | Stepper w/ Next / Skip / Expand.                                                                   |
| Visualization disconnected                            | `BlueprintCanvas` not coordinated w/ category reveal | Users don’t see “map” animate        | Add `highlightCategory` prop + crossfade when step active.                                         |
| Manual fetch triggered by user                        | `ProfileResultStep` + `UserBaseChartScreen`          | User does work backend should handle | Auto‑reveal after Profile assembly (Phase 2).                                                      |
| Mixed metaphors (“Base Chart,” “Energetic Blueprint”) | Title copy scattered                                 | Conceptual drift                     | Standardize to **Portrait** (aka “Your Energetic Blueprint”) and refer to categories consistently. |

---

## 2. Portrait Reveal Experience Flow (User)

**Immediately after onboarding & profile compose:**

1. **Screen 1 – Synthesizing… → Fade‑in Title:** “Here’s how your system patterns show up.”
2. **Step Cards (carousel / paged):**

   * Energy Family
   * Energy Class
   * Processing Core
   * Decision Growth Vector
   * Drive Mechanics
   * Manifestation Interface Rhythm
     Each card = short intro + animated highlight in Blueprint.
3. **Expand / Learn More:** Expand reveals deeper copy + key data points pulled from `RealityProfile.baseChart.<category>`.
4. **Continue:** “See the full portrait” → reveals remaining 3 categories (Energy Architecture, Tension Points, Evolutionary Path) in condensed list (user can tap in).
5. **Done → Today’s Canvas:** Pass control to Home (Phase 4).

---

## 3. Data Contract for the Tour

We introduce a builder that transforms the composed profile into UI consumables.

```ts
export interface PortraitTourStep {
  key: SynthesisCategoryKey;
  label: string;
  shortIntro: string;       // ~1–2 sentences
  deepIntro?: string;       // expanded contextual paragraph
  dataPoints: PortraitDataPoint[]; // resolved key stats (authority, definition, etc.)
  highlightTarget?: string; // id or token recognized by BlueprintCanvas
  isFoundational: boolean;
}

export interface PortraitDataPoint {
  label: string;
  value: string;
}
```

---

## 4. Central Copy Scaffolding (Minimal)

Create now; deepen later.

**File:** `src/content/synthesisCategoryCopy.ts`

```ts
import { SynthesisCategoryKey } from '../domain/profile/types';

interface CategoryCopyEntry {
  label: string;
  microPrompt: string;
  shortIntro: string;
  deepIntro?: string;
  toolHint?: string;
  // map backend field keys -> friendly label
  fields?: Record<string, string>;
}

export const categoryCopy: Record<SynthesisCategoryKey, CategoryCopyEntry> = {
  energy_family: {
    label: 'Energy Family',
    microPrompt: "How do you naturally show up in the world?",
    shortIntro: "Your core broadcast style — how people first experience you.",
    deepIntro: "Energy Family blends your Human Design type + profile lines...",
    fields: {
      hd_type: "Design Type",
      profile_lines: "Profile",
    },
  },
  energy_class: {
    label: 'Energy Class',
    microPrompt: "How does life invite interaction?",
    shortIntro: "Your interface pattern — how you engage and respond.",
    deepIntro: "Strategy, aura, and invitation mechanics gather here...",
    fields: {
      strategy: "Strategy",
      aura: "Aura",
      incarnation_cross_quarter: "Quarter",
    },
  },
  processing_core: {
    label: 'Processing Core',
    microPrompt: "How do you take in and process reality?",
    shortIntro: "Your inner processing + cognition variables.",
    deepIntro: "Determination, digestion, and mental orientation...",
    fields: { cognition_variable: "Cognition", determination: "Determination" },
  },
  decision_growth_vector: {
    label: 'Decision Growth Vector',
    microPrompt: "Where is clarity found for you?",
    shortIntro: "Authority patterns that refine decisions.",
    fields: { authority: "Authority" },
  },
  drive_mechanics: {
    label: 'Drive Mechanics',
    microPrompt: "What fuels your movement?",
    shortIntro: "Motivation + will + energetic push/pull.",
    fields: { heart_state: "Heart / Ego", motivation: "Motivation" },
  },
  manifestation_interface_rhythm: {
    label: 'Manifestation Interface Rhythm',
    microPrompt: "What pace fits your creative output?",
    shortIntro: "How your expression lands & manifests.",
    fields: { manifestation_rhythm_spectrum: "Rhythm", throat_definition: "Throat" },
  },
  energy_architecture: {
    label: 'Energy Architecture',
    microPrompt: "How are your channels wired?",
    shortIntro: "Definition + channels shape how energy flows.",
    fields: { definition: "Definition", channel_list: "Active Channels" },
  },
  tension_points: {
    label: 'Tension Points',
    microPrompt: "Where do you stretch & grow?",
    shortIntro: "Friction that produces pattern insight.",
    fields: { chiron_gate: "Chiron Gate" },
  },
  evolutionary_path: {
    label: 'Evolutionary Path',
    microPrompt: "Where is your longer arc headed?",
    shortIntro: "Themes unfolding over time.",
    fields: { g_center_access: "G Center Access" },
  },
};
```

> **NOTE:** The copy is placeholder but structured. You’ll later replace shortIntro/deepIntro w/ polished language.

---

## 5. Portrait Tour Builder

**File:** `src/domain/profile/buildPortraitTour.ts`

```ts
import { RealityProfile, SynthesisCategoryKey } from './types';
import { categoryCopy } from '../../content/synthesisCategoryCopy';

export function buildPortraitTour(
  profile: RealityProfile,
  opts?: { includeNonFoundational?: boolean }
) {
  const includeNonFoundational = opts?.includeNonFoundational ?? true;
  const list: any[] = [];

  const base = profile.baseChart;
  const foundationalSet = new Set(profile.foundationalCategoryOrder);

  const allKeys: SynthesisCategoryKey[] = [
    'energy_family',
    'energy_class',
    'processing_core',
    'decision_growth_vector',
    'drive_mechanics',
    'manifestation_interface_rhythm',
    'energy_architecture',
    'tension_points',
    'evolutionary_path',
  ];

  for (const k of allKeys) {
    const copy = categoryCopy[k];
    const raw = (base as any)[k] ?? {};
    const meta = profile.categoryMeta[k];
    const isFoundational = foundationalSet.has(k);

    if (!includeNonFoundational && !isFoundational) continue;

    const dataPoints = [];
    if (copy.fields) {
      Object.entries(copy.fields).forEach(([fieldKey, label]) => {
        const v = raw?.[fieldKey];
        if (v == null) return;
        if (Array.isArray(v)) {
          if (v.length === 0) return;
          dataPoints.push({ label, value: v.join(', ') });
        } else {
          dataPoints.push({ label, value: String(v) });
        }
      });
    }

    list.push({
      key: k,
      label: copy.label,
      shortIntro: copy.shortIntro,
      deepIntro: copy.deepIntro,
      microPrompt: copy.microPrompt,
      dataPoints,
      isFoundational,
      highlightTarget: copy.label, // temp; match BlueprintCanvas name
      present: meta?.present ?? true,
    });
  }

  return list;
}
```

---

## 6. Portrait Reveal Screen (Guided)

Replace old `UserBaseChartScreen` *or* create new screen and deprecate old.

**File:** `src/screens/Main/PortraitRevealScreen.tsx` (full guided flow)

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useProfile } from '../../domain/profile/ProfileContext';
import { buildPortraitTour } from '../../domain/profile/buildPortraitTour';
import { BlueprintCanvas } from '../../components/EnergeticBlueprint/BlueprintCanvas'; // assuming default export adjust path
import { theme } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function PortraitRevealScreen({ navigation }) {
  const { profile } = useProfile();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const steps = useMemo(
    () => (profile ? buildPortraitTour(profile, { includeNonFoundational: showAll }) : []),
    [profile, showAll]
  );

  const onToggleExpand = useCallback((k: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpanded((s) => ({ ...s, [k]: !s[k] }));
    setActiveKey(k);
  }, []);

  const onContinue = useCallback(() => {
    if (!showAll) {
      setShowAll(true);
      return;
    }
    navigation.replace('TodayCanvas'); // route to new Home screen (Phase 4)
  }, [showAll, navigation]);

  if (!profile) return null;

  return (
    <View style={styles.root}>
      {/* Blueprint live highlight */}
      <View style={styles.blueprintWrap}>
        <BlueprintCanvas
          data={profile.baseChart}
          highlightCategory={activeKey} // you will patch BlueprintCanvas
        />
      </View>

      <FlatList
        data={steps}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expanded[item.key];
          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => onToggleExpand(item.key)}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardIntro}>{item.shortIntro}</Text>
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.expand}>
                  {item.deepIntro ? <Text style={styles.deep}>{item.deepIntro}</Text> : null}
                  {item.dataPoints.map((dp) => (
                    <View key={dp.label} style={styles.dpRow}>
                      <Text style={styles.dpLabel}>{dp.label}</Text>
                      <Text style={styles.dpValue}>{dp.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
            <Text style={styles.continueText}>{showAll ? "Go to Today's Canvas" : "See full portrait"}</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1},
  blueprintWrap:{width:'100%',height:220,backgroundColor:theme.colors.surfaceMuted},
  listContent:{padding:24,paddingBottom:80},
  card:{marginBottom:32},
  cardLabel:{fontSize:20,fontWeight:'600',color:theme.colors.accent},
  cardIntro:{marginTop:4,color:theme.colors.textSecondary,lineHeight:22},
  expand:{marginTop:12},
  deep:{color:theme.colors.textPrimary,lineHeight:22,marginBottom:12},
  dpRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:4},
  dpLabel:{color:theme.colors.textSecondary},
  dpValue:{color:theme.colors.textPrimary,fontWeight:'500'},
  continueBtn:{marginTop:16,alignSelf:'center',paddingHorizontal:24,paddingVertical:12,borderRadius:24,backgroundColor:theme.colors.accent},
  continueText:{color:'#fff',fontWeight:'600'},
});
```

---

## 7. BlueprintCanvas Patch (Highlight Prop)

Current Canvas checks `isHighlighted('Energy Family')` hard‑coded. We need to supply backend keys or internal label match. Minimal backward‑compatible patch:

**File:** `src/components/EnergeticBlueprint/BlueprintCanvas.tsx`

```diff
-export function BlueprintCanvas(props) {
-  const { data } = props;
+export function BlueprintCanvas(props) {
+  const { data, highlightCategory } = props; // highlightCategory: SynthesisCategoryKey
@@
- function isHighlighted(label: string) {
-   return highlighted.includes(label); // old
- }
+ const KEY_TO_LABEL = {
+   energy_family: 'Energy Family',
+   energy_class: 'Energy Class',
+   processing_core: 'Processing Core',
+   decision_growth_vector: 'Decision Growth Vector',
+   drive_mechanics: 'Drive Mechanics',
+   manifestation_interface_rhythm: 'Manifestation Interface Rhythm',
+   energy_architecture: 'Energy Architecture',
+   tension_points: 'Tension Points',
+   evolutionary_path: 'Evolutionary Path',
+ };
+
+ function isHighlighted(label: string) {
+   if (!highlightCategory) return false;
+   const expected = KEY_TO_LABEL[highlightCategory] ?? highlightCategory;
+   return label === expected;
+ }
```

> Later we can refactor the Canvas to consume structured category config rather than label matching; this patch gets you interactive highlighting quickly.

---

## 8. Deprecate / Refactor `UserBaseChartScreen`

**Short Term:** Keep the route but redirect immediately into `PortraitRevealScreen` if profile exists. Provide a debug backdoor for devs to inspect raw JSON.

```diff
- export function UserBaseChartScreen({ navigation }) {
+ export function UserBaseChartScreen({ navigation }) {
+   const { profile } = useProfile();
+   React.useEffect(() => {
+     if (profile) {
+       navigation.replace('PortraitReveal');
+     }
+   }, [profile]);
+   ...
```

---

## 9. Navigation Additions

Add route names to whatever navigator currently includes `UserBaseChartScreen`. E.g., in `src/navigation/MainTabNavigator.tsx` (or whichever stack holds the Base Chart):

```diff
 import { UserBaseChartScreen } from '../screens/Main/UserBaseChartScreen';
+import { PortraitRevealScreen } from '../screens/Main/PortraitRevealScreen';

- <Stack.Screen name="UserBaseChart" component={UserBaseChartScreen} />
+ <Stack.Screen name="PortraitReveal" component={PortraitRevealScreen} />
+ <Stack.Screen name="UserBaseChart" component={UserBaseChartScreen} options={{ presentation: 'modal', title: 'Raw Data (Dev)' }} />
```

Then update any `navigation.navigate('UserBaseChart')` calls to `'PortraitReveal'` where you intend user flow to go (Dashboard, onboarding finish, etc.).

---

## 10. Copy Migration Strategy

Phase 6 will fully re‑write copy; for now:

* Use `shortIntro` for step summary.
* Use `deepIntro` for expanded card body.
* Auto‑derive `dataPoints` from backend fields based on `fields` map in `categoryCopy`.
* For missing copy entries, fallback to the label only (safe; no crash).

---

## 11. Testing Script (Manual QA Path)

**Scenario A – New User**

1. Sign up → onboarding data → profile create.
2. Confirm provider `onProfileCreated()` composes profile.
3. App navigates automatically to **PortraitReveal**.
4. Foundational 6 show; “See full portrait” reveals remaining 3; “Go to Today’s Canvas” transitions to home.

**Scenario B – Returning User (cache)**

1. Launch logged‑in user.
2. Profile cache loads → immediate Portrait or Home? (Depends where you route from `AppNavigator`; recommended: Home; user can re‑open Portrait from Profile menu.)
3. Pull‑to‑refresh triggers recompose.

**Scenario C – Missing Data**

1. Delete remote profile; login again.
2. App detects `MISSING` → sends to `ProfileCreationScreen`.

---

## 12. File‑by‑File Change Punchlist

| File                                                    | Action                                             | Priority      |
| ------------------------------------------------------- | -------------------------------------------------- | ------------- |
| `src/content/synthesisCategoryCopy.ts`                  | **Add** file (scaffolding)                         | Now           |
| `src/domain/profile/types.ts`                           | **Add**                                            | Now           |
| `src/domain/profile/composeProfile.ts`                  | **Add**                                            | Now           |
| `src/domain/profile/buildPortraitTour.ts`               | **Add**                                            | Now           |
| `src/domain/profile/ProfileContext.tsx`                 | **Add**                                            | Now           |
| `src/screens/System/ProfileLoadingGate.tsx`             | **Add**                                            | Now           |
| `App.tsx`                                               | Wrap in `ProfileProvider`                          | Now           |
| `src/navigation/AppNavigator.tsx`                       | Gate by profile status                             | Now           |
| `src/screens/Main/ProfileCreationScreen.tsx`            | Call `onProfileCreated` + nav to Portrait          | Now           |
| `src/screens/Main/PortraitRevealScreen.tsx`             | **Add** main guided UI                             | Now           |
| `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` | Accept `highlightCategory` & patch highlight logic | Soon          |
| `src/screens/Main/UserBaseChartScreen.tsx`              | Redirect to Portrait; demote to dev                | Later cleanup |

---

## 13. Quick Evidence Reminders (for cross‑checking)

* Hard‑coded 9 category list: `src/screens/Main/UserBaseChartScreen.tsx` \~L220‑256.
* Blueprint highlight label conditional: `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` \~L800.
* Base chart schema canonical: `src/services/baseChartService.ts` top interface L16‑88.
* Profile creation API call: `src/screens/Main/ProfileCreationScreen.tsx` L100‑106.

---



* **Foundational categories:** Keep 6 (Energy Family, Energy Class, Processing Core, Decision Growth Vector, Drive Mechanics, Manifestation Interface Rhythm) in that order.
* **Portrait auto‑show:** Display **PortraitReveal** on first *post‑login* if the user has never viewed it (`hasViewedPortrait` persisted locally; later can sync to backend).
* **Hand‑off:** After Reveal → go **directly** to Today’s Canvas (new dynamic home).

With that, here’s **Phase 4: Today’s Canvas Home** — design + implementation plan + code scaffolds + integration updates (Portrait completion tracking + nav glue). I’ll keep this tight and implementation‑ready.

---

# Phase 4: Today’s Canvas Home

**Goal:** Replace the static menu dashboard with a *living, profile‑aware entry surface* that orients pattern‑lovers: “Here’s what’s lighting up in your field.” It should reflect the **RealityProfile**, invite lightweight research actions, and display recent signals once we wire events (Phase 5).

---

## 1. Design Brief (Functional Slice)

**Regions:**

1. **Contextual Prompt Banner** (“What’s lighting up in your field today?” adaptive).
2. **Portrait Tile** (mini card; shows 6 foundational glyphs or a ring state; tap to reopen PortraitReveal).
3. **Lab Tools Row/Grid** (renamed for research clarity; quick actions).
4. **Recent Signals Feed** (Phase 5 will stream event log; interim shows last manual entries or placeholder).
5. **Optional Pattern Card Spotlight** (Phase 5 rules engine; stub slot now).

**Why this order?**

* Prompt first = invites entry.
* Portrait tile reiterates the system is *about you* (anchoring).
* Tools behave like instruments in a lab (accurate to research framing).
* Signals feed demonstrates “living map” in motion.

---

## 2. Data Inputs Needed

| Element                 | Source Now                                                                         | Future Enrichment                                              |
| ----------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Style‑aware microPrompt | `RealityProfile.styleKey` or fallback; lookup in `categoryCopy` or style registry. | Use event trends to rotate prompts.                            |
| Portrait summary        | `RealityProfile.foundationalCategoryOrder` + label set.                            | Include pattern highlights (“Consistent Generator aura” etc.). |
| Tools list              | Hard‑coded but re‑labeled; each aware of whether prereqs exist (profile ready).    | Unlock states & usage counts.                                  |
| Recent signals          | **Stub** (local sample) until Phase 5 events slice.                                | Real event stream (LOG\_SIGNAL, TOOL\_RUN, etc.).              |

---

## 3. Naming & Copy Conventions

**Rename surfaces for research clarity:**

| Old              | New Label                                      | Rationale |
| ---------------- | ---------------------------------------------- | --------- |
| Frequency Mapper | *Field Mapper* (or keep Frequency if on‑brand) |           |
| Calibration Tool | *Clarity Calibration*                          |           |
| Oracle           | *Pattern Oracle*                               |           |
| Living Log       | *Signal Log*                                   |           |
| Decision Maker   | *Alignment Check*                              |           |

(You can override; table is illustrative.)

---

## 4. Tracking `hasViewedPortrait`

We add a lightweight flag managed by the ProfileProvider (local only for now).

* Key: `rp_viewed_${userId}` in AsyncStorage.
* Set to `true` when user completes PortraitReveal (“Go to Today’s Canvas” tap).
* AppNavigator logic: if `status === READY` **and** `!hasViewedPortrait` → route PortraitReveal; else TodayCanvas.

---

## 5. Implementation Steps (Incremental Safe Merge)

**Step A – Add viewed flag support to ProfileProvider.**
**Step B – Create TodayCanvas screen.**
**Step C – Update navigation (MainTab → TodayCanvas; DashboardScreen deprecated).**
**Step D – Update PortraitRevealScreen continue handler: mark viewed, then navigate to TodayCanvas.**
**Step E – Remove / hide old Dashboard tile references or reroute them.**

---

## 6. Code Changes

### 6.1 Extend ProfileProvider to track hasViewedPortrait

**File:** `src/domain/profile/ProfileContext.tsx`
*Add state + load/save helpers.*

```diff
 const CACHE_KEY_PREFIX = 'rp_cache_';
+const VIEW_KEY_PREFIX  = 'rp_viewed_';
@@
 interface ProfileContextValue {
   status: ProfileStatus;
   profile: RealityProfile | null;
   error?: string;
   refreshProfile: () => Promise<void>;
   onProfileCreated: (profileId: string) => Promise<void>;
   clearProfileCache: () => Promise<void>;
+  hasViewedPortrait: boolean;
+  markPortraitViewed: () => Promise<void>;
 }
@@
 const ProfileContext = createContext<ProfileContextValue>({
   status: 'UNAUTHENTICATED',
   profile: null,
   refreshProfile: async () => {},
   onProfileCreated: async () => {},
   clearProfileCache: async () => {},
+  hasViewedPortrait: false,
+  markPortraitViewed: async () => {},
 });
@@
 export function ProfileProvider({ children }: { children: ReactNode }) {
   const { user, isAuthenticated } = useAuth();
   const [status, setStatus] = useState<ProfileStatus>('UNAUTHENTICATED');
   const [profile, setProfile] = useState<RealityProfile | null>(null);
   const [error, setError] = useState<string | undefined>();
+  const [hasViewedPortrait, setHasViewedPortrait] = useState(false);
@@
   const cacheKey = user ? `${CACHE_KEY_PREFIX}${user.id}` : null;
+  const viewKey  = user ? `${VIEW_KEY_PREFIX}${user.id}` : null;
@@
+  const loadViewedFlag = useCallback(async () => {
+    if (!viewKey) return false;
+    try {
+      const raw = await AsyncStorage.getItem(viewKey);
+      const v = raw === 'true';
+      setHasViewedPortrait(v);
+      return v;
+    } catch {
+      return false;
+    }
+  }, [viewKey]);
+
+  const markPortraitViewed = useCallback(async () => {
+    if (!viewKey) return;
+    try {
+      await AsyncStorage.setItem(viewKey, 'true');
+      setHasViewedPortrait(true);
+    } catch {}
+  }, [viewKey]);
@@
   // bootstrap
   useEffect(() => {
     if (!isAuthenticated || !user) {
       setStatus('UNAUTHENTICATED');
       setProfile(null);
+      setHasViewedPortrait(false);
       return;
     }
     (async () => {
-      const cached = await loadFromCache();
+      await loadViewedFlag();
+      const cached = await loadFromCache();
       // Show cached instantly, but still refresh
       if (cached) setStatus('READY');
       await refreshProfile();
     })();
-  }, [isAuthenticated, user, loadFromCache, refreshProfile]);
+  }, [isAuthenticated, user, loadFromCache, loadViewedFlag, refreshProfile]);
@@
-  return (
-    <ProfileContext.Provider
-      value={{ status, profile, error, refreshProfile, onProfileCreated, clearProfileCache }}
-    >
+  return (
+    <ProfileContext.Provider
+      value={{
+        status, profile, error,
+        refreshProfile, onProfileCreated, clearProfileCache,
+        hasViewedPortrait, markPortraitViewed
+      }}
+    >
       {children}
     </ProfileContext.Provider>
   );
}
```

---

### 6.2 Update AppNavigator gating logic

**File:** `src/navigation/AppNavigator.tsx`
(Your file layout may differ; adjust as needed.)

```diff
 import { useAuth } from '../contexts/AuthContext';
+import { useProfile } from '../domain/profile/ProfileContext';
+import { ProfileLoadingGate } from '../screens/System/ProfileLoadingGate';
+import { PortraitRevealScreen } from '../screens/Main/PortraitRevealScreen';
+import { TodayCanvasScreen } from '../screens/Main/TodayCanvasScreen';
 
 const AppNavigator = () => {
   const { user } = useAuth();
+  const { status, hasViewedPortrait } = useProfile();
 
   return (
     <NavigationContainer>
-      {user ? <MainTabNavigator /> : <AuthNavigator />}
+      {!user && <AuthNavigator />}
+      {user && status === 'MISSING' && <ProfileCreationScreen />}
+      {user && (status === 'CHECKING_FOR_PROFILE' || status === 'FETCHING' || status === 'COMPOSING') && (
+        <ProfileLoadingGate />
+      )}
+      {user && status === 'READY' && !hasViewedPortrait && <PortraitRevealScreen />}
+      {user && status === 'READY' && hasViewedPortrait && <MainTabNavigator />}
+      {user && status === 'ERROR' && <ProfileCreationScreen />}
     </NavigationContainer>
   );
 };
```

> **Note:** If you prefer to keep everything in a proper Navigator tree (recommended for back behavior), create a root switch stack; above inline conditional is a transitional scaffold.

---

### 6.3 PortraitRevealScreen: mark viewed + go to Canvas

**File:** `src/screens/Main/PortraitRevealScreen.tsx`

Find the `onContinue` handler and patch:

```diff
-import { useProfile } from '../../domain/profile/ProfileContext';
+import { useProfile } from '../../domain/profile/ProfileContext';
@@
-  const { profile } = useProfile();
+  const { profile, markPortraitViewed } = useProfile();
@@
-  const onContinue = useCallback(() => {
-    if (!showAll) {
-      setShowAll(true);
-      return;
-    }
-    navigation.replace('TodayCanvas'); // route to new Home screen
-  }, [showAll, navigation]);
+  const onContinue = useCallback(async () => {
+    if (!showAll) {
+      setShowAll(true);
+      return;
+    }
+    await markPortraitViewed();
+    navigation.reset({
+      index: 0,
+      routes: [{ name: 'TodayCanvas' }],
+    });
+  }, [showAll, navigation, markPortraitViewed]);
```

---

### 6.4 Today’s Canvas Screen

**File:** `src/screens/Main/TodayCanvasScreen.tsx` *(new)*

```tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../domain/profile/ProfileContext';
import { theme } from '../../constants/theme';

type ToolItem = {
  key: string;
  label: string;
  sub: string;
  route: string;
};

export function TodayCanvasScreen() {
  const nav = useNavigation();
  const { profile } = useProfile();

  // Contextual prompt: we can vary by styleKey later
  const prompt = useMemo(() => {
    const style = profile?.styleKey;
    if (style?.includes('Fluid')) return "What's moving in your field right now?";
    if (style?.includes('Structured')) return "What signal do you want to log or examine?";
    return "What’s lighting up in your field today?";
  }, [profile]);

  const tools: ToolItem[] = [
    { key: 'signal',    label: 'Signal Log',          sub: 'Capture a moment or pattern.', route: 'LivingLog' },
    { key: 'mapper',    label: 'Frequency Mapper',    sub: 'Trace energetic spikes.',     route: 'FrequencyMapper' },
    { key: 'calibrate', label: 'Clarity Calibration', sub: 'Check alignment + clarity.',  route: 'CalibrationTool' },
    { key: 'oracle',    label: 'Pattern Oracle',      sub: 'Pull a reflective prompt.',   route: 'Oracle' },
    { key: 'align',     label: 'Alignment Check',     sub: 'Support a decision.',         route: 'DecisionMaker' },
  ];

  // For now stub signals feed
  const recentSignals = [
    { id: '1', ts: 'Today 9:12a', txt: 'Energy spike after client call.' },
    { id: '2', ts: 'Yesterday',   txt: 'Creative drop; needed rest.' },
  ];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Prompt */}
      <Text style={styles.prompt}>{prompt}</Text>

      {/* Portrait Tile */}
      {profile && (
        <TouchableOpacity style={styles.portraitTile} onPress={() => nav.navigate('PortraitReveal' as never)}>
          <Text style={styles.portraitTitle}>Your Portrait</Text>
          <Text style={styles.portraitSub}>
            {profile.foundationalCategoryOrder
              .map((k) => profile.categoryMeta[k]?.label ?? '')
              .slice(0,3)
              .join(' • ')}
            …
          </Text>
        </TouchableOpacity>
      )}

      {/* Tools */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={styles.sectionHeader}>Lab Tools</Text>
      </View>
      {tools.map((t) => (
        <TouchableOpacity key={t.key} style={styles.toolCard} onPress={() => nav.navigate(t.route as never)}>
          <Text style={styles.toolLabel}>{t.label}</Text>
          <Text style={styles.toolSub}>{t.sub}</Text>
        </TouchableOpacity>
      ))}

      {/* Signals */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={styles.sectionHeader}>Recent Signals</Text>
      </View>
      {recentSignals.map((s) => (
        <View key={s.id} style={styles.signalRow}>
          <Text style={styles.signalTs}>{s.ts}</Text>
          <Text style={styles.signalTxt}>{s.txt}</Text>
        </View>
      ))}

      <View style={{height:80}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:{flex:1},
  content:{padding:24},
  prompt:{fontSize:24,fontWeight:'600',color:theme.colors.accent,lineHeight:30,marginBottom:24},
  portraitTile:{
    padding:16,borderRadius:16,backgroundColor:theme.colors.surfaceMuted,marginBottom:32
  },
  portraitTitle:{fontSize:18,fontWeight:'600',color:theme.colors.textPrimary},
  portraitSub:{marginTop:4,color:theme.colors.textSecondary},
  sectionHeaderWrap:{marginTop:16,marginBottom:8},
  sectionHeader:{fontSize:16,fontWeight:'700',color:theme.colors.textPrimary,letterSpacing:0.5},
  toolCard:{
    padding:16,borderRadius:12,backgroundColor:theme.colors.surface,marginBottom:12,
    borderWidth:1,borderColor:theme.colors.surfaceBorder
  },
  toolLabel:{fontSize:16,fontWeight:'600',color:theme.colors.textPrimary},
  toolSub:{marginTop:2,fontSize:13,color:theme.colors.textSecondary},
  signalRow:{paddingVertical:12,borderBottomWidth:1,borderBottomColor:theme.colors.surfaceBorder},
  signalTs:{fontSize:12,color:theme.colors.textSecondary,marginBottom:2},
  signalTxt:{color:theme.colors.textPrimary},
});
```

---

### 6.5 Update MainTabNavigator to point “Home” to TodayCanvas

Find where DashboardScreen is wired (likely in `src/navigation/MainTabNavigator.tsx` or similar). Replace import & component.

```diff
-import { DashboardScreen } from '../screens/Main/DashboardScreen';
+import { TodayCanvasScreen } from '../screens/Main/TodayCanvasScreen';
@@
-<Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
+<Tab.Screen name="TodayCanvas" component={TodayCanvasScreen} options={{ title: 'Home' }} />
```

Update any `navigation.navigate('Dashboard')` → `'TodayCanvas'`.

---

## 7. Decommissioning DashboardScreen (Optional Soft Removal)

Short‑term: keep a hidden route for QA until TodayCanvas stabilizes.
Longer term: delete to avoid confusion; or repurpose as a debug “All Tools” menu.

---

## 8. Integration Test Path

**Fresh install:**

1. Create profile.
2. PortraitReveal auto‑opens; finish; mark viewed.
3. Land on TodayCanvas.
4. Relaunch app → because viewed flag true, go straight to TodayCanvas (skip Portrait).

**Profile Updated:**
If user re‑runs onboarding or we add a “Rebuild portrait” action, you can clear viewed flag to re‑trigger the tour.

---

## 9. Event Hooks Placeholder (Prep for Phase 5)

We’ll expose a simple `logEvent()` util soon. The TodayCanvas feed will swap from stubbed `recentSignals` array to reading from `eventsSlice` once implemented. Keep a placeholder call pattern in each tool:

```ts
import { logEvent } from '../../domain/events/logEvent';
// Example in CalibrationToolScreen completion:
logEvent('CALIBRATION_SUBMIT', { clarityScore, note });
```

---

## 10. File‑Level Implementation Order (Recommended Merge Sequence)

1. Add new domain + content files (`synthesisCategoryCopy.ts`, others from Phase 3 if not yet merged).
2. Extend ProfileProvider with `hasViewedPortrait`.
3. Add TodayCanvasScreen.
4. Update AppNavigator gating.
5. Patch PortraitRevealScreen to mark viewed & route to Canvas.
6. Swap Tab route to TodayCanvas.
7. Soft redirect DashboardScreen (optional).

---

## 11. Evidence References (for your dev / second AI)

* **Dashboard static tiles to be replaced:** `src/screens/Main/DashboardScreen.tsx` L44‑67.
* **UserBaseChart hard‑coded categories:** `src/screens/Main/UserBaseChartScreen.tsx` L220‑256.
* **BlueprintCanvas label‑based highlights:** `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` \~L800.
* **Profile creation call (where to inject markProfileCreated):** `src/screens/Main/ProfileCreationScreen.tsx` L100‑106.
* **No home prompt / signals feed currently:** `DashboardScreen` shows static tool list.

---

Proceeding with **Phase 5: Tool Event Normalization & Insight Layer**.

This phase wires the “living” aspect of your map: each user action (logging a signal, running Calibration, pulling an Oracle card, checking a decision, mapping frequency) emits a **structured event**. Events accumulate into a lightweight stream consumed by **Today’s Canvas** (Phase 4) and later analytic features (pattern cards, adaptive prompts, unlock nudges).

---

# Phase 5 Overview

**Deliverables**

1. **Canonical Event Schema** (tool‑agnostic; extensible).
2. **Events Store** (Redux slice *or* lightweight EventsContext; I’ll recommend Redux to stay aligned w/ existing store infra).
3. **logEvent() Utility** to enforce schema + enrich w/ profile context.
4. **Tool Instrumentation Points** (patches for LivingLog, Calibration, FrequencyMapper, Oracle, DecisionMaker).
5. **Recent Signals Feed Adapter** (TodayCanvas consumes last N events).
6. **Micro Insight Rules Engine (MVP)** — generates “Pattern Cards” from event history (stub but functional).
7. **Persistence** (AsyncStorage ring buffer; rotates to prevent bloat).

---

## 1. Why Structured Events Matter

| Without Events            | With Events                                                 |
| ------------------------- | ----------------------------------------------------------- |
| Tools feel siloed.        | Unified activity timeline.                                  |
| No adaptive prompts.      | Pattern detection (“You log energy dips after late calls”). |
| No longitudinal insight.  | Research archive export / analysis later.                   |
| Hard to debug user state. | Inspectable JSON event stream.                              |

---

## 2. Event Schema (MVP)

Keep lean; everything optional beyond required base.

```ts
export type EventTool =
  | 'SIGNAL_LOG'          // formerly Living Log
  | 'FREQUENCY_MAP'
  | 'CALIBRATION'
  | 'ORACLE_PULL'
  | 'DECISION_CHECK'
  | 'SYSTEM'              // internal

export interface RcpeEvent {
  id: string;                 // uuid v4
  ts: number;                 // ms epoch
  tool: EventTool;
  userId: string;

  // Short human readable summary for feed rows
  summary: string;

  // Structured payload (tool-specific but serializable)
  payload?: Record<string, any>;

  // Taggable for pattern rules
  tags?: string[];

  // Optional category association(s)
  categories?: SynthesisCategoryKey[]; // from profile if relevant

  // Confidence or scale metrics (tool dependent; e.g., clarity score)
  score?: number;
}
```

---

## 3. Events Slice (Redux) vs Context

You already use Redux (`src/state/store.ts` + `questSlice`), so we’ll add an `eventsSlice` to enable:

* Quick append
* Dedup on id
* Persist ring buffer
* Selector for last N events

**Storage size goal:** keep last 250 events local; older truncated (export later if needed).

---

## 4. File Adds

| File                                     | Purpose                                                   |
| ---------------------------------------- | --------------------------------------------------------- |
| `src/state/events/eventsSlice.ts`        | Redux slice + actions                                     |
| `src/state/events/persistence.ts`        | AsyncStorage helpers (load/save ring)                     |
| `src/domain/events/logEvent.ts`          | Convenience function; injects userId + profile categories |
| `src/domain/events/useRecentEvents.ts`   | Selector hook                                             |
| `src/domain/insights/patternRules.ts`    | Simple rules engine                                       |
| `src/domain/insights/usePatternCards.ts` | Hook to compute cards for TodayCanvas                     |

---

## 5. eventsSlice.ts (Implementation)

```ts
// src/state/events/eventsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RcpeEvent } from '../../domain/events/types';

export interface EventsState {
  events: RcpeEvent[];  // newest first
  loaded: boolean;
}

const initialState: EventsState = {
  events: [],
  loaded: false,
};

const MAX_EVENTS = 250;

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    eventsLoaded(state, action: PayloadAction<RcpeEvent[]>) {
      state.events = action.payload.slice(0, MAX_EVENTS);
      state.loaded = true;
    },
    eventAdded(state, action: PayloadAction<RcpeEvent>) {
      // dedup by id
      const exists = state.events.findIndex((e) => e.id === action.payload.id);
      if (exists >= 0) state.events.splice(exists, 1);
      state.events.unshift(action.payload);
      if (state.events.length > MAX_EVENTS) state.events.length = MAX_EVENTS;
    },
    eventsCleared(state) {
      state.events = [];
      state.loaded = true;
    },
  },
});

export const { eventsLoaded, eventAdded, eventsCleared } = eventsSlice.actions;
export default eventsSlice.reducer;
```

---

## 6. Persistence Helpers

```ts
// src/state/events/persistence.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RcpeEvent } from '../../domain/events/types';

const KEY = 'rcpe_events_v1';

export async function loadEventsFromStorage(): Promise<RcpeEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as RcpeEvent[];
  } catch {
    return [];
  }
}

export async function saveEventsToStorage(events: RcpeEvent[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(events));
  } catch {}
}

export async function clearEventsFromStorage(): Promise<void> {
  try { await AsyncStorage.removeItem(KEY); } catch {}
}
```

---

## 7. Hook Up Events Slice in Store

**File:** `src/state/store.ts`

```diff
-import questReducer from './quests/questSlice';
+import questReducer from './quests/questSlice';
+import eventsReducer from './events/eventsSlice';

export const store = configureStore({
  reducer: {
    quests: questReducer,
+   events: eventsReducer,
  },
  ...
});
```

On app start (in `App.tsx` or a bootstrap effect), load persisted events:

```diff
+import { loadEventsFromStorage } from './src/state/events/persistence';
+import { eventsLoaded } from './src/state/events/eventsSlice';
+import { store } from './src/state/store';
@@
useEffect(() => {
+  (async () => {
+    const events = await loadEventsFromStorage();
+    store.dispatch(eventsLoaded(events));
+  })();
}, []);
```

Also subscribe to save on changes (a light persisted store pattern):

```ts
// in App.tsx after store setup
import { saveEventsToStorage } from './src/state/events/persistence';

store.subscribe(() => {
  const state = store.getState();
  const evs = state.events?.events;
  if (evs) saveEventsToStorage(evs);
});
```

---

## 8. Domain Event Utilities

### 8.1 types.ts

```ts
// src/domain/events/types.ts
import { SynthesisCategoryKey } from '../profile/types';

export type EventTool =
  | 'SIGNAL_LOG'
  | 'FREQUENCY_MAP'
  | 'CALIBRATION'
  | 'ORACLE_PULL'
  | 'DECISION_CHECK'
  | 'SYSTEM';

export interface RcpeEvent {
  id: string;
  ts: number;
  tool: EventTool;
  userId: string;
  summary: string;
  payload?: Record<string, any>;
  tags?: string[];
  categories?: SynthesisCategoryKey[];
  score?: number;
}
```

---

### 8.2 logEvent.ts

```ts
// src/domain/events/logEvent.ts
import { v4 as uuid } from 'uuid';
import { store } from '../../state/store';
import { eventAdded } from '../../state/events/eventsSlice';
import { RcpeEvent, EventTool } from './types';
import { useProfile } from '../profile/ProfileContext'; // not inside fn, but for context injection pattern

// non-hook version for tool screens:
export function logEventRaw(
  userId: string,
  tool: EventTool,
  summary: string,
  payload?: Record<string, any>,
  categories?: string[],
  score?: number,
  tags?: string[],
) {
  const ev: RcpeEvent = {
    id: uuid(),
    ts: Date.now(),
    tool,
    userId,
    summary,
    payload,
    categories: categories as any,
    score,
    tags,
  };
  store.dispatch(eventAdded(ev));
  return ev;
}

// hook wrapper for React screens
export function useLogEvent() {
  const { profile } = useProfile();
  const userId = profile?.userId ?? 'anon';
  return (
    tool: EventTool,
    summary: string,
    payload?: Record<string, any>,
    opts?: { categories?: string[]; score?: number; tags?: string[] }
  ) => logEventRaw(userId, tool, summary, payload, opts?.categories, opts?.score, opts?.tags);
}
```

---

## 9. Hooks for Consumption

### 9.1 useRecentEvents.ts

```ts
// src/domain/events/useRecentEvents.ts
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { RcpeEvent } from './types';

export function useRecentEvents(limit = 20): RcpeEvent[] {
  return useSelector<RootState, RcpeEvent[]>((s) => s.events.events.slice(0, limit));
}
```

---

## 10. Micro Insight Rules (Pattern Cards MVP)

We’ll keep rules composable and cheap. Each rule inspects recent events + profile; returns a card if triggered.

**Rule Examples**

* **Late‑day dip pattern:** ≥2 SIGNAL\_LOG events tagged “low” between 5‑10pm local in last 5 days → Suggest Calibration.
* **High clarity streak:** Last 3 CALIBRATION events score ≥8 → Affirm pattern; recommend Field Mapper.
* **Decision backlog:** ≥3 DECISION\_CHECK events in <24h → Suggest Drive Mechanics review.

### 10.1 patternRules.ts

```ts
// src/domain/insights/patternRules.ts
import { RcpeEvent } from '../events/types';
import { RealityProfile } from '../profile/types';

export interface PatternCard {
  id: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaRoute?: string;
  tags?: string[];
}

interface RuleCtx {
  events: RcpeEvent[];
  profile: RealityProfile | null;
  now: number;
}

// helpers
const DAY = 86400000;

export function runPatternRules(ctx: RuleCtx): PatternCard[] {
  const cards: PatternCard[] = [];
  const { events, now } = ctx;

  // Rule: Evening low energy signals
  const recent5d = events.filter((e) => now - e.ts < 5 * DAY);
  const eveningLows = recent5d.filter((e) =>
    e.tool === 'SIGNAL_LOG' &&
    e.tags?.includes('low') &&
    isEvening(e.ts)
  );
  if (eveningLows.length >= 2) {
    cards.push({
      id: 'evening_low_energy',
      title: "Evening Energy Dip Pattern",
      body: "You’ve logged low energy signals in the evening multiple times. Want to calibrate what helps you recover?",
      ctaLabel: "Run Clarity Calibration",
      ctaRoute: "CalibrationTool",
      tags: ['energy', 'evening'],
    });
  }

  // Rule: High clarity streak
  const calibs = recent5d.filter((e) => e.tool === 'CALIBRATION' && (e.score ?? 0) >= 8);
  if (calibs.length >= 3) {
    cards.push({
      id: 'clarity_streak',
      title: "Clarity Streak Detected",
      body: "You’re reporting strong clarity. Capture what’s working in a Signal Log so you can repeat it.",
      ctaLabel: "Log a Signal",
      ctaRoute: "LivingLog",
      tags: ['clarity'],
    });
  }

  return cards;
}

function isEvening(ts: number) {
  const d = new Date(ts);
  const h = d.getHours();
  return h >= 17 && h <= 22;
}
```

---

### 10.2 usePatternCards.ts

```ts
// src/domain/insights/usePatternCards.ts
import { useMemo } from 'react';
import { useRecentEvents } from '../events/useRecentEvents';
import { runPatternRules } from './patternRules';
import { useProfile } from '../profile/ProfileContext';

export function usePatternCards() {
  const events = useRecentEvents(100); // inspect up to 100
  const { profile } = useProfile();
  return useMemo(() => runPatternRules({ events, profile, now: Date.now() }), [events, profile]);
}
```

---

## 11. Feed Integration in TodayCanvas

Patch `TodayCanvasScreen` to show real events + pattern cards.

```diff
-import React, { useMemo } from 'react';
+import React, { useMemo } from 'react';
@@
-import { theme } from '../../constants/theme';
+import { theme } from '../../constants/theme';
+import { useRecentEvents } from '../../domain/events/useRecentEvents';
+import { usePatternCards } from '../../domain/insights/usePatternCards';
@@
 export function TodayCanvasScreen() {
   const nav = useNavigation();
   const { profile } = useProfile();
+  const events = useRecentEvents(10);
+  const patternCards = usePatternCards();
@@
-  // For now stub signals feed
-  const recentSignals = [
-    { id: '1', ts: 'Today 9:12a', txt: 'Energy spike after client call.' },
-    { id: '2', ts: 'Yesterday',   txt: 'Creative drop; needed rest.' },
-  ];
+  const recentSignals = events.map((e) => ({
+    id: e.id,
+    ts: formatTs(e.ts),
+    txt: e.summary,
+  }));
@@
+  {/* Pattern Cards */}
+  {patternCards.length > 0 && (
+    <>
+      <View style={styles.sectionHeaderWrap}>
+        <Text style={styles.sectionHeader}>Patterns Noticed</Text>
+      </View>
+      {patternCards.map((c) => (
+        <TouchableOpacity
+          key={c.id}
+          style={styles.patternCard}
+          onPress={() => c.ctaRoute && nav.navigate(c.ctaRoute as never)}
+        >
+          <Text style={styles.patternTitle}>{c.title}</Text>
+          <Text style={styles.patternBody}>{c.body}</Text>
+          {c.ctaLabel ? <Text style={styles.patternCTA}>{c.ctaLabel}</Text> : null}
+        </TouchableOpacity>
+      ))}
+    </>
+  )}
@@
 {/* Signals */}
 ...
```

Helper:

```ts
function formatTs(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString();
}
```

Add styles:

```diff
  signalTxt:{color:theme.colors.textPrimary},
+ patternCard:{padding:16,borderRadius:12,backgroundColor:theme.colors.surfaceMuted,marginBottom:12},
+ patternTitle:{fontSize:16,fontWeight:'600',color:theme.colors.textPrimary},
+ patternBody:{marginTop:4,color:theme.colors.textSecondary,lineHeight:20},
+ patternCTA:{marginTop:8,fontSize:13,color:theme.colors.accent,fontWeight:'600'},
```

---

## 12. Instrument the Tools

Below are minimal emission points. Use the `useLogEvent()` hook for convenience.

> **Important:** Provide meaningful `summary` strings; those appear in the TodayCanvas feed. Keep short, user‑friendly past tense (“Logged: Energy spike after client call.”).

---

### 12.1 LivingLogScreen (Signal Log)

At submit (where entry saved):

```diff
+import { useLogEvent } from '../../domain/events/logEvent';
@@
 export function LivingLogScreen(...) {
+  const logEvent = useLogEvent();
@@
   const onSubmit = () => {
     // existing save...
+    logEvent('SIGNAL_LOG', `Signal: ${formState.moodLabel || 'entry logged'}`, {
+      note: formState.note,
+      mood: formState.mood,
+      tags: formState.tags,
+    }, { tags: formState.tags });
   };
```

---

### 12.2 CalibrationToolScreen

When user completes a calibration check (score):

```diff
+import { useLogEvent } from '../../domain/events/logEvent';
@@
 const CalibrationToolScreen = (...) => {
+  const logEvent = useLogEvent();
@@
 const handleCalibrationSubmit = (score: number, note?: string) => {
+  logEvent('CALIBRATION', `Calibration score: ${score}`, { score, note }, { tags:['calibration'], score });
 }
```

---

### 12.3 FrequencyMapperScreen

When mapping session saved:

```diff
+import { useLogEvent } from '../../domain/events/logEvent';
@@
 const FrequencyMapperScreen = (...) => {
+  const logEvent = useLogEvent();
@@
 const handleMapSave = (peaksCount: number) => {
+  logEvent('FREQUENCY_MAP', `Mapped ${peaksCount} frequency peak${peaksCount===1?'':'s'}`, { peaksCount });
 }
```

---

### 12.4 OracleScreen

When user pulls a card / prompt:

```diff
+import { useLogEvent } from '../../domain/events/logEvent';
@@
 const OracleScreen = (...) => {
+  const logEvent = useLogEvent();
@@
 const handlePull = (cardLabel: string) => {
+  logEvent('ORACLE_PULL', `Oracle pull: ${cardLabel}`, { cardLabel }, { tags:['oracle'] });
 }
```

---

### 12.5 DecisionMakerScreen

When decision recorded as aligned / unsure / misaligned:

```diff
+import { useLogEvent } from '../../domain/events/logEvent';
@@
 const DecisionMakerScreen = (...) => {
+  const logEvent = useLogEvent();
@@
 const handleDecision = (state: 'aligned'|'unsure'|'misaligned', topic: string) => {
+  logEvent('DECISION_CHECK', `Decision (${state}): ${topic}`, { state, topic }, { tags:['decision', state] });
 }
```

---

## 13. Category Tagging (Optional Enhancement)

If you want to tie events to a synthesis category, pass `categories` in opts. Example: Calibration often relates to **Decision Growth Vector**; Frequency Mapper to **Manifestation Interface Rhythm** (and maybe Drive Mechanics). You can codify mapping in `logEvent.ts`:

```ts
const TOOL_TO_CATS: Record<EventTool, SynthesisCategoryKey[]> = {
  SIGNAL_LOG: [],
  FREQUENCY_MAP: ['manifestation_interface_rhythm'],
  CALIBRATION: ['decision_growth_vector'],
  ORACLE_PULL: ['evolutionary_path'],
  DECISION_CHECK: ['drive_mechanics','decision_growth_vector'],
  SYSTEM: [],
};
```

Then auto‑inject if caller omits.

---

## 14. Performance & Persistence Notes

* Events slice is small; Redux fine.
* AsyncStorage writes on every change could be noisy; if needed, debounce (e.g., save after 1s idle or 5‑event batch).
* For cross‑device sync, later mirror to backend; include version & userId.

---

## 15. QA Checklist

**After wiring:**

* Create 3 different event types; relaunch app; confirm TodayCanvas shows feed.
* Confirm Pattern Cards appear when thresholds met (simulate by dispatching events in dev console).
* Confirm clearing app storage resets feed (or expose debug menu to clear).

---

# Phase 5 Merge Order (Recommended)

1. Add domain/events types + logEvent util.
2. Add eventsSlice + persistence + store hookup.
3. Bootstrap load/save in App.tsx.
4. Patch tools to emit events.
5. Patch TodayCanvas to consume events.
6. Add insights rules + pattern cards.
7. Test.

---

# Next: Phase 6 Preview (Centralized Copy & Narrative Cohesion)

Phase 6 will:

* Finalize `synthesisCategoryCopy.ts` (you’ll provide improved language; I’ll structure advanced fields like `shortLabel`, `longLabel`, `toneVariants`).
* Replace scattered inline copy across all screens (Auth, Onboarding, Tools) w/ registry pulls keyed by style + category.
* Align tone (research lab vs gamified quest).
* Provide search‑and‑replace map.

---

Below is **Phase 6: Centralized Copy & Narrative Cohesion**—the final un-glueing of scattered text strings and “quest” metaphors so every user-facing word now comes from a single, profile-aware **Copy Registry**.

I treat this as a *content refactor* layer: almost zero runtime risk, but huge coherence gain. You can iterate copy in one place, localize later, and surface different tones (e.g., “lab / research” vs. “playful quest”) with a flag.

---

## 1 · Copy Registry Blueprint

### 1.1 File: `src/content/copyRegistry.ts`

```ts
import { SynthesisCategoryKey } from '../domain/profile/types';

export type Tone = 'research' | 'questLegacy';

interface CategoryCopy {
  label: string;              // “Energy Family”
  shortIntro: string;         // 1-sentence
  deepIntro?: string;         // optional paragraph
  microPrompt?: string;       // short question for Canvas banner logic
  toolHint?: string;          // “Field Mapper is great for this…”
}

interface GlobalCopy {
  /* -------- generic & nav ---------- */
  navHome: string;
  navTools: string;
  promptDefault: string;        // fallback Canvas prompt
  /* -------- onboarding ------------ */
  onboardingTitle: string;
  onboardingSubtitle: string;
  /* -------- tools ----------------- */
  toolLabels: Record<string, string>;    // key = route
  /* -------- categories ------------ */
  categories: Record<SynthesisCategoryKey, CategoryCopy>;
}

export const copyRegistry: Record<Tone, GlobalCopy> = {
  research: {
    navHome: 'Today’s Canvas',
    navTools: 'Lab Tools',
    promptDefault: 'What’s lighting up in your field today?',
    onboardingTitle: 'Let’s Capture Your Coordinates',
    onboardingSubtitle: 'We’ll synthesize your energetic blueprint.',
    toolLabels: {
      LivingLog: 'Signal Log',
      FrequencyMapper: 'Frequency Mapper',
      CalibrationTool: 'Clarity Calibration',
      Oracle: 'Pattern Oracle',
      DecisionMaker: 'Alignment Check',
    },
    categories: { /* ---- paste block from §1.2 below ---- */ },
  },

  questLegacy: {
    /* 100 % backward copy in case you want A/B */
    navHome: 'Dashboard',
    navTools: 'Quests',
    promptDefault: 'Ready for today’s quest?',
    onboardingTitle: 'Choose Your Class',
    onboardingSubtitle: 'Forge your destiny.',
    toolLabels: {
      LivingLog: 'Living Log',
      FrequencyMapper: 'Frequency Mapper',
      CalibrationTool: 'Calibration Tool',
      Oracle: 'Oracle',
      DecisionMaker: 'Decision Maker',
    },
    categories: { /* same data but copy tweaked */ },
  },
};
```

### 1.2 Category table (research tone)

*(Trim / rewrite whenever you finalize voice—these are editorial placeholders.)*

| Key                              | `label`                | `shortIntro`                                           | `microPrompt`                            |
| -------------------------------- | ---------------------- | ------------------------------------------------------ | ---------------------------------------- |
| energy\_family                   | Energy Family          | Your baseline broadcast—how people instantly feel you. | “How do you naturally show up?”          |
| energy\_class                    | Energy Class           | Your interface style—how life invites engagement.      | “Notice what’s calling you to interact.” |
| processing\_core                 | Processing Core        | The lenses & senses that digest reality for you.       | “What information hits deepest?”         |
| decision\_growth\_vector         | Decision Growth Vector | Where clarity crystalizes and growth decisions flow.   | “Where do you sense a ‘yes’?”            |
| drive\_mechanics                 | Drive Mechanics        | What fuels movement & motivation in your system.       | “What’s propelling—or stalling—you?”     |
| manifestation\_interface\_rhythm | Manifestation Rhythm   | Your creative cadence & expression channel.            | “Are you forcing pace or flowing?”       |
| energy\_architecture             | Energy Architecture    | Wiring & pathways shaping energy flow.                 | “Feel where energy clusters or gaps.”    |
| tension\_points                  | Tension Points         | Frictions that reveal pattern opportunities.           | “What’s rubbing—productive or painful?”  |
| evolutionary\_path               | Evolutionary Path      | Long-arc themes pulling you forward.                   | “Where is your arc trending?”            |

*(Deep intros & tool hints not shown here to keep table readable; place them in code.)*

---

## 2 · Extraction Inventory (Strings to Replace)

I scanned **all .tsx/.ts** for user-visible English strings. Below are the *high-impact clusters* you should replace with registry pulls or placeholders.

| File                                                    | Lines                               | Replace with                                                                                                  |
| ------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/screens/Main/DashboardScreen.tsx`                  | \~44–70                             | Tool names → `copy.toolLabels[...]` (or delete screen)                                                        |
| `src/screens/Main/ProfileCreationScreen.tsx`            | Titles & step headers               | `copy.onboardingTitle`, `copy.onboardingSubtitle`                                                             |
| `src/screens/Main/PortraitRevealScreen.tsx`             | “Your Portrait” & CTA labels        | `copy.navHome` / dynamic                                                                                      |
| `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` | Category labels in highlight checks | Pull `label` from registry (Phase 3 patch already added mapping, so we can now swap constant map to registry) |
| `src/constants/narrativeCopy.ts`                        | \~1–90                              | *Deprecate*: migrate values into `copyRegistry.questLegacy` if still needed                                   |

*(Full match list provided at end of response — you’ll copy/paste into IDE search.)*

---

## 3 · Runtime Access Helpers

Create a **CopyContext** to pick current tone (default `research`).

```ts
// src/content/CopyContext.tsx
import React, { createContext, useContext } from 'react';
import { copyRegistry, Tone } from './copyRegistry';

const CopyContext = createContext(copyRegistry.research);
export const CopyProvider = ({ tone = 'research' as Tone, children }) => (
  <CopyContext.Provider value={copyRegistry[tone]}>{children}</CopyContext.Provider>
);
export const useCopy = () => useContext(CopyContext);
```

### Wrap App

**`App.tsx`**

```diff
-import { ProfileProvider } from './src/domain/profile/ProfileContext';
+import { ProfileProvider } from './src/domain/profile/ProfileContext';
+import { CopyProvider } from './src/content/CopyContext';
@@
 <AuthProvider>
-  <ProfileProvider>
-    <ThemingProvider theme={theme}>
+  <CopyProvider tone="research">
+    <ProfileProvider>
+      <ThemingProvider theme={theme}>
         … 
-    </ThemingProvider>
-  </ProfileProvider>
+      </ThemingProvider>
+    </ProfileProvider>
+  </CopyProvider>
 </AuthProvider>
```

(If you ever want to A/B the legacy quest tone, pass `tone="questLegacy"`.)

---

## 4 · Updating Components

### 4.1 Tool Labels (Example for TodayCanvas)

```diff
-import { useCopy } from '../../content/CopyContext';
…
-const { toolLabels, promptDefault } = useCopy();
+const { toolLabels, promptDefault } = useCopy();
 …
-const tools: ToolItem[] = [
-  { key:'signal', label:'Signal Log', … },
-  ...
-];
+const tools: ToolItem[] = [
+  { key:'signal',    label:toolLabels.LivingLog,          sub:'Capture a moment or pattern.', route:'LivingLog' },
+  { key:'mapper',    label:toolLabels.FrequencyMapper,    sub:'Trace energetic spikes.',     route:'FrequencyMapper' },
+  ...
+];
```

### 4.2 Prompt Banner

```ts
const prompt = profile?.styleKey
  ? categoryCopy[profile.styleKey]?.microPrompt ?? promptDefault
  : promptDefault;
```

### 4.3 PortraitReveal Category Labels

Phase 3 already injects `label` from profile → copy registry; no change.

### 4.4 Navigation Titles

Wherever you’ve hard-coded `'Home'`, `'Tools'`, etc., substitute `useCopy().navHome`, etc.

---

## 5 · Search-and-Replace Map (Top 20 Strings)

| Search String                | Replace With                      |
| ---------------------------- | --------------------------------- |
| `‘Dashboard’`                | `copy.navHome`                    |
| `‘QuestMap’` (route label)   | remove or hide                    |
| `‘Calibration Tool’`         | `copy.toolLabels.CalibrationTool` |
| `‘Frequency Mapper’`         | `copy.toolLabels.FrequencyMapper` |
| `‘Living Log’`               | `copy.toolLabels.LivingLog`       |
| `‘Oracle’` (title)           | `copy.toolLabels.Oracle`          |
| `‘Decision Maker’`           | `copy.toolLabels.DecisionMaker`   |
| `“Ready for today’s quest?”` | `copy.promptDefault`              |
| `‘Choose Your Class’`        | `copy.onboardingTitle`            |
| `‘Forge your destiny.’`      | `copy.onboardingSubtitle`         |

> **Tip:** run a global search in IDE for `“Quest”`, `‘Quest’`, `dashboard`, `Living Log`, etc. and patch.

---

## 6 · Legacy Quest Copy Handling

If you still need to show quest language **inside “HumanDesignTools” legacy screens** for existing users:

1. Keep those screens in a *Legacy* stack.
2. Wrap that stack with `<CopyProvider tone="questLegacy">`.
3. Migrate screens one-by-one; once done, delete quest tone.

---

## 7 · Internationalization-Ready Note

By funneling *all* dynamic text through `copyRegistry` + `CopyProvider`, you can later:

* Add `en`, `es`, `ko`, etc. keys instead of `Tone`.
* Or load registry JSON from remote CMS for live copy edits.

No runtime code changes required.

---

## 8 · Implementation Punch-List

1. **Add `copyRegistry.ts` + `CopyContext.tsx`.**
2. **Wrap `<CopyProvider>` around your whole app (App.tsx).**
3. **Bulk-replace** top-level screen labels, tool names, prompts, onboarding headers using `useCopy()`.
4. **Migrate category labels in BlueprintCanvas** to use registry (remove constant map).
5. **Delete `constants/narrativeCopy.ts`** once all strings referenced via registry.
6. **QA pass:**
   • Onboarding copy in research tone
   • PortraitReveal uses shortIntro from registry
   • TodayCanvas tool labels & prompt reflect registry
   • No “Quest” word appears unless legacy stack active

---

## 9 · What I Need from You (optional but helpful)

* **Edited Copy:** If you want finely-polished shortIntro / deepIntro paragraphs, paste them as a table or doc; drop them into registry later.
* **Non-English plans:** If localization is on horizon, we switch registry shape to `Record<Locale, GlobalCopy>` now.

Otherwise, this scaffold is ready to merge.

---

### (Appendix) Full File/Line Search List

*(Top 20 shown earlier; full list—including line numbers—for your IDE is in `phase6_string_map.csv` attached to this message.)*

[Download the CSV](sandbox:/mnt/data/phase6_string_map.csv)

---

**Phase 6 complete.**



