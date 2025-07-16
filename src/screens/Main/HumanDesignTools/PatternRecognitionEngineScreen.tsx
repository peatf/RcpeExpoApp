/**
 * @file PatternRecognitionEngineScreen.tsx
 * @description Screen for the Pattern Recognition Engine tool, showing discovered patterns and insights.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity, RefreshControl } from 'react-native'; // Added RefreshControl, removed Button
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
import StackedButton from '../../../components/StackedButton'; // Import StackedButton
import { theme } from '../../../constants/theme'; // Import theme
import * as patternRecognitionService from '../../../services/patternRecognitionService';
import * as authorityService from '../../../services/authorityService';
import { AuthorityType, PatternRecognitionPattern, PatternDetail, AuthorityPattern } from '../../../types/humanDesignTools';

const PatternRecognitionEngineScreen: React.FC = () => {
  const [userAuthority, setUserAuthority] = useState<AuthorityType | null>(null);
  const [isLoadingAuthority, setIsLoadingAuthority] = useState(true);

  const [patterns, setPatterns] = useState<PatternRecognitionPattern[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [overallConfidence, setOverallConfidence] = useState<number>(0);
  const [authorityPatterns, setAuthorityPatterns] = useState<AuthorityPattern[]>([]);
  const [priorityInsights, setPriorityInsights] = useState<string[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<PatternDetail | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "all">("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh

  const loadPatterns = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Load general patterns
      const patternData = await patternRecognitionService.getDetectedPatterns({
        timeframe: selectedTimeframe,
        category: selectedCategory || undefined,
        limit: 20
      });
      setPatterns(patternData.patterns);
      setInsights(patternData.insights);
      setOverallConfidence(patternData.confidence);

      // Load authority-specific patterns
      const authorityData = await patternRecognitionService.getAuthoritySpecificPatterns();
      setAuthorityPatterns(authorityData.authorityPatterns);
      setPriorityInsights(authorityData.priorityInsights);

    } catch (error) {
      console.error("Error loading pattern data:", error);
      Alert.alert("Error", "Could not load Pattern Recognition data.");
    }
    setIsLoadingData(false);
  }, [selectedTimeframe, selectedCategory]);

  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  const handlePatternPress = async (patternId: string) => {
    try {
      const detailData = await patternRecognitionService.getPatternDetail(patternId);
      setSelectedPattern(detailData.pattern);
      // Could show in modal or navigate to detail screen
      if (detailData.pattern) {
        Alert.alert(
          detailData.pattern.title,
          `${detailData.pattern.description}\n\nConfidence: ${(detailData.pattern.confidence * 100).toFixed(0)}%\n\nRecommendations:\n${detailData.recommendations.join('\n')}`
        );
      } else {
        Alert.alert("Error", "Pattern details not available.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not load pattern details.");
    }
  };

  const handlePatternFeedback = async (patternId: string, isAccurate: boolean) => {
    try {
      const result = await patternRecognitionService.submitPatternFeedback(patternId, {
        isAccurate,
        notes: isAccurate ? "Pattern seems accurate" : "Pattern doesn't feel right"
      });
      if (result.success) {
        Alert.alert("Thank you!", `Feedback recorded. Updated confidence: ${(result.updatedConfidence * 100).toFixed(0)}%`);
        loadPatterns(); // Refresh data
      }
    } catch (error) {
      Alert.alert("Error", "Could not submit feedback.");
    }
  };

  const renderPatternItem = ({ item }: { item: PatternRecognitionPattern }) => (
    <TouchableOpacity 
      style={styles.patternItem}
      onPress={() => handlePatternPress(item.id)}
    >
      <View style={styles.patternHeader}>
        <Text style={styles.patternTitle}>{item.title}</Text>
        <Text style={styles.confidenceText}>{(item.confidence * 100).toFixed(0)}%</Text>
      </View>
      <Text style={styles.patternDescription}>{item.description}</Text>
      <Text style={styles.patternMeta}>
        Category: {item.category} • Data points: {item.dataPoints} • Impact: {item.impactDomains.join(', ')}
      </Text>
      <Text style={styles.authorityRelevance}>{item.authorityRelevance}</Text>
      
      <View style={styles.feedbackButtons}>
        <TouchableOpacity 
          style={[styles.feedbackButton, styles.accurateButton]}
          onPress={() => handlePatternFeedback(item.id, true)}
        >
          <Text style={styles.feedbackButtonText}>✓ Accurate</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.feedbackButton, styles.inaccurateButton]}
          onPress={() => handlePatternFeedback(item.id, false)}
        >
          <Text style={styles.feedbackButtonText}>✗ Not Quite</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const timeframeOptions = ["week", "month", "all"] as const;
  const categoryOptions = ["", "decision", "energy", "environment", "relationship"];

  if (isLoadingAuthority) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading authority...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>PATTERN RECOGNITION</Text>
          <Text style={styles.pageSubtitle}>Authority: {userAuthority || 'N/A'}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadPatterns} tintColor={theme.colors.accent} />}
        >
          <View style={styles.mainContent}>
            {/* Filters */}
            <InfoCard title="Pattern Filters">
              <Text style={styles.filterLabel}>Timeframe:</Text>
              <View style={styles.filterRow}>
                {timeframeOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterButton,
                      selectedTimeframe === option && styles.filterButtonActive
                    ]}
                    onPress={() => setSelectedTimeframe(option)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedTimeframe === option && styles.filterButtonTextActive
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Category:</Text>
              <View style={styles.filterRow}>
                {categoryOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterButton,
                      selectedCategory === option && styles.filterButtonActive
                    ]}
                    onPress={() => setSelectedCategory(option)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedCategory === option && styles.filterButtonTextActive
                    ]}>
                      {option || "All"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </InfoCard>

            {/* Overall Insights */}
            <InfoCard title={`Pattern Insights (${(overallConfidence * 100).toFixed(0)}% confidence)`}>
              {isLoadingData && !isRefreshing && <ActivityIndicator color={theme.colors.accent} style={styles.loaderWithinCard} />}
              {!isLoadingData && insights.length === 0 && <Text style={styles.emptyStateText}>No general insights yet.</Text>}
              {insights.map((insight, index) => (
                <InsightDisplay
                  key={`insight-${index}`}
                  insightText={insight}
                  source="Pattern Recognition Engine"
                />
              ))}
            </InfoCard>

            {/* Authority-Specific Patterns */}
            {userAuthority && (
              <InfoCard title={`${userAuthority} Authority Patterns`}>
                {isLoadingData && !isRefreshing && <ActivityIndicator color={theme.colors.accent} style={styles.loaderWithinCard} />}
                {!isLoadingData && authorityPatterns.length === 0 && priorityInsights.length === 0 && (
                  <Text style={styles.emptyStateText}>No authority-specific patterns detected yet.</Text>
                )}
                {priorityInsights.map((insight, index) => (
                  <InsightDisplay
                    key={`priority-${index}`}
                    insightText={insight}
                    source={`${userAuthority} Authority`}
                  />
                ))}
                {authorityPatterns.map(pattern => (
                  <View key={pattern.id} style={styles.authorityPatternItem}>
                    <Text style={styles.authorityPatternTitle}>{pattern.patternName}</Text>
                    <Text style={styles.authorityPatternDescription}>{pattern.description}</Text>
                    <Text style={styles.authorityPatternMeta}>
                      Impact Score: {pattern.impactScore}/10 • Confidence: {(pattern.confidence * 100).toFixed(0)}%
                    </Text>
                    {pattern.recommendedActions.length > 0 && (
                      <View style={styles.recommendationsContainer}>
                        <Text style={styles.recommendationsTitle}>Recommended Actions:</Text>
                        {pattern.recommendedActions.map((action, index) => (
                          <Text key={index} style={styles.recommendationText}>• {action}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </InfoCard>
            )}

            {/* Detected Patterns List */}
            <InfoCard title={`Detected Patterns (${patterns.length})`}>
              {isLoadingData && !isRefreshing && <ActivityIndicator style={styles.loader} color={theme.colors.accent} />}
              {!isLoadingData && patterns.length === 0 ? (
                <Text style={styles.emptyStateText}>
                  No patterns detected yet. Continue using the app to build pattern data.
                </Text>
              ) : (
                <FlatList
                  data={patterns}
                  renderItem={renderPatternItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  // style={styles.patternsList} // FlatList doesn't need marginHorizontal if items have it
                />
              )}
            </InfoCard>

            {/* Refresh Button */}
            <View style={styles.refreshContainer}>
              <StackedButton
                text="Refresh Patterns"
                onPress={loadPatterns}
                shape="rectangle"
                // isLoading prop can be added to StackedButton if available for loading state
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
    backgroundColor: theme.colors.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  loader: { // General loader for sections
    marginVertical: theme.spacing.md,
  },
  loaderWithinCard: { // Loader specifically for inside a card
    marginVertical: theme.spacing.sm,
  },
  loadingContainer: { // Full screen loading
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.bg,
  },
  loadingText: { // Text for full screen loading
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
  filterLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: 'bold', // Make labels bolder
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm, // Increased space
    marginTop: theme.spacing.sm, // Add some top margin if it's not the first element
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md, // Consistent margin
    gap: theme.spacing.sm, // Use gap for spacing between buttons
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md, // More padding
    paddingVertical: theme.spacing.xs,  // Adjust vertical padding
    borderRadius: theme.borderRadius.full, // Pill shape
    backgroundColor: theme.colors.base2,
    borderWidth: 1,
    borderColor: theme.colors.base3,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  filterButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textPrimary, // Darker text on light button
  },
  filterButtonTextActive: {
    color: theme.colors.bg, // White text on accent button
  },
  // patternsList: { // Removed as FlatList doesn't need margin if items handle it
  //   marginHorizontal: -theme.spacing.md, // To counteract InfoCard padding if items have their own
  // },
  patternItem: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.md,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  patternTitle: {
    fontFamily: theme.fonts.body, // Changed from display to body for list items
    fontSize: theme.typography.bodyLarge.fontSize, // Use a more standard text size
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    flex: 1, // Allow title to take space
    marginRight: theme.spacing.sm, // Space before confidence
  },
  confidenceText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: 'bold',
    color: theme.colors.accent,
    backgroundColor: theme.colors.accentGlow, // Use accentGlow or a very light accent
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  patternDescription: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    marginBottom: theme.spacing.sm,
  },
  patternMeta: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize - 2, // Even smaller for meta
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  authorityRelevance: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.accent, // Make it stand out
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md, // Use gap for spacing
    justifyContent: 'flex-end', // Align to the right
    marginTop: theme.spacing.sm,
  },
  feedbackButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm, // Consistent radius
    borderWidth: 1,
    // alignItems: 'center',
  },
  accurateButton: {
    borderColor: theme.colors.accent,
    backgroundColor: 'transparent',
  },
  inaccurateButton: {
    borderColor: theme.colors.base3,
    backgroundColor: 'transparent',
  },
  feedbackButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: 'bold',
    // Color will be set dynamically based on accurate/inaccurate if needed, or keep neutral
  },
  authorityPatternItem: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: theme.spacing.md,
  },
  authorityPatternTitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  authorityPatternDescription: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    marginBottom: theme.spacing.xs,
  },
  authorityPatternMeta: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  recommendationsContainer: {
    backgroundColor: 'transparent',      // Subtle background for this section
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  recommendationsTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  recommendationText: {
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
    fontStyle: 'italic',
    padding: theme.spacing.md, // Give it some space
  },
  refreshContainer: {
    paddingVertical: theme.spacing.lg, // Add vertical padding
    // Button inside will be full width due to StackedButton default for type="rect"
  },
  // Removed old styles (centered, header, subHeader)
});

export default PatternRecognitionEngineScreen;
