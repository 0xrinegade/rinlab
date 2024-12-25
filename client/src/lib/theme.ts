import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  updateColor: (key: keyof ThemePalette['colors'], value: string) => void;
  resetTheme: () => void;
};

// Initialize store with terminal theme and persistence
export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      currentPalette: terminalTheme,
      setTheme: (palette) => {
        set({ currentPalette: palette });
        updateCssVariables(palette.colors);
      },
      updateColor: (key, value) => {
        set((state) => ({
          currentPalette: {
            ...state.currentPalette,
            colors: {
              ...state.currentPalette.colors,
              [key]: value
            }
          }
        }));
        updateCssVariables({
          ...terminalTheme.colors,
          [key]: value
        });
      },
      resetTheme: () => {
        set({ currentPalette: terminalTheme });
        updateCssVariables(terminalTheme.colors);
      }
    }),
    {
      name: 'theme-storage'
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