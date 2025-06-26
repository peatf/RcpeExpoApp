import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme'; // Assuming theme path

interface ChoiceCardProps {
  title: string;
  description?: string;
  onPress: () => void;
  isSelected?: boolean;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ title, description, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
    >
      <Text style={[styles.title, isSelected && styles.selectedText]}>{title}</Text>
      {description && (
        <Text style={[styles.description, isSelected && styles.selectedTextSecondary]}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base2,
    ...theme.shadows.small,
  },
  selectedCard: {
    backgroundColor: theme.colors.accentSecondary,
    borderColor: theme.colors.accent,
  },
  title: {
    ...theme.typography.headingSmall,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
  },
  selectedText: {
    color: theme.colors.accent, // Or a color that contrasts with accentSecondary
  },
  selectedTextSecondary: {
    color: theme.colors.accent, // Or a darker shade for description on selected
  }
});

export default ChoiceCard;
