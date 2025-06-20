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
import { theme } from '../../constants/theme'; // Import full theme
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
        category: 'Type & Strategy',
        description: `${chartData.design_authority} with ${chartData.strategy} strategy`,
        isHighlighted: highlightedCategory === 'Type & Strategy'
      },
      {
        category: 'Authority',
        description: `Inner Authority: ${chartData.inner_authority}`,
        isHighlighted: highlightedCategory === 'Authority'
      },
      {
        category: 'Profile',
        description: `Profile: ${chartData.profile}`,
        isHighlighted: highlightedCategory === 'Profile'
      },
      {
        category: 'Defined Centers',
        description: `Defined: ${chartData.defined_centers?.join(', ') || 'None'}`,
        isHighlighted: highlightedCategory === 'Defined Centers'
      },
      {
        category: 'Undefined Centers',
        description: `Undefined: ${chartData.undefined_centers?.join(', ') || 'None'}`,
        isHighlighted: highlightedCategory === 'Undefined Centers'
      }
    ];
  }, [chartData, highlightedCategory]);

  // Original text view rendering
  const renderTextView = () => (
    <View>
      {chartData && (
        <>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Type:</Text>
              <Text style={styles.dataValue}>{chartData.design_authority}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Strategy:</Text>
              <Text style={styles.dataValue}>{chartData.strategy}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Authority:</Text>
              <Text style={styles.dataValue}>{chartData.inner_authority}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Profile:</Text>
              <Text style={styles.dataValue}>{chartData.profile}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Centers</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Defined:</Text>
              <Text style={styles.dataValue}>{chartData.defined_centers?.join(', ') || 'None'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Undefined:</Text>
              <Text style={styles.dataValue}>{chartData.undefined_centers?.join(', ') || 'None'}</Text>
            </View>
          </View>

          {chartData.active_gates && chartData.active_gates.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Active Gates</Text>
              {/* Assuming active_gates is an array of numbers or strings that can be joined */}
              <Text style={styles.dataValue}>{String(chartData.active_gates.join(', '))}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );

  // New visualization view rendering  
  const renderVisualizationView = () => {
    const descriptions = getBlueprintDescriptions();
    
    return (
      <View style={styles.visualizationContainer}>
        <View style={styles.canvasContainer}>
          {chartData && ( // Ensure chartData is available before rendering BlueprintCanvas
            <BlueprintCanvas
              width={canvasSize}
              height={canvasSize}
              chartData={chartData}
              highlightedCategory={highlightedCategory}
              onCategoryPress={handleHighlight}
              onReady={() => setCanvasReady(true)}
              // Pass theme colors to BlueprintCanvas - assuming these props exist
              accentColor={theme.colors.accent}
              baseColor={theme.colors.base2} // For lines and less prominent elements
              textColor={theme.colors.textPrimary}
              backgroundColor={theme.colors.bg} // Or a specific chart background like base0
              // fontFamily={theme.fonts.mono} // If BlueprintCanvas supports custom fonts for SVG text
            />
          )}
        </View>
        
        {/* Info Panel Section */}
        <View style={styles.infoPanelContainer}>
          {descriptions.map((desc, index) => (
            // Wrap BlueprintDescription in a View styled as infoPanel
            // Or, if BlueprintDescription can take style prop for its root, that's an alternative.
            // For now, wrapping it.
            <View key={index} style={styles.infoPanel}>
              <Text style={styles.infoPanelTextLine}>
                <Text style={styles.infoPanelLabel}>{desc.category}: </Text>
                <Text style={styles.infoPanelValue}>{desc.description}</Text>
              </Text>
              {/*
                BlueprintDescription component might render its own content.
                The goal is to make each item look like:
                <View style={styles.infoPanel}>
                  <Text style={styles.infoPanelLabel}>Profile:</Text>
                  <Text style={styles.infoPanelValue}>6/2</Text>
                </View>
                If BlueprintDescription renders category and description with its own styles,
                we might need to adjust or pass props to it.
                Forcing the style here by reconstructing the Text:
              */}
            </View>
          ))}
        </View>
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
    backgroundColor: theme.colors.bg, // Apply theme background
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
  pageTitle: { // "BASE CHART"
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize,
    fontWeight: theme.typography.displayMedium.fontWeight,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: { // "Your energetic foundation"
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
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontFamily: theme.fonts.body, // Use theme font
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  messageText: {
    fontFamily: theme.fonts.body, // Use theme font
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.bodyLarge.lineHeight,
  },
  // Styles for text view mode
  sectionCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.bg, // Or a slightly different shade like base0 or base0.5 if defined
    borderRadius: theme.borderRadius.md, // Use theme border radius
    borderWidth: 1,
    borderColor: theme.colors.base1,
  },
  sectionTitle: {
    fontFamily: theme.fonts.display, // Or a suitable heading font from theme
    fontSize: theme.typography.headingMedium.fontSize, // Use theme typography
    fontWeight: theme.typography.headingMedium.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm, // Use theme spacing
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base2, // Use a slightly lighter border for rows
  },
  dataLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
  },
  dataValue: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.base1, // Use a subtle background for value
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  // Styles for visualization view mode
  visualizationContainer: { // Container for SVG and descriptions
    alignItems: 'center',
    // padding: theme.spacing.md, // Padding for the whole viz section if needed
  },
  canvasContainer: { // Wrapper for BlueprintCanvas
    width: '100%',
    aspectRatio: 1, // Make it square
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.md, // Consistent border radius
    marginBottom: theme.spacing.lg, // mb-6 from HTML
    backgroundColor: theme.colors.bg, // Or base0 if different from screen bg
    // maxWidth: 500, // Already present, keep if needed
  },
  infoPanelContainer: { // Wrapper for multiple info panels if needed, or apply to BlueprintDescription directly
    width: '100%', // Panels take full width
    gap: theme.spacing.md, // Space between info panels
  },
  infoPanel: { // Style for each "Profile: 6/2" type of panel
    padding: theme.spacing.md, // p-4
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm, // rounded-lg (8px)
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // transparent white
    // marginBottom: theme.spacing.md, // If not using gap in parent
  },
  infoPanelTextLine: { // For each line like "Profile: 6/2"
    flexDirection: 'row',
    justifyContent: 'space-between', // If label and value are separate Text components
    // If single Text component, these are not needed here.
  },
  infoPanelLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize, // text-sm
    color: theme.colors.textSecondary,
  },
  infoPanelValue: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodyMedium.fontSize, // text-sm
    color: theme.colors.textPrimary,
  },
  // descriptionsContainer is from old code, might be replaced by infoPanelContainer logic
  descriptionsContainer: {
    // padding: theme.spacing.sm, // This was for ScrollView of BlueprintDescription items
    width: '100%', // Ensure it takes full width
  },
});

export default UserBaseChartScreen;