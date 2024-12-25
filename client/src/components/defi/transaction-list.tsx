import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: string;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="font-mono">
      <div className="space-y-2">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 border border-border"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">▸</span>
                  <span>
                    {tx.type.toUpperCase()}
                  </span>
                </div>

                <span>
                  {tx.amount} {tx.token}
                </span>
              </div>

              <div className="mt-1 text-[10px] text-muted-foreground flex justify-between items-center">
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
                <span>{tx.status.toUpperCase()}</span>
              </div>

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