/**
 * @file TypologyQuizStep.tsx
 * @description Step 2: Typology spectrums quiz
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TYPOLOGY_SPECTRUMS } from '../../data/quizData';
import { TypologyResponse, QuizQuestion, QuizOption } from '../../types';

interface TypologyQuizStepProps {
  initialResponses: TypologyResponse;
  onComplete: (responses: TypologyResponse) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const TypologyQuizStep: React.FC<TypologyQuizStepProps> = ({
  initialResponses,
  onComplete,
  onPrevious,
}) => {
  const [responses, setResponses] = useState<TypologyResponse>(initialResponses);

  const handleOptionSelect = (spectrumId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [spectrumId]: value,
    }));
  };

  const validateResponses = (): boolean => {
    const requiredSpectrums = TYPOLOGY_SPECTRUMS.map(spectrum => spectrum.id);
    const missingResponses = requiredSpectrums.filter(
      spectrumId => !responses[spectrumId as keyof TypologyResponse]
    );

    if (missingResponses.length > 0) {
      Alert.alert(
        'Incomplete Quiz',
        'Please answer all questions before proceeding.'
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateResponses()) {
      onComplete(responses);
    }
  };

  const renderQuestion = (question: QuizQuestion, spectrumId: string) => (
    <View key={question.id} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option: QuizOption) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              responses[spectrumId as keyof TypologyResponse] === option.value &&
                styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(spectrumId, option.value)}
          >
            <Text
              style={[
                styles.optionText,
                responses[spectrumId as keyof TypologyResponse] === option.value &&
                  styles.selectedOptionText,
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSpectrum = (spectrum: any) => (
    <View key={spectrum.id} style={styles.spectrumContainer}>
      <View style={styles.spectrumHeader}>
        <Text style={styles.spectrumName}>{spectrum.name}</Text>
        <Text style={styles.spectrumDescription}>{spectrum.description}</Text>
        <View style={styles.spectrumLabels}>
          <Text style={styles.leftLabel}>{spectrum.leftLabel}</Text>
          <Text style={styles.rightLabel}>{spectrum.rightLabel}</Text>
        </View>
      </View>
      
      {spectrum.questions.map((question: QuizQuestion) =>
        renderQuestion(question, spectrum.id)
      )}
    </View>
  );

  const completedSpectrums = Object.keys(responses).length;
  const totalSpectrums = TYPOLOGY_SPECTRUMS.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Typology Assessment</Text>
        <Text style={styles.stepDescription}>
          Answer questions about your natural tendencies and preferences.
        </Text>
        <Text style={styles.progressText}>
          Progress: {completedSpectrums}/{totalSpectrums} spectrums completed
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {TYPOLOGY_SPECTRUMS.map(renderSpectrum)}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Mastery Quiz</Text>
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
    color: '#2c3e50',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  spectrumContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  spectrumHeader: {
    marginBottom: 20,
  },
  spectrumName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  spectrumDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 22,
  },
  spectrumLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  rightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  optionText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
