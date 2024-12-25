import { motion } from 'framer-motion';

interface TerminalContainerProps {
  children: React.ReactNode;
  title?: string;
  shortcut?: string;
  className?: string;
}

export function TerminalContainer({ 
  children, 
  title,
  shortcut,
  className = ''
}: TerminalContainerProps) {
  return (
    <motion.div
      className={`relative border border-border bg-black/90 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {title && (
        <div 
          className="px-4 py-2 border-b border-border font-mono text-sm flex justify-between items-center"
        >
          <span className="text-foreground">▾{title.toUpperCase()}</span>
          {shortcut && (
            <span className="text-muted-foreground">
              {shortcut}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {children}
        <div className="terminal-scanline absolute inset-0 pointer-events-none" />
      </div>
    </motion.div>
  );
}