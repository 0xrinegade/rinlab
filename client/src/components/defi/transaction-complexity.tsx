import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, HardDrive, Network } from 'lucide-react';

interface Transaction {
  id: string;
  complexity: number;
  memoryUsage: number;
  networkHops: number;
  timestamp: number;
  status: 'processing' | 'complete' | 'failed';
}

interface TransactionComplexityProps {
  className?: string;
}

export function TransactionComplexity({ className = '' }: TransactionComplexityProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [scanLine, setScanLine] = useState(0);

  // Generate sample transaction data
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        complexity: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 1024),
        networkHops: Math.floor(Math.random() * 10),
        timestamp: Date.now(),
        status: 'processing'
      };

      setTransactions(prev => [...prev.slice(-4), newTransaction]);

      // Simulate transaction completion
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(t => 
            t.id === newTransaction.id 
              ? { ...t, status: Math.random() > 0.1 ? 'complete' : 'failed' }
              : t
          )
        );
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── TRANSACTION COMPLEXITY ANALYZER ──┐
      </div>

      <div className="terminal-grid relative h-[400px] overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Transaction display */}
        <AnimatePresence>
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="border border-border/20 p-4 mb-4"
            >
              {/* ASCII art header */}
              <div className="font-mono text-xs mb-2">
                {`┌${'─'.repeat(40)}┐`}
                <br />
                │ Transaction {tx.id.substr(0, 8)} │
                <br />
                {`└${'─'.repeat(40)}┘`}
              </div>

              {/* Metrics display */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <div className="text-xs">
                    <div>Complexity</div>
                    <div className="font-bold">{tx.complexity} cycles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <div className="text-xs">
                    <div>Memory</div>
                    <div className="font-bold">{tx.memoryUsage} KB</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  <div className="text-xs">
                    <div>Network</div>
                    <div className="font-bold">{tx.networkHops} hops</div>
                  </div>
                </div>
              </div>

              {/* Progress visualization */}
              <div className="h-2 bg-border/20 relative">
                <motion.div
                  className={`h-full ${
                    tx.status === 'complete' ? 'bg-green-500/50' :
                    tx.status === 'failed' ? 'bg-red-500/50' :
                    'bg-yellow-500/50'
                  }`}
                  initial={{ width: '0%' }}
                  animate={{ width: tx.status === 'processing' ? ['0%', '100%'] : '100%' }}
                  transition={{ 
                    duration: tx.status === 'processing' ? 2 : 0,
                    repeat: tx.status === 'processing' ? Infinity : 0 
                  }}
                />
              </div>

              {/* ASCII art status indicator */}
              <div className="font-mono text-xs mt-2">
                Status: [{
                  tx.status === 'processing' ? '... ' :
                  tx.status === 'complete' ? 'DONE' :
                  'FAIL'
                }]
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}