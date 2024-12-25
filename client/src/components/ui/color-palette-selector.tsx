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

  const handleShareTheme = async () => {
    const themeString = exportTheme();
    try {
      await navigator.clipboard.writeText(themeString);
      toast({
        title: "┌─ THEME EXPORTED ─┐",
        description: "└── Theme code copied to clipboard ──┘",
      });
    } catch (err) {
      toast({
        title: "┌─ EXPORT FAILED ─┐",
        description: "└── Could not copy theme code ──┘",
        variant: "destructive"
      });
    }
  };

  const handleImportTheme = () => {
    // Create a hidden file input for theme import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.theme.txt';
    input.style.display = 'none';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const themeString = event.target?.result as string;
        try {
          const success = importTheme(themeString.trim());
          if (success) {
            toast({
              title: "┌─ THEME IMPORTED ─┐",
              description: "└── New theme applied successfully ──┘"
            });
          } else {
            throw new Error("Invalid theme configuration");
          }
        } catch (err) {
          toast({
            title: "┌─ IMPORT FAILED ─┐",
            description: "└── Invalid theme file ──┘",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };

    // Trigger file selection
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleExportThemeFile = () => {
    const themeString = exportTheme();
    const blob = new Blob([themeString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPalette.name}.theme.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "┌─ THEME EXPORTED ─┐",
      description: "└── Theme file downloaded ──┘",
    });
  };

  return (
    <motion.div 
      className={`font-mono space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="border border-border/20 p-4 terminal-container">
        <div className="terminal-header">
          ┌── THEME MANAGEMENT ──┐
        </div>

        <div className="grid gap-4 p-4">
          <div className="text-sm">Current Theme: {currentPalette.label}</div>

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
                  <div className="text-xs text-muted mb-2">HSL VALUES</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['h', 's', 'l'].map((component) => (
                      <div key={component} className="space-y-1">
                        <Label className="text-xs uppercase">{component}</Label>
                        <Input
                          type="number"
                          min={component === 'h' ? 0 : 0}
                          max={component === 'h' ? 360 : 100}
                          className="text-xs"
                          value={currentPalette.colors[key].split(' ')[component === 'h' ? 0 : component === 's' ? 1 : 2]}
                          onChange={(e) => {
                            const values = currentPalette.colors[key].split(' ');
                            values[component === 'h' ? 0 : component === 's' ? 1 : 2] = e.target.value;
                            updateColor(key, values.join(' '));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <Button 
            onClick={handleExportThemeFile}
            className="w-full text-xs flex items-center gap-2 justify-center"
          >
            <Share className="w-4 h-4" />
            EXPORT THEME FILE
          </Button>
          <Button 
            onClick={handleShareTheme}
            variant="outline"
            className="w-full text-xs flex items-center gap-2 justify-center"
          >
            <Share className="w-4 h-4" />
            COPY THEME CODE
          </Button>
          <Button 
            onClick={handleImportTheme}
            className="w-full text-xs flex items-center gap-2 justify-center"
          >
            <Import className="w-4 h-4" />
            IMPORT THEME
          </Button>
          <Button 
            onClick={resetTheme}
            variant="outline"
            className="w-full text-xs flex items-center gap-2 justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            RESET TO DEFAULT
          </Button>
        </div>
      </div>
    </motion.div>
  );
}