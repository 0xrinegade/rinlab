import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';
import 'xterm/css/xterm.css';

interface TerminalProps {
  className?: string;
  initialCommands?: string[];
  welcomeMessage?: string;
  promptSymbol?: string;
  height?: string;
}

export function Terminal({ 
  className = '', 
  initialCommands = [], 
  welcomeMessage = 'Retro Terminal Interface v1.0.1', 
  promptSymbol = '>', 
  height = '300px'
}: TerminalProps): JSX.Element {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const { currentPalette } = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commands] = useState<Record<string, (args: string[]) => string>>({
    help: () => 'Available commands: help, clear, echo, date, version, ls, cat, balance, trade, stats, market, wallet',
    clear: () => {
      if (xtermRef.current) {
        xtermRef.current.clear();
      }
      return '';
    },
    echo: (args) => args.join(' '),
    date: () => new Date().toLocaleString(),
    version: () => 'Retro Terminal v1.0.1',
    ls: () => 'assets/  cache/  contracts/  logs/  memes/  wallets/  trades/',
    cat: (args) => args[0] ? `Reading file ${args[0]}...\nPermission denied` : 'Usage: cat <filename>',
    balance: () => 'SOL: 45.32\nUSDC: 1,203.45\nBTC: 0.0023\nETH: 1.21',
    trade: (args) => {
      if (args.length < 3) return 'Usage: trade [buy|sell] [amount] [token]';
      const [action, amount, token] = args;
      if (action !== 'buy' && action !== 'sell') return 'Invalid action. Use "buy" or "sell"';
      return `Order submitted: ${action} ${amount} ${token.toUpperCase()}\nTransaction hash: Bk9ja32qZm5nP7Vkp93Yz4RjMQaB6h...`;
    },
    stats: () => 'Network Status: Operational\nTPS: 4,532\nValidators: 1,875\nTotal Value Locked: $3.21B',
    market: () => 'SOL/USD: $142.35 (+2.4%)\nBTC/USD: $54,231.78 (-0.8%)\nETH/USD: $3,892.45 (+1.2%)\nJUP/USD: $0.82 (+5.6%)',
    wallet: (args) => {
      if (args.length === 0) return 'Connected wallet: 8xmHG3eRpv...\nUse "wallet connect" or "wallet disconnect"';
      if (args[0] === 'connect') return 'Wallet connected: 8xmHG3eRpvSQqj6onXWv9QvRdjRhMRBqRdJK6XNYX2Ns';
      if (args[0] === 'disconnect') return 'Wallet disconnected';
      return 'Unknown wallet command. Try "wallet connect" or "wallet disconnect"';
    }
  });

  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Need to prevent re-initialization with same ref
    if (xtermRef.current) {
      xtermRef.current.dispose();
    }
    
    // Initialize xterm with safe defaults
    xtermRef.current = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'monospace',
      rows: 20,
      cols: 80,
      theme: {
        background: '#000000',
        foreground: currentPalette.colors.foreground,
        cursor: currentPalette.colors.primary,
        cursorAccent: '#000000',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
      }
    });
    
    try {
      // Open the terminal
      xtermRef.current.open(terminalRef.current);
      
      // Write welcome message
      xtermRef.current.writeln('');
      xtermRef.current.writeln(`${welcomeMessage}`);
      xtermRef.current.writeln('Type "help" for available commands.');
      xtermRef.current.writeln('');
      xtermRef.current.write(`${promptSymbol} `);
      
      // Handle terminal input
      xtermRef.current.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
        
        // Handle Enter key
        if (domEvent.key === 'Enter') {
          xtermRef.current?.writeln('');
          if (input.trim()) {
            executeCommand(input.trim());
            setHistory((prev) => [...prev, input.trim()]);
            setHistoryIndex(-1);
          }
          setInput('');
          xtermRef.current?.write(`${promptSymbol} `);
        }
        // Handle Backspace key
        else if (domEvent.key === 'Backspace') {
          if (input.length > 0) {
            xtermRef.current?.write('\b \b');
            setInput(input.slice(0, -1));
          }
        }
        // Handle Up Arrow for history navigation
        else if (domEvent.key === 'ArrowUp') {
          const newIndex = Math.min(history.length - 1, historyIndex + 1);
          if (newIndex >= 0 && history.length > 0) {
            setHistoryIndex(newIndex);
            clearInput();
            const historyCommand = history[history.length - 1 - newIndex];
            setInput(historyCommand);
            xtermRef.current?.write(historyCommand);
          }
        }
        // Handle Down Arrow for history navigation
        else if (domEvent.key === 'ArrowDown') {
          const newIndex = Math.max(-1, historyIndex - 1);
          setHistoryIndex(newIndex);
          clearInput();
          if (newIndex >= 0) {
            const historyCommand = history[history.length - 1 - newIndex];
            setInput(historyCommand);
            xtermRef.current?.write(historyCommand);
          }
        }
        // Handle printable characters
        else if (printable) {
          xtermRef.current?.write(key);
          const newInput = input + key;
          setInput(newInput);
          
          // Update suggestions
          if (newInput.length > 0) {
            const availableCommands = Object.keys(commands);
            const matchingCommands = availableCommands.filter(cmd => 
              cmd.startsWith(newInput.split(' ')[0])
            );
            
            if (matchingCommands.length > 0 && matchingCommands[0] !== newInput) {
              setSuggestions(matchingCommands);
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          } else {
            setShowSuggestions(false);
          }
        }
        
        // Handle Tab key for auto-completion
        else if (domEvent.key === 'Tab') {
          domEvent.preventDefault();
          if (suggestions.length > 0) {
            clearInput();
            const suggestion = suggestions[0];
            setInput(suggestion);
            xtermRef.current?.write(suggestion);
            setShowSuggestions(false);
          }
        }
      });
      
      // Execute initial commands if provided
      if (initialCommands.length > 0) {
        setTimeout(() => {
          initialCommands.forEach((cmd) => {
            xtermRef.current?.writeln('');
            xtermRef.current?.write(`${promptSymbol} ${cmd}`);
            xtermRef.current?.writeln('');
            executeCommand(cmd);
            xtermRef.current?.write(`${promptSymbol} `);
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error initializing terminal:', error);
    }
    
    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, [welcomeMessage, promptSymbol, initialCommands, currentPalette, commands, history, historyIndex, input]);
  
  const clearInput = () => {
    // Clear current input in terminal
    for (let i = 0; i < input.length; i++) {
      xtermRef.current?.write('\b \b');
    }
    setInput('');
  };
  
  const executeCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    if (cmd in commands) {
      const output = commands[cmd](args);
      if (output) {
        xtermRef.current?.writeln(output);
      }
    } else {
      xtermRef.current?.writeln(`Command not found: ${cmd}`);
    }
  };

  return (
    <motion.div 
      className={`relative rounded-md overflow-hidden border border-primary/30 ${className}`}
      style={{ height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black text-xs text-primary/70 px-2 py-1 border-b border-primary/30 flex items-center">
        <div className="flex gap-1.5 mr-2">
          <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
        </div>
        <span className="font-mono">terminal@rinlab:~</span>
      </div>
      <div 
        ref={terminalRef} 
        className="w-full h-full overflow-auto bg-black"
      />
      <div className="absolute inset-0 pointer-events-none terminal-scanline opacity-10"></div>
      
      {/* Command suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-8 bottom-0 mb-2 bg-background/80 backdrop-blur-sm border border-primary/30 rounded text-xs p-1">
          <div className="flex flex-col">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div 
                key={suggestion} 
                className={`px-2 py-1 ${index === 0 ? 'text-primary' : 'text-muted-foreground'} hover:bg-hover/50 cursor-pointer`}
                onClick={() => {
                  clearInput();
                  setInput(suggestion);
                  xtermRef.current?.write(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion} {index === 0 && <span className="text-muted-foreground text-[10px] ml-1">(Tab)</span>}
              </div>
            ))}
          </div>
          <div className="border-t border-primary/20 text-[10px] px-2 py-1 text-muted-foreground">
            Press Tab to autocomplete
          </div>
        </div>
      )}
    </motion.div>
  );
}