# Task: Quest Map Dashboard 🗺️

## 1. Objective
Replace the generic dashboard with a dynamic Quest Map that serves as the central hub of the user's journey, displaying active quests, daily micro-quests, and progress visualization.

## 2. Files to Modify or Create

### Files to Modify:
- `src/navigation/MainTabNavigator.tsx`

### **New Files to be Created:**
- `src/screens/Main/QuestMapScreen.tsx`
- `src/state/quests/questSlice.ts`

## 3. Detailed Implementation Steps

### Step 1: Create the Quest State Management
Create `src/state/quests/questSlice.ts` with the following code:

```typescript
// src/state/quests/questSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quest {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  type: 'main' | 'micro' | 'long-term';
}

interface QuestState {
  activeQuests: Quest[];
  completedQuests: Quest[];
}

const initialState: QuestState = {
  activeQuests: [
    { id: '1', title: 'Calibrate Your Frequency', description: 'Use the Calibration tool to begin.', isComplete: false, type: 'main' },
    { id: '2', title: 'Consult the Oracle', description: 'Ask the Oracle a question.', isComplete: false, type: 'main' },
  ],
  completedQuests: [],
};

const questSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    completeQuest: (state, action: PayloadAction<string>) => {
      const questId = action.payload;
      const quest = state.activeQuests.find(q => q.id === questId);
      if (quest) {
        quest.isComplete = true;
        state.completedQuests.push(quest);
        state.activeQuests = state.activeQuests.filter(q => q.id !== questId);
      }
    },
    addQuest: (state, action: PayloadAction<Omit<Quest, 'isComplete'>>) => {
      const newQuest = { ...action.payload, isComplete: false };
      state.activeQuests.push(newQuest);
    },
    // Add reducers for adding new quests
  },
});

export const { completeQuest, addQuest } = questSlice.actions;
export default questSlice.reducer;
```

### Step 2: Create the QuestMapScreen Component
Create `src/screens/Main/QuestMapScreen.tsx` with the following structure:

```typescript
// src/screens/Main/QuestMapScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
// Import your quest state types and selectors

export const QuestMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { activeQuests, completedQuests } = useSelector(/* your quest state selector */);

  const renderQuestCard = (quest: Quest) => (
    <TouchableOpacity key={quest.id} style={styles.questCard}>
      <Text style={styles.questTitle}>{quest.title}</Text>
      <Text style={styles.questDescription}>{quest.description}</Text>
      <Text style={styles.questType}>{quest.type.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Your Quest Map</Text>
        <Text style={styles.subtitle}>Navigate your journey of self-discovery</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Quests</Text>
        {activeQuests.map(renderQuestCard)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Quests ({completedQuests.length})</Text>
        {completedQuests.slice(0, 3).map(renderQuestCard)}
      </View>

      {/* Personal Symbol placeholder */}
      <View style={styles.personalSymbolContainer}>
        <Text style={styles.personalSymbolText}>Your Journey Symbol</Text>
        <View style={styles.symbolPlaceholder} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, alignItems: 'center' },
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  section: { margin: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  questCard: { 
    backgroundColor: '#f5f5f5', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  questTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  questDescription: { fontSize: 14, color: '#666', marginBottom: 5 },
  questType: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
  personalSymbolContainer: { 
    alignItems: 'center', 
    marginVertical: 30 
  },
  personalSymbolText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  symbolPlaceholder: { 
    width: 100, 
    height: 100, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 50 
  }
});
```

### Step 3: Update Navigation
In `src/navigation/MainTabNavigator.tsx`:
1. Import the new `QuestMapScreen` component
2. Replace the existing "Dashboard" tab with a "Quest Map" tab
3. Update the tab icon and label to reflect the quest theme
4. Point the navigation to the `QuestMapScreen` component

### Step 4: Integrate State Management
If the app doesn't already use Redux Toolkit:
1. Install Redux Toolkit: `npm install @reduxjs/toolkit react-redux`
2. Set up the store configuration to include the questSlice
3. Wrap the app with the Redux Provider

If using a different state management solution (like Zustand):
1. Adapt the questSlice pattern to your chosen state management library
2. Ensure the QuestMapScreen can access and dispatch quest actions

### Step 5: Connect Quest Actions
Add navigation handlers to the quest cards that direct users to the appropriate screens:
- "Calibrate Your Frequency" should navigate to the Calibration tool
- "Consult the Oracle" should navigate to the Oracle screen
- Add more quests as needed for other tools in the app

## 4. Acceptance Criteria

- [ ] The `QuestMapScreen` component exists at the path `src/screens/Main/QuestMapScreen.tsx`
- [ ] The `questSlice` exists at the path `src/state/quests/questSlice.ts`
- [ ] MainTabNavigator displays a "Quest Map" tab instead of "Dashboard"
- [ ] The Quest Map screen displays a list of active quests with titles and descriptions
- [ ] The Quest Map screen shows a count of completed quests
- [ ] The questSlice includes actions for `completeQuest` and `addQuest`
- [ ] Quest cards are visually distinct and display quest type (main/micro/long-term)
- [ ] Tapping on a quest card navigates to the appropriate tool screen
- [ ] The screen includes a placeholder for a personal symbol that can evolve over time
- [ ] The initial state includes at least 2 sample quests as specified in the strategy document
- [ ] The Redux store (or equivalent) is properly configured to include the quest state
- [ ] The QuestMapScreen can read from and dispatch to the quest state