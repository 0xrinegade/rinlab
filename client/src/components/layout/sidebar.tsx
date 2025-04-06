import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const categories = [
    {
      title: "Components",
      items: [
        { name: "Smart Order Agent" },
        { name: "ASCII NFT Gallery" },
        { name: "Pump Fun Screener" },
        { name: "Network Status" },
        { name: "Transaction Replay" },
        { name: "Token Screener" },
        { name: "Order Book" },
        { name: "Price Chart" },
        { name: "Network Topology" },
        { name: "Blockchain Visualizer" },
        { name: "Transaction Complexity" },
        { name: "Blockchain Explorer" },
        { name: "Transaction Flow" },
        { name: "Blockchain Heatmap" },
        { name: "Trend Predictor" },
        { name: "Meme Generator" },
        { name: "Token Input" },
        { name: "Transaction History" },
        { name: "Contribution Leaderboard" },
        { name: "Terminal" },
        { name: "Code Snippet" }
      ]
    },
    {
      title: "Theme",
      items: [
        { name: "Color Palette" },
        { name: "Typography" }
      ]
    }
  ];

  return (
    <div className={cn("w-64 border-r border-border/20 h-screen overflow-y-auto font-mono", className)}>
      <div className="p-4 border-b border-border/20">
        <div className="text-lg font-bold">RINLAB DEFI</div>
        <div className="text-xs text-muted-foreground">Component Library</div>
      </div>
      <div className="p-4">
        {categories.map((category) => (
          <div key={category.title} className="mb-6">
            <div className="text-xs text-muted-foreground mb-2">{category.title}</div>
            {category.items.map((item) => (
              <div
                key={item.name}
                className={cn(
                  "block py-1 px-2 text-sm hover:bg-hover transition-colors cursor-pointer"
                )}
              >
                {item.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}