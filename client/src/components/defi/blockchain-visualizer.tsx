import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bitcoin, ArrowRight } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface Node {
  id: string;
  x: number;
  y: number;
  transactions: Transaction[];
}

interface BlockchainVisualizerProps {
  className?: string;
}

export function BlockchainVisualizer({ className = '' }: BlockchainVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);

  // Generate random transactions for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        from: `0x${Math.random().toString(36).substr(2, 8)}`,
        to: `0x${Math.random().toString(36).substr(2, 8)}`,
        amount: Math.random() * 10,
        timestamp: Date.now(),
        status: 'pending'
      };

      setActiveTransactions(prev => [...prev, newTransaction]);
      setTimeout(() => {
        setActiveTransactions(prev => 
          prev.map(t => t.id === newTransaction.id ? { ...t, status: 'confirmed' } : t)
        );
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── NETWORK TRANSACTIONS ──┐
      </div>
      
      <div className="terminal-grid relative h-[400px] overflow-hidden">
        <AnimatePresence>
          {activeTransactions.map((tx) => (
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
                x: Math.random() * 300,
                y: Math.random() * 300
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
                p-2 border terminal-border
                ${tx.status === 'pending' ? 'border-yellow-500/50' : 
                  tx.status === 'confirmed' ? 'border-green-500/50' : 
                  'border-red-500/50'}
              `}>
                <div className="flex items-center gap-2 text-xs">
                  <Bitcoin className="w-4 h-4" />
                  <span className="font-mono">
                    {tx.amount.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <span>{tx.from.substr(0, 6)}...</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>{tx.to.substr(0, 6)}...</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
