import { motion } from 'framer-motion';
import { useTheme, type ThemePalette } from '@/lib/theme';
import { useEffect } from 'react';

interface ThemeSwitcherProps {
  className?: string;
}

// Create a single theme option since we're using a fixed theme
const themeOption = {
  name: 'Terminal',
  label: 'SACRED COMPUTER',
  description: 'Deep blue terminal theme with vintage computing aesthetics'
};

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { currentPalette } = useTheme();

  // Ensure theme values are available
  if (!currentPalette?.colors) {
    return null;
  }

  return (
    <motion.div 
      className={`font-mono space-y-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-xs text-muted-foreground mb-2">TERMINAL THEME</div>
      <div className="space-y-1">
        <div
          className="w-full px-3 py-2 text-xs border border-border"
          style={{
            borderColor: `hsl(${currentPalette.colors.border})`,
            color: `hsl(${currentPalette.colors.foreground})`
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted">▸</span>
            {themeOption.label}
          </div>
          <div className="mt-1 text-[10px] text-muted">
            {themeOption.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
}