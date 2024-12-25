import { cn } from '../../utils';
import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
}

export function Grid({ children, cols = 1, gap = 4, className, ...props }: GridProps) {
  return (
    <div 
      className={cn(
        'grid',
        `grid-cols-${cols}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
