import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import baseChartService from '../../services/baseChartService';
import blueprintVisualizerService from '../../services/blueprintVisualizerService';
import BlueprintCanvas from '../../components/EnergeticBlueprint/BlueprintCanvas';
import BlueprintDescription from '../../components/EnergeticBlueprint/BlueprintDescription';

const EnergeticBlueprintScreen: React.FC<{navigation: any}> = ({ navigation }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  const screenWidth = Dimensions.get('window').width;
  const isLandscape = Dimensions.get('window').width > Dimensions.get('window').height;
  
  // Calculate canvas size - square based on available space
  const canvasSize = isLandscape 
    ? Dimensions.get('window').height * 0.8 
    : screenWidth * 0.9;

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      loadChartData();
    }
  }, [user?.id, authLoading, isAuthenticated]);

  const loadChartData = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to use the optimized visualization endpoint first
      const result = await blueprintVisualizerService.getOptimizedVisualizationData(
        user?.id || '', 
        true // Use visualization endpoint
      );
      
      if (result.success && result.data) {
        setChartData(result.data);
      } else {
        // Fallback to base chart service
        console.log('Visualization endpoint failed, falling back to base chart service:', result.error);
        const fallbackResult = await blueprintVisualizerService.getOptimizedVisualizationData(
          user?.id || '', 
          false // Use base chart fallback
        );
        if (fallbackResult.success && fallbackResult.data) {
          setChartData(fallbackResult.data);
        } else {
          setError(fallbackResult.error || 'Failed to load chart data');
        }
      }
    } catch (err: any) {
      console.error('Error loading chart data:', err);
      setError(err.message || 'An error occurred while loading chart data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHighlight = (category: string) => {
    setHighlightedCategory(category === highlightedCategory ? null : category);
  };

  const getDescriptions = useCallback(() => {
    if (!chartData) return [];
    
    const descriptionsMap = {
      "Energy Family": (d: any) => `Core identity shaped by a ${d.profile_lines} profile, radiating from the ${d.astro_sun_sign} frequency in the ${d.astro_sun_house} house.`,
      "Energy Class": (d: any) => `Interface with the world, projecting a ${d.ascendant_sign} aura, guided by the ${d.incarnation_cross_quarter} quarter.`,
      "Processing Core": (d: any) => `Information processed via ${d.cognition_variable} cognition, with ${d.head_state}, ${d.ajna_state}, and ${d.emotional_state} centers.`,
      "Decision & Growth Vector": (d: any) => `Navigates via ${d.strategy} & ${d.authority}, with a ${d.choice_navigation_spectrum} flow, driven by ${d.astro_mars_sign}.`,
      "Drive Mechanics": (d: any) => `Fueled by ${d.motivation_color} motivation. The field has a ${d.kinetic_drive_spectrum} kinetic quality and a ${d.resonance_field_spectrum} resonance.`,
      "Manifestation Interface + Rhythm": (d: any) => `Expression from a ${d.throat_definition} Throat, with ${d.throat_gates} gates creating a ${d.manifestation_rhythm_spectrum} rhythm.`,
      "Energy Architecture": (d: any) => `A ${d.definition_type} system. Core integrity based on channels like ${d.channel_list === 'None' ? 'none' : d.channel_list}.`,
      "Evolutionary Path": (d: any) => `Guided by a ${d.conscious_line}/${d.unconscious_line} path within the ${d.incarnation_cross} framework.`
    };
    
    return Object.keys(descriptionsMap).map(category => ({
      category,
      description: descriptionsMap[category as keyof typeof descriptionsMap](chartData)
    }));
  }, [chartData]);

  const renderContent = () => {
    if (isLoading || authLoading) {
      return (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#212121" />
          <Text style={styles.loadingText}>Loading your energetic blueprint...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => loadChartData(true)}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (!chartData) {
      return (
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>No blueprint data available</Text>
          <TouchableOpacity style={styles.button} onPress={() => loadChartData(true)}>
            <Text style={styles.buttonText}>Generate Blueprint</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={isLandscape ? styles.landscapeContainer : styles.portraitContainer}>
        <View style={[styles.canvasContainer, {width: canvasSize, height: canvasSize}]}>
          <BlueprintCanvas 
            data={chartData} 
            highlightedCategory={highlightedCategory} 
            width={canvasSize} 
            height={canvasSize} 
            onCanvasReady={() => setCanvasReady(true)}
          />
          {!canvasReady && (
            <View style={styles.canvasOverlay}>
              <ActivityIndicator size="large" color="#212121" />
            </View>
          )}
        </View>
        
        <ScrollView 
          style={isLandscape ? styles.landscapeSidebar : styles.portraitSidebar}
          contentContainerStyle={styles.descriptionContainer}
        >
          <Text style={styles.title}>Energetic Blueprint</Text>
          <Text style={styles.subtitle}>A dynamic visualization of your unique energetic signature</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => loadChartData(true)}
          >
            <Text style={styles.buttonText}>[ Generate New Blueprint ]</Text>
          </TouchableOpacity>
          
          <View style={styles.descriptionsWrapper}>
            {getDescriptions().map((item, index) => (
              <BlueprintDescription 
                key={`desc-${index}`}
                category={item.category}
                description={item.description}
                isHighlighted={highlightedCategory === item.category}
                onPress={() => handleHighlight(item.category)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E9',
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  portraitContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F4E9',
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 244, 233, 0.7)',
  },
  landscapeSidebar: {
    flex: 1,
    backgroundColor: 'rgba(239, 234, 224, 0.5)',
    borderLeftWidth: 2,
    borderLeftColor: '#DCD7C5',
  },
  portraitSidebar: {
    flex: 1,
    backgroundColor: 'rgba(239, 234, 224, 0.5)',
    borderTopWidth: 2,
    borderTopColor: '#DCD7C5',
  },
  descriptionContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#212121',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F4E9',
  },
  descriptionsWrapper: {
    marginTop: 16,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default EnergeticBlueprintScreen;