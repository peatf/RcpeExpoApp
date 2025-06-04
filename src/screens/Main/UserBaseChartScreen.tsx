/**
 * @file UserBaseChartScreen.tsx
 * @description Screen for displaying user's base energy chart
 */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import baseChartService, {BaseChartData} from '../../services/baseChartService';

const UserBaseChartScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, isAuthenticated, isLoading: authLoading} = useAuth();
  const [chartData, setChartData] = useState<BaseChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadBaseChart = useCallback(async (forceRefresh = false) => {
    // Check authentication state first
    if (!isAuthenticated) {
      setError('Please log in to view your base chart');
      return;
    }

    if (!user?.id) {
      setError('User profile not found. Please try logging in again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading base chart for user:', user.id);
      const result = await baseChartService.getUserBaseChart(user.id, forceRefresh);
      
      if (result.success && result.data) {
        setChartData(result.data);
        setFromCache(result.fromCache || false);
        console.log('Base chart loaded successfully, from cache:', result.fromCache);
      } else {
        const errorMsg = result.error || 'Failed to load base chart';
        console.error('Failed to load base chart:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Error loading base chart:', err);
      
      // Handle different types of errors
      if (err.message?.includes('Authentication required')) {
        setError('Please log in again to access your base chart');
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

  useEffect(() => {
    // Wait for auth loading to complete before attempting to load chart
    if (!authLoading && isAuthenticated && user?.id) {
      loadBaseChart();
    } else if (!authLoading && !isAuthenticated) {
      setError('Please log in to view your base chart');
    }
  }, [user?.id, loadBaseChart, authLoading, isAuthenticated]);

  const handleRefresh = () => {
    loadBaseChart(true);
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Base Chart</Text>
        <Text style={styles.subtitle}>Your energy profile foundation</Text>
        {fromCache && (
          <Text style={styles.cacheIndicator}>Data from cache</Text>
        )}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {authLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Checking authentication...</Text>
          </View>
        ) : !isAuthenticated ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Please log in to access your base chart</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.retryText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading base chart...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadBaseChart()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : chartData ? (
          <View style={styles.content}>
            {baseChartService.getChartSections(chartData).map(section =>
              renderChartSection(section.title, section.data)
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No base chart data available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadBaseChart()}>
              <Text style={styles.retryText}>Load Chart</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  cacheIndicator: {
    fontSize: 12,
    color: '#28a745',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  refreshText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default UserBaseChartScreen;
