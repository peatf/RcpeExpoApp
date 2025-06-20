/**
 * @file ProjectFlowDynamicsScreen.tsx
 * @description Screen for the Project Flow Dynamics tool, for Manifesting Generators.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput, FlatList, RefreshControl } from 'react-native'; // Removed Button, Added RefreshControl
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import { theme } from '../../../constants/theme'; // Import theme
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
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh

  // Focus states for new inputs
  const [projectStepFocused, setProjectStepFocused] = useState(false);
  const [frustrationNoteFocused, setFrustrationNoteFocused] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadMGData();
    setIsRefreshing(false);
  }, [loadMGData]);

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
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading authority...</Text></View>;
  }

  const isManifestingGenerator = userAuthority === AuthorityType.Sacral || userAuthority === AuthorityType.Emotional;

  if (!isManifestingGenerator) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>PROJECT FLOW DYNAMICS</Text>
          </View>
          <InfoCard title="Information">
            <Text style={styles.messageText}>This tool is designed for Manifesting Generators (with Sacral or Emotional Authority).</Text>
            <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
          </InfoCard>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>PROJECT FLOW DYNAMICS</Text>
          <Text style={styles.pageSubtitle}>Authority Context: {userAuthority}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent}/>}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Record Project Step">
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Step/Task:</Text>
                <View style={[styles.inputPanel, projectStepFocused && styles.inputPanelFocused]}>
                  <TextInput
                      style={styles.textInput}
                      placeholder="Describe current project step/task..."
                      value={projectStep}
                      onChangeText={setProjectStep}
                      multiline
                      onFocus={() => setProjectStepFocused(true)}
                      onBlur={() => setProjectStepFocused(false)}
                      placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>
              <StackedButton text="Log Step" onPress={handleRecordStep} type="rect" />
            </InfoCard>

            <InfoCard title="Record Frustration Point">
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frustration/Block:</Text>
                <View style={[styles.inputPanel, frustrationNoteFocused && styles.inputPanelFocused]}>
                  <TextInput
                      style={styles.textInput}
                      placeholder="What's causing frustration or a block?"
                      value={frustrationNote}
                      onChangeText={setFrustrationNote}
                      multiline
                      onFocus={() => setFrustrationNoteFocused(true)}
                      onBlur={() => setFrustrationNoteFocused(false)}
                      placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              </View>
              <StackedButton text="Log Frustration" onPress={handleRecordFrustration} type="rect" />
            </InfoCard>

            {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent}/>}

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

            {frustrationPoints.length > 0 && (
              <InfoCard title="Recent Frustration Points">
                  {frustrationPoints.slice(0,2).map(fp => (
                      <View key={fp.id} style={styles.dataPanelItem}>
                          <Text style={styles.itemTitle}>Frustration: Level {fp.frustrationLevel} on {new Date(fp.timestamp).toLocaleDateString()}</Text>
                          <Text style={styles.itemText}>Blockers: {fp.blockers.join(', ')}</Text>
                      </View>
                  ))}
              </InfoCard>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  contentWrapper: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    flexShrink: 0,
  },
  pageTitle: {
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: theme.typography.displayMedium.fontWeight,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: theme.spacing.lg },
  mainContent: { gap: theme.spacing.xl },

  inputGroup: { // Wrapper for Label + InputPanel for the custom inputs on this screen
    marginBottom: theme.spacing.md, // Space before button if button is outside group
  },
  label: { // Label for new step / frustration note
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputPanel: { // Panel around TextInput
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 3,
  },
  textInput: { // TextInput itself
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 15,
    minHeight: 80, // For multiline
    textAlignVertical: 'top',
  },
  loader: {
    marginVertical: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.bg,
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  messageText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  dataPanelItem: { // For Frustration Points list items
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
  },
  itemTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  itemText: { // For text within dataPanelItem
     fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  emptyStateText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.md,
    fontStyle: 'italic',
  }
  // Removed old styles: centered, header, subHeader, input, listItem
});

export default ProjectFlowDynamicsScreen;
