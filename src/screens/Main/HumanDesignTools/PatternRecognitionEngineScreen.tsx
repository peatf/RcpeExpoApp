/**
 * @file PatternRecognitionEngineScreen.tsx
 * @description Screen for the Pattern Recognition Engine tool, showing discovered patterns and insights.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
import { InfoCard, InsightDisplay } from '../../../components/HumanDesignTools';
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

  useEffect(() => {
    const fetchAuthority = async () => {
      setIsLoadingAuthority(true);
      const authority = await authorityService.detectUserAuthority();
      setUserAuthority(authority);
      setIsLoadingAuthority(false);
    };
    fetchAuthority();
  }, []);

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pattern Recognition Engine</Text>
      <Text style={styles.subHeader}>Authority: {userAuthority}</Text>

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
        {insights.map((insight, index) => (
          <InsightDisplay
            key={`insight-${index}`}
            insightText={insight}
            source="Pattern Recognition Engine"
          />
        ))}
        {insights.length === 0 && <Text>No general insights yet.</Text>}
      </InfoCard>

      {/* Authority-Specific Patterns */}
      {userAuthority && (
        <InfoCard title={`${userAuthority} Authority Patterns`}>
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
          {authorityPatterns.length === 0 && priorityInsights.length === 0 && (
            <Text>No authority-specific patterns detected yet.</Text>
          )}
        </InfoCard>
      )}

      {/* Detected Patterns List */}
      <InfoCard title={`Detected Patterns (${patterns.length})`}>
        {isLoadingData && <ActivityIndicator style={styles.loader} />}
        {patterns.length > 0 ? (
          <FlatList
            data={patterns}
            renderItem={renderPatternItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={styles.patternsList}
          />
        ) : (
          <Text style={styles.emptyStateText}>
            No patterns detected yet. Continue using the app to build pattern data.
          </Text>
        )}
      </InfoCard>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <Button
          title="Refresh Patterns"
          onPress={loadPatterns}
          disabled={isLoadingData}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingBottom: 15,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#495057',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  patternsList: {
    marginHorizontal: -16,
  },
  patternItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  patternDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  patternMeta: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  authorityRelevance: {
    fontSize: 13,
    color: '#007AFF',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  accurateButton: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  inaccurateButton: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  feedbackButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  authorityPatternItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  authorityPatternTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  authorityPatternDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    marginBottom: 6,
  },
  authorityPatternMeta: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  recommendationsContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
  },
  recommendationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
    marginBottom: 2,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  refreshContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default PatternRecognitionEngineScreen;
