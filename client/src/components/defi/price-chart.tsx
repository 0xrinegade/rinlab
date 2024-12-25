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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(150 100% 50%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(150 100% 50%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(150 100% 50%)"
            strokeWidth={1.5}
            dot={false}
            fill="url(#colorPrice)"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const value = payload[0].value;
              if (typeof value !== 'number') return null;

              return (
                <div className="bg-black border border-[hsl(150_100%_50%)] p-2 text-xs">
                  <div className="text-[hsl(150_100%_50%)]">
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