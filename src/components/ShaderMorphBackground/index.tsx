import { useEffect, useState, useRef, useCallback } from 'react';

interface ShaderMorphBackgroundProps {
  className?: string;
  colorTheme?: 'ocean' | 'sunset' | 'forest' | 'cosmic';
}

export default function ShaderMorphBackground({ 
  className = "",
  colorTheme = 'ocean'
}: ShaderMorphBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);

  // Optimization: Use lower resolution canvas for performance
  const CANVAS_SCALE = 0.35; // Render at 35% resolution, scale up with CSS
  const TARGET_FPS = 60;
  const FRAME_TIME = 1000 / TARGET_FPS;
  let lastFrameTime = 0;

  // Pre-calculate sine lookup table for performance
  const SINE_TABLE_SIZE = 2048;
  const sineTable = useRef<number[]>([]);
  
  useEffect(() => {
    // Pre-calculate sine values
    sineTable.current = new Array(SINE_TABLE_SIZE);
    for (let i = 0; i < SINE_TABLE_SIZE; i++) {
      sineTable.current[i] = Math.sin((i / SINE_TABLE_SIZE) * Math.PI * 2);
    }
  }, []);

  // Fast sine lookup function
  const fastSin = useCallback((x: number) => {
    const index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * SINE_TABLE_SIZE) & (SINE_TABLE_SIZE - 1);
    return sineTable.current[index] || 0;
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      // Throttle to target FPS for consistency
      if (timestamp - lastFrameTime >= FRAME_TIME) {
        const elapsed = (timestamp - startTimeRef.current) * 0.001;
        setCurrentTime(elapsed);
        lastFrameTime = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Define color themes with pre-calculated RGB values
  const themes = {
    ocean: {
      colors: [
        { r: 0, g: 26, b: 77 },      // #001a4d
        { r: 0, g: 102, b: 204 },    // #0066cc
        { r: 0, g: 153, b: 255 },    // #0099ff
        { r: 102, g: 204, b: 255 }   // #66ccff
      ]
    },
    sunset: {
      colors: [
        { r: 102, g: 0, b: 0 },      // #660000
        { r: 204, g: 51, b: 0 },     // #cc3300
        { r: 255, g: 102, b: 0 },    // #ff6600
        { r: 255, g: 204, b: 0 }     // #ffcc00
      ]
    },
    forest: {
      colors: [
        { r: 0, g: 51, b: 0 },       // #003300
        { r: 0, g: 102, b: 0 },      // #006600
        { r: 0, g: 153, b: 0 },      // #009900
        { r: 102, g: 204, b: 102 }   // #66cc66
      ]
    },
    cosmic: {
      colors: [
        { r: 51, g: 0, b: 102 },     // #330066
        { r: 102, g: 0, b: 204 },    // #6600cc
        { r: 153, g: 51, b: 255 },   // #9933ff
        { r: 204, g: 102, b: 255 }   // #cc66ff
      ]
    }
  };

  const currentTheme = themes[colorTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set low-resolution canvas size for performance
    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;
    const width = Math.floor(displayWidth * CANVAS_SCALE);
    const height = Math.floor(displayHeight * CANVAS_SCALE);
    
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Ultra-fast noise calculation with reduced complexity
    const time = currentTime * 0.8; // Increased speed
    const invWidth = 1.0 / width;
    const invHeight = 1.0 / height;

    // Pre-calculate time-based offsets
    const t1 = time * 2.4;
    const t2 = time * 1.8;
    const t3 = time * 3.2;

    for (let y = 0; y < height; y++) {
      const normalizedY = y * invHeight;
      const yOffset = y * width;
      
      // Pre-calculate Y-based noise components
      const ny1 = normalizedY * 8 + t1;
      const ny2 = normalizedY * 12 + t2;
      const ny3 = normalizedY * 6 + t3;

      for (let x = 0; x < width; x++) {
        const pixelIndex = (yOffset + x) * 4;
        const normalizedX = x * invWidth;
        
        // Simplified 3-layer fast noise using lookup table
        const noise1 = fastSin(normalizedX * 10 + ny1) * 0.3;
        const noise2 = fastSin(normalizedX * 14 + ny2 + 50) * 0.2;
        const noise3 = fastSin(normalizedX * 18 + ny3 + 100) * 0.15;
        
        // Fast flowing pattern
        const flow = fastSin(normalizedX * 4 + normalizedY * 3 + time * 1.5) * 0.1;
        
        // Combine noise layers
        let lightness = 0.5 + noise1 + noise2 + noise3 + flow;
        
        // Fast gradient mapping
        lightness = Math.max(0, Math.min(1, lightness));
        const gradientPos = lightness * 3; // 4 colors = 3 segments
        const colorIndex = Math.floor(gradientPos);
        const blend = gradientPos - colorIndex;
        
        // Fast color interpolation
        const color1 = currentTheme.colors[Math.min(colorIndex, 3)];
        const color2 = currentTheme.colors[Math.min(colorIndex + 1, 3)];
        
        const invBlend = 1 - blend;
        const r = (color1.r * invBlend + color2.r * blend) | 0; // Bitwise OR for fast floor
        const g = (color1.g * invBlend + color2.g * blend) | 0;
        const b = (color1.b * invBlend + color2.b * blend) | 0;
        
        // Set pixel data
        data[pixelIndex] = r;
        data[pixelIndex + 1] = g;
        data[pixelIndex + 2] = b;
        data[pixelIndex + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [currentTime, currentTheme, fastSin]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          imageRendering: 'auto' // Smooth scaling
        }}
      />
    </div>
  );
} 