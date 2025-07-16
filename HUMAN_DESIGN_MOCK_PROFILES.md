# Human Design Mock Profiles - Complete Documentation

## Overview
This document provides complete information about the five Human Design mock profiles created for testing the Reality Creation Profile Engine app. Each profile represents one of the five Human Design types with authentic characteristics, strategies, and authorities.

## 🔐 Login Credentials

### 1. Generator Type - Sarah Generator
- **Email:** `generator@example.com`
- **Password:** `generator123`
- **Token:** `generator-token`
- **HD Type:** Generator
- **Strategy:** To respond
- **Authority:** Sacral Authority
- **Profile:** 2/4 (Hermit/Opportunist)
- **Birth Info:** Austin, TX - April 15, 1988 at 10:30 AM

**Characteristics:**
- Sustained creative energy and productive workflow
- Building systems and bringing ideas to life
- Learning to respond rather than initiate
- Developing patience with natural energy cycles

---

### 2. Manifestor Type - Marcus Manifestor
- **Email:** `manifestor@example.com`
- **Password:** `manifestor123`
- **Token:** `manifestor-token`
- **HD Type:** Manifestor
- **Strategy:** To inform
- **Authority:** Emotional Authority
- **Profile:** 1/3 (Investigator/Martyr)
- **Birth Info:** Los Angeles, CA - November 22, 1985 at 6:15 AM

**Characteristics:**
- Natural leadership and vision casting
- Initiating new projects and breakthrough thinking
- Learning to inform before taking action
- Managing impact and considering others

---

### 3. Projector Type - Patricia Projector
- **Email:** `projector@example.com`
- **Password:** `projector123`
- **Token:** `projector-token`
- **HD Type:** Projector
- **Strategy:** To wait for the invitation
- **Authority:** Splenic Authority
- **Profile:** 3/5 (Martyr/Heretic)
- **Birth Info:** Seattle, WA - July 8, 1992 at 2:45 PM

**Characteristics:**
- Deep insights into systems and people
- Natural ability to guide and optimize others
- Waiting for recognition and invitation
- Managing energy efficiently and avoiding burnout

---

### 4. Reflector Type - Riley Reflector
- **Email:** `reflector@example.com`
- **Password:** `reflector123`
- **Token:** `reflector-token`
- **HD Type:** Reflector
- **Strategy:** To wait a lunar cycle
- **Authority:** Lunar Authority
- **Profile:** 6/2 (Role Model/Hermit)
- **Birth Info:** Portland, OR - December 3, 1990 at 10:20 PM

**Characteristics:**
- Sensitivity to environmental and group dynamics
- Unique perspective as community mirror and evaluator
- Learning to wait full lunar cycle for major decisions
- Protecting sensitive energy and finding right environment

---

### 5. Manifesting Generator Type - Morgan ManGen
- **Email:** `mangen@example.com`
- **Password:** `mangen123`
- **Token:** `mangen-token`
- **HD Type:** Manifesting Generator
- **Strategy:** To respond and inform
- **Authority:** Sacral Authority
- **Profile:** 5/1 (Heretic/Investigator)
- **Birth Info:** Denver, CO - September 18, 1987 at 4:10 PM

**Characteristics:**
- Multi-passionate energy and diverse skill building
- Finding efficient shortcuts and innovative approaches
- Learning to inform others before taking action
- Balancing multiple interests without burnout

---

## 🔧 Technical Implementation

### Server Setup
The mock profiles are automatically loaded when the server starts:
```bash
cd /Users/Aleshalegair/RcpeExpoApp
node mock-server-fixed.js
```

### Authentication Tokens
Each Human Design type has a dedicated authentication token mapped in the server:
- `generator-token` → `generator@example.com`
- `manifestor-token` → `manifestor@example.com`
- `projector-token` → `projector@example.com`
- `reflector-token` → `reflector@example.com`
- `mangen-token` → `mangen@example.com`

### API Endpoints
All profiles are accessible through the standard API endpoints:
- `GET /api/v1/user-data/users/me/profiles` - Get user profiles
- `GET /api/v1/profiles/{profileId}/base_chart` - Get base chart data
- `GET /health` - Server health check

### Profile Data Structure
Each profile includes:
- Complete birth data (date, time, location)
- Assessment responses (typology and mastery sections)
- Human Design specifics (type, strategy, authority, profile lines)
- User identification and authentication mapping

---

## 📱 How to Use in the App

### Step 1: Login
1. Open the Reality Creation Profile Engine app
2. Navigate to the login screen
3. Choose any of the five credential sets above
4. Enter the email and password

### Step 2: Explore Profiles
Once logged in, you can:
- View the Human Design base chart
- Explore type-specific information
- Test all Human Design tools and features
- See authentic data for each type

### Step 3: Test Different Types
- Log out and log in with different credentials
- Compare experiences across all five types
- Verify type-specific features and content

---

## ✅ Verification

All profiles have been tested and verified:
- ✅ Authentication works for all five types
- ✅ Correct Human Design types are returned
- ✅ Strategies and authorities match type expectations
- ✅ Profile lines are valid Human Design combinations
- ✅ Base chart data is complete and consistent
- ✅ Assessment responses reflect type characteristics

---

## 🔄 Maintenance

### Adding New Profiles
To add new profiles, edit `/Users/Aleshalegair/RcpeExpoApp/mock-human-design-profiles.js`

### Modifying Existing Profiles
Update the profile data in the same file and restart the server

### Testing Changes
Run the test script to verify all profiles:
```bash
node test-hd-profiles.js
```

---

## 📞 Support

If you encounter any issues with the mock profiles:
1. Verify the server is running on port 3001
2. Check that all profile data loaded correctly in server logs
3. Run the test script to validate functionality
4. Review authentication token mappings

The mock profiles provide a complete testing environment for all Human Design types in the Reality Creation Profile Engine application.
