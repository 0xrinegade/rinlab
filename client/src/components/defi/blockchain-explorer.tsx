import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Box, Link as LinkIcon, Hash, Clock } from 'lucide-react';

interface Block {
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  size: number;
  height: number;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
}

interface BlockchainExplorerProps {
  className?: string;
}

export function BlockchainExplorer({ className = '' }: BlockchainExplorerProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [scanLine, setScanLine] = useState(0);

  // Generate sample blockchain data
  useEffect(() => {
    const generateBlock = (height: number, prevHash: string): Block => ({
      hash: `0x${Math.random().toString(36).substr(2, 64)}`,
      previousHash: prevHash,
      timestamp: Date.now() - height * 1000 * 60,
      size: Math.floor(Math.random() * 1000000) + 500000,
      height,
      transactions: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
        hash: `0x${Math.random().toString(36).substr(2, 64)}`,
        from: `0x${Math.random().toString(36).substr(2, 40)}`,
        to: `0x${Math.random().toString(36).substr(2, 40)}`,
        amount: Math.random() * 10,
        fee: Math.random() * 0.01
      }))
    });

    const initialBlocks: Block[] = [];
    for (let i = 10; i >= 0; i--) {
      const prevHash = initialBlocks[initialBlocks.length - 1]?.hash || '0x0000000000000000';
      initialBlocks.push(generateBlock(i, prevHash));
    }
    setBlocks(initialBlocks);

    // Add new blocks periodically
    const interval = setInterval(() => {
      setBlocks(prev => {
        const newBlock = generateBlock(
          prev[prev.length - 1].height + 1,
          prev[prev.length - 1].hash
        );
        return [...prev.slice(1), newBlock];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatHash = (hash: string) =>
    `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── BLOCKCHAIN EXPLORER ──┐
      </div>

      <div className="terminal-grid relative min-h-[600px] overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Recent blocks list */}
          <div className="border border-border/20 p-4">
            <div className="text-xs mb-4">
              ┌── RECENT BLOCKS ──┐
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {blocks.map((block) => (
                  <motion.div
                    key={block.hash}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`
                      p-2 border terminal-border cursor-pointer
                      ${selectedBlock?.hash === block.hash ? 'bg-hover' : ''}
                    `}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        <span>Block {block.height}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(block.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {formatHash(block.hash)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Block details */}
          <div className="border border-border/20 p-4">
            <div className="text-xs mb-4">
              ┌── BLOCK DETAILS ──┐
            </div>
            {selectedBlock ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>Hash:</span>
                  </div>
                  <div className="text-muted-foreground font-mono">
                    {formatHash(selectedBlock.hash)}
                  </div>

                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <span>Previous:</span>
                  </div>
                  <div className="text-muted-foreground font-mono">
                    {formatHash(selectedBlock.previousHash)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Time:</span>
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(selectedBlock.timestamp).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>Size:</span>
                  </div>
                  <div className="text-muted-foreground">
                    {formatSize(selectedBlock.size)}
                  </div>
                </div>

                <div className="border-t border-border/20 pt-4 mt-4">
                  <div className="text-xs mb-2">
                    ┌── TRANSACTIONS [{selectedBlock.transactions.length}] ──┐
                  </div>
                  <div className="space-y-2">
                    {selectedBlock.transactions.map((tx, i) => (
                      <div 
                        key={tx.hash}
                        className="p-2 border terminal-border text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-primary">
                            TX #{i + 1}
                          </span>
                          <span className="text-muted-foreground">
                            {tx.amount.toFixed(4)} SOL
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          <div>From: {formatAddress(tx.from)}</div>
                          <div>To: {formatAddress(tx.to)}</div>
                          <div>Fee: {tx.fee.toFixed(6)} SOL</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                Select a block to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
