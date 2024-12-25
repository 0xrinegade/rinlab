import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Hash, Clock } from 'lucide-react';

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  metric: 'transactions' | 'gas' | 'contracts' | 'tokens';
  timestamp: number;
}

interface BlockchainHeatmapProps {
  className?: string;
}

export function BlockchainHeatmap({ className = '' }: BlockchainHeatmapProps) {
  const [cells, setCells] = useState<HeatmapCell[]>([]);
  const [metric, setMetric] = useState<'transactions' | 'gas' | 'contracts' | 'tokens'>('transactions');
  const [scanLine, setScanLine] = useState(0);
  const gridSize = 16;

  // Generate sample heatmap data
  useEffect(() => {
    const generateData = () => {
      const newCells: HeatmapCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          newCells.push({
            x,
            y,
            value: Math.random(),
            metric,
            timestamp: Date.now() - Math.random() * 1000 * 60 * 60
          });
        }
      }
      setCells(newCells);
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    return () => clearInterval(interval);
  }, [metric]);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Get color based on value
  const getColor = (value: number) => {
    const intensity = Math.floor(value * 15);
    switch (metric) {
      case 'transactions':
        return `bg-primary/[.${intensity.toString(16)}]`;
      case 'gas':
        return `bg-yellow-500/[.${intensity.toString(16)}]`;
      case 'contracts':
        return `bg-purple-500/[.${intensity.toString(16)}]`;
      case 'tokens':
        return `bg-blue-500/[.${intensity.toString(16)}]`;
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case 'transactions':
        return <Activity className="w-4 h-4" />;
      case 'gas':
        return <Terminal className="w-4 h-4" />;
      case 'contracts':
        return <Hash className="w-4 h-4" />;
      case 'tokens':
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── BLOCKCHAIN ACTIVITY HEATMAP ──┐
      </div>

      <div className="relative min-h-[600px] overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Metric selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['transactions', 'gas', 'contracts', 'tokens'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`
                p-2 border text-xs uppercase flex items-center justify-center gap-2
                ${metric === m ? 'bg-primary/20 border-primary' : 'border-border/20'}
              `}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Heatmap grid */}
        <div 
          className="grid gap-[1px] p-4 border border-border/20"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          <AnimatePresence>
            {cells.map((cell) => (
              <motion.div
                key={`${cell.x}-${cell.y}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                  aspect-square ${getColor(cell.value)}
                  transition-colors duration-500
                `}
                title={`Value: ${(cell.value * 100).toFixed(1)}%`}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Stats display */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="border border-border/20 p-4">
            <div className="text-xs mb-2 flex items-center gap-2">
              {getMetricIcon()}
              <span className="uppercase">{metric} Activity</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Peak:</div>
              <div className="text-right">
                {(Math.max(...cells.map(c => c.value)) * 100).toFixed(1)}%
              </div>
              <div>Average:</div>
              <div className="text-right">
                {(cells.reduce((acc, c) => acc + c.value, 0) / cells.length * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="border border-border/20 p-4">
            <div className="text-xs mb-2">INTENSITY SCALE</div>
            <div className="flex h-4">
              {Array.from({ length: 16 }, (_, i) => (
                <div 
                  key={i}
                  className={`flex-1 ${getColor(i / 15)}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
