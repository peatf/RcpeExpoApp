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
