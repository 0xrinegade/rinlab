import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bitcoin, ArrowRight, Cpu, Server, Network, Database } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'transfer' | 'swap' | 'stake' | 'unstake';
}

interface Node {
  id: string;
  x: number;
  y: number;
  transactions: Transaction[];
  status: 'active' | 'validating' | 'syncing';
}

interface BlockchainVisualizerProps {
  className?: string;
}

const ASCII_BLOCKS = {
  pending: `
    ┌──────┐
    │ PEND │
    │ .... │
    └──────┘`,
  confirmed: `
    ┌──────┐
    │ CONF │
    │ ✓✓✓✓ │
    └──────┘`,
  failed: `
    ┌──────┐
    │ FAIL │
    │ xxxx │
    └──────┘`
};

const TRANSACTION_ICONS = {
  transfer: '↔️',
  swap: '⇄',
  stake: '⚡️',
  unstake: '💫'
};

export function BlockchainVisualizer({ className = '' }: BlockchainVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);
  const [scanLine, setScanLine] = useState(0);

  // Generate random transactions for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const transactionTypes: Array<'transfer' | 'swap' | 'stake' | 'unstake'> = 
        ['transfer', 'swap', 'stake', 'unstake'];

      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        from: `0x${Math.random().toString(36).substr(2, 8)}`,
        to: `0x${Math.random().toString(36).substr(2, 8)}`,
        amount: Math.random() * 10,
        timestamp: Date.now(),
        status: 'pending',
        type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
      };

      setActiveTransactions(prev => [...prev.slice(-10), newTransaction]);

      // Simulate transaction lifecycle
      setTimeout(() => {
        setActiveTransactions(prev => 
          prev.map(t => t.id === newTransaction.id 
            ? { ...t, status: Math.random() > 0.1 ? 'confirmed' : 'failed' } 
            : t
          )
        );
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Retro scan line effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header mb-4">
        <pre className="text-primary text-xs">
{`
┌─── BLOCKCHAIN NETWORK STATUS ───┐
│ MONITORING LIVE TRANSACTIONS   │
│ >>> SECURE CONNECTION ACTIVE   │
└──────────────────────────────┘
`}
        </pre>
      </div>

      <div className="terminal-grid relative h-[400px] overflow-hidden border border-border/20 rounded-sm">
        {/* Retro scan line effect */}
        <div
          className="absolute w-full h-[2px] bg-primary/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        <div className="absolute top-2 left-2 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>Active Nodes: {nodes.length}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Server className="w-3 h-3" />
            <span>Pending TXs: {activeTransactions.filter(tx => tx.status === 'pending').length}</span>
          </div>
        </div>

        <AnimatePresence>
          {activeTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              className="absolute"
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * 300,
                y: Math.random() * 300
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                x: 50 + Math.random() * 200,
                y: 50 + Math.random() * 200
              }}
              exit={{ 
                opacity: 0,
                scale: 0
              }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 100
              }}
            >
              <div className={`
                p-2 border font-mono
                ${tx.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' : 
                  tx.status === 'confirmed' ? 'border-green-500/50 text-green-500' : 
                  'border-red-500/50 text-red-500'}
              `}>
                <pre className="text-xs whitespace-pre">
                  {ASCII_BLOCKS[tx.status]}
                </pre>

                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-lg">{TRANSACTION_ICONS[tx.type]}</span>
                  <span>{tx.amount.toFixed(4)} SOL</span>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <span>{tx.from.substr(0, 6)}...</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{tx.to.substr(0, 6)}...</span>
                </div>

                <div className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Connection lines */}
              <svg
                className="absolute top-0 left-0 -z-10 pointer-events-none"
                width="400"
                height="400"
                viewBox="0 0 400 400"
              >
                <motion.line
                  x1="0"
                  y1="0"
                  x2={Math.random() * 400}
                  y2={Math.random() * 400}
                  stroke={tx.status === 'pending' ? '#EAB308' : 
                         tx.status === 'confirmed' ? '#22C55E' : 
                         '#EF4444'}
                  strokeWidth="1"
                  strokeDasharray="4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Network grid background */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/5"
            />
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs font-mono">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}