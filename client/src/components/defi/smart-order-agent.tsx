import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, AlertCircle, CheckCircle2, Code, Cpu } from 'lucide-react';

interface OrderTemplate {
  id: string;
  name: string;
  description: string;
  syntax: string;
  example: string;
  asciiArt: string;
}

interface Order {
  id: string;
  type: 'market' | 'limit' | 'stop' | 'trailing';
  symbol: string;
  amount: number;
  price?: number;
  status: 'draft' | 'validating' | 'valid' | 'invalid' | 'executing' | 'completed' | 'failed';
  timestamp: number;
  validationMessage?: string;
  executionSteps?: string[];
}

interface SmartOrderAgentProps {
  className?: string;
}

export function SmartOrderAgent({ className = '' }: SmartOrderAgentProps) {
  const [commandInput, setCommandInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<OrderTemplate | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  const orderTemplates: OrderTemplate[] = [
    {
      id: '1',
      name: 'Market Buy',
      description: 'Execute immediate market buy order',
      syntax: 'BUY <amount> <symbol>',
      example: 'BUY 1.5 SOL',
      asciiArt: `
   [$] BUY
   ┌─────┐
   │ ▲▲▲ │
   │ >>> │
   └─────┘
      `
    },
    {
      id: '2',
      name: 'Limit Buy',
      description: 'Place limit buy order',
      syntax: 'LIMIT BUY <amount> <symbol> AT <price>',
      example: 'LIMIT BUY 2 SOL AT 50.5',
      asciiArt: `
   [£] LIMIT
   ┌─────┐
   │ ==> │
   │ $$$ │
   └─────┘
      `
    },
    {
      id: '3',
      name: 'Stop Loss',
      description: 'Set stop loss order',
      syntax: 'STOP <symbol> AT <price>',
      example: 'STOP SOL AT 45.0',
      asciiArt: `
   [!] STOP
   ┌─────┐
   │ *** │
   │ !!! │
   └─────┘
      `
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorPosition(prev => (prev + 1) % 2);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCommandSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && commandInput.trim()) {
      const parts = commandInput.trim().toUpperCase().split(' ');
      let newOrder: Order | null = null;

      try {
        if (parts[0] === 'BUY') {
          if (parts.length !== 3) throw new Error('Invalid market buy syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'market',
            symbol: parts[2],
            amount: parseFloat(parts[1]),
            status: 'validating',
            timestamp: Date.now(),
            executionSteps: []
          };
        } else if (parts[0] === 'LIMIT' && parts[1] === 'BUY') {
          if (parts.length !== 6 || parts[4] !== 'AT') throw new Error('Invalid limit buy syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'limit',
            symbol: parts[3],
            amount: parseFloat(parts[2]),
            price: parseFloat(parts[5]),
            status: 'validating',
            timestamp: Date.now(),
            executionSteps: []
          };
        } else if (parts[0] === 'STOP') {
          if (parts.length !== 4 || parts[2] !== 'AT') throw new Error('Invalid stop loss syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'stop',
            symbol: parts[1],
            amount: 0,
            price: parseFloat(parts[3]),
            status: 'validating',
            timestamp: Date.now(),
            executionSteps: []
          };
        } else {
          throw new Error('Unknown command');
        }

        if (isNaN(newOrder.amount) || (newOrder.price !== undefined && isNaN(newOrder.price))) {
          throw new Error('Invalid number format');
        }

      } catch (error) {
        newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'market',
          symbol: 'ERROR',
          amount: 0,
          status: 'invalid',
          timestamp: Date.now(),
          validationMessage: error instanceof Error ? error.message : 'Invalid command',
          executionSteps: []
        };
      }

      if (newOrder) {
        setOrders(prev => [...prev, newOrder!]);
        setCommandInput('');

        if (newOrder.status === 'validating') {
          setTimeout(() => {
            setOrders(prev =>
              prev.map(order =>
                order.id === newOrder!.id
                  ? {
                      ...order,
                      status: 'executing',
                      validationMessage: 'Order validated successfully',
                      executionSteps: ['Initializing order execution...']
                    }
                  : order
              )
            );

            const steps = [
              'Checking market conditions...',
              'Verifying available liquidity...',
              'Calculating optimal execution path...',
              'Preparing transaction payload...',
              'Broadcasting to network...'
            ];

            steps.forEach((step, index) => {
              setTimeout(() => {
                setOrders(prev =>
                  prev.map(order =>
                    order.id === newOrder!.id
                      ? {
                          ...order,
                          executionSteps: [...(order.executionSteps || []), step]
                        }
                      : order
                  )
                );
              }, (index + 1) * 1000);
            });

            setTimeout(() => {
              setOrders(prev =>
                prev.map(order =>
                  order.id === newOrder!.id
                    ? {
                        ...order,
                        status: Math.random() > 0.1 ? 'completed' : 'failed',
                        executionSteps: [
                          ...(order.executionSteps || []),
                          order.status === 'completed'
                            ? 'Order executed successfully!'
                            : 'Order execution failed: insufficient liquidity'
                        ]
                      }
                    : order
                )
              );
            }, (steps.length + 1) * 1000);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className={`terminal-container p-4 relative ${className}`}>
      <div
        className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
        style={{ top: `${scanLine}%` }}
      />

      <div className="terminal-header">
        ┌── SMART ORDER AGENT ──┐
      </div>

      <div className="space-y-4">
        <div className="border border-border/20 p-4">
          <div className="text-xs text-muted-foreground mb-2">Available Commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orderTemplates.map(template => (
              <motion.div
                key={template.id}
                className="text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout // Add layout animation
              >
                <pre className="mb-2 text-primary whitespace-pre">{template.asciiArt}</pre>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-bold">{template.syntax}</span>
                </div>
                <div className="text-muted-foreground ml-5 mt-1">
                  Example: {template.example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border border-border/20 p-4 h-[52px] flex items-center">
          <div className="flex items-center gap-2 font-mono w-full">
            <Terminal className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={handleCommandSubmit}
              className="bg-transparent border-none outline-none flex-1 text-sm min-w-0"
              placeholder="Enter order command..."
            />
            <span className="text-primary flex-shrink-0">
              {cursorPosition === 0 ? '█' : ' '}
            </span>
          </div>
        </div>

        <div className="border border-border/20 p-4">
          <div className="text-xs text-muted-foreground mb-2">Recent Orders:</div>
          <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="popLayout">
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 last:mb-0"
                >
                  <div className="flex items-center gap-2 text-xs font-mono h-6">
                    <div className="w-4 flex-shrink-0">
                      {order.status === 'validating' || order.status === 'executing' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Terminal className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      ) : order.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : order.status === 'failed' ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Code className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="flex-1 truncate">
                      {order.type.toUpperCase()} {order.amount} {order.symbol}
                      {order.price ? ` AT ${order.price}` : ''}
                    </span>
                    {order.validationMessage && (
                      <span className={`text-xs truncate max-w-[200px] ${
                        order.status === 'completed' ? 'text-green-500' :
                        order.status === 'failed' ? 'text-red-500' :
                        'text-yellow-500'
                      }`}>
                        - {order.validationMessage}
                      </span>
                    )}
                  </div>

                  {order.executionSteps && order.executionSteps.length > 0 && (
                    <motion.div
                      className="ml-6 border-l border-border/20 pl-4 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AnimatePresence mode="popLayout">
                        {order.executionSteps.map((step, index) => (
                          <motion.div
                            key={`${order.id}-step-${index}`}
                            initial={{ opacity: 0, x: -10, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 20 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-muted-foreground flex items-center gap-2 h-5 overflow-hidden"
                          >
                            <Cpu className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{step}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}