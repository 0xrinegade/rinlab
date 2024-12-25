import { NetworkTopology } from "@/components/defi/network-topology";
import { WalletConnectAnimation } from "@/components/defi/wallet-connect-animation";
import { BlockchainVisualizer } from "@/components/defi/blockchain-visualizer";
import { SmartOrderAgent } from "@/components/defi/smart-order-agent";
import { CodeSnippetHighlighter } from "@/components/defi/code-snippet-highlighter";

export function ComponentTest() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">DeFi Components</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Network Topology</h2>
          <NetworkTopology className="mb-8" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <WalletConnectAnimation 
            status="disconnected" 
            onConnect={() => {}} 
            className="mb-8"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Blockchain Visualizer</h2>
          <BlockchainVisualizer className="mb-8" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Smart Order Agent</h2>
          <SmartOrderAgent className="mb-8" />
        </section>
      </div>
    </div>
  );
}
