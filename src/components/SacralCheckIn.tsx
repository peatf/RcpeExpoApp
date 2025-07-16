import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../constants/theme';

interface SacralCheckInProps {
  onResponse?: (response: 'yes' | 'no', question: string) => void;
}

const SacralCheckIn: React.FC<SacralCheckInProps> = ({ onResponse }) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<{ response: 'yes' | 'no'; timestamp: Date } | null>(null);

  const sampleQuestions = [
    "Does this opportunity light me up?",
    "Do I have energy for this right now?",
    "Does this feel correct for me?",
    "Am I excited about this possibility?",
    "Does my gut say yes to this?",
    "Do I feel pulled toward this?",
    "Is this something I want to respond to?",
    "Does this align with what I want?"
  ];

  const generateRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    setCurrentQuestion(sampleQuestions[randomIndex]);
  };

  const handleResponse = (response: 'yes' | 'no') => {
    const timestamp = new Date();
    setLastResponse({ response, timestamp });
    
    if (onResponse && currentQuestion) {
      onResponse(response, currentQuestion);
    }

    // Show confirmation
    Alert.alert(
      "Response Captured", 
      `Your sacral said "${response.toUpperCase()}" to: "${currentQuestion}"`,
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sacral Check-In</Text>
      <Text style={styles.subtitle}>Quick gut-response assessment</Text>
      
      <View style={styles.questionContainer}>
        {currentQuestion ? (
          <>
            <Text style={styles.questionLabel}>Check in with your sacral:</Text>
            <Text style={styles.question}>{currentQuestion}</Text>
          </>
        ) : (
          <Text style={styles.promptText}>Tap "New Question" to get a sacral check-in prompt</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={generateRandomQuestion}
        >
          <Text style={styles.generateButtonText}>New Question</Text>
        </TouchableOpacity>
      </View>

      {currentQuestion && (
        <View style={styles.responseContainer}>
          <Text style={styles.responsePrompt}>What does your gut say?</Text>
          <View style={styles.responseButtons}>
            <TouchableOpacity 
              style={[styles.responseButton, styles.yesButton]} 
              onPress={() => handleResponse('yes')}
            >
              <Text style={styles.responseButtonText}>YES ✔️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.responseButton, styles.noButton]} 
              onPress={() => handleResponse('no')}
            >
              <Text style={styles.responseButtonText}>NO ✖️</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {lastResponse && (
        <View style={styles.lastResponseContainer}>
          <Text style={styles.lastResponseLabel}>Last Response:</Text>
          <Text style={styles.lastResponseText}>
            {lastResponse.response.toUpperCase()} at {lastResponse.timestamp.toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.bg,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.headingMedium.fontSize,
    fontWeight: theme.typography.headingMedium.fontWeight,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  questionContainer: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: theme.spacing.md,
    minHeight: 80,
    justifyContent: 'center',
  },
  questionLabel: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  question: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  promptText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  generateButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
  },
  generateButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.bg,
    fontWeight: '600',
  },
  responseContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  responsePrompt: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  responseButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  responseButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#F44336',
  },
  responseButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelLarge.fontSize,
    color: 'white',
    fontWeight: '600',
  },
  lastResponseContainer: {
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  lastResponseLabel: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  lastResponseText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
});

export default SacralCheckIn;
