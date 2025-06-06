/**
 * @file WaveWitnessScreen.tsx
 * @description Screen for the Wave Witness tool, allowing users to track energy rhythms and gain insights.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, RefreshControl } from 'react-native'; // Removed TextInput
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools'; // Adjusted path
import * as waveWitnessService from '../../../services/waveWitnessService'; // Adjusted path
import { EnergyPattern, TimelinePoint, ClarityPrediction, AuthorityType } from '../../../types/humanDesignTools'; // Adjusted path
import CheckInForm from './WaveWitnessComponents/CheckInForm'; // Import CheckInForm

// Mock user authority for service calls that might need it contextually
const MOCK_USER_AUTHORITY = AuthorityType.Emotional;

const WaveWitnessScreen: React.FC = () => {
  // States for energyLevel and checkInNote are now managed by CheckInForm
  const [energyPatterns, setEnergyPatterns] = useState<EnergyPattern[]>([]);
  const [energyInsights, setEnergyInsights] = useState<string[]>([]);
  const [timelinePoints, setTimelinePoints] = useState<TimelinePoint[]>([]);
  const [clarityPredictions, setClarityPredictions] = useState<ClarityPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWaveWitnessData = useCallback(async () => {
    // No change to setIsLoading(true) here, it's fine.
    setIsLoading(true);
    try {
      const patternsData = await waveWitnessService.getEnergyPatterns({ timeframe: "month" });
      setEnergyPatterns(patternsData.patterns);
      setEnergyInsights(patternsData.insights);

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const timelineData = await waveWitnessService.getTimelineData({ startDate: sevenDaysAgo.toISOString(), endDate: today.toISOString(), resolution: "day" });
      setTimelinePoints(timelineData.timelinePoints);

      const predictionsData = await waveWitnessService.getClarityPredictions();
      setClarityPredictions(predictionsData.predictions);

    } catch (error) {
      console.error("Error loading Wave Witness data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadWaveWitnessData();
  }, [loadWaveWitnessData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadWaveWitnessData();
    setIsRefreshing(false);
  }, [loadWaveWitnessData]);

  const handleCheckInSubmit = async (payload: waveWitnessService.RecordCheckInPayload) => {
    try {
      const result = await waveWitnessService.recordCheckIn(payload);
      if (result.success) {
        alert("Check-in recorded!");
        loadWaveWitnessData(); // Refresh data after successful check-in
      } else {
        alert("Failed to record check-in. Please try again.");
      }
    } catch (error) {
      console.error("Error recording check-in from form:", error);
      alert("An error occurred while recording your check-in.");
    }
  };

  // Placeholder for rendering decision outcome recording UI
  const handleRecordDecision = async () => {
    const payload: waveWitnessService.RecordDecisionOutcomePayload = {
      decisionId: `decision_${Date.now()}`, // Mock decision ID
      satisfaction: 8, // Example satisfaction
      notes: "Felt good about this decision, aligned with energy."
    };
    try {
      const result = await waveWitnessService.recordDecisionOutcome(payload);
      if (result.success) {
        alert(`Decision outcome recorded! ${result.updatedInsights ? result.updatedInsights.join(' ') : ''}`);
        // Potentially refresh some data if insights affect displayed patterns
      } else {
        alert("Failed to record decision outcome.");
      }
    } catch (error) {
      alert("Error recording decision outcome.");
    }
  };


  if (isLoading && !isRefreshing && energyPatterns.length === 0) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.header}>Wave Witness</Text>

      <InfoCard title="Record Energy Check-In">
        <CheckInForm onSubmit={handleCheckInSubmit} userAuthority={MOCK_USER_AUTHORITY} />
      </InfoCard>

      <InfoCard title="Energy Patterns & Insights">
        {energyPatterns.map((pattern, index) => (
          <InsightDisplay key={`pattern-${index}`} insightText={pattern.description} source={`Type: ${pattern.patternType} (Confidence: ${pattern.confidence.toFixed(2)})`} />
        ))}
        {energyInsights.map((insight, index) => (
          <InsightDisplay key={`insight-${index}`} insightText={insight} source="Wave Witness Analysis" />
        ))}
        {energyPatterns.length === 0 && energyInsights.length === 0 && <Text>No patterns or insights yet.</Text>}
      </InfoCard>

      <InfoCard title="Clarity Predictions">
        {clarityPredictions.map((prediction, index) => (
          <InsightDisplay
            key={`prediction-${index}`}
            insightText={`Predicted Clarity: ${prediction.clarityLevel * 100}% from ${new Date(prediction.startTime).toLocaleDateString()} to ${new Date(prediction.endTime).toLocaleDateString()}`}
            source={prediction.recommendedUse}
          />
        ))}
        {clarityPredictions.length === 0 && <Text>No clarity predictions available.</Text>}
      </InfoCard>

      <InfoCard title="Recent Timeline Snippet (Last 3 points)">
        {/* This is a placeholder for actual timeline visualization */}
        {timelinePoints.slice(-3).map((point, index) => (
          <Text key={`tl-${index}`} style={styles.timelineText}>
            {new Date(point.timestamp).toLocaleString()}: Energy {point.energyLevel}
          </Text>
        ))}
        {timelinePoints.length === 0 && <Text>No timeline data available.</Text>}
      </InfoCard>

      <InfoCard title="Record Decision Outcome">
         <Button title="Record Example Decision" onPress={handleRecordDecision} />
      </InfoCard>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  loader: {
    marginTop: 50,
  },
  // label and input styles are now in CheckInForm.tsx
  timelineText: {
    fontSize: 14,
    color: '#34495e',
    paddingVertical: 2,
  }
});

export default WaveWitnessScreen;
