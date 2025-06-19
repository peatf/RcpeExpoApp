import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { 
  Canvas, 
  Skia, 
  vec,
  Group,
  Paint,
  Rect,
  Circle,
  Line,
  Image,
  ColorType,
  AlphaType,
  ImageSVG,
  FilterMode,
  MipmapMode
} from '@shopify/react-native-skia';
import { VisualizationData } from '../../services/blueprintVisualizerService';

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
  ditherPattern: number;
}

// ### CONSTANTS AND THEME ###
const THEME = {
  background: '#F8F4E9',
  primary: '#212121',
  accent: '#BFBFBF',
  faint: '#EAE6DA',
};

const PIXEL_RESOLUTION = 250;
const center = { x: PIXEL_RESOLUTION / 2, y: PIXEL_RESOLUTION / 2 };

// ### PIXEL ART HELPER FUNCTIONS ###
// These functions draw to a pixel buffer that will be used to create a bitmap
const setPixel = (
  pixelData: Uint8Array,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number = 255
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

// Convert a color string (hex) to RGBA components
const colorToRGBA = (color: string): [number, number, number, number] => {
  const hex = color.startsWith('#') ? color.substring(1) : color;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b, 255];
};

// Draw a pixel line between two points with optional dash pattern
const drawPixelLine = (
  pixelData: Uint8Array,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  dash?: [number, number]
) => {
  const [r, g, b, a] = colorToRGBA(color);
  
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

// Draw a pixel circle with various fill patterns
const drawPixelCircle = (
  pixelData: Uint8Array,
  cx: number, cy: number,
  radius: number,
  color: string,
  fillPattern: 'solid' | 'dither' | 'none' = 'none'
) => {
  const [r, g, b, a] = colorToRGBA(color);
  cx = Math.floor(cx);
  cy = Math.floor(cy);
  radius = Math.floor(radius);
  
  if (fillPattern !== 'none') {
    // Fill the circle
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
    // Draw just the outline using Bresenham's circle algorithm
    let x = radius, y = 0, err = 0;
    while (x >= y) {
      setPixel(pixelData, cx + x, cy + y, r, g, b, a);
      setPixel(pixelData, cx + y, cy + x, r, g, b, a);
      setPixel(pixelData, cx - y, cy + x, r, g, b, a);
      setPixel(pixelData, cx - x, cy + y, r, g, b, a);
      setPixel(pixelData, cx - x, cy - y, r, g, b, a);
      setPixel(pixelData, cx - y, cy - x, r, g, b, a);
      setPixel(pixelData, cx + y, cy - x, r, g, b, a);
      setPixel(pixelData, cx + x, cy - y, r, g, b, a);
      y += 1;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) {
        x -= 1;
        err += 1 - 2 * x;
      }
    }
  }
};

// ### CORE COMPONENT ###
const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ data, highlightedCategory, width, height, onCanvasReady }) => {
  // Use state for animation timing
  const [animationTime, setAnimationTime] = useState(0);
  
  // Update animation time in animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((Date.now() / 30000) % 1); // Normalize to 0-1 over 30 seconds
    }, 1000 / 60); // 60fps
    return () => clearInterval(interval);
  }, []);
  
  // Create paints for drawing - with safety checks for Skia availability
  const backgroundPaint = useMemo(() => {
    if (!Skia?.Paint || !Skia?.Color) return null;
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(THEME.background));
    return paint;
  }, []);
  
  const primaryPaint = useMemo(() => {
    if (!Skia?.Paint || !Skia?.Color) return null;
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(THEME.primary));
    return paint;
  }, []);
  
  const accentPaint = useMemo(() => {
    if (!Skia?.Paint || !Skia?.Color) return null;
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(THEME.accent));
    return paint;
  }, []);
  
  const faintPaint = useMemo(() => {
    if (!Skia?.Paint || !Skia?.Color) return null;
    const paint = Skia.Paint();
    paint.setColor(Skia.Color(THEME.faint));
    return paint;
  }, []);

  // ### HELPER FUNCTIONS ###
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

  // Create a bitmap with the static/background pixel art elements
  const staticBitmapImage = useMemo(() => {
    if (!data || !Skia?.Data || !Skia?.Image) return null;

    // Create a new pixel data array (RGBA format)
    const pixelData = new Uint8Array(PIXEL_RESOLUTION * PIXEL_RESOLUTION * 4);
    
    // Fill with background color
    const [bgR, bgG, bgB] = colorToRGBA(THEME.background);
    for (let i = 0; i < pixelData.length; i += 4) {
      pixelData[i] = bgR;
      pixelData[i + 1] = bgG;
      pixelData[i + 2] = bgB;
      pixelData[i + 3] = 255; // Full opacity
    }
    
    const isHighlighted = !highlightedCategory;
    const mainColor = isHighlighted ? THEME.primary : THEME.faint;
    
    // Draw energy architecture (concentric circles)
    const numLayers = { 'Single': 5, 'Split': 4, 'Triple Split': 3, 'Quadruple Split': 2, 'No Definition': 6 }[data.definition_type] || 4;
    const maxRadius = PIXEL_RESOLUTION * 0.45;
    const splitBridgeCount = data.split_bridges?.length || 0;
    const hash = simpleHash(data.definition_type + data.channel_list);

    for (let i = 0; i < numLayers; i++) {
      const radius = (maxRadius / numLayers) * (i + 1);
      const isSplit = data.definition_type.includes('Split') && i === Math.floor(numLayers / 2);
      
      // Draw pixelated circle with a gap for splits
      const breakAngle = mapValue(hash % 1000, 0, 1000, 0, Math.PI * 2);
      const breakSize = isSplit ? Math.PI / 4 : 0;
      
      drawPixelCircle(pixelData, center.x, center.y, radius, mainColor);
      
      // Add split bridges
      if (isSplit && splitBridgeCount > 0) {
        const bridgeLength = (maxRadius / numLayers);
        const x1 = center.x + Math.cos(breakAngle) * radius;
        const y1 = center.y + Math.sin(breakAngle) * radius;
        const x2 = center.x + Math.cos(breakAngle) * (radius + bridgeLength);
        const y2 = center.y + Math.sin(breakAngle) * (radius + bridgeLength);
        drawPixelLine(pixelData, x1, y1, x2, y2, THEME.faint, [2,2]);
      }
    }
    
    // Convert Uint8Array to SkImage using Skia v2 API
    const skData = Skia.Data.fromBytes(pixelData);
    return Skia.Image.MakeImage(
      {
        width: PIXEL_RESOLUTION,
        height: PIXEL_RESOLUTION,
        colorType: ColorType.RGBA_8888,
        alphaType: AlphaType.Premul // Using Premultiplied alpha
      },
      skData,
      PIXEL_RESOLUTION * 4 // rowBytes
    );
  }, [data, highlightedCategory]);
  
  // Create a bitmap for dynamic animated elements - recalculated every frame
  const dynamicBitmapImage = useMemo(() => {
    if (!data || !Skia?.Data || !Skia?.Image) return null;
    const t = animationTime; // Get current animation time
    
    // Create a new pixel data array (RGBA format)
    const pixelData = new Uint8Array(PIXEL_RESOLUTION * PIXEL_RESOLUTION * 4);
    // Start with transparent pixels
    pixelData.fill(0);
    
    const isHighlighted = !highlightedCategory;
    
    // Draw evolutionary path (spiral)
    if (isHighlighted || highlightedCategory === 'Evolutionary Path') {
      const pathColor = isHighlighted ? THEME.primary : THEME.accent;
      const pathHash = simpleHash(data.incarnation_cross);
      const pathLength = 50;
      const startRadius = PIXEL_RESOLUTION * 0.1;
      const endRadius = PIXEL_RESOLUTION * 0.4;
      const startAngle = mapValue(pathHash % 1000, 0, 1000, 0, Math.PI * 2);
      
      // Integrate G-center access and core priorities
      const lineStyle = data.g_center_access === 'Consistent' ? undefined : 
                        (data.g_center_access === 'Projected' ? [3,2] as [number, number] : 
                                                               [1,3] as [number, number]);
      const priorityCount = data.core_priorities?.length || 0;
      
      let lastX = center.x + Math.cos(startAngle) * startRadius;
      let lastY = center.y + Math.sin(startAngle) * startRadius;

      for (let i = 1; i <= pathLength; i++) {
        const progress = i / pathLength;
        const radius = startRadius + progress * (endRadius - startRadius);
        const angle = startAngle + progress * 
          (parseInt(data.conscious_line || '0') + parseInt(data.unconscious_line || '0')) + 
          Math.sin(t * Math.PI * 2) * 0.1;
        
        const currentX = center.x + Math.cos(angle) * radius;
        const currentY = center.y + Math.sin(angle) * radius;
        
        drawPixelLine(pixelData, lastX, lastY, currentX, currentY, pathColor, lineStyle);
        lastX = currentX;
        lastY = currentY;
        
        // Draw glyphs for core priorities along the path
        if (priorityCount > 0 && i % Math.floor(pathLength / priorityCount) === 0) {
          drawPixelCircle(pixelData, currentX, currentY, 2, pathColor, 'dither');
        }
      }
    }
    
    // Draw Processing Core
    if (isHighlighted || highlightedCategory === 'Processing Core') {
      const processingColor = isHighlighted ? THEME.primary : THEME.accent;
      const radius = PIXEL_RESOLUTION * 0.2;
      const centers = [data.head_state, data.ajna_state, data.emotional_state];
      
      centers.forEach((state, i) => {
        const angle = (i / centers.length) * Math.PI * 2 + t * Math.PI * (i % 2 === 0 ? 1 : -1);
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        const size = 3;
        const hash = simpleHash(data.cognition_variable);
        
        // Draw glyph based on cognition variable
        switch (hash % 3) {
          case 0: // Cross
            drawPixelLine(pixelData, x - size, y, x + size, y, processingColor);
            drawPixelLine(pixelData, x, y - size, x, y + size, processingColor);
            break;
          case 1: // Square
            drawPixelLine(pixelData, x - size, y - size, x + size, y - size, processingColor);
            drawPixelLine(pixelData, x + size, y - size, x + size, y + size, processingColor);
            drawPixelLine(pixelData, x + size, y + size, x - size, y + size, processingColor);
            drawPixelLine(pixelData, x - size, y + size, x - size, y - size, processingColor);
            break;
          case 2: // Triangle
            drawPixelLine(pixelData, x, y - size, x + size, y + size, processingColor);
            drawPixelLine(pixelData, x + size, y + size, x - size, y + size, processingColor);
            drawPixelLine(pixelData, x - size, y + size, x, y - size, processingColor);
            break;
        }
        
        // Visual distinction for open/undefined state
        if (state === 'Open') {
          drawPixelCircle(pixelData, x, y, 2, THEME.background, 'solid');
        } else if (state === 'Undefined') {
          drawPixelCircle(pixelData, x, y, 1, processingColor);
        }
      });
    }
    
    // Draw Tension Points
    if (isHighlighted || highlightedCategory === 'Tension Points') {
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
          const color = (i % 2 === 0) ? THEME.accent : THEME.faint;
          const [r, g, b, a] = colorToRGBA(color);
          setPixel(pixelData, x, y, r, g, b, a);
        }
      }
    }
    
    // Convert Uint8Array to an image using Skia v2 API
    const skData = Skia.Data.fromBytes(pixelData);
    return Skia.Image.MakeImage(
      {
        width: PIXEL_RESOLUTION,
        height: PIXEL_RESOLUTION,
        colorType: ColorType.RGBA_8888,
        alphaType: AlphaType.Premul
      },
      skData,
      PIXEL_RESOLUTION * 4 // rowBytes
    );
  }, [data, highlightedCategory, animationTime]);
  
  // ### DATA-DRIVEN PARTICLE CREATION ###
  const particles = useMemo(() => {
    if (!data) return [];
    
    const hash = simpleHash(data.motivation_color + data.perspective_variable);
    const particleCountMap = { 'Fluid': 150, 'Balanced': 100, 'Structured': 50 };
    const particleCount = particleCountMap[data.kinetic_drive_spectrum as keyof typeof particleCountMap] || 100;
    const radiusMap = { 'Narrow': 0.15, 'Focused': 0.3, 'Wide': 0.45 };
    const maxRadius = PIXEL_RESOLUTION * (radiusMap[data.resonance_field_spectrum as keyof typeof radiusMap] || 0.3);
    
    // Integrate Venus sign for directional bias
    const venusSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const venusAngle = mapValue(venusSigns.indexOf(data.venus_sign), 0, 11, 0, Math.PI * 2);
    const venusDriftX = Math.cos(venusAngle) * 0.05;
    const venusDriftY = Math.sin(venusAngle) * 0.05;

    // Integrate Heart/Root states for color and pattern
    const colorStateMap: { [key: string]: string } = { 
      'Defined': THEME.primary, 
      'Undefined': THEME.accent, 
      'Open': THEME.faint 
    };
    const particleColor = colorStateMap[data.heart_state as keyof typeof colorStateMap] || THEME.accent;
    const ditherMap = { 'Defined': 1, 'Undefined': 2, 'Open': 3 };
    const ditherPattern = ditherMap[data.root_state as keyof typeof ditherMap] || 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 1.5) * maxRadius;
      const position = { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
      const speed = (hash % 100 / 100 - 0.5) * 0.5 + Math.random() * 0.2;
      const velocity = { 
        x: Math.cos(angle) * speed + venusDriftX, 
        y: Math.sin(angle) * speed + venusDriftY 
      };
      
      newParticles.push({
        position,
        velocity,
        baseRadius: radius,
        color: particleColor,
        ditherPattern
      });
    }
    return newParticles;
  }, [data]);

  // Simplified draw function using Skia v2 declarative components
  const renderVisualization = () => {
    if (!data || !backgroundPaint || !primaryPaint || !accentPaint || !faintPaint) return null;
    
    const t = animationTime; // Use animation time from state
    const isHighlighted = !highlightedCategory;
    const paint = isHighlighted ? primaryPaint : accentPaint;
    
    // Call onCanvasReady when component mounts
    React.useEffect(() => {
      if (onCanvasReady) {
        onCanvasReady();
      }
    }, []);

    return (
      <Group>
        {/* Background */}
        <Rect x={0} y={0} width={PIXEL_RESOLUTION} height={PIXEL_RESOLUTION} paint={backgroundPaint} />
        
        {/* Static Bitmap containing background elements */}
        {staticBitmapImage && (
          <Image 
            image={staticBitmapImage} 
            x={0} 
            y={0} 
            width={PIXEL_RESOLUTION} 
            height={PIXEL_RESOLUTION}
            fit="cover"
            sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }} // Crisp pixel art rendering
          />
        )}
        
        {/* Dynamic Bitmap containing animated elements */}
        {dynamicBitmapImage && (
          <Image 
            image={dynamicBitmapImage} 
            x={0} 
            y={0} 
            width={PIXEL_RESOLUTION} 
            height={PIXEL_RESOLUTION}
            fit="cover"
            sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }} // Crisp pixel art rendering
          />
        )}
        
        {/* Evolutionary Path - Spiral */}
        {Array.from({ length: 20 }, (_, i) => {
          const progress = i / 20;
          const angle = progress * Math.PI * 4 + t * Math.PI * 2;
          const radius = 20 + progress * 80;
          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;
          
          return (
            <Circle
              key={`spiral-${i}`}
              cx={x}
              cy={y}
              r={2}
              color={isHighlighted ? THEME.primary : THEME.accent}
            />
          );
        })}
        
        {/* Particles for Drive Mechanics */}
        {particles.map((particle, index) => {
          // Simple particle animation
          let newX = particle.position.x;
          let newY = particle.position.y;
          
          if (data.root_state === 'Defined') {
            // Circular motion
            const angle = Math.atan2(particle.position.y - center.y, particle.position.x - center.x);
            const newAngle = angle + t * Math.PI * 2;
            newX = center.x + Math.cos(newAngle) * particle.baseRadius;
            newY = center.y + Math.sin(newAngle) * particle.baseRadius;
          } else if (data.root_state === 'Undefined') {
            // Add some movement
            newX += Math.sin(t * Math.PI * 4 + index) * 2;
            newY += Math.cos(t * Math.PI * 4 + index) * 2;
          }
          
          // Only render every nth particle based on dither pattern
          if (index % particle.ditherPattern === 0) {
            return (
              <Circle
                key={`particle-${index}`}
                cx={newX}
                cy={newY}
                r={1}
                color={isHighlighted ? particle.color : THEME.faint}
              />
            );
          }
          return null;
        })}
        
        {/* Decision Growth Vector - Compass needle */}
        {(() => {
          const marsSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
          let targetAngle = mapValue(marsSigns.indexOf(data.astro_mars_sign), 0, 11, 0, Math.PI * 2);
          targetAngle += t * Math.PI * 4; // Slow rotation
          
          const needleLength = PIXEL_RESOLUTION * 0.3;
          const endX = center.x + Math.cos(targetAngle) * needleLength;
          const endY = center.y + Math.sin(targetAngle) * needleLength;
          
          return (
            <Group key="compass">
              <Line
                p1={vec(center.x, center.y)}
                p2={vec(endX, endY)}
                strokeWidth={2}
                color={isHighlighted ? THEME.primary : THEME.accent}
              />
              <Circle
                cx={endX}
                cy={endY}
                r={3}
                color={isHighlighted ? THEME.primary : THEME.accent}
              />
            </Group>
          );
        })()}
      </Group>
    );
  };

  if (!data) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.placeholder}>Click "Generate New Blueprint"</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={styles.canvas}>
        <Group transform={[{ scale: width / PIXEL_RESOLUTION }]}>
          {renderVisualization()}
        </Group>
      </Canvas>
    </View>
  );
};
// ### STYLES ###
const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: THEME.accent,
    textAlign: 'center',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default BlueprintCanvas;