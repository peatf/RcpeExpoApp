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
  Easing, // Import Easing
  SafeAreaView,
} from 'react-native';
// Navigation hooks not needed in this implementation
import StepTracker from '../../components/StepTracker'; // Import StepTracker
import { FLOW_STEPS, STEP_LABELS } from '../../constants/flowSteps'; // Import constants
import {Ionicons} from '@expo/vector-icons';
import StackedButton from '../../components/StackedButton';
import { theme } from '../../constants/theme'; // Import full theme
import AsyncStorage from '@react-native-async-storage/async-storage';
import aiOracleService, {
  OracleInputSynthesis,
  PersonalizedQuest,
  QuestHint,
  QuestCompletion,
  OracleSession
} from '../../services/aiOracleService';
import OnboardingBanner from '../../components/OnboardingBanner'; // Import OnboardingBanner
import useOnboardingBanner from '../../hooks/useOnboardingBanner'; // Import useOnboardingBanner

interface OracleScreenProps {
  navigation?: any;
  route?: any;
}

const OracleScreen: React.FC<OracleScreenProps> = ({navigation, route}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current; // For quest elements
  const oraclePulseAnimVal = useRef(new Animated.Value(0)).current; // For Oracle thinking loader
  
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
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const { showBanner, dismissBanner, isLoadingBanner } = useOnboardingBanner('Oracle');

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

  // Effect for Oracle Pulse Loader Animation
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;

    if (isThinking) {
      oraclePulseAnimVal.setValue(0); // Reset animation value
      pulseAnimation = Animated.loop(
        Animated.timing(oraclePulseAnimVal, {
          toValue: 1,
          duration: 2500,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        })
      );
      pulseAnimation.start();
    } else {
      oraclePulseAnimVal.setValue(0); // Ensure it's reset when not thinking
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isThinking, oraclePulseAnimVal]);

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
        <Ionicons name="eye-outline" size={80} color={theme.colors.accent} />
      </Animated.View>
      <Text style={styles.loadingText}>{loadingMessage}</Text>
      <Text style={styles.loadingSubtext}>
        Integrating your complete energetic journey...
      </Text>
      <ActivityIndicator size="large" color={theme.colors.accent} style={{marginTop: 20}} />
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
            
            <Ionicons name="arrow-down" size={24} color={theme.colors.accent} style={styles.journeyArrow} />
            
            <View style={styles.journeyStep}>
              <Text style={styles.journeyLabel}>To:</Text>
              <Text style={styles.journeyText}>"{desired_state}"</Text>
            </View>
            
            <Ionicons name="arrow-down" size={24} color={theme.colors.accent} style={styles.journeyArrow} />
            
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
            <Ionicons name="arrow-forward" size={20} color={theme.colors.bg} style={{marginLeft: 8}} />
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
                <Ionicons name="bulb-outline" size={20} color={theme.colors.accent} />
                <Text style={styles.hintPreview}>{hint.hint_text.substring(0, 60)}...</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render Oracle wisdom (legacy mode)
  const renderOracleWisdom = () => {
    // Pulse animation related state would go here if not already global
    // For now, pulseAnim from component scope will be used.

    return (
      // This View replaces styles.wisdomContainer and styles.contentWrapper from old structure
      // It will receive padding from the parent ScrollView's contentContainerStyle or apply its own.
      // For the refactor, assuming this is the direct child of ScrollView.
      <View style={styles.oracleWisdomViewWrapper}>
        {/* Title Section (Reusing titleSection, pageTitle, pageSubtitle styles from other screens if compatible) */}
        {/* These styles will be defined/updated in the StyleSheet later */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>ORACLE</Text>
          <Text style={styles.pageSubtitle}>Ask & Receive</Text>
        </View>

        {/* Content that needs to be centered if ScrollView is not filled */}
        {/* This View will act as the main content container for the Oracle elements */}
        <View style={styles.oracleInteractiveContent}>
          {isThinking && (
            <View style={styles.pulseLoaderContainer}>
              {[0, 1, 2].map((index) => { // Create 3 blips. Index for key, not for delay here.
                // The staggering via animation-delay in CSS is complex to replicate perfectly
                // with a single looping Animated.Value in RN without causing issues with loop/reset.
                // This simplified version will have all blips animate based on the same oraclePulseAnimVal.
                // True staggered delays would require more complex animation setup (e.g., Animated.stagger
                // or multiple Animated.Values, which is harder to loop cleanly with a single control).
                // The visual effect will be simultaneous pulsing, relying on opacity/scale curves.
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.pulseBlip,
                      {
                        opacity: oraclePulseAnimVal.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, 0.7, 0], // Opacity curve: fade in then out
                        }),
                        transform: [
                          {
                            scale: oraclePulseAnimVal.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 4], // Scale curve: small to large
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                );
              })}
            </View>
          )}

          {!isThinking && oracleMessages.length === 0 && (
            <Text style={styles.descriptiveParagraph}>
              The Oracle awaits. Focus your intent, then ask your question.
            </Text>
          )}

          {/* Display previous messages if any */}
          {oracleMessages.length > 0 && !isThinking && (
            <ScrollView style={styles.messagesScrollView} nestedScrollEnabled={true}>
              {oracleMessages.map((message) => (
                <View key={message.id} style={styles.messageCard}>
                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>YOUR QUESTION</Text>
                    <Text style={styles.messageText}>{message.question}</Text>
                  </View>
                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>ORACLE'S GUIDANCE</Text>
                    <Text style={styles.messageText}>{message.answer}</Text>
                    <Text style={styles.messageTimestamp}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Input Panel for new query */}
          {!isThinking && (
            <View style={[styles.inputPanelContainer, isInputFocused && styles.inputPanelFocused]}>
              <Text style={styles.inputPanelLabel}>ORACLE QUERY</Text>
              <TextInput
                style={styles.textInputMain}
                value={oracleQuestion}
                onChangeText={setOracleQuestion}
                placeholder="Ask your question..."
                multiline
                maxLength={200}
                editable={!isThinking}
                placeholderTextColor={theme.colors.textSecondary}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </View>
          )}
          
          {/* Action Button */}
          {!isThinking && (
            <StackedButton
              shape="rectangle" // Changed from type="rect"
              text="Ask" // Changed from SUBMIT QUERY
              onPress={handleAskOracle}
            />
          )}
        </View>
      </View>
    );
  };

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
      <SafeAreaView style={styles.container}>
        {renderLoadingScreen()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Render StepTracker if not in wisdom mode or if desired */}
      {/* For now, always render it based on current logic */}
      {!isLoadingBanner && showBanner && (
        <OnboardingBanner
          toolName="Oracle"
          description="Welcome to the Oracle. Explore personalized quests or seek direct wisdom."
          onDismiss={dismissBanner}
        />
      )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { // Main screen container
    flex: 1,
    backgroundColor: 'transparent', // Handled by AppBackground
  },
  scrollView: { // Parent scroll view for the entire screen
    flex: 1,
  },
  scrollContent: { // contentContainerStyle for the main ScrollView
    flexGrow: 1, // Important for centering content when it's short
    padding: theme.spacing.lg, // Overall padding for the screen content
    justifyContent: 'center', // Center content vertically if flexGrow is active
  },
  oracleWisdomViewWrapper: {
    flex: 1,
    // The ScrollView's contentContainerStyle (scrollContent) handles overall centering.
    // This wrapper can manage internal layout if needed, but might not need flex:1 if scrollContent does its job.
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl, // mb-8
  },
  pageTitle: { // "ORACLE"
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize, // 24px
    fontWeight: theme.typography.displayMedium.fontWeight, // '700'
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: { // "Ask & Receive"
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  oracleInteractiveContent: { // Groups loader/paragraph, input, and button
    flexGrow: 1,
    justifyContent: 'center', // Center this block vertically
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing.lg,
  },
  pulseLoaderContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom is handled by parent gap of oracleInteractiveContent
  },
  pulseBlip: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
    // Opacity and transform are handled by Animated styles
  },
  descriptiveParagraph: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    lineHeight: (theme.typography.bodyMedium.lineHeight || 20) * 1.5, // leading-relaxed
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300, // max-w-sm equivalent
    alignSelf: 'center',
    // marginBottom: theme.spacing.lg, // Handled by parent gap
  },
  // Input Panel Styles (similar to FrequencyMapperScreen)
  inputPanelContainer: {
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm, // 8px
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    // marginBottom: theme.spacing.lg, // Handled by parent gap
    padding: 0, // Padding is on TextInput
    width: '100%', // Take full width available
    minHeight: 100, // Example min height, adjust as needed for multiline
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 5,
  },
  inputPanelLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: theme.colors.bg, // Match app background
    paddingHorizontal: theme.spacing.xs,
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    fontWeight: theme.typography.labelSmall.fontWeight,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: theme.typography.labelSmall.letterSpacing,
    zIndex: 1,
  },
  textInputMain: { // For Oracle Query
    backgroundColor: 'transparent',
    padding: theme.spacing.md, // 16px
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 22.5,
    textAlignVertical: 'top', // For multiline input
    minHeight: 80, // Ensure decent height for multiline
  },
  // Styles for displaying previous messages
  messagesScrollView: {
    maxHeight: 200, // Limit height of message history
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly different from input panel
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.base2,
  },
  messageSection: {
    marginBottom: theme.spacing.sm,
  },
  messageLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  messageText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.bodyMedium.lineHeight,
  },
  messageTimestamp: {
    fontFamily: theme.fonts.mono,
    fontSize: 10, // Smaller for timestamp
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  // Styles for other parts of the Oracle screen (awakening, quest_selection, etc.) are kept as is for now.
  // ... (keep existing styles for loadingContainer, awakeningContainer, etc.)
  loadingContainer: { // Ensure loadingContainer is styled if used as fallback
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
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
    lineHeight: 20,
  },
  awakeningContainer: {
    flex: 1,
  },
  journeySummary: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent, // Updated
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  oracleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.accent, // Updated
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
    color: theme.colors.textSecondary, // Updated
    marginBottom: 4,
  },
  journeyText: {
    fontSize: 16,
    color: theme.colors.textPrimary, // Updated
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
    color: theme.colors.processingCore, // Updated
  },
  heroPath: {
    color: theme.colors.driveMechanics, // Updated
  },
  energeticSignature: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
  },
  energyText: {
    fontWeight: '600',
    color: theme.colors.accent, // Updated
  },
  chartAcknowledgment: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 12,
  },
  chartSummary: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 12,
  },
  chartGifts: {
    fontSize: 15,
    color: theme.colors.accent, // Updated
    fontWeight: '500',
  },
  pathCommitment: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commitmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  commitmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowButton: {
    backgroundColor: theme.colors.processingCore, // Updated
  },
  heroButton: {
    backgroundColor: theme.colors.driveMechanics, // Updated
  },
  commitmentButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  questSelectionContainer: {
    flex: 1,
  },
  questSelectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    textAlign: 'center',
    marginBottom: 8,
  },
  questSelectionSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  questCard: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowQuestCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.processingCore, // Updated
  },
  heroQuestCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.driveMechanics, // Updated
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
    color: theme.colors.textPrimary, // Updated
    marginRight: 12,
  },
  questTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shadowTag: {
    backgroundColor: theme.colors.processingCore, // Updated
  },
  heroTag: {
    backgroundColor: theme.colors.driveMechanics, // Updated
  },
  questTypeText: {
    color: theme.colors.bg, // Updated
    fontSize: 12,
    fontWeight: '500',
  },
  questDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 16,
  },
  questDetails: {
    marginBottom: 16,
  },
  questObjective: {
    fontSize: 15,
    color: theme.colors.textPrimary, // Updated
    fontWeight: '500',
    marginBottom: 8,
  },
  questDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
  },
  questChartIntegration: {
    backgroundColor: theme.colors.base1, // Updated
    padding: 12,
    borderRadius: 8,
  },
  chartIntegrationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 4,
  },
  chartIntegrationText: {
    fontSize: 13,
    color: theme.colors.textSecondary, // Updated
  },
  activeQuestContainer: {
    flex: 1,
  },
  questProgress: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeQuestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.base1, // Updated
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent, // Updated
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
  },
  questContent: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questObjectiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  questObjectiveText: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 16,
  },
  dailyPracticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  dailyPracticeText: {
    fontSize: 15,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 22,
    marginBottom: 16,
  },
  successCriteria: {
    backgroundColor: theme.colors.base1, // Updated
    padding: 16,
    borderRadius: 12,
  },
  successCriteriaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 8,
  },
  criteriaItem: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
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
    backgroundColor: theme.colors.accent, // Updated
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    backgroundColor: theme.colors.driveMechanics, // Updated (or accent)
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  hintsSection: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hintsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.base1, // Updated
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  hintPreview: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${theme.colors.base6}80`, // Updated (base6 with 50% opacity)
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hintModal: {
    backgroundColor: theme.colors.bg, // Updated
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  hintModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 16,
    textAlign: 'center',
  },
  hintModalText: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Updated
    lineHeight: 24,
    marginBottom: 16,
  },
  hintModalPractice: {
    fontSize: 15,
    color: theme.colors.accent, // Updated
    fontWeight: '500',
    marginBottom: 16,
  },
  hintModalEncouragement: {
    fontSize: 15,
    color: theme.colors.driveMechanics, // Updated (or accent)
    fontStyle: 'italic',
    marginBottom: 24,
  },
  hintModalButton: {
    backgroundColor: theme.colors.accent, // Updated
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintModalButtonText: {
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
  wisdomContainer: { // This style might be redundant if oracleWisdomViewWrapper covers it
    flex: 1,
  },
  wisdomHeader: { // This seems to be covered by titleSection now
    backgroundColor: theme.colors.bg, // Updated
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wisdomTitle: { // Covered by pageTitle
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.accent, // Updated
    marginBottom: 8,
  },
  wisdomSubtitle: { // Covered by pageSubtitle
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
  },
  messagesContainer: { // Covered by messagesScrollView
    flex: 1,
    marginBottom: 16,
  },
  welcomeCard: { // This is the "Oracle Awaits" card, covered by descriptiveParagraph + oracleInteractiveContent
    backgroundColor: theme.colors.bg, // Updated
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  welcomeTitle: { // Part of descriptiveParagraph styling
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Updated
    marginBottom: 12,
  },
  welcomeText: { // Part of descriptiveParagraph styling
    fontSize: 14,
    color: theme.colors.textSecondary, // Updated
    textAlign: 'center',
    lineHeight: 20,
  },
  thinkingCard: { // Covered by pulseLoaderContainer
    backgroundColor: theme.colors.accentGlow, // Updated (e.g. light blue)
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  thinkingText: { // Part of pulseLoaderContainer visual
    fontSize: 16,
    color: theme.colors.accent, // Updated
    fontStyle: 'italic',
    marginBottom: 12,
  },
  thinkingDots: { // Covered by pulseBlips
    flexDirection: 'row',
  },
  dot: { // Covered by pulseBlip style
    fontSize: 20,
    color: theme.colors.accent, // Updated
    marginHorizontal: 4,
  },
  // messageCard is already themed for new Oracle, this is for legacy if still used
  // messageCard: { // Styles for previously asked questions
  //   backgroundColor: theme.colors.bg, // Updated
  //   padding: 20,
  //   borderRadius: 12,
  //   marginBottom: 16,
  //   shadowColor: theme.shadows.small.shadowColor, // Updated
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 5,
  // },
  questionSection: { // Within messageCard
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base1, // Updated
  },
  questionLabel: { // Within messageCard
    fontSize: 12,
    color: theme.colors.textSecondary, // Updated
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  questionText: { // Within messageCard
    fontSize: 16,
    color: theme.colors.textPrimary, // Updated
    fontStyle: 'italic',
  },
  answerSection: { // Within messageCard
    position: 'relative',
  },
  answerLabel: { // Within messageCard
    fontSize: 12,
    color: theme.colors.textSecondary, // Updated
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  answerText: { // Within messageCard
    fontSize: 16,
    color: theme.colors.textPrimary, // Updated
    lineHeight: 22,
    marginBottom: 8,
  },
  timestamp: { // Within messageCard
    fontSize: 12,
    color: theme.colors.base2, // Updated
    textAlign: 'right',
  },
  inputContainer: { // This is inputPanelContainer now
    backgroundColor: theme.colors.bg, // Updated
    padding: 16, // This was likely for the old input structure, inputPanelContainer has its own padding logic
    borderRadius: 16,
    shadowColor: theme.shadows.small.shadowColor, // Updated
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionInput: { // This is textInputMain now
    borderWidth: 1,
    borderColor: theme.colors.base2, // Updated
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  askButton: { // This is the StackedButton now
    backgroundColor: theme.colors.accent, // Updated
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { // StackedButton might have its own disabled style
    backgroundColor: theme.colors.base2, // Updated
  },
  buttonText: { // For StackedButton text, usually theme.colors.bg
    color: theme.colors.bg, // Updated
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OracleScreen;