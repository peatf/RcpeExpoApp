import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../../navigation/MainTabNavigator'; // Adjust path if this screen is in a different navigator

// Assuming it's part of MainTabParamList for now, or a new StackParamList
// If it's part of a stack that includes MainTab, the param list needs to be defined there.
// For simplicity, let's assume it could be reached via a modified MainTabParamList or a dedicated stack.

// Let's define a new ParamList or extend an existing one if appropriate.
// For this example, let's assume we add it to a new stack or directly.
// This type should ideally be part of the navigator that hosts this screen.
type ToolResultScreenRouteProp = RouteProp<{ ToolResult: { toolName: string; resultId: string } }, 'ToolResult'>;

interface Props {
  route: ToolResultScreenRouteProp;
  navigation: any; // Add specific navigation prop type if available
}

const ToolResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { toolName, resultId } = route.params || { toolName: 'Unknown', resultId: 'Unknown' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Tool Result</Text>
      <Text style={styles.text}>Tool: {toolName}</Text>
      <Text style={styles.text}>Result ID: {resultId}</Text>
      <Text style={styles.text}>Details for this result would be fetched and displayed here.</Text>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ToolResultScreen;
