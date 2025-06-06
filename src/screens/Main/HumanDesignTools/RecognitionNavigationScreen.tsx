/**
 * @file RecognitionNavigationScreen.tsx
 * @description Screen for the Recognition Navigation tool, for Projectors.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, FlatList } from 'react-native'; // Removed TextInput, Added FlatList
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
import * as recognitionNavigationService from '../../../services/recognitionNavigationService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, Invitation, InvitationPattern, EnvironmentAssessment, RecognitionStrategy, Practice } from '../../../types/humanDesignTools';
import InvitationListItem from './RecognitionNavigationComponents/InvitationListItem'; // Import InvitationListItem

const RecognitionNavigationScreen: React.FC = () => {
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationPatterns, setInvitationPatterns] = useState<InvitationPattern[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentAssessment[]>([]);
  const [strategies, setStrategies] = useState<RecognitionStrategy[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [newInvitationText, setNewInvitationText] = useState('');

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

  const loadProjectorData = useCallback(async () => {
    if (!userAuthority || ![AuthorityType.Emotional, AuthorityType.SelfProjected, AuthorityType.Splenic, AuthorityType.Mental].includes(userAuthority)) {
      return;
    }
    setIsLoadingData(true);
    try {
      const invData = await recognitionNavigationService.getInvitations({ status: "new", timeframe: "30d" });
      setInvitations(invData.invitations.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setInvitationPatterns(invData.patterns);

      const envData = await recognitionNavigationService.getEnvironmentRecognitionAnalytics({ timeframe: "month", sortBy: "recognition" });
      setEnvironments(envData.environments);

      const stratData = await recognitionNavigationService.getPersonalizedRecognitionStrategies({
        focusArea: "attracting invitations",
        authorityType: userAuthority.toString(),
        energyLevel: "medium" // Example
      });
      setStrategies(stratData.strategies);
      setPractices(stratData.practices);

    } catch (error) {
      console.error("Error loading Projector data:", error);
      Alert.alert("Error", "Could not load Recognition Navigation data.");
    }
    setIsLoadingData(false);
  }, [userAuthority]);

  useEffect(() => {
    if (userAuthority) {
      loadProjectorData();
    }
  }, [userAuthority, loadProjectorData]);

  const handleRecordInvitation = async () => {
    if (!newInvitationText.trim()) {
      Alert.alert("Input Needed", "Please describe the invitation.");
      return;
    }
    if (!userAuthority) return;

    const payload: recognitionNavigationService.RecordAndEvaluateInvitationPayload = {
      invitationType: "General", // Can be refined with more UI
      source: { name: "Unknown Source", relationship: "New" }, // Can be refined
      description: newInvitationText,
      timeframe: { receivedAt: new Date().toISOString() },
      initialResponse: { type: "consideration", notes: "Initial capture", energyShift: 0 }
    };
    try {
      const result = await recognitionNavigationService.recordAndEvaluateInvitation(payload);
      if (result.success) {
        Alert.alert("Invitation Recorded", `ID: ${result.invitationId}\nSuggestions: ${result.evaluationSuggestions?.join('\n')}`);
        setNewInvitationText('');
        loadProjectorData(); // Refresh
      } else {
        Alert.alert("Record Failed", "Could not save invitation.");
      }
    } catch (error) {
      Alert.alert("Record Error", "An error occurred.");
    }
  };

  const handleEvaluateInvitation = async (invitationId: string) => {
    // This would typically open a modal/form to gather detailed evaluation input
    Alert.alert("Evaluate Invitation", `Trigger detailed evaluation for ID: ${invitationId}`);
    const payload: recognitionNavigationService.SubmitInvitationEvaluationPayload = {
        invitationId,
        authorityInput: { notes: "Followed my authority process" }, // Placeholder
        alignmentScore: 0.85, // Example
        energy: { investment: 4, return: 7, sustainability: 0.75 }, // Example
        notes: "Feels like a good fit after deeper reflection."
    };
    const result = await recognitionNavigationService.submitInvitationEvaluation(payload);
    if (result.success) {
        Alert.alert("Evaluation Submitted", `Response: ${result.recommendedResponse}`);
        loadProjectorData(); // Refresh list
    } else {
        Alert.alert("Evaluation Failed");
    }
  };


  if (isLoadingAuthority) {
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading authority...</Text></View>;
  }

  const isProjectorAuthority = userAuthority &&
    [AuthorityType.Emotional, AuthorityType.SelfProjected, AuthorityType.Splenic, AuthorityType.Mental].includes(userAuthority);

  if (!isProjectorAuthority) {
    return (
      <View style={styles.centered}>
        <InfoCard title="Recognition Navigation">
          <Text style={styles.messageText}>This tool is designed for Projector types (Emotional, Self-Projected, Splenic, or Mental Authority).</Text>
          <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
        </InfoCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Recognition Navigation</Text>
      <Text style={styles.subHeader}>Authority: {userAuthority}</Text>

      <InfoCard title="Record New Invitation">
        <LogInput onSubmit={setNewInvitationText} placeholder="Describe the invitation..." />
        <Button title="Record Invitation" onPress={handleRecordInvitation} />
      </InfoCard>

      {isLoadingData && <ActivityIndicator style={styles.loader} />}

      <InfoCard title="Invitations">
        {invitations.length > 0 ? (
          <FlatList
            data={invitations}
            renderItem={({item}) => (
              <InvitationListItem
                invitation={item}
                onEvaluate={handleEvaluateInvitation}
                // onViewDetails={(id) => Alert.alert("View Details", `Invitation ID: ${id}`)} // Example
              />
            )}
            keyExtractor={item => item.id}
            scrollEnabled={false} // As it's inside a ScrollView
          />
        ) : (<Text style={styles.emptyStateText}>No invitations recorded yet.</Text>)}
      </InfoCard>

      <InfoCard title="Environment Energy & Recognition">
        {environments.slice(0,3).map(env => (
            <View key={env.id} style={styles.listItem}>
                <Text style={styles.itemTitle}>{env.name} ({env.type})</Text>
                <Text>Recognition Quality: {(env.metrics.recognitionQuality * 100).toFixed(0)}% | Energy Impact: {env.metrics.energyImpact}</Text>
            </View>
        ))}
        {environments.length === 0 && <Text>No environment analytics yet.</Text>}
      </InfoCard>

      <InfoCard title="Recognition Strategies & Practices">
        {strategies.map(s => <InsightDisplay key={s.id} insightText={s.name +": "+ s.description} source={`Energy: ${s.energyRequirement}/10`} />)}
        {practices.map(p => (
            <View key={p.id} style={styles.listItem}>
                <Text style={styles.itemTitle}>{p.name} ({p.category})</Text>
                <Text>Duration: {p.duration} mins, {p.frequency}</Text>
            </View>
        ))}
        {strategies.length === 0 && practices.length === 0 &&<Text>No strategies or practices loaded.</Text>}
      </InfoCard>

       <InfoCard title="Invitation Patterns">
        {invitationPatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${p.confidence.toFixed(2)}`} />)}
        {invitationPatterns.length === 0 && <Text>No invitation patterns detected yet.</Text>}
      </InfoCard>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fcfdff', // Very light blue/off-white
  },
  container: {
    flex: 1,
    backgroundColor: '#fcfdff',
  },
  loader: {
    marginVertical: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 5,
    color: '#334d6e', // Projector blue/gray
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 15,
    color: '#5c6ac4', // Projector accent purple/blue
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 24,
    color: '#333',
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 8, // Kept for other list items
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  itemTitle: { // Kept for other list items
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: '#334d6e',
  },
  actions: { // This style is now within InvitationListItem
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#6c757d',
  },
});

export default RecognitionNavigationScreen;
