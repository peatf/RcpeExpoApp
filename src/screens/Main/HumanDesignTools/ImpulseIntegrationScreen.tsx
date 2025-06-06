/**
 * @file ImpulseIntegrationScreen.tsx
 * @description Screen for the Impulse Integration tool, for Manifestors.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, FlatList } from 'react-native'; // Added FlatList, removed TextInput
import { InfoCard, InsightDisplay, LogInput } from '../../../components/HumanDesignTools';
import * as impulseIntegrationService from '../../../services/impulseIntegrationService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, Impulse, ImpulsePattern, InformStrategy, EnergyPeriod } from '../../../types/humanDesignTools';
import ImpulseListItem from './ImpulseIntegrationComponents/ImpulseListItem'; // Import ImpulseListItem

const ImpulseIntegrationScreen: React.FC = () => {
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [impulses, setImpulses] = useState<Impulse[]>([]);
  const [impulsePatterns, setImpulsePatterns] = useState<ImpulsePattern[]>([]);
  const [informStrategies, setInformStrategies] = useState<InformStrategy[]>([]);
  const [energyForecast, setEnergyForecast] = useState<EnergyPeriod[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [newImpulseText, setNewImpulseText] = useState('');

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
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading authority...</Text></View>;
  }

  const isManifestorAuthority = userAuthority &&
    [AuthorityType.Emotional, AuthorityType.Ego, AuthorityType.Splenic].includes(userAuthority);

  if (!isManifestorAuthority) {
    return (
      <View style={styles.centered}>
        <InfoCard title="Impulse Integration">
          <Text style={styles.messageText}>This tool is designed for Manifestor types (Emotional, Ego, or Splenic Authority).</Text>
          <Text style={styles.messageText}>Your detected authority is: {userAuthority || 'Not yet determined'}</Text>
        </InfoCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Impulse Integration</Text>
      <Text style={styles.subHeader}>Authority: {userAuthority}</Text>

      <InfoCard title="Capture New Impulse">
        <LogInput onSubmit={setNewImpulseText} placeholder="Describe your impulse..."/>
        <Button title="Capture Impulse" onPress={handleCaptureImpulse} />
      </InfoCard>

      {isLoadingData && <ActivityIndicator style={styles.loader} />}

      <InfoCard title="Recent Impulses">
        {impulses.length > 0 ? (
          <FlatList
            data={impulses} // Display all statuses, ListItem handles visual cues & actions
            renderItem={({item}) => (
              <ImpulseListItem
                impulse={item}
                onEvaluate={handleEvaluateImpulse}
                onInform={handleInformAction}
                // onViewDetails={(id) => Alert.alert("View Details", `Impulse ID: ${id}`)} // Example
              />
            )}
            keyExtractor={item => item.id}
            scrollEnabled={false} // As it's inside a ScrollView
          />
        ) : (<Text style={styles.emptyStateText}>No impulses captured yet.</Text>)}
      </InfoCard>

      {/* Sections for New and Evaluated impulses are now combined above, using ImpulseListItem's internal logic/display changes based on status */}

      <InfoCard title="Informing Strategies">
        {informStrategies.map(s => <InsightDisplay key={s.id} insightText={s.strategyName +": "+ s.description} source={`Effectiveness: ${s.effectivenessScore*100}%`} />)}
        {informStrategies.length === 0 && <Text>No specific inform strategies loaded yet.</Text>}
      </InfoCard>

      <InfoCard title="Today's Energy Forecast">
         {energyForecast.map(ef => (
            <View key={ef.startTime} style={styles.listItem}>
                <Text style={styles.itemTitle}>Level {ef.energyLevel}/10 (Capacity: {ef.initiationCapacity}/10)</Text>
                <Text>Activities: {ef.recommendedActivity.join(', ') || 'Rest'}</Text>
                <Text>Ends: {new Date(ef.endTime).toLocaleTimeString()}</Text>
            </View>
         ))}
         {energyForecast.length === 0 && <Text>No energy forecast available.</Text>}
      </InfoCard>

       <InfoCard title="Impulse Patterns">
        {impulsePatterns.map(p => <InsightDisplay key={p.id} insightText={p.description} source={`Category: ${p.category} (Confidence: ${p.confidence.toFixed(2)})`} />)}
        {impulsePatterns.length === 0 && <Text>No impulse patterns detected yet.</Text>}
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
    backgroundColor: '#fdfcfe',
  },
  container: {
    flex: 1,
    backgroundColor: '#fdfcfe', // Light, almost white background
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
    color: '#2a2a2a', // Darker text for Manifestor theme
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 15,
    color: '#4a4a4a',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 24,
    color: '#333',
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 8, // Kept for other list items if any
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  itemTitle: { // Kept for other list items if any
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: '#3d3d3d',
  },
  actions: { // This style is now within ImpulseListItem
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: '#6c757d',
  },
});

export default ImpulseIntegrationScreen;
