import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface RetroScreenProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1
  scanlineSpacing?: number; // pixels
  noiseOpacity?: number; // 0-1
  glowRadius?: number; // pixels
  glowColor?: string;
  curvature?: number; // 0-1
}

export function RetroScreen({
  children,
  className = '',
  intensity = 0.15,
  scanlineSpacing = 2,
  noiseOpacity = 0.05,
  glowRadius = 20,
  glowColor = 'var(--primary)',
  curvature = 0.1,
}: RetroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate noise texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255 * noiseOpacity;
        data[i] = noise;     // r
        data[i + 1] = noise; // g
        data[i + 2] = noise; // b
        data[i + 3] = 255;   // alpha
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      generateNoise();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const noiseInterval = setInterval(generateNoise, 50); // Update noise every 50ms

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(noiseInterval);
    };
  }, [noiseOpacity]);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        '--screen-curvature': curvature,
        '--scanline-spacing': `${scanlineSpacing}px`,
        '--scanline-intensity': intensity,
        '--glow-radius': `${glowRadius}px`,
        '--glow-color': glowColor,
      } as React.CSSProperties}
    >
      {/* CRT screen content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, var(--scanline-intensity)) 0px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) var(--scanline-spacing)
          )`,
        }}
      />

      {/* Noise overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-50 z-30"
      />

      {/* CRT screen curve effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          boxShadow: `
            inset 0 0 ${glowRadius}px ${glowColor},
            inset 0 0 calc(var(--screen-curvature) * 100px) rgba(0, 0, 0, 0.5)
          `,
          borderRadius: `calc(var(--screen-curvature) * 20px)`,
        }}
      />
    </motion.div>
  );
}
