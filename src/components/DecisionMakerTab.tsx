import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HDType } from '../types/humanDesign';
import { theme } from '../constants/theme'; // Import theme
import ResponseIntelligenceScreen from '../screens/Main/HumanDesignTools/ResponseIntelligenceScreen';
import RecognitionNavigationScreen from '../screens/Main/HumanDesignTools/RecognitionNavigationScreen';
import ImpulseIntegrationScreen from '../screens/Main/HumanDesignTools/ImpulseIntegrationScreen';
import EnvironmentalAttunementScreen from '../screens/Main/HumanDesignTools/EnvironmentalAttunementScreen';
import SacralCheckIn from './SacralCheckIn';

interface DecisionMakerTabProps {
  userType: HDType;
}

// Component to render the actual tool content
const ToolContentComponent: React.FC<{ toolName: string }> = ({ toolName }) => {
  switch (toolName) {
    case 'Response Inventory':
      return <ResponseIntelligenceScreen />;
    case 'Sacral Check-In':
      return <SacralCheckIn />;
    case 'Invitation Tracker':
      return <RecognitionNavigationScreen />;
    case 'Energy Management':
      return <RecognitionNavigationScreen />; // Using Recognition Navigation for energy management too
    case 'Impact Assessment':
      return <ImpulseIntegrationScreen />;
    case 'Initiative Tracker':
      return <ImpulseIntegrationScreen />; // Using Impulse Integration for initiative tracking too
    case 'Lunar Cycle Log':
      return <EnvironmentalAttunementScreen />;
    case 'Community Pulse':
      return <EnvironmentalAttunementScreen />; // Using Environmental Attunement for community pulse too
    default:
      return (
        <View style={styles.toolContentContainer}>
          <Text style={styles.toolText}>Tool: {toolName}</Text>
          <Text style={styles.subText}>Component not yet implemented</Text>
        </View>
      );
  }
};

const DecisionMakerTab: React.FC<DecisionMakerTabProps> = ({ userType }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    // In a real app, this might involve navigation or showing different content
    console.log(`Selected tool: ${toolName}`);
  };

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
        <Text style={styles.fallbackText}>No specific tools identified for type: {userType}.</Text>
      </View>
    );
  }

  if (!userType) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>User type not available.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tools for {userType}:</Text>
      <View style={styles.tabsContainer}>
        {tools.map(tool => (
          <TouchableOpacity
            key={tool}
            style={[
              styles.toolTab,
              selectedTool === tool && styles.toolTabSelected
            ]}
            onPress={() => handleSelectTool(tool)}
          >
            <Text
              style={[
                styles.toolTabText,
                selectedTool === tool && styles.toolTabTextSelected
              ]}
            >
              {tool}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display content for the selected tool */}
      {selectedTool && (
        <ToolContentComponent toolName={selectedTool} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md, // Use theme spacing
  },
  header: {
    fontFamily: theme.fonts.mono, // Themed font
    fontSize: theme.typography.headingMedium.fontSize, // Themed size
    fontWeight: theme.typography.headingMedium.fontWeight, // Themed weight
    color: theme.colors.textPrimary, // Themed color
    marginBottom: theme.spacing.md, // Use theme spacing
  },
  fallbackText: { // Style for "No specific tools..." or "User type not available."
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap', // Allow tabs to wrap
  },
  toolTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base2,
    borderRadius: theme.borderRadius.full, // Pill shape
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm, // For wrapping
    backgroundColor: theme.colors.bg,
  },
  toolTabSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  toolTabText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.textPrimary,
  },
  toolTabTextSelected: {
    color: theme.colors.bg, // White text on accent bg
  },
  toolContentContainer: { // Styled like an .input-panel
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Keeping this for distinct content area
    marginTop: theme.spacing.md, // Space above content area
  },
  toolText: { // For text inside ToolContentComponent
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary,
  },
  subText: { // For descriptive text inside ToolContentComponent
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default DecisionMakerTab;
