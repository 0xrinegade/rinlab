import { motion } from 'framer-motion';

interface Order {
  price: number;
  size: number;
  total: number;
}

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
  precision?: number;
  maxRows?: number;
  className?: string;
}

export function OrderBook({ 
  bids, 
  asks, 
  precision = 2,
  maxRows = 12,
  className = '' 
}: OrderBookProps) {
  const formatNumber = (num: number) => num.toFixed(precision);
  
  const maxTotal = Math.max(
    ...bids.map(o => o.total),
    ...asks.map(o => o.total)
  );

  const renderOrders = (orders: Order[], type: 'bid' | 'ask') => {
    return orders.slice(0, maxRows).map((order, i) => (
      <motion.div
        key={`${type}-${i}`}
        initial={{ opacity: 0, x: type === 'bid' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid grid-cols-3 text-right py-1 text-xs relative"
      >
        {/* Depth visualization */}
        <div 
          className={`absolute inset-0 ${type === 'bid' ? 'bg-primary/10' : 'bg-destructive/10'}`}
          style={{
            width: `${(order.total / maxTotal) * 100}%`,
            right: type === 'ask' ? 0 : 'auto',
            left: type === 'bid' ? 0 : 'auto'
          }}
        />

        {/* Order data */}
        <span className={type === 'bid' ? 'text-primary' : 'text-destructive'}>
          {formatNumber(order.price)}
        </span>
        <span className="text-muted-foreground">{formatNumber(order.size)}</span>
        <span className="text-muted-foreground">{formatNumber(order.total)}</span>
      </motion.div>
    ));
  };

  return (
    <div className={`font-mono ${className}`}>
      {/* Column headers */}
      <div className="grid grid-cols-3 text-right pb-2 text-xs text-muted-foreground border-b border-border">
        <span>PRICE</span>
        <span>SIZE</span>
        <span>TOTAL</span>
      </div>

      {/* Asks (sells) */}
      <div className="space-y-[1px]">
        {renderOrders(asks.slice().reverse(), 'ask')}
      </div>

      {/* Spread */}
      <div className="text-xs text-center py-2 text-muted-foreground">
        Spread: {formatNumber(Math.abs(asks[0]?.price - bids[0]?.price))}
      </div>

      {/* Bids (buys) */}
      <div className="space-y-[1px]">
        {renderOrders(bids, 'bid')}
      </div>
    </div>
  );
}
