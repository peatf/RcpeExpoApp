# Task: Onboarding as Narrative Introduction 📜

## 1. Objective
Transform the first user interaction into a narrative-driven quest experience by reframing authentication and welcome screens as the beginning of a personal journey. Implement an onboarding banner system that introduces key tools as quests to new users.

## 2. Files to Modify or Create

### Files to Modify:
- `src/screens/Auth/SignUpScreen.tsx`
- `src/screens/Auth/LoginScreen.tsx`
- `src/screens/Main/WelcomeScreen.tsx`
- `src/screens/Main/FrequencyMapperScreen.tsx`
- `src/screens/Main/OracleScreen.tsx`
- `src/screens/Main/HumanDesignTools/LivingLogScreen.tsx`

### **New Files to be Created:**
- `src/components/Onboarding/OnboardingBanner.tsx`
- `src/hooks/useOnboarding.ts`

## 3. Detailed Implementation Steps

### Step 1: Update Authentication Screen Copy
1. In `SignUpScreen.tsx`, change the main button text from "Sign Up" to "Begin Your Quest"
2. In `LoginScreen.tsx`, change the main button text from "Login" to "Continue Your Journey"
3. Update any supporting text to use quest-themed language

### Step 2: Create the OnboardingBanner Component
Create `src/components/Onboarding/OnboardingBanner.tsx` with the following code:

```typescript
// src/components/Onboarding/OnboardingBanner.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface OnboardingBannerProps {
  toolName: string;
  description: string;
  onDismiss: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ toolName, description, onDismiss }) => (
  <View style={styles.bannerContainer}>
    <Text style={styles.bannerTitle}>New Quest: Discover the {toolName}</Text>
    <Text style={styles.bannerDescription}>{description}</Text>
    <Button title="Got it" onPress={onDismiss} />
  </View>
);

const styles = StyleSheet.create({
  bannerContainer: { padding: 15, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 8 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bannerDescription: { fontSize: 14 },
});
```

### Step 3: Create the useOnboarding Hook
Create `src/hooks/useOnboarding.ts` with the following code:

```typescript
// src/hooks/useOnboarding.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = (toolKey: string) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkBannerStatus = async () => {
      const bannerSeen = await AsyncStorage.getItem(`@banner_seen_${toolKey}`);
      if (!bannerSeen) {
        setShowBanner(true);
      }
    };
    checkBannerStatus();
  }, [toolKey]);

  const dismissBanner = async () => {
    await AsyncStorage.setItem(`@banner_seen_${toolKey}`, 'true');
    setShowBanner(false);
  };

  return { showBanner, dismissBanner };
};
```

### Step 4: Integrate Onboarding Banners in Tool Screens
1. In `FrequencyMapperScreen.tsx`:
   - Import the `OnboardingBanner` component and `useOnboarding` hook
   - Add the hook: `const { showBanner, dismissBanner } = useOnboarding('frequency_mapper');`
   - Render the banner conditionally at the top of the screen with appropriate description

2. In `OracleScreen.tsx`:
   - Follow the same pattern with toolKey `'oracle'`
   - Add appropriate quest-themed description for the Oracle tool

3. In `LivingLogScreen.tsx`:
   - Follow the same pattern with toolKey `'living_log'`
   - Add appropriate quest-themed description for the Living Log

### Step 5: Update WelcomeScreen as Narrative Entry Point
Modify `WelcomeScreen.tsx` to serve as the initial narrative entry point:
- Update copy to introduce the user to their quest journey
- Guide users toward their first quest (likely the "Frequency Mapper")
- Use quest-themed language throughout

## 4. Acceptance Criteria

- [ ] The `OnboardingBanner` component exists at the path `src/components/Onboarding/OnboardingBanner.tsx`
- [ ] The `useOnboarding` hook exists at the path `src/hooks/useOnboarding.ts`
- [ ] SignUpScreen displays "Begin Your Quest" instead of "Sign Up"
- [ ] LoginScreen displays "Continue Your Journey" instead of "Login"
- [ ] When a new user navigates to the `FrequencyMapperScreen`, the onboarding banner is visible
- [ ] When a new user navigates to the `OracleScreen`, the onboarding banner is visible
- [ ] When a new user navigates to the `LivingLogScreen`, the onboarding banner is visible
- [ ] After a user dismisses a banner, it does not reappear for that user on subsequent visits to the same screen
- [ ] The onboarding state is persisted using AsyncStorage with keys like `@banner_seen_frequency_mapper`
- [ ] WelcomeScreen uses quest-themed language and guides users toward their first quest
- [ ] All banner descriptions use appropriate quest-themed language for each tool