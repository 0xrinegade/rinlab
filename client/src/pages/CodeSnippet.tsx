import { CodeSnippetHighlighter } from '../lib/src/components/defi/code-snippet-highlighter';

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
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Interactive Code Snippet</h2>
      <CodeSnippetHighlighter 
        code={sampleCode} 
        title="SOLANA WALLET CONNECT"
        language="typescript"
        interactive={true}
      />
    </div>
  );
}