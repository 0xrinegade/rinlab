import { motion } from 'framer-motion';
import { TerminalContainer } from "@/components/layout/terminal-container";
import { PriceChart } from "./price-chart";
import { formatDistance } from 'date-fns';

interface AnalyticsData {
  timestamp: number;
  txVolume: number;
  gasPrice: number;
  activeAddresses: number;
  networkTps: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData[];
  className?: string;
}

export function AnalyticsDashboard({ 
  data,
  className = ''
}: AnalyticsDashboardProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  
  // Transform data for different charts
  const volumeData = data.map(d => ({ timestamp: d.timestamp, price: d.txVolume }));
  const gasData = data.map(d => ({ timestamp: d.timestamp, price: d.gasPrice }));
  const addressData = data.map(d => ({ timestamp: d.timestamp, price: d.activeAddresses }));
  const tpsData = data.map(d => ({ timestamp: d.timestamp, price: d.networkTps }));

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <TerminalContainer title="TRANSACTION VOLUME">
        <div className="p-4">
          <PriceChart data={volumeData} className="h-32" />
          <div className="mt-2 text-xs text-muted-foreground">
            Last 24h: {formatNumber(volumeData[volumeData.length - 1]?.price || 0)}
          </div>
        </div>
      </TerminalContainer>

      <TerminalContainer title="GAS PRICE (GWEI)">
        <div className="p-4">
          <PriceChart data={gasData} className="h-32" />
          <div className="mt-2 text-xs text-muted-foreground">
            Current: {formatNumber(gasData[gasData.length - 1]?.price || 0)}
          </div>
        </div>
      </TerminalContainer>

      <TerminalContainer title="ACTIVE ADDRESSES">
        <div className="p-4">
          <PriceChart data={addressData} className="h-32" />
          <div className="mt-2 text-xs text-muted-foreground">
            Total: {formatNumber(addressData[addressData.length - 1]?.price || 0)}
          </div>
        </div>
      </TerminalContainer>

      <TerminalContainer title="NETWORK TPS">
        <div className="p-4">
          <PriceChart data={tpsData} className="h-32" />
          <div className="mt-2 text-xs text-muted-foreground">
            Current: {formatNumber(tpsData[tpsData.length - 1]?.price || 0)}
          </div>
        </div>
      </TerminalContainer>
    </div>
  );
}
