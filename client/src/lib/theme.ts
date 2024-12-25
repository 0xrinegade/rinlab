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
    glow: string;
  };
};

const retroPalettes: ThemePalette[] = [
  {
    name: 'Matrix',
    colors: {
      background: '0 0% 0%',
      foreground: '120 100% 50%',
      primary: '120 100% 50%',
      secondary: '300 100% 50%',
      accent: '60 100% 50%',
      border: '0 0% 20%',
      hover: '0 0% 10%',
      glow: '120 100% 50% / 0.2'
    }
  },
  {
    name: 'Amber',
    colors: {
      background: '0 0% 0%',
      foreground: '35 100% 50%',
      primary: '35 100% 50%',
      secondary: '25 100% 50%',
      accent: '45 100% 50%',
      border: '0 0% 20%',
      hover: '0 0% 10%',
      glow: '35 100% 50% / 0.2'
    }
  },
  {
    name: 'IBM',
    colors: {
      background: '0 0% 0%',
      foreground: '205 100% 50%',
      primary: '205 100% 50%',
      secondary: '220 100% 50%',
      accent: '180 100% 50%',
      border: '0 0% 20%',
      hover: '0 0% 10%',
      glow: '205 100% 50% / 0.2'
    }
  }
];

type ThemeStore = {
  currentPalette: ThemePalette;
  setTheme: (palette: ThemePalette) => void;
};

export const useTheme = create<ThemeStore>((set) => ({
  currentPalette: retroPalettes[0],
  setTheme: (palette) => set({ currentPalette: palette })
}));

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

export { retroPalettes };