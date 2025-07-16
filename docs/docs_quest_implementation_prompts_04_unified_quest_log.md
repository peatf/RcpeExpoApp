# Task: Unified Progress & Reflection Center 📔

## 1. Objective
Create a comprehensive Quest Log that consolidates all user check-ins, reflections, journal entries, and quest completions into a single, chronological timeline that serves as the user's unified progress and reflection center.

## 2. Files to Modify or Create

### Files to Modify:
- `src/screens/Main/OracleScreen.tsx`
- `src/screens/Main/HumanDesignTools/LivingLogScreen.tsx`
- `src/screens/Main/CalibrationToolScreen.tsx`
- `src/navigation/MainTabNavigator.tsx`
- `src/state/quests/questSlice.ts` (extend existing slice)

### **New Files to be Created:**
- `src/screens/Main/QuestLogScreen.tsx`
- `src/types/questLog.ts`
- `src/components/QuestLog/QuestLogEntry.tsx`
- `src/hooks/useQuestLog.ts`

## 3. Detailed Implementation Steps

### Step 1: Define QuestLogEntry Types
Create `src/types/questLog.ts`:

```typescript
// src/types/questLog.ts
export interface QuestLogEntry {
  id: string;
  timestamp: number;
  type: 'quest_completion' | 'reflection' | 'journal_entry' | 'oracle_insight' | 'calibration_result' | 'micro_quest_completion';
  title: string;
  content: string;
  relatedQuestId?: string;
  metadata?: {
    questType?: 'main' | 'micro' | 'long-term';
    toolUsed?: string;
    additionalData?: any;
  };
}

export interface QuestLogState {
  entries: QuestLogEntry[];
  lastUpdated: number;
}
```

### Step 2: Extend Quest Slice for Quest Log
Update `src/state/quests/questSlice.ts` to include quest log functionality:

```typescript
// Add to existing questSlice.ts
import { QuestLogEntry, QuestLogState } from '../../types/questLog';

// Add to QuestState interface
interface QuestState {
  activeQuests: Quest[];
  completedQuests: Quest[];
  microQuests: MicroQuest[];
  dailyMicroQuests: MicroQuest[];
  questLog: QuestLogState;
}

// Add to initialState
const initialState: QuestState = {
  // ... existing state
  questLog: {
    entries: [],
    lastUpdated: Date.now(),
  },
};

// Add new reducers
const questSlice = createSlice({
  // ... existing slice config
  reducers: {
    // ... existing reducers
    addQuestLogEntry: (state, action: PayloadAction<Omit<QuestLogEntry, 'id' | 'timestamp'>>) => {
      const entry: QuestLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...action.payload,
      };
      state.questLog.entries.unshift(entry); // Add to beginning for chronological order
      state.questLog.lastUpdated = Date.now();
    },
    clearQuestLog: (state) => {
      state.questLog.entries = [];
      state.questLog.lastUpdated = Date.now();
    },
  },
});

export const { 
  completeQuest, 
  addQuest, 
  completeMicroQuest, 
  resetDailyMicroQuests,
  addQuestLogEntry,
  clearQuestLog 
} = questSlice.actions;
```

### Step 3: Create QuestLogEntry Component
Create `src/components/QuestLog/QuestLogEntry.tsx`:

```typescript
// src/components/QuestLog/QuestLogEntry.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestLogEntry as QuestLogEntryType } from '../../types/questLog';

interface QuestLogEntryProps {
  entry: QuestLogEntryType;
}

const getEntryIcon = (type: QuestLogEntryType['type']): string => {
  switch (type) {
    case 'quest_completion': return '🏆';
    case 'micro_quest_completion': return '✨';
    case 'reflection': return '🤔';
    case 'journal_entry': return '📝';
    case 'oracle_insight': return '🔮';
    case 'calibration_result': return '⚡';
    default: return '📌';
  }
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
};

export const QuestLogEntry: React.FC<QuestLogEntryProps> = ({ entry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getEntryIcon(entry.type)}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
        </View>
      </View>
      <Text style={styles.content}>{entry.content}</Text>
      {entry.metadata?.questType && (
        <Text style={styles.questType}>{entry.metadata.questType.toUpperCase()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  questType: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});
```

### Step 4: Create useQuestLog Hook
Create `src/hooks/useQuestLog.ts`:

```typescript
// src/hooks/useQuestLog.ts
import { useDispatch, useSelector } from 'react-redux';
import { addQuestLogEntry } from '../state/quests/questSlice';
import { QuestLogEntry } from '../types/questLog';

export const useQuestLog = () => {
  const dispatch = useDispatch();
  const questLogEntries = useSelector((state: any) => state.quests.questLog.entries);

  const addLogEntry = (entry: Omit<QuestLogEntry, 'id' | 'timestamp'>) => {
    dispatch(addQuestLogEntry(entry));
  };

  const logQuestCompletion = (questTitle: string, questType: 'main' | 'micro' | 'long-term', questId?: string) => {
    addLogEntry({
      type: questType === 'micro' ? 'micro_quest_completion' : 'quest_completion',
      title: `Completed: ${questTitle}`,
      content: `You have successfully completed the quest: ${questTitle}`,
      relatedQuestId: questId,
      metadata: { questType },
    });
  };

  const logReflection = (title: string, content: string, toolUsed?: string) => {
    addLogEntry({
      type: 'reflection',
      title,
      content,
      metadata: { toolUsed },
    });
  };

  const logJournalEntry = (title: string, content: string) => {
    addLogEntry({
      type: 'journal_entry',
      title,
      content,
    });
  };

  const logOracleInsight = (question: string, insight: string) => {
    addLogEntry({
      type: 'oracle_insight',
      title: 'Oracle Consultation',
      content: `Question: ${question}\n\nInsight: ${insight}`,
      metadata: { toolUsed: 'Oracle' },
    });
  };

  const logCalibrationResult = (result: string) => {
    addLogEntry({
      type: 'calibration_result',
      title: 'Frequency Calibration',
      content: result,
      metadata: { toolUsed: 'Calibration Tool' },
    });
  };

  return {
    questLogEntries,
    addLogEntry,
    logQuestCompletion,
    logReflection,
    logJournalEntry,
    logOracleInsight,
    logCalibrationResult,
  };
};
```

### Step 5: Create QuestLogScreen
Create `src/screens/Main/QuestLogScreen.tsx`:

```typescript
// src/screens/Main/QuestLogScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { QuestLogEntry } from '../../../components/QuestLog/QuestLogEntry';
import { useQuestLog } from '../../../hooks/useQuestLog';

export const QuestLogScreen: React.FC = () => {
  const { questLogEntries } = useQuestLog();

  const renderEntry = ({ item }: { item: any }) => (
    <QuestLogEntry entry={item} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your Quest Log is Empty</Text>
      <Text style={styles.emptyDescription}>
        Complete quests, make reflections, and interact with tools to see your journey unfold here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Quest Log</Text>
        <Text style={styles.subtitle}>Your chronicle of discovery and growth</Text>
      </View>
      
      <FlatList
        data={questLogEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={questLogEntries.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
```

### Step 6: Update Tool Screens to Log Activities
Modify the existing tool screens to log their activities:

**OracleScreen.tsx:**
```typescript
import { useQuestLog } from '../../hooks/useQuestLog';

// Inside component:
const { logOracleInsight } = useQuestLog();

// When oracle provides insight:
const handleOracleComplete = (question: string, insight: string) => {
  logOracleInsight(question, insight);
  // ... existing completion logic
};
```

**LivingLogScreen.tsx:**
```typescript
import { useQuestLog } from '../../../hooks/useQuestLog';

// Inside component:
const { logJournalEntry } = useQuestLog();

// When user saves entry:
const handleSubmit = (title: string, content: string) => {
  logJournalEntry(title, content);
  // ... existing submit logic
};
```

**CalibrationToolScreen.tsx:**
```typescript
import { useQuestLog } from '../../hooks/useQuestLog';

// Inside component:
const { logCalibrationResult } = useQuestLog();

// When calibration completes:
const handleCalibrationComplete = (result: string) => {
  logCalibrationResult(result);
  // ... existing completion logic
};
```

### Step 7: Add Quest Log to Navigation
Update `src/navigation/MainTabNavigator.tsx`:
1. Import the `QuestLogScreen`
2. Add a new tab called "Quest Log" with an appropriate icon
3. Ensure it's accessible from the main navigation

## 4. Acceptance Criteria

- [ ] The `QuestLogScreen` component exists at `src/screens/Main/QuestLogScreen.tsx`
- [ ] The `QuestLogEntry` component exists at `src/components/QuestLog/QuestLogEntry.tsx`
- [ ] The `useQuestLog` hook exists at `src/hooks/useQuestLog.ts`
- [ ] The `questLog.ts` types file exists at `src/types/questLog.ts`
- [ ] The questSlice includes `addQuestLogEntry` and `clearQuestLog` actions
- [ ] Quest Log screen displays all entries in chronological order (newest first)
- [ ] Each entry shows appropriate icon, title, timestamp, and content
- [ ] OracleScreen logs insights when oracle consultations are completed
- [ ] LivingLogScreen logs journal entries when entries are saved
- [ ] CalibrationToolScreen logs results when calibrations are completed
- [ ] Quest completions (both main and micro) are automatically logged
- [ ] The Quest Log is accessible via main navigation with "Quest Log" tab
- [ ] Empty state is displayed when no entries exist
- [ ] Timestamps show relative time (Today, Yesterday, X days ago)
- [ ] Quest log entries persist in Redux state across app sessions
- [ ] All logging functions work correctly and create properly formatted entries