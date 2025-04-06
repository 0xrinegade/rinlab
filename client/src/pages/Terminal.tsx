import React from 'react';
import { ComponentPage } from '../components/layout/component-page';
import { Terminal } from '../components/defi/terminal';

export function TerminalPage() {
  const description = 'A terminal interface component that provides an interactive command-line experience with a nostalgic retro aesthetic.';
  
  const code = `import { Terminal } from 'rinlab';

export function MyTerminal() {
  return (
    <Terminal 
      welcomeMessage="DeFi Terminal v1.0" 
      initialCommands={["help", "market", "balance"]} 
      height="500px"
      promptSymbol="$>"
    />
  );
}

// Available commands:
// help - Display available commands
// clear - Clear the terminal screen
// echo [text] - Echo text to the terminal
// date - Display current date and time
// version - Display terminal version
// ls - List files and directories
// cat [filename] - Display file contents
// balance - Show wallet balances
// trade [buy|sell] [amount] [token] - Execute a trade
// stats - Display network statistics
// market - Show market prices
// wallet [connect|disconnect] - Manage wallet connection`;

  return (
    <ComponentPage 
      title="Terminal"
      description={description}
      code={code}
    >
      <div className="grid gap-4">
        <Terminal 
          height="500px"
          initialCommands={["help", "market", "balance", "stats"]}
          welcomeMessage="DeFi Command Terminal v1.0.1"
        />
      </div>
    </ComponentPage>
  );
}