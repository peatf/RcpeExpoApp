const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { validateProfileLines, validateGCenterAccess } = require('./mock-server-validators');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const profiles = new Map();

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
      'growth-area-2': 'Emotional intelligence and manifestation abilities',
      'mastery-focus': 'Innovation and strategic planning',
      'development-priority': 'Leadership qualities and authentic presence'
    }
  },
  created_at: new Date().toISOString(),
  status: 'completed'
};
profiles.set(defaultProfileId, defaultProfile);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Extract user ID from auth header
// Debug logging helper
function debugLog(...args) {
  console.log('[DEBUG]', ...args);
}

// Token to user ID mapping for testing
const TOKEN_MAP = {
  'mock-token-123': 'mock-user-123',
  'alice-token': 'alice@example.com',
  'bob-token': 'bob@example.com'
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

// Profile creation endpoint
app.post('/profile/create', async (req, res) => {
  console.log('Received profile creation request:', req.body);
  
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
    
    // Ensure typology has all required fields
    const typologyFields = [
      'cognitive-alignment', 'perceptual-focus', 'kinetic-drive', 
      'choice-navigation', 'resonance-field'
    ];
    
    typologyFields.forEach(field => {
      if (!assessmentResponses.typology[field]) {
        assessmentResponses.typology[field] = req.body.assessment_responses?.typology?.[field] || 'left';
      }
    });
    
    // Ensure mastery has sample data if none provided
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
  console.log('Received profile fetch request for ID:', req.params.id);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profile = profiles.get(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Log what we're returning to verify assessment data is included
    console.log('Returning profile with structure:', 
      JSON.stringify({
        id: profile.id,
        user_id: profile.user_id,
        has_birth_data: !!profile.birth_data,
        has_assessment_responses: !!profile.assessment_responses,
        assessment_keys: profile.assessment_responses ? {
          typology: Object.keys(profile.assessment_responses.typology || {}),
          mastery: Object.keys(profile.assessment_responses.mastery || {})
        } : 'none'
      }, null, 2)
    );
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// User profiles endpoint (authentication required)
app.get('/api/v1/user-data/users/me/profiles', async (req, res) => {
  debugLog('Received user profiles request');
  
  try {
    // Get the authorization header with case insensitivity
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // Extract user ID or default to mock user
    let userId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      userId = getUserIdFromAuth(req);
      debugLog(`Auth header found, user ID: ${userId}`);
    } else {
      userId = 'mock-user-123';
      debugLog('No auth header found, using default user ID');
    }
    
    debugLog(`Fetching profiles for user: ${userId}`);
    
    // Get all profiles and filter to this user
    const allProfiles = Array.from(profiles.values());
    debugLog(`Total profiles in system: ${allProfiles.length}`);
    
    const userProfiles = allProfiles.filter(profile => {
      debugLog(`Checking profile: ${profile.id} belonging to: ${profile.user_id}`);
      return profile.user_id === userId;
    });
    
    debugLog(`Found ${userProfiles.length} profiles for user ${userId}`);
    
    // If no profiles found for this user, include the default profile
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
  console.log('Received profile base chart request for profile ID:', req.params.profileId);
  
  try {
    // Check for authorization header with case insensitivity
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Missing or invalid auth header:', authHeader);
      return res.status(403).json({
        error: 'Access denied',
        detail: 'Authentication token required'
      });
    }
    
    // Get authenticated user ID
    const authUserId = getUserIdFromAuth(req);
    console.log(`User ${authUserId} requesting base chart for profile ${req.params.profileId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileId = req.params.profileId;
    
    // Handle default profile ID mapping
    let resolvedProfileId = profileId;
    let profile = profiles.get(profileId);
    
    if (!profile && profileId === 'default-profile-123') {
      // Find the most recent profile for this user
      const userProfiles = Array.from(profiles.values())
        .filter(p => p.user_id === authUserId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log(`Found ${userProfiles.length} profiles for user ${authUserId}`);
      
      if (userProfiles.length > 0) {
        profile = userProfiles[0];
        resolvedProfileId = profile.id;
        console.log(`Mapped default profile to user's most recent profile: ${resolvedProfileId}`);
      } else {
        // Create a temporary profile for this user if none exists
        console.log('No profiles found, creating temporary profile for user');
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
              'perceptual-focus': 'left',
              'kinetic-drive': 'left',
              'choice-navigation': 'left',
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
        // Store this temporary profile
        profiles.set(profileId, profile);
      }
    }
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        detail: `No profile found with ID: ${resolvedProfileId}`
      });
    }
    
    // Check if user has access to this profile
    if (profile.user_id !== authUserId) {
      console.warn(`⚠️ User ${authUserId} attempted to access profile belonging to ${profile.user_id}`);
      return res.status(403).json({
        error: 'Access denied',
        detail: 'You do not have access to this profile'
      });
    }
    
    // Extract birth data and assessment responses from the profile
    const birthData = profile.birth_data || {
      birth_date: '1990-06-15',
      birth_time: '14:30:00',
      city_of_birth: 'New York',
      country_of_birth: 'USA'
    };

    // Get assessment data if available
    const assessmentData = profile.assessment_responses || {
      typology: {},
      mastery: {}
    };

    console.log('Using birth data for chart generation:', birthData);
    console.log('Using assessment data for chart generation:',
      JSON.stringify(assessmentData, null, 2));

    // Generate dynamic chart values based on profile data
    const sunSign = birthData.birth_date?.includes('04') ? 'Aries' :
                   birthData.birth_date?.includes('05') ? 'Taurus' :
                   birthData.birth_date?.includes('06') ? 'Gemini' :
                   birthData.birth_date?.includes('07') ? 'Cancer' :
                   birthData.birth_date?.includes('08') ? 'Leo' :
                   birthData.birth_date?.includes('09') ? 'Virgo' :
                   birthData.birth_date?.includes('10') ? 'Libra' :
                   birthData.birth_date?.includes('11') ? 'Scorpio' :
                   birthData.birth_date?.includes('12') ? 'Sagittarius' :
                   'Capricorn';

    // Get mastery values from assessment if available
    const masteryValues = [];

    // Log complete mastery data for debugging
    console.log('Processing mastery data:', JSON.stringify(assessmentData.mastery, null, 2));

    if (assessmentData.mastery && Object.keys(assessmentData.mastery).length > 0) {
      // Add mastery values based on actual responses
      Object.entries(assessmentData.mastery).forEach(([key, value]) => {
        console.log(`Processing mastery question ${key} with value ${value}`);
        
        // Convert responses to meaningful values based on question
        if (key.startsWith('core')) {
          if (value.includes('innovative') || value.includes('innovation')) {
            masteryValues.push('Innovation');
          }
          if (value.includes('strategic') || value.includes('planning')) {
            masteryValues.push('Strategic thinking');
          }
          if (value.includes('creative') || value.includes('expression')) {
            masteryValues.push('Creative expression');
          }
          if (value.includes('authentic') || value.includes('authenticity')) {
            masteryValues.push('Authentic presence');
          }
        }
        
        if (key.startsWith('growth')) {
          if (value.includes('leadership')) {
            masteryValues.push('Leadership qualities');
          }
          if (value.includes('emotional')) {
            masteryValues.push('Emotional intelligence');
          }
          if (value.includes('manifestation')) {
            masteryValues.push('Manifestation abilities');
          }
        }
      });
    }

    // Default values if no mastery data or no values were extracted
    if (masteryValues.length === 0) {
      console.log('Using default mastery values');
      masteryValues.push(
        'Authentic self-expression',
        'Emotional intelligence',
        'Creative manifestation',
        'Leadership presence'
      );
    }
    
    // Mock comprehensive base chart data - using actual profile data
    const mockBaseChart = {
      metadata: {
        profile_id: resolvedProfileId, // Use resolvedProfileId
        user_id: profile.user_id,
        created_at: profile.created_at,
        updated_at: new Date().toISOString(),
        status: 'completed',
        version: '1.0'
      },
      hd_type: 'Manifestor', // Example, can be made dynamic
      typology_pair_key: 'ENFP-Leo', // Example, can be made dynamic
      energy_family: {
        profile_lines: '6/2', // Valid Human Design profile
        conscious_line: 6,    // Matches first digit of profile_lines
        unconscious_line: 2,  // Matches second digit of profile_lines
        astro_sun_sign: sunSign,
        astro_sun_house: birthData.birth_time?.startsWith('09') ? 3 : 5,
        astro_north_node_sign: 'Gemini',
        birth_location: `${birthData.city_of_birth || 'Unknown'}, ${birthData.country_of_birth || 'Unknown'}`
      },
      energy_class: { // Example data, can be expanded
        ascendant_sign: 'Virgo',
        chart_ruler_sign: 'Mercury in Cancer',
        chart_ruler_house: 11,
        incarnation_cross: 'Right Angle Cross of Eden',
        profile_type: 'Role Model/Hermit'
      },
      processing_core: { // Example data
        astro_moon_sign: 'Pisces',
        astro_moon_house: 7,
        // ... other fields
        chiron_gate: 51
      },
      // ... other sections of the chart, ensure they are present or have defaults
      decision_growth_vector: profile.decision_growth_vector || {}, // Add default if not present
      drive_mechanics: profile.drive_mechanics || {},
      manifestation_interface_rhythm: profile.manifestation_interface_rhythm || {},
      energy_architecture: profile.energy_architecture || {},
      tension_points: profile.tension_points || {},
      evolutionary_path: profile.evolutionary_path || {
        g_center_access: 'Fixed Identity', // Valid values: 'Fixed Identity' or 'Fluid Identity'
        incarnation_cross: 'Right Angle Cross of Eden',
        astro_north_node_sign: 'Gemini',
        astro_north_node_house: 3,
        conscious_line: 6, // Should match conscious_line in energy_family
        unconscious_line: 2, // Should match unconscious_line in energy_family
        core_priorities: ['Expression', 'Connection', 'Growth']
      },
      dominant_mastery_values: masteryValues,
      manifestation_dimensions: profile.manifestation_dimensions || {} // Add default
    };
    
    // Validate the mock base chart data
    const validatedBaseChart = validateGCenterAccess(validateProfileLines(mockBaseChart));
    
    res.json({
      status: 'success',
      data: validatedBaseChart
    });
  } catch (error) {
    console.error('Error fetching profile base chart:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to fetch base chart'
    });
  }
});

// Legacy base chart endpoint (for backward compatibility)
app.get('/api/v1/charts/base/:userId', async (req, res) => {
  console.log('Received legacy base chart request for user ID:', req.params.userId);
  
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ 
        error: 'Access denied',
        detail: 'Authentication token required'
      });
    }
    
    // Get authenticated user ID
    const authUserId = getUserIdFromAuth(req);
    console.log(`Authenticated user ${authUserId} requesting legacy chart for user ${req.params.userId}`);
    
    // Check if user has permission (can only access own data)
    if (authUserId !== req.params.userId && req.params.userId !== 'me') {
      console.warn(`⚠️ User ${authUserId} attempted to access chart belonging to ${req.params.userId}`);
      return res.status(403).json({
        error: 'Access denied',
        detail: 'You can only access your own chart data'
      });
    }
    
    // Get the user's most recent profile
    const userProfiles = Array.from(profiles.values())
      .filter(profile => profile.user_id === authUserId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Get birth data from most recent profile if available
    const recentProfile = userProfiles.length > 0 ? userProfiles[0] : null;
    const birthData = recentProfile?.birth_data || {
      birth_date: '1990-06-15',
      birth_time: '14:30',
      city_of_birth: 'New York',
      country_of_birth: 'USA'
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBaseChart = {
      energy_family: {
        name: "Manifestor",
        description: "Energy types who are here to initiate and create impact",
        strategy: "To inform before taking action",
        signature: "Peace",
        not_self_theme: "Anger",
        birth_location: `${birthData.city_of_birth}, ${birthData.country_of_birth}`
      },
      processing_core: {
        name: "Emotional Authority",
        description: "Decision-making through emotional wave and clarity"
      },
      user_id: authUserId,
      generated_at: new Date().toISOString(),
      chart_version: "1.0"
    };
    
    res.json(mockBaseChart);
  } catch (error) {
    console.error('Error fetching base chart:', error);
    res.status(500).json({ error: 'Failed to fetch base chart' });
  }
});
// Debug endpoint to check who you're authenticated as
app.get('/whoami', (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ 
      error: 'Not authenticated',
      detail: 'No valid auth token provided'
    });
  }
  
  const userId = getUserIdFromAuth(req);
  res.json({
    authenticated: true,
    userId: userId,
    token: authHeader.split(' ')[1],
    headers: {
      authorization: req.headers.authorization,
      Authorization: req.headers.Authorization
    }
  });
});

// Debug endpoint to check all profiles in the system
app.get('/debug/profiles', (req, res) => {
  const allProfiles = Array.from(profiles.values());
  res.json({
    total: allProfiles.length,
    profiles: allProfiles
  });
});

// Start server
console.log('Starting mock server...');
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /profile/create - Create a new profile');
  console.log('  GET /profile/:id - Fetch profile by ID');
  console.log('  GET /api/v1/charts/base/:userId - Fetch base chart for user (legacy)');
  console.log('  GET /api/v1/user-data/users/me/profiles - Fetch user profiles');
  console.log('  GET /api/v1/profiles/:profileId/base_chart - Fetch profile-based base chart');
  console.log('  GET /health - Health check');
  console.log(`Default profile created with ID: ${defaultProfileId}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
