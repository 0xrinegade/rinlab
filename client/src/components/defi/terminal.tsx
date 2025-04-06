import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme';

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
  const { currentPalette } = useTheme();
  const [lines, setLines] = useState<string[]>([
    welcomeMessage,
    "Type 'help' for available commands.",
    ""
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Available commands
  const commands: Record<string, (args: string[]) => string[]> = {
    help: () => ['Available commands: help, clear, echo, date, version, ls, cat, balance, trade, stats, market, wallet'],
    clear: () => {
      setLines([]);
      return [];
    },
    echo: (args) => [args.join(' ')],
    date: () => [new Date().toLocaleString()],
    version: () => ['Retro Terminal v1.0.1'],
    ls: () => ['assets/  cache/  contracts/  logs/  memes/  wallets/  trades/'],
    cat: (args) => args[0] ? [`Reading file ${args[0]}...`, 'Permission denied'] : ['Usage: cat <filename>'],
    balance: () => ['SOL: 45.32', 'USDC: 1,203.45', 'BTC: 0.0023', 'ETH: 1.21'],
    trade: (args) => {
      if (args.length < 3) return ['Usage: trade [buy|sell] [amount] [token]'];
      const [action, amount, token] = args;
      if (action !== 'buy' && action !== 'sell') return ['Invalid action. Use "buy" or "sell"'];
      return [
        `Order submitted: ${action} ${amount} ${token.toUpperCase()}`,
        `Transaction hash: Bk9ja32qZm5nP7Vkp93Yz4RjMQaB6h...`
      ];
    },
    stats: () => ['Network Status: Operational', 'TPS: 4,532', 'Validators: 1,875', 'Total Value Locked: $3.21B'],
    market: () => [
      'SOL/USD: $142.35 (+2.4%)',
      'BTC/USD: $54,231.78 (-0.8%)',
      'ETH/USD: $3,892.45 (+1.2%)',
      'JUP/USD: $0.82 (+5.6%)'
    ],
    wallet: (args) => {
      if (args.length === 0) return ['Connected wallet: 8xmHG3eRpv...', 'Use "wallet connect" or "wallet disconnect"'];
      if (args[0] === 'connect') return ['Wallet connected: 8xmHG3eRpvSQqj6onXWv9QvRdjRhMRBqRdJK6XNYX2Ns'];
      if (args[0] === 'disconnect') return ['Wallet disconnected'];
      return ['Unknown wallet command. Try "wallet connect" or "wallet disconnect"'];
    }
  };

  // Execute a command and update terminal lines
  const executeCommand = (commandStr: string) => {
    if (!commandStr.trim()) return;
    
    const [cmd, ...args] = commandStr.trim().split(' ');
    const cmdFn = commands[cmd.toLowerCase()];
    
    // Record in history
    setHistory(prev => [...prev, commandStr]);
    setHistoryIndex(-1);
    
    // Add command to terminal lines
    setLines(prev => [...prev, `${promptSymbol} ${commandStr}`]);
    
    // Execute command and add output
    if (cmdFn) {
      const output = cmdFn(args);
      setLines(prev => [...prev, ...output]);
    } else {
      setLines(prev => [...prev, `Command not found: ${cmd}`]);
    }
    
    // Add empty line after command output
    setLines(prev => [...prev, '']);
    
    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 10);
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setShowSuggestions(false);
      e.preventDefault();
    }
    
    // Handle Up Arrow for history navigation
    else if (e.key === 'ArrowUp') {
      const newIndex = Math.min(history.length - 1, historyIndex + 1);
      if (newIndex >= 0 && history.length > 0) {
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex]);
      }
      e.preventDefault();
    }
    
    // Handle Down Arrow for history navigation
    else if (e.key === 'ArrowDown') {
      const newIndex = Math.max(-1, historyIndex - 1);
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setCurrentInput(history[history.length - 1 - newIndex]);
      } else {
        setCurrentInput('');
      }
      e.preventDefault();
    }
    
    // Handle Tab key for auto-completion
    else if (e.key === 'Tab') {
      if (suggestions.length > 0) {
        setCurrentInput(suggestions[0]);
        setShowSuggestions(false);
      }
      e.preventDefault();
    }
  };

  // Update command suggestions when input changes
  useEffect(() => {
    if (currentInput.trim()) {
      const firstWord = currentInput.trim().split(' ')[0];
      const matchingCommands = Object.keys(commands).filter(cmd => 
        cmd.startsWith(firstWord.toLowerCase()) && cmd !== firstWord
      );
      
      if (matchingCommands.length > 0) {
        setSuggestions(matchingCommands);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [currentInput]);

  // Execute initial commands if provided
  useEffect(() => {
    if (initialCommands.length > 0) {
      setTimeout(() => {
        initialCommands.forEach(cmd => {
          executeCommand(cmd);
        });
      }, 500);
    }
  }, []);

  // Auto-focus input on mount
  useEffect(() => {
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  // Return focus to input when clicking inside terminal
  const handleTerminalClick = () => {
    const inputElement = document.getElementById('terminal-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <motion.div
      className={`relative rounded-md overflow-hidden border border-primary/30 ${className}`}
      style={{ height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleTerminalClick}
    >
      {/* Terminal header */}
      <div className="bg-black text-xs text-primary/70 px-2 py-1 border-b border-primary/30 flex items-center">
        <div className="flex gap-1.5 mr-2">
          <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
        </div>
        <span className="font-mono">terminal@rinlab:~</span>
      </div>
      
      {/* Terminal body */}
      <div 
        ref={terminalRef}
        className="w-full h-[calc(100%-2rem)] overflow-auto bg-black font-mono p-2 text-primary"
        style={{ fontSize: '14px' }}
      >
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
        <div className="flex items-start">
          <span className="mr-1">{promptSymbol}</span>
          <input
            id="terminal-input"
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none border-none text-primary flex-1 px-0 py-0 h-[1.2em] min-w-[1px]"
            style={{ 
              caretColor: currentPalette.colors.primary,
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
      
      {/* Scanline effect */}
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
                  setCurrentInput(suggestion);
                  setShowSuggestions(false);
                  const inputElement = document.getElementById('terminal-input');
                  if (inputElement) {
                    inputElement.focus();
                  }
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