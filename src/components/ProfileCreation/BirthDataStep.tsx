/**
 * @file BirthDataStep.tsx
 * @description Step 1: Birth data input form
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { BirthData } from '../../types';

interface BirthDataStepProps {
  initialData: BirthData;
  onComplete: (data: BirthData) => void;
  onNext: () => void;
}

export const BirthDataStep: React.FC<BirthDataStepProps> = ({
  initialData,
  onComplete,
}) => {
  const [formData, setFormData] = useState<BirthData>(initialData);
  const [errors, setErrors] = useState<Partial<BirthData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BirthData> = {};

    // Validate birth date (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.birth_date) {
      newErrors.birth_date = 'Birth date is required';
    } else if (!dateRegex.test(formData.birth_date)) {
      newErrors.birth_date = 'Date must be in YYYY-MM-DD format';
    } else {
      const date = new Date(formData.birth_date);
      if (isNaN(date.getTime())) {
        newErrors.birth_date = 'Invalid date';
      }
    }

    // Validate birth time (HH:MM:SS format)
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!formData.birth_time) {
      newErrors.birth_time = 'Birth time is required';
    } else if (!timeRegex.test(formData.birth_time)) {
      newErrors.birth_time = 'Time must be in HH:MM:SS format';
    }

    // Validate city
    if (!formData.city_of_birth.trim()) {
      newErrors.city_of_birth = 'City of birth is required';
    }

    // Validate country
    if (!formData.country_of_birth.trim()) {
      newErrors.country_of_birth = 'Country of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onComplete(formData);
    } else {
      Alert.alert('Validation Error', 'Please correct the errors and try again.');
    }
  };

  const updateField = (field: keyof BirthData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Birth Information</Text>
      <Text style={styles.stepDescription}>
        Enter your birth details to generate your astrological profile.
      </Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Date *</Text>
          <TextInput
            style={[styles.input, errors.birth_date && styles.inputError]}
            value={formData.birth_date}
            onChangeText={(value) => updateField('birth_date', value)}
            placeholder="YYYY-MM-DD (e.g., 1990-01-01)"
            placeholderTextColor="#999"
          />
          {errors.birth_date && (
            <Text style={styles.errorText}>{errors.birth_date}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Time *</Text>
          <TextInput
            style={[styles.input, errors.birth_time && styles.inputError]}
            value={formData.birth_time}
            onChangeText={(value) => updateField('birth_time', value)}
            placeholder="HH:MM:SS (e.g., 14:30:00)"
            placeholderTextColor="#999"
          />
          {errors.birth_time && (
            <Text style={styles.errorText}>{errors.birth_time}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City of Birth *</Text>
          <TextInput
            style={[styles.input, errors.city_of_birth && styles.inputError]}
            value={formData.city_of_birth}
            onChangeText={(value) => updateField('city_of_birth', value)}
            placeholder="e.g., Los Angeles"
            placeholderTextColor="#999"
          />
          {errors.city_of_birth && (
            <Text style={styles.errorText}>{errors.city_of_birth}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country of Birth *</Text>
          <TextInput
            style={[styles.input, errors.country_of_birth && styles.inputError]}
            value={formData.country_of_birth}
            onChangeText={(value) => updateField('country_of_birth', value)}
            placeholder="e.g., USA"
            placeholderTextColor="#999"
          />
          {errors.country_of_birth && (
            <Text style={styles.errorText}>{errors.country_of_birth}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next: Typology Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
