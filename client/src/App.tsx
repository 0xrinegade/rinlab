import { Switch, Route } from "wouter";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Sidebar } from "@/components/layout/sidebar";
import { TokenScreener } from "@/components/defi/token-screener";
import { OrderBook } from "@/components/defi/order-book";
import { PriceChart } from "@/components/defi/price-chart";
import { NetworkTopology } from "@/components/defi/network-topology";
import { TrendPredictor } from "@/components/defi/trend-predictor";
import { MemeGenerator } from "@/components/defi/meme-generator";
import { TokenInput } from "@/components/defi/token-input";
import { TransactionHistory } from "@/components/defi/transaction-history";
import { ColorPaletteSelector } from "@/components/ui/color-palette-selector";
import { BlockchainVisualizer } from "@/components/defi/blockchain-visualizer";
import { TransactionComplexity } from "@/components/defi/transaction-complexity";
import { BlockchainExplorer } from "@/components/defi/blockchain-explorer";
import { TransactionFlowChart } from "@/components/defi/transaction-flow-chart";
import { BlockchainHeatmap } from "@/components/defi/blockchain-heatmap";
import { PumpFunScreener } from "@/components/defi/pump-fun-screener";
import { NetworkStatusDashboard } from "@/components/defi/network-status-dashboard";
import { TransactionReplay } from "@/components/defi/transaction-replay";

// Sample analytics data
const sampleAnalyticsData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - 1000 * 60 * 60 * (24 - i),
  txVolume: 50000 + Math.random() * 20000,
}));

// Sample transaction data
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

// Sample prediction data
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

// Sample market trend data for meme generator
const sampleMarketTrend = {
  symbol: 'SOL',
  changePercent: 12.5,
  price: 105.75,
  timeframe: '24h'
};

// Sample network data
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

// Sample order book data
const sampleOrderBook = {
  bids: Array.from({ length: 8 }, (_, i) => ({
    price: 49.5 - i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
    count: Math.floor(Math.random() * 10) + 1, // Random number of orders between 1-10
  })),
  asks: Array.from({ length: 8 }, (_, i) => ({
    price: 50.5 + i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
    count: Math.floor(Math.random() * 10) + 1, // Random number of orders between 1-10
  }))
};

// Calculate cumulative totals
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

function ComponentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="prose prose-invert mb-8">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background font-mono">
      <header className="border-b border-border/20 p-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">⌃+T THEME</div>
        <ThemeSwitcher />
      </header>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen">
          <Switch>
            <Route path="/components/token-screener">
              <ComponentLayout>
                <h1>Token Screener</h1>
                <p>Real-time token screening with sorting and filtering capabilities.</p>
                <TokenScreener />
              </ComponentLayout>
            </Route>

            <Route path="/components/order-book">
              <ComponentLayout>
                <h1>Order Book</h1>
                <p>Live order book visualization with bids and asks.</p>
                <OrderBook bids={sampleOrderBook.bids} asks={sampleOrderBook.asks} />
              </ComponentLayout>
            </Route>

            <Route path="/components/price-chart">
              <ComponentLayout>
                <h1>Price Chart</h1>
                <p>Interactive price chart with customizable time ranges.</p>
                <PriceChart data={sampleAnalyticsData} valueKey="txVolume" />
              </ComponentLayout>
            </Route>

            <Route path="/components/network-topology">
              <ComponentLayout>
                <h1>Network Topology</h1>
                <p>Blockchain network visualization showing node connections and status.</p>
                <NetworkTopology nodes={sampleNetworkNodes} width={32} height={16} />
              </ComponentLayout>
            </Route>

            <Route path="/components/trend-predictor">
              <ComponentLayout>
                <h1>Trend Predictor</h1>
                <p>AI-powered market trend predictions with confidence levels.</p>
                <TrendPredictor predictions={samplePredictions} currentPrice={105.75} />
              </ComponentLayout>
            </Route>

            <Route path="/components/meme-generator">
              <ComponentLayout>
                <h1>Meme Generator</h1>
                <p>Market sentiment visualization through generated memes.</p>
                <MemeGenerator trend={sampleMarketTrend} />
              </ComponentLayout>
            </Route>

            <Route path="/components/token-input">
              <ComponentLayout>
                <h1>Token Input</h1>
                <p>Token amount input with balance display and max button.</p>
                <TokenInput token="SOL" balance="1.5" max="1.5" onChange={console.log} />
              </ComponentLayout>
            </Route>

            <Route path="/components/transaction-history">
              <ComponentLayout>
                <h1>Transaction History</h1>
                <p>Detailed transaction history with status indicators.</p>
                <TransactionHistory transactions={sampleTransactions} />
              </ComponentLayout>
            </Route>

            <Route path="/theme/colors">
              <ComponentLayout>
                <h1>Color Palette</h1>
                <p>Customize the theme colors for the entire application.</p>
                <ColorPaletteSelector />
              </ComponentLayout>
            </Route>
            <Route path="/components/blockchain-visualizer">
              <ComponentLayout>
                <h1>Blockchain Visualizer</h1>
                <p>Real-time visualization of blockchain transactions with retro-style animations.</p>
                <BlockchainVisualizer />
              </ComponentLayout>
            </Route>
            <Route path="/components/transaction-complexity">
              <ComponentLayout>
                <h1>Transaction Complexity</h1>
                <p>Visualize blockchain transaction complexity with retro computing metaphors.</p>
                <TransactionComplexity />
              </ComponentLayout>
            </Route>
            <Route path="/components/blockchain-explorer">
              <ComponentLayout>
                <h1>Blockchain Explorer</h1>
                <p>Explore blockchain data with a retro terminal-style interface.</p>
                <BlockchainExplorer />
              </ComponentLayout>
            </Route>
            <Route path="/components/transaction-flow">
              <ComponentLayout>
                <h1>Transaction Flow Chart</h1>
                <p>Animated blockchain transaction flow visualization with retro pixel art elements.</p>
                <TransactionFlowChart />
              </ComponentLayout>
            </Route>
            <Route path="/components/blockchain-heatmap">
              <ComponentLayout>
                <h1>Blockchain Heatmap</h1>
                <p>Color-coded visualization of blockchain activity with retro terminal aesthetics.</p>
                <BlockchainHeatmap />
              </ComponentLayout>
            </Route>
            <Route path="/components/pump-fun-screener">
              <ComponentLayout>
                <h1>Pump Fun Screener</h1>
                <p>Track meme coins and tokens with fun metrics in retro style.</p>
                <PumpFunScreener />
              </ComponentLayout>
            </Route>
            <Route path="/components/network-status">
              <ComponentLayout>
                <h1>Network Status Dashboard</h1>
                <p>Pixel art visualization of blockchain network node status and connectivity.</p>
                <NetworkStatusDashboard />
              </ComponentLayout>
            </Route>
            <Route path="/components/transaction-replay">
              <ComponentLayout>
                <h1>Transaction Replay</h1>
                <p>Retro terminal-style visualization and replay of blockchain transactions.</p>
                <TransactionReplay />
              </ComponentLayout>
            </Route>
            <Route>
              <ComponentLayout>
                <h1>SRCL DEFI Components</h1>
                <p>A retro-computing themed React component library for Solana blockchain interfaces.</p>
                <p>Select a component from the sidebar to view its documentation and demo.</p>
              </ComponentLayout>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;