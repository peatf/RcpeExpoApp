import React, {useState, useEffect, useCallback, useMemo} from 'react';
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
import { colors, spacing, typography, shadows, borderRadius, fonts } from '../../constants/theme';
import baseChartService, {BaseChartData} from '../../services/baseChartService';
import blueprintVisualizerService, { VisualizationData } from '../../services/blueprintVisualizerService';
import BlueprintCanvas from '../../components/EnergeticBlueprint/BlueprintCanvas';
import BlueprintDescription from '../../components/EnergeticBlueprint/BlueprintDescription';
import OnboardingBanner from '../../components/OnboardingBanner';
import useOnboardingBanner from '../../hooks/useOnboardingBanner';

// Helper functions for extracting data remain unchanged
const extractDisplayData = (data: BaseChartData) => {
  return {
    design_authority: data.hd_type || 'Unknown',
    strategy: data.decision_growth_vector?.strategy || 'Unknown',
    inner_authority: data.decision_growth_vector?.authority || 'Unknown',
    profile: data.energy_family?.profile_lines || 'Unknown',
    // defined_centers: getDefinedCenters(data), // Related to removed cards
    // undefined_centers: getUndefinedCenters(data), // Related to removed cards
    // active_gates: getActiveGates(data), // Related to removed cards
    sun_sign: data.energy_family?.astro_sun_sign || 'Unknown',
    moon_sign: data.processing_core?.astro_moon_sign || 'Unknown',
    rising_sign: data.energy_class?.ascendant_sign || 'Unknown',
    chart_ruler: data.energy_class?.chart_ruler_sign || 'Unknown',
  };
};

// Helper functions remain unchanged
const getDefinedCenters = (data: BaseChartData) => {
  const centers = [];
  
  if (data.processing_core?.head_state === 'defined') centers.push('Head');
  if (data.processing_core?.ajna_state === 'defined') centers.push('Ajna');
  if (data.processing_core?.emotional_state === 'defined') centers.push('Solar Plexus');
  if (data.drive_mechanics?.heart_state === 'defined') centers.push('Heart');
  if (data.manifestation_interface_rhythm?.throat_definition === 'defined') centers.push('Throat');
  // Add more centers as needed
  
  return centers;
};

const getUndefinedCenters = (data: BaseChartData) => {
  const centers = [];
  
  if (data.processing_core?.head_state === 'undefined') centers.push('Head');
  if (data.processing_core?.ajna_state === 'undefined') centers.push('Ajna');
  if (data.processing_core?.emotional_state === 'undefined') centers.push('Solar Plexus');
  if (data.drive_mechanics?.heart_state === 'undefined') centers.push('Heart');
  if (data.manifestation_interface_rhythm?.throat_definition === 'undefined') centers.push('Throat');
  // Add more centers as needed
  
  return centers;
};

const getActiveGates = (data: BaseChartData) => {
  return data.manifestation_interface_rhythm?.throat_gates || [];
};

const UserBaseChartScreen: React.FC<{navigation: any}> = ({navigation}) => {
  // State
  const {user, isAuthenticated, isLoading: authLoading} = useAuth();
  const [chartData, setChartData] = useState<BaseChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  
  // Blueprint visualization state
  const [viewMode, setViewMode] = useState<'text' | 'visualization'>('visualization'); // Updated initial state
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('UserBaseChart');
  
  // Derived state for display data
  const displayData = useMemo(() => chartData ? extractDisplayData(chartData) : null, [chartData]);
  
  // Create visualization data for BlueprintCanvas
  const visualizationData = useMemo(() => {
    if (!chartData) return null;
    
    // Transform BaseChartData to VisualizationData format expected by BlueprintCanvas
    return {
      profile_lines: chartData.energy_family?.profile_lines || '',
      astro_sun_sign: chartData.energy_family?.astro_sun_sign || '',
      astro_sun_house: String(chartData.energy_family?.astro_sun_house || ''),
      astro_north_node_sign: chartData.energy_family?.astro_north_node_sign || '',
      ascendant_sign: chartData.energy_class?.ascendant_sign || '',
      chart_ruler_sign: chartData.energy_class?.chart_ruler_sign || '',
      incarnation_cross: chartData.energy_class?.incarnation_cross || '',
      incarnation_cross_quarter: chartData.energy_class?.incarnation_cross_quarter || '',
      astro_moon_sign: chartData.processing_core?.astro_moon_sign || '',
      astro_mercury_sign: chartData.processing_core?.astro_mercury_sign || '',
      head_state: chartData.processing_core?.head_state || '',
      ajna_state: chartData.processing_core?.ajna_state || '',
      emotional_state: chartData.processing_core?.emotional_state || '',
      cognition_variable: chartData.processing_core?.cognition_variable || '',
      chiron_gate: String(chartData.processing_core?.chiron_gate || ''),
      strategy: chartData.decision_growth_vector?.strategy || '',
      authority: chartData.decision_growth_vector?.authority || '',
      choice_navigation_spectrum: chartData.decision_growth_vector?.choice_navigation_spectrum || '',
      astro_mars_sign: chartData.decision_growth_vector?.astro_mars_sign || '',
      north_node_house: String(chartData.decision_growth_vector?.north_node_house || ''),
      jupiter_placement: '', // Add if available in BaseChartData
      motivation_color: chartData.drive_mechanics?.motivation_color || 'Hope', // Default motivation
      heart_state: chartData.drive_mechanics?.heart_state || 'Undefined',
      root_state: chartData.drive_mechanics?.root_state || 'Undefined',
      venus_sign: chartData.drive_mechanics?.venus_sign || 'Unknown',
      kinetic_drive_spectrum: chartData.drive_mechanics?.kinetic_drive_spectrum || 'Balanced Grid', // Default
      resonance_field_spectrum: chartData.drive_mechanics?.resonance_field_spectrum || '50x50', // Default
      perspective_variable: chartData.drive_mechanics?.perspective_variable || 'Unknown',
      saturn_placement: '', // Add if available in BaseChartData
      throat_definition: chartData.manifestation_interface_rhythm?.throat_definition || 'Undefined',
      throat_gates: String(chartData.manifestation_interface_rhythm?.throat_gates || 'None'),
      throat_channels: chartData.manifestation_interface_rhythm?.throat_channels?.join(',') || 'None',
      manifestation_rhythm_spectrum: chartData.manifestation_interface_rhythm?.manifestation_rhythm_spectrum || 'Variable',
      mars_aspects: '', // Add if available in BaseChartData
      channel_list: chartData.energy_architecture?.channel_list?.join(',') || 'None',
      definition_type: chartData.energy_architecture?.definition_type || 'No Definition',
      split_bridges: chartData.energy_architecture?.split_bridges?.join(',') || 'None',
      soft_aspects: '', // Add if available in BaseChartData
      g_center_access: chartData.evolutionary_path?.g_center_access || 'Unknown',
      conscious_line: String(chartData.evolutionary_path?.conscious_line || '0'),
      unconscious_line: String(chartData.evolutionary_path?.unconscious_line || '0'),
      core_priorities: chartData.evolutionary_path?.core_priorities?.join(',') || 'None',
      tension_planets: chartData.tension_planets || [], // Default to empty array
      // Ensure chiron_gate is also part of VisualizationData if used by BlueprintCanvas for Tension Points
      // It's already mapped: chiron_gate: String(chartData.processing_core?.chiron_gate || '0'),
    } as VisualizationData;
  }, [chartData]);
  
  // Get screen dimensions for canvas
  const screenWidth = Dimensions.get('window').width;
  const canvasSize = Math.min(screenWidth * 0.9, 500); // Cap at 500 for larger screens
  
  // Load base chart function
  const loadBaseChart = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated) {
      setError('Please log in to view your chart');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading base chart, forceRefresh:', forceRefresh);
      const result = await baseChartService.getUserBaseChart(user?.id || '', forceRefresh);
      console.log('Base chart API result:', {
        success: result.success,
        hasData: !!result.data,
        fromCache: result.fromCache,
        isMockData: result.isMockData,
        error: result.error,
      });
      
      if (result.success && result.data) {
        setChartData(result.data);
        setFromCache(!!result.fromCache);
        setIsMockData(!!result.isMockData);
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
    // Reset highlighted category when switching view modes
    setHighlightedCategory(null);
  };
  
  // Handle category highlight for visualization
  const handleHighlight = (category: string) => {
    console.log('Highlighting category:', category); // Add debug logging
    console.log('Current highlightedCategory:', highlightedCategory); // Debug current state
    // Toggle highlight - if current category is already highlighted, clear it
    setHighlightedCategory(category === highlightedCategory ? null : category);
  };
  
  // Get blueprint descriptions for visualization mode using all 9 synthesis categories
  const getBlueprintDescriptions = useCallback(() => {
    if (!chartData) return [];
    
    return [
      {
        category: "Energy Family",
        description: `Core identity shaped by a ${chartData.energy_family?.profile_lines || 'Unknown'} profile, radiating from the ${chartData.energy_family?.astro_sun_sign || 'Unknown'} frequency in the ${chartData.energy_family?.astro_sun_house || 'Unknown'} house.`
      },
      {
        category: "Energy Class",
        description: `Interface with the world, projecting a ${chartData.energy_class?.ascendant_sign || 'Unknown'} aura, guided by the ${chartData.energy_class?.incarnation_cross_quarter || 'Unknown'} quarter.`
      },
      {
        category: "Processing Core",
        description: `Mental processing through ${chartData.processing_core?.head_state || 'Unknown'} head center and ${chartData.processing_core?.ajna_state || 'Unknown'} ajna center, with ${chartData.processing_core?.cognition_variable || 'Unknown'} cognition.`
      },
      {
        category: "Decision Growth Vector",
        description: `Operates with ${chartData.decision_growth_vector?.strategy || 'Unknown'} strategy and ${chartData.decision_growth_vector?.authority || 'Unknown'} authority for decision making.`
      },
      {
        category: "Drive Mechanics",
        description: `Motivated by ${chartData.drive_mechanics?.motivation_color || 'Unknown'} with ${chartData.drive_mechanics?.heart_state || 'Unknown'} heart center driving action.`
      },
      {
        category: "Manifestation Interface Rhythm",
        description: `Throat ${chartData.manifestation_interface_rhythm?.throat_definition || 'Unknown'} with ${chartData.manifestation_interface_rhythm?.manifestation_rhythm_spectrum || 'Unknown'} rhythm spectrum.`
      },
      {
        category: "Energy Architecture", 
        description: `${chartData.energy_architecture?.definition_type || 'Unknown'} definition with ${chartData.energy_architecture?.channel_list?.length || 0} channels connecting centers.`
      },
      {
        category: "Tension Points",
        description: `Growth catalyst through Chiron Gate ${chartData.processing_core?.chiron_gate || 'Unknown'} and key tension dynamics.`
      },
      {
        category: "Evolutionary Path",
        description: `${chartData.evolutionary_path?.g_center_access || 'Unknown'} G-center access with conscious line ${chartData.evolutionary_path?.conscious_line || 'Unknown'}.`
      }
    ];
  }, [chartData]);

  // Text view rendering
  const renderTextView = () => (
    <View>
      {chartData && displayData && (
        <>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Type:</Text>
              <Text style={styles.dataValue}>{displayData.design_authority}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Strategy:</Text>
              <Text style={styles.dataValue}>{displayData.strategy}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Authority:</Text>
              <Text style={styles.dataValue}>{displayData.inner_authority}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Profile:</Text>
              <Text style={styles.dataValue}>{displayData.profile}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Sun Sign:</Text>
              <Text style={styles.dataValue}>{displayData.sun_sign}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Moon Sign:</Text>
              <Text style={styles.dataValue}>{displayData.moon_sign}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rising Sign:</Text>
              <Text style={styles.dataValue}>{displayData.rising_sign}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Chart Ruler:</Text>
              <Text style={styles.dataValue}>{displayData.chart_ruler}</Text>
            </View>
          </View>

          {/* Issue 22: Removed Centers and Active Gates cards */}
          {/*
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Centers</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Defined:</Text>
              <Text style={styles.dataValue}>{displayData.defined_centers?.join(', ') || 'None'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Undefined:</Text>
              <Text style={styles.dataValue}>{displayData.undefined_centers?.join(', ') || 'None'}</Text>
            </View>
          </View>

          {displayData.active_gates && displayData.active_gates.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Active Gates</Text>
              <Text style={styles.dataValue}>{String(displayData.active_gates.join(', '))}</Text>
            </View>
          )}
          */}
        </>
      )}
    </View>
  );

  // Visualization view rendering with interactive highlighting  
  const renderVisualizationView = () => {
    if (!chartData) return null;
    
    const visualizationData = blueprintVisualizerService.prepareVisualizationData(chartData);
    const descriptions = getBlueprintDescriptions();
    
    return (
      <View style={styles.visualizationContainer}>
        {/* Blueprint Canvas Container */}
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
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          )}
        </View>
        
        {/* Blueprint Descriptions with Interactive Highlighting */}
        <ScrollView 
          style={styles.descriptionsScroll} 
          contentContainerStyle={styles.descriptionsContainer}
        >
          {descriptions.map((item, index) => (
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
      {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Base Chart"
          description="Explore your foundational Human Design chart, either in text or visual format."
          onDismiss={dismissBanner}
        />
      )}
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
                shape="rectangle"
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
                shape="rectangle"
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
                  shape="rectangle"
                  text={viewMode === 'text' ? 'SHOW VISUALIZATION' : 'SHOW TEXT VIEW'}
                  onPress={toggleViewMode}
                />
                
                {/* Issue 24: Removed "REFRESH DATA" button
                {fromCache && (
                  <View style={styles.cacheNotice}>
                    <Text style={styles.cacheText}>
                      Using cached data. Tap to refresh for the latest information.
                    </Text>
                    <View style={styles.refreshButtonContainer}>
                      <StackedButton
                        shape="rectangle"
                        text="REFRESH DATA"
                        onPress={handleRefresh}
                      />
                    </View>
                  </View>
                )}
                */}
                
                {isMockData && (
                  <View style={styles.mockDataNotice}>
                    <Text style={[styles.cacheText, {color: colors.warning}]}>
                      ⚠️ Using sample data only. Server connection issue detected.
                    </Text>
                    <View style={styles.refreshButtonContainer}>
                      <StackedButton
                        shape="rectangle"
                        text="TRY AGAIN"
                        onPress={handleRefresh}
                      />
                    </View>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>No base chart data available</Text>
              <StackedButton
                shape="rectangle"
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
    backgroundColor: 'transparent', // Allow AppBackground to show through
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
    fontFamily: fonts.display,
    fontSize: typography.displayMedium.fontSize,
    fontWeight: typography.displayMedium.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: {
    fontFamily: fonts.mono,
    fontSize: typography.labelSmall.fontSize,
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
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: typography.bodyMedium.fontSize,
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
    fontFamily: fonts.body,
    fontSize: typography.bodyLarge.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.bodyLarge.lineHeight,
  },
  cacheNotice: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
  },
  cacheText: {
    fontFamily: fonts.body,
    fontSize: typography.labelSmall.fontSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  mockDataNotice: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 196, 0, 0.1)',
  },
  refreshButtonContainer: {
    marginTop: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.bg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.base1,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: typography.headingSmall.fontSize,
    fontWeight: typography.headingSmall.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  dataLabel: {
    fontFamily: fonts.body,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dataValue: {
    fontFamily: fonts.mono,
    fontSize: typography.bodyMedium.fontSize,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  visualizationContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  canvasContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 242, 0.6)',
  },
  descriptionsScroll: {
    maxHeight: 300,
    width: '100%',
  },
  descriptionsContainer: {
    padding: spacing.sm,
  },
});

export default UserBaseChartScreen;
