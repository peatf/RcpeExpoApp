import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';

interface BlueprintCanvasProps {
  data: any;
  highlightedCategory: string | null;
  width: number;
  height: number;
  onCanvasReady?: () => void;
}

const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({
  data, 
  highlightedCategory, 
  width, 
  height,
  onCanvasReady
}) => {
  const canvasRef = useRef<Canvas | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Constants similar to your web implementation
  const THEME = {
    background: '#F8F4E9',
    primary: '#212121',
    accent: '#BFBFBF',
    faint: '#EAE6DA'
  };

  useEffect(() => {
    if (!data) return;

    // Handle canvas setup
    const handleCanvas = (canvas: Canvas | null) => {
      if (!canvas) return;
      canvasRef.current = canvas;
      canvas.width = width;
      canvas.height = height;
      
      // Get canvas context
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Note: imageSmoothingEnabled may not be available in react-native-canvas
        // @ts-ignore - Suppress TypeScript error for this property
        if ('imageSmoothingEnabled' in ctx) {
          (ctx as any).imageSmoothingEnabled = false;
        }
        ctxRef.current = ctx;
        if (onCanvasReady) onCanvasReady();
        
        // Start animation
        startAnimation();
      }
    };

    const startAnimation = () => {
      animate();
    };
    
    // All your drawing functions would be implemented here
    // Converting from your web implementation
    // For example:
    
    const drawPixel = (x: number, y: number, color?: string) => {
      if (!ctxRef.current) return;
      ctxRef.current.fillStyle = color || THEME.primary;
      ctxRef.current.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    };
    
    const drawPixelLine = (x1: number, y1: number, x2: number, y2: number, color?: string, dash?: number[]) => {
      // Implementation similar to your web version
      x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2);
      const dx = Math.abs(x2 - x1); const sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1); const sy = y1 < y2 ? 1 : -1;
      let err = dx + dy, e2, dashCount = 0;
      
      while (true) {
        if (!dash || (dashCount++ % (dash[0] + dash[1])) < dash[0]) {
          drawPixel(x1, y1, color);
        }
        if (x1 === x2 && y1 === y2) break;
        e2 = 2 * err;
        if (e2 >= dy) { err += dy; x1 += sx; }
        if (e2 <= dx) { err += dx; y1 += sy; }
      }
    };
    
    // Add other drawing functions: drawPixelCircle, drawEnergyArchitecture, etc.
    // These would be direct translations from your web code

    // Animation loop
    let time = 0;
    let animationFrameId: number;
    
    const animate = () => {
      if (!ctxRef.current) return;
      
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01; // Simplified from your implementation
      
      // Clear canvas
      ctxRef.current.fillStyle = THEME.background;
      ctxRef.current.fillRect(0, 0, width, height);
      
      // Call drawing functions here
      // drawEnergyArchitecture(data);
      // drawDriveMechanics(data);
      // etc...
      
      // Draw some basic content for now
      ctxRef.current.fillStyle = THEME.primary;
      ctxRef.current.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);
    };
    
    handleCanvas(canvasRef.current);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [data, highlightedCategory, width, height]);

  if (!data) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.placeholder}>Generate New Blueprint</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas ref={canvasRef} style={{ width, height }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F4E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#BFBFBF',
  }
});

export default BlueprintCanvas;