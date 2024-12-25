import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, TrendingUp, Flame, Skull } from 'lucide-react';

interface Token {
  id: string; // Added stable ID
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  memeScore: number;
  pumpScore: number;
  fomoLevel: number;
  lastPump: number;
}

interface PumpFunScreenerProps {
  className?: string;
}

export function PumpFunScreener({ className = '' }: PumpFunScreenerProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortKey, setSortKey] = useState<keyof Token>('pumpScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [scanLine, setScanLine] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Generate sample token data with stable IDs
  useEffect(() => {
    try {
      const generateToken = (index: number): Token => ({
        id: `token-${index}`, // Stable ID for React key
        symbol: ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'WOJAK'][index % 5],
        name: ['PepeCoin', 'Dogecoin', 'Shiba Inu', 'Floki Inu', 'Wojak'][index % 5],
        price: Math.random() * 10,
        change24h: (Math.random() - 0.5) * 100,
        volume24h: Math.random() * 1000000,
        memeScore: Math.random() * 100,
        pumpScore: Math.random() * 100,
        fomoLevel: Math.random() * 100,
        lastPump: Date.now() - Math.random() * 1000 * 60 * 60 * 24
      });

      const initialTokens = Array.from({ length: 10 }, (_, i) => generateToken(i));
      setTokens(initialTokens);

      const interval = setInterval(() => {
        setTokens(prev => 
          prev.map(token => ({
            ...token, // Preserve stable ID
            price: token.price * (1 + (Math.random() - 0.5) * 0.1),
            change24h: token.change24h + (Math.random() - 0.5) * 5,
            pumpScore: Math.min(100, Math.max(0, token.pumpScore + (Math.random() - 0.5) * 10)),
            fomoLevel: Math.min(100, Math.max(0, token.fomoLevel + (Math.random() - 0.5) * 10))
          }))
        );
      }, 5000);

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Error generating tokens:', err);
      setError('Failed to generate token data');
    }
  }, []);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getFOMOEmoji = (level: number) => {
    if (level > 80) return <Flame className="w-4 h-4 text-red-500" />;
    if (level > 60) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (level > 40) return <Sparkles className="w-4 h-4 text-yellow-500" />;
    return <Skull className="w-4 h-4 text-muted-foreground" />;
  };

  const getPumpIndicator = (score: number) => {
    const rocketCount = Math.floor(score / 20);
    return (
      <div className="flex space-x-1">
        {Array.from({ length: rocketCount }).map((_, i) => (
          <Rocket key={`rocket-${i}`} className="w-4 h-4" />
        ))}
      </div>
    );
  };

  // Safely sort tokens with null checks and stable sorting
  const sortedTokens = [...tokens].sort((a, b) => {
    if (!a || !b) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue === undefined || bValue === undefined) return 0;
    return sortDirection === 'asc' ? 
      (aValue > bValue ? 1 : -1) :
      (aValue < bValue ? 1 : -1);
  });

  if (error) {
    return (
      <div className={`terminal-container p-4 ${className}`}>
        <div className="terminal-header">
          ┌── PUMP FUN SCREENER ──┐
        </div>
        <div className="p-4 text-center text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!tokens.length) {
    return (
      <div className={`terminal-container p-4 ${className}`}>
        <div className="terminal-header">
          ┌── PUMP FUN SCREENER ──┐
        </div>
        <div className="p-4 text-center text-muted-foreground">
          Loading token data...
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── PUMP FUN SCREENER ──┐
      </div>

      <div className="relative overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 p-4 text-xs border-b border-border/20">
          {[
            { key: 'symbol', label: 'TOKEN' },
            { key: 'price', label: 'PRICE' },
            { key: 'change24h', label: '24H %' },
            { key: 'pumpScore', label: 'PUMP SCORE' },
            { key: 'fomoLevel', label: 'FOMO LEVEL' },
            { key: 'lastPump', label: 'LAST PUMP' }
          ].map(({ key, label }) => (
            <button 
              key={key}
              onClick={() => {
                if (sortKey === key) {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortKey(key as keyof Token);
                  setSortDirection('desc');
                }
              }}
              className={`text-${key === 'symbol' ? 'left' : key === 'lastPump' ? 'right' : 'center'} hover:text-primary`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Token rows */}
        <div className="space-y-[1px]">
          <AnimatePresence mode="wait">
            {sortedTokens.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-6 gap-4 p-4 hover:bg-hover text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{token.symbol}</span>
                  <span className="text-muted-foreground">{token.name}</span>
                </div>
                <div className="text-right font-mono">
                  ${token.price.toFixed(4)}
                </div>
                <div className={`text-right font-mono ${
                  token.change24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </div>
                <div className="flex justify-center">
                  {getPumpIndicator(token.pumpScore)}
                </div>
                <div className="flex justify-center items-center gap-2">
                  {getFOMOEmoji(token.fomoLevel)}
                  <span className="font-mono">{token.fomoLevel.toFixed(0)}%</span>
                </div>
                <div className="text-right font-mono text-muted-foreground">
                  {Math.floor((Date.now() - token.lastPump) / (1000 * 60 * 60))}h ago
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stats footer */}
        <div className="border-t border-border/20 mt-4 p-4">
          <div className="text-xs text-muted-foreground">
            ┌── MARKET STATS ──┐
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
            {[
              {
                label: 'Top Gainer',
                value: sortedTokens[0]?.symbol,
                metric: sortedTokens[0]?.change24h
              },
              {
                label: 'Highest FOMO',
                value: sortedTokens[0]?.symbol,
                metric: sortedTokens[0]?.fomoLevel
              },
              {
                label: 'Best Pump Score',
                value: sortedTokens[0]?.symbol,
                metric: sortedTokens[0]?.pumpScore
              }
            ].map(({ label, value, metric }, index) => (
              <div key={`stat-${index}`}>
                {label}: {value || 'N/A'} ({metric ? metric.toFixed(2) : 0}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}