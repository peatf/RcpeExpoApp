/**
 * @file ImpulseListItem.tsx
 * @description Component to display a single Impulse.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Replaced Button with TouchableOpacity
import { Impulse } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme
import { Ionicons } from '@expo/vector-icons'; // For potential icons on actions

export interface ImpulseListItemProps {
  impulse: Impulse;
  onEvaluate?: (impulseId: string) => void;
  onInform?: (impulseId: string) => void;
  onViewDetails?: (impulseId: string) => void; // For later drill-down
}

const ImpulseListItem: React.FC<ImpulseListItemProps> = ({ impulse, onEvaluate, onInform, onViewDetails }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onViewDetails ? () => onViewDetails(impulse.id) : undefined} disabled={!onViewDetails}>
        <Text style={styles.descriptionText}>{impulse.description}</Text>
        <View style={styles.row}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.statusText, styles[`status_${impulse.status}`]]}>{impulse.status.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.detailLabel}>Urgency:</Text>
            <Text style={styles.detailValue}>{impulse.urgencyLevel}/10</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.detailLabel}>Impact Scope:</Text>
            <Text style={styles.detailValue}>{impulse.impactScope}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.detailLabel}>Authority State:</Text>
            <Text style={styles.detailValue}>{impulse.authorityState.type} (Clarity: {impulse.authorityState.clarity?.toFixed(1) ?? 'N/A'})</Text>
        </View>

        {impulse.evaluation && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Evaluation</Text>
                <Text style={styles.detailValue}>Alignment: {impulse.evaluation.alignmentScore}/100</Text>
                <Text style={styles.detailValue}>Sustainability: {impulse.evaluation.sustainability}</Text>
                <Text style={styles.detailValue}>Notes: {impulse.evaluation.implementationNotes}</Text>
            </View>
        )}

        {impulse.informing && (
             <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informing</Text>
                <Text style={styles.detailValue}>Method: {impulse.informing.method}</Text>
                <Text style={styles.detailValue}>Stakeholders: {impulse.informing.stakeholders.join(', ')}</Text>
            </View>
        )}
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        {impulse.status === 'new' && onEvaluate && (
          <TouchableOpacity onPress={() => onEvaluate(impulse.id)} style={styles.actionButton}>
            <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.accent} />
            <Text style={[styles.actionText, {color: theme.colors.accent}]}>Evaluate</Text>
          </TouchableOpacity>
        )}
        {impulse.status === 'evaluated' && onInform && (
          <TouchableOpacity onPress={() => onInform(impulse.id)} style={styles.actionButton}>
            <Ionicons name="megaphone-outline" size={20} color={theme.colors.accent} />
            <Text style={[styles.actionText, {color: theme.colors.accent}]}>Inform</Text>
          </TouchableOpacity>
        )}
        {/* Add more actions as needed */}
      </View>
    </View>
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
  descriptionText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize, // More prominent
    fontWeight: 'bold', // Keep bold for emphasis
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: '500', // Match other labels
    marginRight: theme.spacing.xs,
    width: 110, // Adjust for alignment if needed
  },
  detailValue: {
    fontFamily: theme.fonts.body, // Use body font for values for better readability
    fontSize: theme.typography.labelSmall.fontSize, // Consistent size with label
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  statusText: { // Style for the status text itself
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: 'bold',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
    color: theme.colors.bg, // White text on colored background
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  // Specific status background colors using theme
  status_new: { backgroundColor: theme.colors.accent }, // Example: Blue
  status_evaluated: { backgroundColor: theme.colors.accentSecondary, color: theme.colors.textPrimary }, // Example: Yellowish/Orange, ensure text contrast
  status_informed: { backgroundColor: theme.colors.base4 }, // Example: Teal/Info Blue
  status_implemented: { backgroundColor: theme.colors.base5 }, // Example: Green (Success)
  status_abandoned: { backgroundColor: theme.colors.base3 },   // Example: Gray
  section: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2, // Use theme border color
  },
  sectionTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize, // Slightly larger for section titles
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2, // Use theme border color
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.xs,
    // backgroundColor: theme.colors.base1, // Subtle background for action buttons
  },
  actionText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    marginLeft: theme.spacing.xs,
    fontWeight: 'bold',
  }
});

export default ImpulseListItem;
