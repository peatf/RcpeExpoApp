/**
 * BlueprintCanvas.tsx
 * 
 * Enhanced BlueprintCanvas component with rich, data-driven, animated visualizations
 * This file reimplements all advanced features from Jules' original version including:
 * 
 * 1. Drive Mechanics: Data-driven particle system with resonance field, kinetic spectrum
 * 2. Energy Class: Elemental aura patterns, cross pattern, quarter markers, planet symbols
 * 3. Decision Growth Vector: Compass visualization with Mars/authority/strategy influences
 * 4. Processing Core: Center states, cognition glyphs, astro influences
 * 5. Manifestation Interface Rhythm: Throat gates/channels, rhythm animation
 * 6. Energy Family: Animated rays, north node orbit
 * 7. Energy Architecture: Split bridges, channel dashes
 * 
 * Dynamic/static split for performance optimization
 */
import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Canvas, 
  Skia, 
  Image,
  ColorType,
  AlphaType,
  FilterMode,
  MipmapMode,
  SkImage,
  Rect
} from '@shopify/react-native-skia';
import { VisualizationData } from '../../services/blueprintVisualizerService';
import { theme } from '../../constants/theme'; // Import global theme

// ### PROPS AND INTERFACES ###
interface BlueprintCanvasProps {
  data: VisualizationData | null;
  highlightedCategory: string | null;
  width: number;
  height: number;
  onCanvasReady?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Particle {
  position: Point;
  velocity: Point;
  baseRadius: number;
  color: string;
  initialPosition: Point;
}

// ### CONSTANTS AND THEME ###
// Local THEME object updated to use global theme values
const THEME = {
  background: 'transparent', // Changed from #F8F4E9 to transparent as per Issue 26
  primary: theme.colors.base6,    // Was #212121, close to textPrimary or base6
  accent: theme.colors.base2,     // Was #BFBFBF, close to base2 or base3
  faint: theme.colors.base2,      // Was #EAE6DA, using base2 to avoid beige from base1
  highlight: theme.colors.accent, // Was #007AFF
};

const PIXEL_RESOLUTION = 250;
const center = { x: PIXEL_RESOLUTION / 2, y: PIXEL_RESOLUTION / 2 };

// ### PIXEL ART HELPER FUNCTIONS ###
const setPixel = (
  pixelData: Uint8Array,
  x: number,
  y: number,
  r: number, // Should already be pre-multiplied if alpha is not 255
  g: number, // Should already be pre-multiplied if alpha is not 255
  b: number, // Should already be pre-multiplied if alpha is not 255
  a: number = 255 // This is the final alpha for the pixel
) => {
  const pixelIndex = (Math.floor(y) * PIXEL_RESOLUTION + Math.floor(x)) * 4;
  if (
    pixelIndex >= 0 &&
    pixelIndex < pixelData.length - 3 &&
    x >= 0 &&
    x < PIXEL_RESOLUTION &&
    y >= 0 &&
    y < PIXEL_RESOLUTION
  ) {
    pixelData[pixelIndex] = r;
    pixelData[pixelIndex + 1] = g;
    pixelData[pixelIndex + 2] = b;
    pixelData[pixelIndex + 3] = a;
  }
};

const colorToRGBA = (color: string, alphaValue: number = 1.0): [number, number, number, number] => {
  const hex = color.startsWith('#') ? color.substring(1) : color;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b, Math.floor(alphaValue * 255)];
};

const drawPixelLine = (
  pixelData: Uint8Array,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  dash?: [number, number],
  alphaValue: number = 1.0 // Added alphaValue
) => {
  const [r, g, b, a] = colorToRGBA(color, alphaValue); // Pass alphaValue
  
  x1 = Math.floor(x1);
  y1 = Math.floor(y1);
  x2 = Math.floor(x2);
  y2 = Math.floor(y2);
  
  const dx = Math.abs(x2 - x1);
  const sx = x1 < x2 ? 1 : -1;
  const dy = -Math.abs(y2 - y1);
  const sy = y1 < y2 ? 1 : -1;
  let err = dx + dy, e2, dashCount = 0;
  
  while (true) {
    if (!dash || (dashCount++ % (dash[0] + dash[1])) < dash[0]) {
      setPixel(pixelData, x1, y1, r, g, b, a);
    }
    if (x1 === x2 && y1 === y2) break;
    e2 = 2 * err;
    if (e2 >= dy) { err += dy; x1 += sx; }
    if (e2 <= dx) { err += dx; y1 += sy; }
  }
};

const drawPixelCircle = (
  pixelData: Uint8Array,
  cx: number, cy: number,
  radius: number,
  color: string,
  fillPattern: 'solid' | 'dither' | 'none' = 'none',
  dashPattern?: [number, number],
  alphaValue: number = 1.0
) => {
  const [r, g, b, a] = colorToRGBA(color, alphaValue);
  cx = Math.floor(cx);
  cy = Math.floor(cy);
  radius = Math.floor(radius);
  
  if (fillPattern !== 'none') {
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        if (i * i + j * j <= radius * radius) {
          if (fillPattern === 'solid' || (fillPattern === 'dither' && (cx + i + cy + j) % 2 === 0)) {
            setPixel(pixelData, cx + i, cy + j, r, g, b, a);
          }
        }
      }
    }
  } else {
    let x = radius, y = 0, err = 0, dashCount = 0;
    while (x >= y) {
      const shouldDraw = !dashPattern || (dashCount++ % (dashPattern[0] + dashPattern[1])) < dashPattern[0];
      
      if (shouldDraw) {
        setPixel(pixelData, cx + x, cy + y, r, g, b, a);
        setPixel(pixelData, cx + y, cy + x, r, g, b, a);
        setPixel(pixelData, cx - y, cy + x, r, g, b, a);
        setPixel(pixelData, cx - x, cy + y, r, g, b, a);
        setPixel(pixelData, cx - x, cy - y, r, g, b, a);
        setPixel(pixelData, cx - y, cy - x, r, g, b, a);
        setPixel(pixelData, cx + y, cy - x, r, g, b, a);
        setPixel(pixelData, cx + x, cy - y, r, g, b, a);
      }
      
      y += 1;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) {
        x -= 1;
        err += 1 - 2 * x;
      }
    }
  }
};

const drawPixelRect = (
  pixelData: Uint8Array,
  x: number, y: number,
  width: number, height: number,
  color: string,
  filled: boolean = false,
  dashPattern?: [number, number],
  alphaValue: number = 1.0 // Already had alphaValue, ensure it's used
) => {
  const [r, g, b, a] = colorToRGBA(color, alphaValue); // Uses alphaValue
  x = Math.floor(x);
  y = Math.floor(y);
  width = Math.floor(width);
  height = Math.floor(height);
  
  if (filled) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        setPixel(pixelData, x + i, y + j, r, g, b, a);
      }
    }
  } else {
    let dashCount = 0;
    // Top and bottom edges
    for (let i = 0; i < width; i++) {
      const shouldDraw = !dashPattern || (dashCount++ % (dashPattern[0] + dashPattern[1])) < dashPattern[0];
      if (shouldDraw) {
        setPixel(pixelData, x + i, y, r, g, b, a);
        setPixel(pixelData, x + i, y + height - 1, r, g, b, a);
      }
    }
    // Left and right edges
    for (let j = 0; j < height; j++) {
      const shouldDraw = !dashPattern || (dashCount++ % (dashPattern[0] + dashPattern[1])) < dashPattern[0];
      if (shouldDraw) {
        setPixel(pixelData, x, y + j, r, g, b, a);
        setPixel(pixelData, x + width - 1, y + j, r, g, b, a);
      }
    }
  }
};

const simpleHash = (str: string): number => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const mapValue = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number =>
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

// ### COLOR HELPER FUNCTIONS ###
const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.startsWith('#') ? hex.slice(1) : hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const darkenColor = (hexColor: string, factor: number): string => {
  let [r, g, b] = hexToRgb(hexColor);
  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));
  return rgbToHex(r, g, b);
};

const adjustColorOpacity = (hexColor: string, opacity: number): string => {
  const [r, g, b] = hexToRgb(hexColor);
  return `rgba(${r},${g},${b},${opacity})`;
};

const getHouseColorVariation = (baseHexColor: string, house: number | string, isProfileLineColor: boolean = false): string => {
  if (!baseHexColor) return '#FFFFFF'; // Default to white if base color is invalid
  const numericHouse = typeof house === 'string' ? parseInt(house.replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')) : house;
  if (isNaN(numericHouse) || numericHouse < 1 || numericHouse > 12) return baseHexColor;

  let [r, g, b] = hexToRgb(baseHexColor);
  const variationFactor = isProfileLineColor ? 0.2 : 0.1; 
  
  switch (numericHouse % 3) {
    case 0: r = Math.min(255, r + Math.floor(25 * variationFactor * (numericHouse % 2 === 0 ? 1 : -1))); break;
    case 1: g = Math.min(255, g + Math.floor(25 * variationFactor * (numericHouse % 2 === 0 ? 1 : -1))); break;
    case 2: b = Math.min(255, b + Math.floor(25 * variationFactor * (numericHouse % 2 === 0 ? 1 : -1))); break;
  }
  
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return rgbToHex(r, g, b);
};

// Helper to get astrological element from a sign
const getAstroElement = (sign: string): 'Fire' | 'Earth' | 'Air' | 'Water' | 'Unknown' => {
  if (!sign) return 'Unknown';
  const s = sign.toLowerCase();
  if (['aries', 'leo', 'sagittarius'].includes(s)) return 'Fire';
  if (['taurus', 'virgo', 'capricorn'].includes(s)) return 'Earth';
  if (['gemini', 'libra', 'aquarius'].includes(s)) return 'Air';
  if (['cancer', 'scorpio', 'pisces'].includes(s)) return 'Water';
  return 'Unknown';
};

// Helper to get ruling planet from a sign
const getRulingPlanet = (sign: string): string => {
  if (!sign) return 'Sun'; // Default
  const s = sign.toLowerCase();
  if (s === 'aries') return 'Mars';
  if (s === 'taurus') return 'Venus';
  if (s === 'gemini') return 'Mercury';
  if (s === 'cancer') return 'Moon';
  if (s === 'leo') return 'Sun';
  if (s === 'virgo') return 'Mercury';
  if (s === 'libra') return 'Venus';
  if (s === 'scorpio') return 'Pluto'; // or Mars
  if (s === 'sagittarius') return 'Jupiter';
  if (s === 'capricorn') return 'Saturn';
  if (s === 'aquarius') return 'Uranus'; // or Saturn
  if (s === 'pisces') return 'Neptune'; // or Jupiter
  return 'Sun';
};

// Helper for parsing gate/channel data
const parseGateChannelString = (str: string | undefined | null): number[] => {
  if (!str) return [];
  const items: number[] = [];
  const parts = str.split(',');
  parts.forEach(part => {
    part = part.trim();
    if (part.includes('-')) {
      const range = part.split('-').map(Number);
      if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
        for (let i = range[0]; i <= range[1]; i++) {
          items.push(i);
        }
      }
    } else {
      const num = Number(part);
      if (!isNaN(num)) {
        items.push(num);
      }
    }
  });
  return [...new Set(items)].sort((a,b) => a-b); // Unique and sorted
};

const MOTOR_GATES: ReadonlySet<number> = new Set([12, 20, 22, 35, 45, 21, 34, 40, 59]); // Motor-connected gates

// ### CORE COMPONENT ###
const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ data, highlightedCategory, width, height, onCanvasReady }) => {
  const [animationTime, setAnimationTime] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((Date.now() / 30000) % 1);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, []);

  // Initialize particles when data is available
  useEffect(() => {
    if (!data) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = [];
    const particleCount = 150;
    
    const [fieldWidth = 50, fieldHeight = 50] = (data.resonance_field_spectrum || "50x50").split('x').map(Number);
    const areaWidth = mapValue(fieldWidth, 0, 100, PIXEL_RESOLUTION * 0.2, PIXEL_RESOLUTION * 0.9);
    const areaHeight = mapValue(fieldHeight, 0, 100, PIXEL_RESOLUTION * 0.2, PIXEL_RESOLUTION * 0.9);
    const startX = center.x - areaWidth / 2;
    const startY = center.y - areaHeight / 2;

        // Using theme colors for motivations
    const motivationColors: { [key: string]: string } = {
            "Fear": theme.colors.fear,
            "Hope": theme.colors.hope,
            "Desire": theme.colors.desire,
            "Need": theme.colors.need,
            "Guilt": theme.colors.guilt,
            "Innocence": theme.colors.innocence
    };
        const particleColor = motivationColors[data.motivation_color] || THEME.primary; // THEME.primary is local to this file, consider aligning if needed

    for (let i = 0; i < particleCount; i++) {
        const pos = { x: startX + Math.random() * areaWidth, y: startY + Math.random() * areaHeight };
        newParticles.push({
            position: pos,
            initialPosition: { ...pos },
            velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 },
            baseRadius: 1,
            color: particleColor,
        });
    }
    setParticles(newParticles);
  }, [data]);

  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady();
    }
  }, [onCanvasReady]);

  const dynamicBitmapImage = useMemo(() => {
    if (!data) return null;
    const t = animationTime;

    const pixelData = new Uint8Array(PIXEL_RESOLUTION * PIXEL_RESOLUTION * 4);
    pixelData.fill(0);

    const isHighlighted = (category: string) => !highlightedCategory || highlightedCategory === category;
    const getColor = (category: string) => isHighlighted(category) ? THEME.primary : THEME.faint; // This might be less used now

    // ### ENERGY ARCHITECTURE ###
    {
      const categoryName = 'Energy Architecture';
      const baseColor = THEME.primary; // Assuming THEME.primary is the default color for this section
      const alpha = (!highlightedCategory || highlightedCategory === categoryName) ? 1.0 : 0.3;

      // const color = getColor('Energy Architecture'); // Old way
      // const alpha = isHighlighted('Energy Architecture') ? 1.0 : 0.3; // Old way, not consistently used

      const numLayers = { 'Single': 5, 'Split': 4, 'Triple Split': 3, 'Quadruple Split': 2, 'No Definition': 6 }[data.definition_type] || 4;
      const maxRadius = PIXEL_RESOLUTION * 0.45;
      
      // Process channel and bridge data
      const parsedChannels = parseGateChannelString(data.channel_list);
      const numActiveChannels = parsedChannels.length;
      const hash = simpleHash(data.definition_type + (data.channel_list || ""));

      for (let i = 0; i < numLayers; i++) {
        const radius = (maxRadius / numLayers) * (i + 1);
        const isSplit = data.definition_type.includes('Split') && i === Math.floor(numLayers / 2);
        
        // Make the channel-influenced rings pulsate slightly
        const pulsateRadius = radius * (1 + Math.sin(t * Math.PI * 2 + i) * 0.02);
        const dashPattern = numActiveChannels > 5 && i % 2 === 0 ? [2,1] as [number, number] : 
                           (numActiveChannels > 10 ? [1,1] as [number, number] : undefined);
        
        // Pass alpha to drawPixelCircle
        drawPixelCircle(pixelData, center.x, center.y, pulsateRadius, baseColor, 'none', dashPattern, alpha);
        
        // Add animated split bridges
        if (isSplit) {
          const parsedSplitBridges = parseGateChannelString(data.split_bridges);
          const numSplitBridges = parsedSplitBridges.length;
          
          if (numSplitBridges > 0) {
            // Draw multiple bridges when there are several
            const bridgeSegments = Math.min(numSplitBridges, 4); // Cap at 4 visible bridges for clarity
            
            for (let j = 0; j < bridgeSegments; j++) {
              const bridgeAngle = (j / bridgeSegments) * Math.PI * 2 + t * Math.PI * 0.5;
              const bridgeLength = (maxRadius / numLayers);
              
              const bridgeColor = numSplitBridges > 2 ? darkenColor(baseColor, 0.2) : baseColor;
              const bridgeDash = numSplitBridges > 1 ? [3,1] as [number, number] : [2,2] as [number, number];
              
              const x1 = center.x + Math.cos(bridgeAngle) * radius;
              const y1 = center.y + Math.sin(bridgeAngle) * radius;
              const x2 = center.x + Math.cos(bridgeAngle) * (radius + bridgeLength);
              const y2 = center.y + Math.sin(bridgeAngle) * (radius + bridgeLength);
              
              drawPixelLine(pixelData, x1, y1, x2, y2, bridgeColor, bridgeDash, alpha); // Pass alpha
            }
          }
        }
      }
      
      // Draw channel connections
      if (parsedChannels.length > 0) {
        // const channelVisibility = Math.sin(t * Math.PI * 2) * 0.3 + 0.7; // This was for opacity, now handled by global alpha
        
        const dashLength = Math.floor(2 + parsedChannels.length % 3);
        parsedChannels.forEach((_, i) => {
          if (i < 8) { // Limit visible channels for clarity
            const angle = (i / 8) * Math.PI * 2;
            const innerRadius = maxRadius * 0.3;
            const outerRadius = maxRadius * 0.9;
            const innerX = center.x + Math.cos(angle) * innerRadius;
            const innerY = center.y + Math.sin(angle) * innerRadius;
            const outerX = center.x + Math.cos(angle) * outerRadius;
            const outerY = center.y + Math.sin(angle) * outerRadius;
            
            // Dashed or solid based on index
            const channelDash = i % 2 === 0 ? [dashLength, 2] as [number, number] : undefined;
            
            // Vary channel color slightly based on index
            const channelColorHex = i % 3 === 0 ? darkenColor(baseColor, 0.15) :
                               (i % 3 === 1 ? darkenColor(baseColor, -0.1) : baseColor); // Use baseColor here
            
            drawPixelLine(pixelData, innerX, innerY, outerX, outerY, channelColorHex, channelDash, alpha); // Pass alpha
          }
        });
      }
    }

    // ### ENERGY CLASS ###
    {
        const categoryName = 'Energy Class';
        const baseColor = theme.colors.energyClass || THEME.primary; // Use a specific theme color or fallback
        const alpha = (!highlightedCategory || highlightedCategory === categoryName) ? 1.0 : 0.3;

        const borderOffset = 20;
        const elementType = getAstroElement(data.ascendant_sign);
        // Draw the outer rectangular border
        drawPixelRect(pixelData, borderOffset, borderOffset, PIXEL_RESOLUTION - borderOffset * 2, PIXEL_RESOLUTION - borderOffset * 2, baseColor, false, undefined, alpha);

        // Elemental pattern based on the ascendant sign's element
        // All sub-drawing calls need to respect 'alpha'
        const [element_r, element_g, element_b, element_a_base] = colorToRGBA(baseColor); // Get base RGBA
        const final_element_a = Math.floor(element_a_base * alpha / 255 * alpha); // Combine alphas

        switch (elementType) {
            case 'Fire': {
                const fireCount = 24;
                const fireMaxLength = 20;
                for (let i = 0; i < fireCount; i++) {
                    const angle = (i / fireCount) * Math.PI * 2;
                    const length = fireMaxLength * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 + i * 0.2));
                    const innerX = center.x + Math.cos(angle) * (PIXEL_RESOLUTION * 0.3);
                    const innerY = center.y + Math.sin(angle) * (PIXEL_RESOLUTION * 0.3);
                    const outerX = innerX + Math.cos(angle) * length;
                    const outerY = innerY + Math.sin(angle) * length;
                    drawPixelLine(pixelData, innerX, innerY, outerX, outerY, baseColor, undefined, alpha);
                }
                break;
            }
            case 'Earth': {
                const earthRings = 3;
                for (let i = 1; i <= earthRings; i++) {
                    const ringRadius = (PIXEL_RESOLUTION * 0.35) * (i / earthRings);
                    drawPixelCircle(pixelData, center.x, center.y, ringRadius, baseColor, 'none', undefined, alpha);
                    if (i < earthRings) {
                        const innerRadius = ringRadius;
                        const outerRadius = (PIXEL_RESOLUTION * 0.35) * ((i + 1) / earthRings);
                        for (let x = Math.floor(center.x - outerRadius); x <= Math.ceil(center.x + outerRadius); x++) {
                            for (let y = Math.floor(center.y - outerRadius); y <= Math.ceil(center.y + outerRadius); y++) {
                                const dist = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
                                if (dist >= innerRadius && dist <= outerRadius && (x + y) % 2 === 0) {
                                    setPixel(pixelData, x, y, element_r, element_g, element_b, final_element_a);
                                }
                            }
                        }
                    }
                }
                break;
            }
            case 'Air': {
                const airParticleCount = 100;
                const airRadius = PIXEL_RESOLUTION * 0.3;
                for (let i = 0; i < airParticleCount; i++) {
                    const angle = t * Math.PI * 2 * 2 + (i / airParticleCount) * Math.PI * 2;
                    const swirl = 0.2 + 0.8 * Math.sin(i * 0.1 + t * Math.PI * 4);
                    const x = center.x + Math.cos(angle + i * 0.1) * airRadius * swirl;
                    const y = center.y + Math.sin(angle + i * 0.2) * airRadius * swirl;
                    setPixel(pixelData, x, y, element_r, element_g, element_b, final_element_a);
                }
                break;
            }
            case 'Water': {
                const waterLineCount = 8;
                const waterAmplitude = 10;
                const waterWaveLength = 50;
                for (let lineIndex = 0; lineIndex < waterLineCount; lineIndex++) {
                    const yOffset = mapValue(lineIndex, 0, waterLineCount - 1, -PIXEL_RESOLUTION * 0.2, PIXEL_RESOLUTION * 0.2);
                    for (let x = center.x - PIXEL_RESOLUTION * 0.3; x <= center.x + PIXEL_RESOLUTION * 0.3; x += 2) {
                        const wavePhase = x / waterWaveLength + t * Math.PI * 2;
                        const y_coord = center.y + yOffset + Math.sin(wavePhase) * waterAmplitude;
                        setPixel(pixelData, x, y_coord, element_r, element_g, element_b, final_element_a);
                    }
                }
                break;
            }
        }

        if (data.incarnation_cross) {
            const crossColorHex = darkenColor(baseColor, 0.3);
            const crossRadius = 20;
            const crossRotation = t * Math.PI * 0.5;
            const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
            angles.forEach(baseAngle => {
                const angle = baseAngle + crossRotation;
                const x = center.x + Math.cos(angle) * crossRadius;
                const y = center.y + Math.sin(angle) * crossRadius;
                drawPixelLine(pixelData, x - 5, y, x + 5, y, crossColorHex, undefined, alpha);
                drawPixelLine(pixelData, x, y - 5, x, y + 5, crossColorHex, undefined, alpha);
            });
        }

        if (data.incarnation_cross_quarter) {
            const quarterColorHex = baseColor;
            const quarterRadius = PIXEL_RESOLUTION * 0.4;
            const quarters = ['RA', 'LA', 'RD', 'LD'];
            const quarterIndex = quarters.indexOf(data.incarnation_cross_quarter);
            if (quarterIndex >= 0) {
                const quarterAngle = Math.PI / 2 * quarterIndex;
                const x = center.x + Math.cos(quarterAngle) * quarterRadius;
                const y = center.y + Math.sin(quarterAngle) * quarterRadius;
                drawPixelCircle(pixelData, x, y, 3, quarterColorHex, 'none', undefined, alpha);
                for (let i = 0; i < 4; i++) {
                    const lineAngle = quarterAngle + (i * Math.PI / 2);
                    const endX = x + Math.cos(lineAngle) * 5;
                    const endY = y + Math.sin(lineAngle) * 5;
                    drawPixelLine(pixelData, x, y, endX, endY, quarterColorHex, undefined, alpha);
                }
            }
        }

        if (data.chart_ruler_sign && data.chart_ruler_house) {
            const planetColorHex = baseColor;
            const rulerPlanet = getRulingPlanet(data.chart_ruler_sign);
            const rulerHouseStr = String(data.chart_ruler_house).replace(/\D/g,'');
            const rulerHouse = parseInt(rulerHouseStr) || 1;
            const rulerAngle = (rulerHouse - 1) / 12 * Math.PI * 2 - Math.PI / 2;
            const rulerRadius = PIXEL_RESOLUTION * 0.35;
            const x = center.x + Math.cos(rulerAngle) * rulerRadius;
            const y = center.y + Math.sin(rulerAngle) * rulerRadius;
            drawPixelCircle(pixelData, x, y, 4, planetColorHex, 'none', undefined, alpha);
            drawPixelLine(pixelData, x - 2, y, x + 2, y, planetColorHex, undefined, alpha);
            drawPixelLine(pixelData, x, y - 2, x, y + 2, planetColorHex, undefined, alpha);
        }
    }

    // ### EVOLUTIONARY PATH ###
    {
        const categoryName = 'Evolutionary Path';
        const baseColor = theme.colors.evolutionary || THEME.primary;
        const alpha = (!highlightedCategory || highlightedCategory === categoryName) ? 1.0 : 0.3;
        const pathHash = simpleHash(data.incarnation_cross);
        const pathLength = 50;
        const startRadius = PIXEL_RESOLUTION * 0.1;
        const endRadius = PIXEL_RESOLUTION * 0.4;
        const startAngle = mapValue(pathHash % 1000, 0, 1000, 0, Math.PI * 2);
        const lineStyle: [number, number] = data.g_center_access === 'Consistent' ? [1,0] : (data.g_center_access === 'Projected' ? [3,2] : [1,3]);
        let lastX = center.x + Math.cos(startAngle) * startRadius;
        let lastY = center.y + Math.sin(startAngle) * startRadius;
        for (let i = 1; i <= pathLength; i++) {
            const progress = i / pathLength;
            const radius = startRadius + progress * (endRadius - startRadius);
            const angle = startAngle + progress * (parseInt(data.conscious_line || '0') + parseInt(data.unconscious_line || '0')) + Math.sin(t * Math.PI * 2) * 0.1;
            const currentX = center.x + Math.cos(angle) * radius;
            const currentY = center.y + Math.sin(angle) * radius;
            drawPixelLine(pixelData, lastX, lastY, currentX, currentY, baseColor, lineStyle, alpha); // Pass alpha
            lastX = currentX;
            lastY = currentY;
        }
    }

    // ### PROCESSING CORE ###
    {
        const categoryName = 'Processing Core';
        const baseColor = theme.colors.processingCore || THEME.primary;
        const alpha = (!highlightedCategory || highlightedCategory === categoryName) ? 1.0 : 0.3;
        const baseRadius = PIXEL_RESOLUTION * 0.08;
        const centersInfo = [
          { state: data.head_state || 'Defined', name: 'Head', originalIndex: 0 },
          { state: data.ajna_state || 'Defined', name: 'Ajna', originalIndex: 1 },
          { state: data.emotional_state || 'Defined', name: 'Emotional', originalIndex: 2 }
        ];

        centersInfo.forEach((centerInfo, i) => {
          const angle = (i / centersInfo.length) * Math.PI * 2 + t * Math.PI * (1 + i * 0.2) * (i % 2 === 0 ? 1 : -1);
          const currentCenterRadius = baseRadius * (0.5 + (simpleHash(centerInfo.name) % 500 / 1000));
          const x = center.x + Math.cos(angle) * PIXEL_RESOLUTION * 0.25;
          const y = center.y + Math.sin(angle) * PIXEL_RESOLUTION * 0.25;
          const glyphSize = 4;

          // Distinct Visual States
          let centerAlpha = alpha;
          let centerPattern: 'solid' | 'dither' | 'none' = 'solid';
          let outlineDash: [number, number] | undefined = undefined;
          
          if (centerInfo.state === 'Undefined') {
            centerPattern = 'none'; // No fill
            outlineDash = [2, 2]; // Dashed outline
          } else if (centerInfo.state === 'Open') {
            centerPattern = 'none'; // No fill
            outlineDash = [1, 3]; // Very subtle dashed boundary
            // Draw a faint circle with the boundary
            drawPixelCircle(pixelData, x, y, currentCenterRadius, baseColor);
          }

          // Draw base circle for Defined/Undefined
          if (centerInfo.state !== 'Open') {
             drawPixelCircle(pixelData, x, y, currentCenterRadius, baseColor, centerPattern);
          }

          // Cognition Variable Specific Patterns
          if (centerInfo.state !== 'Open') {
             const cognition = data.cognition_variable || "Default";
             const cognHash = simpleHash(cognition);
             const glyphColor = darkenColor(baseColor, -0.2); // Make glyphs brighter

             // Glyph drawing logic
             switch (cognHash % 3) {
                 case 0: // Cross
                     drawPixelLine(pixelData, x - glyphSize, y, x + glyphSize, y, glyphColor);
                     drawPixelLine(pixelData, x, y - glyphSize, x, y + glyphSize, glyphColor);
                     break;
                 case 1: // Square
                     drawPixelLine(pixelData, x - glyphSize, y - glyphSize, x + glyphSize, y - glyphSize, glyphColor);
                     drawPixelLine(pixelData, x + glyphSize, y - glyphSize, x + glyphSize, y + glyphSize, glyphColor);
                     drawPixelLine(pixelData, x + glyphSize, y + glyphSize, x - glyphSize, y + glyphSize, glyphColor);
                     drawPixelLine(pixelData, x - glyphSize, y + glyphSize, x - glyphSize, y - glyphSize, glyphColor);
                     break;
                 case 2: // Triangle
                     drawPixelLine(pixelData, x, y - glyphSize, x + glyphSize, y + glyphSize, glyphColor);
                     drawPixelLine(pixelData, x + glyphSize, y + glyphSize, x - glyphSize, y + glyphSize, glyphColor);
                     drawPixelLine(pixelData, x - glyphSize, y + glyphSize, x, y - glyphSize, glyphColor);
                     break;
             }
          }

          // Moon Sign Influence (Emotional Center)
          if (centerInfo.name === 'Emotional' && centerInfo.state !== 'Open') {
            const moonSign = data.astro_moon_sign || "Aries";
            // Map sign to a phase (0-7)
            const phase = simpleHash(moonSign) % 8;
            const lunarRadius = currentCenterRadius * 0.6;
            
            // Clear area first with background
            drawPixelCircle(pixelData, x, y, lunarRadius, THEME.background, 'solid');
            
            // Draw lunar phase
            if (phase === 4) { // Full Moon
              drawPixelCircle(pixelData, x, y, lunarRadius, baseColor, 'solid');
            } else if (phase === 0) {
              // New Moon - leave empty
            } else if (phase === 2) { // First Quarter
              for (let px = 0; px <= lunarRadius; px++)
                for (let py = -lunarRadius; py <= lunarRadius; py++)
                  if (px*px + py*py <= lunarRadius*lunarRadius)
                    setPixel(pixelData, x + px, y + py, ...colorToRGBA(baseColor));
            } else if (phase === 6) { // Last Quarter
              for (let px = -lunarRadius; px <= 0; px++)
                for (let py = -lunarRadius; py <= lunarRadius; py++)
                  if (px*px + py*py <= lunarRadius*lunarRadius)
                    setPixel(pixelData, x + px, y + py, ...colorToRGBA(baseColor));
            } else { // Crescents/Gibbous
              drawPixelCircle(pixelData, x, y, lunarRadius, baseColor, 'solid');
              const darkRadius = lunarRadius * 0.8;
              let darkOffsetX = 0;
              if (phase === 1) darkOffsetX = lunarRadius * 0.5;   // Waxing Crescent
              if (phase === 7) darkOffsetX = -lunarRadius * 0.5;  // Waning Crescent
              if (phase === 3) darkOffsetX = -lunarRadius * 0.5;  // Waxing Gibbous
              if (phase === 5) darkOffsetX = lunarRadius * 0.5;   // Waning Gibbous
              
              const effectiveDarkRadius = (phase === 1 || phase === 7) ? lunarRadius : lunarRadius * 0.7;
              drawPixelCircle(pixelData, x - darkOffsetX, y, effectiveDarkRadius, THEME.background, 'solid');
            }
          }

          // Mercury Sign Influence (Ajna Center)
          if (centerInfo.name === 'Ajna' && centerInfo.state !== 'Open') {
            const mercurySign = data.astro_mercury_sign || "Aries";
            const patternType = simpleHash(mercurySign) % 3;
            const patternSize = currentCenterRadius * 1.5;
            
            // Mercury communication patterns
            const animatedSize = patternSize * (0.8 + Math.sin(t * Math.PI * 4) * 0.2); // Pulsating
            
            if (patternType === 0) { // Radiating lines
              for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + t * Math.PI; // Rotate
                const x2 = x + Math.cos(angle) * animatedSize;
                const y2 = y + Math.sin(angle) * animatedSize;
                drawPixelLine(pixelData, x, y, x2, y2, baseColor, [1,2]); // Dashed lines
              }
            } else if (patternType === 1) { // Wave pattern
              for (let i = -Math.floor(animatedSize); i <= Math.floor(animatedSize); i++) {
                const waveY = Math.sin((i + t * 20) * 0.5) * (patternSize / 3);
                setPixel(pixelData, x + i, y + waveY, ...colorToRGBA(baseColor));
              }
            } else { // Dots
              for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + t * Math.PI * 2; // Rotating dots
                const radius = animatedSize * 0.7;
                const dotX = x + Math.cos(angle) * radius;
                const dotY = y + Math.sin(angle) * radius;
                drawPixelCircle(pixelData, dotX, dotY, 1, baseColor, 'solid');
              }
            }
          }
        });
    }

    // ### TENSION POINTS ###
    if (isHighlighted('Tension Points')) {
        const intensity = data.tension_planets?.length || 1;
        if (intensity > 0) {
            const glitchAreaSize = 20 + intensity * 5;
            const glitchHash = simpleHash(data.chiron_gate || '');
            const locationAngle = mapValue(glitchHash % 1000, 0, 1000, 0, Math.PI * 2);
            const locationRadius = PIXEL_RESOLUTION * 0.4;
            const glitchCenterX = center.x + Math.cos(locationAngle) * locationRadius;
            const glitchCenterY = center.y + Math.sin(locationAngle) * locationRadius;
            const glitchCount = Math.floor(intensity * 5 * (Math.sin(t * 50 * Math.PI) + 1));
            for (let i = 0; i < glitchCount; i++) {
                const x = glitchCenterX + (Math.random() - 0.5) * glitchAreaSize;
                const y = glitchCenterY + (Math.random() - 0.5) * glitchAreaSize;
                const c = (i % 2 === 0) ? THEME.accent : THEME.faint;
                const [r, g, b, a] = colorToRGBA(c);
                setPixel(pixelData, x, y, r, g, b, a);
            }
        }
    }

    // ### ENERGY FAMILY ###
    if (isHighlighted('Energy Family')) {
        const color = getColor('Energy Family');
        const alpha = isHighlighted('Energy Family') ? 1.0 : 0.3;
        const sunHash = simpleHash(data.astro_sun_sign || '');
        const coreRadius = 8;

        // House-based color for the main sun core
        const sunCoreColor = getHouseColorVariation(color, data.astro_sun_house || '1');
        drawPixelCircle(pixelData, center.x, center.y, coreRadius, sunCoreColor, 'solid');

        // Profile Line enhancements
        const profileLines = data.profile_lines || "1/3";
        const [consciousLine, unconsciousLine] = profileLines.split('/').map(Number);
        
        // Ray count based on profile lines (min 4, max 12)
        let rayCount = Math.max(4, Math.min(12, consciousLine + unconsciousLine));
        
        // Ray patterns based on profile_lines
        let mainRayDashPattern: [number, number] | undefined = undefined; // Solid by default
        let secondaryRayDashPattern: [number, number] | undefined = [2,2]; // Dashed for secondary rays

        if (profileLines === "1/3" || profileLines === "1/4") mainRayDashPattern = undefined;
        else if (profileLines === "2/4" || profileLines === "2/5") mainRayDashPattern = [4,1];
        else if (profileLines === "3/5" || profileLines === "3/6") mainRayDashPattern = [3,2];
        else if (profileLines === "4/6" || profileLines === "4/1") mainRayDashPattern = [2,3];
        else if (profileLines === "5/1" || profileLines === "5/2") mainRayDashPattern = [1,4];
        else if (profileLines === "6/2" || profileLines === "6/3") mainRayDashPattern = [5,2];

        const baseRayLength = PIXEL_RESOLUTION * 0.15;

        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + (sunHash % 1000 / 1000) * (Math.PI / 6);

          // Determine if this ray is a "primary" ray 
          const isPrimaryRay = i < rayCount;
          const currentDashPattern = isPrimaryRay ? mainRayDashPattern : secondaryRayDashPattern;
          
          // Ray length animation based on profile lines
          const lineInfluence = isPrimaryRay ? consciousLine : unconsciousLine;
          const dynamicLengthFactor = 0.7 + Math.sin(t * Math.PI * (1 + lineInfluence * 0.2) + i) * 0.3;
          const rayLength = baseRayLength * dynamicLengthFactor;

          const rayColorHex = getHouseColorVariation(color, data.astro_sun_house || '1', isPrimaryRay);

          const x1 = center.x + Math.cos(angle) * coreRadius;
          const y1 = center.y + Math.sin(angle) * coreRadius;
          const x2 = center.x + Math.cos(angle) * (coreRadius + rayLength);
          const y2 = center.y + Math.sin(angle) * (coreRadius + rayLength);
          
          drawPixelLine(pixelData, x1, y1, x2, y2, rayColorHex, currentDashPattern);
        }

        // North Node sign influence as an orbital ring
        const northNodeSign = data.astro_north_node_sign || "Aries";
        const northNodeHash = simpleHash(northNodeSign);
        const orbitalRadius = coreRadius + baseRayLength + 5 + (northNodeHash % 5);
        const orbitalColor = getHouseColorVariation(color, (northNodeHash % 12) + 1);

        // Orbital ring pattern based on North Node sign
        let orbitalDashPattern: [number, number] | undefined = undefined;
        if (['Aries', 'Leo', 'Sagittarius'].includes(northNodeSign)) orbitalDashPattern = [5,2];
        else if (['Taurus', 'Virgo', 'Capricorn'].includes(northNodeSign)) orbitalDashPattern = [3,3];
        else if (['Gemini', 'Libra', 'Aquarius'].includes(northNodeSign)) orbitalDashPattern = [2,2];
        else if (['Cancer', 'Scorpio', 'Pisces'].includes(northNodeSign)) orbitalDashPattern = [4,1];

        // Draw the orbital ring
        const segments = 36;
        for (let i = 0; i < segments; i++) {
           if (!orbitalDashPattern || (i % (orbitalDashPattern[0] + orbitalDashPattern[1])) < orbitalDashPattern[0]) {
               const angle1 = (i / segments) * Math.PI * 2;
               const angle2 = ((i + 0.5) / segments) * Math.PI * 2;
               const x1_orb = center.x + Math.cos(angle1) * orbitalRadius;
               const y1_orb = center.y + Math.sin(angle1) * orbitalRadius;
               const x2_orb = center.x + Math.cos(angle2) * orbitalRadius;
               const y2_orb = center.y + Math.sin(angle2) * orbitalRadius;
               drawPixelLine(pixelData, x1_orb, y1_orb, x2_orb, y2_orb, orbitalColor, undefined);
           }
        }
    }

    // ### DECISION GROWTH VECTOR ###
    if (isHighlighted('Decision Growth Vector')) {
        const color = getColor('Decision Growth Vector');
        const alpha = isHighlighted('Decision Growth Vector') ? 1.0 : 0.3;
        
        const marsSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        let marsSignIndex = marsSigns.indexOf(data.astro_mars_sign || 'Aries');
        if (marsSignIndex === -1) marsSignIndex = 0;

        const baseNeedleAngle = mapValue(marsSignIndex, 0, 11, 0, Math.PI * 2) + t * Math.PI * 0.5;
        const compassCenter = { x: center.x, y: center.y + PIXEL_RESOLUTION * 0.25 };
        const baseNeedleLength = PIXEL_RESOLUTION * 0.15;

        const strategy = data.strategy || "Generator";
        const authority = data.authority || "Emotional";
        const spectrum = data.choice_navigation_spectrum || "Balanced";
        const nnHouseValue = parseInt(String(data.north_node_house || '1').replace(/\D/g,''));

        // Draw North Node House Markers
        const markerRingRadius = baseNeedleLength + 15;
        for (let i = 1; i <= 12; i++) {
          const angle = ((i - 1) / 12) * Math.PI * 2 - (Math.PI / 2);
          const markerX = compassCenter.x + Math.cos(angle) * markerRingRadius;
          const markerY = compassCenter.y + Math.sin(angle) * markerRingRadius;
          const markerColor = (i === nnHouseValue) ? darkenColor(color, -0.3) : color;
          drawPixelCircle(pixelData, markerX, markerY, (i === nnHouseValue) ? 2 : 1, markerColor, 'solid');
        }

        // Authority-Specific Visual Elements (around compass)
        const authorityElementRadius = baseNeedleLength * 0.5;
        if (authority === 'Emotional') {
          for (let i = 0; i < 3; i++) {
            const waveY = compassCenter.y + (i - 1) * 5;
            for (let x = -10; x <= 10; x++) {
              setPixel(pixelData, compassCenter.x + x + Math.sin(x * 0.5 + t * Math.PI * 4) * 2, 
                        waveY + Math.cos(x*0.3 + t*Math.PI*2)*2, 
                        ...colorToRGBA(color));
            }
          }
        } else if (authority === 'Sacral') {
          const pulseSize = 2 + Math.sin(t * Math.PI * 8) * 1;
          drawPixelCircle(pixelData, compassCenter.x, compassCenter.y, pulseSize, color, 'dither');
        } else if (authority === 'Splenic') {
          for (let i=0; i<2; i++) {
            const x1_auth = compassCenter.x + (i%2==0? -authorityElementRadius : authorityElementRadius) + Math.sin(t*Math.PI*3 +i)*3;
            const y1_auth = compassCenter.y + Math.cos(t*Math.PI*2+i)*3;
            drawPixelLine(pixelData, x1_auth, y1_auth, x1_auth + (i%2==0? -3:3), y1_auth - 3, color);
            drawPixelLine(pixelData, x1_auth + (i%2==0? -3:3), y1_auth - 3, x1_auth + (i%2==0? 0:0), y1_auth, color);
          }
        } else if (authority === 'Heart/Ego' || authority === 'Ego') {
          const frameSize = baseNeedleLength * 0.3;
          drawPixelLine(pixelData, compassCenter.x - frameSize, compassCenter.y - frameSize, 
                         compassCenter.x + frameSize, compassCenter.y - frameSize, color);
          drawPixelLine(pixelData, compassCenter.x + frameSize, compassCenter.y - frameSize, 
                         compassCenter.x + frameSize, compassCenter.y + frameSize, color);
          drawPixelLine(pixelData, compassCenter.x + frameSize, compassCenter.y + frameSize, 
                         compassCenter.x - frameSize, compassCenter.y + frameSize, color);
          drawPixelLine(pixelData, compassCenter.x - frameSize, compassCenter.y + frameSize, 
                         compassCenter.x - frameSize, compassCenter.y - frameSize, color);
        } else if (authority === 'G-Center' || authority === 'Self-Projected') {
           let spiralRadius = 1;
           let lastSpiralX = compassCenter.x;
           let lastSpiralY = compassCenter.y;
           for(let i=0; i < 20; i++){
               const angle = 0.1 * i * Math.PI + t*Math.PI;
               const x_ = compassCenter.x + Math.cos(angle) * spiralRadius;
               const y_ = compassCenter.y + Math.sin(angle) * spiralRadius;
               if(i>0) drawPixelLine(pixelData, lastSpiralX, lastSpiralY, x_, y_, color);
               lastSpiralX = x_;
               lastSpiralY = y_;
               spiralRadius += 0.5;
               if(spiralRadius > authorityElementRadius) break;
           }
        } else if (authority === 'Mental' || authority === 'Lunar') {
           for(let i=0; i<5; i++){
               const angle = (i/5)*Math.PI*2 + t*Math.PI;
               drawPixelLine(pixelData, compassCenter.x, compassCenter.y, 
                            compassCenter.x + Math.cos(angle)*authorityElementRadius, 
                            compassCenter.y + Math.sin(angle)*authorityElementRadius, 
                            color, [1,2]);
           }
        }

        // Strategy-Specific Compass Needle
        let finalNeedleAngle = baseNeedleAngle;
        let needleLength = baseNeedleLength;
        let needleColor = color;
        let needleDash: [number, number] | undefined = undefined;
        let tipRadius = 2;

        if (spectrum === 'Fluid') needleDash = [2,3];
        else if (spectrum === 'Structured') tipRadius = 3;

        if (strategy === 'Generator' || strategy === 'To Respond') {
          const auraOffset = 2;
          const endX = compassCenter.x + Math.cos(finalNeedleAngle) * needleLength;
          const endY = compassCenter.y + Math.sin(finalNeedleAngle) * needleLength;
          drawPixelLine(pixelData, compassCenter.x + Math.sin(finalNeedleAngle) * auraOffset, 
                        compassCenter.y - Math.cos(finalNeedleAngle) * auraOffset, 
                        endX + Math.sin(finalNeedleAngle) * auraOffset, 
                        endY - Math.cos(finalNeedleAngle) * auraOffset, 
                        needleColor, needleDash);
          drawPixelLine(pixelData, compassCenter.x - Math.sin(finalNeedleAngle) * auraOffset, 
                        compassCenter.y + Math.cos(finalNeedleAngle) * auraOffset, 
                        endX - Math.sin(finalNeedleAngle) * auraOffset, 
                        endY + Math.cos(finalNeedleAngle) * auraOffset, 
                        needleColor, needleDash);
        } else if (strategy === 'Projector' || strategy === 'To Wait for Invitation') {
          if (Math.floor(t * 10) % 2 === 0) {
            needleColor = darkenColor(needleColor, 0.3);
          }
          const beamLength = needleLength * 0.5;
          const beamX = compassCenter.x + Math.cos(finalNeedleAngle) * (needleLength + beamLength);
          const beamY = compassCenter.y + Math.sin(finalNeedleAngle) * (needleLength + beamLength);
          drawPixelLine(pixelData, compassCenter.x + Math.cos(finalNeedleAngle) * needleLength, 
                        compassCenter.y + Math.sin(finalNeedleAngle) * needleLength, 
                        beamX, beamY, needleColor, [1,1]);
        } else if (strategy === 'Manifestor' || strategy === 'To Inform') {
          tipRadius = 3;
          for (let i=1; i<=2; i++) {
            const waveRadius = i * 5 + (t*10 % 5);
            if (waveRadius < baseNeedleLength * 0.4) {
               drawPixelCircle(pixelData, compassCenter.x, compassCenter.y, 
                              waveRadius, needleColor);
            }
          }
        } else if (strategy === 'Reflector' || strategy === 'To Wait a Lunar Cycle') {
          finalNeedleAngle = t * Math.PI * 2; // Continuous spinning
          needleDash = [3,3];
        }

        const needleEndX = compassCenter.x + Math.cos(finalNeedleAngle) * needleLength;
        const needleEndY = compassCenter.y + Math.sin(finalNeedleAngle) * needleLength;
        drawPixelLine(pixelData, compassCenter.x, compassCenter.y, needleEndX, needleEndY, needleColor, needleDash);
        drawPixelCircle(pixelData, needleEndX, needleEndY, tipRadius, needleColor, 'solid');
    }

    // ### DRIVE MECHANICS ###
    if (isHighlighted('Drive Mechanics')) {
        particles.forEach(p => {
            switch (data.kinetic_drive_spectrum) {
                case 'Fluid Stream':
                    p.position.x += p.velocity.x;
                    p.position.y += p.velocity.y + 0.2;
                    if (p.position.y > PIXEL_RESOLUTION) p.position.y = 0;
                    if (p.position.x > PIXEL_RESOLUTION) p.position.x = 0;
                    if (p.position.x < 0) p.position.x = PIXEL_RESOLUTION;
                    break;
                case 'Structured Orbit':
                    const angle = Math.atan2(p.initialPosition.y - center.y, p.initialPosition.x - center.x) + t * Math.PI * 0.5;
                    const radius = Math.sqrt(Math.pow(p.initialPosition.x - center.x, 2) + Math.pow(p.initialPosition.y - center.y, 2));
                    p.position.x = center.x + Math.cos(angle) * radius;
                    p.position.y = center.y + Math.sin(angle) * radius;
                    break;
                case 'Balanced Grid':
                default:
                    p.position.x += p.velocity.x;
                    p.position.y += p.velocity.y;
                    const areaWidth = mapValue(parseInt((data.resonance_field_spectrum || "50x50").split('x')[0]), 0, 100, PIXEL_RESOLUTION * 0.2, PIXEL_RESOLUTION * 0.9);
                    const startX = center.x - areaWidth / 2;
                    if (p.position.x < startX || p.position.x > startX + areaWidth) p.velocity.x *= -1;
                    const areaHeight = mapValue(parseInt((data.resonance_field_spectrum || "50x50").split('x')[1]), 0, 100, PIXEL_RESOLUTION * 0.2, PIXEL_RESOLUTION * 0.9);
                    const startY = center.y - areaHeight / 2;
                    if (p.position.y < startY || p.position.y > startY + areaHeight) p.velocity.y *= -1;
                    break;
            }
            const [r, g, b, a] = colorToRGBA(p.color);
            setPixel(pixelData, p.position.x, p.position.y, r, g, b, a);
        });
    }

    // ### MANIFESTATION INTERFACE RHYTHM ###
    if (isHighlighted('Manifestation Interface Rhythm')) {
        const color = getColor('Manifestation Interface Rhythm');
        const alpha = isHighlighted('Manifestation Interface Rhythm') ? 1.0 : 0.3;
        const throatDefinition = data.throat_definition || "Undefined";
        const rhythmSpectrum = data.manifestation_rhythm_spectrum || "Variable";
        const patternSizeBase = 15;
        const throatY = center.y - PIXEL_RESOLUTION * 0.30; // Position higher up

        let patternAlpha = 1.0;
        if (throatDefinition === 'Undefined') {
          patternAlpha *= 0.7; // Fainter if undefined
        }

        // --- Manifestation Rhythm Spectrum Pattern ---
        if (rhythmSpectrum === 'Consistent' || rhythmSpectrum === 'Structured') {
           const patternSize = patternSizeBase * (throatDefinition === 'Defined' ? 1.2 : 0.8);
           for (let x = -patternSize; x <= patternSize; x += (throatDefinition === 'Defined' ? 3:4)) {
             for (let y = -patternSize/2; y <= patternSize/2; y += (throatDefinition === 'Defined' ? 3:4)) {
               setPixel(pixelData, center.x + x, throatY + y, ...colorToRGBA(color));
             }
           }
        } else if (rhythmSpectrum === 'Variable' || rhythmSpectrum === 'Fluid') { // Wave pattern
           const patternSize = patternSizeBase * (throatDefinition === 'Defined' ? 1.3 : 0.9);
           for (let x = -patternSize; x <= patternSize; x++) {
             const waveY = Math.sin((x + t * (throatDefinition === 'Defined' ? 10:20)) * 0.3) * (throatDefinition === 'Defined' ? 6:4);
             setPixel(pixelData, center.x + x, throatY + waveY, ...colorToRGBA(color));
           }
        } else { // Balanced/other - scatter pattern
           const patternSize = patternSizeBase;
           const scatterCount = throatDefinition === 'Defined' ? 25 : 15;
           for (let i = 0; i < scatterCount; i++) {
             const scatterX = center.x + (Math.random() - 0.5) * patternSize * 2.5;
             const scatterY = throatY + (Math.random() - 0.5) * patternSize * 1.5;
             if (Math.random() > (throatDefinition === 'Defined' ? 0.3:0.5)) {
               setPixel(pixelData, scatterX, scatterY, ...colorToRGBA(color, patternAlpha * (0.5 + Math.random()*0.5)));
             }
           }
        }

        // --- Throat Gates Visualization ---
        const activeGates = parseGateChannelString(data.throat_gates);
        const gateRadius = patternSizeBase * 2.5; // Place gates around the main pattern
        activeGates.forEach((gateNum, index) => {
          const angle = (index / activeGates.length) * Math.PI * 2 - Math.PI / 2; // Start from top
          const gateX = center.x + Math.cos(angle) * gateRadius;
          const gateY = throatY + Math.sin(angle) * gateRadius; // Relative to throatY

          const isMotor = MOTOR_GATES.has(gateNum);
          const gateColor = isMotor ? (THEME.highlight || '#D8A8A8') : color;

          drawPixelCircle(pixelData, gateX, gateY, isMotor ? 2:1.5, gateColor, 'solid');
          if (isMotor) drawPixelCircle(pixelData, gateX, gateY, 0.5, color, 'solid'); // Inner dot for motor
        });

        // --- Throat Channels Visualization (Simplified) ---
        const activeChannels = parseGateChannelString(data.throat_channels); // Using same parser
        const channelOuterRadius = gateRadius + 10 + activeChannels.length * 0.5; // Extend beyond gates
        activeChannels.forEach((channelRepresentation, index) => {
          const angle = (index / activeChannels.length) * Math.PI * 2 + Math.PI / activeChannels.length;
          const startX = center.x + Math.cos(angle) * (gateRadius - 5);
          const startY = throatY + Math.sin(angle) * (gateRadius - 5);
          const endX = center.x + Math.cos(angle) * channelOuterRadius;
          const endY = throatY + Math.sin(angle) * channelOuterRadius;

          const channelHash = simpleHash(String(channelRepresentation));
          const channelDash: [number,number] | undefined = 
            channelHash % 3 === 0 ? undefined : 
                                   (channelHash % 3 === 1 ? [2,2] as [number, number] : [3,1] as [number, number]);
          const channelColor = channelHash % 2 === 0 ? color : darkenColor(color, 0.15);

          drawPixelLine(pixelData, startX, startY, endX, endY, channelColor, channelDash);
        });
    }

    // ### ENERGY CLASS (AURA) ADVANCED VISUALS ###
    const renderEnergyClassAura = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      energyClass: string,
      element: 'Fire' | 'Earth' | 'Air' | 'Water' | 'Unknown',
      planet: string,
      options: { crossPattern?: boolean; quarterMarkers?: boolean; planetSymbol?: boolean } = {}
    ) => {
      // Elemental aura pattern
      ctx.save();
      let auraColor = '#CCCCCC';
      switch (element) {
        case 'Fire': auraColor = '#FFB347'; break;
        case 'Earth': auraColor = '#A3D977'; break;
        case 'Air': auraColor = '#A7D3F7'; break;
        case 'Water': auraColor = '#7FC7FF'; break;
        default: auraColor = '#CCCCCC';
      }
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = auraColor;
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      ctx.restore();

      // Cross pattern (if enabled)
      if (options.crossPattern) {
        ctx.save();
        ctx.strokeStyle = darkenColor(auraColor, 0.3);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.stroke();
        ctx.restore();
      }

      // Quarter markers (if enabled)
      if (options.quarterMarkers) {
        ctx.save();
        ctx.strokeStyle = darkenColor(auraColor, 0.5);
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * 0.92, angle - 0.08, angle + 0.08);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Planet symbol (if enabled)
      if (options.planetSymbol) {
        ctx.save();
        ctx.font = `${Math.floor(radius * 0.25)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = darkenColor(auraColor, 0.4);
        ctx.globalAlpha = 0.7;
        ctx.fillText(getPlanetSymbol(planet), centerX, centerY - radius * 0.6);
        ctx.globalAlpha = 1.0;
        ctx.restore();
      }
    };

    // Helper to get unicode/emoji for planet symbol
    const getPlanetSymbol = (planet: string): string => {
      switch (planet.toLowerCase()) {
        case 'sun': return '☉';
        case 'moon': return '☽';
        case 'mercury': return '☿';
        case 'venus': return '♀';
        case 'mars': return '♂';
        case 'jupiter': return '♃';
        case 'saturn': return '♄';
        case 'uranus': return '♅';
        case 'neptune': return '♆';
        case 'pluto': return '♇';
        default: return '✶';
      }
    };

    const skData = Skia.Data.fromBytes(pixelData);
    return Skia.Image.MakeImage(
      {
        width: PIXEL_RESOLUTION,
        height: PIXEL_RESOLUTION,
        colorType: ColorType.RGBA_8888,
        alphaType: AlphaType.Premul
      },
      skData,
      PIXEL_RESOLUTION * 4
    );
  }, [data, highlightedCategory, animationTime, particles]);

  if (!data) {
    return <View style={[styles.container, { width, height }]} />;
  }

  return (
    <Canvas style={{ width, height }}>
      <Rect x={0} y={0} width={width} height={height} color={THEME.background} />
      {dynamicBitmapImage && (
        <Image
          image={dynamicBitmapImage}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="contain"
          sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }}
        />
      )}
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.background,
  },
});

export default BlueprintCanvas;