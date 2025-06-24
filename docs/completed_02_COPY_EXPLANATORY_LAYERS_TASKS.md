# Copy & Explanatory Layers Implementation Tasks

## Overview
This document outlines the copy updates and explanatory text changes required throughout the Reality Creation Profile Engine app. These changes improve user understanding and provide better context for each screen and feature.

## 1. Screen Explainer Text (Requirement ⑤)

### Task Description
Insert a ≤40-word explainer at the top of each Reflection, Direction, Experience, Essence screen.

### Technical Implementation
```typescript
// File: src/constants/screenExplainers.ts
export const SCREEN_EXPLAINERS = {
  REFLECTION: "Take a moment to reflect on your inner landscape and current state of being.",
  DIRECTION: "Explore the path forward that aligns with your authentic nature and desires.",
  EXPERIENCE: "Notice what's happening in your body, emotions, and energy right now.",
  ESSENCE: "Connect with the core truth of who you are beneath all layers and stories."
};

// File: src/components/ScreenExplainer.tsx
interface ScreenExplainerProps {
  text: string;
  maxWords?: number;
}

const ScreenExplainer: React.FC<ScreenExplainerProps> = ({ 
  text, 
  maxWords = 40 
}) => {
  const wordCount = text.split(' ').length;
  
  if (wordCount > maxWords) {
    console.warn(`Explainer text exceeds ${maxWords} words: ${wordCount}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.explainerText}>{text}</Text>
    </View>
  );
};

// Usage in screens
const ReflectionScreen: React.FC = () => {
  return (
    <ScrollView>
      <ScreenExplainer text={SCREEN_EXPLAINERS.REFLECTION} />
      {/* ...existing content... */}
    </ScrollView>
  );
};
```

### Word Count Validation
Create a test to ensure all explainers stay within the 40-word limit:

```typescript
// File: src/__tests__/screenExplainers.test.ts
import { SCREEN_EXPLAINERS } from '../constants/screenExplainers';

describe('Screen Explainers', () => {
  Object.entries(SCREEN_EXPLAINERS).forEach(([screen, text]) => {
    it(`${screen} explainer should be ≤40 words`, () => {
      const wordCount = text.split(' ').length;
      expect(wordCount).toBeLessThanOrEqual(40);
    });
  });
});
```

### Acceptance Criteria
- [ ] Explainer text present on all required screens
- [ ] Text readable on mobile devices
- [ ] Word count ≤40 for each explainer
- [ ] Consistent styling across screens

### Files to Create/Modify
- `src/constants/screenExplainers.ts` (new)
- `src/components/ScreenExplainer.tsx` (new)
- `src/screens/Main/ReflectionScreen.tsx`
- `src/screens/Main/DirectionScreen.tsx`
- `src/screens/Main/ExperienceScreen.tsx`
- `src/screens/Main/EssenceScreen.tsx`
- `src/__tests__/screenExplainers.test.ts` (new)

---

## 2. "Clearing What Blocks" Rename (Requirement ⑥)

### Task Description
Rename "Clearing What Blocks" → "Releasing Tension" with new description.

### Technical Implementation
```typescript
// File: src/constants/pathDescriptions.ts
export const PATH_DESCRIPTIONS = {
  // OLD: CLEARING_BLOCKS: "Clearing What Blocks"
  RELEASING_TENSION: {
    title: "Releasing Tension",
    description: "This path focuses on transforming inner tension and clarifying misalignments as signals to deepen your standards. Your appreciation for embodied pleasure supports discerning what feels true and expansive. This path honors your Defined Heart's capacity to hold and elevate what matters most."
  }
};

// File: src/screens/Main/PathSelectionScreen.tsx
const PathSelectionScreen: React.FC = () => {
  return (
    <View>
      <PathOption
        title={PATH_DESCRIPTIONS.RELEASING_TENSION.title}
        description={PATH_DESCRIPTIONS.RELEASING_TENSION.description}
        onSelect={() => navigateToPath('RELEASING_TENSION')}
      />
      {/* ...other paths... */}
    </View>
  );
};
```

### Migration Strategy
```typescript
// File: src/utils/pathMigration.ts
export const migrateUserPaths = async () => {
  const storedPaths = await AsyncStorage.getItem('userPaths');
  if (storedPaths) {
    const paths = JSON.parse(storedPaths);
    const updatedPaths = paths.map((path: any) => {
      if (path.type === 'CLEARING_BLOCKS') {
        return { ...path, type: 'RELEASING_TENSION' };
      }
      return path;
    });
    await AsyncStorage.setItem('userPaths', JSON.stringify(updatedPaths));
  }
};
```

### Acceptance Criteria
- [ ] All references to "Clearing What Blocks" updated
- [ ] New description text implemented
- [ ] User data migrated from old path type
- [ ] UI reflects new naming throughout app

### Files to Modify
- `src/constants/pathDescriptions.ts`
- `src/screens/Main/PathSelectionScreen.tsx`
- `src/components/PathOption.tsx`
- `src/types/paths.ts`
- `src/utils/pathMigration.ts` (new)

---

## 3. Calibration Welcome Text (Requirement ⑦)

### Task Description
Update Calibration welcome text to "Now let's calibrate your unique alignment."

### Technical Implementation
```typescript
// File: src/constants/calibrationText.ts
export const CALIBRATION_TEXT = {
  WELCOME: "Now let's calibrate your unique alignment.",
  // ...other calibration text constants
};

// File: src/screens/Main/CalibrationToolScreen.tsx
const CalibrationToolScreen: React.FC = () => {
  return (
    <ScrollView>
      <Text style={styles.welcomeText}>
        {CALIBRATION_TEXT.WELCOME}
      </Text>
      {/* ...existing calibration content... */}
    </ScrollView>
  );
};
```

### Acceptance Criteria
- [ ] Welcome text updated to exact copy
- [ ] Text appears on calibration entry screen
- [ ] Styling consistent with design system

### Files to Modify
- `src/constants/calibrationText.ts`
- `src/screens/Main/CalibrationToolScreen.tsx`

---

## 4. Openness Definition Update (Requirement ⑧)

### Task Description
In Calibration, define Openness as: "willingness to surrender to life, God, the Universe."

### Technical Implementation
```typescript
// File: src/constants/sliderDefinitions.ts
export const SLIDER_DEFINITIONS = {
  BELIEF: {
    title: "Belief",
    definition: "Your confidence in achieving your desired outcome"
  },
  OPENNESS: {
    title: "Openness", 
    definition: "Willingness to surrender to life, God, the Universe"
  },
  WORTHINESS: {
    title: "Worthiness",
    definition: "Your sense of deserving good things and outcomes"
  },
  // New 6-slider definitions
  BELIEF_LOGICAL: {
    title: "Belief Logic",
    definition: "How much receiving your desire makes logical sense to you"
  },
  OPENNESS_ACCEPTANCE: {
    title: "Acceptance",
    definition: "Your acceptance of your current reality and circumstances"
  },
  WORTHINESS_RECEIVING: {
    title: "Receiving Comfort",
    definition: "Your ability to receive while feeling comfortable receiving"
  }
};

// File: src/components/SliderDefinition.tsx
interface SliderDefinitionProps {
  sliderType: keyof typeof SLIDER_DEFINITIONS;
}

const SliderDefinition: React.FC<SliderDefinitionProps> = ({ sliderType }) => {
  const definition = SLIDER_DEFINITIONS[sliderType];
  
  return (
    <View style={styles.definitionContainer}>
      <Text style={styles.definitionText}>{definition.definition}</Text>
    </View>
  );
};
```

### 6-Slider Integration
Since the app now uses 6 sliders, ensure all definitions are properly integrated:

```typescript
// File: src/screens/Main/CalibrationToolScreen.tsx
const renderSliderWithDefinition = (sliderType: string, value: number) => {
  return (
    <View>
      <SliderComponent 
        value={value}
        onValueChange={(newValue) => updateSliderValue(sliderType, newValue)}
      />
      <SliderDefinition sliderType={sliderType as keyof typeof SLIDER_DEFINITIONS} />
    </View>
  );
};

const CalibrationToolScreen: React.FC = () => {
  return (
    <ScrollView>
      <Text>{CALIBRATION_TEXT.WELCOME}</Text>
      
      {/* Original 3 sliders with updated definitions */}
      {renderSliderWithDefinition('BELIEF', sliderValues.belief)}
      {renderSliderWithDefinition('OPENNESS', sliderValues.openness)}
      {renderSliderWithDefinition('WORTHINESS', sliderValues.worthiness)}
      
      {/* New 3 sliders */}
      {renderSliderWithDefinition('BELIEF_LOGICAL', sliderValues.belief_logical)}
      {renderSliderWithDefinition('OPENNESS_ACCEPTANCE', sliderValues.openness_acceptance)}
      {renderSliderWithDefinition('WORTHINESS_RECEIVING', sliderValues.worthiness_receiving)}
    </ScrollView>
  );
};
```

### Acceptance Criteria
- [ ] Openness definition updated to exact text
- [ ] Definition visible in calibration interface
- [ ] All 6 slider definitions properly displayed
- [ ] Definitions help clarify slider purpose

### Files to Create/Modify
- `src/constants/sliderDefinitions.ts` (new)
- `src/components/SliderDefinition.tsx` (new)
- `src/screens/Main/CalibrationToolScreen.tsx`

---

## Implementation Notes

### Content Validation
- All explainer text must be tested on various mobile screen sizes
- Copy should be proofread for clarity and consistency
- Ensure definitions align with the app's philosophical framework

### Localization Preparation
- Store all copy in constants files for easy translation
- Use consistent key naming for translation systems
- Consider cultural sensitivity in spiritual language

### Testing Strategy
- Unit tests for word count validation
- UI tests for text display across devices
- A/B testing for user comprehension

### Performance Considerations
- Pre-load all copy constants at app startup
- Cache translated content if localization is added
- Minimize text re-renders during slider interactions
