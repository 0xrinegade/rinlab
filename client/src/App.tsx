import { Switch, Route } from "wouter";
import { TerminalContainer } from "@/components/layout/terminal-container";
import { TokenInput } from "@/components/defi/token-input";
import { WalletButton } from "@/components/defi/wallet-button";
import { PriceChart } from "@/components/defi/price-chart";
import { OrderBook } from "@/components/defi/order-book";
import { TransactionHistory } from "@/components/defi/transaction-history";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { NetworkTopology } from "@/components/defi/network-topology";

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


// Sample price data for the chart
const samplePriceData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - 1000 * 60 * 60 * (24 - i),
  price: 50 + Math.random() * 10,
}));

// Sample order book data (Reduced for brevity)
const sampleOrderBook = {
  bids: Array.from({ length: 8 }, (_, i) => ({
    price: 49.5 - i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
  })),
  asks: Array.from({ length: 8 }, (_, i) => ({
    price: 50.5 + i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0,
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

function App() {
  return (
    <Switch>
      <Route path="/">
        <div className="min-h-screen bg-background font-mono">
          <header className="border-b border-primary/20 p-4">
            <div className="flex justify-between items-center max-w-[1200px] mx-auto">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl vintage-glow ascii-border">SRCL DEFI</h1>
                <div className="text-xs text-muted-foreground terminal-text">
                  ⌃+T THEME
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <WalletButton 
                  connected={false}
                  onClick={() => console.log('connect wallet')}
                />
              </div>
            </div>
          </header>

          <main className="p-4 max-w-[1200px] mx-auto space-y-4 vintage-screen">
            {/* Analytics Dashboard */}
            <section>
              <h2 className="text-xs text-primary ascii-border mb-2">NETWORK ANALYTICS</h2>
              <TerminalContainer title="Transaction Volume" className="terminal-border">
                <div className="p-4">
                  <PriceChart data={sampleAnalyticsData} className="h-48" valueKey="txVolume" />
                </div>
              </TerminalContainer>
            </section>

            {/* Trading Interface */}
            <div className="grid grid-cols-2 gap-4">
              <section>
                <h2 className="text-xs text-primary ascii-border mb-2">TRADING</h2>
                <TerminalContainer title="Swap Tokens" className="terminal-border">
                  <div className="p-4 space-y-4">
                    <TokenInput
                      token="SOL"
                      balance="1.5"
                      onChange={(val) => console.log(val)}
                      max="1.5"
                    />
                    <TokenInput
                      token="USDC"
                      balance="100"
                      onChange={(val) => console.log(val)}
                    />
                  </div>
                </TerminalContainer>
              </section>

              <section>
                <h2 className="text-xs text-primary ascii-border mb-2">HISTORY</h2>
                <TerminalContainer title="Transactions" className="terminal-border">
                  <TransactionHistory 
                    transactions={sampleTransactions}
                    maxHeight="300px"
                    className="p-4"
                  />
                </TerminalContainer>
              </section>
            </div>
          </main>
        </div>
      </Route>
    </Switch>
  );
}

export default App;