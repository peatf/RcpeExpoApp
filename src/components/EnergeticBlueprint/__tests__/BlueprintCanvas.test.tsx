import React from 'react';
import { render }
from '@testing-library/react-native';
import BlueprintCanvas from '../BlueprintCanvas';
import { VisualizationData } from '../../../services/blueprintVisualizerService';

// Mock React Native Skia
jest.mock('@shopify/react-native-skia', () => {
  const RealSkia = jest.requireActual('@shopify/react-native-skia');
  return {
    ...RealSkia,
    Skia: {
      ...RealSkia.Skia,
      Paint: jest.fn(() => ({
        setColor: jest.fn(),
        setAlphaf: jest.fn(), // if used
        setAntiAlias: jest.fn(), // if used
        setStyle: jest.fn(), // if used
        setStrokeWidth: jest.fn(), // if used
      })),
      Color: jest.fn(color => color), // Simple mock for Skia.Color(string)
      Data: {
        fromBytes: jest.fn(() => ({})), // Mock Skia.Data.fromBytes
      },
      Image: {
        MakeImage: jest.fn(() => ({ // Mock Skia.Image.MakeImage
          width: () => 250,
          height: () => 250,
          dispose: jest.fn(), // Add dispose if called
        })),
      },
      Path: {
       Make: jest.fn(() => ({ // Mock for Skia.Path.Make if needed
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        cubicTo: jest.fn(),
        quadTo: jest.fn(),
        close: jest.fn(),
        dispose: jest.fn(),
       })),
      },
      vec: jest.fn((x,y) => ({x,y})), // Mock Skia.vec
    },
    Canvas: jest.fn(({ children }) => <>{children}</>),
    Group: jest.fn(({ children }) => <>{children}</>),
    Rect: jest.fn(() => null),
    Circle: jest.fn(() => null),
    Line: jest.fn(() => null),
    Image: jest.fn(() => null),
    // Add other Skia components if they are directly used and not just via Paint/Path
  };
});

// Mock for other libraries if needed by BlueprintCanvas or its imports
jest.mock('react-native/Libraries/Image/resolveAssetSource');

// Minimal mock data for VisualizationData
const mockVizData: VisualizationData = {
  profile_lines: "1/3",
  astro_sun_sign: "Aries",
  astro_sun_house: "1st",
  astro_north_node_sign: "Taurus",
  astro_north_node_house: "5th", // Added from prompt
  ascendant_sign: "Gemini",
  chart_ruler_sign: "Mercury",
  chart_ruler_house: "2nd", // Added from prompt
  incarnation_cross: "Right Angle Cross of The Sphinx", // Assuming this covers 'incarnation_cross_full'
  incarnation_cross_quarter: "Initiation",
  astro_moon_sign: "Cancer",
  astro_moon_house: "3rd", // Added
  astro_mercury_sign: "Leo",
  astro_mercury_house: "4th", // Added
  head_state: "Defined",
  ajna_state: "Defined",
  emotional_state: "Defined",
  cognition_variable: "Feeling",
  chiron_gate: "57", // Keep as is
  strategy: "Generator", // Example from prompt
  authority: "Sacral", // Example from prompt
  choice_navigation_spectrum: "Balanced",
  astro_mars_sign: "Virgo",
  north_node_house: "1st", // Already here, maps to decision_growth_vector.north_node_house
  jupiter_placement: "Jupiter in Libra", // Keep as is
  motivation_color: "Hope", // Keep original for direct mapping
  motivation_fear_hope: "Hope", // Populated based on motivation_color
  // motivation_desire_need: undefined, // Example
  // motivation_guilt_innocence: undefined, // Example
  heart_state: "Defined",
  root_state: "Defined",
  venus_sign: "Libra",
  kinetic_drive_spectrum: "Balanced",
  resonance_field_spectrum: "Wide",
  perspective_variable: "Personal",
  saturn_placement: "Saturn in Scorpio", // Keep as is
  throat_definition: "Defined",
  throat_gates: "1,2,8",
  throat_channels: "1-8, 12-22",
  manifestation_rhythm_spectrum: "Consistent",
  mars_aspects: "Mars trine Sun", // Keep as is
  channel_list: "1-8, 25-51",
  definition_type: "Single",
  split_bridges: "10-20", // Example
  soft_aspects: "Sun sextile Moon", // Keep as is
  g_center_access: "Consistent",
  conscious_line: "1",
  unconscious_line: "3",
  core_priorities: "Love, Direction, Purpose",
  tension_planets: [{ name: "Saturn", gate: "10" }, { name: "Mars", gate: "40" }],
};


describe('BlueprintCanvas', () => {
  // Restore console after tests if it was mocked
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    // Optional: Suppress console output during tests if it's too noisy
    // console.error = jest.fn();
    // console.warn = jest.fn();
  });

  afterEach(() => {
    // console.error = originalConsoleError;
    // console.warn = originalConsoleWarn;
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('renders without crashing with basic data', () => {
    let renderedSuccessfully = false;
    try {
      render(
        <BlueprintCanvas data={mockVizData} highlightedCategory={null} width={250} height={250} />
      );
      renderedSuccessfully = true;
    } catch (e) {
      console.error("BlueprintCanvas rendering failed:", e);
    }
    expect(renderedSuccessfully).toBe(true);
  });

  it('renders without crashing when highlightedCategory is "Energy Family"', () => {
     let renderedSuccessfully = false;
    try {
      render(
        <BlueprintCanvas data={mockVizData} highlightedCategory={"Energy Family"} width={250} height={250} />
      );
      renderedSuccessfully = true;
    } catch (e) {
      console.error("BlueprintCanvas rendering failed for Energy Family:", e);
    }
    expect(renderedSuccessfully).toBe(true);
  });

  it('renders placeholder when data is null', () => {
    const { getByText } = render(
      <BlueprintCanvas data={null} highlightedCategory={null} width={250} height={250} />
    );
    expect(getByText('Click "Generate New Blueprint"')).toBeTruthy();
  });

  // Conceptual: If helpers were exported, tests would be here.
  // Since they are not, we rely on the component rendering tests above
  // to give some confidence they don't immediately crash.
  // describe('BlueprintCanvas Helpers (Conceptual)', () => {
  //   // test('hexToRgb correctly converts hex to RGB', () => { ... });
  //   // test('parseGateChannelString correctly parses gate strings', () => { ... });
  // });

});

// Example of how to test an exported helper if it were in a separate file:
// import { hexToRgb } from '../utils'; // Assuming a utils.ts file
// describe('Standalone Helper Tests', () => {
//   describe('hexToRgb', () => {
//     it('should convert #RGB to [R, G, B]', () => {
//       expect(hexToRgb('#F0A')).toEqual([255, 0, 170]); // FF, 00, AA
//     });
//     it('should convert #RRGGBB to [R, G, B]', () => {
//       expect(hexToRgb('#FF00AA')).toEqual([255, 0, 170]);
//     });
//     it('should handle hex without #', () => {
//       expect(hexToRgb('FF00AA')).toEqual([255, 0, 170]);
//     });
//   });
// });

// Note: The actual testing of helper functions is commented out as per the subtask description,
// because they are not exported from BlueprintCanvas.tsx. The structure is provided for context.
// The main focus is the component smoke test.
