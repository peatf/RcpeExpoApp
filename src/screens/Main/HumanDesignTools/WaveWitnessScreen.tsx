/**
 * @file WaveWitnessScreen.tsx
 * @description Screen for the Wave Witness tool, allowing users to track energy rhythms and gain insights.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'; // Removed Button
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import * as waveWitnessService from '../../../services/waveWitnessService';
import { EnergyPattern, TimelinePoint, ClarityPrediction, AuthorityType } from '../../../types/humanDesignTools';
import CheckInForm from './WaveWitnessComponents/CheckInForm';
import { theme } from '../../../constants/theme'; // Import theme
import StackedButton from '../../../components/StackedButton'; // Import StackedButton

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


  if (isLoading && !isRefreshing && energyPatterns.length === 0) { // Initial loading state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading Wave Witness data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>WAVE WITNESS</Text>
          <Text style={styles.pageSubtitle}>Emotional Wave & Energy Tracking</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent} />}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Record Energy Check-In">
              <CheckInForm onSubmit={handleCheckInSubmit} userAuthority={MOCK_USER_AUTHORITY} />
            </InfoCard>

            {isLoading && isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}

            <InfoCard title="Energy Patterns & Insights">
              {energyPatterns.map((pattern, index) => (
                <InsightDisplay key={`pattern-${index}`} insightText={pattern.description} source={`Type: ${pattern.patternType} (Confidence: ${pattern.confidence.toFixed(2)})`} />
              ))}
              {energyInsights.map((insight, index) => (
                <InsightDisplay key={`insight-${index}`} insightText={insight} source="Wave Witness Analysis" />
              ))}
              {!isLoading && energyPatterns.length === 0 && energyInsights.length === 0 && <Text style={styles.emptyStateText}>No patterns or insights yet.</Text>}
            </InfoCard>

            <InfoCard title="Clarity Predictions">
              {clarityPredictions.map((prediction, index) => (
                <InsightDisplay
                  key={`prediction-${index}`}
                  insightText={`Predicted Clarity: ${prediction.clarityLevel * 100}% from ${new Date(prediction.startTime).toLocaleDateString()} to ${new Date(prediction.endTime).toLocaleDateString()}`}
                  source={prediction.recommendedUse}
                />
              ))}
              {!isLoading && clarityPredictions.length === 0 && <Text style={styles.emptyStateText}>No clarity predictions available.</Text>}
            </InfoCard>

            <InfoCard title="Recent Timeline Snippet (Last 3 points)">
              {timelinePoints.slice(-3).map((point, index) => (
                <View key={`tl-${index}`} style={styles.dataPanelItem}>
                  <Text style={styles.itemText}>
                    {new Date(point.timestamp).toLocaleString()}: Energy Level {point.energyLevel}
                  </Text>
                </View>
              ))}
              {!isLoading && timelinePoints.length === 0 && <Text style={styles.emptyStateText}>No timeline data available.</Text>}
            </InfoCard>

            <InfoCard title="Record Decision Outcome">
              <View style={styles.actionButtonContainer}>
                <StackedButton text="Record Example Decision" onPress={handleRecordDecision} type="rect"/>
              </View>
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

  loader: { // For inline loaders within cards
    marginVertical: theme.spacing.md,
  },
  loadingContainer: { // For full screen initial load
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  dataPanelItem: { // For Timeline points
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
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
  actionButtonContainer: { // For StackedButton within InfoCard
    marginTop: theme.spacing.sm,
  }
  // Removed old styles: header, timelineText
});

export default WaveWitnessScreen;
