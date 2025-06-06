/**
 * @file ImpulseListItem.tsx
 * @description Component to display a single Impulse.
 */
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Impulse } from '../../../../types/humanDesignTools'; // Adjusted path

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
          <Button title="Evaluate" onPress={() => onEvaluate(impulse.id)} color="#007bff" />
        )}
        {impulse.status === 'evaluated' && onInform && (
          <Button title="Record Informing" onPress={() => onInform(impulse.id)} color="#28a745" />
        )}
        {/* Add more actions as needed, e.g., for implemented, abandoned */}
      </View>
    </View>
  );
};

// Add missing import for TouchableOpacity
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginRight: 5,
    width: 100, // For alignment
  },
  detailValue: {
    fontSize: 13,
    color: '#444',
    flexShrink: 1, // Wrap text
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    color: 'white',
    overflow: 'hidden', // Ensure border radius clips background on some Android versions
  },
  status_new: { backgroundColor: '#007bff' /* Blue */ },
  status_evaluated: { backgroundColor: '#ffc107' /* Yellow */, color: '#333'},
  status_informed: { backgroundColor: '#17a2b8' /* Teal */ },
  status_implemented: { backgroundColor: '#28a745' /* Green */ },
  status_abandoned: { backgroundColor: '#6c757d' /* Gray */ },
  section: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default ImpulseListItem;
