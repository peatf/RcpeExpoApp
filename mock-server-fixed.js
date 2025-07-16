const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { MOCK_USER_CREDENTIALS, MOCK_HD_PROFILES } = require('./mock-human-design-profiles');

const app = express();
const PORT = 3001;

console.log('🚀 Starting Reality Creation Profile Engine Mock Server...');
console.log('📋 Loading Human Design mock profiles for all 5 types...');

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const profiles = new Map();

// Debug logging helper
function debugLog(...args) {
  console.log('[DEBUG]', ...args);
}

// Extended token to user ID mapping including all HD types
const TOKEN_MAP = {
  'mock-token-123': 'mock-user-123',
  'alice-token': 'alice@example.com',
  'bob-token': 'bob@example.com',
  'token456': 'bob@example.com',
  'token123': 'alice@example.com',
  // Human Design Type Tokens
  'generator-token': 'generator@example.com',
  'manifestor-token': 'manifestor@example.com',
  'projector-token': 'projector@example.com',
  'reflector-token': 'reflector@example.com',
  'mangen-token': 'mangen@example.com'
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
  
  // Check for Human Design type tokens
  if (token.includes('generator') && !token.includes('mangen')) {
    debugLog('Identified generator from token');
    return 'generator@example.com';
  } else if (token.includes('manifestor') && !token.includes('mangen')) {
    debugLog('Identified manifestor from token');
    return 'manifestor@example.com';
  } else if (token.includes('projector')) {
    debugLog('Identified projector from token');
    return 'projector@example.com';
  } else if (token.includes('reflector')) {
    debugLog('Identified reflector from token');
    return 'reflector@example.com';
  } else if (token.includes('mangen')) {
    debugLog('Identified manifesting generator from token');
    return 'mangen@example.com';
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

// Initialize Human Design mock profiles for all 5 types
console.log('🔮 Initializing Human Design mock profiles...');
Object.entries(MOCK_HD_PROFILES).forEach(([type, profile]) => {
  profiles.set(profile.id, profile);
  console.log(`✅ Added ${type} profile: ${profile.name} (${profile.user_id})`);
});

console.log(`📊 Total profiles loaded: ${profiles.size}`);
console.log('🎭 Available Human Design types:', Object.keys(MOCK_HD_PROFILES).join(', '));

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
    const incarnationCross = generateIncarnationCross();
    
    // Generate comprehensive base chart data matching backend structure
    // Use the actual HD type from profile, not random generation
    const actualHDType = profile.hd_type || generateHDType(profile.assessment_responses);
    const actualStrategy = profile.strategy || generateStrategy(profile.assessment_responses);
    const actualAuthority = profile.authority || generateAuthority(profile.assessment_responses);
    const actualProfileLines = profile.profile_lines || generateProfileLines(profile.assessment_responses);
    
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
        hd_type: actualHDType,
        typology_pair_key: calculatedTypology,
        
        energy_family: {
          profile_lines: actualProfileLines,
          conscious_line: parseInt(actualProfileLines.split('/')[0]) || Math.floor(Math.random() * 6) + 1,
          unconscious_line: parseInt(actualProfileLines.split('/')[1]) || Math.floor(Math.random() * 6) + 1,
          strategy: actualStrategy,
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
          incarnation_cross: incarnationCross,
          incarnation_cross_quarter: getIncarnationCrossQuarter(incarnationCross),
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
          name: actualAuthority,
          description: `Decision-making through ${actualAuthority.toLowerCase()}`,
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

function getIncarnationCrossQuarter(crossName) {
  // Map the mock cross names to quarters based on the real data patterns
  const quarterMap = {
    "Right Angle Cross of Planning": "Quarter of Initiation",
    "Left Angle Cross of Wishes": "Quarter of Initiation", 
    "Juxtaposition Cross of Service": "Quarter of Duality", // Made up since this doesn't exist in real data
    "Right Angle Cross of the Four Ways": "Quarter of Initiation"
  };
  
  return quarterMap[crossName] || "Quarter of Initiation"; // Default fallback
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

// AI Service endpoints
const sessions = new Map();

// Initialize AI session
app.post('/api/v1/ai/sessions/initialize', async (req, res) => {
  console.log('🤖 AI session initialization request:', req.body);
  
  try {
    const { user_id, session_id, tool_name, started_at } = req.body;
    
    const session = {
      user_id,
      session_id,
      tool_name,
      started_at: started_at || new Date().toISOString(),
      status: 'active',
      steps: []
    };
    
    sessions.set(session_id, session);
    
    res.json({
      status: 'success',
      session_id,
      message: 'Session initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing AI session:', error);
    res.status(500).json({ error: 'Failed to initialize session' });
  }
});

// Generate AI response for frequency mapper
app.post('/api/v1/ai/frequency-mapper/generate', async (req, res) => {
  console.log('🤖 AI frequency mapper generate request:', req.body);
  
  try {
    const { template_id, inputs, drive_mechanics, session_id } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    // Generate response based on template_id
    let response;
    switch (template_id) {
      case 'fm_initial_reflection_v2':
        response = {
          reflection_insight: `Based on your ${drive_mechanics?.motivation_color || 'unique'} energy, I sense you're seeking alignment with your deeper nature.`,
          deepening_questions: [
            "What sensations would you feel in your body if this desire were realized?",
            "How would fulfilling this feel different from your current state?",
            "What's the essence of what you're truly seeking beneath the surface details?"
          ],
          energetic_observation: `Your statement carries a ${drive_mechanics?.kinetic_drive_spectrum === 'Steady' ? 'grounded, consistent' : 'dynamic, flowing'} energy signature.`
        };
        break;
      
      case 'fm_directional_choices_v2':
        response = {
          choice_a: {
            title: "Moving toward growth",
            description: "This path focuses on actively expanding into new territory.",
            energy_quality: "Expansive"
          },
          choice_b: {
            title: "Releasing what limits",
            description: "This path emphasizes letting go of what no longer serves you.",
            energy_quality: "Liberating"
          },
          choice_context: `Your ${drive_mechanics?.motivation_color || 'unique'} motivation offers these complementary approaches.`
        };
        break;
      
      case 'fm_experiential_choices_v2':
        response = {
          choice_a: {
            title: "Harmonious and balanced",
            description: "A state where all elements of your experience align in perfect proportion.",
            energy_quality: "Balanced"
          },
          choice_b: {
            title: "Vibrant and expressive",
            description: "A state where your authentic self shines through without limitation.",
            energy_quality: "Authentic"
          },
          choice_context: `These options reflect different qualities of experience that resonate with your ${drive_mechanics?.venus_sign || 'unique'} way of processing value.`
        };
        break;
      
      case 'fm_essence_choices_v2':
        response = {
          choice_a: {
            title: "Confidently authentic",
            description: "A state of being fully aligned with your true nature.",
            energy_quality: "Aligned"
          },
          choice_b: {
            title: "Harmoniously connected",
            description: "A state of deep resonance with others and your environment.",
            energy_quality: "Resonant"
          },
          choice_context: "These core qualities represent different aspects of fulfillment based on your energy pattern."
        };
        break;
      
      case 'fm_final_crystallization_v2':
        const essenceBlend = inputs.refinement_path?.filter(Boolean).join(' while ') || 'aligned and flowing';
        response = {
          desired_state: `I am ${essenceBlend}, expressing my authentic nature with confidence and flow`,
          energetic_quality: "A harmonious blend of creative energy with grounded security that creates sustainable fulfillment.",
          sensation_preview: "Like a warm current flowing through your body, creating gentle expansion in your chest while keeping you grounded.",
          drive_mechanics_connection: "Your unique energy pattern creates this special blend of expression and security, perfectly aligned with your natural rhythms.",
          calibration_preparation: "Now let's explore how aligned you currently are with this desired state, revealing your optimal path forward."
        };
        break;
      
      default:
        response = {
          message: "Response generated successfully",
          template_id,
          processed_at: new Date().toISOString()
        };
    }
    
    res.json({
      status: 'success',
      data: response,
      session_id,
      template_id
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// Update AI session progress
app.post('/api/v1/ai/sessions/update', async (req, res) => {
  console.log('🤖 AI session update request:', req.body);
  
  try {
    const { session_id, step, data, timestamp } = req.body;
    
    const session = sessions.get(session_id);
    if (session) {
      session.steps.push({
        step,
        data,
        timestamp: timestamp || new Date().toISOString()
      });
      session.updated_at = new Date().toISOString();
    }
    
    res.json({
      status: 'success',
      message: 'Session updated successfully'
    });
  } catch (error) {
    console.error('Error updating AI session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Complete AI session
app.post('/api/v1/ai/sessions/complete', async (req, res) => {
  console.log('🤖 AI session completion request:', req.body);
  
  try {
    const { session_id, final_output, next_tool, completed_at } = req.body;
    
    const session = sessions.get(session_id);
    if (session) {
      session.status = 'completed';
      session.final_output = final_output;
      session.completed_at = completed_at || new Date().toISOString();
      session.next_tool = next_tool;
    }
    
    const nextSessionId = next_tool ? uuidv4() : null;
    
    res.json({
      status: 'success',
      handoff_prepared: !!next_tool,
      next_session_id: nextSessionId,
      message: 'Session completed successfully'
    });
  } catch (error) {
    console.error('Error completing AI session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Get frequency mapper output for calibration tool
app.get('/api/v1/ai/sessions/:sessionId/frequency-mapper-output', async (req, res) => {
  console.log('🤖 Frequency mapper output request for session:', req.params.sessionId);
  
  try {
    const session = sessions.get(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Mock frequency mapper output for calibration tool
    const mockOutput = {
      desired_state: "I am confidently authentic while harmoniously connected, expressing my true nature with flow",
      energetic_quality: "A harmonious blend of creative energy with grounded security that creates sustainable fulfillment.",
      sensation_preview: "Like a warm current flowing through your body, creating gentle expansion in your chest while keeping you grounded.",
      drive_mechanics_connection: "Your unique energy pattern creates this special blend of expression and security, perfectly aligned with your natural rhythms.",
      refinement_path: ["confidently authentic", "harmoniously connected"],
      raw_statement: session.final_output?.raw_statement || "I want to feel more aligned and authentic in my daily life"
    };
    
    res.json({
      status: 'success',
      data: {
        frequency_mapper_output: mockOutput
      },
      session_id: req.params.sessionId
    });
  } catch (error) {
    console.error('Error fetching frequency mapper output:', error);
    res.status(500).json({ error: 'Failed to fetch frequency mapper output' });
  }
});

// Generate personalized sliders for calibration tool
app.post('/api/v1/ai/calibration-tool/generate-sliders', async (req, res) => {
  console.log('🎚️ Generate personalized sliders request:', req.body);
  
  try {
    const { template_id, frequency_mapper_context, processing_core_summary, tension_points_summary } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Generate personalized sliders based on frequency mapper context
    const desired_state = frequency_mapper_context?.desired_state || "aligned and authentic";
    const energetic_quality = frequency_mapper_context?.energetic_quality || "harmonious energy";
    
    const personalizedSliders = {
      belief_slider: {
        label: `Belief: Trusting "${desired_state}" is Possible`,
        anchor_min: "Feels impossible",
        anchor_max: "Totally possible",
        microcopy: `Feel into whether you trust that "${desired_state}" can happen right now.`,
        reflection_prompt: `When you think about "${desired_state}", what evidence do you see that it's achievable?`,
        processing_core_note: `Your processing style shows intuitive knowing patterns.`
      },
      openness_slider: {
        label: `Openness: Willing to Receive Support`,
        anchor_min: "Completely closed",
        anchor_max: "Totally open",
        microcopy: `How willing are you to receive guidance and support toward "${desired_state}"?`,
        reflection_prompt: `What part of you resists the "${energetic_quality}" energy of your desired state?`,
        processing_core_note: `Your emotional authority suggests receiving support through trusted advisors.`
      },
      worthiness_slider: {
        label: `Worthiness: Deserving This Experience`,
        anchor_min: "Totally unworthy",
        anchor_max: "Completely worthy",
        microcopy: `How worthy do you feel to experience "${desired_state}"?`,
        reflection_prompt: `What stories do you tell yourself about whether you deserve "${energetic_quality}"?`,
        processing_core_note: `Your processing shows patterns around self-worth and authentic expression.`
      },
      belief_logical_slider: {
        label: `Belief: Receiving "${desired_state}" Makes Sense`,
        anchor_min: "Illogical",
        anchor_max: "Makes perfect sense",
        microcopy: `Does it make logical sense that you could receive "${desired_state}"?`,
        reflection_prompt: `What logical reasons support or oppose you experiencing "${desired_state}"?`,
        processing_core_note: `Your cognitive style influences how you rationalize possibilities.`
      },
      openness_slider: {
        label: `Openness: Willing to Receive Support`,
        anchor_min: "Completely closed",
        anchor_max: "Totally open",
        microcopy: `How willing are you to receive guidance and support toward "${desired_state}"?`,
        reflection_prompt: `What part of you resists the "${energetic_quality}" energy of your desired state?`,
        processing_core_note: `Your emotional authority suggests receiving support through trusted advisors.`
      },
      openness_acceptance_slider: {
        label: `Openness: Accepting Your Current Reality`,
        anchor_min: "Rejecting reality",
        anchor_max: "Fully accepting",
        microcopy: `How well do you accept where you are right now on your journey?`,
        reflection_prompt: `What aspects of your current reality feel hard to accept regarding "${desired_state}"?`,
        processing_core_note: `Acceptance creates the foundation for authentic transformation.`
      },
      worthiness_slider: {
        label: `Worthiness: Deserving This Experience`,
        anchor_min: "Totally unworthy",
        anchor_max: "Completely worthy",
        microcopy: `How worthy do you feel to experience "${desired_state}"?`,
        reflection_prompt: `What stories do you tell yourself about whether you deserve "${energetic_quality}"?`,
        processing_core_note: `Your processing shows patterns around self-worth and authentic expression.`
      },
      worthiness_receiving_slider: {
        label: `Worthiness: Comfortable with Receiving`,
        anchor_min: "Uncomfortable receiving",
        anchor_max: "Comfortable receiving",
        microcopy: `How comfortable do you feel receiving support while working toward "${desired_state}"?`,
        reflection_prompt: `What makes receiving support feel uncomfortable or natural for you?`,
        processing_core_note: `Your ability to receive reflects your relationship with your own value.`
      }
    };
    
    res.json({
      status: 'success',
      data: personalizedSliders,
      template_id
    });
  } catch (error) {
    console.error('Error generating personalized sliders:', error);
    res.status(500).json({ error: 'Failed to generate personalized sliders' });
  }
});

// Generate integrated recommendation for calibration tool
app.post('/api/v1/ai/calibration-tool/generate-recommendation', async (req, res) => {
  console.log('🎯 Generate integrated recommendation request:', req.body);
  
  try {
    const { calibration_data, frequency_mapper_context, processing_core_summary } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Generate recommendation based on calibration results
    const recommendation = {
      overall_calibration_score: Math.round((Math.random() * 0.4 + 0.6) * 100), // 60-100%
      key_insights: [
        "Your belief patterns show strong potential for growth in authenticity",
        "Openness to support is a significant strength for your journey",
        "Embodiment practices will accelerate your manifestation abilities"
      ],
      priority_focus_areas: [
        {
          area: "Embodiment Practices",
          current_level: calibration_data?.embodiment || 0.7,
          recommendation: "Daily body awareness exercises to strengthen your connection to your desired state",
          impact_potential: "High"
        },
        {
          area: "Belief Strengthening", 
          current_level: calibration_data?.belief || 0.6,
          recommendation: "Evidence journaling to build trust in your desired state's possibility",
          impact_potential: "Medium"
        }
      ],
      next_steps: [
        "Begin daily 5-minute embodiment practice",
        "Create evidence journal for your desired state",
        "Practice receiving support from trusted sources"
      ],
      oracle_preparation: {
        readiness_score: 85,
        personalized_approach: "Intuitive guidance with practical action steps",
        focus_themes: ["embodied authenticity", "supported growth", "conscious manifestation"]
      }
    };
    
    res.json({
      status: 'success',
      data: recommendation
    });
  } catch (error) {
    console.error('Error generating integrated recommendation:', error);
    res.status(500).json({ error: 'Failed to generate integrated recommendation' });
  }
});

// Prepare Oracle handoff from calibration tool
app.post('/api/v1/ai/calibration-tool/prepare-oracle', async (req, res) => {
  console.log('🔮 Prepare Oracle handoff request:', req.body);
  
  try {
    const { calibration_data, recommendation, frequency_mapper_context } = req.body;
    
    // Create handoff data structure for Oracle
    const oracleHandoff = {
      handoff_id: uuidv4(),
      source_tool: 'calibration_tool',
      user_journey: {
        frequency_mapper_output: frequency_mapper_context,
        calibration_results: calibration_data,
        integrated_recommendation: recommendation
      },
      oracle_context: {
        primary_intention: frequency_mapper_context?.desired_state || "aligned and authentic",
        calibration_insights: recommendation?.key_insights || [],
        readiness_indicators: {
          belief_level: calibration_data?.belief || 0.7,
          openness_level: calibration_data?.openness || 0.8,
          embodiment_level: calibration_data?.embodiment || 0.6
        },
        focus_areas: recommendation?.focus_themes || ["authenticity", "growth", "manifestation"]
      },
      session_metadata: {
        created_at: new Date().toISOString(),
        tools_completed: ['frequency_mapper', 'calibration_tool'],
        next_tool: 'oracle'
      }
    };
    
    res.json({
      status: 'success',
      data: oracleHandoff
    });
  } catch (error) {
    console.error('Error preparing Oracle handoff:', error);
    res.status(500).json({ error: 'Failed to prepare Oracle handoff' });
  }
});

// Initialize Oracle from calibration tool
app.post('/api/v1/ai/oracle/initialize-from-calibration', async (req, res) => {
  console.log('🔮 Initialize Oracle from calibration request:', req.body);
  
  try {
    const { handoff_data } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Create Oracle initialization based on calibration handoff
    const oracleInitialization = {
      oracle_session_id: uuidv4(),
      personalized_greeting: `Welcome to your Oracle Wisdom session. Based on your journey toward "${handoff_data.oracle_context.primary_intention}", I'm here to provide guidance for your next steps.`,
      available_spreads: [
        {
          id: 'manifestation_pathway',
          name: 'Manifestation Pathway',
          description: 'Reveals the optimal path for manifesting your desired state',
          card_count: 3,
          focus: 'action_oriented'
        },
        {
          id: 'inner_wisdom',
          name: 'Inner Wisdom Guidance', 
          description: 'Connects you with your intuitive knowing about next steps',
          card_count: 5,
          focus: 'intuitive_insight'
        },
        {
          id: 'alignment_check',
          name: 'Alignment Check',
          description: 'Shows where you are in harmony and where adjustments are needed',
          card_count: 4,
          focus: 'calibration_based'
        }
      ],
      context_summary: {
        journey_stage: 'Ready for Oracle guidance',
        tools_completed: handoff_data.session_metadata.tools_completed,
        calibration_readiness: handoff_data.oracle_context.readiness_indicators,
        primary_focus: handoff_data.oracle_context.primary_intention
      },
      preparation_complete: true
    };
    
    res.json({
      status: 'success',
      data: oracleInitialization
    });
  } catch (error) {
    console.error('Error initializing Oracle from calibration:', error);
    res.status(500).json({ error: 'Failed to initialize Oracle from calibration' });
  }
});

// Get processing core summary for calibration tool
app.get('/api/v1/users/:userId/processing-core-summary', async (req, res) => {
  console.log('🧠 Processing core summary request for user:', req.params.userId);
  
  try {
    const userId = req.params.userId;
    
    // Check for authorization header
    const authUserId = getUserIdFromAuth(req);
    if (!authUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user matches or use auth user
    const targetUserId = userId === authUserId ? userId : authUserId;
    
    // Mock processing core summary data
    const mockProcessingCoreSummary = {
      processing_core_summary: {
        emotional_authority: "You process decisions through emotional waves, needing time for clarity.",
        cognitive_style: "Analytical and detail-oriented with strong pattern recognition.",
        energy_processing: "Steady and consistent energy flow with periodic renewal needs.",
        information_intake: "Visual and kinesthetic learning with preference for structured information.",
        decision_timing: "Benefits from sleeping on important decisions, especially emotional ones."
      },
      decision_growth_summary: {
        natural_strategy: "Wait for emotional clarity before making significant decisions.",
        growth_areas: ["Trust in timing", "Emotional intelligence", "Patience with process"],
        strengths: ["Deep wisdom", "Authentic choices", "Emotional depth"],
        optimal_conditions: "Quiet reflection time, trusted advisors, written processing."
      },
      tension_points_summary: {
        pressure_points: ["Rushed decisions", "Emotional overwhelm", "Unclear boundaries"],
        manifestation_blocks: ["Self-doubt", "Perfectionism", "Fear of judgment"],
        calibration_opportunities: ["Daily emotional check-ins", "Boundary setting", "Intuitive validation"],
        growth_edges: ["Leadership confidence", "Creative expression", "Authentic communication"]
      }
    };
    
    res.json({
      status: 'success',
      data: mockProcessingCoreSummary,
      user_id: targetUserId
    });
  } catch (error) {
    console.error('Error fetching processing core summary:', error);
    res.status(500).json({ error: 'Failed to fetch processing core summary' });
  }
});

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
  console.log('  POST /api/v1/ai/sessions/initialize - Initialize AI session');
  console.log('  POST /api/v1/ai/frequency-mapper/generate - Generate AI frequency mapper response');
  console.log('  POST /api/v1/ai/sessions/update - Update AI session progress');
  console.log('  POST /api/v1/ai/sessions/complete - Complete AI session');
  console.log('  GET  /api/v1/ai/sessions/:sessionId/frequency-mapper-output - Get frequency mapper output');
  console.log('  POST /api/v1/ai/calibration-tool/generate-sliders - Generate personalized calibration sliders');
  console.log('  POST /api/v1/ai/calibration-tool/generate-recommendation - Generate integrated recommendation');
  console.log('  POST /api/v1/ai/calibration-tool/prepare-oracle - Prepare Oracle handoff');
  console.log('  POST /api/v1/ai/oracle/initialize-from-calibration - Initialize Oracle from calibration');
  console.log('  GET  /api/v1/users/:userId/processing-core-summary - Get processing core summary');
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
