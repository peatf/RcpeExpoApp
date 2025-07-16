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
