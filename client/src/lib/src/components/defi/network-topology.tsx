import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalContainer } from '../layout/terminal-container';

interface Node {
  id: string;
  connections: string[];
  activity: number;
  latency: number;
  region: string;
  status: 'active' | 'syncing' | 'offline';
}

interface NetworkTopologyProps {
  nodes?: Node[];
  width?: number;
  height?: number;
  className?: string;
}

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

  // Initialize grid with empty spaces
  useEffect(() => {
    const newGrid = Array(height).fill(null).map(() => 
      Array(width).fill(' ')
    );
    setGrid(newGrid);
  }, [width, height]);

  // Generate sample nodes if none provided
  useEffect(() => {
    if (nodes.length === 0) {
      const sampleNodes: Node[] = [
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
          connections: ['node1', 'node4'],
          activity: 0.6,
          latency: 75,
          region: 'US-EAST',
          status: 'syncing'
        },
        {
          id: 'node3',
          connections: ['node1'],
          activity: 0.4,
          latency: 90,
          region: 'EU-WEST',
          status: 'offline'
        }
      ];
      nodes = sampleNodes;
    }
  }, [nodes]);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanline(prev => (prev + 1) % height);
    }, 50);

    return () => clearInterval(interval);
  }, [height]);

  const renderNodeInfo = (node: Node) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="p-2 border border-primary/20 rounded-sm text-xs space-y-1"
      >
        <div className="flex justify-between">
          <span>ID:</span>
          <span className="font-bold">{node.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Region:</span>
          <span>{node.region}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={
            node.status === 'active' ? 'text-green-500' :
            node.status === 'syncing' ? 'text-yellow-500' :
            'text-red-500'
          }>
            {node.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Activity:</span>
          <span>{Math.round(node.activity * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Latency:</span>
          <span>{node.latency}ms</span>
        </div>
      </motion.div>
    );
  };

  return (
    <TerminalContainer title="NETWORK TOPOLOGY" className={className}>
      <div className="space-y-4">
        <div className="relative font-mono text-xs whitespace-pre overflow-hidden">
          <div
            className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
            style={{ top: `${(scanline / height) * 100}%` }}
          />
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              className={`absolute p-2 hover:bg-primary/5 rounded-sm transition-colors ${
                selectedNode?.id === node.id ? 'bg-primary/10' : ''
              }`}
              style={{
                top: `${Math.random() * (height - 5)}ch`,
                left: `${Math.random() * (width - 10)}ch`,
              }}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {NODE_ASCII[node.status]}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedNode && renderNodeInfo(selectedNode)}
        </AnimatePresence>
      </div>
    </TerminalContainer>
  );
}
