/**
 * @file InvitationListItem.tsx
 * @description Component to display a single Invitation.
 */
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Invitation } from '../../../../types/humanDesignTools'; // Adjusted path

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
          <Button title="Evaluate" onPress={() => onEvaluate(invitation.id)} color="#007bff" />
        )}
        {/* Add more buttons based on status, e.g., Respond, View Details */}
        {onViewDetails && <Button title="Details" onPress={() => onViewDetails(invitation.id)} color="#6c757d" />}
      </View>
    </View>
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
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334d6e', // Projector theme color
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 13,
    color: '#5c6ac4', // Projector accent
    fontWeight: '600',
    marginRight: 5,
    width: 80,
  },
  detailValue: {
    fontSize: 13,
    color: '#334d6e',
    flexShrink: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: 'white',
    textAlign: 'center',
    overflow: 'hidden',
  },
  status_new: { backgroundColor: '#007bff' },          // Blue
  status_evaluating: { backgroundColor: '#ffc107', color: '#000' }, // Yellow
  status_accepted: { backgroundColor: '#28a745' },      // Green
  status_declined: { backgroundColor: '#dc3545' },      // Red
  status_expired: { backgroundColor: '#6c757d' },       // Gray
  status_default: { backgroundColor: '#6c757d' },
  section: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5c6ac4',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons more
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
  },
});

export default InvitationListItem;
