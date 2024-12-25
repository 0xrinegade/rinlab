import { Switch, Route } from "wouter";
import { RetroScreen } from "@/components/ui/retro-screen";
import { TerminalContainer } from "@/components/layout/terminal-container";
import { GridContainer } from "@/components/layout/grid-container";
import { TokenInput } from "@/components/defi/token-input";
import { WalletButton } from "@/components/defi/wallet-button";
import { TransactionList } from "@/components/defi/transaction-list";
import { PriceChart } from "@/components/defi/price-chart";
import { OrderBook } from "@/components/defi/order-book";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

// Sample data
const sampleTransactions = [
  {
    id: '1',
    type: 'send' as const,
    amount: '1.5',
    token: 'SOL',
    status: 'confirmed' as const,
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    type: 'receive' as const,
    amount: '100',
    token: 'USDC',
    status: 'pending' as const,
    timestamp: Date.now() - 1000 * 60 * 10,
  },
];

const samplePriceData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - 1000 * 60 * 60 * (24 - i),
  price: 50 + Math.random() * 10,
}));

// Sample order book data
const sampleOrderBook = {
  bids: Array.from({ length: 12 }, (_, i) => ({
    price: 49.5 - i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0, // Will be calculated
  })),
  asks: Array.from({ length: 12 }, (_, i) => ({
    price: 50.5 + i * 0.1,
    size: Math.random() * 100 + 50,
    total: 0, // Will be calculated
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
          <header className="border-b border-border p-4">
            <div className="flex justify-between items-center max-w-[1200px] mx-auto">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl">SRCL DEFI</h1>
                <div className="text-xs text-muted-foreground">
                  ⌃+T THEME
                </div>
              </div>
              <WalletButton 
                connected={false}
                onClick={() => console.log('connect wallet')}
              />
            </div>
          </header>

          <main className="p-4 max-w-[1200px] mx-auto space-y-4">
            {/* Market Overview */}
            <section>
              <h2 className="text-xs text-muted-foreground mb-2">UPDATING</h2>
              <div className="grid grid-cols-3 gap-4">
                <TerminalContainer title="Market Data">
                  <div className="p-4">
                    <PriceChart data={samplePriceData} className="h-48" />
                  </div>
                </TerminalContainer>

                <TerminalContainer title="Order Book">
                  <div className="p-4">
                    <OrderBook 
                      bids={sampleOrderBook.bids} 
                      asks={sampleOrderBook.asks} 
                      className="h-48"
                    />
                  </div>
                </TerminalContainer>

                <TerminalContainer title="Recent Transactions">
                  <div className="p-4">
                    <TransactionList transactions={sampleTransactions} />
                  </div>
                </TerminalContainer>
              </div>
            </section>

            {/* Trading Interface */}
            <section>
              <h2 className="text-xs text-muted-foreground mb-2">TRADING</h2>
              <div className="grid grid-cols-2 gap-4">
                <TerminalContainer title="Swap Tokens">
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

                <TerminalContainer title="Theme Settings">
                  <div className="p-4">
                    <ThemeSwitcher />
                  </div>
                </TerminalContainer>
              </div>
            </section>
          </main>
        </div>
      </Route>
    </Switch>
  );
}

export default App;