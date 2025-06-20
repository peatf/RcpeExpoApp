/**
 * @file LogListItem.tsx
 * @description Component to display a single log entry in a list.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogEntry, AuthorityType } from '../../../../types/humanDesignTools'; // Adjusted path
import { theme } from '../../../../constants/theme'; // Import full theme

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

  // Determine dot color based on some logic, e.g., entry type or a specific tag
  // For now, a default or simple dynamic color.
  const dotColor = entry.tags?.includes('important')
    ? theme.colors.accent
    : theme.colors.base3;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.timestampText}>
          {new Date(entry.timestamp).toLocaleDateString()} - {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={[styles.dotIndicator, { backgroundColor: dotColor }]} />
      </View>
      <Text style={styles.contentText}>{entry.content}</Text>

      {/* Optional: Footer for tags or other metadata if needed, styled simply */}
      {(entry.tags && entry.tags.length > 0) || entry.authorityData?.type ? (
        <View style={styles.footer}>
          {entry.tags && entry.tags.length > 0 && (
            <Text style={styles.tagsText}>Tags: {entry.tags.join(', ')}</Text>
          )}
          {/* Authority data could be displayed more subtly if desired */}
          {/* <Text style={styles.authorityText}>
            Authority: {entry.authorityData.type}
            {entry.authorityData.state ? ` (${entry.authorityData.state})` : ''}
          </Text> */}
        </View>
      ) : null}

      {/* Clarity marker can also be part of the footer or styled as a small badge/text */}
      {entry.clarityMarker?.isClarity && (
         <Text style={styles.clarityText}>
           Clarity: {entry.clarityMarker.notes || 'Marked'}
         </Text>
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
    marginBottom: theme.spacing.md, // space-y-4 if items are directly one after another
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the start of the cross axis
    marginBottom: theme.spacing.sm,
  },
  timestampText: { // Renamed from dateText
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: theme.spacing.sm, // Space it from the timestamp if on same line end
    marginTop: theme.spacing.xs, // Align with text line
  },
  // mediaTypeText removed as per HTML reference (dot indicator is used)
  contentText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.bodyMedium.lineHeight,
  },
  footer: { // Optional footer
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2, // Use a subtle border
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  tagsText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.accent, // Accent color for tags
    marginBottom: theme.spacing.xs,
  },
  // authorityText style removed for now to simplify, can be added back if needed
  // claritySection removed, clarityText is now standalone if present
  clarityText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.accentSecondary, // A different accent for clarity
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  }
});

export default LogListItem;
