/**
 * @file ResponseListItem.tsx
 * @description Component to display a single Sacral Response entry.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Response as SacralResponseType } from '../../../../types/humanDesignTools'; // Adjusted path

/**
 * @interface ResponseListItemProps
 * @description Props for the ResponseListItem component.
 * @property {SacralResponseType} response - The sacral response data to display.
 * @property {(responseId: string) => void} [onPress] - Optional callback for when the item is pressed.
 * @property {(responseId: string, satisfaction: number) => void} [onRecordSatisfaction] - Optional callback to record satisfaction.
 */
export interface ResponseListItemProps {
  response: SacralResponseType;
  onPress?: (responseId: string) => void;
  onRecordSatisfaction?: (responseId: string, satisfaction: number) => void;
}

const ResponseListItem: React.FC<ResponseListItemProps> = ({ response, onPress, onRecordSatisfaction }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(response.id);
    }
  };

  // Example satisfaction levels, could be more dynamic
  const satisfactionLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {new Date(response.timestamp).toLocaleDateString()} - {new Date(response.timestamp).toLocaleTimeString()}
        </Text>
        <Text style={[
            styles.responseType,
            response.responseType === 'yes' ? styles.yesResponse : styles.noResponse
          ]}
        >
          {response.responseType.toUpperCase()} (Strength: {response.responseStrength}/10)
        </Text>
      </View>

      {response.question && <Text style={styles.questionText}>Q: {response.question}</Text>}

      <View style={styles.detailsRow}>
        <Text style={styles.detailItem}>Energy: {response.energy.before} → {response.energy.after} (Shift: {response.energy.shift})</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailItem}>Physical: {response.physical.sensations.join(', ')} in {response.physical.locations.join(', ')} (Intensity: {response.physical.intensity}/10)</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailItem}>Context: {response.context.category} in {response.context.environment} ({response.context.timeOfDay}), Importance: {response.context.importance}/10</Text>
      </View>

      {response.distortion.detected && (
        <Text style={styles.distortionText}>Distortion: {response.distortion.type} - {response.distortion.notes}</Text>
      )}

      {response.satisfaction && (
        <Text style={styles.satisfactionText}>Satisfaction: {response.satisfaction.level}/10 - {response.satisfaction.notes}</Text>
      )}

      {onRecordSatisfaction && !response.satisfaction && (
        <View style={styles.satisfactionCapture}>
          <Text style={styles.satisfactionLabel}>Rate Satisfaction:</Text>
          <View style={styles.satisfactionButtons}>
            {satisfactionLevels.slice(0,5).map(level => ( // Show 1-5 for brevity
              <TouchableOpacity key={level} style={styles.satisfactionButton} onPress={() => onRecordSatisfaction(response.id, level)}>
                <Text style={styles.satisfactionButtonText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  responseType: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: 'white',
  },
  yesResponse: {
    backgroundColor: '#4CAF50', // Green
  },
  noResponse: {
    backgroundColor: '#F44336', // Red
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  detailsRow: {
    marginBottom: 5,
  },
  detailItem: {
    fontSize: 13,
    color: '#454545',
    lineHeight: 18,
  },
  distortionText: {
    fontSize: 13,
    color: '#E67E22', // Orange for distortion
    fontStyle: 'italic',
    marginTop: 5,
  },
  satisfactionText: {
    fontSize: 13,
    color: '#3498DB', // Blue for satisfaction
    fontWeight: 'bold',
    marginTop: 5,
  },
  satisfactionCapture: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  satisfactionLabel: {
    fontSize: 13,
    color: '#333',
    marginBottom: 5,
  },
  satisfactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  satisfactionButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  satisfactionButtonText: {
    fontSize: 13,
  }
});

export default ResponseListItem;
