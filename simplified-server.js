const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// In-memory profile storage
const profiles = new Map();

// Add CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Profile creation endpoint
app.post('/profile/create', (req, res) => {
  console.log('Creating profile with data:', req.body);
  
  // Extract user ID from request
  const authHeader = req.headers.authorization;
  const userId = authHeader ? 
    (authHeader.includes('alice') ? 'alice' : 
     authHeader.includes('bob') ? 'bob' : 'mock-user-123') 
    : 'mock-user-123';
    
  console.log(`Creating profile for user: ${userId}`);
  
  // Create new profile ID
  const profileId = uuidv4();
  
  // Store profile with explicit user ID
  const profile = {
    id: profileId,
    user_id: userId,
    ...req.body,
    created_at: new Date().toISOString(),
    status: 'completed'
  };
  
  // Store in memory
  profiles.set(profileId, profile);
  console.log(`Created profile: ${profileId}`);
  
  // Return ID to client
  res.json({ profile_id: profileId });
});

// Get profile by ID
app.get('/profile/:id', (req, res) => {
  const profileId = req.params.id;
  console.log(`Fetching profile: ${profileId}`);
  
  const profile = profiles.get(profileId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  res.json(profile);
});

// User profile list endpoint
app.get('/api/v1/user-data/users/me/profiles', (req, res) => {
  console.log('Fetching user profile list');
  
  // Extract user ID from auth header
  const authHeader = req.headers.authorization;
  const userId = authHeader ? 
    (authHeader.includes('alice') ? 'alice' : 
     authHeader.includes('bob') ? 'bob' : 'mock-user-123') 
    : 'mock-user-123';
  
  console.log(`Looking up profiles for user: ${userId}`);
  
  // Filter profiles for this user
  const userProfiles = Array.from(profiles.values())
    .filter(profile => profile.user_id === userId);
  
  console.log(`Found ${userProfiles.length} profiles for ${userId}`);
  
  // If no profiles, create a default one
  if (userProfiles.length === 0) {
    const defaultProfile = {
      id: `default-profile-${userId}`,
      user_id: userId,
      name: 'Default Profile',
      status: 'completed',
      created_at: new Date().toISOString()
    };
    userProfiles.push(defaultProfile);
  }
  
  res.json({
    profiles: userProfiles,
    total: userProfiles.length
  });
});

// Base chart endpoint
app.get('/api/v1/profiles/:profileId/base_chart', (req, res) => {
  const profileId = req.params.profileId;
  console.log(`Fetching base chart for profile: ${profileId}`);
  
  // Get profile
  const profile = profiles.get(profileId);
  
  // If no profile found, return error
  if (!profile && profileId !== 'default-profile-123') {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  // Use profile data or defaults
  const userData = profile || { 
    user_id: 'mock-user-123',
    birth_data: {
      birth_date: '1990-06-15',
      birth_time: '14:30:00',
      city_of_birth: 'New York',
      country_of_birth: 'USA'
    }
  };
  
  // Create chart data using profile data
  const baseChart = {
    status: 'success',
    data: {
      metadata: {
        profile_id: profileId,
        user_id: userData.user_id,
        created_at: userData.created_at || new Date().toISOString(),
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
        birth_location: userData.birth_data ? 
          `${userData.birth_data.city_of_birth}, ${userData.birth_data.country_of_birth}` :
          'Unknown location'
      }
    }
  };
  
  res.json(baseChart);
});

// Start server
app.listen(PORT, () => {
  console.log(`Simplified server running on http://localhost:${PORT}`);
});
