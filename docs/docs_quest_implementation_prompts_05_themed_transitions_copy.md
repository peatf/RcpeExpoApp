# Task: Themed Transitions & Copy 🎨

## 1. Objective
Inject subtle narrative flair into the app's flow by centralizing all UI text in a quest-themed copy system and implementing gentle, story-like transitions that maintain immersion throughout the user's journey.

## 2. Files to Modify or Create

### Files to Modify:
- `src/navigation/AppNavigator.tsx`
- All screen components that contain UI text (will be updated to use centralized copy)

### **New Files to be Created:**
- `src/constants/narrativeCopy.ts`
- `src/hooks/useNarrativeCopy.ts`
- `src/components/Transitions/QuestTransition.tsx`

## 3. Detailed Implementation Steps

### Step 1: Create Centralized Narrative Copy
Create `src/constants/narrativeCopy.ts`:

```typescript
// src/constants/narrativeCopy.ts
export const narrativeCopy = {
  // Authentication & Onboarding
  auth: {
    signUp: {
      title: "Begin Your Quest",
      subtitle: "Embark on a journey of self-discovery",
      button: "Begin Your Quest",
      footer: "Already on a journey? Continue your path"
    },
    login: {
      title: "Continue Your Journey",
      subtitle: "Welcome back, traveler",
      button: "Continue Your Journey",
      footer: "New to the path? Begin your quest"
    }
  },

  // Navigation & Tabs
  navigation: {
    questMap: "Quest Map",
    questLog: "Quest Log", 
    oracle: "Oracle",
    calibration: "Frequency Tuner",
    livingLog: "Journey Journal",
    profile: "Your Path"
  },

  // Quest Map
  questMap: {
    title: "Your Quest Map",
    subtitle: "Navigate your journey of self-discovery",
    sections: {
      activeQuests: "Active Quests",
      completedQuests: "Completed Quests",
      personalSymbol: "Your Journey Symbol"
    },
    emptyState: {
      title: "Your adventure awaits",
      description: "Complete the onboarding to begin your first quest"
    }
  },

  // Quest Log
  questLog: {
    title: "Quest Log",
    subtitle: "Your chronicle of discovery and growth",
    emptyState: {
      title: "Your Quest Log is Empty",
      description: "Complete quests, make reflections, and interact with tools to see your journey unfold here."
    }
  },

  // Oracle
  oracle: {
    title: "Consult the Oracle",
    subtitle: "Seek wisdom from the depths of knowledge",
    inputPlaceholder: "What guidance do you seek?",
    button: "Seek Wisdom",
    responsePrefix: "The Oracle reveals:",
    questComplete: "Oracle Consultation Complete"
  },

  // Calibration Tool
  calibration: {
    title: "Frequency Tuner",
    subtitle: "Calibrate your inner resonance",
    description: "Align yourself with your true frequency",
    button: "Begin Calibration",
    completeButton: "Complete Calibration Quest",
    resultPrefix: "Your frequency resonates at:",
    questComplete: "Frequency Calibration Complete"
  },

  // Living Log / Journal
  livingLog: {
    title: "Journey Journal", 
    subtitle: "Record your path of discovery",
    entryPlaceholder: "Document your current experience...",
    titlePlaceholder: "What shall we call this reflection?",
    saveButton: "Complete Micro-Quest: Record Your Experience",
    questComplete: "Experience Recorded"
  },

  // Micro-Quests
  microQuests: {
    prefix: "🎯 Micro-Quest:",
    completionToast: "Quest Complete!",
    tracker: {
      livingLog: {
        title: "Record Your Experience",
        description: "Document your current state in the Journey Journal"
      },
      calibration: {
        title: "Calibrate Your Energy", 
        description: "Use the Frequency Tuner to align your resonance"
      },
      oracle: {
        title: "Seek Wisdom",
        description: "Consult the Oracle for guidance on your path"
      }
    }
  },

  // Onboarding Banners
  onboarding: {
    bannerPrefix: "New Quest: Discover the",
    dismissButton: "Got it",
    descriptions: {
      frequencyMapper: "Explore your energetic landscape and discover resonant frequencies",
      oracle: "Seek ancient wisdom and guidance for your journey ahead", 
      livingLog: "Chronicle your experiences and reflections as you grow"
    }
  },

  // General UI
  common: {
    continue: "Continue",
    next: "Next Quest",
    back: "Return",
    save: "Preserve",
    cancel: "Pause",
    complete: "Complete",
    start: "Begin",
    loading: "Preparing your path...",
    error: "The path seems unclear. Please try again.",
    success: "Quest milestone achieved!"
  },

  // Completion & Progress
  completion: {
    questComplete: "Quest Complete!",
    congratulations: "You have taken another step on your journey",
    nextQuestButton: "Discover Next Quest",
    viewProgress: "View Your Progress",
    celebrationMessages: [
      "Your wisdom grows with each step",
      "The path reveals itself to those who walk it",
      "Another milestone on your journey of discovery",
      "Your quest continues to unfold"
    ]
  }
} as const;

export type NarrativeCopyKeys = typeof narrativeCopy;
```

### Step 2: Create useNarrativeCopy Hook
Create `src/hooks/useNarrativeCopy.ts`:

```typescript
// src/hooks/useNarrativeCopy.ts
import { narrativeCopy, NarrativeCopyKeys } from '../constants/narrativeCopy';

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type CopyPath = DeepKeyOf<NarrativeCopyKeys>;

export const useNarrativeCopy = () => {
  const getCopy = (path: CopyPath): string => {
    const keys = path.split('.');
    let current: any = narrativeCopy;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        console.warn(`Copy path not found: ${path}`);
        return path; // Return the path as fallback
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  const getRandomCelebration = (): string => {
    const messages = narrativeCopy.completion.celebrationMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return {
    getCopy,
    getRandomCelebration,
    copy: narrativeCopy // Direct access for complex usage
  };
};
```

### Step 3: Create QuestTransition Component
Create `src/components/Transitions/QuestTransition.tsx`:

```typescript
// src/components/Transitions/QuestTransition.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';

interface QuestTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export const QuestTransition: React.FC<QuestTransitionProps> = ({ 
  children, 
  transitionKey 
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and animate on transition key change
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [transitionKey, fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};
```

### Step 4: Update AppNavigator with Custom Transitions
Modify `src/navigation/AppNavigator.tsx`:

```typescript
// Add to AppNavigator.tsx
import { TransitionPresets } from '@react-navigation/stack';

// Configure gentle transitions for quest-like feel
const questTransitionConfig = {
  ...TransitionPresets.FadeFromBottomAndroid,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 400,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 400,
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height * 0.1, 0],
            }),
          },
        ],
      },
    };
  },
};

// Apply to stack navigator screens
const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...questTransitionConfig,
      }}
    >
      {/* Your screens */}
    </Stack.Navigator>
  );
};
```

### Step 5: Update Screen Components to Use Narrative Copy
Update key screen components to use the narrative copy system. Here are examples:

**SignUpScreen.tsx:**
```typescript
import { useNarrativeCopy } from '../../hooks/useNarrativeCopy';

const SignUpScreen = () => {
  const { getCopy } = useNarrativeCopy();
  
  return (
    <View>
      <Text style={styles.title}>{getCopy('auth.signUp.title')}</Text>
      <Text style={styles.subtitle}>{getCopy('auth.signUp.subtitle')}</Text>
      <Button title={getCopy('auth.signUp.button')} onPress={handleSignUp} />
      <Text style={styles.footer}>{getCopy('auth.signUp.footer')}</Text>
    </View>
  );
};
```

**QuestMapScreen.tsx:**
```typescript
import { useNarrativeCopy } from '../../../hooks/useNarrativeCopy';

const QuestMapScreen = () => {
  const { getCopy } = useNarrativeCopy();
  
  return (
    <View>
      <Text style={styles.title}>{getCopy('questMap.title')}</Text>
      <Text style={styles.subtitle}>{getCopy('questMap.subtitle')}</Text>
      {/* Use getCopy for all text elements */}
    </View>
  );
};
```

### Step 6: Update Navigation Labels
Update `src/navigation/MainTabNavigator.tsx` to use narrative copy:

```typescript
import { useNarrativeCopy } from '../hooks/useNarrativeCopy';

// Inside component:
const { getCopy } = useNarrativeCopy();

// For tab labels:
<Tab.Screen 
  name="QuestMap" 
  component={QuestMapScreen}
  options={{
    tabBarLabel: getCopy('navigation.questMap'),
    // ... other options
  }}
/>
```

### Step 7: Add Transitions to Key Screens
Wrap key screen components with QuestTransition:

```typescript
// Example in any screen component
import { QuestTransition } from '../components/Transitions/QuestTransition';

const SomeScreen = ({ route }) => {
  return (
    <QuestTransition transitionKey={route.key}>
      {/* Screen content */}
    </QuestTransition>
  );
};
```

## 4. Acceptance Criteria

- [ ] The `narrativeCopy.ts` file exists at `src/constants/narrativeCopy.ts` with comprehensive quest-themed copy
- [ ] The `useNarrativeCopy` hook exists at `src/hooks/useNarrativeCopy.ts` with type-safe copy access
- [ ] The `QuestTransition` component exists at `src/components/Transitions/QuestTransition.tsx`
- [ ] AppNavigator implements gentle cross-fade transitions instead of default platform slides
- [ ] SignUpScreen uses "Begin Your Quest" instead of "Sign Up"
- [ ] LoginScreen uses "Continue Your Journey" instead of "Login"
- [ ] All navigation tab labels use quest-themed names from the narrative copy
- [ ] QuestMapScreen uses centralized copy for all text elements
- [ ] QuestLogScreen uses centralized copy for all text elements
- [ ] Oracle, Calibration, and LivingLog screens use quest-themed button text
- [ ] Micro-quest tracker uses copy from the narrativeCopy system
- [ ] Screen transitions have a gentle, story-like feel with 400ms duration
- [ ] All hardcoded UI text is replaced with calls to getCopy() function
- [ ] The copy system supports TypeScript autocompletion for copy paths
- [ ] Random celebration messages are available for quest completions
- [ ] Loading and error states use quest-themed language