# UI & Information Architecture Implementation Tasks

## Overview
This document outlines the UI and Information Architecture changes required for the Reality Creation Profile Engine mobile app. These changes focus on improving user experience, navigation, and content organization.

## 1. Drive Mechanics Rename (Requirement ①)

### Task Description
Rename "Your Need Energy" to "Your Drive Mechanics" and remove user-facing placements.

### Technical Implementation
```typescript
// File: src/constants/labels.ts
export const LABELS = {
  // OLD: needEnergy: "Your Need Energy"
  driveM mechanics: "Your Drive Mechanics"
}

// Files to update:
// - src/screens/Main/DriveEnergyScreen.tsx → DriveM mechanicsScreen.tsx
// - src/navigation/types.ts (update route names)
// - src/components/headers/ (update header text)
```

### Acceptance Criteria
- [ ] Header text updated from "Your Need Energy" to "Your Drive Mechanics"
- [ ] No gates or profiles visible in user-facing areas
- [ ] All navigation references updated
- [ ] Route names updated in navigation stack

### Files to Modify
- `src/constants/labels.ts`
- `src/screens/Main/DriveEnergyScreen.tsx`
- `src/navigation/MainTabNavigator.tsx`
- `src/navigation/types.ts`

---

## 2. Type-Specific Base Tools Unification (Requirement ②)

### Task Description
Hide all Type-specific base tools under a unified "Decision-Maker" tab and show only the tool(s) that correspond to the user's HD Type.

### Technical Implementation
```typescript
// File: src/components/DecisionMakerTab.tsx
interface DecisionMakerTabProps {
  userType: HDType;
}

const DecisionMakerTab: React.FC<DecisionMakerTabProps> = ({ userType }) => {
  const getToolsForType = (type: HDType) => {
    switch (type) {
      case 'Generator':
        return ['Response Inventory', 'Sacral Check-In'];
      case 'Projector':
        return ['Invitation Tracker', 'Energy Management'];
      case 'Manifestor':
        return ['Impact Assessment', 'Initiative Tracker'];
      case 'Reflector':
        return ['Lunar Cycle Log', 'Community Pulse'];
      default:
        return [];
    }
  };

  const tools = getToolsForType(userType);
  
  return (
    <View>
      {tools.map(tool => (
        <ToolComponent key={tool} toolName={tool} />
      ))}
    </View>
  );
};
```

### Acceptance Criteria
- [ ] Conditional rendering implemented for each HD Type
- [ ] Only relevant tools show for each Type
- [ ] Unified "Decision-Maker" tab created
- [ ] Testing completed for all Types in dev & prod

### Files to Create/Modify
- `src/components/DecisionMakerTab.tsx` (new)
- `src/screens/Main/BaseToolsScreen.tsx`
- `src/navigation/MainTabNavigator.tsx`
- `src/types/humanDesign.ts`

---

## 3. Onboarding Banner Implementation (Requirement ③)

### Task Description
Add an onboarding banner/first-run walkthrough for every base tool (Living Log, Response Inventory, etc.).

### Technical Implementation
```typescript
// File: src/components/OnboardingBanner.tsx
interface OnboardingBannerProps {
  toolName: string;
  description: string;
  onDismiss: () => void;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ 
  toolName, 
  description, 
  onDismiss 
}) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Welcome to {toolName}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
        <Text>Got it</Text>
      </TouchableOpacity>
    </View>
  );
};

// Usage in base tools
const useOnboardingBanner = (toolName: string) => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if banner has been shown for this tool
    const hasSeenOnboarding = async () => {
      const seen = await AsyncStorage.getItem(`onboarding_${toolName}`);
      setShowBanner(!seen);
    };
    hasSeenOnboarding();
  }, [toolName]);

  const dismissBanner = async () => {
    await AsyncStorage.setItem(`onboarding_${toolName}`, 'true');
    setShowBanner(false);
  };

  return { showBanner, dismissBanner };
};
```

### Acceptance Criteria
- [ ] Banner appears once per install for each tool
- [ ] "Got it" button dismisses banner permanently
- [ ] Banner implemented for all base tools:
  - [ ] Living Log
  - [ ] Response Inventory
  - [ ] Invitation Tracker
  - [ ] Energy Management
  - [ ] Impact Assessment
  - [ ] Initiative Tracker
  - [ ] Lunar Cycle Log
  - [ ] Community Pulse

### Files to Create/Modify
- `src/components/OnboardingBanner.tsx` (new)
- `src/hooks/useOnboardingBanner.ts` (new)
- `src/screens/Main/BaseTools/` (all tool screens)

---

## 4. Step Tracker Implementation (Requirement ④)

### Task Description
Add step-tracker ("Step x of y") to Frequency Mapper → Calibration → Oracle flows.

### Technical Implementation
```typescript
// File: src/components/StepTracker.tsx
interface StepTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const StepTracker: React.FC<StepTrackerProps> = ({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < currentStep ? styles.completedDot : styles.pendingDot
            ]}
          />
        ))}
      </View>
      {stepLabels && (
        <Text style={styles.stepLabel}>
          {stepLabels[currentStep - 1]}
        </Text>
      )}
    </View>
  );
};

// Usage in flows
const FLOW_STEPS = {
  FREQUENCY_MAPPER: 3,
  CALIBRATION: 6, // Updated for 6-slider implementation
  ORACLE: 4
};

const STEP_LABELS = {
  FREQUENCY_MAPPER: [
    "Identify Desire",
    "Frequency Mapping", 
    "Crystallization"
  ],
  CALIBRATION: [
    "Belief Assessment",
    "Belief Logic",
    "Openness Assessment", 
    "Openness Acceptance",
    "Worthiness Assessment",
    "Worthiness Receiving"
  ],
  ORACLE: [
    "Quest Selection",
    "Path Choice",
    "Implementation",
    "Reflection"
  ]
};
```

### Acceptance Criteria
- [ ] Persistent header shows current step
- [ ] Progress dots implemented and functional
- [ ] Step tracker appears in:
  - [ ] Frequency Mapper flow (3 steps)
  - [ ] Calibration flow (6 steps)
  - [ ] Oracle flow (4 steps)
- [ ] Visual progress indication working

### Files to Create/Modify
- `src/components/StepTracker.tsx` (new)
- `src/screens/Main/FrequencyMapperScreen.tsx`
- `src/screens/Main/CalibrationToolScreen.tsx`
- `src/screens/Main/OracleScreen.tsx`
- `src/constants/flowSteps.ts` (new)

---

## Implementation Notes

### Testing Requirements
- Test all HD Types (Generator, Projector, Manifestor, Reflector)
- Verify onboarding banners appear only once
- Test step tracking across all flows
- Verify conditional rendering works in both dev and production

### Performance Considerations
- Use React.memo for StepTracker to prevent unnecessary re-renders
- Implement lazy loading for type-specific tools
- Cache onboarding state in AsyncStorage

### Accessibility
- Add proper accessibility labels to all new components
- Ensure step tracker is screen reader friendly
- Test with VoiceOver/TalkBack

### Design System Integration
- Use existing color tokens for progress indicators
- Follow spacing guidelines for banners
- Maintain consistent typography hierarchy
