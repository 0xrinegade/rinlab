import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Node {
  id: string;
  connections: string[];
  activity: number; // 0-1
  latency: number; // ms
  region: string;
}

interface NetworkTopologyProps {
  nodes: Node[];
  width?: number;
  height?: number;
  className?: string;
}

const GRID_CHARS = ['░', '▒', '▓', '█'];
const ARROW_CHARS = ['←', '↑', '→', '↓', '↖', '↗', '↘', '↙'];

export function NetworkTopology({ 
  nodes,
  width = 40,
  height = 20,
  className = '' 
}: NetworkTopologyProps) {
  const [grid, setGrid] = useState<string[][]>([]);

  // Calculate node positions on a grid
  useEffect(() => {
    const newGrid = Array(height).fill(0).map(() => Array(width).fill(' '));
    
    // Place nodes
    nodes.forEach((node, i) => {
      const x = Math.floor((i % (width/2)) * 2 + 1);
      const y = Math.floor(i / (width/2) * 2 + 1);
      if (y < height && x < width) {
        // Use different characters based on activity level
        const activityChar = GRID_CHARS[Math.floor(node.activity * (GRID_CHARS.length - 1))];
        newGrid[y][x] = activityChar;
        
        // Draw connections
        node.connections.forEach(targetId => {
          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            const targetIndex = nodes.indexOf(targetNode);
            const tx = Math.floor((targetIndex % (width/2)) * 2 + 1);
            const ty = Math.floor(targetIndex / (width/2) * 2 + 1);
            
            // Draw path between nodes
            const dx = Math.sign(tx - x);
            const dy = Math.sign(ty - y);
            let cx = x;
            let cy = y;
            
            while (cx !== tx || cy !== ty) {
              if (cx !== tx) cx += dx;
              if (cy !== ty) cy += dy;
              
              if (cy < height && cx < width) {
                // Use arrow characters for connections
                const arrowIndex = ((Math.atan2(dy, dx) / Math.PI * 4 + 4) % 8);
                newGrid[cy][cx] = ARROW_CHARS[Math.floor(arrowIndex)];
              }
            }
          }
        });
      }
    });
    
    setGrid(newGrid);
  }, [nodes, width, height]);

  return (
    <motion.div 
      className={`font-mono whitespace-pre ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-2 text-xs text-muted-foreground">
        ACTIVE NODES: {nodes.length} | 
        AVG LATENCY: {Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length)}ms
      </div>
      {grid.map((row, i) => (
        <motion.div 
          key={i}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.02 }}
          className="text-[hsl(150_100%_50%)]"
        >
          {row.join('')}
        </motion.div>
      ))}
      <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
        {Array.from(new Set(nodes.map(n => n.region))).map(region => (
          <div key={region} className="flex items-center gap-1">
            <span className="text-[hsl(150_100%_50%)]">■</span>
            {region}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
