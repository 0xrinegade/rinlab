import { theme } from '@/lib/theme';

interface GridContainerProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export function GridContainer({
  children,
  columns = 1,
  gap = 4,
  className = '',
}: GridContainerProps) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap * parseInt(theme.spacing.grid)}px`,
      }}
    >
      {children}
    </div>
  );
}
