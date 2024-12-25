import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderTemplate {
  id: string;
  name: string;
  description: string;
  syntax: string;
  example: string;
}

interface Order {
  id: string;
  type: 'market' | 'limit' | 'stop' | 'trailing';
  symbol: string;
  amount: number;
  price?: number;
  status: 'draft' | 'validating' | 'valid' | 'invalid';
  timestamp: number;
  validationMessage?: string;
}

interface SmartOrderAgentProps {
  className?: string;
}

export function SmartOrderAgent({ className = '' }: SmartOrderAgentProps) {
  const [commandInput, setCommandInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<OrderTemplate | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Sample order templates
  const orderTemplates: OrderTemplate[] = [
    {
      id: '1',
      name: 'Market Buy',
      description: 'Execute immediate market buy order',
      syntax: 'BUY <amount> <symbol>',
      example: 'BUY 1.5 SOL'
    },
    {
      id: '2',
      name: 'Limit Buy',
      description: 'Place limit buy order',
      syntax: 'LIMIT BUY <amount> <symbol> AT <price>',
      example: 'LIMIT BUY 2 SOL AT 50.5'
    },
    {
      id: '3',
      name: 'Stop Loss',
      description: 'Set stop loss order',
      syntax: 'STOP <symbol> AT <price>',
      example: 'STOP SOL AT 45.0'
    }
  ];

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorPosition(prev => (prev + 1) % 2);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Process command input
  const handleCommandSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && commandInput.trim()) {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'market',
        symbol: 'SOL',
        amount: 1.0,
        status: 'validating',
        timestamp: Date.now()
      };

      setOrders(prev => [...prev, newOrder]);
      setCommandInput('');

      // Simulate order validation
      setTimeout(() => {
        setOrders(prev => 
          prev.map(order => 
            order.id === newOrder.id 
              ? {
                  ...order,
                  status: Math.random() > 0.2 ? 'valid' : 'invalid',
                  validationMessage: Math.random() > 0.2 
                    ? 'Order validated successfully'
                    : 'Invalid order parameters'
                }
              : order
          )
        );
      }, 1000);
    }
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── SMART ORDER AGENT ──┐
      </div>

      <div className="space-y-4">
        {/* Command templates */}
        <div className="border border-border/20 p-4">
          <div className="text-xs text-muted-foreground mb-2">Available Commands:</div>
          <div className="grid grid-cols-1 gap-2">
            {orderTemplates.map(template => (
              <motion.div
                key={template.id}
                className="text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-bold">{template.syntax}</span>
                </div>
                <div className="text-muted-foreground ml-5">
                  Example: {template.example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Command input */}
        <div className="border border-border/20 p-4">
          <div className="flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4" />
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={handleCommandSubmit}
              className="bg-transparent border-none outline-none flex-1 text-sm"
              placeholder="Enter order command..."
            />
            <span className="text-primary">
              {cursorPosition === 0 ? '█' : ' '}
            </span>
          </div>
        </div>

        {/* Order list */}
        <div className="border border-border/20 p-4">
          <div className="text-xs text-muted-foreground mb-2">Recent Orders:</div>
          <AnimatePresence>
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 text-xs font-mono mb-2"
              >
                {order.status === 'validating' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Terminal className="w-4 h-4" />
                  </motion.div>
                ) : order.status === 'valid' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span>
                  {order.type.toUpperCase()} {order.amount} {order.symbol}
                  {order.price ? ` AT ${order.price}` : ''}
                </span>
                {order.validationMessage && (
                  <span className={`text-xs ${
                    order.status === 'valid' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    - {order.validationMessage}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
