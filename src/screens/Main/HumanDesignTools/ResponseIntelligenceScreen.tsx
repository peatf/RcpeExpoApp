/**
 * @file ResponseIntelligenceScreen.tsx
 * @description Screen for the Response Intelligence tool, for Generators.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, FlatList } from 'react-native';
import OnboardingBanner from '../../../components/OnboardingBanner'; // Import Banner
import useOnboardingBanner from '../../../hooks/useOnboardingBanner'; // Import Hook
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
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
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading authority...</Text></View>;
  }

  // Conditional rendering based on authority
  // This check might need to be more sophisticated if Manifesting Generators (Emotional or Sacral) are included
  const isGeneratorType = userAuthority === AuthorityType.Sacral ||
                          userAuthority === AuthorityType.Emotional || // For Emotional Generators
                          userAuthority === AuthorityType.SelfProjected; // For Self-Projected Generators (who also have Sacral)
                          // This check needs to be more robust based on a proper Type system (e.g. distinguishing Generator from MG)

  if (!isGeneratorType) {
    return (
      <View style={styles.centered}>
        <InfoCard title="Response Intelligence">
          <Text style={styles.messageText}>This tool is primarily for Generator types with Sacral authority (including Manifesting Generators).</Text>
          <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
        </InfoCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Response Inventory"
          description="Discover your Response Intelligence. This tool helps Generators and Manifesting Generators understand their Sacral responses."
          onDismiss={dismissBanner}
        />
      )}
      <Text style={styles.header}>Response Intelligence</Text>
      <Text style={styles.subHeader}>Authority Context: {userAuthority}</Text>

      <InfoCard title="Capture Sacral Response">
        <Text style={styles.capturePrompt}>What's your gut response right now?</Text>
        <View style={styles.captureButtons}>
          <Button title="YES ✔️" onPress={() => handleCaptureResponse('yes', 8)} color="#4CAF50" />
          <Button title="NO ❌" onPress={() => handleCaptureResponse('no', 8)} color="#F44336" />
        </View>
        {/* Future: Add strength slider, notes, audio toggle */}
      </InfoCard>

      <InfoCard title="Question Framing Assist">
        <LogInput onSubmit={setQuestionForFraming} placeholder="Enter question for framing..."/>
        <Button title="Get Framing Tips" onPress={handleQuestionFraming} />
      </InfoCard>

      {isLoadingData && <ActivityIndicator style={styles.loader} />}

      <InfoCard title="Recent Responses">
        {responses.length > 0 ? (
          <FlatList
            data={responses}
            renderItem={renderResponseItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Handled by outer ScrollView
          />
        ) : <Text>No responses logged yet.</Text>}
      </InfoCard>

      <InfoCard title="Detected Response Patterns">
        {patterns.length > 0 ? patterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${p.confidence.toFixed(2)}`} />) : <Text>No patterns detected yet.</Text>}
      </InfoCard>

      <InfoCard title="Satisfaction Analytics Overview">
        {satisfactionMetrics ? <Text>Overall Satisfaction: {(satisfactionMetrics.overall * 100).toFixed(0)}%</Text> : <Text>No satisfaction data yet.</Text>}
      </InfoCard>

      <InfoCard title="Training Exercises">
        {exercises.length > 0 ? exercises.map(e => (
            <View key={e.id} style={styles.listItem}>
                <Text style={styles.exerciseTitle}>{e.title} (Focus: {e.focus})</Text>
                <Text>{e.description}</Text>
            </View>
        )) : <Text>No exercises available for your current focus/level.</Text>}
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
    backgroundColor: '#f4f7f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
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
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 10,
    color: '#555',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 24,
    color: '#444',
  },
  capturePrompt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  captureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  listItem: { // General list item style for exercises, etc.
    paddingVertical: 10,
    paddingHorizontal: 5, // Minimal horizontal padding as it's inside a card
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exerciseTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
      color: '#005a9c',
  }
});

export default ResponseIntelligenceScreen;
