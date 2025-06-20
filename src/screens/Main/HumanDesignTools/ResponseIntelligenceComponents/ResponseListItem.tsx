/**
 * @file ResponseListItem.tsx
 * @description Component to display a single Sacral Response entry.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Response as SacralResponseType } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme

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
  container: { // Styled as .input-panel
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
  },
  responseType: { // Chip-like style for YES/NO
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize, // Make it small like a tag
    fontWeight: 'bold',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.xs,
    color: theme.colors.bg, // Text color on chip (usually white/bg)
    textTransform: 'uppercase',
  },
  yesResponse: {
    backgroundColor: theme.colors.accent, // Use accent for YES
  },
  noResponse: {
    backgroundColor: theme.colors.base4, // Use a contrasting/negative color for NO
  },
  questionText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: '500', // Semi-bold for question
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontStyle: 'italic', // Italicize question
  },
  detailsRow: {
    marginBottom: theme.spacing.xs,
  },
  detailItem: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.labelSmall.lineHeight,
  },
  distortionText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.accentSecondary, // Use a warning/notice color
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  satisfactionText: { // For already recorded satisfaction
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize, // Slightly more prominent
    color: theme.colors.accent, // Use accent color
    fontWeight: 'bold',
    marginTop: theme.spacing.sm,
  },
  satisfactionCapture: { // Container for "Rate Satisfaction"
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2, // Subtle separator
  },
  satisfactionLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  satisfactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out buttons
    flexWrap: 'wrap', // Allow wrapping if many buttons
    gap: theme.spacing.xs, // Gap between buttons
  },
  satisfactionButton: {
    backgroundColor: theme.colors.base2,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm, // Consistent border radius
    minWidth: 30, // Ensure touchable area
    alignItems: 'center',
  },
  satisfactionButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textPrimary,
  }
});

export default ResponseListItem;
