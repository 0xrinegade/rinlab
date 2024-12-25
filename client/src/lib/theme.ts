import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePalette = {
  name: string;
  label: string;
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

export const themePalettes: ThemePalette[] = [
  {
    name: 'night',
    label: 'NIGHT',
    colors: {
      background: '0 0% 10%',
      foreground: '0 0% 90%',
      primary: '0 0% 90%',
      secondary: '0 0% 70%',
      accent: '0 0% 70%',
      border: '0 0% 30%',
      hover: '0 0% 15%',
      muted: '0 0% 70%'
    }
  },
  {
    name: 'day',
    label: 'DAY',
    colors: {
      background: '0 0% 98%',
      foreground: '0 0% 10%',
      primary: '0 0% 10%',
      secondary: '0 0% 30%',
      accent: '0 0% 30%',
      border: '0 0% 80%',
      hover: '0 0% 95%',
      muted: '0 0% 30%'
    }
  },
  {
    name: 'dos',
    label: 'DOS',
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
  },
  {
    name: 'cyberpunk',
    label: 'CYBERPUNK',
    colors: {
      background: '300 100% 5%',
      foreground: '315 100% 65%',
      primary: '315 100% 65%',
      secondary: '285 100% 60%',
      accent: '285 100% 60%',
      border: '315 100% 25%',
      hover: '300 100% 8%',
      muted: '285 50% 60%'
    }
  },
  {
    name: 'solarized',
    label: 'SOLARIZED',
    colors: {
      background: '44 87% 98%',
      foreground: '192 81% 29%',
      primary: '192 81% 29%',
      secondary: '180 30% 45%',
      accent: '180 30% 45%',
      border: '44 50% 85%',
      hover: '44 87% 95%',
      muted: '180 30% 45%'
    }
  }
];

type ThemeStore = {
  currentPalette: ThemePalette;
  setTheme: (palette: ThemePalette) => void;
  updateColor: (key: keyof ThemePalette['colors'], value: string) => void;
  resetTheme: () => void;
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      currentPalette: themePalettes[2], // DOS theme as default
      setTheme: (palette) => {
        set({ currentPalette: palette });
        updateCssVariables(palette.colors);
      },
      updateColor: (key, value) => {
        set((state) => {
          const newPalette = {
            ...state.currentPalette,
            colors: { ...state.currentPalette.colors, [key]: value }
          };
          updateCssVariables(newPalette.colors);
          return { currentPalette: newPalette };
        });
      },
      resetTheme: () => {
        const defaultPalette = themePalettes[2];
        set({ currentPalette: defaultPalette });
        updateCssVariables(defaultPalette.colors);
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.currentPalette) {
          updateCssVariables(state.currentPalette.colors);
        }
      }
    }
  )
);

function updateCssVariables(colors: ThemePalette['colors']) {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
}

export const defaultTheme = themePalettes[2]; // DOS theme as default

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