/**
 * @file ResponseIntelligenceScreen.tsx
 * @description Screen for the Response Intelligence tool, for Generators.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native'; // Removed Button, Added TouchableOpacity, RefreshControl
import OnboardingBanner from '../../../components/OnboardingBanner';
import useOnboardingBanner from '../../../hooks/useOnboardingBanner';
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import { theme } from '../../../constants/theme'; // Import theme
import * as responseIntelligenceService from '../../../services/responseIntelligenceService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, Response as SacralResponseType, ResponsePattern, SatisfactionMetrics, Exercise } from '../../../types/humanDesignTools';
import ResponseListItem from './ResponseIntelligenceComponents/ResponseListItem'; // Import ResponseListItem

const ResponseIntelligenceScreen: React.FC = () => {
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Response Inventory'); // Use Hook
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [responses, setResponses] = useState<SacralResponseType[]>([]);
  const [patterns, setPatterns] = useState<ResponsePattern[]>([]);
  const [satisfactionMetrics, setSatisfactionMetrics] = useState<SatisfactionMetrics | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [questionForFraming, setQuestionForFraming] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadGeneratorData();
    setIsRefreshing(false);
  }, [loadGeneratorData]);

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

  const loadGeneratorData = useCallback(async () => {
    if (userAuthority !== AuthorityType.Sacral && userAuthority !== AuthorityType.Emotional && userAuthority !== AuthorityType.SelfProjected ) {
        // Simplified check: Sacral, Emotional (for EGs), SelfProjected (for SPGs) might use this.
        // This logic will need refinement based on actual HD type system.
      return;
    }
    setIsLoadingData(true);
    try {
      const history = await responseIntelligenceService.getResponseHistory({ timeframe: "30d" });
      setResponses(history.responses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setPatterns(history.patterns);

      const analytics = await responseIntelligenceService.getResponseSatisfactionAnalytics({ timeframe: "90d", includeUnrated: true });
      setSatisfactionMetrics(analytics.satisfactionMetrics);

      const training = await responseIntelligenceService.getResponseTrainingExercises({ focus: "clarity", level: 1 });
      setExercises(training.exercises);

    } catch (error) {
      console.error("Error loading Generator data:", error);
      Alert.alert("Error", "Could not load Response Intelligence data.");
    }
    setIsLoadingData(false);
  }, [userAuthority]);

  useEffect(() => {
    if (userAuthority) {
      loadGeneratorData();
    }
  }, [userAuthority, loadGeneratorData]);

  const handleCaptureResponse = async (responseType: 'yes' | 'no', strength: number) => {
    const payload: responseIntelligenceService.CaptureSacralResponsePayload = {
      question: "Implicitly asked situation", // Placeholder
      responseType,
      responseStrength: strength,
      energy: { before: 5, after: responseType === 'yes' ? 7 : 3, shift: responseType === 'yes' ? 2 : -2 }, // Example
      physical: { sensations: ["feeling"], locations: ["gut"], intensity: strength },
      context: { category: "On-the-fly", environment: "Current", timeOfDay: new Date().getHours().toString(), importance: 5 },
      distortion: { detected: false }
    };
    try {
      const result = await responseIntelligenceService.captureSacralResponse(payload);
      if (result.success) {
        Alert.alert("Response Captured!", `ID: ${result.responseId}`);
        loadGeneratorData(); // Refresh
      } else {
        Alert.alert("Capture Failed", "Could not save response.");
      }
    } catch (error) {
      Alert.alert("Capture Error", "An error occurred.");
    }
  };

  const handleQuestionFraming = async () => {
    if (!questionForFraming.trim()) {
        Alert.alert("Input Needed", "Please enter a question to get framing assistance.");
        return;
    }
    try {
        const result = await responseIntelligenceService.getQuestionFramingAssistance({
            originalQuestion: questionForFraming,
            context: "General life decision",
            importance: 7
        });
        setQuestionForFraming(''); // Clear input
        Alert.alert("Framing Assistance", `Suggestions:\n- ${result.reframedQuestions.join("\n- ")}\nBest Timing: ${result.bestTiming}\nTips: ${result.environmentTips.join(", ")}`);
    } catch (error) {
        Alert.alert("Framing Error", "Could not get assistance.");
    }
  };

  const handleRecordSatisfaction = async (responseId: string, satisfactionLevel: number) => {
    try {
      const result = await responseIntelligenceService.recordSatisfactionFeedback({
        responseId,
        satisfaction: satisfactionLevel,
        notes: `Rated ${satisfactionLevel}/10 via quick buttons.`,
        outcomes: ["Followed response"],
      });
      if (result.success) {
        Alert.alert("Satisfaction Recorded", result.updatedInsights?.join("\n") || "Feedback submitted.");
        loadGeneratorData(); // Refresh to show updated satisfaction
      } else {
        Alert.alert("Feedback Failed", "Could not record satisfaction.");
      }
    } catch (error) {
      Alert.alert("Feedback Error", "An error occurred while recording satisfaction.");
    }
  };

  const renderResponseItem = ({ item }: { item: SacralResponseType }) => (
    <ResponseListItem
      response={item}
      onRecordSatisfaction={handleRecordSatisfaction}
      // onPress={(id) => Alert.alert("Response Pressed", `ID: ${id}`)} // Example onPress
    />
  );

  if (isLoadingAuthority) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading authority...</Text></View>;
  }

  // Conditional rendering based on authority
  // This check might need to be more sophisticated if Manifesting Generators (Emotional or Sacral) are included
  const isGeneratorType = userAuthority === AuthorityType.Sacral ||
                          userAuthority === AuthorityType.Emotional || // For Emotional Generators
                          userAuthority === AuthorityType.SelfProjected; // For Self-Projected Generators (who also have Sacral)
                          // This check needs to be more robust based on a proper Type system (e.g. distinguishing Generator from MG)

  if (!isGeneratorType) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>RESPONSE INTELLIGENCE</Text>
          </View>
          <InfoCard title="Information">
            <Text style={styles.messageText}>This tool is primarily for Generator types with Sacral authority (including Manifesting Generators).</Text>
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
          toolName="Response Inventory"
          description="Discover your Response Intelligence. This tool helps Generators and Manifesting Generators understand their Sacral responses."
          onDismiss={dismissBanner}
        />
      )}
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>RESPONSE INTELLIGENCE</Text>
          <Text style={styles.pageSubtitle}>Authority Context: {userAuthority}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent} />}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Capture Sacral Response">
              <Text style={styles.capturePrompt}>What's your gut response right now?</Text>
              <View style={styles.captureButtons}>
                <TouchableOpacity style={[styles.responseButton, styles.yesButton]} onPress={() => handleCaptureResponse('yes', 8)}>
                  <Text style={styles.responseButtonText}>YES ✔️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.responseButton, styles.noButton]} onPress={() => handleCaptureResponse('no', 8)}>
                  <Text style={styles.responseButtonText}>NO ❌</Text>
                </TouchableOpacity>
              </View>
            </InfoCard>

            <InfoCard title="Question Framing Assist">
              <LogInput onSubmit={setQuestionForFraming} placeholder="Enter question for framing..."/>
              <View style={styles.actionButtonContainer}>
                <StackedButton text="Get Framing Tips" onPress={handleQuestionFraming} type="rect" />
              </View>
            </InfoCard>

            {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}

            <InfoCard title="Recent Responses">
              {responses.length > 0 ? (
                <FlatList
                  data={responses}
                  renderItem={renderResponseItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : <Text style={styles.emptyStateText}>No responses logged yet.</Text>}
            </InfoCard>

            <InfoCard title="Detected Response Patterns">
              {patterns.length > 0 ? patterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${p.confidence.toFixed(2)}`} />)
                                 : !isLoadingData && <Text style={styles.emptyStateText}>No patterns detected yet.</Text>}
            </InfoCard>

            <InfoCard title="Satisfaction Analytics Overview">
              {satisfactionMetrics ?
                <Text style={styles.satisfactionSummaryText}>Overall Satisfaction: {(satisfactionMetrics.overall * 100).toFixed(0)}%</Text>
                                 : !isLoadingData && <Text style={styles.emptyStateText}>No satisfaction data yet.</Text>}
            </InfoCard>

            <InfoCard title="Training Exercises">
              {exercises.length > 0 ? exercises.map(e => (
                  <View key={e.id} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>{e.title} (Focus: {e.focus})</Text>
                      <Text style={styles.itemText}>{e.description}</Text>
                  </View>
              )) : !isLoadingData && <Text style={styles.emptyStateText}>No exercises available for your current focus/level.</Text>}
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
  capturePrompt: {
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary, // More prominent than secondary
    marginBottom: theme.spacing.md,
  },
  captureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.sm,
  },
  responseButton: { // For YES/NO buttons
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: theme.colors.accent, // Or a specific "success" green from theme
  },
  noButton: {
    backgroundColor: theme.colors.base4, // Or a specific "danger" red from theme
  },
  responseButtonText: {
    fontFamily: theme.fonts.mono, // Mono for button text
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: 'bold',
    color: theme.colors.bg, // White text on colored buttons
  },
  actionButtonContainer: { // For StackedButton after LogInput
    marginTop: theme.spacing.md,
  },
  dataPanelItem: { // For Training Exercises list items
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
  },
  satisfactionSummaryText: { // For "Overall Satisfaction: X%"
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    padding: theme.spacing.sm,
  }
  // Removed old 'centered', 'header', 'subHeader', 'input', 'listItem', 'exerciseTitle' styles
});

export default ResponseIntelligenceScreen;
