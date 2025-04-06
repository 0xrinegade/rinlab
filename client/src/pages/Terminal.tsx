import { Terminal } from '../components/defi/terminal';

export function TerminalPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Interactive Terminal</h2>
      <Terminal 
        height="500px"
        initialCommands={["help", "market", "balance"]}
        welcomeMessage="DeFi Command Terminal v1.0.1"
      />
    </div>
  );
}