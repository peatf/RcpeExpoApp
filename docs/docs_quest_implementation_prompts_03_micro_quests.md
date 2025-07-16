# Task: Everyday Actions as Micro-Quests ✨

## 1. Objective
Transform routine user interactions into small, rewarding micro-quests by wrapping key actions with quest completion tracking, updating contextual labels, and providing immediate visual feedback for quest completion.

## 2. Files to Modify or Create

### Files to Modify:
- `src/screens/Main/HumanDesignTools/LivingLogScreen.tsx`
- `src/screens/Main/CalibrationToolScreen.tsx`
- `src/state/quests/questSlice.ts` (extend existing slice)

### **New Files to be Created:**
- `src/components/Quests/MicroQuestTracker.tsx`
- `src/components/Feedback/QuestCompletionToast.tsx`
- `src/hooks/useMicroQuests.ts`

## 3. Detailed Implementation Steps

### Step 1: Extend the Quest Slice for Micro-Quests
Update `src/state/quests/questSlice.ts` to add micro-quest specific functionality:

```typescript
// Add to existing questSlice.ts
interface MicroQuest {
  id: string;
  title: string;
  description: string;
  action: string; // e.g., 'living_log_entry', 'calibration_complete'
  isComplete: boolean;
  completedAt?: number;
}

// Add to QuestState interface
interface QuestState {
  activeQuests: Quest[];
  completedQuests: Quest[];
  microQuests: MicroQuest[];
  dailyMicroQuests: MicroQuest[];
}

// Add to initialState
const initialState: QuestState = {
  // ... existing state
  microQuests: [
    { 
      id: 'micro_1', 
      title: 'Record Your Experience', 
      description: 'Document your current state in the Living Log',
      action: 'living_log_entry',
      isComplete: false 
    },
    { 
      id: 'micro_2', 
      title: 'Calibrate Your Energy', 
      description: 'Use the Calibration tool to tune your frequency',
      action: 'calibration_complete',
      isComplete: false 
    },
  ],
  dailyMicroQuests: [],
};

// Add new reducers
const questSlice = createSlice({
  // ... existing slice config
  reducers: {
    // ... existing reducers
    completeMicroQuest: (state, action: PayloadAction<string>) => {
      const microQuestId = action.payload;
      const microQuest = state.microQuests.find(q => q.id === microQuestId);
      if (microQuest) {
        microQuest.isComplete = true;
        microQuest.completedAt = Date.now();
      }
    },
    resetDailyMicroQuests: (state) => {
      state.microQuests.forEach(quest => {
        quest.isComplete = false;
        quest.completedAt = undefined;
      });
    },
  },
});

export const { completeQuest, addQuest, completeMicroQuest, resetDailyMicroQuests } = questSlice.actions;
```

### Step 2: Create the MicroQuestTracker Component
Create `src/components/Quests/MicroQuestTracker.tsx`:

```typescript
// src/components/Quests/MicroQuestTracker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

interface MicroQuestTrackerProps {
  action: string;
}

export const MicroQuestTracker: React.FC<MicroQuestTrackerProps> = ({ action }) => {
  const microQuest = useSelector((state: any) => 
    state.quests.microQuests.find((q: any) => q.action === action)
  );

  if (!microQuest || microQuest.isComplete) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.questTitle}>🎯 Micro-Quest: {microQuest.title}</Text>
      <Text style={styles.questDescription}>{microQuest.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  questTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 12,
    color: '#555',
  },
});
```

### Step 3: Create the QuestCompletionToast Component
Create `src/components/Feedback/QuestCompletionToast.tsx`:

```typescript
// src/components/Feedback/QuestCompletionToast.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface QuestCompletionToastProps {
  questTitle: string;
  visible: boolean;
  onHide: () => void;
}

export const QuestCompletionToast: React.FC<QuestCompletionToastProps> = ({ 
  questTitle, 
  visible, 
  onHide 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, fadeAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Quest Complete!</Text>
      <Text style={styles.subtitle}>{questTitle}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
  },
});
```

### Step 4: Create the useMicroQuests Hook
Create `src/hooks/useMicroQuests.ts`:

```typescript
// src/hooks/useMicroQuests.ts
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeMicroQuest } from '../state/quests/questSlice';

export const useMicroQuests = () => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [completedQuestTitle, setCompletedQuestTitle] = useState('');

  const microQuests = useSelector((state: any) => state.quests.microQuests);

  const completeMicroQuestAction = (action: string) => {
    const quest = microQuests.find((q: any) => q.action === action);
    if (quest && !quest.isComplete) {
      dispatch(completeMicroQuest(quest.id));
      setCompletedQuestTitle(quest.title);
      setShowToast(true);
    }
  };

  const hideToast = () => setShowToast(false);

  return {
    completeMicroQuestAction,
    showToast,
    completedQuestTitle,
    hideToast,
    microQuests,
  };
};
```

### Step 5: Update LivingLogScreen
Modify `src/screens/Main/HumanDesignTools/LivingLogScreen.tsx`:

1. Import the new components and hook:
```typescript
import { MicroQuestTracker } from '../../../components/Quests/MicroQuestTracker';
import { QuestCompletionToast } from '../../../components/Feedback/QuestCompletionToast';
import { useMicroQuests } from '../../../hooks/useMicroQuests';
```

2. Add the hook and update the submit logic:
```typescript
const { completeMicroQuestAction, showToast, completedQuestTitle, hideToast } = useMicroQuests();

const handleSubmit = () => {
  // ... existing submit logic
  
  // Complete the micro-quest
  completeMicroQuestAction('living_log_entry');
};
```

3. Update the submit button text:
```typescript
// Change button text from "Save Entry" to "Complete Micro-Quest: Record Your Experience"
```

4. Add the components to the render:
```typescript
return (
  <View style={styles.container}>
    <MicroQuestTracker action="living_log_entry" />
    {/* ... existing content */}
    <QuestCompletionToast 
      questTitle={completedQuestTitle}
      visible={showToast}
      onHide={hideToast}
    />
  </View>
);
```

### Step 6: Update CalibrationToolScreen
Apply the same pattern to `src/screens/Main/CalibrationToolScreen.tsx`:

1. Add the micro-quest tracker for the 'calibration_complete' action
2. Update button text to be quest-themed (e.g., "Complete Calibration Quest")
3. Call `completeMicroQuestAction('calibration_complete')` when calibration is finished
4. Add the QuestCompletionToast component

## 4. Acceptance Criteria

- [ ] The `MicroQuestTracker` component exists at `src/components/Quests/MicroQuestTracker.tsx`
- [ ] The `QuestCompletionToast` component exists at `src/components/Feedback/QuestCompletionToast.tsx`
- [ ] The `useMicroQuests` hook exists at `src/hooks/useMicroQuests.ts`
- [ ] The questSlice includes micro-quest state and `completeMicroQuest` action
- [ ] LivingLogScreen displays a micro-quest tracker when the quest is incomplete
- [ ] LivingLogScreen submit button reads "Complete Micro-Quest: Record Your Experience"
- [ ] CalibrationToolScreen displays a micro-quest tracker when the quest is incomplete
- [ ] CalibrationToolScreen uses quest-themed button text
- [ ] Completing a micro-quest action shows the QuestCompletionToast with appropriate animation
- [ ] The toast disappears automatically after 2.3 seconds (300ms in + 2000ms display + 300ms out)
- [ ] Once a micro-quest is completed, the tracker no longer displays for that action
- [ ] The micro-quest completion is tracked in the Redux state with timestamp
- [ ] Both screens properly integrate the useMicroQuests hook and complete actions on form submission