'use client';

import React, { useEffect } from 'react';
import { useTheme, defaultTheme } from '../../client/src/lib/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentPalette } = useTheme();

  useEffect(() => {
    // Update CSS variables whenever theme changes
    if (currentPalette?.colors) {
      const root = document.documentElement;
      Object.entries(currentPalette.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [currentPalette]);

  // Initialize default theme on mount
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(defaultTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, []);

  return <>{children}</>;
}