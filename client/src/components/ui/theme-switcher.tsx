import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, themePalettes } from '@/lib/theme';
import { Button } from './button';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { currentPalette, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs border border-border hover:bg-hover transition-colors"
      >
        {`┌${'─'.repeat(12)}┐`}
        <br />
        │ {currentPalette.label} {isOpen ? '▼' : '▶'} │
        <br />
        {`└${'─'.repeat(12)}┘`}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-1 z-50 min-w-[200px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="border border-border bg-background text-foreground">
              {`┌${'─'.repeat(24)}┐`}
              {themePalettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => {
                    setTheme(palette);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1 hover:bg-hover transition-colors"
                >
                  {currentPalette.name === palette.name ? '│ ▶' : '│  '} {palette.label.padEnd(21)} │
                </button>
              ))}
              {`└${'─'.repeat(24)}┘`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}