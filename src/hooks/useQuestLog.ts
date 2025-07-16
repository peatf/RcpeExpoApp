// src/hooks/useQuestLog.ts
import { useDispatch, useSelector } from 'react-redux';
import { addQuestLogEntry, completeQuest, completeMicroQuest } from '../state/quests/questSlice';
import { QuestLogEntry } from '../types/questLog';
import { RootState } from '../state/store';

export const useQuestLog = () => {
  const dispatch = useDispatch();
  const questLogEntries = useSelector((state: RootState) => state.quests.questLog.entries);

  const addLogEntry = (entry: Omit<QuestLogEntry, 'id' | 'timestamp'>) => {
    dispatch(addQuestLogEntry(entry));
  };

  const logAndCompleteQuest = (questId: string, questTitle: string, questType: 'main' | 'long-term') => {
    dispatch(completeQuest(questId));
    addLogEntry({
      type: 'quest_completion',
      title: `Completed: ${questTitle}`,
      content: `You have successfully completed the quest: ${questTitle}`,
      relatedQuestId: questId,
      metadata: { questType },
    });
  };

  const logAndCompleteMicroQuest = (questId: string, questTitle: string) => {
    dispatch(completeMicroQuest(questId));
    addLogEntry({
      type: 'micro_quest_completion',
      title: `Completed: ${questTitle}`,
      content: `You have successfully completed the quest: ${questTitle}`,
      relatedQuestId: questId,
      metadata: { questType: 'micro' },
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
    logAndCompleteQuest,
    logAndCompleteMicroQuest,
    logReflection,
    logJournalEntry,
    logOracleInsight,
    logCalibrationResult,
  };
};
