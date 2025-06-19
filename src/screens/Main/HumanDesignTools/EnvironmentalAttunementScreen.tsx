/**
 * @file EnvironmentalAttunementScreen.tsx
 * @description Screen for the Environmental Attunement tool, for Reflectors (Lunar Authority).
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert } from 'react-native'; // Removed TextInput
import OnboardingBanner from '../../../components/OnboardingBanner'; // Import Banner
import useOnboardingBanner from '../../../hooks/useOnboardingBanner'; // Import Hook
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import * as environmentalAttunementService from '../../../services/environmentalAttunementService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, LunarCheckIn, LunarPattern, ClarityWindow, EnvironmentAnalysis, TimingWindow } from '../../../types/humanDesignTools';
import LunarCheckInForm from './EnvironmentalAttunementComponents/LunarCheckInForm'; // Import LunarCheckInForm

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
    setIsLoadingData(true);
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
  }, [userAuthority]);

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
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading authority...</Text></View>;
  }

  if (userAuthority !== AuthorityType.Lunar) {
    return (
      <View style={styles.centered}>
        <InfoCard title="Environmental Attunement">
          <Text style={styles.messageText}>This tool is specifically designed for Reflectors (Lunar Authority).</Text>
          <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
        </InfoCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Lunar Cycle Log"
          description="Welcome, Reflector! Attune to the lunar cycle and understand your environmental influences."
          onDismiss={dismissBanner}
        />
      )}
      <Text style={styles.header}>Environmental Attunement</Text>
      <Text style={styles.subHeader}>Lunar Day: {getMockLunarDay()} (Mock)</Text>

      <InfoCard title="Daily Lunar Check-In">
        <LunarCheckInForm onSubmit={handleCheckInSubmit} currentLunarDay={getMockLunarDay()} />
      </InfoCard>

      {isLoadingData && <ActivityIndicator style={styles.loader} />}

      <InfoCard title="Clarity Windows & Decision Timing">
        {clarityWindows.map((cw, i) => <InsightDisplay key={`cw-${i}`} insightText={`Predicted Clarity Window: Days ${cw.startDay}-${cw.endDay} (Confidence: ${(cw.confidence*100).toFixed(0)}%)`} source={`Recommended for: ${cw.decisionTypes.join(', ')}`} />)}
        {decisionTimingRecs.map((dt, i) => <InsightDisplay key={`dt-${i}`} insightText={`Window: ${new Date(dt.startDate).toLocaleDateString()} - ${new Date(dt.endDate).toLocaleDateString()}`} source={`For important decisions. Suggested environments: ${dt.recommendedEnvironments.join(', ')}`} />)}
        {clarityWindows.length === 0 && decisionTimingRecs.length === 0 && <Text style={styles.emptyStateText}>No timing recommendations yet.</Text>}
      </InfoCard>

      <InfoCard title="Recent Lunar Cycle Insights">
        {lunarPatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Confidence: ${(p.confidence*100).toFixed(0)}%`} />)}
        {lunarPatterns.length === 0 && <Text style={styles.emptyStateText}>No lunar patterns identified yet.</Text>}
      </InfoCard>

      <InfoCard title="Environment Impact">
         {environmentAnalytics.slice(0,2).map(env => ( // Show top 2 for brevity
            <View key={env.id} style={styles.listItem}>
                <Text style={styles.itemTitle}>{env.name} ({env.type})</Text>
                <Text>Wellbeing Impact: {env.impact.wellbeing}, Clarity Impact: {env.impact.clarity}</Text>
            </View>
         ))}
         {environmentAnalytics.length === 0 && <Text style={styles.emptyStateText}>No environment analytics yet.</Text>}
      </InfoCard>

      {/* Placeholder for displaying LunarCheckIn data */}
       <InfoCard title="Recent Check-Ins (Last 2)">
        {lunarCycleData.slice(0,2).map(lc => (
            <View key={lc.id} style={styles.listItem}>
                <Text style={styles.itemTitle}>Day {lc.lunarDay} ({new Date(lc.timestamp).toLocaleDateString()})</Text>
                <Text>Wellbeing: {lc.wellbeing.overall}/10, Clarity: {lc.clarity.level}/10</Text>
                <Text>Notes: {lc.notes || "N/A"}</Text>
            </View>
        ))}
        {lunarCycleData.length === 0 && <Text style={styles.emptyStateText}>No check-ins recorded in this cycle view.</Text>}
      </InfoCard>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f4f6f8' },
  container: { flex: 1, backgroundColor: '#f4f6f8' }, // Light grayish blue
  loader: { marginVertical: 20 },
  header: { fontSize: 26, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 5, color: '#4a5568' }, // Dark Slate Gray
  subHeader: { fontSize: 18, fontWeight: '600', paddingHorizontal: 16, paddingBottom: 15, color: '#718096' },
  messageText: { fontSize: 16, textAlign: 'center', marginVertical: 10, lineHeight: 24, color: '#2d3748' },
  // label, input, inputMulti styles are now in LunarCheckInForm.tsx
  listItem: { paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  itemTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2c5282' },
  emptyStateText: { textAlign: 'center', paddingVertical: 10, color: '#718096' },
});

export default EnvironmentalAttunementScreen;
