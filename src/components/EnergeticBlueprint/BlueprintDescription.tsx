import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BlueprintDescriptionProps {
  category: string;
  description: string;
  isHighlighted: boolean;
  onPress: () => void;
}

const BlueprintDescription: React.FC<BlueprintDescriptionProps> = ({
  category,
  description,
  isHighlighted,
  onPress
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isHighlighted && styles.highlighted]} 
      onPress={onPress}
    >
      <Text style={styles.title}>{category.toUpperCase()}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#F8F4E9',
  },
  highlighted: {
    backgroundColor: '#EFEAE0',
    borderLeftColor: '#212121',
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  }
});

export default BlueprintDescription;