/**
 * @file frequencyMapperHelpers.ts
 * @description Helper functions for Drive Mechanics personalization
 */

// Get motivation-specific language patterns
export const getMotivationLanguage = (motivationColor?: string) => {
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
export const getVenusAesthetic = (venusSign?: string) => {
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
export const getMotivationApproach = (motivationColor?: string) => {
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
export const getVenusChoiceStyle = (venusSign?: string) => {
  const aesthetic = getVenusAesthetic(venusSign);
  return {
    toward_enhancement: `Your ${aesthetic.quality} nature finds beauty in forward momentum.`,
    away_enhancement: `Your appreciation for ${aesthetic.core_value} supports release of what doesn't align.`
  };
};

// Helper to determine Venus element from sign
export const getVenusElement = (venusSign?: string): 'Fire' | 'Earth' | 'Air' | 'Water' | 'Unknown' => {
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

// Get Venus element experiential choices
export const getVenusExperientialChoices = (element: string, kineticStyle?: string) => {
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
export const getPersonalizedEssenceChoices = (driveContext: any) => {
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
export const generatePersonalizedCrystallization = (driveContext: any, refinementPath: string[], rawStatement: string) => {
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
export const generateSensationPreview = (driveContext: any, coreQualities: string[]) => {
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