import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      className={`font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke="currentColor"
            strokeWidth={1.5}
            dot={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0].value;
              if (typeof value !== 'number') return null;

              return (
                <div className="bg-background border border-border p-2 text-xs">
                  <div className="text-foreground">
                    ${value.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    {new Date(payload[0].payload.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}