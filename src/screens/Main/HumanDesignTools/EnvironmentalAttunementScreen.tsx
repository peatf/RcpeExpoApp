/**
 * @file EnvironmentalAttunementScreen.tsx
 * @description Screen for the Environmental Attunement tool, for Reflectors (Lunar Authority).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native'; // Added RefreshControl
import OnboardingBanner from '../../../components/OnboardingBanner';
import useOnboardingBanner from '../../../hooks/useOnboardingBanner';
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import * as environmentalAttunementService from '../../../services/environmentalAttunementService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, LunarCheckIn, LunarPattern, ClarityWindow, EnvironmentAnalysis, TimingWindow } from '../../../types/humanDesignTools';
import LunarCheckInForm from './EnvironmentalAttunementComponents/LunarCheckInForm';
import { theme } from '../../../constants/theme'; // Import full theme

// Helper to get current lunar day (very simplified mock)
const getMockLunarDay = () => {
  // In a real app, this would involve a proper lunar calculation library
  const dayOfMonth = new Date().getDate();
  return (dayOfMonth % 28) + 1;
};

const EnvironmentalAttunementScreen: React.FC = () => {
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Lunar Cycle Log'); // Use Hook
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [lunarCycleData, setLunarCycleData] = useState<LunarCheckIn[]>([]);
  const [lunarPatterns, setLunarPatterns] = useState<LunarPattern[]>([]);
  const [clarityWindows, setClarityWindows] = useState<ClarityWindow[]>([]);
  const [environmentAnalytics, setEnvironmentAnalytics] = useState<EnvironmentAnalysis[]>([]);
  const [decisionTimingRecs, setDecisionTimingRecs] = useState<TimingWindow[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Check-in form state is now managed by LunarCheckInForm.tsx
  // const [checkInWellbeing, setCheckInWellbeing] = useState('7');
  // const [checkInClarity, setCheckInClarity] = useState('7');
  // const [checkInNotes, setCheckInNotes] = useState('');


  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

  const loadReflectorData = useCallback(async () => {
    if (userAuthority !== AuthorityType.Lunar) {
      return;
    }
    if (!isRefreshing) {
      setIsLoadingData(true);
    }
    try {
      // For a real app, cycleStart would be calculated based on user's first entry or current moon.
      const cycleStartDate = new Date();
      cycleStartDate.setDate(cycleStartDate.getDate() - cycleStartDate.getDate() + 1); // Start of current month as rough mock

      const cycleData = await environmentalAttunementService.getLunarCycleAnalytics({
        cycleStart: cycleStartDate.toISOString(),
        includePatterns: true
      });
      setLunarCycleData(cycleData.cycleData);
      setLunarPatterns(cycleData.patterns);
      setClarityWindows(cycleData.predictedWindows);

      const envData = await environmentalAttunementService.getEnvironmentImpactAnalytics({ timeframe: "current_cycle", sortBy: "wellbeing" });
      setEnvironmentAnalytics(envData.environments);

      const timingData = await environmentalAttunementService.getDecisionTimingRecommendations({
        decisionType: "major_life", importance: 8, timeframe: "next_cycle"
      });
      setDecisionTimingRecs(timingData.recommendedWindows);

    } catch (error) {
      console.error("Error loading Reflector data:", error);
      Alert.alert("Error", "Could not load Environmental Attunement data.");
    }
    setIsLoadingData(false);
    setIsRefreshing(false);
  }, [userAuthority, isRefreshing]);

  useEffect(() => {
    if (userAuthority === AuthorityType.Lunar) {
      loadReflectorData();
    }
  }, [userAuthority, loadReflectorData]);

  const handleCheckInSubmit = async (payload: environmentalAttunementService.RecordLunarCheckInPayload) => {
    try {
      const result = await environmentalAttunementService.recordLunarCheckIn(payload);
      if (result.success) {
        Alert.alert("Check-In Recorded", `ID: ${result.checkInId}\nInsights: ${result.insights?.join(', ')}`);
        loadReflectorData(); // Refresh data after successful check-in
      } else {
        Alert.alert("Record Failed", "Could not save check-in. Please try again.");
      }
    } catch (error) {
      console.error("Error recording check-in from form:", error);
      Alert.alert("Record Error", "An error occurred while recording your check-in.");
    }
  };

  if (isLoadingAuthority) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading authority...</Text></View>;
  }

  if (userAuthority !== AuthorityType.Lunar) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          {/* Adding a title for non-reflectors view */}
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>ENVIRONMENTAL ATTUNEMENT</Text>
          </View>
          <InfoCard title="Information">
            <Text style={styles.messageText}>This tool is specifically designed for Reflectors (Lunar Authority).</Text>
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
          toolName="Lunar Cycle Log"
          description="Welcome, Reflector! Attune to the lunar cycle and understand your environmental influences."
          onDismiss={dismissBanner}
        />
      )}
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>ENVIRONMENTAL ATTUNEMENT</Text>
          <Text style={styles.pageSubtitle}>Lunar Day: {getMockLunarDay()} (Mock)</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadReflectorData} tintColor={theme.colors.accent} />}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Daily Lunar Check-In">
              <LunarCheckInForm onSubmit={handleCheckInSubmit} currentLunarDay={getMockLunarDay()} />
            </InfoCard>

            {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}

            <InfoCard title="Clarity Windows & Decision Timing">
              {clarityWindows.map((cw, i) => <InsightDisplay key={`cw-${i}`} insightText={`Predicted Clarity Window: Days ${cw.startDay}-${cw.endDay} (Confidence: ${(cw.confidence*100).toFixed(0)}%)`} source={`Recommended for: ${cw.decisionTypes.join(', ')}`} />)}
              {decisionTimingRecs.map((dt, i) => <InsightDisplay key={`dt-${i}`} insightText={`Window: ${new Date(dt.startDate).toLocaleDateString()} - ${new Date(dt.endDate).toLocaleDateString()}`} source={`For important decisions. Suggested environments: ${dt.recommendedEnvironments.join(', ')}`} />)}
              {clarityWindows.length === 0 && decisionTimingRecs.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No timing recommendations yet.</Text>}
            </InfoCard>

            <InfoCard title="Recent Lunar Cycle Insights">
              {lunarPatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${(p.confidence*100).toFixed(0)}%`} />)}
              {lunarPatterns.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No lunar patterns identified yet.</Text>}
            </InfoCard>

            <InfoCard title="Environment Impact">
              {environmentAnalytics.slice(0,2).map(env => (
                  <View key={env.id} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>{env.name} ({env.type})</Text>
                      <Text style={styles.itemText}>Wellbeing Impact: {env.impact.wellbeing}, Clarity Impact: {env.impact.clarity}</Text>
                  </View>
              ))}
              {environmentAnalytics.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No environment analytics yet.</Text>}
            </InfoCard>

            <InfoCard title="Recent Check-Ins (Last 2)">
              {lunarCycleData.slice(0,2).map(lc => (
                  <View key={lc.id} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>Day {lc.lunarDay} ({new Date(lc.timestamp).toLocaleDateString()})</Text>
                      <Text style={styles.itemText}>Wellbeing: {lc.wellbeing.overall}/10, Clarity: {lc.clarity.level}/10</Text>
                      <Text style={styles.itemText}>Notes: {lc.notes || "N/A"}</Text>
                  </View>
              ))}
              {lunarCycleData.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No check-ins recorded in this cycle view.</Text>}
            </InfoCard>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  contentWrapper: { flex: 1, padding: theme.spacing.lg },
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
  scrollContent: { flexGrow: 1, paddingBottom: theme.spacing.lg }, // Added paddingBottom
  mainContent: { gap: theme.spacing.xl }, // Use gap for spacing between InfoCards

  loader: { marginVertical: theme.spacing.md },
  loadingContainer: { // Replaces old 'centered' for loading authority
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.bg, // Ensure bg color
  },
  loadingText: { // For "Loading authority..."
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  messageText: { // For "This tool is specifically for Reflectors..."
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    color: theme.colors.textSecondary, // Use textSecondary for less emphasis
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  dataPanelItem: { // New style for .input-panel like items
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm, // Space between items if listed
  },
  itemTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize, // Was labelSmall, making it more readable
    fontWeight: 'bold', // Make title bold
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  itemText: { // For generic text within dataPanelItem
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
  emptyStateText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.md,
    fontStyle: 'italic',
  },
  // Removed old centered, header, subHeader, listItem styles
});

export default EnvironmentalAttunementScreen;
