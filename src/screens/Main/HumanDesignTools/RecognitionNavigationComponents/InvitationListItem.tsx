/**
 * @file InvitationListItem.tsx
 * @description Component to display a single Invitation.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Replaced Button
import { Invitation } from '../../../../types/humanDesignTools';
import { theme } from '../../../../constants/theme'; // Import theme
import { Ionicons } from '@expo/vector-icons'; // For icons

export interface InvitationListItemProps {
  invitation: Invitation;
  onEvaluate?: (invitationId: string) => void;
  onRespond?: (invitationId: string, decision: "accepted" | "declined" | "negotiated") => void; // For later
  onViewDetails?: (invitationId: string) => void;
}

const InvitationListItem: React.FC<InvitationListItemProps> = ({ invitation, onEvaluate, onRespond, onViewDetails }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new': return styles.status_new;
      case 'evaluating': return styles.status_evaluating;
      case 'accepted': return styles.status_accepted;
      case 'declined': return styles.status_declined;
      case 'expired': return styles.status_expired;
      default: return styles.status_default;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.descriptionText}>{invitation.description}</Text>

      <View style={styles.row}>
        <Text style={styles.detailLabel}>From:</Text>
        <Text style={styles.detailValue}>{invitation.source.name} ({invitation.source.relationship})</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detailLabel}>Type:</Text>
        <Text style={styles.detailValue}>{invitation.invitationType}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detailLabel}>Status:</Text>
        <Text style={[styles.statusText, getStatusStyle(invitation.status)]}>{invitation.status.toUpperCase()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.detailLabel}>Received:</Text>
        <Text style={styles.detailValue}>{new Date(invitation.timeframe.receivedAt).toLocaleDateString()}</Text>
      </View>

      {invitation.initialResponse && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Initial Response</Text>
          <Text style={styles.detailValue}>Type: {invitation.initialResponse.type}</Text>
          <Text style={styles.detailValue}>Energy Shift: {invitation.initialResponse.energyShift}</Text>
          <Text style={styles.detailValue}>Notes: {invitation.initialResponse.notes}</Text>
        </View>
      )}

      {invitation.evaluation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evaluation</Text>
          <Text style={styles.detailValue}>Alignment: {(invitation.evaluation.alignment * 100).toFixed(0)}%</Text>
          <Text style={styles.detailValue}>Clarity: {(invitation.evaluation.clarity * 100).toFixed(0)}%</Text>
          <Text style={styles.detailValue}>Recognition: {(invitation.evaluation.recognitionQuality * 100).toFixed(0)}%</Text>
          <Text style={styles.detailValue}>Energy Investment: {invitation.evaluation.energyProjection.investment}</Text>
        </View>
      )}

      {invitation.response && (
         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outcome</Text>
          <Text style={styles.detailValue}>Decision: {invitation.response.decision}</Text>
          {invitation.outcome && <Text style={styles.detailValue}>Satisfaction: {invitation.outcome.satisfaction}</Text>}
        </View>
      )}

      <View style={styles.actionsContainer}>
        {invitation.status === 'new' && onEvaluate && (
          <TouchableOpacity onPress={() => onEvaluate(invitation.id)} style={styles.actionButton}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color={theme.colors.accent} />
            <Text style={[styles.actionText, { color: theme.colors.accent }]}>Evaluate</Text>
          </TouchableOpacity>
        )}
        {onViewDetails && (
          <TouchableOpacity onPress={() => onViewDetails(invitation.id)} style={styles.actionButton}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Details</Text>
          </TouchableOpacity>
        )}
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
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: 'bold',
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
    fontWeight: '500',
    marginRight: theme.spacing.xs,
    width: 90, // Adjusted width for labels like "Received:"
  },
  detailValue: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.labelSmall.fontSize, // Consistent size
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  statusText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelXSmall.fontSize, // Smaller for status chip
    fontWeight: 'bold',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
    color: theme.colors.bg, // Default text color for status (white/bg)
    textAlign: 'center',
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  // Theme-based status colors
  status_new: { backgroundColor: theme.colors.accent }, // Accent for new
  status_evaluating: { backgroundColor: theme.colors.accentSecondary, color: theme.colors.textPrimary }, // A secondary accent
  status_accepted: { backgroundColor: theme.colors.base4 }, // Example: a positive/confirm color from theme (like a green)
  status_declined: { backgroundColor: theme.colors.base3 },  // Example: a muted/error color
  status_expired: { backgroundColor: theme.colors.base2 },   // Muted
  status_default: { backgroundColor: theme.colors.base2 },
  section: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.base2,
  },
  sectionTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize,
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
    borderTopColor: theme.colors.base2,
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.xs,
  },
  actionText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    marginLeft: theme.spacing.xs,
    fontWeight: 'bold',
  },
});

export default InvitationListItem;
