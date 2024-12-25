import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Token {
  name: string;
  symbol: string;
  price: number;
  holdings: number;
}

type SortField = 'name' | 'symbol' | 'price' | 'holdings';
type SortDirection = 'asc' | 'desc';

interface TokenScreenerProps {
  className?: string;
}

export function TokenScreener({ className = '' }: TokenScreenerProps) {
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filter, setFilter] = useState('');

  // Sample data - this would be replaced with real-time data
  const tokens: Token[] = [
    { name: 'Zebra', symbol: 'ZBR', price: 202.36, holdings: 36 },
    { name: 'Tiger', symbol: 'TGR', price: 182.20, holdings: 12 },
    { name: 'Eagle', symbol: 'EGL', price: 106.64, holdings: 13 },
    { name: 'Bear', symbol: 'BR', price: 77.45, holdings: 46 },
    { name: 'Shark', symbol: 'SHK', price: 72.62, holdings: 49 },
    { name: 'Turtle', symbol: 'TRL', price: 58.02, holdings: 52 },
    { name: 'Whale', symbol: 'WHL', price: 44.80, holdings: 33 },
    { name: 'Dolphin', symbol: 'DLP', price: 43.16, holdings: 14 },
  ];

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredTokens = useMemo(() => {
    return tokens
      .filter(token => 
        token.name.toLowerCase().includes(filter.toLowerCase()) ||
        token.symbol.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        if (typeof a[sortField] === 'string') {
          return (a[sortField] as string).localeCompare(b[sortField] as string) * modifier;
        }
        return ((a[sortField] as number) - (b[sortField] as number)) * modifier;
      });
  }, [tokens, sortField, sortDirection, filter]);

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  return (
    <motion.div 
      className={`font-mono space-y-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 p-2 border border-border/20">
        <Input
          type="text"
          placeholder="Filter tokens..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs bg-background"
        />
      </div>

      <div className="border border-border/20 terminal-container">
        <div className="terminal-header">
          ┌── TOKEN SCREENER ──┐
        </div>
        <table className="w-full data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  NAME {getSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('symbol')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  SYMBOL {getSortIcon('symbol')}
                </div>
              </th>
              <th onClick={() => handleSort('price')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  PRICE {getSortIcon('price')}
                </div>
              </th>
              <th onClick={() => handleSort('holdings')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  HOLDINGS {getSortIcon('holdings')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTokens.map((token) => (
              <tr key={token.symbol}>
                <td>{token.name}</td>
                <td>{token.symbol}</td>
                <td>${token.price.toFixed(2)}</td>
                <td>{token.holdings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
