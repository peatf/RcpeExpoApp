const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// In-memory database for profiles
const profiles = new Map();

// Default user for testing
const DEFAULT_USER_ID = 'mock-user-123';

// Default token for testing
const DEFAULT_TOKEN = 'mock-token-123';

// Token to user ID mapping (simple auth)
const tokenToUser = new Map([
  [DEFAULT_TOKEN, DEFAULT_USER_ID]
]);

// Function to extract user ID from auth header
function getUserIdFromAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return tokenToUser.get(token) || null;
}

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/user-data/users/me/profiles', (req, res) => {
  const userId = getUserIdFromAuth(req);
  if (!userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      detail: 'Authentication token required'
    });
  }
  
  // Find all profiles belonging to this user
  const userProfiles = Array.from(profiles.values())
    .filter(profile => profile.user_id === userId);
  
  // Always include default profile for testing
  if (userProfiles.length === 0) {
    userProfiles.push({
      id: 'default-profile-123',
      user_id: userId,
      name: 'Test User Profile',
      status: 'completed',
      created_at: new Date().toISOString()
    });
  }
  
  res.json({
    profiles: userProfiles,
    total: userProfiles.length
  });
});

// Profile creation endpoint
app.post('/profile/create', async (req, res) => {
  console.log('📝 Profile creation request received:', req.body);
  
  try {
    // Get user ID from auth header if available, otherwise use default
    // In real app, this would be required, but for testing we're flexible
    const userId = getUserIdFromAuth(req) || DEFAULT_USER_ID;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock profile ID
    const profileId = 'profile-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Create profile data with user ID and provided data
    const profileData = {
      id: profileId,
      user_id: userId,
      ...req.body,
      created_at: new Date().toISOString(),
      status: 'completed'
    };
    
    // Store in our in-memory database
    profiles.set(profileId, profileData);
    console.log('✅ Profile created successfully:', profileId);
    console.log('👤 Profile associated with user:', userId);
    
    // Return the response in the expected format
    res.status(201).json({ profile_id: profileId });
  } catch (error) {
    console.error('❌ Error creating profile:', error);
    res.status(500).json({ 
      error: 'Failed to create profile',
      detail: error.message 
    });
  }
});

// Profile retrieval endpoint
app.get('/profile/:profileId', async (req, res) => {
  console.log('🔍 Profile fetch request for ID:', req.params.profileId);
  
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileId = req.params.profileId;
    
    // First check if we have this profile in our database
    let profileData = profiles.get(profileId);
    
    if (!profileData) {
      // If not found, return a mock profile for development
      console.log('⚠️ Profile not found in database, using mock data');
      profileData = {
        id: profileId,
        user_id: DEFAULT_USER_ID,
        birth_data: {
          birth_date: '1990-06-15',
          birth_time: '14:30:00',
          city_of_birth: 'New York',
          country_of_birth: 'USA'
        },
        assessment_responses: {
          typology: {
            'cognitive-alignment': 'analytical-intuitive',
            'perceptual-focus': 'external-patterns',
            'kinetic-drive': 'contemplative-action'
          },
          mastery: {
            'core-q1': 'creative-expression',
            'core-q2': 'intellectual-mastery'
          }
        },
        created_at: new Date().toISOString(),
        status: 'completed'
      };
      
      // Add profile analysis for all profiles
      profileData.profile_analysis = {
        hd_type: 'Manifestor',
        typology_pair: 'manifestor-emotional',
        energy_signature: 'Initiating Creative Force',
        strategy: 'To inform before taking action',
        authority: 'Emotional Authority'
      };
    }
    
    console.log('✅ Profile data retrieved for:', req.params.profileId);
    res.json(profileData);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      detail: error.message 
    });
  }
});

app.get('/api/v1/profiles/:profileId/base_chart', (req, res) => {
  const profileId = req.params.profileId;
  console.log('📊 Base chart request for profile:', profileId);
  
  try {
    // Check authorization
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return res.status(403).json({ 
        error: 'Access denied',
        detail: 'Authentication token required'
      });
    }
    
    // Try to get profile data
    const profileData = profiles.get(profileId);
    
    // Determine user ID and birth data for chart calculation
    let chartUserId = userId;
    let birthData = {
      date: '1990-06-15',
      time: '14:30:00',
      city: 'New York',
      country: 'USA'
    };
    
    // If we have actual profile data, use it
    if (profileData) {
      chartUserId = profileData.user_id;
      
      // Check if user has access to this profile
      if (chartUserId !== userId) {
        console.warn('⚠️ User', userId, 'attempted to access profile belonging to', chartUserId);
        return res.status(403).json({
          error: 'Access denied',
          detail: 'You do not have access to this profile'
        });
      }
      
      // Extract birth data from profile
      if (profileData.birth_data) {
        birthData = {
          date: profileData.birth_data.birth_date || birthData.date,
          time: profileData.birth_data.birth_time || birthData.time,
          city: profileData.birth_data.city_of_birth || birthData.city,
          country: profileData.birth_data.country_of_birth || birthData.country
        };
      }
      
      console.log('ℹ️ Using actual profile birth data for chart:', birthData);
    } else {
      console.warn('⚠️ Profile not found:', profileId, 'Using default birth data');
    }
    
    // Generate chart data based on profile/birth data
    // For demonstration, we still use mock data but note that
    // in a real implementation this would depend on the actual birth data
    res.json({
      status: 'success',
      data: {
        metadata: {
          profile_id: profileId,
          user_id: chartUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'completed',
          version: '1.0'
        },
        hd_type: 'Manifestor',
        typology_pair_key: 'manifestor-emotional',
        energy_family: {
          profile_lines: '3/5',
          conscious_line: 3,
          unconscious_line: 5,
          astro_sun_sign: birthData.date.includes('06') ? 'Gemini' : 'Leo', // Simple logic based on birth month
          astro_sun_house: parseInt(birthData.time) > 12 ? 5 : 4, // Simple logic based on birth time
          birth_location: `${birthData.city}, ${birthData.country}`
        }
      }
    });
  } catch (error) {
    console.error('❌ Error generating base chart:', error);
    res.status(500).json({ 
      error: 'Failed to generate base chart',
      detail: error.message 
    });
  }
});

console.log('Starting server...');
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
