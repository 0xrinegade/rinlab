import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

interface TokenInputProps {
  token: string;
  balance?: string;
  onChange: (value: string) => void;
  max?: string;
}

export function TokenInput({ token, balance, onChange, max }: TokenInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div 
      className="relative p-4 bg-black border rounded-md"
      initial={false}
      animate={focused ? {
        boxShadow: `0 0 10px ${theme.colors.primary}`,
      } : {}}
    >
      <div className="flex justify-between mb-2">
        <Label className="text-sm text-muted-foreground">{token}</Label>
        {balance && (
          <span className="text-sm text-muted-foreground">
            Balance: {balance}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          type="number"
          className="flex-1 bg-transparent border-none font-mono text-lg"
          placeholder="0.0"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        
        {max && (
          <button
            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors font-mono"
            onClick={() => onChange(max)}
          >
            MAX
          </button>
        )}
      </div>

      <div 
        className="absolute inset-0 pointer-events-none terminal-scanline"
        style={{ opacity: focused ? 1 : 0 }}
      />
    </motion.div>
  );
}
