import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme, type ThemePalette } from '@/lib/theme';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';
import { Share, Import, RotateCcw } from 'lucide-react';

interface ColorPaletteSelectorProps {
  className?: string;
}

type ColorKey = keyof ThemePalette['colors'];

export function ColorPaletteSelector({ className = '' }: ColorPaletteSelectorProps) {
  const { currentPalette, updateColor, resetTheme, exportTheme, importTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);
  const { toast } = useToast();

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

  const handleShareTheme = async () => {
    const themeString = exportTheme();
    try {
      await navigator.clipboard.writeText(themeString);
      toast({
        title: "Theme Shared!",
        description: "Theme configuration copied to clipboard. Share this code with others to let them use your theme.",
      });
    } catch (err) {
      toast({
        title: "Share Failed",
        description: "Could not copy theme to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportTheme = () => {
    const themeString = prompt("Paste the shared theme code:");
    if (!themeString) return;

    try {
      const success = importTheme(themeString);
      if (success) {
        toast({
          title: "Theme Imported!",
          description: "The new theme has been applied successfully."
        });
      } else {
        throw new Error("Invalid theme configuration");
      }
    } catch (err) {
      toast({
        title: "Import Failed",
        description: "Invalid theme configuration. Please check the theme code and try again.",
        variant: "destructive"
      });
    }
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
            className="border border-border/20 p-3 hover:bg-hover transition-colors cursor-pointer"
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

      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={handleShareTheme}
          className="text-xs flex items-center gap-2"
        >
          <Share className="w-4 h-4" />
          SHARE THEME
        </Button>
        <Button 
          onClick={handleImportTheme}
          className="text-xs flex items-center gap-2"
        >
          <Import className="w-4 h-4" />
          IMPORT THEME
        </Button>
      </div>

      <Button 
        onClick={resetTheme}
        variant="outline"
        className="w-full text-xs flex items-center gap-2 justify-center"
      >
        <RotateCcw className="w-4 h-4" />
        RESET TO DEFAULT
      </Button>
    </motion.div>
  );
}