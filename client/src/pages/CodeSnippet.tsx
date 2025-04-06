import { useState } from 'react';
import { CodeSnippetHighlighter } from '../lib/src/components/defi/code-snippet-highlighter';
import { Terminal } from '../components/defi/terminal';

const sampleCode = `// Example Solana wallet connection
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

async function connectWallet() {
  try {
    // Initialize Solana connection
    const connection = new Connection(clusterApiUrl('devnet'));
    
    // Create and connect the wallet adapter
    const wallet = new PhantomWalletAdapter();
    await wallet.connect();
    
    // Get wallet public key
    const publicKey = wallet.publicKey;
    console.log('Connected to wallet:', publicKey.toString());
    
    // Get account balance
    const balance = await connection.getBalance(publicKey);
    console.log('Account balance:', balance / 1000000000, 'SOL');
    
    return { publicKey, balance };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Call the function to connect
connectWallet().then(result => {
  // Display results in UI
  document.getElementById('wallet-address').textContent = result.publicKey.toString();
  document.getElementById('wallet-balance').textContent = \`\${result.balance / 1000000000} SOL\`;
});`;

export function CodeSnippetPage() {
  const [output, setOutput] = useState<string[]>([
    '> Welcome to the Retro Terminal',
    '> Type "help" for a list of commands',
  ]);
  
  const handleLineExecution = (lineNumber: number, code: string) => {
    setOutput(prev => [
      ...prev, 
      `> Executing line ${lineNumber}:`, 
      `$ ${code}`,
      `[Line ${lineNumber}] Simulated code execution...`,
      lineNumber === 10 ? '✓ Connected to Phantom wallet: Gw5zrR...Uzh7' : '...'
    ]);
  };
  
  return (
    <div className="container mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-4">Code Snippet Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Interactive Code Snippet</h2>
          <CodeSnippetHighlighter 
            code={sampleCode} 
            title="SOLANA WALLET CONNECT"
            language="typescript"
            onExecuteLine={handleLineExecution}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Terminal Output</h2>
          <Terminal 
            className="h-[600px]"
            initialCommands={output}
            promptSymbol="$>"
          />
        </div>
      </div>
    </div>
  );
}