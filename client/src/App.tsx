import { Sidebar } from "./components/layout/sidebar";
import { ComponentPage } from "./components/layout/component-page";
import { Download } from "lucide-react";

// Import components from our library
import {
  NetworkTopology,
  WalletConnectAnimation
} from "./lib/src";

// Import theme components
import { ThemeSwitcher } from "./components/ui/theme-switcher";

// Import local components
import { TokenScreener } from "./components/defi/token-screener";
import { OrderBook } from "./components/defi/order-book";
import { Terminal } from "./components/defi/terminal";

// Import page components
import { TerminalPage } from "./pages/Terminal";
import { CodeSnippetPage } from "./pages/CodeSnippet";

const NETWORK_TOPOLOGY_CODE = `import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';

interface Node {
  id: string;
  connections: string[];
  activity: number;
  latency: number;
  region: string;
  status: 'active' | 'syncing' | 'offline';
}

interface NetworkTopologyProps {
  nodes?: Node[];
  width?: number;
  height?: number;
  className?: string;
}

const NODE_ASCII = {
  active: \`┌───┐
│ ✓ │
└───┘\`,
  syncing: \`┌───┐
│ ↻ │
└───┘\`,
  offline: \`┌───┐
│ ✗ │
└───┘\`
};

export function NetworkTopology({
  nodes = [],
  width = 40,
  height = 20,
  className = ''
}: NetworkTopologyProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [scanline, setScanline] = useState(0);

  // Implementation details...

  return (
    <div className="space-y-4">
      {/* Component render logic... */}
    </div>
  );
}
`;

const WALLET_CONNECT_CODE = `import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, CheckCircle2, XCircle, Code } from 'lucide-react';

interface WalletConnectAnimationProps {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnect?: () => void;
  className?: string;
}

const ASCII_FRAMES = {
  disconnected: \`
  ┌───────────┐
  │  WALLET   │
  │ [LOCKED]  │
  └───────────┘\`,
  connecting: \`
  ┌───────────┐
  │ LINKING.. │
  │ [○○○○○○]  │
  └───────────┘\`,
  connected: \`
  ┌───────────┐
  │  SECURE   │
  │ [ACTIVE]  │
  └───────────┘\`,
  error: \`
  ┌───────────┐
  │  ACCESS   │
  │ [DENIED]  │
  └───────────┘\`
};

export function WalletConnectAnimation({
  status = 'disconnected',
  onConnect,
  className = ''
}: WalletConnectAnimationProps) {
  // Component implementation...

  return (
    <div className={className}>
      {/* Component render logic... */}
    </div>
  );
}
`;

const sampleAnalyticsData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - 1000 * 60 * 60 * (24 - i),
  price: 50000 + Math.random() * 20000,
}));

const sampleTransactions = [
  {
    id: '1',
    hash: '0xd912b483ab13894',
    type: 'swap' as const,
    amount: '1.5',
    token: 'SOL',
    status: 'confirmed' as const,
    timestamp: Date.now() - 1000 * 60 * 5,
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: '2',
    hash: '0xe832c274bc28973',
    type: 'receive' as const,
    amount: '100',
    token: 'USDC',
    status: 'pending' as const,
    timestamp: Date.now() - 1000 * 60 * 10,
    from: '0x2345678901abcdef2345678901abcdef23456789',
    to: '0xbcdef1234567890abcdef1234567890abcdef123',
  },
];

const samplePredictions = Array.from({ length: 5 }, (_, i) => ({
  timestamp: Date.now() + 1000 * 60 * 60 * (i + 1),
  predictedValue: 50 + (Math.random() - 0.5) * 10,
  confidence: 0.95 - (i * 0.15),
  trend: ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'sideways',
  metrics: {
    volatility: 0.2 + Math.random() * 0.3,
    momentum: -1 + Math.random() * 2,
    volume: 10000 + Math.random() * 5000,
  },
}));

const sampleMarketTrend = {
  symbol: 'SOL',
  changePercent: 12.5,
  price: 105.75,
  timeframe: '24h'
};

const sampleNetworkNodes = [
  {
    id: 'node1',
    connections: ['node2', 'node3'],
    activity: 0.8,
    latency: 50,
    region: 'US-WEST'
  },
  {
    id: 'node2',
    connections: ['node1', 'node4'],
    activity: 0.6,
    latency: 75,
    region: 'US-EAST'
  },
  {
    id: 'node3',
    connections: ['node1', 'node4', 'node5'],
    activity: 0.9,
    latency: 45,
    region: 'EU-WEST'
  },
  {
    id: 'node4',
    connections: ['node2', 'node3'],
    activity: 0.4,
    latency: 90,
    region: 'ASIA-EAST'
  },
  {
    id: 'node5',
    connections: ['node3'],
    activity: 0.7,
    latency: 60,
    region: 'US-WEST'
  }
];

const sampleOrderBook = {
  bids: Array.from({ length: 8 }, (_, i) => ({
    price: 49.5 - i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
    count: Math.floor(Math.random() * 10) + 1, 
  })),
  asks: Array.from({ length: 8 }, (_, i) => ({
    price: 50.5 + i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
    count: Math.floor(Math.random() * 10) + 1, 
  }))
};

let cumTotal = 0;
sampleOrderBook.bids.forEach(bid => {
  cumTotal += bid.size;
  bid.total = cumTotal;
});

cumTotal = 0;
sampleOrderBook.asks.forEach(ask => {
  cumTotal += ask.size;
  ask.total = cumTotal;
});

function App() {
  const handleDownload = async () => {
    try {
      window.location.href = '/api/download-project';
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="border-b border-border/20 p-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">⌃+T THEME</div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Project
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <ComponentPage
            title="DeFi Components"
            description="A retro-computing themed React component library for Solana blockchain interfaces."
            code=""
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NetworkTopology width={32} height={16} />
              <WalletConnectAnimation status="disconnected" />
              <TokenScreener />
              <OrderBook bids={sampleOrderBook.bids} asks={sampleOrderBook.asks} />
              <CodeSnippetPage />
              <TerminalPage />
            </div>
          </ComponentPage>
        </main>
      </div>
    </div>
  );
}

export default App;