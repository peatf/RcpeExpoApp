// src/screens/Main/QuestLogScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { QuestLogEntry } from '../../components/QuestLog/QuestLogEntry';
import { useQuestLog } from '../../hooks/useQuestLog';
import { useRoute } from '@react-navigation/native';
import { QuestTransition } from '../../components/Transitions/QuestTransition';
import { useNarrativeCopy } from '../../hooks/useNarrativeCopy';
import { QuestLogEntry as QuestLogEntryType } from '../../types/questLog';

export const QuestLogScreen: React.FC = () => {
  const { questLogEntries } = useQuestLog();
  const { getCopy } = useNarrativeCopy();
  const route = useRoute();

  const renderEntry = ({ item }: { item: QuestLogEntryType }) => (
    <QuestLogEntry entry={item} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{getCopy('questLog.emptyState.title')}</Text>
      <Text style={styles.emptyDescription}>
        {getCopy('questLog.emptyState.description')}
      </Text>
    </View>
  );

  return (
    <QuestTransition transitionKey={route.key}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{getCopy('questLog.title')}</Text>
        <Text style={styles.subtitle}>{getCopy('questLog.subtitle')}</Text>
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
    </QuestTransition>
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
