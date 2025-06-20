import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HDType } from '../types/humanDesign';
import { theme } from '../constants/theme'; // Import theme

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
      {tools.map(tool => (
        <ToolComponent key={tool} toolName={tool} />
      ))}
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
  toolContainer: { // Styled like an .input-panel
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
  },
  toolText: {
    fontFamily: theme.fonts.body, // Themed font
    fontSize: theme.typography.bodyMedium.fontSize, // Themed size
    color: theme.colors.textPrimary, // Themed color
  },
});

export default DecisionMakerTab;
