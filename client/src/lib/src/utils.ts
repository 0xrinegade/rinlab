import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = typeof window !== "undefined";
export const isDev = process.env.NODE_ENV === "development";

/**
 * Generates a pixel font CSS class
 * @param size Font size in pixels
 * @param color Text color (CSS color value)
 * @returns CSS class string
 */
export function pixelFont(size = 16, color = "currentColor") {
  return `font-mono text-[${size}px] leading-tight tracking-wide text-${color} font-pixel antialiased`;
}

/**
 * Creates a retro terminal glow effect
 * @param color The glow color (CSS color)
 * @param intensity Glow intensity (0-10)
 * @returns CSS class string
 */
export function retroGlow(color = "primary", intensity = 5) {
  const shadowSize = Math.max(1, Math.min(10, intensity)) * 2;
  return `text-${color} shadow-[0_0_${shadowSize}px_${color}]`;
}

/**
 * Adds a scanline effect to a container element
 * @returns CSS style object for scanline pseudo element
 */
export function scanlineEffect() {
  return {
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'scanline 2s linear infinite',
      zIndex: '10',
      pointerEvents: 'none'
    }
  };
}

/**
 * Creates CRT screen effect (curvature, scanlines, etc)
 * @param intensity Effect intensity (0-10)
 * @returns CSS class string
 */
export function crtEffect(intensity = 5) {
  const scale = Math.max(1, Math.min(10, intensity)) / 10;
  return `relative rounded-md overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,${scale/2})_90%,_rgba(0,0,0,${scale})_100%)] before:pointer-events-none`;
}

/**
 * Generates a random character for use in glitch effects
 * @returns A random ASCII character
 */
export function randomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Converts a string to ASCII "pixel art"
 * @param text The text to convert
 * @param scale The scale factor (1-3)
 * @returns ASCII art representation
 */
export function textToAscii(text: string, scale = 1): string {
  const asciiChars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
  
  // Simple implementation - can be expanded for better results
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0) % asciiChars.length;
      return asciiChars[code].repeat(scale);
    })
    .join('');
}
