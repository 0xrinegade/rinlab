import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme, type ThemePalette } from '@/lib/theme';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';

interface ColorPaletteSelectorProps {
  className?: string;
}

type ColorKey = keyof ThemePalette['colors'];

export function ColorPaletteSelector({ className = '' }: ColorPaletteSelectorProps) {
  const { currentPalette, updateColor, resetTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);

  const colorLabels: Record<ColorKey, string> = {
    background: 'Background',
    foreground: 'Text',
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    border: 'Border',
    hover: 'Hover',
    muted: 'Muted'
  };

  const parseHslToComponents = (hslString: string) => {
    const [h, s, l] = hslString.split(' ').map(Number);
    return { h, s, l };
  };

  const handleColorChange = (key: ColorKey, component: 'h' | 's' | 'l', value: number) => {
    const currentValue = currentPalette.colors[key];
    const { h, s, l } = parseHslToComponents(currentValue);
    
    const newValue = component === 'h' ? `${value} ${s} ${l}` :
                    component === 's' ? `${h} ${value} ${l}` :
                    `${h} ${s} ${value}`;
                    
    updateColor(key, newValue);
  };

  return (
    <motion.div 
      className={`font-mono space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-xs text-muted-foreground mb-2">COLOR PALETTE</div>
      
      <div className="grid gap-4">
        {(Object.keys(colorLabels) as ColorKey[]).map((key) => (
          <div 
            key={key}
            className="border border-border/20 p-3 hover:bg-hover transition-colors"
            onClick={() => setSelectedColor(selectedColor === key ? null : key)}
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs">{colorLabels[key]}</Label>
              <div 
                className="w-6 h-6 border border-border/20"
                style={{ background: `hsl(${currentPalette.colors[key]})` }}
              />
            </div>
            
            {selectedColor === key && (
              <motion.div 
                className="mt-3 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                {['h', 's', 'l'].map((component) => {
                  const { h, s, l } = parseHslToComponents(currentPalette.colors[key]);
                  const value = component === 'h' ? h : component === 's' ? s : l;
                  const max = component === 'h' ? 360 : 100;
                  
                  return (
                    <div key={component} className="flex items-center gap-2">
                      <Label className="w-8 text-xs uppercase">{component}</Label>
                      <Input
                        type="range"
                        min="0"
                        max={max}
                        value={value}
                        onChange={(e) => handleColorChange(key, component as 'h' | 's' | 'l', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-8 text-xs text-right">{Math.round(value)}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <Button 
        onClick={resetTheme}
        className="w-full mt-4 text-xs"
      >
        RESET TO DEFAULT
      </Button>
    </motion.div>
  );
}
