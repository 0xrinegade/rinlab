import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Activity, Server, Globe } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  region: string;
  latency: number;
  connections: number;
  lastSeen: number;
  load: number;
}

interface NetworkStatusDashboardProps {
  className?: string;
}

export function NetworkStatusDashboard({ className = '' }: NetworkStatusDashboardProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [scanLine, setScanLine] = useState(0);
  const pixelSize = 2; // Size of each "pixel" in the retro display

  // Generate sample nodes
  useEffect(() => {
    const regions = ['US-WEST', 'US-EAST', 'EU-WEST', 'ASIA-EAST'];
    const generateNode = (index: number): Node => ({
      id: `node-${index}`,
      name: `NODE-${index.toString().padStart(3, '0')}`,
      status: Math.random() > 0.8 ? 'offline' : 
              Math.random() > 0.7 ? 'degraded' : 'online',
      region: regions[index % regions.length],
      latency: Math.floor(Math.random() * 200),
      connections: Math.floor(Math.random() * 100),
      lastSeen: Date.now() - Math.floor(Math.random() * 1000 * 60),
      load: Math.floor(Math.random() * 100)
    });

    setNodes(Array.from({ length: 16 }, (_, i) => generateNode(i)));

    // Update node statuses periodically
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        status: Math.random() > 0.95 ? 'offline' :
                Math.random() > 0.85 ? 'degraded' : 'online',
        latency: Math.floor(Math.random() * 200),
        connections: Math.floor(Math.random() * 100),
        lastSeen: Date.now(),
        load: Math.floor(Math.random() * 100)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Node['status']) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'degraded':
        return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getNodeColor = (status: Node['status'], load: number) => {
    const baseColor = status === 'online' ? 'green' :
                     status === 'offline' ? 'red' : 'yellow';
    const intensity = Math.floor((100 - load) / 20);
    return `bg-${baseColor}-500/[.${intensity.toString(16)}]`;
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── NETWORK STATUS DASHBOARD ──┐
      </div>

      <div className="relative min-h-[600px] overflow-hidden">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Grid of nodes */}
        <div className="grid grid-cols-4 gap-4 p-4">
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="border border-border/20 p-4 relative"
              >
                {/* Pixel art node representation */}
                <div className="pixel-art-node mb-2">
                  <div 
                    className={`
                      w-8 h-8 relative
                      ${getNodeColor(node.status, node.load)}
                    `}
                    style={{
                      boxShadow: `0 0 ${node.status === 'online' ? '10px' : '5px'} ${
                        node.status === 'online' ? '#22c55e' :
                        node.status === 'offline' ? '#ef4444' : '#eab308'
                      }`
                    }}
                  >
                    <Server className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Node info */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{node.name}</span>
                    {getStatusIcon(node.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                    <div>Region:</div>
                    <div className="text-right">{node.region}</div>
                    <div>Latency:</div>
                    <div className="text-right">{node.latency}ms</div>
                    <div>Connections:</div>
                    <div className="text-right">{node.connections}</div>
                  </div>

                  {/* Load bar */}
                  <div className="h-1 bg-border/20 mt-2">
                    <motion.div
                      className={`h-full ${
                        node.load > 80 ? 'bg-red-500' :
                        node.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${node.load}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Pixel grid overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundSize: `${pixelSize}px ${pixelSize}px`,
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Network stats */}
        <div className="border-t border-border/20 mt-4 p-4">
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground mb-1">Total Nodes</div>
              <div className="font-mono">{nodes.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Online</div>
              <div className="font-mono text-green-500">
                {nodes.filter(n => n.status === 'online').length}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Degraded</div>
              <div className="font-mono text-yellow-500">
                {nodes.filter(n => n.status === 'degraded').length}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Offline</div>
              <div className="font-mono text-red-500">
                {nodes.filter(n => n.status === 'offline').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
