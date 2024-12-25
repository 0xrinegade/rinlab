import { Switch, Route } from "wouter";
import { TerminalContainer } from "@/components/layout/terminal-container";
import { TokenInput } from "@/components/defi/token-input";
import { WalletButton } from "@/components/defi/wallet-button";
import { PriceChart } from "@/components/defi/price-chart";
import { OrderBook } from "@/components/defi/order-book";
import { TransactionHistory } from "@/components/defi/transaction-history";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

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
  {
    id: '3',
    hash: '0xf943d365cd39084',
    type: 'send' as const,
    amount: '50',
    token: 'USDT',
    status: 'failed' as const,
    timestamp: Date.now() - 1000 * 60 * 15,
    from: '0x3456789012abcdef3456789012abcdef34567890',
    to: '0xcdef1234567890abcdef1234567890abcdef1234',
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
    total: 0,
  })),
  asks: Array.from({ length: 12 }, (_, i) => ({
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
              <h2 className="text-xs text-muted-foreground mb-2">MARKET DATA</h2>
              <div className="grid grid-cols-2 gap-4">
                <TerminalContainer title="Price Chart">
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
              </div>
            </section>

            {/* Trading Interface */}
            <div className="grid grid-cols-2 gap-4">
              <section>
                <h2 className="text-xs text-muted-foreground mb-2">TRADING</h2>
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
              </section>

              <section>
                <h2 className="text-xs text-muted-foreground mb-2">HISTORY</h2>
                <TerminalContainer title="Transactions">
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