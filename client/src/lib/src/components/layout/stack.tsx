import { cn } from '../../utils';
import React from 'react';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: number;
  direction?: 'row' | 'column';
}

export function Stack({ 
  children, 
  gap = 4, 
  direction = 'column',
  className,
  ...props 
}: StackProps) {
  return (
    <div 
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
