/**
 * @file OracleScreen.tsx
 * @description Enhanced Oracle with personalized quest system and complete three-tool integration
 */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
// Navigation hooks not needed in this implementation
import StepTracker from '../../components/StepTracker'; // Import StepTracker
import { FLOW_STEPS, STEP_LABELS } from '../../constants/flowSteps'; // Import constants
import {Ionicons} from '@expo/vector-icons';
import StackedButton from '../../components/StackedButton';
import { colors, typography, spacing } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import aiOracleService, {
  OracleInputSynthesis,
  PersonalizedQuest,
  QuestHint,
  QuestCompletion,
  OracleSession
} from '../../services/aiOracleService';

interface OracleScreenProps {
  navigation?: any;
  route?: any;
}

const OracleScreen: React.FC<OracleScreenProps> = ({navigation, route}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Core state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Awakening the Oracle...');
  const [currentView, setCurrentView] = useState<'awakening' | 'quest_selection' | 'active_quest' | 'quest_completed' | 'oracle_wisdom'>('awakening');
  const [visualCurrentStep, setVisualCurrentStep] = useState<number>(1); // State for visual tracker

  // Three-tool integration
  const [oracleSynthesis, setOracleSynthesis] = useState<OracleInputSynthesis | null>(null);
  const [hasCompleteJourney, setHasCompleteJourney] = useState<boolean>(false);

  // Quest system state
  const [activeQuest, setActiveQuest] = useState<PersonalizedQuest | null>(null);
  const [questProgress, setQuestProgress] = useState<number>(0);
  const [availableQuests, setAvailableQuests] = useState<PersonalizedQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<QuestCompletion[]>([]);
  
  // Hint system
  const [currentHints, setCurrentHints] = useState<QuestHint[]>([]);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [selectedHint, setSelectedHint] = useState<QuestHint | null>(null);

  // Completion system
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completionReflection, setCompletionReflection] = useState<string>('');
  const [completionRating, setCompletionRating] = useState<1 | 2 | 3 | 4 | 5>(5);

  // Oracle wisdom (legacy Q&A for non-quest users)
  const [oracleQuestion, setOracleQuestion] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [oracleMessages, setOracleMessages] = useState<any[]>([]);

  // Initialize Oracle on mount
  useEffect(() => {
    const initializeOracle = async () => {
      try {
        setLoadingMessage('Synthesizing your three-tool journey...');
        
        console.log('Oracle: Initializing with route:', !!route, 'params:', !!route?.params);
        
        // Check for direct handoff from Calibration Tool
        if (route?.params?.handoffData) {
          console.log('Oracle: Received handoff data:', route.params.handoffData);
          const handoffData = route.params.handoffData;
          
          const synthesis = await aiOracleService.initializeFromCalibration(
            handoffData.session_id,
            handoffData
          );
          
          console.log('Oracle: Synthesis result:', !!synthesis);
          if (synthesis) {
            setOracleSynthesis(synthesis);
            setHasCompleteJourney(true);
            
            setLoadingMessage('Generating your personalized quests...');
            await generateInitialQuests(synthesis);
            setCurrentView('quest_selection');
          } else {
            console.error('Oracle: Failed to get synthesis');
            setHasCompleteJourney(false);
            setCurrentView('oracle_wisdom');
          }
        } else {
          // Try to load from storage for manual navigation
          console.log('Oracle: No route params, checking storage...');
          const [frequencyMapperData, calibrationData] = await Promise.all([
            AsyncStorage.getItem('frequencyMapperOutput'),
            AsyncStorage.getItem('calibrationResults')
          ]);
          
          console.log('Oracle: Storage data - FM:', !!frequencyMapperData, 'Cal:', !!calibrationData);
          
          if (frequencyMapperData && calibrationData) {
            const fmOutput = JSON.parse(frequencyMapperData);
            const calResults = JSON.parse(calibrationData);
            
            // Create mock synthesis for development
            const mockSynthesis: OracleInputSynthesis = {
              session_id: fmOutput.session_metadata?.session_id || 'mock-session',
              user_id: 'mock-user-123',
              frequency_mapper_output: fmOutput,
              calibration_results: {
                perceptual_map: calResults.sliderValues || { belief: 0.5, openness: 0.7, worthiness: 0.4 },
                reflections: calResults.reflections || { belief_reflection: '', openness_reflection: '', worthiness_reflection: '' },
                chosen_path: calResults.recommendation?.oracle_preparation?.recommended_path || 'shadow',
                path_reasoning: calResults.recommendation?.oracle_preparation?.path_reasoning || 'Path selected for balanced growth',
                primary_focus_area: 'worthiness',
                processing_core_alignment: 'Emotional Authority with defined Heart center'
              },
              complete_base_chart: {
                processing_core_summary: 'Emotional Authority, Defined Heart Center, Mercury in Gemini',
                decision_growth_summary: 'Generator strategy with emotional clarity',
                tension_points_summary: 'Chiron in Gate 25, themes around self-worth and universal love',
                drive_mechanic_summary: 'Need motivation, Venus in Taurus, Steady kinetic drive',
                motivation_color: 'Need',
                heart_state: 'Defined',
                root_state: 'Undefined',
                venus_sign: 'Taurus',
                kinetic_drive_spectrum: 'Steady',
                energy_family_summary: '3/5 Profile, Taurus Sun',
                resonance_field_spectrum: 'Focused',
                design_authority: 'Generator',
                strategy: 'To Respond',
                inner_authority: 'Emotional',
                profile: '3/5',
                defined_centers: ['Heart', 'Sacral', 'G Center'],
                undefined_centers: ['Head', 'Ajna', 'Throat', 'Spleen', 'Root'],
                active_gates: [25, 13, 33, 7, 1],
                chiron_gate: 25,
                sun_sign: 'Taurus',
                moon_sign: 'Cancer',
                mercury_sign: 'Gemini',
                mars_sign: 'Aries',
                jupiter_sign: 'Sagittarius'
              }
            };
            
            setOracleSynthesis(mockSynthesis);
            setHasCompleteJourney(true);
            
            setLoadingMessage('Generating your personalized quests...');
            await generateInitialQuests(mockSynthesis);
          } else {
            // No complete journey data - show Oracle wisdom mode
            console.log('Oracle: No complete journey data, defaulting to wisdom mode');
            setHasCompleteJourney(false);
            setCurrentView('oracle_wisdom');
          }
        }
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        
        // Pulse animation for quest elements
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
          ])
        ).start();
        
      } catch (error) {
        console.error('Failed to initialize Oracle:', error);
        // Don't show alert for navigation issues - just default to wisdom mode
        if (error instanceof Error && error.message?.includes('Cannot read properties of undefined')) {
          console.log('Oracle: Navigation props missing, defaulting to wisdom mode');
        } else {
          Alert.alert('Error', 'Failed to load your Oracle experience. Please try again.');
        }
        setHasCompleteJourney(false);
        setCurrentView('oracle_wisdom');
      } finally {
        setIsLoading(false);
      }
    };

    initializeOracle();
  }, [route?.params]);

  // Effect to update visualCurrentStep based on currentView
  useEffect(() => {
    switch (currentView) {
      case 'awakening':
      case 'quest_selection':
        setVisualCurrentStep(1);
        break;
      // case 'path_choice_equivalent_if_any': // If there was a clear step 2 view
      //   setVisualCurrentStep(2);
      //   break;
      case 'active_quest':
        // Assuming selecting a quest implies path choice is made, so we are in implementation
        setVisualCurrentStep(3);
        break;
      case 'quest_completed':
        setVisualCurrentStep(4);
        break;
      case 'oracle_wisdom': // Fallback for non-quest mode
        setVisualCurrentStep(1); // Or hide tracker
        break;
      default:
        setVisualCurrentStep(1);
    }
  }, [currentView]);

  // Generate initial quest options
  const generateInitialQuests = async (synthesis: OracleInputSynthesis) => {
    try {
      console.log('Oracle: Generating initial quests...');
      
      // Generate quests one by one with individual error handling
      const quests: PersonalizedQuest[] = [];
      
      try {
        console.log('Oracle: Generating quest 1...');
        const quest1 = await aiOracleService.generatePersonalizedQuest(synthesis);
        quests.push(quest1);
        console.log('Oracle: Quest 1 generated successfully');
      } catch (error) {
        console.warn('Oracle: Failed to generate quest 1:', error);
      }
      
      try {
        console.log('Oracle: Generating quest 2...');
        const quest2 = await aiOracleService.generatePersonalizedQuest(synthesis, { 
          preferred_type: synthesis.calibration_results.chosen_path === 'shadow' ? 'hero' : 'shadow' 
        });
        quests.push(quest2);
        console.log('Oracle: Quest 2 generated successfully');
      } catch (error) {
        console.warn('Oracle: Failed to generate quest 2:', error);
      }
      
      try {
        console.log('Oracle: Generating quest 3...');
        const quest3 = await aiOracleService.generatePersonalizedQuest(synthesis, { 
          preferred_focus: synthesis.calibration_results.primary_focus_area === 'belief' ? 'openness' : 'belief' 
        });
        quests.push(quest3);
        console.log('Oracle: Quest 3 generated successfully');
      } catch (error) {
        console.warn('Oracle: Failed to generate quest 3:', error);
      }
      
      console.log('Oracle: Total quests generated:', quests.length);
      setAvailableQuests(quests);
    } catch (error) {
      console.error('Failed to generate initial quests:', error);
      // Set empty quests array so the screen can still load
      setAvailableQuests([]);
    }
  };

  // Select and start a quest
  const handleQuestSelection = async (quest: PersonalizedQuest) => {
    setActiveQuest(quest);
    setQuestProgress(0);
    setCurrentView('active_quest');
    
    // Generate initial hints
    try {
      const hints = await aiOracleService.generateContextualHints(quest.quest_id, 'just_started');
      setCurrentHints(hints);
    } catch (error) {
      console.error('Failed to generate initial hints:', error);
    }
    
    // Save to storage
    await AsyncStorage.setItem('activeOracleQuest', JSON.stringify(quest));
  };

  // Update quest progress
  const handleProgressUpdate = async (newProgress: number) => {
    setQuestProgress(newProgress);
    
    if (activeQuest) {
      await aiOracleService.updateQuestProgress(activeQuest.quest_id, newProgress);
      
      // Generate hints based on progress
      const progressStage = newProgress < 0.3 ? 'just_started' : newProgress < 0.7 ? 'midway' : 'completing';
      const hints = await aiOracleService.generateContextualHints(activeQuest.quest_id, progressStage);
      setCurrentHints(hints);
    }
  };

  // Complete quest
  const handleQuestCompletion = async () => {
    if (!activeQuest) return;
    
    try {
      const completion = await aiOracleService.processQuestCompletion(
        activeQuest.quest_id,
        completionReflection,
        completionRating,
        [true, true, true] // Simplified success criteria
      );
      
      setCompletedQuests(prev => [...prev, completion]);
      setShowCompletionModal(false);
      setCurrentView('quest_completed');
      
      // Generate new quest options
      if (oracleSynthesis) {
        await generateInitialQuests(oracleSynthesis);
      }
      
    } catch (error) {
      console.error('Failed to complete quest:', error);
      Alert.alert('Error', 'Failed to process quest completion. Please try again.');
    }
  };

  // Show hint
  const handleShowHint = (hint: QuestHint) => {
    setSelectedHint(hint);
    setShowHintModal(true);
  };

  // Legacy Oracle wisdom for users without complete journey
  const handleAskOracle = async () => {
    if (!oracleQuestion.trim()) {
      Alert.alert('Please enter a question', 'The Oracle needs a question to provide guidance.');
      return;
    }

    setIsThinking(true);
    
    const wisdomResponses = [
      "Your energy signature carries the keys to manifestation. Trust the process unfolding within you.",
      "The frequencies around you are shifting toward higher alignment. Stay present to the guidance emerging.",
      "Your authentic expression is the gateway to your desires. Let your true nature lead the way.",
      "Consider how your energetic design wants to express itself in service of your growth.",
      "The universe is reflecting your inner state back to you. What patterns do you notice?"
    ];
    
    setTimeout(() => {
      const response = wisdomResponses[Math.floor(Math.random() * wisdomResponses.length)];
      
      const newMessage = {
        id: Date.now().toString(),
        question: oracleQuestion.trim(),
        answer: response,
        timestamp: Date.now(),
      };

      setOracleMessages(prev => [newMessage, ...prev]);
      setOracleQuestion('');
      setIsThinking(false);
    }, 2500);
  };

  // Render loading screen
  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.oracleSymbol, { opacity: fadeAnim }]}>
        <Ionicons name="eye-outline" size={80} color="#6c5ce7" />
      </Animated.View>
      <Text style={styles.loadingText}>{loadingMessage}</Text>
      <Text style={styles.loadingSubtext}>
        Integrating your complete energetic journey...
      </Text>
      <ActivityIndicator size="large" color="#6c5ce7" style={{marginTop: 20}} />
    </View>
  );

  // Render Oracle awakening screen
  const renderAwakeningScreen = () => {
    if (!oracleSynthesis) return null;
    
    const { desired_state, energetic_quality, source_statement } = oracleSynthesis.frequency_mapper_output;
    const { chosen_path, primary_focus_area } = oracleSynthesis.calibration_results;
    
    return (
      <Animated.View style={[styles.awakeningContainer, { opacity: fadeAnim }]}>
        <View style={styles.journeySummary}>
          <Text style={styles.oracleTitle}>Your Oracle Journey Begins</Text>
          
          <View style={styles.journeyFlow}>
            <View style={styles.journeyStep}>
              <Text style={styles.journeyLabel}>From:</Text>
              <Text style={styles.journeyText}>"{source_statement}"</Text>
            </View>
            
            <Ionicons name="arrow-down" size={24} color="#6c5ce7" style={styles.journeyArrow} />
            
            <View style={styles.journeyStep}>
              <Text style={styles.journeyLabel}>To:</Text>
              <Text style={styles.journeyText}>"{desired_state}"</Text>
            </View>
            
            <Ionicons name="arrow-down" size={24} color="#6c5ce7" style={styles.journeyArrow} />
            
            <View style={styles.journeyStep}>
              <Text style={styles.journeyLabel}>Path:</Text>
              <Text style={[
                styles.pathText,
                chosen_path === 'shadow' ? styles.shadowPath : styles.heroPath
              ]}>
                {chosen_path === 'shadow' ? 'Shadow Quest' : 'Hero Quest'} • {primary_focus_area} focus
              </Text>
            </View>
          </View>
          
          <Text style={styles.energeticSignature}>
            Energy Signature: <Text style={styles.energyText}>{energetic_quality}</Text>
          </Text>
        </View>

        <View style={styles.chartAcknowledgment}>
          <Text style={styles.chartTitle}>Your Complete Energetic Design</Text>
          <Text style={styles.chartSummary}>
            As a {oracleSynthesis.complete_base_chart.design_authority} with {oracleSynthesis.complete_base_chart.inner_authority} authority, 
            guided by {oracleSynthesis.complete_base_chart.strategy} strategy...
          </Text>
          <Text style={styles.chartGifts}>
            Your strongest gates {oracleSynthesis.complete_base_chart.active_gates.slice(0, 3).join(', ')} are ready to support this journey.
          </Text>
        </View>

        <View style={styles.pathCommitment}>
          <Text style={styles.commitmentTitle}>
            {chosen_path === 'shadow' 
              ? `Are you ready to meet your ${primary_focus_area} challenges with fierce compassion?`
              : `Are you ready to let your ${primary_focus_area} energy lift all areas of your life?`
            }
          </Text>
          
          <TouchableOpacity
            style={[styles.commitmentButton, chosen_path === 'shadow' ? styles.shadowButton : styles.heroButton]}
            onPress={() => setCurrentView('quest_selection')}
          >
            <Text style={styles.commitmentButtonText}>
              Begin {chosen_path === 'shadow' ? 'Shadow' : 'Hero'} Quest Journey
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Render quest selection
  const renderQuestSelection = () => (
    <View style={styles.questSelectionContainer}>
      <Text style={styles.questSelectionTitle}>Choose Your Quest</Text>
      <Text style={styles.questSelectionSubtitle}>
        Each quest is personalized to your energetic design and current alignment
      </Text>
      
      {availableQuests.map((quest, index) => (
        <TouchableOpacity
          key={quest.quest_id}
          style={[
            styles.questCard,
            quest.quest_type === 'shadow' ? styles.shadowQuestCard : styles.heroQuestCard
          ]}
          onPress={() => handleQuestSelection(quest)}
        >
          <View style={styles.questHeader}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <View style={[
              styles.questTypeTag,
              quest.quest_type === 'shadow' ? styles.shadowTag : styles.heroTag
            ]}>
              <Text style={styles.questTypeText}>
                {quest.quest_type === 'shadow' ? 'Shadow Quest' : 'Hero Quest'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.questDescription}>{quest.description}</Text>
          
          <View style={styles.questDetails}>
            <Text style={styles.questObjective}>{quest.objective}</Text>
            <Text style={styles.questDuration}>Duration: {quest.duration}</Text>
          </View>
          
          <View style={styles.questChartIntegration}>
            <Text style={styles.chartIntegrationTitle}>Chart Integration:</Text>
            <Text style={styles.chartIntegrationText}>{quest.chart_integration.authority_alignment}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render active quest
  const renderActiveQuest = () => {
    if (!activeQuest) return null;
    
    return (
      <View style={styles.activeQuestContainer}>
        <View style={styles.questProgress}>
          <Text style={styles.activeQuestTitle}>{activeQuest.title}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${questProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(questProgress)}% Complete</Text>
        </View>

        <View style={styles.questContent}>
          <Text style={styles.questObjectiveTitle}>Quest Objective:</Text>
          <Text style={styles.questObjectiveText}>{activeQuest.objective}</Text>
          
          <Text style={styles.dailyPracticeTitle}>Daily Practice:</Text>
          <Text style={styles.dailyPracticeText}>{activeQuest.daily_practice}</Text>
          
          <View style={styles.successCriteria}>
            <Text style={styles.successCriteriaTitle}>Success Criteria:</Text>
            {activeQuest.success_criteria.map((criteria, index) => (
              <Text key={index} style={styles.criteriaItem}>• {criteria}</Text>
            ))}
          </View>
        </View>

        <View style={styles.questActions}>
          <TouchableOpacity
            style={styles.progressButton}
            onPress={() => handleProgressUpdate(Math.min(questProgress + 10, 100))}
          >
            <Text style={styles.progressButtonText}>Update Progress</Text>
          </TouchableOpacity>
          
          {questProgress >= 80 && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => setShowCompletionModal(true)}
            >
              <Text style={styles.completeButtonText}>Complete Quest</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentHints.length > 0 && (
          <View style={styles.hintsSection}>
            <Text style={styles.hintsTitle}>Oracle Hints</Text>
            {currentHints.slice(0, 2).map((hint) => (
              <TouchableOpacity
                key={hint.hint_id}
                style={styles.hintCard}
                onPress={() => handleShowHint(hint)}
              >
                <Ionicons name="bulb-outline" size={20} color="#6c5ce7" />
                <Text style={styles.hintPreview}>{hint.hint_text.substring(0, 60)}...</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render Oracle wisdom (legacy mode)
  const renderOracleWisdom = () => (
    <View style={styles.wisdomContainer}>
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>ORACLE</Text>
          <Text style={styles.pageSubtitle}>Ask & Receive</Text>
        </View>

        <View style={styles.oracleContent}>
          {isThinking && (
            <View style={styles.pulseLoaderContainer}>
              <View style={styles.pulseLoader}>
                <View style={styles.pulseBlip} />
                <View style={[styles.pulseBlip, { animationDelay: '0.5s' }]} />
                <View style={[styles.pulseBlip, { animationDelay: '1.0s' }]} />
              </View>
            </View>
          )}

          {oracleMessages.length === 0 && !isThinking && (
            <Text style={styles.oracleDescription}>
              The Oracle awaits. Focus your intent, then ask your question.
            </Text>
          )}

          {oracleMessages.map((message) => (
            <View key={message.id} style={styles.inputPanel}>
              <View style={styles.questionSection}>
                <Text style={styles.inputPanelLabel}>YOUR QUESTION</Text>
                <Text style={styles.questionText}>{message.question}</Text>
              </View>
              <View style={styles.answerSection}>
                <Text style={styles.inputPanelLabel}>ORACLE'S GUIDANCE</Text>
                <Text style={styles.answerText}>{message.answer}</Text>
                <Text style={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.inputPanel}>
            <Text style={styles.inputPanelLabel}>ORACLE QUERY</Text>
            <TextInput
              style={styles.formElement}
              value={oracleQuestion}
              onChangeText={setOracleQuestion}
              placeholder="Ask your question..."
              multiline
              maxLength={200}
              editable={!isThinking}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <StackedButton
            type="rect"
            text={isThinking ? 'CONTEMPLATING...' : 'SUBMIT QUERY'}
            onPress={handleAskOracle}
          />
        </View>
      </View>
    </View>
  );

  // Render hint modal
  const renderHintModal = () => (
    <Modal
      visible={showHintModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowHintModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.hintModal}>
          {selectedHint && (
            <>
              <Text style={styles.hintModalTitle}>Oracle Hint</Text>
              <Text style={styles.hintModalText}>{selectedHint.hint_text}</Text>
              <Text style={styles.hintModalPractice}>Micro-practice: {selectedHint.micro_practice}</Text>
              <Text style={styles.hintModalEncouragement}>{selectedHint.encouragement}</Text>
              
              <TouchableOpacity
                style={styles.hintModalButton}
                onPress={() => setShowHintModal(false)}
              >
                <Text style={styles.hintModalButtonText}>Thank you, Oracle</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Main render
  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderLoadingScreen()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Render StepTracker if not in wisdom mode or if desired */}
      {/* For now, always render it based on current logic */}
      <StepTracker
        currentStep={visualCurrentStep}
        totalSteps={FLOW_STEPS.ORACLE}
        stepLabels={STEP_LABELS.ORACLE}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {!hasCompleteJourney && renderOracleWisdom()}
        {hasCompleteJourney && currentView === 'awakening' && renderAwakeningScreen()}
        {hasCompleteJourney && currentView === 'quest_selection' && renderQuestSelection()}
        {hasCompleteJourney && currentView === 'active_quest' && renderActiveQuest()}
      </ScrollView>

      {renderHintModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    flexShrink: 0,
  },
  pageTitle: {
    ...typography.displayMedium,
    fontFamily: 'System',
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: {
    ...typography.labelSmall,
    fontFamily: 'monospace',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  oracleContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  oracleDescription: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 320,
    alignSelf: 'center',
  },
  pulseLoaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseLoader: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseBlip: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
    opacity: 0,
  },
  inputPanel: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.base1,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  inputPanelLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: colors.bg,
    paddingHorizontal: 6,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  formElement: {
    width: '100%',
    backgroundColor: 'transparent',
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  questionSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.base1,
  },
  answerSection: {
    position: 'relative',
  },
  questionText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  answerText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  timestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  wisdomContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  oracleSymbol: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  awakeningContainer: {
    flex: 1,
  },
  journeySummary: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6c5ce7',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  oracleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6c5ce7',
    marginBottom: 20,
    textAlign: 'center',
  },
  journeyFlow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  journeyStep: {
    alignItems: 'center',
    marginVertical: 8,
  },
  journeyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  journeyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  journeyArrow: {
    marginVertical: 8,
  },
  pathText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  shadowPath: {
    color: '#7952b3',
  },
  heroPath: {
    color: '#28a745',
  },
  energeticSignature: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  energyText: {
    fontWeight: '600',
    color: '#6c5ce7',
  },
  chartAcknowledgment: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chartSummary: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  chartGifts: {
    fontSize: 15,
    color: '#6c5ce7',
    fontWeight: '500',
  },
  pathCommitment: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commitmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  commitmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowButton: {
    backgroundColor: '#7952b3',
  },
  heroButton: {
    backgroundColor: '#28a745',
  },
  commitmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  questSelectionContainer: {
    flex: 1,
  },
  questSelectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  questSelectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  questCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowQuestCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#7952b3',
  },
  heroQuestCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  questTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shadowTag: {
    backgroundColor: '#7952b3',
  },
  heroTag: {
    backgroundColor: '#28a745',
  },
  questTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  questDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  questDetails: {
    marginBottom: 16,
  },
  questObjective: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  questDuration: {
    fontSize: 14,
    color: '#666',
  },
  questChartIntegration: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  chartIntegrationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  chartIntegrationText: {
    fontSize: 13,
    color: '#666',
  },
  activeQuestContainer: {
    flex: 1,
  },
  questProgress: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeQuestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6c5ce7',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questObjectiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questObjectiveText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  dailyPracticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dailyPracticeText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  successCriteria: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  successCriteriaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  criteriaItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  questActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  progressButton: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hintsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hintsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hintPreview: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hintModal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  hintModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  hintModalText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  hintModalPractice: {
    fontSize: 15,
    color: '#6c5ce7',
    fontWeight: '500',
    marginBottom: 16,
  },
  hintModalEncouragement: {
    fontSize: 15,
    color: '#28a745',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  hintModalButton: {
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wisdomContainer: {
    flex: 1,
  },
  wisdomHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wisdomTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6c5ce7',
    marginBottom: 8,
  },
  wisdomSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    color: '#6c5ce7',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  thinkingDots: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 20,
    color: '#6c5ce7',
    marginHorizontal: 4,
  },
  messageCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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