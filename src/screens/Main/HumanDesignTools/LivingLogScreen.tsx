/**
 * @file LivingLogScreen.tsx
 * @description Screen for the Living Log tool, allowing users to log experiences and view patterns.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { OnboardingBanner } from '../../../components/Onboarding/OnboardingBanner';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { MicroQuestTracker } from '../../../components/Quests/MicroQuestTracker';
import { QuestCompletionToast } from '../../../components/Feedback/QuestCompletionToast';
import { useMicroQuests } from '../../../hooks/useMicroQuests';
import { useQuestLog } from '../../../hooks/useQuestLog';
import StackedButton from '../../../components/StackedButton';
import { theme } from '../../../constants/theme'; // Import full theme
import { InfoCard, LogInput, InsightDisplay } from '../../../components/HumanDesignTools';
import * as livingLogService from '../../../services/livingLogService'; // Adjusted path
import { LogEntry, LivingLogPattern, AuthorityType } from '../../../types/humanDesignTools'; // Adjusted path
import LogListItem from './LivingLogComponents/LogListItem'; // Import the new LogListItem

// Assume we get authority from a context or service eventually.
// For now, we can mock it or pass it as a prop if this screen is part of a navigator with params.
const MOCK_USER_AUTHORITY = AuthorityType.Sacral; // Example, replace with actual source

const LivingLogScreen: React.FC = () => {
  const { showBanner, dismissBanner } = useOnboarding('living_log');
  const { completeMicroQuestAction, showToast, completedQuestTitle, hideToast } = useMicroQuests();
  const { logJournalEntry } = useQuestLog();
  // newEntryText state removed as LogInput manages its own state.
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [patterns, setPatterns] = useState<LivingLogPattern[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState<LogEntry | null>(null); // For potential detail view

  const loadLogData = useCallback(async () => {
    setIsLoading(true);
    try {
      const entriesData = await livingLogService.getLogEntries();
      setLogEntries(entriesData.entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

      // Convert enum to string for the service call, if your service expects string
      const authorityString = MOCK_USER_AUTHORITY.toString();
      const patternsData = await livingLogService.getLogPatterns("month", authorityString);
      // Filter out any undefined patterns before updating state
      setPatterns(patternsData.patterns.filter(pattern => pattern !== undefined && pattern !== null));
      setInsights(patternsData.insights || []);

    } catch (error) {
      console.error("Error loading log data:", error);
      // TODO: Show error message to user
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadLogData();
  }, [loadLogData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadLogData();
    setIsRefreshing(false);
  }, [loadLogData]);

  const handleCreateLogEntry = async (text: string) => {
    if (!text.trim()) return;
    // Simplified payload for now
    const payload: livingLogService.CreateLogEntryPayload = {
      content: text,
      type: "text",
      authorityData: { type: MOCK_USER_AUTHORITY.toString(), state: "neutral" }, // Example authority data
      context: { location: "LivingLogScreen" },
    };
    try {
      const result = await livingLogService.createLogEntry(payload);
      if (result.success) {
        // Refresh entries
        loadLogData();
        // Complete the micro-quest
        completeMicroQuestAction('living_log_entry');
        logJournalEntry('New Log Entry', text);
        // Potentially clear input if LogInput doesn't do it itself or if newEntryText was used
        // setNewEntryText('');
      } else {
        // TODO: Show error to user
        console.error("Failed to create log entry");
      }
    } catch (error) {
      console.error("Error creating log entry:", error);
      // TODO: Show error to user
    }
  };

  const handleLogItemPress = (entryId: string) => {
    const entry = logEntries.find(e => e.id === entryId);
    // For now, just log it. Later this could open a detail modal or screen.
    console.log("Pressed log entry:", entry);
    setSelectedLogEntry(entry || null);
    // Example: call updateLogEntryAuthorityFeedback
    // if (entry) {
    //   livingLogService.updateLogEntryAuthorityFeedback(entry.id, { clarityLevel: 5, wasAccurate: true, reflectionNotes: "This felt very accurate."})
    //     .then(response => console.log("Feedback update response:", response))
    //     .catch(error => console.error("Error updating feedback:", error));
    // }
  };

  const renderLogEntry = ({ item }: { item: LogEntry }) => (
    <LogListItem entry={item} onPress={() => handleLogItemPress(item.id)} />
  );

  // Helper function to render a pattern - modified to take pattern directly
  const renderPattern = (pattern: LivingLogPattern, index: number) => {
    if (!pattern) return null;
    return (
      <InsightDisplay
        key={`pattern-${index}`}
        insightText={pattern.description}
        source={`Pattern Type: ${pattern.patternType} (Confidence: ${pattern.confidence.toFixed(2)})`}
      />
    );
  };

  const renderInsight = (insight: string, index: number) => (
    <InsightDisplay
      key={`insight-${index}`}
      insightText={insight}
      source="Living Log Patterns"
    />
  );


  if (isLoading && !isRefreshing && logEntries.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading your living log...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MicroQuestTracker action="living_log_entry" />
      {showBanner && (
        <OnboardingBanner
          toolName="Living Log"
          description="Welcome to your Living Log! Track experiences and discover patterns related to your Human Design."
          onDismiss={dismissBanner}
        />
      )}
      <QuestCompletionToast
        questTitle={completedQuestTitle}
        visible={showToast}
        onHide={hideToast}
      />
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>LIVING LOG</Text>
          <Text style={styles.pageSubtitle}>A chronicle of experiences</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={theme.colors.accent} />}
        >
          <View style={styles.logContent}>
            <InfoCard title="New Log Entry">
              <LogInput onSubmit={handleCreateLogEntry} placeholder="Log your current experience..." />
            </InfoCard>

            <InfoCard title="Patterns & Insights">
              {(patterns.length === 0 && insights.length === 0 && !isLoading) && (
                <Text style={styles.emptyText}>No patterns or insights detected yet.</Text>
              )}
              {isLoading && (patterns.length === 0 && insights.length === 0) && <ActivityIndicator color={theme.colors.accent}/>}
              {patterns.map(renderPattern)}
              {insights.map(renderInsight)}
            </InfoCard>

            <InfoCard title="Recent Log Entries">
              {(logEntries.length === 0 && !isLoading) && (
                <Text style={styles.emptyText}>No log entries yet. Add one above!</Text>
              )}
              {isLoading && logEntries.length === 0 && <ActivityIndicator color={theme.colors.accent}/>}
              <FlatList
                data={logEntries}
                renderItem={renderLogEntry}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </InfoCard>

            {/* Redundant "ADD NEW ENTRY" button removed as LogInput has its own submit button */}
            {/*
            <View style={styles.logActions}>
              <StackedButton
                type="rect"
                text="ADD NEW ENTRY"
                onPress={() => {}}
              />
            </View>
            */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Updated from theme.colors.bg for app-wide transparency
  },
  contentWrapper: {
    flex: 1,
    padding: theme.spacing.lg, // Use theme spacing
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl, // Use theme spacing
    flexShrink: 0,
  },
  pageTitle: { // "LIVING LOG"
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: theme.typography.displayMedium.fontWeight,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: { // "A chronicle of experiences"
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs, // Use theme spacing
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logContent: { // Container for all InfoCards
    flex: 1,
    gap: theme.spacing.xl, // Use theme spacing for gap between InfoCards
  },
  logActions: { // This style might be unused now
    marginTop: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl, // Use theme spacing
  },
  loadingText: {
    fontFamily: theme.fonts.body, // Use theme font
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md, // Use theme spacing
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: theme.fonts.body, // Use theme font
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: theme.spacing.md, // Add some padding
  },
  header: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Updated
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  loader: {
    marginTop: 50,
  },
  entryContent: {
    fontSize: 16,
    color: theme.colors.textPrimary, // Updated
    marginBottom: 5,
  },
  entryTags: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary, // Updated
    marginBottom: 3,
  },
  entryAuthority: {
    fontSize: 12,
    color: theme.colors.accent, // Updated (Note: consider specific color for authority if needed)
  },
  // Basic modal style for displaying selected entry details (optional)
  modalView: {
    margin: 20,
    backgroundColor: theme.colors.bg, // Updated
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: theme.colors.textPrimary, // Added theme color
  },
  closeButton: {
    backgroundColor: theme.colors.accent, // Updated
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: theme.colors.bg, // Updated
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default LivingLogScreen;
