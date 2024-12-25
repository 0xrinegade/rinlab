import { motion } from 'framer-motion';
import { formatDistance } from 'date-fns';

interface Prediction {
  timestamp: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'sideways';
  metrics: {
    volatility: number;
    momentum: number;
    volume: number;
  };
}

interface TrendPredictorProps {
  predictions: Prediction[];
  currentPrice: number;
  className?: string;
}

export function TrendPredictor({ 
  predictions,
  currentPrice,
  className = '' 
}: TrendPredictorProps) {
  const getTrendSymbol = (trend: Prediction['trend']) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'sideways': return '→';
    }
  };

  const getConfidenceBar = (confidence: number) => {
    const barLength = Math.floor(confidence * 20);
    return `${'█'.repeat(barLength)}${'░'.repeat(20 - barLength)}`;
  };

  return (
    <div className={`font-mono space-y-4 ${className}`}>
      {/* Current State */}
      <div className="border border-[hsl(150_100%_50%)] bg-black/90 p-4">
        <div className="text-xs text-muted-foreground mb-2">CURRENT PRICE</div>
        <div className="text-2xl text-[hsl(150_100%_50%)]">
          ${currentPrice.toFixed(2)}
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-[1px]">
        {predictions.map((prediction, i) => (
          <motion.div
            key={prediction.timestamp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 border border-[hsl(150_100%_50%)/20] bg-black/90"
          >
            {/* Prediction Header */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(150_100%_50%)]">
                {getTrendSymbol(prediction.trend)} ${prediction.predictedValue.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                {formatDistance(prediction.timestamp, new Date(), { addSuffix: true })}
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="mt-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>CONFIDENCE</span>
                <span>{(prediction.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="text-[hsl(150_100%_50%)] mt-1">
                {getConfidenceBar(prediction.confidence)}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
              <div>
                VOL: {prediction.metrics.volatility.toFixed(2)}
              </div>
              <div>
                MOM: {prediction.metrics.momentum.toFixed(2)}
              </div>
              <div>
                VOL: {prediction.metrics.volume.toFixed(0)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
