import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code } from 'lucide-react';
import { CodeSnippetHighlighter } from './code-snippet-highlighter';

interface Node {
  id: string;
  connections: string[];
  activity: number; // 0-1
  latency: number; // ms
  region: string;
  status: 'active' | 'syncing' | 'offline';
}

interface NetworkTopologyProps {
  nodes?: Node[];
  width?: number;
  height?: number;
  className?: string;
}

const GRID_CHARS = ['░', '▒', '▓', '█'];
const ARROW_CHARS = ['←', '↑', '→', '↓', '↖', '↗', '↘', '↙'];
const STATUS_CHARS = {
  active: '✓',
  syncing: '↻',
  offline: '✗'
};

const NODE_ASCII = {
  active: `┌───┐
│ ✓ │
└───┘`,
  syncing: `┌───┐
│ ↻ │
└───┘`,
  offline: `┌───┐
│ ✗ │
└───┘`
};

const COMPONENT_CODE = `import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';
import { CodeSnippetHighlighter } from './code-snippet-highlighter';

interface Node {
  id: string;
  connections: string[];
  activity: number;
  latency: number;
  region: string;
  status: 'active' | 'syncing' | 'offline';
}

export function NetworkTopology({ 
  nodes = [],
  width = 40,
  height = 20,
  className = '' 
}: NetworkTopologyProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [scanline, setScanline] = useState(0);

  // Rest of the implementation...
}`;

// Default test data
const DEFAULT_NODES: Node[] = [
  {
    id: 'node1',
    connections: ['node2', 'node3'],
    activity: 0.8,
    latency: 50,
    region: 'US-WEST',
    status: 'active'
  },
  {
    id: 'node2',
    connections: ['node1'],
    activity: 0.6,
    latency: 75,
    region: 'EU-CENTRAL',
    status: 'syncing'
  },
  {
    id: 'node3',
    connections: ['node1'],
    activity: 0.3,
    latency: 120,
    region: 'ASIA-EAST',
    status: 'offline'
  }
];

export function NetworkTopology({
  nodes = DEFAULT_NODES,
  width = 40,
  height = 20,
  className = ''
}: NetworkTopologyProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [scanline, setScanline] = useState(0);
  const [showCode, setShowCode] = useState(false);

  // Network metrics
  const avgLatency = useCallback(() => {
    return Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length);
  }, [nodes]);

  const activeNodes = useCallback(() => {
    return nodes.filter(n => n.status === 'active').length;
  }, [nodes]);

  // Calculate node positions on a grid
  useEffect(() => {
    const newGrid = Array(height).fill(0).map(() => Array(width).fill(' '));

    nodes.forEach((node, i) => {
      const x = Math.floor((i % (width / 2)) * 2 + 1);
      const y = Math.floor(i / (width / 2) * 2 + 1);

      if (y < height && x < width) {
        const nodeArt = NODE_ASCII[node.status];
        const nodeLines = nodeArt.split('\n');

        nodeLines.forEach((line, dy) => {
          if (y + dy < height) {
            const chars = line.split('');
            chars.forEach((char, dx) => {
              if (x + dx < width) {
                newGrid[y + dy][x + dx] = char;
              }
            });
          }
        });

        node.connections.forEach(targetId => {
          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            const targetIndex = nodes.indexOf(targetNode);
            const tx = Math.floor((targetIndex % (width / 2)) * 2 + 1);
            const ty = Math.floor(targetIndex / (width / 2) * 2 + 1);

            const dx = Math.sign(tx - x);
            const dy = Math.sign(ty - y);
            let cx = x;
            let cy = y;

            while (cx !== tx || cy !== ty) {
              if (cx !== tx) cx += dx;
              if (cy !== ty) cy += dy;

              if (cy < height && cx < width && newGrid[cy][cx] === ' ') {
                const angle = Math.atan2(dy, dx);
                const arrowIndex = ((angle / Math.PI * 4 + 4) % 8);
                newGrid[cy][cx] = ARROW_CHARS[Math.floor(arrowIndex)];
              }
            }
          }
        });
      }
    });

    setGrid(newGrid);
  }, [nodes, width, height]);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanline(prev => (prev + 1) % height);
    }, 50);
    return () => clearInterval(interval);
  }, [height]);

  return (
    <div className="space-y-4">
      <div className="font-mono text-xs flex justify-between items-center">
        <pre className="text-primary">
{`┌── NETWORK TOPOLOGY ───────────┐
│ NODES: ${activeNodes()}/${nodes.length} LATENCY: ${avgLatency()}ms │
└─────────────────────────────────┘`}
        </pre>

        <button
          onClick={() => setShowCode(prev => !prev)}
          className="px-2 py-1 border border-primary/20 hover:bg-primary/10 text-primary text-xs flex items-center gap-2 transition-colors rounded-sm"
        >
          <Code className="w-3 h-3" />
          <span className="font-mono">{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CodeSnippetHighlighter
              code={COMPONENT_CODE}
              language="typescript"
              title="NETWORK TOPOLOGY COMPONENT"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`relative font-mono ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute w-full h-[2px] bg-primary/10"
          style={{ top: `${(scanline / height) * 100}%` }}
        />

        <div className="relative">
          {grid.map((row, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`
                text-[0.7em] whitespace-pre
                ${i === scanline ? 'text-primary/80' : 'text-primary'}
              `}
            >
              {row.join('')}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 p-2 bg-background/80 backdrop-blur-sm border border-border rounded text-xs"
            >
              <div className="text-primary">{hoveredNode.id}</div>
              <div className="text-muted-foreground">
                Status: {hoveredNode.status.toUpperCase()}
                <br />
                Region: {hoveredNode.region}
                <br />
                Latency: {hoveredNode.latency}ms
                <br />
                Connections: {hoveredNode.connections.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        {Array.from(new Set(nodes.map(n => n.region))).map(region => (
          <div key={region} className="flex items-center gap-1">
            <span className="text-primary">■</span>
            {region}
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="text-green-500">{STATUS_CHARS.active}</span>
          Active
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">{STATUS_CHARS.syncing}</span>
          Syncing
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-500">{STATUS_CHARS.offline}</span>
          Offline
        </div>
      </div>
    </div>
  );
}