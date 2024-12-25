import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';

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

const LOADING_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function WalletConnectAnimation({ 
  status = 'disconnected',
  onConnect,
  className = ''
}: WalletConnectAnimationProps) {
  const [loadingFrame, setLoadingFrame] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [copied, setCopied] = useState(false);

  // Animate loading spinner
  useEffect(() => {
    if (status === 'connecting') {
      const interval = setInterval(() => {
        setLoadingFrame(prev => (prev + 1) % LOADING_FRAMES.length);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Scanline effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = async () => {
    try {
      const componentCode = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface WalletConnectAnimationProps {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnect?: () => void;
  className?: string;
}

export function WalletConnectAnimation({
  status = 'disconnected',
  onConnect,
  className = ''
}: WalletConnectAnimationProps) {
  // Component implementation
}`;

      await navigator.clipboard.writeText(componentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative p-4 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="terminal-header">
          ┌── WALLET CONNECTION ──┐
        </div>

        <button
          onClick={handleCopyCode}
          className="px-2 py-1 border border-primary/20 hover:bg-primary/10 text-primary text-xs flex items-center gap-2 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <pre className="font-mono">
                ┌──────┐
                │COPIED│
                └──────┘
              </pre>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <pre className="font-mono">
                ┌──────┐
                │EXPORT│
                └──────┘
              </pre>
            </>
          )}
        </button>
      </div>

      {/* Scanline effect */}
      <div
        className="absolute w-full h-[2px] bg-primary/10 pointer-events-none"
        style={{ top: `${scanLine}%` }}
      />

      <motion.div
        className="relative border border-border/20 p-4 font-mono"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <pre className="text-xs whitespace-pre">
          {ASCII_FRAMES[status]}
        </pre>

        <AnimatePresence mode="wait">
          {status === 'disconnected' && (
            <motion.button
              onClick={onConnect}
              className="mt-4 w-full p-2 border border-primary/20 hover:bg-primary/10 text-primary text-xs flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="w-4 h-4" />
              CONNECT WALLET
            </motion.button>
          )}

          {status === 'connecting' && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-primary text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="font-mono">{LOADING_FRAMES[loadingFrame]}</span>
              ESTABLISHING CONNECTION...
            </motion.div>
          )}

          {status === 'connected' && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-green-500 text-xs"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              WALLET CONNECTED
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-red-500 text-xs"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <XCircle className="w-4 h-4" />
              CONNECTION FAILED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection steps */}
        {status === 'connecting' && (
          <motion.div 
            className="mt-4 text-[10px] text-muted-foreground space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-primary">▶</span>
              Initializing secure channel...
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">▶</span>
              Verifying wallet signature...
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">▶</span>
              Establishing connection...
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}