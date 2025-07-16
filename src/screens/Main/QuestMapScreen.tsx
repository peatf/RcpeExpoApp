// src/screens/Main/QuestMapScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../state/store';
import { Quest } from '../../state/quests/questSlice';

export const QuestMapScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { activeQuests, completedQuests } = useSelector((state: RootState) => state.quests);

  const handleQuestNavigation = (quest: Quest) => {
    switch (quest.id) {
      case '1':
        // @ts-ignore
        navigation.navigate('CalibrationTool');
        break;
      case '2':
        // @ts-ignore
        navigation.navigate('Oracle');
        break;
      default:
        break;
    }
  };

  const renderQuestCard = (quest: Quest) => (
    <TouchableOpacity key={quest.id} style={styles.questCard} onPress={() => handleQuestNavigation(quest)}>
      <Text style={styles.questTitle}>{quest.title}</Text>
      <Text style={styles.questDescription}>{quest.description}</Text>
      <Text style={styles.questType}>{quest.type.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Your Quest Map</Text>
        <Text style={styles.subtitle}>Navigate your journey of self-discovery</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Quests</Text>
        {activeQuests.map(renderQuestCard)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Quests ({completedQuests.length})</Text>
        {completedQuests.slice(0, 3).map(renderQuestCard)}
      </View>

      {/* Personal Symbol placeholder */}
      <View style={styles.personalSymbolContainer}>
        <Text style={styles.personalSymbolText}>Your Journey Symbol</Text>
        <View style={styles.symbolPlaceholder} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, alignItems: 'center' },
  screenTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  section: { margin: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  questCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  questTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  questDescription: { fontSize: 14, color: '#666', marginBottom: 5 },
  questType: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
  personalSymbolContainer: {
    alignItems: 'center',
    marginVertical: 30
  },
  personalSymbolText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  symbolPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 50
  }
});
