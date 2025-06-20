/**
 * @file ImpulseIntegrationScreen.tsx
 * @description Screen for the Impulse Integration tool, for Manifestors.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native'; // Added RefreshControl, removed Button
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import * as impulseIntegrationService from '../../../services/impulseIntegrationService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, Impulse, ImpulsePattern, InformStrategy, EnergyPeriod } from '../../../types/humanDesignTools';
import ImpulseListItem from './ImpulseIntegrationComponents/ImpulseListItem';
import { theme } from '../../../constants/theme'; // Import theme

const ImpulseIntegrationScreen: React.FC = () => {
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [impulses, setImpulses] = useState<Impulse[]>([]);
  const [impulsePatterns, setImpulsePatterns] = useState<ImpulsePattern[]>([]);
  const [informStrategies, setInformStrategies] = useState<InformStrategy[]>([]);
  const [energyForecast, setEnergyForecast] = useState<EnergyPeriod[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [newImpulseText, setNewImpulseText] = useState(''); // This is used by LogInput's onSubmit callback
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadManifestorData();
    setIsRefreshing(false);
  }, [loadManifestorData]);

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

  const loadManifestorData = useCallback(async () => {
    if (!userAuthority || ![AuthorityType.Emotional, AuthorityType.Ego, AuthorityType.Splenic].includes(userAuthority)) {
      return;
    }
    setIsLoadingData(true);
    try {
      const libData = await impulseIntegrationService.getImpulseLibrary({ status: "new", timeframe: "30d" });
      setImpulses(libData.impulses.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setImpulsePatterns(libData.patterns);

      const strategyData = await impulseIntegrationService.getPersonalizedInformStrategies({
        stakeholderType: "team", // Example
        impulseScope: "collective", // Example
        authorityType: userAuthority.toString()
      });
      setInformStrategies(strategyData.strategies);

      const forecastData = await impulseIntegrationService.getEnergyForecast({ timeframe: "day" });
      setEnergyForecast(forecastData.energyForecast);

    } catch (error) {
      console.error("Error loading Manifestor data:", error);
      Alert.alert("Error", "Could not load Impulse Integration data.");
    }
    setIsLoadingData(false);
  }, [userAuthority]);

  useEffect(() => {
    if (userAuthority) {
      loadManifestorData();
    }
  }, [userAuthority, loadManifestorData]);

  const handleCaptureImpulse = async () => {
    if (!newImpulseText.trim()) {
      Alert.alert("Input Needed", "Please describe your impulse.");
      return;
    }
    if (!userAuthority) return; // Should be caught by screen conditional render

    const payload: impulseIntegrationService.CaptureImpulsePayload = {
      description: newImpulseText,
      impactScope: "personal", // Default, can be expanded with more UI
      urgencyLevel: 7, // Default
      authorityState: { type: userAuthority.toString(), clarity: 0.5 }, // Example
      // context, etc. can be added
    };
    try {
      const result = await impulseIntegrationService.captureImpulse(payload);
      if (result.success) {
        Alert.alert("Impulse Captured!", `ID: ${result.impulseId}\nTips: ${result.evaluationTips?.join('\n')}`);
        setNewImpulseText('');
        loadManifestorData(); // Refresh
      } else {
        Alert.alert("Capture Failed", "Could not save impulse.");
      }
    } catch (error) {
      Alert.alert("Capture Error", "An error occurred.");
    }
  };

  // Placeholder for evaluate and inform actions
  const handleEvaluateImpulse = async (impulseId: string) => {
    Alert.alert("Evaluate", `Trigger evaluation for impulse ID: ${impulseId}`);
     const payload: impulseIntegrationService.EvaluateImpulsePayload = {
      impulseId,
      authorityInput: { customField: "authority specific data for evaluation" },
      alignmentScore: 80,
      notes: "Feeling good about this one after initial check."
    };
    const result = await impulseIntegrationService.evaluateImpulse(payload);
    if(result.success) loadManifestorData();
  };

  const handleInformAction = async (impulseId: string) => {
    Alert.alert("Inform", `Record informing action for impulse ID: ${impulseId}`);
    const payload: impulseIntegrationService.RecordInformingActionPayload = {
      impulseId,
      stakeholders: ["Team Lead", "Partner"],
      informMethod: "Direct conversation",
      informContent: "Shared my intention to proceed with new project idea.",
      timing: { informedAt: new Date().toISOString() }
    };
    const result = await impulseIntegrationService.recordInformingAction(payload);
     if(result.success) loadManifestorData();
  };


  if (isLoadingAuthority) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading authority...</Text></View>;
  }

  const isManifestorAuthority = userAuthority &&
    [AuthorityType.Emotional, AuthorityType.Ego, AuthorityType.Splenic].includes(userAuthority);

  if (!isManifestorAuthority) {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>IMPULSE INTEGRATION</Text>
          </View>
          <InfoCard title="Information">
            <Text style={styles.messageText}>This tool is designed for Manifestor types (Emotional, Ego, or Splenic Authority).</Text>
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
          <Text style={styles.pageTitle}>IMPULSE INTEGRATION</Text>
          <Text style={styles.pageSubtitle}>Authority: {userAuthority}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent} />}
        >
          <View style={styles.mainContent}>
            <InfoCard title="Capture New Impulse">
              {/* LogInput's onSubmit provides the text, which we set to newImpulseText */}
              <LogInput onSubmit={setNewImpulseText} placeholder="Describe your impulse..."/>
              {/* StackedButton to actually trigger capture with the text stored in newImpulseText */}
              <View style={styles.captureButtonContainer}>
                <StackedButton text="Capture Impulse" onPress={handleCaptureImpulse} type="rect" />
              </View>
            </InfoCard>

            {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}

            <InfoCard title="Recent Impulses">
              {impulses.length > 0 ? (
                <FlatList
                  data={impulses}
                  renderItem={({item}) => (
                    <ImpulseListItem
                      impulse={item}
                      onEvaluate={handleEvaluateImpulse}
                      onInform={handleInformAction}
                    />
                  )}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              ) : (<Text style={styles.emptyStateText}>No impulses captured yet.</Text>)}
            </InfoCard>

            <InfoCard title="Informing Strategies">
              {informStrategies.map(s => <InsightDisplay key={s.id} insightText={s.strategyName +": "+ s.description} source={`Effectiveness: ${s.effectivenessScore*100}%`} />)}
              {informStrategies.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No specific inform strategies loaded yet.</Text>}
            </InfoCard>

            <InfoCard title="Today's Energy Forecast">
              {energyForecast.map(ef => (
                  <View key={ef.startTime} style={styles.dataPanelItem}>
                      <Text style={styles.itemTitle}>Level {ef.energyLevel}/10 (Capacity: {ef.initiationCapacity}/10)</Text>
                      <Text style={styles.itemText}>Activities: {ef.recommendedActivity.join(', ') || 'Rest'}</Text>
                      <Text style={styles.itemText}>Ends: {new Date(ef.endTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
                  </View>
              ))}
              {energyForecast.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No energy forecast available.</Text>}
            </InfoCard>

            <InfoCard title="Impulse Patterns">
              {impulsePatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Category: ${p.category} (Confidence: ${p.confidence.toFixed(2)})`} />)}
              {impulsePatterns.length === 0 && !isLoadingData && <Text style={styles.emptyStateText}>No impulse patterns detected yet.</Text>}
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

  captureButtonContainer: { // To provide margin for the button after LogInput
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
  messageText: { // For "This tool is designed for..."
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  dataPanelItem: { // For Energy Forecast items
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
  // Removed old 'centered', 'header', 'subHeader', 'listItem', 'actions' styles.
});

export default ImpulseIntegrationScreen;
