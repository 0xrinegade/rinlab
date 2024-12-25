import { motion, AnimatePresence } from 'framer-motion';
import { formatDistance } from 'date-fns';

interface Transaction {
  id: string;
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  amount: string;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  from: string;
  to: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  maxHeight?: string;
  className?: string;
}

export function TransactionHistory({ 
  transactions,
  maxHeight = '400px',
  className = '' 
}: TransactionHistoryProps) {
  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getStatusSymbol = (status: Transaction['status']) => {
    switch (status) {
      case 'pending': return '⧗';
      case 'confirmed': return '✓';
      case 'failed': return '✕';
      default: return '?';
    }
  };

  return (
    <div 
      className={`font-mono overflow-hidden ${className}`}
      style={{ maxHeight }}
    >
      <div className="space-y-[1px] overflow-y-auto">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 border border-border bg-black/90"
            >
              {/* Transaction Header */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {getStatusSymbol(tx.status)}
                  </span>
                  <span className="uppercase">
                    {tx.type}
                  </span>
                </div>
                <span>
                  {formatAddress(tx.hash)}
                </span>
              </div>

              {/* Transaction Details */}
              <div className="mt-2 text-xs grid gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">FROM</span>
                  <span>{formatAddress(tx.from)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">TO</span>
                  <span>{formatAddress(tx.to)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">AMOUNT</span>
                  <span>{tx.amount} {tx.token}</span>
                </div>
              </div>

              {/* Transaction Footer */}
              <div className="mt-2 text-[10px] text-muted-foreground flex justify-between items-center">
                <span>
                  {formatDistance(tx.timestamp, new Date(), { addSuffix: true })}
                </span>
                <span className="uppercase">
                  {tx.status}
                </span>
              </div>

              {/* Progress Bar for Pending Transactions */}
              {tx.status === 'pending' && (
                <motion.div
                  className="mt-2 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
