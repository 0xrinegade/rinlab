import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/lib/src/components/ui/card';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';
import { Share, Import, RotateCcw } from 'lucide-react';

interface ColorPaletteSelectorProps {
  className?: string;
}

interface ThemePalette {
  name: string;
  label: string;
  colors: Record<string, string>;
}

export function ColorPaletteSelector({ className = '' }: ColorPaletteSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock theme functions for now
  const currentPalette: ThemePalette = {
    name: 'default',
    label: 'Default Theme',
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 47.4% 11.2%',
      primary: '222.2 47.4% 11.2%',
      secondary: '210 40% 96.1%',
      accent: '210 40% 96.1%',
      border: '214.3 31.8% 91.4%',
      hover: '0 0% 90%',
      muted: '210 40% 96.1%'
    }
  };

  const handleExportTheme = () => {
    try {
      const themeString = JSON.stringify(currentPalette, null, 2);
      navigator.clipboard.writeText(themeString);
      toast({
        title: "┌─ THEME EXPORTED ─┐",
        description: "└── Theme code copied to clipboard ──┘"
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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    input.style.display = 'none';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          toast({
            title: "┌─ THEME IMPORTED ─┐",
            description: "└── New theme loaded ──┘"
          });
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

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleResetTheme = () => {
    toast({
      title: "┌─ THEME RESET ─┐",
      description: "└── Default theme restored ──┘"
    });
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="p-4">
        <div className="text-sm mb-4">Current Theme: {currentPalette.label}</div>

        {Object.entries(currentPalette.colors).map(([key, value]) => (
          <div
            key={key}
            className="border border-border/20 p-3 mb-2 hover:bg-hover transition-colors cursor-pointer"
            onClick={() => setSelectedColor(selectedColor === key ? null : key)}
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs capitalize">{key}</Label>
              <div
                className="w-6 h-6 border border-border/20"
                style={{ background: `hsl(${value})` }}
              />
            </div>

            {selectedColor === key && (
              <motion.div
                className="mt-3 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <div className="text-xs text-muted-foreground mb-2">HSL VALUES</div>
                <div className="grid grid-cols-3 gap-2">
                  {['h', 's', 'l'].map((component) => (
                    <div key={component} className="space-y-1">
                      <Label className="text-xs uppercase">{component}</Label>
                      <Input
                        type="number"
                        min={component === 'h' ? 0 : 0}
                        max={component === 'h' ? 360 : 100}
                        className="text-xs"
                        value={value.split(' ')[component === 'h' ? 0 : component === 's' ? 1 : 2]}
                        onChange={() => {
                          // Theme update logic would go here
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={handleExportTheme}
            className="w-full text-xs flex items-center gap-2 justify-center"
          >
            <Share className="w-4 h-4" />
            EXPORT THEME
          </Button>
          <Button
            onClick={handleImportTheme}
            className="w-full text-xs flex items-center gap-2 justify-center"
            variant="outline"
          >
            <Import className="w-4 h-4" />
            IMPORT THEME
          </Button>
          <Button
            onClick={handleResetTheme}
            className="w-full text-xs flex items-center gap-2 justify-center"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4" />
            RESET TO DEFAULT
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}