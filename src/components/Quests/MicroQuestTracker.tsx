// src/components/Quests/MicroQuestTracker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

interface MicroQuestTrackerProps {
  action: string;
}

export const MicroQuestTracker: React.FC<MicroQuestTrackerProps> = ({ action }) => {
  const microQuest = useSelector((state: RootState) =>
    state.quests.microQuests.find((q) => q.action === action)
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
