import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Clock, Hash, Coins } from 'lucide-react';

interface Transaction {
  hash: string;
  blockHeight: number;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  fee: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TransactionReplayProps {
  className?: string;
}

export function TransactionReplay({ className = '' }: TransactionReplayProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [scanLine, setScanLine] = useState(0);

  // Generate sample transaction data
  useEffect(() => {
    const generateTransaction = (index: number): Transaction => ({
      hash: `0x${Math.random().toString(36).substr(2, 64)}`,
      blockHeight: 1000000 + index,
      timestamp: Date.now() - (1000 * 60 * 60 * index),
      from: `0x${Math.random().toString(36).substr(2, 40)}`,
      to: `0x${Math.random().toString(36).substr(2, 40)}`,
      amount: Math.random() * 10,
      fee: Math.random() * 0.01,
      status: Math.random() > 0.1 ? 'confirmed' : 'failed'
    });

    setTransactions(Array.from({ length: 20 }, (_, i) => generateTransaction(i)));
  }, []);

  // Handle playback
  useEffect(() => {
    if (!isPlaying || !transactions.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= transactions.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, transactions.length, playbackSpeed]);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleString();

  const renderASCIIArt = (status: Transaction['status']) => {
    if (status === 'confirmed') {
      return `
    ╔══════╗
    ║ ✓  ✓ ║
    ║  ◇   ║
    ╚══════╝
      `;
    }
    return `
    ╔══════╗
    ║ ✗  ✗ ║
    ║  ◇   ║
    ╚══════╝
      `;
  };

  const currentTx = transactions[currentIndex];

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── TRANSACTION REPLAY TERMINAL ──┐
      </div>

      <div className="relative min-h-[600px] overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-4 p-4 border-b border-border/20">
          <button
            onClick={() => setCurrentIndex(0)}
            className="p-2 hover:bg-hover"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-hover"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(currentIndex + 1, transactions.length - 1))}
            className="p-2 hover:bg-hover"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-background border border-border/20 p-1 text-xs"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>

        {/* Transaction display */}
        <AnimatePresence mode="wait">
          {currentTx && (
            <motion.div
              key={currentTx.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4"
            >
              {/* ASCII art visualization */}
              <pre className="font-mono text-xs whitespace-pre">
                {renderASCIIArt(currentTx.status)}
              </pre>

              {/* Transaction details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>Hash:</span>
                </div>
                <div className="font-mono text-primary">
                  {formatAddress(currentTx.hash)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Time:</span>
                </div>
                <div className="font-mono">
                  {formatTimestamp(currentTx.timestamp)}
                </div>

                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span>Block:</span>
                </div>
                <div className="font-mono">
                  #{currentTx.blockHeight}
                </div>
              </div>

              {/* Transfer visualization */}
              <div className="border border-border/20 p-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs">
                    <div>From:</div>
                    <div className="font-mono text-muted-foreground">
                      {formatAddress(currentTx.from)}
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      x: [0, 100, 0],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-primary"
                  >
                    ≫≫≫
                  </motion.div>
                  <div className="text-xs text-right">
                    <div>To:</div>
                    <div className="font-mono text-muted-foreground">
                      {formatAddress(currentTx.to)}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-2xl font-mono">
                    {currentTx.amount.toFixed(4)} SOL
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Fee: {currentTx.fee.toFixed(6)} SOL
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (transactions.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
