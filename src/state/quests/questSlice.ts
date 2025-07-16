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
