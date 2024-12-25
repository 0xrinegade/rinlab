import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles, TrendingUp, Flame, Skull } from 'lucide-react';

interface Token {
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

  // Generate sample token data
  useEffect(() => {
    const generateToken = (index: number): Token => ({
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

    setTokens(Array.from({ length: 10 }, (_, i) => generateToken(i)));

    const interval = setInterval(() => {
      setTokens(prev => 
        prev.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.1),
          change24h: token.change24h + (Math.random() - 0.5) * 5,
          pumpScore: Math.min(100, Math.max(0, token.pumpScore + (Math.random() - 0.5) * 10)),
          fomoLevel: Math.min(100, Math.max(0, token.fomoLevel + (Math.random() - 0.5) * 10))
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
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

  const formatNumber = (num: number) => {
    if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getTimeSinceLastPump = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now!';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getPumpIndicator = (score: number) => {
    const rocketCount = Math.floor(score / 20);
    return (
      <div className="flex space-x-1">
        {Array.from({ length: rocketCount }).map((_, i) => (
          <Rocket key={i} className="w-4 h-4" />
        ))}
      </div>
    );
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    return sortDirection === 'asc' ? 
      (aValue > bValue ? 1 : -1) :
      (aValue < bValue ? 1 : -1);
  });

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
          <button 
            onClick={() => {
              if (sortKey === 'symbol') {
                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey('symbol');
                setSortDirection('asc');
              }
            }}
            className="text-left hover:text-primary"
          >
            TOKEN
          </button>
          <button 
            onClick={() => {
              if (sortKey === 'price') {
                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey('price');
                setSortDirection('desc');
              }
            }}
            className="text-right hover:text-primary"
          >
            PRICE
          </button>
          <button 
            onClick={() => {
              if (sortKey === 'change24h') {
                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey('change24h');
                setSortDirection('desc');
              }
            }}
            className="text-right hover:text-primary"
          >
            24H %
          </button>
          <button 
            onClick={() => {
              if (sortKey === 'pumpScore') {
                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey('pumpScore');
                setSortDirection('desc');
              }
            }}
            className="text-center hover:text-primary"
          >
            PUMP SCORE
          </button>
          <button 
            onClick={() => {
              if (sortKey === 'fomoLevel') {
                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey('fomoLevel');
                setSortDirection('desc');
              }
            }}
            className="text-center hover:text-primary"
          >
            FOMO LEVEL
          </button>
          <div className="text-right">LAST PUMP</div>
        </div>

        {/* Token rows */}
        <div className="space-y-[1px]">
          <AnimatePresence>
            {sortedTokens.map((token) => (
              <motion.div
                key={token.symbol}
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
                  {getTimeSinceLastPump(token.lastPump)}
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
            <div>
              Top Gainer: {sortedTokens.sort((a, b) => b.change24h - a.change24h)[0].symbol}
              ({sortedTokens.sort((a, b) => b.change24h - a.change24h)[0].change24h.toFixed(2)}%)
            </div>
            <div>
              Highest FOMO: {sortedTokens.sort((a, b) => b.fomoLevel - a.fomoLevel)[0].symbol}
              ({sortedTokens.sort((a, b) => b.fomoLevel - a.fomoLevel)[0].fomoLevel.toFixed(0)}%)
            </div>
            <div>
              Best Pump Score: {sortedTokens.sort((a, b) => b.pumpScore - a.pumpScore)[0].symbol}
              ({sortedTokens.sort((a, b) => b.pumpScore - a.pumpScore)[0].pumpScore.toFixed(0)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}