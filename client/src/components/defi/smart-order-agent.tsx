import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, AlertCircle, CheckCircle2, Code, Cpu, ChevronRight, HelpCircle, Save, Bookmark, X, Download, Upload, Copy, Share2, ThumbsUp, Medal, Trophy, Users, Star, Award, Target, Zap, Crown } from 'lucide-react';

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

interface StrategyPreset {
  id: string;
  name: string;
  command: string;
  description: string;
  tags: string[];
}

interface CommandTooltip {
  title: string;
  syntax: string;
  description: string;
  example: string;
}

interface ImportedStrategies {
  version: string;
  timestamp: number;
  presets: StrategyPreset[];
}

interface CommunityStrategy extends StrategyPreset {
  creator: string;
  votes: number;
  popularity: number;
  createdAt: number;
  performance: {
    wins: number;
    losses: number;
    avgReturn: number;
  };
}

interface SmartOrderAgentProps {
  className?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trader' | 'strategist' | 'community' | 'master';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  unlockedAt?: number;
  pixelArt: string;
  animation?: string[];
}

interface LeaderboardEntry {
  id: string;
  username: string;
  rank: number;
  score: number;
  winRate: number;
  pixelAvatar: string;
  achievements: Achievement[];
  recentTrades: {
    type: 'win' | 'loss';
    amount: number;
    timestamp: number;
  }[];
  level: number;
  experience: number;
}

export function SmartOrderAgent({ className = '' }: SmartOrderAgentProps) {
  const [commandInput, setCommandInput] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<OrderTemplate | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showPresets, setShowPresets] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [presets, setPresets] = useState<StrategyPreset[]>([
    {
      id: '1',
      name: 'DCA Runner',
      command: 'SMART SOL TP 120 SL 80 DCA 5',
      description: 'DCA strategy with take profit and stop loss',
      tags: ['DCA', 'TP/SL']
    },
    {
      id: '2',
      name: 'Whale Tracker',
      command: 'EXIT SOL ON PROFIT',
      description: 'Exit when profitable whales dump',
      tags: ['Exit', 'Whales']
    },
    {
      id: '3',
      name: 'Trail Master',
      command: 'TRAIL SOL TP 5',
      description: 'Trailing take profit at 5%',
      tags: ['Trail', 'TP']
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tooltipContent, setTooltipContent] = useState<CommandTooltip | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCommunity, setShowCommunity] = useState(false);
  const [communityStrategies, setCommunityStrategies] = useState<CommunityStrategy[]>([
    {
      id: 'c1',
      name: 'Mega Whale Tracker',
      command: 'EXIT SOL ON PROFIT',
      description: 'Exit when whales take profit',
      tags: ['Whale', 'Exit'],
      creator: 'CryptoWizard',
      votes: 128,
      popularity: 0.92,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      performance: {
        wins: 42,
        losses: 12,
        avgReturn: 15.5
      }
    },
    {
      id: 'c2',
      name: 'DCA King',
      command: 'SMART SOL TP 150 SL 70 DCA 7',
      description: 'Advanced DCA with wide range',
      tags: ['DCA', 'Smart'],
      creator: 'TradeBot9000',
      votes: 89,
      popularity: 0.85,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      performance: {
        wins: 38,
        losses: 15,
        avgReturn: 12.8
      }
    },
    {
      id: 'c3',
      name: 'Volume Master',
      command: 'EXIT SOL ON VOLUME',
      description: 'Track volume leaders',
      tags: ['Volume', 'Exit'],
      creator: 'AlgoTrader',
      votes: 67,
      popularity: 0.78,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      performance: {
        wins: 31,
        losses: 14,
        avgReturn: 9.4
      }
    }
  ]);

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

  const handleSavePreset = () => {
    if (!commandInput.trim() || !presetNameInput.trim()) return;

    const newPreset: StrategyPreset = {
      id: Math.random().toString(36).substr(2, 9),
      name: presetNameInput,
      command: commandInput,
      description: 'Custom trading strategy',
      tags: ['Custom']
    };

    setPresets(prev => [...prev, newPreset]);
    setPresetNameInput('');
    setShowPresets(false);
    checkAchievements('strategy');
  };

  const handleLoadPreset = (preset: StrategyPreset) => {
    setCommandInput(preset.command);
    setShowPresets(false);
    inputRef.current?.focus();
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
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
        checkAchievements('order');

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

  const handleExportStrategies = () => {
    const exportData: ImportedStrategies = {
      version: '1.0',
      timestamp: Date.now(),
      presets: presets
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-strategies-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportStrategies = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported: ImportedStrategies = JSON.parse(content);

        if (!imported.version || !imported.timestamp || !Array.isArray(imported.presets)) {
          throw new Error('Invalid strategy file format');
        }

        setPresets(prev => {
          const existing = new Set(prev.map(p => p.command));
          const newPresets = imported.presets.filter(p => !existing.has(p.command));
          return [...prev, ...newPresets];
        });

        setImportError(null);
        setShowImportExport(false);
      } catch (error) {
        setImportError('Failed to import strategies. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleShareStrategy = () => {
    if (!commandInput.trim() || !presetNameInput.trim()) return;

    const newStrategy: CommunityStrategy = {
      id: Math.random().toString(36).substr(2, 9),
      name: presetNameInput,
      command: commandInput,
      description: 'Custom trading strategy',
      tags: ['Custom'],
      creator: 'You',
      votes: 0,
      popularity: 0,
      createdAt: Date.now(),
      performance: {
        wins: 0,
        losses: 0,
        avgReturn: 0
      }
    };

    setCommunityStrategies(prev => [newStrategy, ...prev]);
    setPresetNameInput('');
    setShowCommunity(true);
  };

  const handleVoteStrategy = (strategyId: string) => {
    setCommunityStrategies(prev =>
      prev.map(strategy =>
        strategy.id === strategyId
          ? { ...strategy, votes: strategy.votes + 1 }
          : strategy
      )
    );
    checkAchievements('vote');
  };

  const [showAchievements, setShowAchievements] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-order',
      name: 'First Steps',
      description: 'Execute your first trading order',
      category: 'trader',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'common',
      icon: '🎯',
      pixelArt: `
   ⭐️ FIRST
   ┌─────┐
   │ >>> │
   │ $$$ │
   └─────┘
      `,
      animation: [
        `┌─────┐
         │  *  │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │ *   │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │   * │
         │ >>> │
         └─────┘`
      ]
    },
    {
      id: 'strategy-master',
      name: 'Strategy Master',
      description: 'Create 5 custom trading strategies',
      category: 'strategist',
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      rarity: 'rare',
      icon: '🧠',
      pixelArt: `
   🧠 MASTER
   ┌─────┐
   │ >>> │
   │ ⚡️⚡️⚡️ │
   └─────┘
      `,
      animation: [
        `┌─────┐
         │ ⚡️   │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │  ⚡️  │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │   ⚡️ │
         │ >>> │
         └─────┘`
      ]
    },
    {
      id: 'community-star',
      name: 'Community Star',
      description: 'Get 100 votes on your strategies',
      category: 'community',
      progress: 0,
      maxProgress: 100,
      unlocked: false,
      rarity: 'legendary',
      icon: '⭐️',
      pixelArt: `
   ⭐️ STAR
   ┌─────┐
   │ >>> │
   │ 💫💫💫 │
   └─────┘
      `,
      animation: [
        `┌─────┐
         │ 💫   │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │  💫  │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │   💫 │
         │ >>> │
         └─────┘`
      ]
    },
    {
      id: 'diamond-hands',
      name: 'Diamond Hands',
      description: 'Hold a position for over 24 hours',
      category: 'trader',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'rare',
      icon: '💎',
      pixelArt: `
   💎 HOLD
   ┌─────┐
   │ >>> │
   │ 💎💎💎 │
   └─────┘
      `,
      animation: [
        `┌─────┐
         │ 💎   │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │  💎  │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │   💎 │
         │ >>> │
         └─────┘`
      ]
    },
    {
      id: 'profit-master',
      name: 'Profit Master',
      description: 'Achieve 10 profitable trades in a row',
      category: 'master',
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      rarity: 'legendary',
      icon: '👑',
      pixelArt: `
   👑 PROFIT
   ┌─────┐
   │ >>> │
   │ 🔥🔥🔥 │
   └─────┘
      `,
      animation: [
        `┌─────┐
         │ 🔥   │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │  🔥  │
         │ >>> │
         └─────┘`,
        `┌─────┐
         │   🔥 │
         │ >>> │
         └─────┘`
      ]
    }
  ]);

  const checkAchievements = (action: 'order' | 'strategy' | 'vote') => {
    const newAchievements = achievements.map(achievement => {
      let shouldUpdate = false;
      let newProgress = achievement.progress;

      switch (action) {
        case 'order':
          if (achievement.id === 'first-order') {
            newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
            shouldUpdate = true;
          }
          break;
        case 'strategy':
          if (achievement.id === 'strategy-master') {
            newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
            shouldUpdate = true;
          }
          break;
        case 'vote':
          if (achievement.id === 'community-star') {
            newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        const justUnlocked = !achievement.unlocked && newProgress >= achievement.maxProgress;
        if (justUnlocked) {
          setRecentAchievement({
            ...achievement,
            progress: newProgress,
            unlocked: true,
            unlockedAt: Date.now()
          });
        }

        return {
          ...achievement,
          progress: newProgress,
          unlocked: newProgress >= achievement.maxProgress,
          unlockedAt: justUnlocked ? Date.now() : achievement.unlockedAt
        };
      }

      return achievement;
    });

    setAchievements(newAchievements);
  };


  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: 'l1',
      username: 'CryptoLegend',
      rank: 1,
      score: 15000,
      winRate: 0.75,
      pixelAvatar: `
   ┌────┐
   │ 👑 │
   │ 😎 │
   └────┘`,
      achievements: [],
      recentTrades: [
        { type: 'win', amount: 500, timestamp: Date.now() - 1000 * 60 * 30 },
        { type: 'win', amount: 300, timestamp: Date.now() - 1000 * 60 * 60 },
        { type: 'loss', amount: -100, timestamp: Date.now() - 1000 * 60 * 90 }
      ],
      level: 42,
      experience: 8750
    },
    {
      id: 'l2',
      username: 'PixelTrader',
      rank: 2,
      score: 12000,
      winRate: 0.70,
      pixelAvatar: `
   ┌────┐
   │ 🥈 │
   │ 🤖 │
   └────┘`,
      achievements: [],
      recentTrades: [
        { type: 'win', amount: 400, timestamp: Date.now() - 1000 * 60 * 45 },
        { type: 'loss', amount: -200, timestamp: Date.now() - 1000 * 60 * 75 },
        { type: 'win', amount: 300, timestamp: Date.now() - 1000 * 60 * 105 }
      ],
      level: 38,
      experience: 7200
    },
    {
      id: 'l3',
      username: 'RetroWhale',
      rank: 3,
      score: 10000,
      winRate: 0.65,
      pixelAvatar: `
   ┌────┐
   │ 🥉 │
   │ 🐋 │
   └────┘`,
      achievements: [],
      recentTrades: [
        { type: 'win', amount: 350, timestamp: Date.now() - 1000 * 60 * 40 },
        { type: 'win', amount: 250, timestamp: Date.now() - 1000 * 60 * 70 },
        { type: 'loss', amount: -150, timestamp: Date.now() - 1000 * 60 * 100 }
      ],
      level: 35,
      experience: 6500
    }
  ]);

  // Achievement animation logic
  const [currentAnimationFrame, setCurrentAnimationFrame] = useState(0);

  useEffect(() => {
    if (recentAchievement?.animation) {
      const interval = setInterval(() => {
        setCurrentAnimationFrame(prev => (prev + 1) % recentAchievement.animation!.length);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [recentAchievement]);

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
            <button
              onClick={() => setShowPresets(prev => !prev)}
              className="p-1 hover:bg-muted rounded"
            >
              <Bookmark className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={() => setShowImportExport(prev => !prev)}
              className="p-1 hover:bg-muted rounded"
            >
              <Download className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={() => setShowCommunity(prev => !prev)}
              className="p-1 hover:bg-muted rounded"
            >
              <Users className="w-4 h-4 text-primary" />
            </button>
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

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-[calc(100%+1px)] border border-border/20 bg-background/95 backdrop-blur-sm z-30 p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={presetNameInput}
                      onChange={e => setPresetNameInput(e.target.value)}
                      placeholder="Preset name..."
                      className="bg-transparent border border-border/20 rounded px-2 py-1 text-xs min-w-0 flex-1"
                    />
                    <button
                      onClick={handleSavePreset}
                      disabled={!commandInput.trim() || !presetNameInput.trim()}
                      className="p-1 hover:bg-muted rounded disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Saved Presets:</div>
                    {presets.map(preset => (
                      <motion.div
                        key={preset.id}
                        className="flex items-center gap-2 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <button
                          onClick={() => handleLoadPreset(preset)}
                          className="flex-1 text-left hover:bg-muted p-2 rounded text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{preset.name}</span>
                            <div className="flex gap-1">
                              {preset.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-1 bg-primary/10 text-primary rounded text-[10px]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-muted-foreground mt-1 font-mono">
                            {preset.command}
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-destructive" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
      <AnimatePresence>
        {showCommunity && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-[calc(100%+1px)] border border-border/20 bg-background/95 backdrop-blur-sm z-30 p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-primary flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>COMMUNITY ARCADE</span>
                </div>
                <button
                  onClick={handleShareStrategy}
                  disabled={!commandInput.trim() || !presetNameInput.trim()}
                  className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-muted rounded disabled:opacity-50"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share Strategy</span>
                </button>
              </div>

              <div className="space-y-2">
                {communityStrategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id}
                    className="border border-border/20 p-3 rounded"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{strategy.name}</span>
                          {index === 0 && (
                            <Medal className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          by {strategy.creator} • {new Date(strategy.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleVoteStrategy(strategy.id)}
                        className="flex items-center gap-1 text-xs hover:text-primary transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{strategy.votes}</span>
                      </button>
                    </div>

                    <pre className="mt-2 p-2 bg-muted/20 rounded text-xs font-mono overflow-x-auto">
                      {strategy.command}
                    </pre>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex gap-1">
                        {strategy.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-1 bg-primary/10 text-primary rounded text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span>Wins: {strategy.performance.wins}</span>
                        <span>Avg Return: {strategy.performance.avgReturn}%</span>
                      </div>
                    </div>

                    <div className="mt-2 h-1 bg-muted overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${strategy.popularity * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement notification */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 p-4 bg-background/95 backdrop-blur-sm border border-primary rounded-lg shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="font-mono text-primary">
                <pre className="whitespace-pre">
                  {recentAchievement.animation
                    ? recentAchievement.animation[currentAnimationFrame]
                    : recentAchievement.pixelArt}
                </pre>
              </div>
              <div>
                <div className="text-primary font-bold">{recentAchievement.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {recentAchievement.description}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500">Achievement Unlocked!</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Panel */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 bg-background/95 backdrop-blur-sm border border-primary rounded-lg shadow-lg overflow-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-primary font-bold">Achievement Gallery</div>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    className={`p-4 border rounded ${
                      achievement.unlocked
                        ? 'border-primary bg-primary/5'
                        : 'border-muted bg-muted/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="font-mono mb-2">
                      <pre className="whitespace-pre text-primary">
                        {achievement.pixelArt}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-primary">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`
                          px-2 py-1 rounded
                          ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-500' :
                            achievement.rarity === 'rare' ? 'bg-purple-500/20 text-purple-500' :
                              'bg-blue-500/20 text-blue-500'}
                        `}>
                          {achievement.rarity.toUpperCase()}
                        </div>
                        <div className="text-muted-foreground">
                          {achievement.progress} / {achievement.maxProgress}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}