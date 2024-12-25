import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TerminalContainer } from '../layout/terminal-container';
import { Button } from '../ui/button';

interface WalletConnectAnimationProps {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnect?: () => void;
  className?: string;
}

const ASCII_FRAMES = {
  disconnected: `
  ┌───────────┐
  │  WALLET   │
  │ [LOCKED]  │
  └───────────┘`,
  connecting: `
  ┌───────────┐
  │ LINKING.. │
  │ [○○○○○○]  │
  └───────────┘`,
  connected: `
  ┌───────────┐
  │  SECURE   │
  │ [ACTIVE]  │
  └───────────┘`,
  error: `
  ┌───────────┐
  │  ACCESS   │
  │ [DENIED]  │
  └───────────┘`
};

export function WalletConnectAnimation({
  status = 'disconnected',
  onConnect,
  className = ''
}: WalletConnectAnimationProps) {
  const [dots, setDots] = useState('○○○○○○');

  useEffect(() => {
    if (status === 'connecting') {
      const interval = setInterval(() => {
        setDots(prev => {
          const dotCount = prev.split('○').length - 1;
          return '●'.repeat(dotCount % 6) + '○'.repeat(6 - (dotCount % 6));
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <TerminalContainer title="WALLET CONNECTION" className={className}>
      <div className="space-y-4">
        <pre className="font-mono text-xs whitespace-pre">
          {status === 'connecting' 
            ? ASCII_FRAMES.connecting.replace('○○○○○○', dots)
            : ASCII_FRAMES[status]
          }
        </pre>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {getStatusIcon()}
            <span className="capitalize">{status}</span>
          </div>

          {status === 'disconnected' && (
            <Button
              variant="retro"
              size="sm"
              onClick={onConnect}
              className="text-xs"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </TerminalContainer>
  );
}
