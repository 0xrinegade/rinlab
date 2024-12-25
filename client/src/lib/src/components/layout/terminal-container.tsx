import { cn } from '../../utils';
import React from 'react';

interface TerminalContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function TerminalContainer({ children, className, title }: TerminalContainerProps) {
  return (
    <div className={cn('font-mono border border-primary/20 rounded-sm bg-background', className)}>
      {title && (
        <div className="border-b border-primary/20 px-4 py-2 text-xs text-primary">
          ┌── {title.toUpperCase()} ──┐
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
