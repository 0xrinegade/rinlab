import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, AlertCircle, CheckCircle2, Code, Cpu, ChevronRight, HelpCircle } from 'lucide-react';

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
  type: 'market' | 'limit' | 'stop' | 'trailing' | 'dca' | 'smart';
  symbol: string;
  amount: number;
  price?: number;
  trailingPercent?: number;
  dcaLevels?: number;
  status: 'draft' | 'validating' | 'valid' | 'invalid' | 'executing' | 'completed' | 'failed';
  timestamp: number;
  validationMessage?: string;
  executionSteps?: string[];
}

interface Suggestion {
  command: string;
  description: string;
}

interface SmartOrderAgentProps {
  className?: string;
}

interface CommandTooltip {
  title: string;
  syntax: string;
  description: string;
  example: string;
}

export function SmartOrderAgent({ className = '' }: SmartOrderAgentProps) {
  const [commandInput, setCommandInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<OrderTemplate | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tooltipContent, setTooltipContent] = useState<CommandTooltip | null>(null);

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
      name: 'Smart TP/SL',
      description: 'Set smart take profit/stop loss with DCA',
      syntax: 'SMART <symbol> TP <price> SL <price> DCA <levels>',
      example: 'SMART SOL TP 120 SL 80 DCA 5',
      asciiArt: `
   [*] DCA
   ┌─────┐
   │ $↑↓ │
   │ >>> │
   └─────┘
      `
    },
    {
      id: '3',
      name: 'Trailing Orders',
      description: 'Set trailing take profit/stop loss',
      syntax: 'TRAIL <symbol> TP/SL <percent>',
      example: 'TRAIL SOL TP 5',
      asciiArt: `
   [%] TRAIL
   ┌─────┐
   │ ≈≈≈ │
   │ ^^^ │
   └─────┘
      `
    },
    {
      id: '4',
      name: 'Smart Exit',
      description: 'Exit based on whale activity',
      syntax: 'EXIT <symbol> ON <PROFIT/VOLUME/HOLDERS>',
      example: 'EXIT SOL ON PROFIT',
      asciiArt: `
   [!] EXIT
   ┌─────┐
   │ ⟱⟱⟱ │
   │ >>> │
   └─────┘
      `
    }
  ];

  const baseSuggestions: Suggestion[] = [
    { command: 'BUY 1.5 SOL', description: 'Market buy 1.5 SOL' },
    { command: 'SMART SOL TP 120 SL 80 DCA 5', description: 'Smart TP/SL with 5 DCA levels' },
    { command: 'TRAIL SOL TP 5', description: 'Trailing 5% take profit' },
    { command: 'TRAIL SOL SL 3', description: 'Trailing 3% stop loss' },
    { command: 'EXIT SOL ON PROFIT', description: 'Exit when profitable whales dump' },
    { command: 'EXIT SOL ON VOLUME', description: 'Exit when volume leaders dump' },
    { command: 'EXIT SOL ON HOLDERS', description: 'Exit when top holders dump' },
  ];

  const commandTooltips: Record<string, CommandTooltip> = {
    'BUY': {
      title: 'Market Buy Order',
      syntax: 'BUY <amount> <symbol>',
      description: 'Execute an immediate market buy order at current price',
      example: 'BUY 1.5 SOL'
    },
    'SMART': {
      title: 'Smart Take Profit/Stop Loss',
      syntax: 'SMART <symbol> TP <price> SL <price> DCA <levels>',
      description: 'Set smart take profit and stop loss with DCA levels',
      example: 'SMART SOL TP 120 SL 80 DCA 5'
    },
    'TRAIL': {
      title: 'Trailing Orders',
      syntax: 'TRAIL <symbol> <TP/SL> <percent>',
      description: 'Set trailing take profit or stop loss orders',
      example: 'TRAIL SOL TP 5'
    },
    'EXIT': {
      title: 'Smart Exit Strategy',
      syntax: 'EXIT <symbol> ON <PROFIT/VOLUME/HOLDERS>',
      description: 'Exit position based on whale activity',
      example: 'EXIT SOL ON PROFIT'
    }
  };

  useEffect(() => {
    if (!commandInput.trim()) {
      setSuggestions([]);
      setSelectedSuggestion(-1);
      return;
    }

    const filtered = baseSuggestions.filter(
      suggestion => suggestion.command.toLowerCase().includes(commandInput.toLowerCase())
    );

    const parts = commandInput.trim().toUpperCase().split(' ');
    if (parts[0] === 'BUY' && parts.length === 1) {
      filtered.push(
        { command: 'BUY 1.0 SOL', description: 'Market buy 1.0 SOL' },
        { command: 'BUY 2.0 ETH', description: 'Market buy 2.0 ETH' }
      );
    } else if (parts[0] === 'LIMIT' && parts.length === 1) {
      filtered.push(
        { command: 'LIMIT BUY 1.0 SOL AT 45.0', description: 'Limit buy 1.0 SOL at 45.0' },
        { command: 'LIMIT BUY 1.0 ETH AT 2000', description: 'Limit buy 1.0 ETH at 2000' }
      );
    }

    setSuggestions(filtered);
    setSelectedSuggestion(-1);
  }, [commandInput]);

  useEffect(() => {
    if (!commandInput.trim()) {
      setTooltipContent(null);
      return;
    }

    const command = commandInput.trim().toUpperCase().split(' ')[0];
    const tooltip = commandTooltips[command];

    if (tooltip) {
      setTooltipContent(tooltip);
    } else {
      setTooltipContent(null);
    }
  }, [commandInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) {
      if (e.key === 'Enter' && commandInput.trim()) {
        handleCommandSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Tab':
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          setCommandInput(suggestions[selectedSuggestion].command);
          setSuggestions([]);
          setSelectedSuggestion(-1);
          inputRef.current?.focus();
        } else if (e.key === 'Enter' && commandInput.trim()) {
          handleCommandSubmit(e);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedSuggestion(-1);
        break;
    }
  };

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
        } else if (parts[0] === 'SMART') {
          if (parts.length !== 8 || parts[2] !== 'TP' || parts[4] !== 'SL' || parts[6] !== 'DCA')
            throw new Error('Invalid smart order syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'smart',
            symbol: parts[1],
            amount: 0,
            price: parseFloat(parts[3]),
            status: 'validating',
            timestamp: Date.now(),
            dcaLevels: parseInt(parts[7]),
            executionSteps: []
          };
        } else if (parts[0] === 'TRAIL') {
          if (parts.length !== 4) throw new Error('Invalid trailing order syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'trailing',
            symbol: parts[1],
            amount: 0,
            trailingPercent: parseFloat(parts[3]),
            status: 'validating',
            timestamp: Date.now(),
            executionSteps: []
          };
        } else if (parts[0] === 'EXIT') {
          if (parts.length !== 4 || parts[2] !== 'ON') throw new Error('Invalid exit order syntax');
          newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'smart',
            symbol: parts[1],
            amount: 0,
            status: 'validating',
            timestamp: Date.now(),
            executionSteps: []
          };
        } else {
          throw new Error('Unknown command');
        }

        if (newOrder.amount < 0 || (newOrder.price !== undefined && newOrder.price <= 0)) {
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

            if (newOrder.type === 'smart' || newOrder.type === 'trailing') {
              steps.push('Setting up monitoring system...');
              steps.push('Configuring automated triggers...');
              steps.push('Initializing DCA levels...');
            }

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
                layout
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

        <div className="border border-border/20 p-4 relative h-[52px] flex items-center">
          <AnimatePresence>
            {tooltipContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 border border-border/20 bg-background/95 backdrop-blur-sm p-3 z-20"
              >
                <div className="relative">
                  <div className="text-xs text-primary mb-2 flex items-center gap-2">
                    <HelpCircle className="w-3 h-3" />
                    <span className="font-bold">{tooltipContent.title}</span>
                  </div>

                  <div className="text-border/40 text-xs mb-2">
                    ┌───────────────────────────────┐
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-mono">
                      <span className="text-muted-foreground">Syntax:</span>
                      <span className="text-primary ml-2">{tooltipContent.syntax}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <span className="ml-2">{tooltipContent.description}</span>
                    </div>
                    <div className="font-mono">
                      <span className="text-muted-foreground">Example:</span>
                      <span className="text-primary ml-2">{tooltipContent.example}</span>
                    </div>
                  </div>

                  <div className="text-border/40 text-xs mt-2">
                    └───────────────────────────────┘
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 font-mono w-full">
            <Terminal className="w-4 h-4 text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-sm min-w-0 h-6"
              placeholder="Enter order command..."
            />
            <span className="text-primary flex-shrink-0 w-2">
              {cursorPosition === 0 ? '█' : ' '}
            </span>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-[calc(100%+1px)] border border-border/20 bg-background/95 backdrop-blur-sm z-10 max-h-[200px] overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.command}
                    className={`p-2 text-xs font-mono cursor-pointer flex items-center gap-2 h-8
                      ${index === selectedSuggestion ? 'bg-primary/10 text-primary' : 'hover:bg-hover'}
                    `}
                    onClick={() => {
                      setCommandInput(suggestion.command);
                      setSuggestions([]);
                      setSelectedSuggestion(-1);
                      inputRef.current?.focus();
                    }}
                  >
                    <ChevronRight className={`w-3 h-3 ${
                      index === selectedSuggestion ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className="flex-1 truncate">{suggestion.command}</span>
                    <span className="text-muted-foreground truncate">{suggestion.description}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
                      {order.trailingPercent && ` TRAIL ${order.trailingPercent}%`}
                      {order.dcaLevels && ` DCA ${order.dcaLevels}`}
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