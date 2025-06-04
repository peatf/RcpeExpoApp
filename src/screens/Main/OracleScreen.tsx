/**
 * @file OracleScreen.tsx
 * @description Screen for Oracle insights and guidance
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

interface OracleMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

const OracleScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<OracleMessage[]>([]);

  const sampleResponses = [
    "Your energy is aligned with growth opportunities. Trust your intuition.",
    "The frequencies around you suggest a time for reflection and inner wisdom.",
    "Your current path resonates with higher vibrations. Continue forward.",
    "Consider balancing your energy centers for optimal harmony.",
    "The universe is responding to your elevated consciousness."
  ];

  const handleAskOracle = async () => {
    if (!question.trim()) {
      Alert.alert('Please enter a question', 'The Oracle needs a question to provide guidance.');
      return;
    }

    setIsThinking(true);
    
    // Simulate Oracle thinking process
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      const newMessage: OracleMessage = {
        id: Date.now().toString(),
        question: question.trim(),
        answer: randomResponse,
        timestamp: Date.now(),
      };

      setMessages(prev => [newMessage, ...prev]);
      setQuestion('');
      setIsThinking(false);
    }, 2000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Oracle</Text>
        <Text style={styles.subtitle}>Seek wisdom and guidance</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 && !isThinking && (
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome to the Oracle</Text>
            <Text style={styles.welcomeText}>
              Ask any question about your energy, path, or spiritual journey. 
              The Oracle will provide insights based on your current vibrational state.
            </Text>
          </View>
        )}

        {isThinking && (
          <View style={styles.thinkingCard}>
            <Text style={styles.thinkingText}>The Oracle is contemplating your question...</Text>
            <View style={styles.thinkingDots}>
              <Text style={styles.dot}>●</Text>
              <Text style={styles.dot}>●</Text>
              <Text style={styles.dot}>●</Text>
            </View>
          </View>
        )}

        {messages.map((message) => (
          <View key={message.id} style={styles.messageCard}>
            <View style={styles.questionSection}>
              <Text style={styles.questionLabel}>Your Question:</Text>
              <Text style={styles.questionText}>{message.question}</Text>
            </View>
            <View style={styles.answerSection}>
              <Text style={styles.answerLabel}>Oracle's Guidance:</Text>
              <Text style={styles.answerText}>{message.answer}</Text>
              <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.questionInput}
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask the Oracle a question..."
          multiline
          maxLength={200}
          editable={!isThinking}
        />
        <TouchableOpacity
          style={[styles.askButton, (isThinking || !question.trim()) && styles.buttonDisabled]}
          onPress={handleAskOracle}
          disabled={isThinking || !question.trim()}
        >
          <Text style={styles.buttonText}>
            {isThinking ? 'Thinking...' : 'Ask Oracle'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  thinkingCard: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  thinkingText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  thinkingDots: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 20,
    color: '#007AFF',
    marginHorizontal: 4,
  },
  messageCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  answerSection: {
    position: 'relative',
  },
  answerLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  askButton: {
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OracleScreen;
