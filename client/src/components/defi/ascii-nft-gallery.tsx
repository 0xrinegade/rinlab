import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Star, Tag } from 'lucide-react';

interface NFT {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary';
  asciiArt: string;
  traits: string[];
}

interface ASCIINFTGalleryProps {
  className?: string;
}

export function ASCIINFTGallery({ className = '' }: ASCIINFTGalleryProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [scanLine, setScanLine] = useState(0);

  // Sample NFT data with ASCII art
  useEffect(() => {
    const sampleNFTs: NFT[] = [
      {
        id: '1',
        name: 'Pixel Punk #1',
        rarity: 'legendary',
        asciiArt: `
   /-\\
  |o o|
   \\_/
  /___\\
        `,
        traits: ['Cyberpunk', 'Rare Background', 'Golden Frame']
      },
      {
        id: '2',
        name: 'ASCII Cat',
        rarity: 'rare',
        asciiArt: `
  /\\___/\\
 (  o o  )
 (  =^=  )
  (______)
        `,
        traits: ['Feline', 'Mystic Aura', 'Diamond Collar']
      },
      {
        id: '3',
        name: 'Doge Lite',
        rarity: 'common',
        asciiArt: `
    ____
   /    \\
  |  ^^  |
   \\____/
        `,
        traits: ['Much Wow', 'Basic Colors', 'Simple Design']
      }
    ];

    setNfts(sampleNFTs);
  }, []);

  // Animate scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: NFT['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-500';
      case 'rare':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`terminal-container p-4 ${className}`}>
      <div className="terminal-header">
        ┌── NFT GALLERY ──┐
      </div>

      <div className="relative">
        {/* Scan line effect */}
        <div 
          className="absolute w-full h-[2px] bg-foreground/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <AnimatePresence>
            {nfts.map((nft) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="border border-border/20 p-4 cursor-pointer hover:border-primary/50"
                onClick={() => setSelectedNFT(nft)}
              >
                {/* ASCII Art Display */}
                <pre className="font-mono text-xs whitespace-pre">
                  {nft.asciiArt}
                </pre>

                {/* NFT Info */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">{nft.name}</h3>
                    <Star className={`w-4 h-4 ${getRarityColor(nft.rarity)}`} />
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {nft.traits.map((trait, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs bg-muted px-2 py-1 rounded"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected NFT Modal */}
        <AnimatePresence>
          {selectedNFT && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedNFT(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                         border border-border/20 bg-background p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <pre className="font-mono text-lg whitespace-pre text-center">
                  {selectedNFT.asciiArt}
                </pre>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{selectedNFT.name}</h2>
                    <div className={`flex items-center gap-2 ${getRarityColor(selectedNFT.rarity)}`}>
                      <Star className="w-5 h-5" />
                      <span className="capitalize">{selectedNFT.rarity}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-2">Traits</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedNFT.traits.map((trait, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm bg-muted px-3 py-1 rounded"
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            {trait}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
