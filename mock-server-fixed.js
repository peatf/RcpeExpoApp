const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

console.log('🚀 Starting Reality Creation Profile Engine Mock Server...');

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const profiles = new Map();

// Debug logging helper
function debugLog(...args) {
  console.log('[DEBUG]', ...args);
}

// Token to user ID mapping for testing
const TOKEN_MAP = {
  'mock-token-123': 'mock-user-123',
  'alice-token': 'alice@example.com',
  'bob-token': 'bob@example.com',
  'token456': 'bob@example.com',
  'token123': 'alice@example.com'
};

// Simple function to extract user ID from auth header
function getUserIdFromAuth(req) {
  debugLog('Getting user ID from auth header');
  
  // Check for authorization with both casing options
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    debugLog('No valid auth header found');
    return null;
  }
  
  debugLog('Auth header:', authHeader);
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  debugLog('Token:', token);
  
  // Check predefined token map first
  if (TOKEN_MAP[token]) {
    const mappedUserId = TOKEN_MAP[token];
    debugLog('Found user ID in token map:', mappedUserId);
    return mappedUserId;
  }
  
  // Check for email-based tokens from frontend auth (for alice@example.com, etc)
  if (token.includes('alice')) {
    debugLog('Identified alice from token');
    return 'alice@example.com';
  } else if (token.includes('bob')) {
    debugLog('Identified bob from token');
    return 'bob@example.com';
  }
  
  // Handle other email patterns
  if (token.includes('@example.com')) {
    const email = token.replace(/-token.*/, '@example.com');
    debugLog('Extracted email from token:', email);
    return email;
  }
  
  // Fallback for other tokens (e.g., if they encode user ID directly)
  // This is a placeholder; adapt if your tokens have a different structure
  if (token.startsWith('user-')) {
    const potentialUserId = token.substring(5);
    debugLog('Potential user ID from token structure:', potentialUserId);
    return potentialUserId;
  }

  debugLog('Token not found in map and does not match fallback structure');
  return 'mock-user-123'; // Default to mock user instead of null
}

// Create a default profile for testing
const defaultProfileId = uuidv4();
const defaultProfile = {
  id: defaultProfileId,
  user_id: 'test@example.com',
  name: 'Test User Profile',
  birth_date: '1990-06-15',
  birth_time: '14:30',
  birth_location: 'New York, NY',
  birth_data: {
    birth_date: '1990-06-15',
    birth_time: '14:30:00',
    city_of_birth: 'New York',
    country_of_birth: 'USA'
  },
  assessment_responses: {
    typology: {
      'cognitive-alignment': 'right',
      'perceptual-focus': 'center',
      'kinetic-drive': 'left',
      'choice-navigation': 'right',
      'resonance-field': 'center'
    },
    mastery: {
      'core-strength-1': 'Strategic thinking and innovative problem-solving',
      'core-strength-2': 'Creative expression and authentic communication',
      'growth-area-1': 'Leadership development and team collaboration',
      'growth-area-2': 'Emotional intelligence and manifestation abilities'
    }
  },
  created_at: new Date().toISOString(),
  status: 'completed'
};
profiles.set(defaultProfileId, defaultProfile);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('📊 Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'Reality Creation Profile Engine Mock',
    version: '1.0.0'
  });
});

// User profiles endpoint (authentication required)
app.get('/api/v1/user-data/users/me/profiles', async (req, res) => {
  debugLog('👤 User profiles request received');
  debugLog('Authorization header:', req.headers.authorization);
  
  try {
    // Check for authorization header with case insensitivity
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ 
        error: 'Access denied',
        detail: 'Authentication token required'
      });
    }
    
    // Extract user ID or default to mock user
    const userId = getUserIdFromAuth(req) || 'mock-user-123';
    debugLog(`Fetching profiles for user: ${userId}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get all profiles and filter to this user
    const allProfiles = Array.from(profiles.values());
    debugLog(`Total profiles in system: ${allProfiles.length}`);
    
    const userProfiles = allProfiles.filter(profile => {
      debugLog(`Checking profile: ${profile.id} belonging to: ${profile.user_id}`);
      return profile.user_id === userId;
    });
    
    debugLog(`Found ${userProfiles.length} profiles for user ${userId}`);
    
    // If no profiles found for this user, include a default profile
    if (userProfiles.length === 0) {
      debugLog('No profiles found, adding default profile');
      userProfiles.push({
        id: 'default-profile-123',
        user_id: userId,
        name: 'Default User Profile',
        status: 'completed',
        created_at: new Date().toISOString()
      });
    }
    
    res.json({
      profiles: userProfiles,
      total: userProfiles.length
    });
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    res.status(500).json({ error: 'Failed to fetch user profiles' });
  }
});

// Profile-based base chart endpoint
app.get('/api/v1/profiles/:profileId/base_chart', async (req, res) => {
  debugLog('Base chart endpoint hit');
  const { profileId } = req.params;
  
  try {
    const authUserId = getUserIdFromAuth(req);
    if (!authUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    debugLog('Looking for profile:', profileId, 'for user:', authUserId);
    
    let profile = profiles.get(profileId);
    let resolvedProfileId = profileId;
    
    // Handle default profile mapping
    if (!profile && profileId === 'default-profile-123') {
      const userProfiles = Array.from(profiles.values()).filter(p => p.user_id === authUserId);
      
      if (userProfiles.length > 0) {
        profile = userProfiles[0];
        resolvedProfileId = profile.id;
        debugLog('Using existing user profile:', profile.id);
      } else {
        // Create temporary profile for demo
        profile = {
          id: profileId,
          user_id: authUserId,
          name: `Profile for ${authUserId}`,
          birth_data: {
            birth_date: '1993-11-10',
            birth_time: '02:02:00',
            city_of_birth: 'Miami',
            country_of_birth: 'USA'
          },
          assessment_responses: {
            typology: {
              'cognitive-alignment': 'left',
              'perceptual-focus': 'right',
              'kinetic-drive': 'center',
              'choice-navigation': 'right',
              'resonance-field': 'left'
            },
            mastery: {
              'core-strength-1': 'Strategic thinking and innovative problem-solving',
              'core-strength-2': 'Creative expression and authentic communication',
              'growth-area-1': 'Leadership development and team collaboration',
              'growth-area-2': 'Emotional intelligence and manifestation abilities'
            }
          },
          created_at: new Date().toISOString(),
          status: 'completed'
        };
        profiles.set(profileId, profile);
      }
    }
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        detail: `No profile found with ID: ${resolvedProfileId}`
      });
    }
    
    // Check access
    if (profile.user_id !== authUserId) {
      return res.status(403).json({
        error: 'Access denied',
        detail: 'You do not have access to this profile'
      });
    }
    
    // Calculate dynamic typology from actual profile data
    const calculatedTypology = calculateTypologyFromAssessment(profile.assessment_responses);
    const astrologySign = calculateAstrologyFromBirthData(profile.birth_data);
    const personalityType = calculatedTypology.split('-')[0];
    
    // Generate comprehensive base chart data matching backend structure
    const chartData = {
      status: "success",
      data: {
        metadata: {
          profile_id: resolvedProfileId,
          user_id: authUserId,
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "completed",
          version: "1.0.0"
        },
        hd_type: generateHDType(profile.assessment_responses),
        typology_pair_key: calculatedTypology,
        
        energy_family: {
          profile_lines: generateProfileLines(profile.assessment_responses),
          conscious_line: Math.floor(Math.random() * 6) + 1,
          unconscious_line: Math.floor(Math.random() * 6) + 1,
          astro_sun_sign: calculateAstrologyFromBirthData(profile.birth_data),
          astro_sun_house: Math.floor(Math.random() * 12) + 1,
          astro_sun_placement: {
            sign: calculateAstrologyFromBirthData(profile.birth_data),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          },
          astro_north_node_sign: generateRandomSign()
        },
        
        energy_class: {
          ascendant_sign: generateRandomSign(),
          chart_ruler_sign: generateRandomSign(),
          chart_ruler_house: Math.floor(Math.random() * 12) + 1,
          incarnation_cross: generateIncarnationCross(),
          profile_type: generateProfileType(),
          ascendant_placement: {
            sign: generateRandomSign(),
            house: 1,
            longitude: Math.random() * 30,
            retrograde: null,
            aspects: []
          }
        },
        
        processing_core: {
          astro_moon_sign: generateRandomSign(),
          astro_moon_house: Math.floor(Math.random() * 12) + 1,
          astro_mercury_sign: generateRandomSign(),
          astro_mercury_house: Math.floor(Math.random() * 12) + 1,
          head_state: Math.random() > 0.5 ? "Defined" : "Undefined",
          ajna_state: Math.random() > 0.5 ? "Defined" : "Undefined",
          emotional_state: Math.random() > 0.5 ? "Defined" : "Undefined",
          cognition_variable: Math.random() > 0.5 ? "Left" : "Right",
          chiron_gate: Math.floor(Math.random() * 64) + 1,
          moon_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          },
          mercury_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          }
        },
        
        decision_growth_vector: {
          strategy: generateStrategy(profile.assessment_responses),
          authority: generateAuthority(profile.assessment_responses),
          choice_navigation_spectrum: mapChoiceNavigation(profile.assessment_responses.typology?.['choice-navigation'] || 'center'),
          astro_mars_sign: generateRandomSign(),
          north_node_house: Math.floor(Math.random() * 12) + 1,
          jupiter_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          },
          mars_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          },
          north_node_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: null,
            aspects: []
          }
        },
        
        drive_mechanics: {
          motivation_color: generateMotivationColor(),
          heart_state: Math.random() > 0.5 ? "Defined" : "Undefined",
          root_state: Math.random() > 0.5 ? "Defined" : "Undefined",
          venus_sign: generateRandomSign(),
          kinetic_drive_spectrum: mapKineticDrive(profile.assessment_responses.typology?.['kinetic-drive'] || 'center'),
          resonance_field_spectrum: mapResonanceField(profile.assessment_responses.typology?.['resonance-field'] || 'center'),
          perspective_variable: generatePerspectiveVariable(),
          saturn_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          },
          venus_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: false,
            aspects: []
          }
        },
        
        manifestation_interface_rhythm: {
          throat_definition: Math.random() > 0.5 ? "Defined" : "Undefined",
          throat_gates: generateThroatGates(),
          throat_channels: generateThroatChannels(),
          manifestation_rhythm_spectrum: ["Structured", "Fluid", "Dynamic"][Math.floor(Math.random() * 3)],
          mars_aspects: [],
          venus_aspects: []
        },
        
        energy_architecture: {
          definition_type: ["Single", "Split", "Triple Split", "Quadruple Split"][Math.floor(Math.random() * 4)],
          channel_list: generateChannelsFromAssessment(profile.assessment_responses),
          channels: generateChannelDetails(),
          centers: generateCenterDetails(),
          split_bridges: generateSplitBridges(profile.assessment_responses),
          soft_aspects: []
        },
        
        tension_points: {
          chiron_gate: Math.floor(Math.random() * 64) + 1,
          hard_aspects: [],
          chiron_placement: {
            sign: generateRandomSign(),
            house: Math.floor(Math.random() * 12) + 1,
            longitude: Math.random() * 30,
            retrograde: Math.random() > 0.5,
            aspects: []
          },
          tension_planets: ["Saturn", "Pluto", "Mars"]
        },
        
        evolutionary_path: {
          g_center_access: ["Integrated", "Developing", "Undefined"][Math.floor(Math.random() * 3)],
          incarnation_cross: generateIncarnationCross(),
          astro_north_node_sign: generateRandomSign(),
          astro_north_node_house: Math.floor(Math.random() * 12) + 1,
          conscious_line: Math.floor(Math.random() * 6) + 1,
          unconscious_line: Math.floor(Math.random() * 6) + 1,
          core_priorities: ["Innovation", "Community", "Knowledge", "Creativity"]
        },
        
        dominant_mastery_values: generateMasteryValues(profile.assessment_responses),
        manifestation_dimensions: {
          willpower: Math.random(),
          magnetism: Math.random(),
          energetic_coherence: Math.random(),
          imagination: Math.random(),
          aligned_embodiment: Math.random()
        }
      }
    };
    
    debugLog('Generated dynamic chart data for:', authUserId);
    res.json(chartData);
    
  } catch (error) {
    console.error('Error generating base chart:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      detail: error.message 
    });
  }
});

// Legacy base chart endpoint (for backward compatibility)
app.get('/api/v1/charts/base/:userId', async (req, res) => {
  console.log('📊 Legacy base chart request for user ID:', req.params.userId);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBaseChart = {
      energy_family: {
        name: "Manifestor",
        description: "Energy types who are here to initiate and create impact",
        strategy: "To inform before taking action",
        signature: "Peace",
        not_self_theme: "Anger"
      },
      processing_core: {
        name: "Emotional Authority",
        description: "Decision-making through emotional wave and clarity"
      },
      user_id: req.params.userId,
      generated_at: new Date().toISOString(),
      chart_version: "1.0"
    };
    
    res.json(mockBaseChart);
  } catch (error) {
    console.error('Error fetching base chart:', error);
    res.status(500).json({ error: 'Failed to fetch base chart' });
  }
});

// Profile creation endpoint
app.post('/profile/create', async (req, res) => {
  console.log('➕ Profile creation request received:', req.body);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get user ID from auth header, fallback to request body or default
    const userId = getUserIdFromAuth(req) || 
                  (req.body.user_id ? req.body.user_id : 'mock-user-123');
    
    console.log(`Creating profile for user: ${userId}`);
    
    const profileId = uuidv4();
    
    // Ensure assessment_responses are properly structured
    let assessmentResponses = req.body.assessment_responses || {};
    
    // Make sure typology and mastery objects exist with full structure
    if (!assessmentResponses.typology) {
      assessmentResponses.typology = {};
    }
    
    if (!assessmentResponses.mastery) {
      assessmentResponses.mastery = {};
    }
    
    // Ensure typology has all required fields and preserve actual values
    const typologyFields = [
      'cognitive-alignment', 'perceptual-focus', 'kinetic-drive', 
      'choice-navigation', 'resonance-field'
    ];
    
    typologyFields.forEach(field => {
      if (!assessmentResponses.typology[field] && req.body.assessment_responses?.typology?.[field]) {
        assessmentResponses.typology[field] = req.body.assessment_responses.typology[field];
      }
    });
    
    // Ensure mastery has sample data if none provided, but preserve actual data
    if (Object.keys(assessmentResponses.mastery).length === 0) {
      assessmentResponses.mastery = {
        'core-strength-1': 'Strategic thinking and innovative problem-solving',
        'core-strength-2': 'Creative expression and authentic communication',
        'growth-area-1': 'Leadership development and team collaboration',
        'growth-area-2': 'Emotional intelligence and manifestation abilities',
        'mastery-focus': 'Innovation and strategic planning',
        'development-priority': 'Leadership qualities and authentic presence'
      };
    }
    
    // Log assessment data for debugging
    console.log('Assessment responses:', JSON.stringify(assessmentResponses, null, 2));
    
    profiles.set(profileId, {
      id: profileId,
      user_id: userId,  // Set the proper user ID
      ...req.body,
      // Ensure assessment_responses are explicitly preserved
      assessment_responses: assessmentResponses,
      created_at: new Date().toISOString(),
      status: 'completed'
    });
    
    res.json({ profile_id: profileId });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Profile retrieval endpoint
app.get('/profile/:id', async (req, res) => {
  console.log('🔍 Profile fetch request for ID:', req.params.id);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profile = profiles.get(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Add this function to calculate typology from assessment responses
function generateChannelsFromAssessment(assessmentResponses) {
  // Generate realistic channel names as array
  const channels = [
    "Channel of Charisma",
    "Channel of Surrender", 
    "Channel of Awakening",
    "Channel of Initiation",
    "Channel of Inspiration",
    "Channel of Integration"
  ];
  
  // Return 2-4 channels based on assessment
  const numChannels = Math.floor(Math.random() * 3) + 2;
  return channels.slice(0, numChannels);
}

function generateSplitBridges(assessmentResponses) {
  // Generate split bridges as array
  const bridges = [
    "G Center to Heart",
    "Sacral to Throat", 
    "Root to Spleen",
    "Ajna to Heart"
  ];
  
  // Return 0-2 bridges
  const numBridges = Math.floor(Math.random() * 3);
  return bridges.slice(0, numBridges);
}

function generateThroatGates() {
  // Generate throat gates as array of numbers
  const possibleGates = [31, 23, 8, 33, 20, 16, 35, 12, 45, 62];
  const numGates = Math.floor(Math.random() * 4) + 2;
  return possibleGates.slice(0, numGates);
}

function generateThroatChannels() {
  // Generate throat channels as array of strings
  const channels = [
    "Channel of Charisma",
    "Channel of Surrender",
    "Channel of Inspiration", 
    "Channel of Integration"
  ];
  
  const numChannels = Math.floor(Math.random() * 3) + 1;
  return channels.slice(0, numChannels);
}

function generateChannelDetails() {
  return [
    {
      name: "Channel of Charisma",
      gates: [34, 20],
      centers: ["Sacral", "Throat"],
      definition_type: "Conscious"
    },
    {
      name: "Channel of Surrender", 
      gates: [54, 32],
      centers: ["Root", "Spleen"],
      definition_type: "Unconscious"
    }
  ];
}

function generateCenterDetails() {
  return {
    Sacral: {
      name: "Sacral",
      state: "Defined",
      definition_percentage: 76.5,
      gates: [34, 5, 14, 29]
    },
    Throat: {
      name: "Throat", 
      state: "Defined",
      definition_percentage: 52.1,
      gates: [31, 23, 8, 33, 20]
    }
  };
}

function generateRandomSign() {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return signs[Math.floor(Math.random() * signs.length)];
}

function generateHDType(assessmentResponses) {
  const types = ["Generator", "Manifestor", "Projector", "Reflector", "Manifesting Generator"];
  return types[Math.floor(Math.random() * types.length)];
}

function generateProfileLines(assessmentResponses) {
  const line1 = Math.floor(Math.random() * 6) + 1;
  const line2 = Math.floor(Math.random() * 6) + 1;
  return `${line1}/${line2}`;
}

function generateIncarnationCross() {
  const crosses = [
    "Right Angle Cross of Planning",
    "Left Angle Cross of Wishes", 
    "Juxtaposition Cross of Service",
    "Right Angle Cross of the Four Ways"
  ];
  return crosses[Math.floor(Math.random() * crosses.length)];
}

function generateProfileType() {
  const types = [
    "Hermit/Opportunist",
    "Investigator/Martyr", 
    "Opportunist/Role Model",
    "Martyr/Heretic"
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function generateMasteryValues(assessmentResponses) {
  const values = [
    "creative-expression",
    "connection", 
    "freedom",
    "innovation",
    "leadership",
    "harmony"
  ];
  
  // Return 2-4 values
  const numValues = Math.floor(Math.random() * 3) + 2;
  return values.slice(0, numValues);
}

function mapChoiceNavigation(value) {
  switch(value) {
    case 'left': return 'Logical';
    case 'center': return 'Balanced';
    case 'right': return 'Emotional';
    default: return 'Balanced';
  }
}

function mapKineticDrive(value) {
  switch(value) {
    case 'left': return 'Structured';
    case 'center': return 'Adaptive'; 
    case 'right': return 'Dynamic';
    default: return 'Adaptive';
  }
}

function mapResonanceField(value) {
  switch(value) {
    case 'left': return 'Grounded';
    case 'center': return 'Balanced';
    case 'right': return 'Expansive'; 
    default: return 'Balanced';
  }
}

function generateMotivationColor() {
  // Human Design Motivation Colors are not actual colors but HD terminology
  const motivations = [
    "Fear – Communalist (Left / Strategic)",
    "Fear – Separatist (Right / Receptive)", 
    "Hope – Theist (Left / Strategic)",
    "Hope – Antitheist (Right / Receptive)",
    "Desire – Leader (Left / Strategic)",
    "Desire – Follower (Right / Receptive)",
    "Need – Master (Left / Strategic)",
    "Need – Novice (Right / Receptive)",
    "Guilt – Conditioner (Left / Strategic)",
    "Guilt – Conditioned (Right / Receptive)",
    "Innocence – Observer (Left / Strategic)",
    "Innocence – Observed (Right / Receptive)"
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function generatePerspectiveVariable() {
  // Human Design Perspective Variables - proper terminology
  const perspectives = [
    "Survival (Left – Focused)",
    "Survival (Right – Peripheral)",
    "Possibility (Left – Focused)",
    "Possibility (Right – Peripheral)",
    "Power (Left – Focused)",
    "Power (Right – Peripheral)",
    "Probability (Left – Focused)",
    "Probability (Right – Peripheral)",
    "Personal (Left – Focused)",
    "Personal (Right – Peripheral)",
    "Transpersonal (Left – Focused)",
    "Transpersonal (Right – Peripheral)"
  ];
  return perspectives[Math.floor(Math.random() * perspectives.length)];
}

function calculateTypologyFromAssessment(assessmentResponses) {
  if (!assessmentResponses || !assessmentResponses.typology) {
    return 'structured-fluid';
  }

  const typology = assessmentResponses.typology;
  
  // Map assessment responses to typology characteristics
  const cognitiveType = mapCognitiveAlignment(typology['cognitive-alignment']);
  const perceptualType = mapPerceptualFocus(typology['perceptual-focus']);
  const kineticType = mapKineticDrive(typology['kinetic-drive']);
  const choiceType = mapChoiceNavigation(typology['choice-navigation']);
  const resonanceType = mapResonanceField(typology['resonance-field']);
  
  // Combine to form the typology pair
  const personalityType = determinePersonalityType(cognitiveType, perceptualType, kineticType, choiceType);
  const flowType = determineFlowType(resonanceType);
  
  return `${personalityType}-${flowType}`;
}

function determinePersonalityType(cognitive, perceptual, kinetic, choice) {
  // This is a simplified mapping - in reality this would be more complex
  const leftCount = [cognitive, perceptual, kinetic, choice].filter(t => 
    t.includes('Analytical') || t.includes('Detail') || t.includes('Structured') || t.includes('Logical')
  ).length;
  const rightCount = [cognitive, perceptual, kinetic, choice].filter(t => 
    t.includes('Intuitive') || t.includes('Vision') || t.includes('Dynamic') || t.includes('Emotional')
  ).length;
  
  if (leftCount >= 3) return 'structured';
  if (rightCount >= 3) return 'dynamic';
  if (leftCount >= 2) return 'focused';
  if (rightCount >= 2) return 'adaptive';
  return 'balanced';
}

function determineFlowType(resonanceType) {
  switch(resonanceType) {
    case 'Grounded': return 'structured';
    case 'Balanced': return 'fluid';
    case 'Expansive': return 'dynamic';
    default: return 'fluid';
  }
}

function mapCognitiveAlignment(value) {
  switch(value) {
    case 'left': return 'Analytical';
    case 'center': return 'Balanced';
    case 'right': return 'Intuitive';
    default: return 'Balanced';
  }
}

function mapPerceptualFocus(value) {
  switch(value) {
    case 'left': return 'Detail';
    case 'center': return 'Moderate';
    case 'right': return 'Vision';
    default: return 'Moderate';
  }
}

function generateStrategy(assessmentResponses) {
  const strategies = [
    "Wait to Respond",
    "Inform before Acting", 
    "Wait for Recognition",
    "Wait a Lunar Cycle"
  ];
  return strategies[Math.floor(Math.random() * strategies.length)];
}

function generateAuthority(assessmentResponses) {
  const authorities = [
    "Emotional",
    "Sacral",
    "Splenic",
    "Ego",
    "Self-Projected",
    "Environmental",
    "Mental"
  ];
  return authorities[Math.floor(Math.random() * authorities.length)];
}

function calculateAstrologyFromBirthData(birthData) {
  if (!birthData || !birthData.birth_date) {
    return 'Leo';
  }
  
  const birthDate = new Date(birthData.birth_date);
  const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const day = birthDate.getDate();
  
  // Zodiac sign calculation based on birth date
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
  
  return 'Leo';
}

// Start server
console.log('🔧 Setting up server...');
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Mock server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /profile/create - Create a new profile');
  console.log('  GET  /profile/:id - Fetch profile by ID');
  console.log('  GET  /api/v1/charts/base/:userId - Fetch base chart for user (legacy)');
  console.log('  GET  /api/v1/user-data/users/me/profiles - Fetch user profiles');
  console.log('  GET  /api/v1/profiles/:profileId/base_chart - Fetch profile-based base chart');
  console.log(`🎯 Default profile created with ID: ${defaultProfileId}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock server...');
  server.close(() => {
    console.log('✅ Server shutdown complete');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});
