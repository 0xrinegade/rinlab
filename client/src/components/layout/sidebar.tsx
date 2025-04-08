import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const [location] = useLocation();

  const categories = [
    {
      title: "Components",
      items: [
        { name: "Smart Order Agent", path: "/components/smart-order-agent" },
        { name: "ASCII NFT Gallery", path: "/components/ascii-nft-gallery" },
        { name: "Pump Fun Screener", path: "/components/pump-fun-screener" },
        { name: "Network Status", path: "/components/network-status" },
        { name: "Transaction Replay", path: "/components/transaction-replay" },
        { name: "Token Screener", path: "/components/token-screener" },
        { name: "Order Book", path: "/components/order-book" },
        { name: "Price Chart", path: "/components/price-chart" },
        { name: "Network Topology", path: "/components/network-topology" },
        { name: "Blockchain Visualizer", path: "/components/blockchain-visualizer" },
        { name: "Transaction Complexity", path: "/components/transaction-complexity" },
        { name: "Blockchain Explorer", path: "/components/blockchain-explorer" },
        { name: "Transaction Flow", path: "/components/transaction-flow" },
        { name: "Blockchain Heatmap", path: "/components/blockchain-heatmap" },
        { name: "Trend Predictor", path: "/components/trend-predictor" },
        { name: "Meme Generator", path: "/components/meme-generator" },
        { name: "Token Input", path: "/components/token-input" },
        { name: "Transaction History", path: "/components/transaction-history" },
        { name: "Contribution Leaderboard", path: "/components/contribution-leaderboard" },
        { name: "Terminal", path: "/components/terminal" }
      ]
    },
    {
      title: "Theme",
      items: [
        { name: "Color Palette", path: "/theme/colors" },
        { name: "Typography", path: "/theme/typography" }
      ]
    }
  ];

  return (
    <div className={cn("w-64 border-r border-border/20 h-screen overflow-y-auto font-mono", className)}>
      <div className="p-4 border-b border-border/20">
        <div className="text-lg font-bold">SRCL DEFI</div>
        <div className="text-xs text-muted-foreground">Component Library</div>
      </div>
      <div className="p-4">
        {categories.map((category) => (
          <div key={category.title} className="mb-6">
            <div className="text-xs text-muted-foreground mb-2">{category.title}</div>
            {category.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "block py-1 px-2 text-sm hover:bg-hover transition-colors",
                  location === item.path && "bg-hover text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}