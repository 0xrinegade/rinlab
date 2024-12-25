import { motion } from 'framer-motion';
import { useTheme, retroPalettes, type ThemePalette } from '@/lib/theme';
import { useEffect } from 'react';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { currentPalette, setTheme } = useTheme();

  useEffect(() => {
    // Update CSS variables when theme changes
    const root = document.documentElement;
    Object.entries(currentPalette.colors).forEach(([key, value]) => {
      if (key === 'glow') return;
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentPalette]);

  return (
    <motion.div 
      className={`font-mono space-y-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-xs text-muted-foreground mb-2">SELECT THEME</div>
      <div className="space-y-1">
        {retroPalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => setTheme(palette)}
            className={`w-full px-3 py-2 text-xs text-left border transition-colors hover:bg-hover
              ${currentPalette.name === palette.name ? 'border-primary' : 'border-border'}`}
            style={{
              borderColor: currentPalette.name === palette.name ? `hsl(${palette.colors.primary})` : undefined,
              color: `hsl(${palette.colors.primary})`
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {currentPalette.name === palette.name ? '▸' : ' '}
              </span>
              {palette.name.toUpperCase()}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}