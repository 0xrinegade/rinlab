import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

interface MarketTrend {
  symbol: string;
  changePercent: number;
  price: number;
  timeframe: string;
}

interface MemeGeneratorProps {
  trend: MarketTrend;
  className?: string;
}

const MEME_TEMPLATES = [
  'terminal_success',
  'terminal_fail',
  'vintage_computer',
  'matrix_code',
  'hacker_moment'
] as const;

export function MemeGenerator({ trend, className = '' }: MemeGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [memeText, setMemeText] = useState<string | null>(null);
  const { currentPalette } = useTheme();
  
  const getTrendIcon = () => {
    if (trend.changePercent > 3) return <ArrowUp className="text-green-500" />;
    if (trend.changePercent < -3) return <ArrowDown className="text-red-500" />;
    return <ArrowRight className="text-yellow-500" />;
  };

  const generateMeme = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trend,
          template: MEME_TEMPLATES[Math.floor(Math.random() * MEME_TEMPLATES.length)]
        })
      });
      
      const data = await response.json();
      setMemeText(data.text);
    } catch (error) {
      console.error('Failed to generate meme:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className={`relative p-4 bg-black border rounded-md ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">MEME GENERATOR</span>
          {getTrendIcon()}
        </div>
        <button
          onClick={generateMeme}
          disabled={loading}
          className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors font-mono"
        >
          {loading ? 'PROCESSING...' : 'GENERATE'}
        </button>
      </div>

      {memeText && (
        <motion.div 
          className="p-4 bg-black border border-primary rounded-md font-mono text-sm vintage-glow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <pre className="whitespace-pre-wrap break-words">{memeText}</pre>
        </motion.div>
      )}

      <div 
        className="absolute inset-0 pointer-events-none terminal-scanline"
        style={{ opacity: loading ? 1 : 0 }}
      />
    </motion.div>
  );
}
