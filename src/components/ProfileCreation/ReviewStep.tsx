/**
 * @file ReviewStep.tsx
 * @description Step 4: Review all data before submission
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BirthData, TypologyResponse, MasteryResponse } from '../../types';
import { TYPOLOGY_SPECTRUMS, MASTERY_SECTIONS } from '../../data/quizData';
import { theme } from '../../constants/theme'; // Import theme

interface ReviewStepProps {
  birthData: BirthData;
  typologyResponses: TypologyResponse;
  masteryResponses: MasteryResponse;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  birthData,
  typologyResponses,
  masteryResponses,
  onSubmit,
  onPrevious,
  isSubmitting,
}) => {
  const getSpectrumName = (spectrumId: string): string => {
    const spectrum = TYPOLOGY_SPECTRUMS.find(s => s.id === spectrumId);
    return spectrum?.name || spectrumId;
  };

  const getQuestionText = (questionId: string): string => {
    for (const section of MASTERY_SECTIONS) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        return question.text;
      }
    }
    return questionId;
  };

  const getOptionText = (questionId: string, value: string): string => {
    for (const section of MASTERY_SECTIONS) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        const option = question.options.find(o => o.value === value);
        return option?.text || value;
      }
    }
    return value;
  };

  const formatValue = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Review Your Profile</Text>
        <Text style={styles.stepDescription}>
          Please review your information before creating your profile.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Birth Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birth Information</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Birth Date:</Text>
            <Text style={styles.dataValue}>{birthData.birth_date}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Birth Time:</Text>
            <Text style={styles.dataValue}>{birthData.birth_time}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>City:</Text>
            <Text style={styles.dataValue}>{birthData.city_of_birth}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Country:</Text>
            <Text style={styles.dataValue}>{birthData.country_of_birth}</Text>
          </View>
        </View>

        {/* Typology Responses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typology Spectrums</Text>
          {Object.entries(typologyResponses).map(([spectrumId, value]) => (
            <View key={spectrumId} style={styles.dataRow}>
              <Text style={styles.dataLabel}>{getSpectrumName(spectrumId)}:</Text>
              <Text style={styles.dataValue}>{formatValue(value)}</Text>
            </View>
          ))}
        </View>

        {/* Mastery Responses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mastery Assessment</Text>
          {Object.entries(masteryResponses).map(([questionId, value]) => (
            <View key={questionId} style={styles.masteryRow}>
              <Text style={styles.masteryQuestion} numberOfLines={2}>
                {getQuestionText(questionId)}
              </Text>
              <Text style={styles.masteryAnswer} numberOfLines={3}>
                {getOptionText(questionId, value)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            • Birth Data: Complete{'\n'}
            • Typology Spectrums: {Object.keys(typologyResponses).length} of {TYPOLOGY_SPECTRUMS.length} answered{'\n'}
            • Mastery Questions: {Object.keys(masteryResponses).length} answered
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.previousButton} 
          onPress={onPrevious}
          disabled={isSubmitting}
        >
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingContainer}>
              <ActivityIndicator size="small" color={theme.colors.bg} />
              <Text style={styles.submittingText}>Creating Profile...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Create Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.bg, // Updated
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base1, // Updated
  },
  dataLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    flex: 1,
    textAlign: 'right',
  },
  masteryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base1, // Updated
  },
  masteryQuestion: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginBottom: 4,
    lineHeight: 20,
  },
  masteryAnswer: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    lineHeight: 20,
  },
  summary: {
    backgroundColor: theme.colors.accentGlow, // Updated
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.accent, // Updated
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent, // Updated
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.textPrimary, // Updated
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: theme.colors.base3, // Updated
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.accent, // Updated (Note: success color)
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.base3, // Updated
  },
  submitButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submittingText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
});
