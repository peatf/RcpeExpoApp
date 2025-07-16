/**
 * Mock Human Design Profiles for all five types
 * Each profile includes complete user data, birth information, and assessment responses
 */

const { v4: uuidv4 } = require('uuid');

// Mock user credentials and login information
const MOCK_USER_CREDENTIALS = {
  generator: {
    email: 'generator@example.com',
    password: 'generator123',
    token: 'generator-token'
  },
  manifestor: {
    email: 'manifestor@example.com', 
    password: 'manifestor123',
    token: 'manifestor-token'
  },
  projector: {
    email: 'projector@example.com',
    password: 'projector123', 
    token: 'projector-token'
  },
  reflector: {
    email: 'reflector@example.com',
    password: 'reflector123',
    token: 'reflector-token'
  },
  manifestingGenerator: {
    email: 'mangen@example.com',
    password: 'mangen123',
    token: 'mangen-token'
  }
};

// Create mock profiles for each Human Design type
const MOCK_HD_PROFILES = {
  // 1. GENERATOR - Sacral Authority, Classic Builder Type
  generator: {
    id: uuidv4(),
    user_id: 'generator@example.com',
    name: 'Sarah Generator',
    birth_date: '1988-04-15',
    birth_time: '10:30:00',
    birth_location: 'Austin, TX',
    birth_data: {
      birth_date: '1988-04-15',
      birth_time: '10:30:00',
      city_of_birth: 'Austin',
      country_of_birth: 'USA'
    },
    assessment_responses: {
      typology: {
        'cognitive-alignment': 'analytical-practical',
        'perceptual-focus': 'detailed-patterns',
        'kinetic-drive': 'steady-consistent',
        'choice-navigation': 'gut-response',
        'resonance-field': 'responsive-building'
      },
      mastery: {
        'core-strength-1': 'Sustained creative energy and productive workflow',
        'core-strength-2': 'Building systems and bringing ideas to life',
        'growth-area-1': 'Learning to respond rather than initiate',
        'growth-area-2': 'Developing patience with natural energy cycles',
        'mastery-focus': 'Mastery through sustained practice and refinement',
        'development-priority': 'Authentic response and energy management'
      }
    },
    hd_type: 'Generator',
    strategy: 'To respond',
    authority: 'Sacral Authority',
    profile_lines: '2/4',
    created_at: new Date().toISOString(),
    status: 'completed'
  },

  // 2. MANIFESTOR - Informing Strategy, Initiator Type  
  manifestor: {
    id: uuidv4(),
    user_id: 'manifestor@example.com',
    name: 'Marcus Manifestor',
    birth_date: '1985-11-22',
    birth_time: '06:15:00', 
    birth_location: 'Los Angeles, CA',
    birth_data: {
      birth_date: '1985-11-22',
      birth_time: '06:15:00',
      city_of_birth: 'Los Angeles',
      country_of_birth: 'USA'
    },
    assessment_responses: {
      typology: {
        'cognitive-alignment': 'intuitive-visionary',
        'perceptual-focus': 'big-picture-innovation',
        'kinetic-drive': 'initiating-action',
        'choice-navigation': 'emotional-urges',
        'resonance-field': 'independent-leadership'
      },
      mastery: {
        'core-strength-1': 'Natural leadership and vision casting',
        'core-strength-2': 'Initiating new projects and breakthrough thinking',
        'growth-area-1': 'Learning to inform before taking action',
        'growth-area-2': 'Managing impact and considering others',
        'mastery-focus': 'Creating lasting impact through informed action',
        'development-priority': 'Conscious communication and emotional awareness'
      }
    },
    hd_type: 'Manifestor',
    strategy: 'To inform',
    authority: 'Emotional Authority', 
    profile_lines: '1/3',
    created_at: new Date().toISOString(),
    status: 'completed'
  },

  // 3. PROJECTOR - Recognition Strategy, Guide Type
  projector: {
    id: uuidv4(),
    user_id: 'projector@example.com',
    name: 'Patricia Projector', 
    birth_date: '1992-07-08',
    birth_time: '14:45:00',
    birth_location: 'Seattle, WA',
    birth_data: {
      birth_date: '1992-07-08',
      birth_time: '14:45:00',
      city_of_birth: 'Seattle',
      country_of_birth: 'USA'
    },
    assessment_responses: {
      typology: {
        'cognitive-alignment': 'penetrating-insight',
        'perceptual-focus': 'system-optimization',
        'kinetic-drive': 'focused-guidance',
        'choice-navigation': 'waiting-invitation',
        'resonance-field': 'recognition-wisdom'
      },
      mastery: {
        'core-strength-1': 'Deep insights into systems and people',
        'core-strength-2': 'Natural ability to guide and optimize others',
        'growth-area-1': 'Waiting for recognition and invitation',
        'growth-area-2': 'Managing energy efficiently and avoiding burnout',
        'mastery-focus': 'Developing expertise and sharing wisdom',
        'development-priority': 'Recognition boundaries and energy preservation'
      }
    },
    hd_type: 'Projector',
    strategy: 'To wait for the invitation',
    authority: 'Splenic Authority',
    profile_lines: '3/5',
    created_at: new Date().toISOString(),
    status: 'completed'
  },

  // 4. REFLECTOR - Lunar Cycle Decision Making, Mirror Type
  reflector: {
    id: uuidv4(),
    user_id: 'reflector@example.com',
    name: 'Riley Reflector',
    birth_date: '1990-12-03',
    birth_time: '22:20:00',
    birth_location: 'Portland, OR', 
    birth_data: {
      birth_date: '1990-12-03',
      birth_time: '22:20:00',
      city_of_birth: 'Portland',
      country_of_birth: 'USA'
    },
    assessment_responses: {
      typology: {
        'cognitive-alignment': 'adaptive-sensing',
        'perceptual-focus': 'environmental-attunement',
        'kinetic-drive': 'lunar-cycling',
        'choice-navigation': 'time-reflection',
        'resonance-field': 'community-mirror'
      },
      mastery: {
        'core-strength-1': 'Sensitivity to environmental and group dynamics',
        'core-strength-2': 'Unique perspective as community mirror and evaluator',
        'growth-area-1': 'Learning to wait full lunar cycle for major decisions',
        'growth-area-2': 'Protecting sensitive energy and finding right environment',
        'mastery-focus': 'Mastering sensitivity as a superpower',
        'development-priority': 'Environmental awareness and timing wisdom'
      }
    },
    hd_type: 'Reflector',
    strategy: 'To wait a lunar cycle',
    authority: 'Lunar Authority',
    profile_lines: '6/2',
    created_at: new Date().toISOString(),
    status: 'completed'
  },

  // 5. MANIFESTING GENERATOR - Multi-passionate Builder
  manifestingGenerator: {
    id: uuidv4(),
    user_id: 'mangen@example.com', 
    name: 'Morgan ManGen',
    birth_date: '1987-09-18',
    birth_time: '16:10:00',
    birth_location: 'Denver, CO',
    birth_data: {
      birth_date: '1987-09-18', 
      birth_time: '16:10:00',
      city_of_birth: 'Denver',
      country_of_birth: 'USA'
    },
    assessment_responses: {
      typology: {
        'cognitive-alignment': 'multi-faceted-dynamic',
        'perceptual-focus': 'diverse-interests',
        'kinetic-drive': 'skip-steps-efficiency',
        'choice-navigation': 'sacral-informed',
        'resonance-field': 'multi-passionate-building'
      },
      mastery: {
        'core-strength-1': 'Multi-passionate energy and diverse skill building',
        'core-strength-2': 'Finding efficient shortcuts and innovative approaches',
        'growth-area-1': 'Learning to inform others before taking action',
        'growth-area-2': 'Balancing multiple interests without burnout',
        'mastery-focus': 'Integrated mastery across multiple domains',
        'development-priority': 'Sustainable multi-passionate expression'
      }
    },
    hd_type: 'Manifesting Generator', 
    strategy: 'To respond and inform',
    authority: 'Sacral Authority',
    profile_lines: '5/1',
    created_at: new Date().toISOString(),
    status: 'completed'
  }
};

module.exports = {
  MOCK_USER_CREDENTIALS,
  MOCK_HD_PROFILES
};
