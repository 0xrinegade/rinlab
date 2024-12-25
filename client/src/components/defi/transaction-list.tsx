import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';

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
      <h3 className="text-sm text-muted-foreground mb-4">Recent Transactions</h3>
      
      <div className="space-y-2">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 border rounded bg-black/50"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span 
                    className={`w-2 h-2 rounded-full ${
                      tx.status === 'pending' ? 'bg-yellow-500' :
                      tx.status === 'confirmed' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}
                  />
                  <span className="text-sm">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </span>
                </div>
                
                <span className="text-sm">
                  {tx.amount} {tx.token}
                </span>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(tx.timestamp).toLocaleString()}
              </div>

              {tx.status === 'pending' && (
                <motion.div
                  className="mt-2 h-0.5 bg-primary/30"
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
