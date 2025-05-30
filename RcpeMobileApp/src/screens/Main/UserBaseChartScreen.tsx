import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-elements';
import apiClient from '../../services/api'; // Adjust path
import { useAuth } from '../../contexts/AuthContext'; // Adjust path
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_CHART_STORAGE_KEY_PREFIX = 'userBaseChart_';

interface BaseChartData {
  sign: string;
  rising: string;
  moon: string;
  interpretation: string;
  // Add other fields as per your API response
  fetchedAt?: number; // Timestamp to indicate when data was fetched
}

const UserBaseChartScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<BaseChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedFrom, setLastFetchedFrom] = useState<'cache' | 'network' | null>(null);

  const getStorageKey = useCallback(() => {
    return user ? `${BASE_CHART_STORAGE_KEY_PREFIX}${user.id}` : null;
  }, [user]);

  const loadCachedData = useCallback(async () => {
    const storageKey = getStorageKey();
    if (!storageKey) return null;

    try {
      const cachedDataString = await AsyncStorage.getItem(storageKey);
      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString) as BaseChartData;
        setChartData(cachedData);
        setLastFetchedFrom('cache');
        setError(null); // Clear previous errors if cache is loaded
        return cachedData;
      }
    } catch (e) {
      console.error('Failed to load base chart from cache', e);
    }
    return null;
  }, [getStorageKey]);

  const fetchChartDataFromNetwork = useCallback(async (isManualRefresh = false) => {
    if (!user || !user.id) {
      setError('User not found. Please log in again.');
      setIsLoading(false);
      if (isManualRefresh) setIsRefreshing(false);
      return;
    }

    if (!isManualRefresh) setIsLoading(true); else setIsRefreshing(true);
    setError(null);

    try {
      const response = await apiClient.get(`/users/${user.id}/base_chart`);
      console.log('Base Chart API Response:', response.data);
      if (response.data) {
        const dataToCache: BaseChartData = { ...response.data, fetchedAt: Date.now() };
        setChartData(dataToCache);
        setLastFetchedFrom('network');
        const storageKey = getStorageKey();
        if (storageKey) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(dataToCache));
        }
      } else {
        setError('No chart data found for this user.');
        // If network fails but we have cache, don't wipe chartData unless cache was null
        if (!chartData) setChartData(null);
      }
    } catch (err: any) {
      console.error('API Call Error:', err.response?.data || err.message);
      const networkErrorMsg = 'Failed to fetch base chart data. ' + (err.response?.data?.message || 'Please try again.');
      if (!chartData) { // If no cached data, show error prominently
        setError(networkErrorMsg);
        setChartData(null);
      } else { // If cache exists, show a less intrusive error or just log it
        console.warn('Network fetch failed, relying on cache:', networkErrorMsg);
        Alert.alert("Network Error", "Could not update base chart. Displaying cached data.");
      }
    } finally {
      if (!isManualRefresh) setIsLoading(false); else setIsRefreshing(false);
    }
  }, [user, getStorageKey, chartData]); // Added chartData to dependencies

  // Initial load: try cache then network
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadCachedData(); // Load cache first
      await fetchChartDataFromNetwork(); // Then try to fetch from network
      setIsLoading(false);
    };
    initialLoad();
  }, [fetchChartDataFromNetwork, loadCachedData]); // Dependencies for initial load

  const onRefresh = useCallback(() => {
    fetchChartDataFromNetwork(true);
  }, [fetchChartDataFromNetwork]);

  if (isLoading && !chartData) { // Show loading only if no data (neither cache nor fresh)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Loading Base Chart...</Text>
      </View>
    );
  }

  if (error && !chartData) { // Show error only if no data to display
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={onRefresh} />
        <Button title="Go Back" onPress={() => navigation.goBack()} containerStyle={{marginTop: 10}} />
      </View>
    );
  }

  if (!chartData) { // Fallback if no data and no error (e.g. user.id missing initially)
    return (
      <View style={styles.centered}>
        <Text>No base chart data available. Pull to refresh or try logging in again.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const displayDate = chartData.fetchedAt ? new Date(chartData.fetchedAt).toLocaleString() : 'N/A';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Your Astrological Base Chart</Card.Title>
        {lastFetchedFrom && (
          <Text style={styles.dataSourceText}>
            Displaying data from: {lastFetchedFrom} (Last updated: {displayDate})
          </Text>
        )}
        <Card.Divider />
        <View style={styles.dataContainer}>
          <Text style={styles.dataItem}><Text style={styles.dataLabel}>Sun Sign:</Text> {chartData.sign || 'N/A'}</Text>
          <Text style={styles.dataItem}><Text style={styles.dataLabel}>Rising Sign:</Text> {chartData.rising || 'N/A'}</Text>
          <Text style={styles.dataItem}><Text style={styles.dataLabel}>Moon Sign:</Text> {chartData.moon || 'N/A'}</Text>
          <Text style={styles.dataItem}><Text style={styles.dataLabel}>Interpretation:</Text></Text>
          <Text style={[styles.dataItem, styles.interpretationText]}>{chartData.interpretation || 'No interpretation available.'}</Text>
        </View>
      </Card>
      {error && chartData && ( // Show non-blocking error if displaying cached data
        <Text style={styles.minorErrorText}>Note: {error}</Text>
      )}
      <Button
        title="Back to Dashboard"
        onPress={() => navigation.navigate('Dashboard')}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  minorErrorText: {
    color: 'orange',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  dataSourceText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
    marginBottom: 10,
  },
  dataContainer: {
    padding: 10,
  },
  dataItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    lineHeight: 22,
  },
  dataLabel: {
    fontWeight: 'bold',
    color: '#222',
  },
  interpretationText: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom:10,
  },
});

export default UserBaseChartScreen;
