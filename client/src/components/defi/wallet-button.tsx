import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WalletButtonProps {
  connected: boolean;
  onClick: () => void;
  address?: string;
}

export function WalletButton({ connected, onClick, address }: WalletButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        className="font-mono relative overflow-hidden border border-primary"
        variant="outline"
      >
        <span className="relative z-10">
          {connected ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {address ? 
                `${address.slice(0,4)}...${address.slice(-4)}` : 
                'Connected'
              }
            </span>
          ) : (
            'Connect Wallet'
          )}
        </span>

        <motion.div
          className="absolute inset-0 bg-primary/10"
          initial={false}
          animate={connected ? {
            opacity: [0, 0.2, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </Button>
    </motion.div>
  );
}
