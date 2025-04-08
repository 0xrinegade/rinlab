import { Link, useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const components = [
  {
    category: 'Core Components',
    items: [
      { name: 'ASCII NFT Gallery', path: '/docs/ascii-nft-gallery' },
      { name: 'Terminal Portfolio', path: '/docs/terminal-portfolio' },
      { name: 'Mining Visualization', path: '/docs/mining-visualization' },
      { name: 'Token Swap Interface', path: '/docs/token-swap' },
      { name: 'Error Messages', path: '/docs/error-messages' },
    ]
  },
  {
    category: 'Data Visualization',
    items: [
      { name: 'Network Topology', path: '/docs/network-topology' },
      { name: 'Blockchain Visualizer', path: '/docs/blockchain-visualizer' },
      { name: 'Transaction Flow', path: '/docs/transaction-flow' },
      { name: 'Blockchain Heatmap', path: '/docs/blockchain-heatmap' },
    ]
  },
  {
    category: 'Interactive Elements',
    items: [
      { name: 'Wallet Connection', path: '/docs/wallet-connect' },
      { name: 'Order Book', path: '/docs/order-book' },
      { name: 'Price Chart', path: '/docs/price-chart' },
      { name: 'Token Input', path: '/docs/token-input' },
    ]
  }
];

export function DocsSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-r border-border/20 min-h-screen bg-muted/5">
      <ScrollArea className="h-screen py-6">
        <div className="px-4 mb-8">
          <h2 className="text-lg font-bold mb-2">rinlab</h2>
          <p className="text-sm text-muted-foreground">
            Retro DeFi Components
          </p>
        </div>

        <nav className="space-y-6">
          {components.map((category) => (
            <div key={category.category} className="px-4">
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                {category.category}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <a
                        className={cn(
                          "block text-sm py-1 px-2 rounded-sm transition-colors",
                          location === item.path
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/5 text-foreground/80"
                        )}
                      >
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
