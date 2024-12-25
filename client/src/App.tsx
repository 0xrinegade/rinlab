import { Switch, Route } from "wouter";
import { RetroScreen } from "@/components/ui/retro-screen";
import { TerminalContainer } from "@/components/layout/terminal-container";
import { GridContainer } from "@/components/layout/grid-container";
import { TokenInput } from "@/components/defi/token-input";
import { WalletButton } from "@/components/defi/wallet-button";
import { TransactionList } from "@/components/defi/transaction-list";
import { PriceChart } from "@/components/defi/price-chart";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

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

function App() {
  return (
    <Switch>
      <Route path="/">
        <RetroScreen
          intensity={0.15}
          scanlineSpacing={2}
          noiseOpacity={0.05}
          glowRadius={30}
          glowColor="hsl(var(--primary))"
          curvature={0.1}
          className="min-h-screen bg-background"
        >
          <div className="p-4">
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

                <GridContainer columns={1} gap={4}>
                  <TerminalContainer title="Theme" shortcut="⌃+T">
                    <div className="p-4">
                      <ThemeSwitcher />
                    </div>
                  </TerminalContainer>

                  <TerminalContainer title="Market Data" shortcut="⌘+M">
                    <div className="p-4">
                      <PriceChart data={samplePriceData} />
                    </div>
                  </TerminalContainer>
                </GridContainer>
              </GridContainer>

              <TerminalContainer title="Transaction History" shortcut="⌘+H">
                <div className="p-4">
                  <TransactionList transactions={sampleTransactions} />
                </div>
              </TerminalContainer>
            </GridContainer>
          </div>
        </RetroScreen>
      </Route>
    </Switch>
  );
}

export default App;