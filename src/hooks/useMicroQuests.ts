// src/hooks/useMicroQuests.ts
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeMicroQuest } from '../state/quests/questSlice';
import { RootState } from '../state/store';

export const useMicroQuests = () => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [completedQuestTitle, setCompletedQuestTitle] = useState('');

  const microQuests = useSelector((state: RootState) => state.quests.microQuests);

  const completeMicroQuestAction = (action: string) => {
    const quest = microQuests.find((q) => q.action === action);
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
