import { Switch, Route } from "wouter";
import { TerminalContainer } from "@/components/layout/terminal-container";
import { GridContainer } from "@/components/layout/grid-container";
import { TokenInput } from "@/components/defi/token-input";
import { WalletButton } from "@/components/defi/wallet-button";
import { TransactionList } from "@/components/defi/transaction-list";
import { PriceChart } from "@/components/defi/price-chart";

const sampleTransactions = [
  {
    id: '1',
    type: 'send',
    amount: '1.5',
    token: 'SOL',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: '2',
    type: 'receive',
    amount: '100',
    token: 'USDC',
    status: 'pending',
    timestamp: Date.now() - 1000 * 60 * 10,
  },
];

const samplePriceData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: Date.now() - 1000 * 60 * 60 * (24 - i),
  price: 50 + Math.random() * 10,
}));

function App() {
  return (
    <Switch>
      <Route path="/">
        <div className="min-h-screen bg-background p-4">
          <GridContainer columns={1} gap={4}>
            <header className="flex justify-between items-center border-b border-border pb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-mono">SRCL DEFI</h1>
                <div className="text-xs text-muted-foreground">
                  ⌃+T THEME
                </div>
              </div>
              <WalletButton 
                connected={false}
                onClick={() => console.log('connect wallet')}
              />
            </header>

            <GridContainer columns={2} gap={4}>
              <TerminalContainer title="Token Swap" shortcut="⌘+S">
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

              <TerminalContainer title="Market Data" shortcut="⌘+M">
                <div className="p-4">
                  <PriceChart data={samplePriceData} />
                </div>
              </TerminalContainer>
            </GridContainer>

            <TerminalContainer title="Transaction History" shortcut="⌘+H">
              <div className="p-4">
                <TransactionList transactions={sampleTransactions} />
              </div>
            </TerminalContainer>
          </GridContainer>
        </div>
      </Route>
    </Switch>
  );
}

export default App;