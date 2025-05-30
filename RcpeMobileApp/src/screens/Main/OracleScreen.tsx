import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Card, Icon } from 'react-native-elements';
import apiClient from '../../services/api'; // Adjust path as needed

// Define the shape of the Oracle's response (adjust as needed)
interface OracleResponse {
  guidance: string; // Assuming the main content is in a 'guidance' field
  // Add other fields your Oracle API returns
}

const OracleScreen = () => {
  const [query, setQuery] = useState('');
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConsultOracle = async () => {
    if (!query.trim()) {
      Alert.alert('Empty Query', 'Please enter your question or topic for the Oracle.');
      return;
    }
    setIsLoading(true);
    setOracleResponse(null); // Clear previous response
    try {
      console.log('Consulting Oracle with query:', query);
      // Replace with your actual API call and request body structure
      const response = await apiClient.post<OracleResponse>('/ai/oracle', { question: query });
      console.log('API Response:', response.data);

      if (response.data && response.data.guidance) {
        setOracleResponse(response.data.guidance);
      } else {
        // Handle cases where guidance might be missing or in a different format
        setOracleResponse('The Oracle provided a response, but it could not be displayed in the expected format.');
        console.warn('Oracle response format unexpected:', response.data);
      }
      setQuery(''); // Clear input after successful query
    } catch (error: any) {
      console.error('API Call Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to consult the Oracle. ' + (error.response?.data?.message || 'Please try again.'));
      setOracleResponse('An error occurred while trying to reach the Oracle.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Consult the Oracle</Card.Title>
        <Card.Divider />
        <Text style={styles.description}>
          Seek guidance from the Oracle. Enter your question or topic below.
        </Text>
        <Input
          placeholder="Enter your question..."
          value={query}
          onChangeText={setQuery}
          multiline
          numberOfLines={3}
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputBox}
        />
        <Button
          title="Consult Oracle"
          onPress={handleConsultOracle}
          loading={isLoading}
          icon={<Icon name="comment-question" type="material-community" color="white" containerStyle={styles.buttonIconContainer}/>}
          buttonStyle={styles.submitButton}
          containerStyle={styles.buttonContainer}
          disabled={isLoading}
        />
      </Card>

      {isLoading && !oracleResponse && (
        <ActivityIndicator size="large" color="tomato" style={styles.loadingIndicator} />
      )}

      {oracleResponse && (
        <Card containerStyle={styles.responseCard}>
          <Card.Title style={styles.responseTitle}>Oracle's Guidance</Card.Title>
          <Card.Divider />
          {/*
            TODO: Implement rich text display if oracleResponse is HTML or Markdown.
            For now, displaying as plain text.
            Consider using libraries like 'react-native-render-html' or 'react-native-markdown-display'.
          */}
          <Text style={styles.responseText}>{oracleResponse}</Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 15,
    paddingBottom: 10, // Reduced padding as button is inside
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginVertical: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6200ea', // A deep purple color
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonIconContainer: {
    marginRight: 10,
  },
  loadingIndicator: {
    marginTop: 30,
  },
  responseCard: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff', // White background for response
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6200ea', // Matching button color
    textAlign: 'center',
  },
  responseText: {
    fontSize: 15,
    lineHeight: 22, // For better readability
    padding: 10,
    color: '#333',
  },
});

export default OracleScreen;
