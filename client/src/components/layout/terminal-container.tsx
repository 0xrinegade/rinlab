import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

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
      className={`relative border ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: theme.colors.border,
      }}
    >
      {title && (
        <div 
          className="px-4 py-2 border-b font-mono text-sm flex justify-between items-center"
          style={{ borderColor: theme.colors.border }}
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