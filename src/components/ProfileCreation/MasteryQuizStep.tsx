/**
 * @file MasteryQuizStep.tsx
 * @description Step 3: Mastery sections quiz
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
import { MASTERY_SECTIONS } from '../../data/quizData';
import { MasteryResponse, QuizQuestion, QuizOption } from '../../types';

interface MasteryQuizStepProps {
  initialResponses: MasteryResponse;
  onComplete: (responses: MasteryResponse) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const MasteryQuizStep: React.FC<MasteryQuizStepProps> = ({
  initialResponses,
  onComplete,
  onPrevious,
}) => {
  const [responses, setResponses] = useState<MasteryResponse>(initialResponses);

  const handleOptionSelect = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateResponses = (): boolean => {
    const allQuestions = MASTERY_SECTIONS.flatMap(section => 
      section.questions.map(q => q.id)
    );
    
    const missingResponses = allQuestions.filter(
      questionId => !responses[questionId]
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

  const renderQuestion = (question: QuizQuestion) => (
    <View key={question.id} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option: QuizOption) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              responses[question.id] === option.value && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(question.id, option.value)}
          >
            <Text
              style={[
                styles.optionText,
                responses[question.id] === option.value && styles.selectedOptionText,
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSection = (section: any) => (
    <View key={section.id} style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionDescription}>{section.description}</Text>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>{section.progress}% Complete</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${section.progress}%` }]} 
            />
          </View>
        </View>
      </View>
      
      {section.questions.map(renderQuestion)}
    </View>
  );

  const completedQuestions = Object.keys(responses).length;
  const totalQuestions = MASTERY_SECTIONS.reduce(
    (total, section) => total + section.questions.length, 
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepTitle}>Mastery Assessment</Text>
        <Text style={styles.stepDescription}>
          Explore your core values, growth areas, and natural energy patterns.
        </Text>
        <Text style={styles.progressText}>
          Progress: {completedQuestions}/{totalQuestions} questions completed
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MASTERY_SECTIONS.map(renderSection)}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Review & Submit</Text>
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
  sectionContainer: {
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
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 22,
  },
  progressIndicator: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 2,
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
