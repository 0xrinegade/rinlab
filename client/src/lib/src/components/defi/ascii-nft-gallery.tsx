import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { TerminalContainer } from '../layout/terminal-container';

interface NFT {
  id: string;
  name: string;
  ascii: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: { trait_type: string; value: string }[];
}

interface ASCIINFTGalleryProps {
  className?: string;
}

export function ASCIINFTGallery({ className = '' }: ASCIINFTGalleryProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        // Simulated NFT data - in production, this would fetch from an API
        const mockNFTs: NFT[] = [
          {
            id: '1',
            name: 'Pixel Punk #1',
            ascii: `
   /\\___/\\
  (  o o  )
  (  =^=  )
   (______)
            `,
            rarity: 'legendary',
            attributes: [
              { trait_type: 'Background', value: 'Terminal Green' },
              { trait_type: 'Species', value: 'Cyber Cat' }
            ]
          },
          {
            id: '2',
            name: 'ASCII Ape #42',
            ascii: `
    .--.
   /    \\
  | o  o |
   \\  ~ /
    \\__/
            `,
            rarity: 'epic',
            attributes: [
              { trait_type: 'Background', value: 'Vintage DOS' },
              { trait_type: 'Species', value: 'Retro Ape' }
            ]
          }
        ];

        setNfts(mockNFTs);
        setLoading(false);
      } catch (err) {
        console.error('Error loading NFTs:', err);
        setError('Failed to load NFTs');
        setLoading(false);
      }
    };

    loadNFTs();
  }, []);

  const renderRarityBadge = (rarity: NFT['rarity']) => {
    const colors = {
      common: 'text-gray-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400'
    };

    return (
      <span className={`px-2 py-0.5 text-xs ${colors[rarity]} border border-current rounded-sm`}>
        {rarity.toUpperCase()}
      </span>
    );
  };

  if (error) {
    return (
      <TerminalContainer title="NFT GALLERY" className={className}>
        <div className="text-destructive text-center py-4">
          {error}
        </div>
      </TerminalContainer>
    );
  }

  if (loading) {
    return (
      <TerminalContainer title="NFT GALLERY" className={className}>
        <div className="text-muted-foreground text-center py-4">
          Loading NFTs...
        </div>
      </TerminalContainer>
    );
  }

  return (
    <TerminalContainer title="NFT GALLERY" className={className}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfts.map((nft) => (
            <motion.button
              key={nft.id}
              onClick={() => setSelectedNFT(nft)}
              className={`p-4 border border-primary/20 rounded-sm hover:bg-primary/5 transition-colors text-left ${
                selectedNFT?.id === nft.id ? 'bg-primary/10' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <pre className="font-mono text-xs whitespace-pre">
                {nft.ascii}
              </pre>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold">{nft.name}</span>
                {renderRarityBadge(nft.rarity)}
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedNFT && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t border-primary/20 pt-4 mt-4"
            >
              <h3 className="text-sm font-bold mb-2">Attributes</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedNFT.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="text-xs p-2 border border-primary/20 rounded-sm"
                  >
                    <span className="text-muted-foreground">
                      {attr.trait_type}:
                    </span>{' '}
                    {attr.value}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TerminalContainer>
  );
}
