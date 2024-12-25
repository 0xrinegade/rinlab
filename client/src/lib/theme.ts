import { create } from 'zustand';

export type ThemePalette = {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    hover: string;
    muted: string;
  };
};

// Terminal theme based on the screenshot
const terminalTheme: ThemePalette = {
  name: 'Terminal',
  colors: {
    background: '240 100% 27%',
    foreground: '0 0% 100%',
    primary: '0 0% 100%',
    secondary: '240 30% 80%',
    accent: '240 30% 80%',
    border: '240 50% 60%',
    hover: '240 100% 32%',
    muted: '240 30% 80%'
  }
};

type ThemeStore = {
  currentPalette: ThemePalette;
  setTheme: (palette: ThemePalette) => void;
};

// Initialize store with terminal theme
export const useTheme = create<ThemeStore>((set) => ({
  currentPalette: terminalTheme,
  setTheme: (palette) => {
    set({ currentPalette: palette });
    // Update CSS variables
    const root = document.documentElement;
    Object.entries(palette.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
}));

// Initialize theme on import
if (typeof window !== 'undefined') {
  const root = document.documentElement;
  Object.entries(terminalTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

export const defaultTheme = terminalTheme;

export const theme = {
  fonts: {
    mono: "'IBM Plex Mono', monospace",
  },
  spacing: {
    grid: '8px',
  },
  transitions: {
    default: '0.2s ease',
    slow: '0.4s ease',
  }
};

export const borderStyles = {
  default: '1px solid hsl(var(--border))',
  glowing: 'hsl(var(--glow))'
};