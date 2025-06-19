/**
 * @file LivingLogScreen.tsx
 * @description Screen for the Living Log tool, allowing users to log experiences and view patterns.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import StackedButton from '../../../components/StackedButton';
import { colors, typography, spacing } from '../../../constants/theme';
import { InfoCard, LogInput, InsightDisplay } from '../../../components/HumanDesignTools'; // Adjusted path
import * as livingLogService from '../../../services/livingLogService'; // Adjusted path
import { LogEntry, LivingLogPattern, AuthorityType } from '../../../types/humanDesignTools'; // Adjusted path
import LogListItem from './LivingLogComponents/LogListItem'; // Import the new LogListItem

// Assume we get authority from a context or service eventually.
// For now, we can mock it or pass it as a prop if this screen is part of a navigator with params.
const MOCK_USER_AUTHORITY = AuthorityType.Sacral; // Example, replace with actual source

const LivingLogScreen: React.FC = () => {
  const [newEntryText, setNewEntryText] = useState(''); // Not used directly by LogInput but for other potential inputs
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
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading your living log...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>LIVING LOG</Text>
          <Text style={styles.pageSubtitle}>A chronicle of experiences</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
          <View style={styles.logContent}>
            <InfoCard title="New Log Entry">
              <LogInput onSubmit={handleCreateLogEntry} placeholder="Log your current experience..." />
            </InfoCard>

            <InfoCard title="Patterns & Insights">
              {patterns.length === 0 && insights.length === 0 && (
                <Text style={styles.emptyText}>No patterns or insights detected yet.</Text>
              )}
              {patterns.map(renderPattern)}
              {insights.map(renderInsight)}
            </InfoCard>

            <InfoCard title="Recent Log Entries">
              {logEntries.length === 0 && !isLoading && (
                <Text style={styles.emptyText}>No log entries yet. Add one above!</Text>
              )}
              <FlatList
                data={logEntries}
                renderItem={renderLogEntry}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Disable FlatList scrolling, ScrollView handles it
              />
            </InfoCard>

            <View style={styles.logActions}>
              <StackedButton
                type="rect"
                text="ADD NEW ENTRY"
                onPress={() => {/* Could focus input or show modal */}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    flexShrink: 0,
  },
  pageTitle: {
    ...typography.displayMedium,
    fontFamily: 'System',
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: {
    ...typography.labelSmall,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logContent: {
    flex: 1,
    gap: spacing.lg,
  },
  logActions: {
    marginTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
  entryContent: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  entryTags: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#7f8c8d',
    marginBottom: 3,
  },
  entryAuthority: {
    fontSize: 12,
    color: '#27ae60', // A greenish color for authority
  },
  // Basic modal style for displaying selected entry details (optional)
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default LivingLogScreen;
