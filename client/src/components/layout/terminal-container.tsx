import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';

interface TerminalContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function TerminalContainer({ 
  children, 
  title,
  className = ''
}: TerminalContainerProps) {
  return (
    <motion.div
      className={`relative border rounded-md overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: theme.colors.border,
      }}
    >
      {title && (
        <div 
          className="px-4 py-2 border-b font-mono text-sm"
          style={{ borderColor: theme.colors.border }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <span className="text-muted-foreground">
              {title}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        {children}
        <div className="terminal-scanline" />
      </div>
    </motion.div>
  );
}
