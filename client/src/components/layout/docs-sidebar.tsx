import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const components = [
  {
    category: 'Core Components',
    items: [
      { name: 'ASCII NFT Gallery' },
      { name: 'Terminal Portfolio' },
      { name: 'Mining Visualization' },
      { name: 'Token Swap Interface' },
      { name: 'Error Messages' },
    ]
  },
  {
    category: 'Data Visualization',
    items: [
      { name: 'Network Topology' },
      { name: 'Blockchain Visualizer' },
      { name: 'Transaction Flow' },
      { name: 'Blockchain Heatmap' },
    ]
  },
  {
    category: 'Interactive Elements',
    items: [
      { name: 'Wallet Connection' },
      { name: 'Order Book' },
      { name: 'Price Chart' },
      { name: 'Token Input' },
    ]
  }
];

export function DocsSidebar() {
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
                  <li key={item.name}>
                    <div
                      className={cn(
                        "block text-sm py-1 px-2 rounded-sm transition-colors cursor-pointer",
                        "hover:bg-primary/5 text-foreground/80"
                      )}
                    >
                      {item.name}
                    </div>
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
