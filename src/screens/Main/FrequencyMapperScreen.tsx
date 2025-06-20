/**
 * @file FrequencyMapperScreen.tsx
 * @description Dynamic, Drive Mechanics-personalized Desire Refinement Experience
 */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import StepTracker from '../../components/StepTracker'; // Import StepTracker
import { FLOW_STEPS, STEP_LABELS } from '../../constants/flowSteps'; // Import constants
import ScreenExplainer from '../../components/ScreenExplainer'; // Import ScreenExplainer
import { SCREEN_EXPLAINERS } from '../../constants/screenExplainers'; // Import SCREEN_EXPLAINERS
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import StackedButton from '../../components/StackedButton';
import { theme } from '../../constants/theme'; // Import full theme
import baseChartService, {BaseChartData} from '../../services/baseChartService';
import aiFrequencyMapperService from '../../services/aiFrequencyMapperService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Drive Mechanics Types
type MotivationColor = 'Need' | 'Want' | 'Desire' | 'Transfer' | undefined;
type HeartState = 'Defined' | 'Undefined' | undefined;
type RootState = 'Defined' | 'Undefined' | undefined;
type VenusSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces' | undefined;
type KineticDriveSpectrum = 'Steady' | 'Dynamic' | undefined;
type ResonanceFieldSpectrum = string | undefined;

// Frequency Mapper Types
interface ReflectionOutput {
  reflection_insight: string;
  deepening_questions: string[];
  energetic_observation: string;
}

interface ChoiceOption {
  title: string;
  description: string;
  energy_quality: string;
}

interface ChoiceOutput {
  choice_a: ChoiceOption;
  choice_b: ChoiceOption;
  choice_context: string;
}

interface CrystallizationOutput {
  desired_state: string;
  energetic_quality: string;
  sensation_preview: string;
  drive_mechanics_connection: string;
  calibration_preparation: string;
}

interface FrequencyMapperOutput {
  desired_state: string;
  source_statement: string;
  mapped_drive_mechanic: string;
  contextual_energy_family: string;
  energetic_quality: string;
  sensation_preview: string;
  refinement_path: string[];
  session_metadata: {
    session_id: string;
    completion_timestamp: string;
    rounds_completed: number;
  }
}

// Enhanced AI service integration - calls backend AI templates
const callAIService = async (
  templateId: string,
  inputs: Record<string, any>,
  driveContext: any,
  sessionId: string
): Promise<any> => {
  try {
    return await aiFrequencyMapperService.generateResponse(
      templateId,
      inputs,
      driveContext,
      sessionId
    );
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};

// Enhanced simulation with template-based responses
const simulateEnhancedAIResponse = async (
  templateId: string,
  inputs: Record<string, any>,
  driveContext: any
): Promise<any> => {
  // Add small delay to simulate API response
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // fm_initial_reflection_v2 template
  if (templateId === 'fm_initial_reflection_v2') {
    const { raw_statement } = inputs;
    const motivationLanguage = getMotivationLanguage(driveContext.motivation_color);
    const heartEnergyStyle = driveContext.heart_state === 'Defined' ? 'consistent willpower-driven' : 'flow-responsive pressure-sensitive';
    const venusAesthetic = getVenusAesthetic(driveContext.venus_sign);
    
    return {
      reflection_insight: `${motivationLanguage.insight} Your ${venusAesthetic.quality} nature is calling for ${venusAesthetic.desire_type} that honors your ${heartEnergyStyle} energy pattern.`,
      deepening_questions: [
        `What sensations would flow through your body when this ${motivationLanguage.outcome_type} is realized?`,
        `Your ${driveContext.heart_state} Heart energy ${heartEnergyStyle === 'consistent willpower-driven' ? 'thrives on clear direction - what would consistent progress toward this feel like?' : 'responds to pressure and flow - where do you feel the natural pull versus resistance around this?'}`,
        `Beneath the details, what ${venusAesthetic.core_value} are you truly seeking to experience?`
      ],
      energetic_observation: `Your statement carries a ${driveContext.kinetic_drive_spectrum === 'Steady' ? 'grounded, sustainable' : 'dynamic, rhythmic'} energy signature with ${venusAesthetic.quality} undertones.`
    };
  }
  
  // fm_directional_choices_v2 template
  if (templateId === 'fm_directional_choices_v2') {
    const { raw_statement, previous_choices } = inputs;
    const motivationApproach = getMotivationApproach(driveContext.motivation_color);
    const venusStyle = getVenusChoiceStyle(driveContext.venus_sign);
    
    return {
      choice_a: {
        title: motivationApproach.toward_title,
        description: `${motivationApproach.toward_description} ${venusStyle.toward_enhancement} This path honors your ${driveContext.venus_sign} way of creating value through forward movement.`,
        energy_quality: motivationApproach.toward_energy
      },
      choice_b: {
        title: motivationApproach.away_title,
        description: `${motivationApproach.away_description} ${venusStyle.away_enhancement} This path respects your ${driveContext.heart_state} Heart's ${driveContext.heart_state === 'Defined' ? 'ability to sustain clear boundaries' : 'wisdom in releasing what creates pressure'}.`,
        energy_quality: motivationApproach.away_energy
      },
      choice_context: `Your ${driveContext.motivation_color} motivation creates ${motivationApproach.context_quality} between building and releasing - both paths honor your natural energy signature.`
    };
  }
  
  // fm_experiential_choices_v2 template
  if (templateId === 'fm_experiential_choices_v2') {
    const { raw_statement, previous_choices } = inputs;
    const venusElement = getVenusElement(driveContext.venus_sign);
    const kineticStyle = driveContext.kinetic_drive_spectrum;
    
    const experientialChoices = getVenusExperientialChoices(venusElement, kineticStyle);
    
    return {
      choice_a: {
        title: experientialChoices.primary.title,
        description: `${experientialChoices.primary.description} This resonates with your ${driveContext.venus_sign} need for ${experientialChoices.primary.venus_connection} and your ${kineticStyle} kinetic drive.`,
        energy_quality: experientialChoices.primary.energy_quality
      },
      choice_b: {
        title: experientialChoices.secondary.title,
        description: `${experientialChoices.secondary.description} This honors your ${driveContext.venus_sign} appreciation for ${experientialChoices.secondary.venus_connection} and complements your ${kineticStyle} energy pattern.`,
        energy_quality: experientialChoices.secondary.energy_quality
      },
      choice_context: `Your ${driveContext.venus_sign} Venus creates these beautiful ${venusElement.toLowerCase()} element expressions of your desire, each offering a different pathway to fulfillment.`
    };
  }
  
  // fm_essence_choices_v2 template
  if (templateId === 'fm_essence_choices_v2') {
    const { raw_statement, previous_choices } = inputs;
    const essenceChoices = getPersonalizedEssenceChoices(driveContext);
    
    return {
      choice_a: {
        title: essenceChoices.self_expression.title,
        description: `${essenceChoices.self_expression.description} Your ${driveContext.heart_state} Heart ${driveContext.heart_state === 'Defined' ? 'provides consistent willpower for authentic expression' : 'allows for fluid, pressure-responsive authenticity'}.`,
        energy_quality: essenceChoices.self_expression.energy_quality
      },
      choice_b: {
        title: essenceChoices.relational_harmony.title,
        description: `${essenceChoices.relational_harmony.description} Your ${driveContext.root_state} Root ${driveContext.root_state === 'Defined' ? 'creates stable foundations for connection' : 'brings adaptive wisdom to relationships'}.`,
        energy_quality: essenceChoices.relational_harmony.energy_quality
      },
      choice_context: `These essence qualities blend your ${driveContext.motivation_color} energy with your unique ${driveContext.venus_sign} values, offering different pathways to core fulfillment.`
    };
  }
  
  // fm_final_crystallization_v2 template
  if (templateId === 'fm_final_crystallization_v2') {
    const { raw_statement, refinement_path } = inputs;
    const crystallization = generatePersonalizedCrystallization(driveContext, refinement_path, raw_statement);
    
    return {
      desired_state: crystallization.desired_state,
      energetic_quality: crystallization.energetic_quality,
      sensation_preview: crystallization.sensation_preview,
      drive_mechanics_connection: crystallization.drive_mechanics_connection,
      calibration_preparation: crystallization.calibration_preparation
    };
  }
  
  // Fallback
  return {};
};

// Enhanced helper functions for Drive Mechanics personalization

// Helper to determine Venus element from sign
const getVenusElement = (venusSign?: string): 'Fire' | 'Earth' | 'Air' | 'Water' | 'Unknown' => {
  if (!venusSign) return 'Unknown';
  
  const fireSign = ['Aries', 'Leo', 'Sagittarius'].includes(venusSign);
  const earthSign = ['Taurus', 'Virgo', 'Capricorn'].includes(venusSign);
  const airSign = ['Gemini', 'Libra', 'Aquarius'].includes(venusSign);
  const waterSign = ['Cancer', 'Scorpio', 'Pisces'].includes(venusSign);
  
  if (fireSign) return 'Fire';
  if (earthSign) return 'Earth';
  if (airSign) return 'Air';
  if (waterSign) return 'Water';
  return 'Unknown';
};

// Get motivation-specific language patterns
const getMotivationLanguage = (motivationColor?: string) => {
  switch(motivationColor) {
    case 'Need':
      return {
        insight: "I sense an urgent calling that needs your attention.",
        outcome_type: "necessity",
        verb: "requires"
      };
    case 'Want':
      return {
        insight: "I feel a strong pull toward something that's calling to you.",
        outcome_type: "aspiration", 
        verb: "draws"
      };
    case 'Desire':
      return {
        insight: "I notice a bright spark of possibility that would light you up.",
        outcome_type: "inspiration",
        verb: "ignites"
      };
    case 'Transfer':
      return {
        insight: "I sense energy that wants to move through you into the world.",
        outcome_type: "expression",
        verb: "flows"
      };
    default:
      return {
        insight: "I sense something significant that's emerging for you.",
        outcome_type: "manifestation",
        verb: "calls"
      };
  }
};

// Get Venus sign aesthetic preferences
const getVenusAesthetic = (venusSign?: string) => {
  switch(venusSign) {
    case 'Aries':
      return { quality: "bold, pioneering", desire_type: "adventurous expression", core_value: "courageous authenticity" };
    case 'Taurus':
      return { quality: "sensual, grounded", desire_type: "stable beauty", core_value: "embodied pleasure" };
    case 'Gemini':
      return { quality: "curious, adaptable", desire_type: "intellectual stimulation", core_value: "mental agility" };
    case 'Cancer':
      return { quality: "nurturing, intuitive", desire_type: "emotional security", core_value: "deep belonging" };
    case 'Leo':
      return { quality: "radiant, expressive", desire_type: "creative recognition", core_value: "authentic self-expression" };
    case 'Virgo':
      return { quality: "refined, practical", desire_type: "meaningful service", core_value: "purposeful contribution" };
    case 'Libra':
      return { quality: "harmonious, diplomatic", desire_type: "balanced beauty", core_value: "relational harmony" };
    case 'Scorpio':
      return { quality: "intense, transformative", desire_type: "deep intimacy", core_value: "authentic power" };
    case 'Sagittarius':
      return { quality: "expansive, philosophical", desire_type: "adventurous wisdom", core_value: "meaningful freedom" };
    case 'Capricorn':
      return { quality: "ambitious, structured", desire_type: "lasting achievement", core_value: "respected mastery" };
    case 'Aquarius':
      return { quality: "innovative, humanitarian", desire_type: "unique contribution", core_value: "progressive vision" };
    case 'Pisces':
      return { quality: "compassionate, transcendent", desire_type: "spiritual connection", core_value: "universal love" };
    default:
      return { quality: "unique, personal", desire_type: "authentic expression", core_value: "true fulfillment" };
  }
};

// Get motivation-specific directional approaches
const getMotivationApproach = (motivationColor?: string) => {
  switch(motivationColor) {
    case 'Need':
      return {
        toward_title: "Building what's required",
        toward_description: "This path focuses on creating the structures and foundations that are essential.",
        toward_energy: "Grounding",
        away_title: "Clearing what blocks",
        away_description: "This path emphasizes removing obstacles and limitations that prevent progress.",
        away_energy: "Liberating",
        context_quality: "purposeful tension"
      };
    case 'Want':
      return {
        toward_title: "Moving toward attraction",
        toward_description: "This path follows what naturally draws and inspires you forward.",
        toward_energy: "Magnetic",
        away_title: "Releasing resistance",
        away_description: "This path involves letting go of what creates friction or hesitation.",
        away_energy: "Flowing",
        context_quality: "attractive tension"
      };
    case 'Desire':
      return {
        toward_title: "Embracing what ignites",
        toward_description: "This path moves toward what brings passion and aliveness.",
        toward_energy: "Inspiring",
        away_title: "Dissolving what dims",
        away_description: "This path releases what dampens your natural radiance and joy.",
        away_energy: "Brightening",
        context_quality: "luminous tension"
      };
    case 'Transfer':
      return {
        toward_title: "Channeling what flows",
        toward_description: "This path creates vessels for energy to move through you into form.",
        toward_energy: "Conducting",
        away_title: "Clearing blockages",
        away_description: "This path removes what impedes the natural flow of energy.",
        away_energy: "Opening",
        context_quality: "flowing tension"
      };
    default:
      return {
        toward_title: "Moving toward growth",
        toward_description: "This path focuses on expansion and new possibilities.",
        toward_energy: "Expansive",
        away_title: "Releasing limitations",
        away_description: "This path emphasizes letting go of what no longer serves.",
        away_energy: "Liberating",
        context_quality: "dynamic tension"
      };
  }
};

// Get Venus-specific choice styling
const getVenusChoiceStyle = (venusSign?: string) => {
  const aesthetic = getVenusAesthetic(venusSign);
  return {
    toward_enhancement: `Your ${aesthetic.quality} nature finds beauty in forward momentum.`,
    away_enhancement: `Your appreciation for ${aesthetic.core_value} supports release of what doesn't align.`
  };
};

// Get Venus element experiential choices
const getVenusExperientialChoices = (element: string, kineticStyle?: string) => {
  const baseChoices = {
    Fire: {
      primary: {
        title: "Energized and inspired",
        description: "A state of dynamic creative fire that fuels bold action and passionate expression.",
        venus_connection: "spontaneous creativity",
        energy_quality: "Igniting"
      },
      secondary: {
        title: "Centered and confident",
        description: "A state of grounded fire that burns steady and strong without burning out.",
        venus_connection: "sustainable passion",
        energy_quality: "Radiant"
      }
    },
    Earth: {
      primary: {
        title: "Stable and flourishing",
        description: "A state of rooted growth where progress is tangible and sustainable.",
        venus_connection: "embodied abundance",
        energy_quality: "Prospering"
      },
      secondary: {
        title: "Sensual and present",
        description: "A state of grounded pleasure that finds richness in the here and now.",
        venus_connection: "embodied pleasure",
        energy_quality: "Savoring"
      }
    },
    Air: {
      primary: {
        title: "Clear and connected",
        description: "A state of mental lucidity where insights flow and connections spark.",
        venus_connection: "intellectual beauty",
        energy_quality: "Illuminating"
      },
      secondary: {
        title: "Free and inspired",
        description: "A state of liberated thinking that dances with new possibilities.",
        venus_connection: "mental freedom",
        energy_quality: "Elevating"
      }
    },
    Water: {
      primary: {
        title: "Flowing and intuitive",
        description: "A state of emotional fluidity where wisdom arises from the depths.",
        venus_connection: "emotional intelligence",
        energy_quality: "Flowing"
      },
      secondary: {
        title: "Deep and nourishing",
        description: "A state of emotional richness that feeds the soul and heals hearts.",
        venus_connection: "emotional depth",
        energy_quality: "Nourishing"
      }
    }
  };

  return baseChoices[element as keyof typeof baseChoices] || baseChoices.Fire;
};

// Generate personalized essence choices
const getPersonalizedEssenceChoices = (driveContext: any) => {
  const venusAesthetic = getVenusAesthetic(driveContext.venus_sign);
  const motivationEnergy = getMotivationLanguage(driveContext.motivation_color);
  
  return {
    self_expression: {
      title: `Authentically ${venusAesthetic.quality.split(',')[0]}`,
      description: `A state of being fully aligned with your ${venusAesthetic.quality} nature, expressing your truth with confidence.`,
      energy_quality: "Authentic"
    },
    relational_harmony: {
      title: `Harmoniously connected`,
      description: `A state of ${venusAesthetic.core_value} in relationship, where your energy naturally enhances and is enhanced by others.`,
      energy_quality: "Harmonious"
    }
  };
};

// Generate final crystallization based on complete journey
const generatePersonalizedCrystallization = (driveContext: any, refinementPath: string[], rawStatement: string) => {
  const motivationLang = getMotivationLanguage(driveContext.motivation_color);
  const venusAesthetic = getVenusAesthetic(driveContext.venus_sign);
  const kineticQuality = driveContext.kinetic_drive_spectrum === 'Steady' ? 'consistent, sustainable' : 'dynamic, rhythmic';
  const heartStyle = driveContext.heart_state === 'Defined' ? 'willful expression' : 'responsive authenticity';
  const rootStyle = driveContext.root_state === 'Defined' ? 'stable grounding' : 'adaptive wisdom';
  
  // Build personalized desired state
  const coreQualities = refinementPath.filter(Boolean).map(choice => choice.toLowerCase());
  const essenceBlend = coreQualities.length > 0 ? coreQualities.join(' while ') : 'aligned and flowing';
  
  return {
    desired_state: `I am ${essenceBlend}, expressing my ${venusAesthetic.quality} nature with ${heartStyle} and ${rootStyle}`,
    energetic_quality: `A ${kineticQuality} flow of ${venusAesthetic.core_value} that ${motivationLang.verb} through ${heartStyle}. This creates a sustainable state where your ${driveContext.venus_sign} values meet your ${driveContext.motivation_color} energy in perfect harmony.`,
    sensation_preview: generateSensationPreview(driveContext, coreQualities),
    drive_mechanics_connection: `Your ${driveContext.motivation_color} motivation combined with your ${driveContext.venus_sign} Venus creates this unique signature of ${venusAesthetic.core_value}. Your ${driveContext.heart_state} Heart provides ${heartStyle} while your ${driveContext.root_state} Root offers ${rootStyle}, creating the perfect foundation for this desired state.`,
    calibration_preparation: `Now let's explore how aligned you currently are with this beautifully personalized state, revealing your optimal path for manifestation.`
  };
};

// Generate embodied sensation preview
const generateSensationPreview = (driveContext: any, coreQualities: string[]) => {
  const element = getVenusElement(driveContext.venus_sign);
  const kinetic = driveContext.kinetic_drive_spectrum;
  
  const sensationMap = {
    Fire: {
      Steady: "Like a warm, steady flame in your chest that radiates consistent warmth and confidence throughout your body",
      Dynamic: "Like waves of inspiring energy that pulse rhythmically from your heart, energizing your entire being"
    },
    Earth: {
      Steady: "Like rich, fertile earth beneath your feet that supports every step with unwavering stability and nourishment",
      Dynamic: "Like the gentle, powerful growth of a tree - rooted yet reaching, stable yet ever-expanding"
    },
    Air: {
      Steady: "Like a clear, refreshing breeze that consistently clears your mind and opens your awareness",
      Dynamic: "Like dancing air currents that lift and inspire, bringing fresh perspectives with each breath"
    },
    Water: {
      Steady: "Like a deep, peaceful lake that holds infinite wisdom while maintaining perfect emotional clarity",
      Dynamic: "Like flowing water that moves gracefully around obstacles, always finding the path of ease and flow"
    }
  };
  
  const elementMap = sensationMap[element as keyof typeof sensationMap] || sensationMap.Air;
  return elementMap[kinetic as keyof typeof elementMap] || elementMap.Steady;
};

// Helper to get session ID
const getSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const FrequencyMapperScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // User state
  const [userId, setUserId] = useState<string | null>(null);
  const [userDriveProfile, setUserDriveProfile] = useState<{
    motivation_color?: MotivationColor;
    heart_state?: HeartState;
    root_state?: RootState;
    venus_sign?: VenusSign;
    kinetic_drive_spectrum?: KineticDriveSpectrum;
    resonance_field_spectrum?: ResonanceFieldSpectrum;
  }>({});
  const [energyFamily, setEnergyFamily] = useState<string>('');
  
  // Flow state
  const [currentStep, setCurrentStep] = useState<'entry' | 'reflection' | 'directional' | 'experiential' | 'essence' | 'crystallization'>('entry');
  const [visualCurrentStep, setVisualCurrentStep] = useState<number>(1); // State for visual tracker
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Input state
  const [userInput, setUserInput] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text'); // Keep if voice input is a future feature
  const [reflectionAnswers, setReflectionAnswers] = useState<string[]>(['', '', '']);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false); // For input panel focus state
  
  // AI Response state
  const [reflectionOutput, setReflectionOutput] = useState<ReflectionOutput | null>(null);
  const [directionalChoices, setDirectionalChoices] = useState<ChoiceOutput | null>(null);
  const [experientialChoices, setExperientialChoices] = useState<ChoiceOutput | null>(null);
  const [essenceChoices, setEssenceChoices] = useState<ChoiceOutput | null>(null);
  const [crystallizationOutput, setCrystallizationOutput] = useState<CrystallizationOutput | null>(null);
  
  // Choice tracking
  const [selectedChoices, setSelectedChoices] = useState<{
    directional: 'a' | 'b' | null;
    experiential: 'a' | 'b' | null;
    essence: 'a' | 'b' | null;
  }>({
    directional: null,
    experiential: null,
    essence: null
  });
  
  // Final output
  const [finalOutput, setFinalOutput] = useState<FrequencyMapperOutput | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user ID from storage
        const storedUserId = await AsyncStorage.getItem('userId');
        let currentUserId = storedUserId || 'mock-user-123';
        setUserId(currentUserId);
        
        if (storedUserId) {
          // Load base chart data
          const baseChartResponse = await baseChartService.getUserBaseChart(storedUserId);
          
          if (baseChartResponse.success && baseChartResponse.data) {
            const { drive_mechanics, energy_family } = baseChartResponse.data;
            
            // Extract drive mechanics data
            setUserDriveProfile({
              motivation_color: drive_mechanics?.motivation_color as MotivationColor,
              heart_state: drive_mechanics?.heart_state as HeartState,
              root_state: drive_mechanics?.root_state as RootState,
              venus_sign: drive_mechanics?.venus_sign as VenusSign,
              kinetic_drive_spectrum: drive_mechanics?.kinetic_drive_spectrum as KineticDriveSpectrum,
              resonance_field_spectrum: drive_mechanics?.resonance_field_spectrum
            });
            
            // Extract energy family context
            if (energy_family) {
              setEnergyFamily(`${energy_family.profile_lines} Profile, ${energy_family.astro_sun_sign} Sun`);
            }
          }
        } else {
          // Set mock drive profile for development
          setUserDriveProfile({
            motivation_color: 'Need',
            heart_state: 'Defined',
            root_state: 'Undefined',
            venus_sign: 'Taurus',
            kinetic_drive_spectrum: 'Steady',
            resonance_field_spectrum: 'Focused'
          });
          
          setEnergyFamily('3/5 Profile, Taurus Sun');
        }
        
        // Initialize AI session
        try {
          const newSessionId = await aiFrequencyMapperService.initializeSession(currentUserId, 'frequency_mapper');
          setSessionId(newSessionId);
        } catch (error) {
          console.warn('Failed to initialize AI session, using local ID:', error);
          setSessionId(getSessionId());
        }
        
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback session ID
        setSessionId(getSessionId());
      }
    };
    
    loadUserData();
  }, []);

  // Effect to update visualCurrentStep based on internal currentStep
  useEffect(() => {
    switch (currentStep) {
      case 'entry':
      case 'reflection':
        setVisualCurrentStep(1);
        break;
      case 'directional':
      case 'experiential':
      case 'essence':
        setVisualCurrentStep(2);
        break;
      case 'crystallization':
        setVisualCurrentStep(3);
        break;
      default:
        setVisualCurrentStep(1);
    }
  }, [currentStep]);

  // Get motivation-specific prompt
  const getMotivationPrompt = (): string => {
    switch(userDriveProfile.motivation_color) {
      case 'Need':
        return "What's emerging that needs your attention?";
      case 'Want':
        return "What's calling to you right now?";
      case 'Desire':
        return "What would light you up to experience?";
      case 'Transfer':
        return "What energy wants to move through you?";
      default:
        return "What's emerging for you right now?";
    }
  };
  
  // Handle user input submission
  const handleInputSubmit = async () => {
    if (!userInput.trim()) {
      Alert.alert('Please enter something to continue');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const reflection = await callAIService('fm_initial_reflection_v2', {
        raw_statement: userInput,
        drive_mechanic_summary: JSON.stringify(userDriveProfile),
        motivation_color: userDriveProfile.motivation_color,
        heart_state: userDriveProfile.heart_state,
        venus_sign: userDriveProfile.venus_sign
      }, userDriveProfile, sessionId);
      
      // Update session progress
      await aiFrequencyMapperService.updateSessionProgress(sessionId, 'reflection', reflection);
      
      // Extract data from API response if it's wrapped
      const reflectionData = reflection.data || reflection;
      setReflectionOutput(reflectionData);
      setCurrentStep('reflection');
    } catch (error) {
      console.error('Error getting reflection:', error);
      Alert.alert('Error', 'Failed to process your input. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reflection question responses
  const handleReflectionComplete = async () => {
    setIsLoading(true);
    
    try {
      const directional = await callAIService('fm_directional_choices_v2', {
        raw_statement: userInput,
        previous_choices: [],
        round_type: 'directional'
      }, userDriveProfile, sessionId);
      
      // Update session progress
      await aiFrequencyMapperService.updateSessionProgress(sessionId, 'directional', directional);
      
      // Extract data from API response if it's wrapped
      const directionalData = directional.data || directional;
      setDirectionalChoices(directionalData);
      setCurrentStep('directional');
    } catch (error) {
      console.error('Error getting directional choices:', error);
      Alert.alert('Error', 'Failed to process your reflection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle directional choice selection
  const handleDirectionalChoice = async (choice: 'a' | 'b') => {
    setSelectedChoices({...selectedChoices, directional: choice});
    setIsLoading(true);
    
    try {
      const chosenDirectional = directionalChoices ? (choice === 'a' ? directionalChoices.choice_a.title : directionalChoices.choice_b.title) : '';
      const experiential = await callAIService('fm_experiential_choices_v2', {
        raw_statement: userInput,
        previous_choices: [chosenDirectional],
        round_type: 'experiential'
      }, userDriveProfile, sessionId);
      
      // Update session progress
      await aiFrequencyMapperService.updateSessionProgress(sessionId, 'experiential', { choice: chosenDirectional, choices: experiential });
      
      // Extract data from API response if it's wrapped
      const experientialData = experiential.data || experiential;
      setExperientialChoices(experientialData);
      setCurrentStep('experiential');
    } catch (error) {
      console.error('Error getting experiential choices:', error);
      Alert.alert('Error', 'Failed to process your choice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle experiential choice selection
  const handleExperientialChoice = async (choice: 'a' | 'b') => {
    setSelectedChoices({...selectedChoices, experiential: choice});
    setIsLoading(true);
    
    try {
      const chosenDirectional = directionalChoices ? (selectedChoices.directional === 'a' ? directionalChoices.choice_a.title : directionalChoices.choice_b.title) : '';
      const chosenExperiential = experientialChoices ? (choice === 'a' ? experientialChoices.choice_a.title : experientialChoices.choice_b.title) : '';
      
      const essence = await callAIService('fm_essence_choices_v2', {
        raw_statement: userInput,
        previous_choices: [chosenDirectional, chosenExperiential],
        round_type: 'essence'
      }, userDriveProfile, sessionId);
      
      // Update session progress
      await aiFrequencyMapperService.updateSessionProgress(sessionId, 'essence', { choice: chosenExperiential, choices: essence });
      
      // Extract data from API response if it's wrapped
      const essenceData = essence.data || essence;
      setEssenceChoices(essenceData);
      setCurrentStep('essence');
    } catch (error) {
      console.error('Error getting essence choices:', error);
      Alert.alert('Error', 'Failed to process your choice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle essence choice selection
  const handleEssenceChoice = async (choice: 'a' | 'b') => {
    setSelectedChoices({...selectedChoices, essence: choice});
    setIsLoading(true);
    
    try {
      // Build complete refinement path
      const chosenDirectional = directionalChoices ? (selectedChoices.directional === 'a' ? directionalChoices.choice_a.title : directionalChoices.choice_b.title) : '';
      const chosenExperiential = experientialChoices ? (selectedChoices.experiential === 'a' ? experientialChoices.choice_a.title : experientialChoices.choice_b.title) : '';
      const chosenEssence = essenceChoices ? (choice === 'a' ? essenceChoices.choice_a.title : essenceChoices.choice_b.title) : '';
      
      const refinementPath = [chosenDirectional, chosenExperiential, chosenEssence];
      
      const crystallization = await callAIService('fm_final_crystallization_v2', {
        raw_statement: userInput,
        refinement_path: refinementPath,
        drive_mechanic_summary: JSON.stringify(userDriveProfile),
        energy_family_summary: energyFamily,
        motivation_color: userDriveProfile.motivation_color,
        venus_sign: userDriveProfile.venus_sign
      }, userDriveProfile, sessionId);
      
      // Extract data from API response if it's wrapped
      const crystallizationData = crystallization.data || crystallization;
      setCrystallizationOutput(crystallizationData);
      
      // Create final output with enhanced structure
      const output: FrequencyMapperOutput = {
        desired_state: crystallizationData.desired_state,
        source_statement: userInput,
        mapped_drive_mechanic: JSON.stringify(userDriveProfile),
        contextual_energy_family: energyFamily,
        energetic_quality: crystallizationData.energetic_quality,
        sensation_preview: crystallizationData.sensation_preview,
        refinement_path: refinementPath,
        session_metadata: {
          session_id: sessionId,
          completion_timestamp: new Date().toISOString(),
          rounds_completed: 3
        }
      };
      
      setFinalOutput(output);
      setCurrentStep('crystallization');
      
      // Complete session and prepare handoff
      await aiFrequencyMapperService.completeSession(sessionId, output, 'calibration_tool');
      
      // Save to storage for Calibration Tool
      await AsyncStorage.setItem('frequencyMapperOutput', JSON.stringify(output));
      
    } catch (error) {
      console.error('Error getting crystallization:', error);
      Alert.alert('Error', 'Failed to process your choice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to Calibration Tool with session handoff
  const handleNavigateToCalibration = () => {
    console.log('Navigating to Calibration Tool with data:', {
      sessionId,
      hasOutput: !!finalOutput,
      outputKeys: finalOutput ? Object.keys(finalOutput) : []
    });
    
    if (finalOutput && sessionId) {
      // @ts-ignore
      navigation.navigate('CalibrationTool', {
        sessionId: sessionId,
        frequencyMapperOutput: finalOutput,
        previousTool: 'frequency_mapper'
      });
    } else {
      console.warn('Missing finalOutput or sessionId, using fallback navigation');
      // @ts-ignore
      navigation.navigate('CalibrationTool');
    }
  };
  
  // Reset the process
  const handleReset = () => {
    setUserInput('');
    setReflectionAnswers(['', '', '']);
    setReflectionOutput(null);
    setDirectionalChoices(null);
    setExperientialChoices(null);
    setEssenceChoices(null);
    setCrystallizationOutput(null);
    setSelectedChoices({
      directional: null,
      experiential: null,
      essence: null
    });
    setFinalOutput(null);
    setCurrentStep('entry');
    setSessionId(getSessionId());
  };

  // Get Venus-customized introduction
  const getVenusIntroduction = (): string => {
    const aesthetic = getVenusAesthetic(userDriveProfile.venus_sign);
    return `Your ${aesthetic.quality} nature values ${aesthetic.core_value}. Let's refine what's emerging for you.`;
  };

  // Get quick-start prompts based on motivation
  const getQuickStartPrompts = (): string[] => {
    switch(userDriveProfile.motivation_color) {
      case 'Need':
        return ["I need to address...", "Something urgent is...", "I must focus on..."];
      case 'Want':
        return ["I want to feel...", "I'm drawn to...", "I'd love to experience..."];
      case 'Desire':
        return ["I'm excited about...", "What lights me up is...", "I'm passionate about..."];
      case 'Transfer':
        return ["Energy wants to flow through...", "I feel called to share...", "Something wants to emerge as..."];
      default:
        return ["I want to feel...", "I need to address...", "Something's emerging around..."];
    }
  };

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  // Render entry screen
  const renderEntryScreen = () => {
    // const quickPrompts = getQuickStartPrompts(); // Keep for later if needed for quick prompts UI
    
    return (
      // This View will be styled as the main content block for the entry screen
      // It corresponds to the content within the ScrollView in the new structure
      <View style={styles.entryScreenContent}>
        <Text style={styles.introParagraph}>
          Input your emerging desire, intention, or situation. Be as descriptive as you wish.
        </Text>
        
        {/* Input Panel - Structure for now, detailed styling in next step */}
        <View style={[
          styles.inputPanelContainer,
          isInputFocused && styles.inputPanelFocused
        ]}>
          <Text style={styles.inputPanelLabel}>INPUT SIGNAL</Text>
          <TextInput
            style={styles.textInputMain}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Enter emerging desire, intention, or situation..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
            numberOfLines={4} // This is a suggestion, actual lines depend on height
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textSecondary} // Use theme
          />
        </View>
        
        <StackedButton
          type="rect"
          text={isLoading ? 'PROCESSING...' : 'PROCESS & MAP'}
          onPress={handleInputSubmit}
          // Button will take full width if its parent does.
        />
      </View>
    );
  };
  
  // Render reflection screen
  const renderReflectionScreen = () => {
    if (!reflectionOutput) return null;
    
    return (
      <>
        <ScreenExplainer text={SCREEN_EXPLAINERS.REFLECTION} />
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Reflection</Text>

          <Text style={styles.reflectionText}>{reflectionOutput.reflection_insight}</Text>
        <Text style={styles.energeticObservation}>{reflectionOutput.energetic_observation}</Text>
        
        <View style={styles.questionContainer}>
          {(reflectionOutput.deepening_questions || []).map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>{question}</Text>
              <TextInput
                style={styles.questionInput}
                placeholder="Your thoughts..."
                value={reflectionAnswers[index]}
                onChangeText={(text) => {
                  const newAnswers = [...reflectionAnswers];
                  newAnswers[index] = text;
                  setReflectionAnswers(newAnswers);
                }}
                multiline
              />
            </View>
          ))}
        </View>
        
        <StackedButton
          type="rect"
          text={isLoading ? 'PROCESSING...' : 'CONTINUE'}
          onPress={handleReflectionComplete}
        />
      </View>
    );
  };
  
  // Render directional choices
  const renderDirectionalChoices = () => {
    if (!directionalChoices) return null;
    
    return (
      <>
        <ScreenExplainer text={SCREEN_EXPLAINERS.DIRECTION} />
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Direction</Text>
          <Text style={styles.choiceContext}>{directionalChoices.choice_context}</Text>

          <View style={styles.choiceCardsContainer}>
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.directional === 'a' && styles.selectedChoice
            ]}
            onPress={() => handleDirectionalChoice('a')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{directionalChoices.choice_a.title}</Text>
            <Text style={styles.choiceDescription}>{directionalChoices.choice_a.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{directionalChoices.choice_a.energy_quality}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.directional === 'b' && styles.selectedChoice
            ]}
            onPress={() => handleDirectionalChoice('b')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{directionalChoices.choice_b.title}</Text>
            <Text style={styles.choiceDescription}>{directionalChoices.choice_b.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{directionalChoices.choice_b.energy_quality}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {isLoading && (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        )}
      </View>
    );
  };
  
  // Render experiential choices
  const renderExperientialChoices = () => {
    if (!experientialChoices) return null;
    
    return (
      <>
        <ScreenExplainer text={SCREEN_EXPLAINERS.EXPERIENCE} />
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Experience</Text>
          <Text style={styles.choiceContext}>{experientialChoices.choice_context}</Text>

          <View style={styles.choiceCardsContainer}>
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.experiential === 'a' && styles.selectedChoice
            ]}
            onPress={() => handleExperientialChoice('a')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{experientialChoices.choice_a.title}</Text>
            <Text style={styles.choiceDescription}>{experientialChoices.choice_a.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{experientialChoices.choice_a.energy_quality}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.experiential === 'b' && styles.selectedChoice
            ]}
            onPress={() => handleExperientialChoice('b')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{experientialChoices.choice_b.title}</Text>
            <Text style={styles.choiceDescription}>{experientialChoices.choice_b.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{experientialChoices.choice_b.energy_quality}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {isLoading && (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        )}
      </View>
    );
  };
  
  // Render essence choices
  const renderEssenceChoices = () => {
    if (!essenceChoices) return null;
    
    return (
      <>
        <ScreenExplainer text={SCREEN_EXPLAINERS.ESSENCE} />
        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Essence</Text>
          <Text style={styles.choiceContext}>{essenceChoices.choice_context}</Text>

          <View style={styles.choiceCardsContainer}>
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.essence === 'a' && styles.selectedChoice
            ]}
            onPress={() => handleEssenceChoice('a')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{essenceChoices.choice_a.title}</Text>
            <Text style={styles.choiceDescription}>{essenceChoices.choice_a.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{essenceChoices.choice_a.energy_quality}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.choiceCard, 
              selectedChoices.essence === 'b' && styles.selectedChoice
            ]}
            onPress={() => handleEssenceChoice('b')}
            disabled={isLoading}
          >
            <Text style={styles.choiceTitle}>{essenceChoices.choice_b.title}</Text>
            <Text style={styles.choiceDescription}>{essenceChoices.choice_b.description}</Text>
            <View style={styles.energyQualityTag}>
              <Text style={styles.energyQualityText}>{essenceChoices.choice_b.energy_quality}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {isLoading && (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        )}
      </View>
    );
  };
  
  // Render crystallization screen
  const renderCrystallization = () => {
    if (!crystallizationOutput || !finalOutput) return null;
    
    return (
      <View style={styles.contentCard}>
        <Text style={styles.cardTitle}>Your Crystallized Desire</Text>
        
        <View style={styles.desiredStateCard}>
          <Text style={styles.desiredStateText}>{crystallizationOutput.desired_state}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Energetic Quality</Text>
        <Text style={styles.detailText}>{crystallizationOutput.energetic_quality}</Text>
        
        <Text style={styles.sectionTitle}>How It Feels</Text>
        <Text style={styles.detailText}>{crystallizationOutput.sensation_preview}</Text>
        
        <Text style={styles.sectionTitle}>Your Unique Pattern</Text>
        <Text style={styles.detailText}>{crystallizationOutput.drive_mechanics_connection}</Text>
        
        <Text style={styles.calibrationText}>{crystallizationOutput.calibration_preparation}</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.calibrateButton}
            onPress={handleNavigateToCalibration}
          >
            <Text style={styles.buttonText}>Calibrate Alignment</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Show journey progress indicator
  const renderProgressIndicator = () => {
    const steps = ['entry', 'reflection', 'directional', 'experiential', 'essence', 'crystallization'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View 
            key={step}
            style={[
              styles.progressDot,
              index <= currentIndex ? styles.progressDotActive : styles.progressDotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  // Render main content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 'entry':
        return renderEntryScreen();
      case 'reflection':
        return renderReflectionScreen();
      case 'directional':
        return renderDirectionalChoices();
      case 'experiential':
        return renderExperientialChoices();
      case 'essence':
        return renderEssenceChoices();
      case 'crystallization':
        return renderCrystallization();
      default:
        return renderEntryScreen();
    }
  };

  return (
    <View style={styles.container}>
      <StepTracker
        currentStep={visualCurrentStep}
        totalSteps={FLOW_STEPS.FREQUENCY_MAPPER}
        stepLabels={STEP_LABELS.FREQUENCY_MAPPER}
      />
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>FREQUENCY MAPPER</Text>
          <Text style={styles.pageSubtitle}>Phase 1: Articulation</Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { // Root view of the screen
    flex: 1,
    backgroundColor: 'transparent', // Assuming AppBackground handles actual BG image
  },
  contentWrapper: { // Wraps all content within the screen, provides padding
    flex: 1,
    padding: theme.spacing.lg, // 24px padding
  },
  titleSection: { // Contains main title and subtitle
    alignItems: 'center',
    marginBottom: theme.spacing.xl, // 32px margin bottom (HTML: mb-8)
    flexShrink: 0, // Prevent shrinking if content is too much
  },
  pageTitle: { // "FREQUENCY MAPPER"
    fontFamily: theme.fonts.display,
    fontSize: theme.typography.displayMedium.fontSize, // 24px
    fontWeight: theme.typography.displayMedium.fontWeight, // '700'
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  pageSubtitle: { // "Phase 1: Articulation"
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize, // e.g., 11px or 12px
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs, // 4px margin top
  },
  scrollView: { // For the main scrollable content area
    flex: 1, // Takes remaining space after titleSection
  },
  scrollContent: { // contentContainerStyle for ScrollView
    flexGrow: 1, // Allows content to fill height if short, or scroll if long
    paddingVertical: theme.spacing.md, // Padding inside scroll view
    // justifyContent: 'center', // If content should be centered vertically when not enough to scroll
  },
  entryScreenContent: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.lg, // Ensure space for button at the end if content is short
  },
  introParagraph: {
    fontFamily: theme.fonts.body,
    fontSize: theme.typography.bodyMedium.fontSize || 14,
    lineHeight: (theme.typography.bodyMedium.lineHeight || 20) * 1.5,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md, // Explicit margin instead of relying solely on gap for this item
  },
  inputPanelContainer: {
    borderWidth: 1,
    borderColor: theme.colors.base1,
    borderRadius: theme.borderRadius.sm, // 8px
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative', // For absolute positioning of the label
    height: 192, // HTML: h-48 (12rem = 192px)
    marginBottom: theme.spacing.md, // Space before the button
    padding: 0, // Padding will be on the TextInput itself for better control
  },
  inputPanelFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accentGlow, // Or theme.colors.accent with opacity
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10, // Approx for CSS blur(20px)
    shadowOpacity: 0.7, // Glow effect often has some opacity
    elevation: 5, // For Android shadow
  },
  inputPanelLabel: {
    position: 'absolute',
    top: -10, // To sit on top of the border
    left: 12, // Indent from left
    backgroundColor: theme.colors.bg, // To cover the border line underneath the label
    paddingHorizontal: theme.spacing.xs, // 6px in HTML
    fontFamily: theme.fonts.mono,
    fontSize: theme.typography.labelSmall.fontSize || 11,
    fontWeight: theme.typography.labelSmall.fontWeight || '500',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: theme.typography.labelSmall.letterSpacing || 0.5,
    zIndex: 1, // Ensure label is above the input field container's border
  },
  textInputMain: {
    flex: 1, // Fill the panel height
    backgroundColor: 'transparent', // Panel provides background
    padding: theme.spacing.md, // 16px padding inside the TextInput
    color: theme.colors.textPrimary,
    fontSize: 15, // From HTML
    lineHeight: 22.5, // 1.5 * 15px
    textAlignVertical: 'top', // Start text from the top
  },
  // Old styles that are not directly mapped or need review:
  // frequencyContent, contentDescription (replaced by introParagraph),
  // inputPanel, formElement (replaced by inputPanelContainer, textInputMain)
  // Styles for other parts of the multi-step flow (progressContainer, contentCard, etc.) are kept for now.
  progressContainer: { // Keeping existing styles for other parts of the flow
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  progressDotInactive: {
    backgroundColor: '#d0d0d0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  driveProfileCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  driveMechanicsDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  venusIntroduction: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  quickPromptsContainer: {
    marginBottom: 16,
  },
  quickPromptsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  quickPromptButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPromptButton: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  quickPromptText: {
    fontSize: 13,
    color: '#007AFF',
  },
  inputMethodToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
    padding: 2,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  methodButtonActive: {
    backgroundColor: '#007AFF',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  voiceInputContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  voiceInputPlaceholder: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  voiceTranscript: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    textAlign: 'center',
  },
  promptText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reflectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  energeticObservation: {
    fontSize: 15,
    color: '#007AFF',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionCard: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  choiceContext: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  choiceCardsContainer: {
    marginBottom: 20,
  },
  choiceCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedChoice: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  choiceDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  energyQualityTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  energyQualityText: {
    fontSize: 14,
    color: '#555',
  },
  loader: {
    marginVertical: 20,
  },
  desiredStateCard: {
    backgroundColor: '#f0f7ff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  desiredStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  calibrationText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  calibrateButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#007AFF',
  },
});

export default FrequencyMapperScreen;