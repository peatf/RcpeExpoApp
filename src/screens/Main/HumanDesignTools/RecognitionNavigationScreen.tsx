/**
 * @file RecognitionNavigationScreen.tsx
 * @description Screen for the Recognition Navigation tool, for Projectors.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native'; // Added RefreshControl, Removed Button
import OnboardingBanner from '../../../components/OnboardingBanner';
import useOnboardingBanner from '../../../hooks/useOnboardingBanner';
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import { theme } from '../../../constants/theme'; // Import theme
import * as recognitionNavigationService from '../../../services/recognitionNavigationService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, Invitation, InvitationPattern, EnvironmentAssessment, RecognitionStrategy, Practice } from '../../../types/humanDesignTools';
import InvitationListItem from './RecognitionNavigationComponents/InvitationListItem'; // Import InvitationListItem

const RecognitionNavigationScreen: React.FC = () => {
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Invitation Tracker'); // Use Hook
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationPatterns, setInvitationPatterns] = useState<InvitationPattern[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentAssessment[]>([]);
  const [strategies, setStrategies] = useState<RecognitionStrategy[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [newInvitationText, setNewInvitationText] = useState(''); // Used by LogInput's onSubmit
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh

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
  
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProjectorData();
    setIsRefreshing(false);
  }, [loadProjectorData]);

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

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
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading authority...</Text></View>;
  }

  const isProjectorAuthority = userAuthority &&
    [AuthorityType.Emotional, AuthorityType.SelfProjected, AuthorityType.Splenic, AuthorityType.Mental].includes(userAuthority);

  if (!isProjectorAuthority) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>RECOGNITION NAVIGATION</Text>
          </View>
          <InfoCard title="Information">
            <Text style={styles.messageText}>This tool is designed for Projector types.</Text>
            <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
          </InfoCard>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Invitation Tracker"
          description="Welcome, Projector! Track and evaluate invitations to navigate with clarity."
          onDismiss={dismissBanner}
        />
      )}
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>RECOGNITION NAVIGATION</Text>
          <Text style={styles.pageSubtitle}>Authority: {userAuthority}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent}/>}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Record New Invitation">
              <LogInput onSubmit={setNewInvitationText} placeholder="Describe the invitation..." />
              <View style={styles.actionButtonContainer}>
                <StackedButton text="Record Invitation" onPress={handleRecordInvitation} type="rect" />
              </View>
            </InfoCard>

            {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}

            <InfoCard title="Invitations">
              {invitations.length > 0 ? (
                <FlatList
                  data={invitations}
                  renderItem={({item}) => (
                    <InvitationListItem
                      invitation={item}
                      onEvaluate={handleEvaluateInvitation}
                    />
                  )}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (<Text style={styles.emptyStateText}>No invitations recorded yet.</Text>)}
            </InfoCard>

            <InfoCard title="Environment Energy & Recognition">
              {environments.slice(0,3).map(env => (
                  <View key={env.id} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>{env.name} ({env.type})</Text>
                      <Text style={styles.itemText}>Recognition Quality: {(env.metrics.recognitionQuality * 100).toFixed(0)}% | Energy Impact: {env.metrics.energyImpact}</Text>
                  </View>
              ))}
              {environments.length === 0 && !isLoadingData &&<Text style={styles.emptyStateText}>No environment analytics yet.</Text>}
            </InfoCard>

            <InfoCard title="Recognition Strategies & Practices">
              {strategies.map(s => <InsightDisplay key={s.id} insightText={s.name +": "+ s.description} source={`Energy: ${s.energyRequirement}/10`} />)}
              {practices.map(p => (
                  <View key={p.id} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>{p.name} ({p.category})</Text>
                      <Text style={styles.itemText}>Duration: {p.duration} mins, {p.frequency}</Text>
                  </View>
              ))}
              {strategies.length === 0 && practices.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No strategies or practices loaded.</Text>}
            </InfoCard>

            <InfoCard title="Invitation Patterns">
              {invitationPatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${p.confidence.toFixed(2)}`} />)}
              {invitationPatterns.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No invitation patterns detected yet.</Text>}
            </InfoCard>
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

  actionButtonContainer: { // For the button after LogInput
    marginTop: theme.spacing.md,
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
  dataPanelItem: { // For Environment & Practices list items
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
  itemText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize - 2, // Using bodyMedium size but smaller
    color: theme.colors.textSecondary,
  },
  emptyStateText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.md,
    fontStyle: 'italic',
  },
  // Removed old 'centered', 'header', 'subHeader', 'listItem', 'actions' styles.
});

export default RecognitionNavigationScreen;
