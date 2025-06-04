/**
 * @file ProfileCreationScreen.tsx
 * @description Main screen for the multi-step profile creation flow
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BirthDataStep } from '../../components/ProfileCreation/BirthDataStep';
import { TypologyQuizStep } from '../../components/ProfileCreation/TypologyQuizStep';
import { MasteryQuizStep } from '../../components/ProfileCreation/MasteryQuizStep';
import { ReviewStep } from '../../components/ProfileCreation/ReviewStep';
import { ProfileResultStep } from '../../components/ProfileCreation/ProfileResultStep';
import { StepIndicator } from '../../components/ProfileCreation/StepIndicator';
import { ProfileService } from '../../services/profileService';
import {
  BirthData,
  AssessmentResponses,
  ProfileCreationPayload,
  TypologyResponse,
  MasteryResponse,
} from '../../types';

const { width } = Dimensions.get('window');

interface ProfileCreationScreenProps {
  navigation: any;
}

export const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [birthData, setBirthData] = useState<BirthData>({
    birth_date: '',
    birth_time: '',
    city_of_birth: '',
    country_of_birth: '',
  });
  const [typologyResponses, setTypologyResponses] = useState<TypologyResponse>({});
  const [masteryResponses, setMasteryResponses] = useState<MasteryResponse>({});
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const steps = [
    'Birth Data',
    'Typology Quiz',
    'Mastery Quiz',
    'Review',
    'Profile Result',
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBirthDataComplete = (data: BirthData) => {
    setBirthData(data);
    handleNextStep();
  };

  const handleTypologyComplete = (responses: TypologyResponse) => {
    setTypologyResponses(responses);
    handleNextStep();
  };

  const handleMasteryComplete = (responses: MasteryResponse) => {
    setMasteryResponses(responses);
    handleNextStep();
  };

  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    
    try {
      const assessmentResponses: AssessmentResponses = {
        typology: typologyResponses,
        mastery: masteryResponses,
      };

      const payload: ProfileCreationPayload = {
        birth_data: birthData,
        assessment_responses: assessmentResponses,
      };

      const response = await ProfileService.createProfile(payload);
      
      if (response.profile_id) {
        setProfileId(response.profile_id);
        handleNextStep();
      } else {
        throw new Error('No profile ID received');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert(
        'Error',
        `Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchProfile = async () => {
    if (!profileId) return;

    setIsLoading(true);
    
    try {
      const data = await ProfileService.getProfile(profileId);
      setProfileData(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      Alert.alert(
        'Error',
        `Failed to fetch profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BirthDataStep
            initialData={birthData}
            onComplete={handleBirthDataComplete}
            onNext={handleNextStep}
          />
        );
      case 1:
        return (
          <TypologyQuizStep
            initialResponses={typologyResponses}
            onComplete={handleTypologyComplete}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 2:
        return (
          <MasteryQuizStep
            initialResponses={masteryResponses}
            onComplete={handleMasteryComplete}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 3:
        return (
          <ReviewStep
            birthData={birthData}
            typologyResponses={typologyResponses}
            masteryResponses={masteryResponses}
            onSubmit={handleSubmitProfile}
            onPrevious={handlePreviousStep}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <ProfileResultStep
            profileId={profileId}
            profileData={profileData}
            onFetchProfile={handleFetchProfile}
            isLoading={isLoading}
            onCreateAnother={() => {
              // Reset all state
              setCurrentStep(0);
              setBirthData({
                birth_date: '',
                birth_time: '',
                city_of_birth: '',
                country_of_birth: '',
              });
              setTypologyResponses({});
              setMasteryResponses({});
              setProfileId(null);
              setProfileData(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reality Creation Profile</Text>
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ProfileCreationScreen;
