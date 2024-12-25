import { motion } from 'framer-motion';
import { useTheme, themePalettes } from '@/lib/theme';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { currentPalette, setTheme } = useTheme();

  return (
    <motion.div 
      className={`font-mono space-y-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-xs text-muted-foreground mb-2">SELECT THEME</div>
      <div className="space-y-1">
        {themePalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => setTheme(palette)}
            className={`w-full px-3 py-2 text-xs text-left border transition-colors hover:bg-hover
              ${currentPalette.name === palette.name ? 'border-primary' : 'border-border'}`}
            style={{
              borderColor: currentPalette.name === palette.name ? `hsl(${palette.colors.primary})` : undefined,
              color: `hsl(${palette.colors.foreground})`
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {currentPalette.name === palette.name ? '▸' : ' '}
              </span>
              {palette.label}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}