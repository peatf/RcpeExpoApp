// src/components/Quests/CompletionModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface CompletionModalProps {
  visible: boolean;
  title: string;
  message: string;
  onNextQuest: () => void;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible, title, message, onNextQuest, onClose,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="Start Next Quest" onPress={onNextQuest} />
        <Button title="Close" onPress={onClose} color="#888" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center', minWidth: 300
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
