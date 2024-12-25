import { Line } from 'recharts';
import { theme } from '@/lib/theme';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface PriceData {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  width?: number;
  height?: number;
  className?: string;
}

export function PriceChart({ 
  data,
  width = 400,
  height = 200,
  className
}: PriceChartProps) {
  const config = {
    price: {
      label: 'Price',
      color: theme.colors.primary,
    },
  };

  return (
    <div className={`font-mono ${className}`}>
      <ChartContainer
        config={config}
        className="text-xs"
        style={{ width, height }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop 
              offset="0%" 
              stopColor={theme.colors.primary} 
              stopOpacity={0.4}
            />
            <stop 
              offset="100%" 
              stopColor={theme.colors.primary} 
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <Line
          type="monotone"
          data={data}
          dataKey="price"
          stroke={theme.colors.primary}
          strokeWidth={1.5}
          dot={false}
          fill="url(#gradient)"
        />

        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </ChartContainer>
    </div>
  );
}