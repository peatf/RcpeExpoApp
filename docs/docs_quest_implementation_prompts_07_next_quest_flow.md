# Task: Next-Quest Flow & Ongoing Story ➡️

## 1. Objective
Implement a seamless narrative flow that guides users from one completed quest to the next. Introduce a reusable quest completion modal that celebrates achievements and provides a clear call-to-action to begin the next quest.

## 2. Files to Modify or Create

### Files to Modify:
- `src/screens/Main/OracleScreen.tsx` (and any other screen where a quest can be completed)
- `src/state/quests/questSlice.ts` (ensure completion logic and logging are present)
- `src/screens/Main/QuestMapScreen.tsx` (navigation target for next quest)

### **New Files to be Created:**
- `src/components/Quests/CompletionModal.tsx`

## 3. Detailed Implementation Steps

### Step 1: Create the CompletionModal Component
Create `src/components/Quests/CompletionModal.tsx` with the following stub:

```typescript
// src/components/Quests/CompletionModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface CompletionModalProps {
  visible: boolean;
  title: string;
  message: string;
  onNextQuest: () => void;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible, title, message, onNextQuest, onClose,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="Start Next Quest" onPress={onNextQuest} />
        <Button title="Close" onPress={onClose} color="#888" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', minWidth: 300
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
```

### Step 2: Integrate Completion Flow into Quest Screens
In any screen where a quest can be completed (e.g., `OracleScreen.tsx`), implement the completion flow:

- Import and use the `CompletionModal` component.
- On quest completion, dispatch actions to update quest state and add a Quest Log entry.
- Display the `CompletionModal` with appropriate props.
- On "Start Next Quest", navigate to `QuestMapScreen.tsx` and visually highlight the next quest.

Example logic for `onQuestComplete` (in OracleScreen or similar):

```typescript
// Inside a component like OracleScreen.tsx

const [modalVisible, setModalVisible] = useState(false);

const onQuestComplete = () => {
  // 1. Dispatch action to update quest state in Redux/Zustand
  dispatch(completeQuest(currentQuest.id));

  // 2. Add entry to the unified Quest Log
  dispatch(addQuestLogEntry({
    type: 'quest_completion',
    title: `Completed: ${currentQuest.title}`,
    content: `You have successfully completed the quest: ${currentQuest.title}`,
    relatedQuestId: currentQuest.id,
    metadata: { questType: currentQuest.type },
  }));

  // 3. Show the completion modal
  setModalVisible(true);
};

const handleNextQuest = () => {
  setModalVisible(false);
  navigation.navigate('QuestMap');
  // Optionally, highlight the next quest using questSlice state
};
```

### Step 3: Ensure QuestMapScreen Can Highlight Next Quest
Update `QuestMapScreen.tsx` to accept navigation params or state to visually highlight the next suggested quest after completion.

### Step 4: Extend questSlice if Necessary
Make sure `questSlice` supports tracking which quest is currently "next" or suggested for the user.

## 4. Acceptance Criteria

- [ ] The `CompletionModal` component exists at `src/components/Quests/CompletionModal.tsx`
- [ ] Quest completion in OracleScreen (and other quest screens) triggers the completion modal
- [ ] The modal celebrates the achievement and has a "Start Next Quest" button
- [ ] Clicking "Start Next Quest" navigates the user to `QuestMapScreen.tsx`
- [ ] The next quest is visually highlighted on the Quest Map
- [ ] After closing the modal, it does not immediately reappear unless another quest is completed
- [ ] Quest completion updates quest state and adds an entry to the Quest Log
- [ ] All logic and UI match the narrative-driven flow described in the strategy document