/**
 * @file LogListItem.tsx
 * @description Component to display a single log entry in a list.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogEntry } from '../../../../types/humanDesignTools'; // Adjusted path

/**
 * @interface LogListItemProps
 * @description Props for the LogListItem component.
 * @property {LogEntry} entry - The log entry data to display.
 * @property {(entryId: string) => void} [onPress] - Optional callback for when the item is pressed.
 */
export interface LogListItemProps {
  entry: LogEntry;
  onPress?: (entryId: string) => void;
}

const LogListItem: React.FC<LogListItemProps> = ({ entry, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(entry.id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {new Date(entry.timestamp).toLocaleDateString()} - {new Date(entry.timestamp).toLocaleTimeString()}
        </Text>
        <Text style={styles.mediaTypeText}>Type: {entry.mediaType}</Text>
      </View>
      <Text style={styles.contentText}>{entry.content}</Text>
      <View style={styles.footer}>
        {entry.tags && entry.tags.length > 0 && (
          <Text style={styles.tagsText}>Tags: {entry.tags.join(', ')}</Text>
        )}
        <Text style={styles.authorityText}>
          Authority: {entry.authorityData.type}
          {entry.authorityData.state ? ` (${entry.authorityData.state})` : ''}
          {entry.authorityData.intensity !== undefined ? ` Intensity: ${entry.authorityData.intensity}` : ''}
        </Text>
      </View>
      {entry.clarityMarker && (
        <View style={styles.claritySection}>
          <Text style={styles.clarityText}>
            Clarity Marked: {entry.clarityMarker.isClarity ? 'Yes' : 'No'}
            {entry.clarityMarker.notes ? ` - ${entry.clarityMarker.notes}` : ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16, // Match InfoCard horizontal margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#555',
  },
  mediaTypeText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  tagsText: {
    fontSize: 12,
    color: '#007bff', // Blue for tags
    marginBottom: 4,
  },
  authorityText: {
    fontSize: 12,
    color: '#28a745', // Green for authority info
  },
  claritySection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clarityText: {
    fontSize: 12,
    color: '#663399', // Purple for clarity info
  }
});

export default LogListItem;
