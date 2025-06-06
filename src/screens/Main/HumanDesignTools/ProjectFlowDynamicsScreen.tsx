/**
 * @file ProjectFlowDynamicsScreen.tsx
 * @description Screen for the Project Flow Dynamics tool, for Manifesting Generators.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, TextInput, FlatList } from 'react-native';
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import * as projectFlowDynamicsService from '../../../services/projectFlowDynamicsService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, WorkflowPattern, SkipStepPattern, RhythmPattern, FrustrationPoint } from '../../../types/humanDesignTools';
import WorkflowPatternListItem from './ProjectFlowDynamicsComponents/WorkflowPatternListItem';
import SkipStepPatternListItem from './ProjectFlowDynamicsComponents/SkipStepPatternListItem';
import RhythmPatternListItem from './ProjectFlowDynamicsComponents/RhythmPatternListItem';

const ProjectFlowDynamicsScreen: React.FC = () => {
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [workflowPatterns, setWorkflowPatterns] = useState<WorkflowPattern[]>([]);
  const [skipStepPatterns, setSkipStepPatterns] = useState<SkipStepPattern[]>([]);
  const [rhythmPatterns, setRhythmPatterns] = useState<RhythmPattern[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [frustrationPoints, setFrustrationPoints] = useState<FrustrationPoint[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [projectStep, setProjectStep] = useState('');
  const [frustrationNote, setFrustrationNote] = useState('');

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

  const loadMGData = useCallback(async () => {
    // Simplified check for Manifesting Generator (Sacral authority is key)
    // A more robust check would involve specific HD Type if available
    if (userAuthority !== AuthorityType.Sacral && userAuthority !== AuthorityType.Emotional) { // Emotional MGs also have Sacral
      return;
    }
    setIsLoadingData(true);
    try {
      const wfPatternsData = await projectFlowDynamicsService.getWorkflowPatterns({ timeframe: "month" });
      setWorkflowPatterns(wfPatternsData.patterns);
      setInsights(wfPatternsData.insights);
      setFrustrationPoints(wfPatternsData.frustrationPoints);

      const skipStepData = await projectFlowDynamicsService.getSkipStepAnalytics({ effectiveness: "all" });
      setSkipStepPatterns(skipStepData.skipStepPatterns);

      const rhythmData = await projectFlowDynamicsService.getPersonalWorkflowRhythm();
      setRhythmPatterns(rhythmData.rhythmPatterns);

    } catch (error) {
      console.error("Error loading Project Flow Dynamics data:", error);
      Alert.alert("Error", "Could not load Project Flow Dynamics data.");
    }
    setIsLoadingData(false);
  }, [userAuthority]);

  useEffect(() => {
    if (userAuthority) {
      loadMGData();
    }
  }, [userAuthority, loadMGData]);

  const handleRecordStep = async () => {
    if (!projectStep.trim()) {
        Alert.alert("Input Needed", "Please describe the project step.");
        return;
    }
    const payload: projectFlowDynamicsService.RecordSequenceStepPayload = {
        projectId: "mockProject123", // Example
        sequenceStep: projectStep,
        isSkipStep: false, // Determine this through UI later
        energyLevel: 7, // Example
        sacralResponse: "yes", // Example
        context: { projectType: "Creative", collaborators: false, priority: 1, concurrent: true },
        outcomes: {} // Initially empty
    };
    try {
        const result = await projectFlowDynamicsService.recordSequenceStep(payload);
        if (result.success) {
            Alert.alert("Step Recorded", `Sequence ID: ${result.sequenceId}\nSuggestions: ${result.nextStepSuggestions?.join(', ')}`);
            setProjectStep('');
            loadMGData(); // Refresh data
        } else {
            Alert.alert("Record Failed", "Could not save project step.");
        }
    } catch (error) {
        Alert.alert("Record Error", "An error occurred while recording step.");
    }
  };

  const handleRecordFrustration = async () => {
    if (!frustrationNote.trim()) {
        Alert.alert("Input Needed", "Please describe the frustration.");
        return;
    }
    const payload: projectFlowDynamicsService.RecordFrustrationPointPayload = {
        projectId: "mockProject123",
        sequenceStep: "Current task", // Could be more specific
        frustrationLevel: 8, // Example
        blockers: ["Unclear requirements", "Interruptions"],
        context: { projectType: "Creative", environment: "Office", energyLevel: 3, emotionalState: "Stressed" }
    };
     try {
        const result = await projectFlowDynamicsService.recordFrustrationPoint(payload);
        if (result.success) {
            Alert.alert("Frustration Recorded", `Recommendations: ${result.recommendations?.join(', ')}`);
            setFrustrationNote('');
            loadMGData(); // Refresh data
        } else {
            Alert.alert("Record Failed", "Could not save frustration point.");
        }
    } catch (error) {
        Alert.alert("Record Error", "An error occurred while recording frustration.");
    }
  };


  if (isLoadingAuthority) {
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading authority...</Text></View>;
  }

  // Simplified check for MG - primarily Sacral. Refine with actual Type system.
  const isManifestingGenerator = userAuthority === AuthorityType.Sacral || userAuthority === AuthorityType.Emotional;


  if (!isManifestingGenerator) {
    return (
      <View style={styles.centered}>
        <InfoCard title="Project Flow Dynamics">
          <Text style={styles.messageText}>This tool is designed for Manifesting Generators (with Sacral Authority).</Text>
          <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
        </InfoCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Project Flow Dynamics</Text>
      <Text style={styles.subHeader}>Authority Context: {userAuthority}</Text>

      <InfoCard title="Record Project Step">
        <TextInput
            style={styles.input}
            placeholder="Describe current project step/task..."
            value={projectStep}
            onChangeText={setProjectStep}
            multiline
        />
        <Button title="Log Step" onPress={handleRecordStep} />
      </InfoCard>

      <InfoCard title="Record Frustration Point">
        <TextInput
            style={styles.input}
            placeholder="What's causing frustration or a block?"
            value={frustrationNote}
            onChangeText={setFrustrationNote}
            multiline
        />
        <Button title="Log Frustration" onPress={handleRecordFrustration} color="orange" />
      </InfoCard>

      {isLoadingData && <ActivityIndicator style={styles.loader}/>}

      <InfoCard title="Your Workflow Patterns">
        {workflowPatterns.length > 0 ? (
          <FlatList
            data={workflowPatterns}
            renderItem={({ item }) => <WorkflowPatternListItem pattern={item} />}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : <Text style={styles.emptyStateText}>No workflow patterns identified yet.</Text>}
        {insights.map((insight, i) => <InsightDisplay key={`insight-${i}`} insightText={insight} source="Project Flow Analysis" />)}
      </InfoCard>

      <InfoCard title="Skip-Step Analytics">
        {skipStepPatterns.length > 0 ? (
          <FlatList
            data={skipStepPatterns}
            renderItem={({ item }) => <SkipStepPatternListItem pattern={item} />}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : <Text style={styles.emptyStateText}>No skip-step analytics available.</Text>}
      </InfoCard>

      <InfoCard title="Personal Workflow Rhythm">
         {rhythmPatterns.length > 0 ? (
           <FlatList
            data={rhythmPatterns}
            renderItem={({ item }) => <RhythmPatternListItem pattern={item} />}
            keyExtractor={item => item.id}
            scrollEnabled={false}
           />
         ) : <Text style={styles.emptyStateText}>Workflow rhythm data not yet available.</Text>}
      </InfoCard>

      {/* Display Frustration Points (optional, could be many) */}
      {frustrationPoints.length > 0 && (
        <InfoCard title="Recent Frustration Points">
            {frustrationPoints.slice(0,2).map(fp => (
                <View key={fp.id} style={styles.listItem}>
                    <Text style={styles.itemTitle}>Frustration: Level {fp.frustrationLevel} on {new Date(fp.timestamp).toLocaleDateString()}</Text>
                    <Text>Blockers: {fp.blockers.join(', ')}</Text>
                </View>
            ))}
        </InfoCard>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#343a40',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 15,
    color: '#495057',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 24,
    color: '#212529',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  listItem: { // Kept for Frustration Points, or can be removed if those get a dedicated component too
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  itemTitle: { // Kept for Frustration Points
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
      color: '#007bff',
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#6c757d',
  }
});

export default ProjectFlowDynamicsScreen;
