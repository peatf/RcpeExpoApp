/**
 * mock-server-validators.js
 * Validation utilities for mock server data
 */

/**
 * Validates profile lines to ensure they match a valid Human Design profile
 * Valid profiles: 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 4/1, 5/1, 5/2, 6/2, 6/3
 */
function validateProfileLines(data) {
  if (data.energy_family) {
    const profileLines = data.energy_family.profile_lines;
    
    if (profileLines) {
      // Parse profile line values
      const [conscLine, uncLine] = profileLines.split('/').map(Number);
      
      // Valid HD profile combinations
      const validProfiles = [
        [1,3], [1,4], [2,4], [2,5], [3,5], [3,6],
        [4,6], [4,1], [5,1], [5,2], [6,2], [6,3]
      ];
      
      const isValid = validProfiles.some(([c, u]) => c === conscLine && u === uncLine);
      
      // If invalid profile, fix to a default valid profile
      if (!isValid) {
        console.warn(`Invalid profile lines ${profileLines}, using default 1/3`);
        data.energy_family.profile_lines = "1/3";
        data.energy_family.conscious_line = 1;
        data.energy_family.unconscious_line = 3;
        
        // Also fix in evolutionary path if present
        if (data.evolutionary_path) {
          data.evolutionary_path.conscious_line = 1;
          data.evolutionary_path.unconscious_line = 3;
        }
      } else {
        // Ensure consistency between profile_lines and conscious/unconscious lines
        if (data.energy_family.conscious_line !== conscLine) {
          data.energy_family.conscious_line = conscLine;
        }
        
        if (data.energy_family.unconscious_line !== uncLine) {
          data.energy_family.unconscious_line = uncLine;
        }
        
        // Also ensure consistency in evolutionary path if present
        if (data.evolutionary_path) {
          data.evolutionary_path.conscious_line = conscLine;
          data.evolutionary_path.unconscious_line = uncLine;
        }
      }
    }
  }
  
  return data;
}

/**
 * Validates G Center access to ensure it has a proper value
 */
function validateGCenterAccess(data) {
  if (data.evolutionary_path) {
    const gCenterAccess = data.evolutionary_path.g_center_access;
    
    // If g_center_access is missing or invalid, set it to a default
    if (!gCenterAccess || !['Fixed Identity', 'Fluid Identity'].includes(gCenterAccess)) {
      console.warn(`Invalid G Center Access: ${gCenterAccess}, using default 'Fixed Identity'`);
      data.evolutionary_path.g_center_access = 'Fixed Identity';
    }
  }
  
  return data;
}

module.exports = {
  validateProfileLines,
  validateGCenterAccess
};
