import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HDType } from '../types/humanDesign'; // Ensure this path is correct

interface DecisionMakerTabProps {
  userType: HDType;
}

// Placeholder for actual tool components - replace later
const ToolComponent: React.FC<{ toolName: string }> = ({ toolName }) => (
  <View style={styles.toolContainer}>
    <Text style={styles.toolText}>{toolName}</Text>
  </View>
);

const DecisionMakerTab: React.FC<DecisionMakerTabProps> = ({ userType }) => {
  const getToolsForType = (type: HDType): string[] => {
    switch (type) {
      case 'Generator':
      case 'Manifesting Generator': // Manifesting Generators often use Generator tools
        return ['Response Inventory', 'Sacral Check-In'];
      case 'Projector':
        return ['Invitation Tracker', 'Energy Management'];
      case 'Manifestor':
        return ['Impact Assessment', 'Initiative Tracker'];
      case 'Reflector':
        return ['Lunar Cycle Log', 'Community Pulse'];
      default:
        // Should not happen with a defined HDType, but good for safety
        const exhaustiveCheck: never = type;
        console.warn(`Unknown HDType: ${exhaustiveCheck}`);
        return [];
    }
  };

  const tools = getToolsForType(userType);

  if (tools.length === 0 && userType) {
    return (
      <View style={styles.container}>
        <Text>No specific tools identified for type: {userType}.</Text>
      </View>
    );
  }

  if (!userType) {
    return (
      <View style={styles.container}>
        <Text>User type not available.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tools for {userType}:</Text>
      {tools.map(tool => (
        <ToolComponent key={tool} toolName={tool} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toolContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  toolText: {
    fontSize: 16,
  },
});

export default DecisionMakerTab;
