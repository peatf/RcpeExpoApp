// Inside src/screens/Main/UserBaseChartScreen.tsx
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import StackedButton from '../../components/StackedButton';
import { colors, typography, spacing } from '../../constants/theme';
import baseChartService, {BaseChartData} from '../../services/baseChartService';
import blueprintVisualizerService from '../../services/blueprintVisualizerService';
import BlueprintCanvas from '../../components/EnergeticBlueprint/BlueprintCanvas';
import BlueprintDescription from '../../components/EnergeticBlueprint/BlueprintDescription';

const UserBaseChartScreen: React.FC<{navigation: any}> = ({navigation}) => {
  // Original state
  const {user, isAuthenticated, isLoading: authLoading} = useAuth();
  const [chartData, setChartData] = useState<BaseChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  
  // New state for blueprint visualization
  const [viewMode, setViewMode] = useState<'text' | 'visualization'>('text');
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Get screen dimensions for canvas
  const screenWidth = Dimensions.get('window').width;
  const canvasSize = Math.min(screenWidth * 0.9, 500); // Cap at 500 for larger screens
  
  // Original loadBaseChart function
  const loadBaseChart = useCallback(async (forceRefresh = false) => {
    // Your existing code for loading chart data
    if (!isAuthenticated) {
      setError('Please log in to view your chart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await baseChartService.getUserBaseChart(user?.id || '', forceRefresh);
      if (result.success && result.data) {
        setChartData(result.data);
        setFromCache(!!result.fromCache);
      } else {
        setError('Failed to load chart data: ' + result.error);
      }
    } catch (err: any) {
      console.error('Error loading chart:', err);
      if (err.message?.includes('auth')) {
        setError('Authentication error. Please log in again.');
      } else if (err.message?.includes('profile ID')) {
        setError('No profile found. Please create a profile first.');
      } else if (err.message?.includes('Network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAuthenticated]);
  
  // Initial data load
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      loadBaseChart();
    } else if (!authLoading && !isAuthenticated) {
      setError('Please log in to view your base chart');
    }
  }, [user?.id, loadBaseChart, authLoading, isAuthenticated]);
  
  // Handle refresh
  const handleRefresh = () => {
    loadBaseChart(true);
  };
  
  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(viewMode === 'text' ? 'visualization' : 'text');
  };
  
  // Handle category highlight for visualization
  const handleHighlight = (category: string) => {
    setHighlightedCategory(category === highlightedCategory ? null : category);
  };
  
  // Get blueprint descriptions for visualization mode
  const getBlueprintDescriptions = useCallback(() => {
    if (!chartData) return [];
    
    return [
      {
        category: "Energy Family",
        description: `Core identity shaped by a ${chartData.energy_family?.profile_lines} profile, radiating from the ${chartData.energy_family?.astro_sun_sign} frequency in the ${chartData.energy_family?.astro_sun_house} house.`
      },
      {
        category: "Energy Class",
        description: `Interface with the world, projecting a ${chartData.energy_class?.ascendant_sign} aura, guided by the ${chartData.energy_class?.incarnation_cross_quarter} quarter.`
      },
      // ... other categories as previously defined
    ];
  }, [chartData]);
  
  // Your existing renderChartSection function
  const renderChartSection = (title: string, data: any) => {
    if (!data || typeof data !== 'object') {
      return null;
    }
    
    return (
      <View key={title} style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.dataRow}>
            <Text style={styles.dataKey}>
              {baseChartService.formatKey(key)}:
            </Text>
            <Text style={styles.dataValue}>
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Render the text view (original chart display)
  const renderTextView = () => {
    if (!chartData) return null;
    
    return (
      <View style={styles.content}>
        {baseChartService.getChartSections(chartData).map(section =>
          renderChartSection(section.title, section.data)
        )}
      </View>
    );
  };
  
  // Render the visualization view
  const renderVisualizationView = () => {
    if (!chartData) return null;
    
    const visualizationData = blueprintVisualizerService.prepareVisualizationData(chartData);
    
    return (
      <View style={styles.visualizationContainer}>
        <View style={[styles.canvasContainer, {width: canvasSize, height: canvasSize}]}>
          <BlueprintCanvas 
            data={visualizationData} 
            highlightedCategory={highlightedCategory} 
            width={canvasSize} 
            height={canvasSize} 
            onCanvasReady={() => setCanvasReady(true)}
          />
          {!canvasReady && (
            <View style={styles.canvasOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </View>
        
        <ScrollView 
          style={styles.descriptionsScroll} 
          contentContainerStyle={styles.descriptionsContainer}
        >
          {getBlueprintDescriptions().map((item, index) => (
            <BlueprintDescription 
              key={`desc-${index}`}
              category={item.category}
              description={item.description}
              isHighlighted={highlightedCategory === item.category}
              onPress={() => handleHighlight(item.category)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  // Main render function
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>BASE CHART</Text>
          <Text style={styles.pageSubtitle}>Your energetic foundation</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {authLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Checking authentication...</Text>
            </View>
          ) : !isAuthenticated ? (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>Please log in to access your base chart</Text>
              <StackedButton
                type="rect"
                text="GO TO LOGIN"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ) : isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading base chart...</Text>
            </View>
          ) : error ? (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{error}</Text>
              <StackedButton
                type="rect"
                text="RETRY"
                onPress={() => loadBaseChart()}
              />
            </View>
          ) : chartData ? (
            <>
              <View style={styles.chartContent}>
                {viewMode === 'text' ? renderTextView() : renderVisualizationView()}
              </View>
              <View style={styles.chartActions}>
                <StackedButton
                  type="rect"
                  text={viewMode === 'text' ? 'SHOW VISUALIZATION' : 'SHOW TEXT VIEW'}
                  onPress={toggleViewMode}
                />
              </View>
            </>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>No base chart data available</Text>
              <StackedButton
                type="rect"
                text="LOAD CHART"
                onPress={() => loadBaseChart()}
              />
            </View>
          )}
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
  chartContent: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  chartActions: {
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
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  messageText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Visualization specific styles
  visualizationContainer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  canvasContainer: {
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: 8,
    marginBottom: spacing.md,
    backgroundColor: colors.bg,
    maxWidth: 500,
  },
  descriptionsContainer: {
    padding: spacing.sm,
  },
});

export default UserBaseChartScreen;
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  dataRow: {
    marginBottom: 12,
  },
  dataKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // New styles for visualization
  visualizationContainer: {
    alignItems: 'center',
    padding: 16,
  },
  canvasContainer: {
    backgroundColor: '#F8F4E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 244, 233, 0.7)',
  },
  descriptionsScroll: {
    width: '100%',
    maxWidth: 500,
  },
  descriptionsContainer: {
    padding: 8,
  },
});

export default UserBaseChartScreen;