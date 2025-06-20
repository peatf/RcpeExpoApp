# Blueprint Visualization Enhancement - Comprehensive Prompt for Jules

## 🎯 **TASK OVERVIEW**
Enhance the RCPE app's Base Chart visualization system to comprehensively handle ALL input types for each of the 9 synthesis categories, ensuring complete visual representation of every backend data field with proper interactive highlighting.

## 📁 **KEY FILES TO MODIFY**

### Primary Files:
- `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` - Main visualization component
- `/src/screens/Main/UserBaseChartScreen.tsx` - Chart screen with category logic
- `/src/services/baseChartService.ts` - Backend data interface
- `/src/services/blueprintVisualizerService.ts` - Data transformation service

### Reference Files:
- `/src/components/EnergeticBlueprint/BlueprintDescription.tsx` - Category descriptions
- `/src/types/` - TypeScript interfaces (if modifications needed)

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **What's Already Working:**
- All 9 synthesis categories have basic highlighting support
- Interactive category selection with fade/highlight effects
- Pixel art rendering system with static/dynamic bitmaps
- Core data transformation from BaseChartData to VisualizationData

### ❌ **What Needs Enhancement:**
- Many input types are not visually represented or distinguished
- Missing comprehensive visual patterns for strategy/authority types
- Insufficient use of color coding for motivation/spectrum values
- Throat elements (gates/channels) not properly visualized
- Center states need clearer visual distinction

## 🎨 **DETAILED ENHANCEMENT REQUIREMENTS**

### **1. Energy Family** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~401-431

**Current State:** Basic sun pattern with rays
**Missing Input Types:**
- `astro_north_node_sign` - Not visualized
- Profile line variations need more distinct representations

**Required Enhancements:**
```typescript
// Add to Energy Family visualization block
- Create distinct ray patterns for each profile line (1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6, 5/1, 5/2, 6/2, 6/3)
- Add North Node sign influence as secondary ray pattern or orbital ring
- Implement house-based color variations for the 12 astrological houses
- Profile line should affect ray count, thickness, and animation pattern
```

### **2. Energy Class** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~432-461

**Current State:** Basic aura field circles
**Missing Input Types:**
- `ascendant_sign` - Only used for hash, not visually distinct
- `incarnation_cross` - Full cross name not used
- `incarnation_cross_quarter` - Not directly visualized
- `chart_ruler_sign` - Not properly visualized

**Required Enhancements:**
```typescript
// Enhance Energy Class visualization
- Create 12 distinct aura patterns for each ascendant sign (fire/earth/air/water elements)
- Add incarnation cross quarter visual markers (Right Angle, Left Angle, Juxtaposition, Fixed)
- Implement chart ruler planet symbols at specific positions
- Add cross-specific geometric patterns overlaying the aura field
```

### **3. Processing Core** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~336-376

**Current State:** Three rotating centers with basic glyphs
**Missing Input Types:**
- `astro_moon_sign` - Not visualized
- `astro_mercury_sign` - Not visualized
- Center states need clearer defined/undefined/open distinction

**Required Enhancements:**
```typescript
// Enhance Processing Core visualization
- Add Moon sign influence as lunar phase overlay on emotional center
- Add Mercury sign influence as communication pattern on Ajna center
- Create distinct visual states:
  * Defined centers: Solid, bright, consistent patterns
  * Undefined centers: Dashed outlines, variable intensity
  * Open centers: Transparent with subtle boundary indication
- Add cognition variable specific patterns (Strategic, Receptive, etc.)
```

### **4. Decision Growth Vector** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~658-682

**Current State:** Basic compass needle
**Missing Input Types:**
- `strategy` - Not visually distinguished by type
- `authority` - Not visually distinguished by type
- `choice_navigation_spectrum` - Not visualized
- `north_node_house` - Not visualized

**Required Enhancements:**
```typescript
// Enhance Decision Growth Vector visualization
- Strategy-specific compass designs:
  * Generator: Steady, consistent needle with energy field
  * Projector: Intermittent needle with guidance beam
  * Manifestor: Bold, action-oriented needle with impact waves
  * Reflector: Cyclical needle following lunar influence
- Authority-specific visual elements:
  * Emotional: Wave patterns around compass
  * Sacral: Pulsing energy at compass base
  * Splenic: Sharp, intuitive lightning bolts
  * Heart/Ego: Strong geometric frame
  * G-Center: Identity spiral around compass
  * Environment: Contextual background elements
  * Mental: Information streams from compass
- Add North Node house markers (1-12) as directional indicators
- Implement choice navigation spectrum as path width/style variations
```

### **5. Drive Mechanics** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~626-656

**Current State:** Basic particles with simple animation
**Missing Input Types:**
- `motivation_color` - Not visually distinct
- `heart_state` / `root_state` - Not clearly visualized
- `kinetic_drive_spectrum` - Affects count but not visually distinct
- `resonance_field_spectrum` - Affects radius but not visually distinct
- `perspective_variable` - Not visualized

**Required Enhancements:**
```typescript
// Enhance Drive Mechanics visualization
- Motivation color coding:
  * Fear: Dark, contracted particles
  * Hope: Expanding, bright particles  
  * Desire: Magnetic, attractive particles
  * Need: Clustered, urgent particles
  * Guilt: Heavy, sinking particles
  * Innocence: Light, floating particles
- Heart/Root state combinations:
  * Both Defined: Structured, rhythmic particle flow
  * Heart Defined/Root Open: Sporadic bursts
  * Heart Open/Root Defined: Continuous background flow
  * Both Open: Chaotic, environmental particles
- Kinetic drive spectrum patterns:
  * Fluid: Smooth, flowing particle streams
  * Balanced: Regular, organized particle grid
  * Structured: Geometric, precise particle arrangements
- Resonance field spectrum:
  * Narrow: Focused beam of particles
  * Focused: Concentrated particle density
  * Wide: Expansive particle field
```

### **6. Manifestation Interface Rhythm** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~462-500

**Current State:** Basic throat pattern
**Missing Input Types:**
- `throat_gates` - Not visualized
- `throat_channels` - Not visualized
- `manifestation_rhythm_spectrum` - Basic pattern only

**Required Enhancements:**
```typescript
// Enhance Manifestation Interface Rhythm visualization
- Throat gates visualization:
  * Individual gate numbers as small symbols around throat area
  * Gate-specific mini-patterns based on gate meanings
  * Color coding for motor vs non-motor gates
- Throat channels visualization:
  * Channel lines connecting relevant centers to throat
  * Channel-specific patterns (projected vs generated energy)
  * Multi-channel integration patterns
- Manifestation rhythm spectrum:
  * Consistent: Regular, predictable pattern waves
  * Variable: Irregular, organic pattern variations
  * Undefined: Scattered, environmental pattern responses
- Throat definition states:
  * Defined: Strong, consistent throat pattern
  * Undefined: Responsive, variable throat pattern
```

### **7. Energy Architecture** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~243-290

**Current State:** Well implemented with definition types
**Enhancement Needed:**
- Add more sophisticated channel visualization
- Implement split bridge complexity indicators

### **8. Tension Points** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~377-400

**Current State:** Well implemented
**Enhancement Needed:**
- Add more tension planet influences if available in data

### **9. Evolutionary Path** - `/src/components/EnergeticBlueprint/BlueprintCanvas.tsx` lines ~297-335

**Current State:** Well implemented
**Enhancement Needed:**
- Enhance core priority visualization with specific symbols

## 🎨 **HIGHLIGHTING SYSTEM REQUIREMENTS**

### **Current Highlighting Logic:**
```typescript
const isHighlighted = !highlightedCategory;
const isCategoryHighlighted = isHighlighted || highlightedCategory === 'Category Name';
```

### **Required Enhancement:**
When a category is selected, it should be **darkened/intensified** (not faded), while all other categories fade to 30% opacity.

**Implementation Pattern:**
```typescript
const getOpacity = (categoryName: string): number => {
  if (!highlightedCategory) return 1.0; // All visible when none selected
  return highlightedCategory === categoryName ? 1.0 : 0.3; // Selected full, others fade
};

const getCategoryColor = (baseColor: string, categoryName: string): string => {
  const opacity = getOpacity(categoryName);
  if (highlightedCategory === categoryName) {
    // Darken/intensify the selected category
    return darkenColor(baseColor, 0.2); // Make 20% darker
  }
  return adjustColorOpacity(baseColor, opacity);
};
```

## 📊 **DATA STRUCTURE ENHANCEMENTS**

### **Verify Complete Data Flow:**
1. Check `BaseChartData` interface in `/src/services/baseChartService.ts`
2. Ensure all fields are properly mapped in `VisualizationData` interface
3. Add any missing fields to the data transformation logic

### **Missing Data Fields to Add:**
```typescript
// Add to VisualizationData interface if missing:
interface VisualizationData {
  // ... existing fields ...
  
  // Energy Family additions
  astro_north_node_house?: string;
  
  // Energy Class additions  
  incarnation_cross_full?: string;
  chart_ruler_house?: string;
  
  // Processing Core additions
  astro_moon_house?: string;
  astro_mercury_house?: string;
  
  // Decision Growth Vector additions
  strategy_type?: 'Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  authority_type?: string;
  
  // Drive Mechanics additions
  motivation_fear_hope?: 'Fear' | 'Hope';
  motivation_desire_need?: 'Desire' | 'Need';
  motivation_guilt_innocence?: 'Guilt' | 'Innocence';
  
  // Additional fields as needed...
}
```

## 🛠 **TECHNICAL IMPLEMENTATION GUIDELINES**

### **Color System Enhancement:**
```typescript
// Add to THEME constant
const THEME = {
  background: '#F8F4E9',
  primary: '#212121',
  accent: '#BFBFBF',
  faint: '#EAE6DA',
  
  // Add category-specific colors
  energyFamily: '#E8B86D',      // Warm gold
  energyClass: '#7B9EA8',       // Cool blue
  processingCore: '#A8A8D8',    // Soft purple
  decisionVector: '#D8A8A8',    // Soft red
  driveMechanics: '#A8D8A8',    // Soft green
  manifestation: '#D8D8A8',     // Soft yellow
  architecture: '#C8A8D8',      // Soft magenta
  tensionPoints: '#D8C8A8',     // Soft orange
  evolutionary: '#A8C8D8',      // Soft cyan
  
  // Motivation colors
  fear: '#4A4A4A',
  hope: '#E8D4B8',
  desire: '#D4A4A4',
  need: '#A4D4A4',
  guilt: '#8A8A8A',
  innocence: '#F0F0E8',
};
```

### **Helper Functions to Add:**
```typescript
// Add these utility functions to BlueprintCanvas.tsx
const darkenColor = (color: string, factor: number): string => {
  // Implementation to darken a hex color
};

const adjustColorOpacity = (color: string, opacity: number): string => {
  // Implementation to adjust color opacity
};

const getStrategyPattern = (strategy: string): PatternType => {
  // Return strategy-specific visual pattern
};

const getAuthorityVisualization = (authority: string): VisualElement => {
  // Return authority-specific visual element
};
```

## 🧪 **TESTING REQUIREMENTS**

### **Create Test File:**
Create `/src/components/EnergeticBlueprint/__tests__/BlueprintCanvas.test.tsx` to verify:
1. All 9 categories render without errors
2. Highlighting system works correctly
3. All input types are visually represented
4. Performance is acceptable with complex visualizations

### **Manual Testing Checklist:**
1. Generate multiple blueprints with different data combinations
2. Test each category highlighting individually
3. Verify visual distinctiveness of different input values
4. Check performance on various devices
5. Ensure accessibility compliance

## 🎯 **SUCCESS CRITERIA**

### **Completion Requirements:**
1. ✅ Every field in `BaseChartData` is visually represented
2. ✅ All 9 categories have comprehensive, distinct visualizations
3. ✅ Highlighting system properly darkens selected category, fades others
4. ✅ Visual distinctions are clear and meaningful for users
5. ✅ Performance remains smooth with enhanced visualizations
6. ✅ Code is well-documented and maintainable
7. ✅ No TypeScript errors or runtime issues

### **Quality Standards:**
- Visual clarity and aesthetic appeal
- Performance optimization (60fps animation)
- Accessibility considerations
- Code maintainability and documentation
- Comprehensive test coverage

## 📝 **ADDITIONAL NOTES**

- Maintain the existing pixel art aesthetic while adding sophistication
- Ensure visual hierarchy guides user attention appropriately  
- Consider color-blind accessibility in color choices
- Keep file sizes reasonable despite enhanced complexity
- Document all new visualization patterns for future maintenance

---

**PRIORITY LEVEL:** High - This enhancement significantly improves user experience and data comprehension in the RCPE app's core visualization feature.

**ESTIMATED COMPLEXITY:** Large - Comprehensive refactoring with new visual systems and data handling patterns.

**DEPENDENCIES:** Ensure React Native Skia library supports all required rendering features for enhanced visualizations.
