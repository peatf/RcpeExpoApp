// src/hooks/useMicroQuests.ts
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuestLog } from './useQuestLog';
import { RootState } from '../state/store';

export const useMicroQuests = () => {
  const [showToast, setShowToast] = useState(false);
  const [completedQuestTitle, setCompletedQuestTitle] = useState('');
  const { logAndCompleteMicroQuest } = useQuestLog();

  const microQuests = useSelector((state: RootState) => state.quests.microQuests);

  const completeMicroQuestAction = (action: string) => {
    const quest = microQuests.find((q) => q.action === action);
    if (quest && !quest.isComplete) {
      logAndCompleteMicroQuest(quest.id, quest.title);
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
