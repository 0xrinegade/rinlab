import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, Cpu } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  path: number[][];  // Array of coordinate points for the animation path
  status: 'pending' | 'processing' | 'complete';
}

interface Node {
  id: string;
  type: 'validator' | 'node' | 'endpoint';
  x: number;
  y: number;
  status: 'active' | 'inactive';
  load: number;  // 0-100 percentage
}

interface TransactionFlowChartProps {
  className?: string;
}

export function TransactionFlowChart({ className = '' }: TransactionFlowChartProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pixelSize] = useState(4); // Size of each "pixel" in our retro style
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize nodes in a grid pattern
  useEffect(() => {
    const newNodes: Node[] = [];
    const gridSize = 5;
    const spacing = 80;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newNodes.push({
          id: `node-${i}-${j}`,
          type: Math.random() > 0.7 ? 'validator' : 
                Math.random() > 0.5 ? 'endpoint' : 'node',
          x: (j + 1) * spacing,
          y: (i + 1) * spacing,
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          load: Math.random() * 100
        });
      }
    }
    setNodes(newNodes);
  }, []);

  // Generate random transactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length < 2) return;

      const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
      const toNode = nodes[Math.floor(Math.random() * nodes.length)];

      // Generate a path between nodes
      const path = generatePath(fromNode, toNode);

      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        from: fromNode.id,
        to: toNode.id,
        amount: Math.random() * 10,
        path,
        status: 'pending'
      };

      setTransactions(prev => [...prev, newTransaction]);

      // Animate transaction through its path
      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t =>
            t.id === newTransaction.id ? { ...t, status: 'processing' } : t
          )
        );
      }, 100);

      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t =>
            t.id === newTransaction.id ? { ...t, status: 'complete' } : t
          )
        );
      }, 2000);

      // Remove completed transaction after animation
      setTimeout(() => {
        setTransactions(prev => prev.filter(t => t.id !== newTransaction.id));
      }, 3000);
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes]);

  // Generate a path between two nodes with some randomization
  const generatePath = (from: Node, to: Node) => {
    const points: number[][] = [[from.x, from.y]];
    let currentX = from.x;
    let currentY = from.y;
    
    // Add some midpoints for more interesting paths
    while (Math.abs(currentX - to.x) > 20 || Math.abs(currentY - to.y) > 20) {
      if (Math.abs(currentX - to.x) > 20) {
        currentX += (to.x - currentX) > 0 ? 20 : -20;
        // Add some vertical variation
        currentY += (Math.random() - 0.5) * 10;
      }
      if (Math.abs(currentY - to.y) > 20) {
        currentY += (to.y - currentY) > 0 ? 20 : -20;
        // Add some horizontal variation
        currentX += (Math.random() - 0.5) * 10;
      }
      points.push([currentX, currentY]);
    }
    
    points.push([to.x, to.y]);
    return points;
  };

  // Render a retro-style node
  const renderNode = (node: Node) => {
    const IconComponent = node.type === 'validator' ? Database :
                         node.type === 'endpoint' ? Server : Cpu;

    return (
      <motion.div
        key={node.id}
        className="absolute"
        style={{
          left: node.x - 20,
          top: node.y - 20,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <div className={`
          p-2 border terminal-border relative
          ${node.status === 'active' ? 'border-primary' : 'border-destructive/50'}
        `}>
          <IconComponent className="w-4 h-4" />
          {/* Load indicator */}
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${node.load}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  // Render a transaction path
  const renderTransaction = (transaction: Transaction) => {
    return (
      <motion.div
        key={transaction.id}
        className="absolute left-0 top-0 w-2 h-2"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1, 1, 0],
          x: transaction.path.map(p => p[0]),
          y: transaction.path.map(p => p[1]),
        }}
        transition={{
          duration: 2,
          times: [0, 0.1, 0.9, 1],
        }}
      >
        <div className={`
          w-full h-full rounded-full
          ${transaction.status === 'pending' ? 'bg-yellow-500' :
            transaction.status === 'processing' ? 'bg-primary' :
            'bg-green-500'}
          pixel-glow
        `} />
      </motion.div>
    );
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── TRANSACTION FLOW VISUALIZATION ──┐
      </div>

      <div 
        ref={containerRef}
        className="relative h-[500px] overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: `${pixelSize * 10}px ${pixelSize * 10}px`,
        }}
      >
        {/* Grid overlay for retro effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              transparent,
              transparent ${pixelSize - 1}px,
              rgba(0, 0, 0, 0.1) ${pixelSize}px
            )`
          }}
        />

        {/* Render nodes */}
        {nodes.map(renderNode)}

        {/* Render active transactions */}
        <AnimatePresence>
          {transactions.map(renderTransaction)}
        </AnimatePresence>

        {/* Stats display */}
        <div className="absolute bottom-4 left-4 text-xs font-mono">
          <div>ACTIVE NODES: {nodes.filter(n => n.status === 'active').length}</div>
          <div>PENDING TXS: {transactions.length}</div>
        </div>
      </div>
    </div>
  );
}
