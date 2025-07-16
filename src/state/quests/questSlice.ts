// src/state/quests/questSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Quest {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  type: 'main' | 'micro' | 'long-term';
}

interface MicroQuest {
  id: string;
  title: string;
  description: string;
  action: string; // e.g., 'living_log_entry', 'calibration_complete'
  isComplete: boolean;
  completedAt?: number;
}

interface QuestState {
  activeQuests: Quest[];
  completedQuests: Quest[];
  microQuests: MicroQuest[];
  dailyMicroQuests: MicroQuest[];
}

const initialState: QuestState = {
  activeQuests: [
    { id: '1', title: 'Calibrate Your Frequency', description: 'Use the Calibration tool to begin.', isComplete: false, type: 'main' },
    { id: '2', title: 'Consult the Oracle', description: 'Ask the Oracle a question.', isComplete: false, type: 'main' },
  ],
  completedQuests: [],
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
export default questSlice.reducer;
