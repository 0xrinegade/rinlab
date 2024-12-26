import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Medal, Crown } from 'lucide-react';
import { TerminalContainer } from '../layout/terminal-container';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

interface Contributor {
  id: string;
  username: string;
  avatarAscii: string;
  contributions: number;
  rewards: Array<{
    id: string;
    type: 'badge' | 'trophy' | 'medal';
    title: string;
    description: string;
  }>;
  rank: number;
  recentActivity: Array<{
    type: 'commit' | 'issue' | 'pr';
    description: string;
    timestamp: number;
  }>;
}

interface ContributionLeaderboardProps {
  className?: string;
}

const PIXEL_ART_AVATARS = {
  default: `
   /\\___/\\
  (  o o  )
  (  =^=  ) 
   (_____)`,
  gold: `
   /\\___/\\
  (* o o *)
  (  =^=  )
   [GOLD]`,
  silver: `
   /\\___/\\
  (@ o o @)
  (  =^=  )
   [SILV]`,
  bronze: `
   /\\___/\\
  (# o o #)
  (  =^=  )
   [BRNZ]`
};

const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: '1',
    username: 'CryptoNinja',
    avatarAscii: PIXEL_ART_AVATARS.gold,
    contributions: 156,
    rewards: [
      { id: '1', type: 'trophy', title: 'Top Contributor', description: 'Most contributions this month' },
      { id: '2', type: 'badge', title: 'Bug Hunter', description: 'Fixed 10+ critical bugs' }
    ],
    rank: 1,
    recentActivity: [
      { type: 'commit', description: 'Optimized token swap interface', timestamp: Date.now() - 3600000 }
    ]
  },
  {
    id: '2',
    username: 'PixelPioneer',
    avatarAscii: PIXEL_ART_AVATARS.silver,
    contributions: 123,
    rewards: [
      { id: '3', type: 'medal', title: 'UI Master', description: 'Created 5+ popular components' }
    ],
    rank: 2,
    recentActivity: [
      { type: 'pr', description: 'Added new ASCII art animations', timestamp: Date.now() - 7200000 }
    ]
  },
  {
    id: '3',
    username: 'RetroHacker',
    avatarAscii: PIXEL_ART_AVATARS.bronze,
    contributions: 98,
    rewards: [
      { id: '4', type: 'badge', title: 'First PR', description: 'First contribution merged' }
    ],
    rank: 3,
    recentActivity: [
      { type: 'issue', description: 'Reported critical security issue', timestamp: Date.now() - 14400000 }
    ]
  }
];

export function ContributionLeaderboard({ className = '' }: ContributionLeaderboardProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContributors = async () => {
      try {
        // In production, this would fetch from an API
        setContributors(MOCK_CONTRIBUTORS);
        setLoading(false);
      } catch (err) {
        console.error('Error loading contributors:', err);
        setError('Failed to load contributors');
        setLoading(false);
      }
    };

    loadContributors();
  }, []);

  const getRewardIcon = (type: 'badge' | 'trophy' | 'medal') => {
    switch (type) {
      case 'trophy':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'medal':
        return <Medal className="w-4 h-4 text-blue-500" />;
      default:
        return <Star className="w-4 h-4 text-purple-500" />;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Crown className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Crown className="w-4 h-4 text-orange-600" />;
    return <span className="text-xs font-mono">{rank}</span>;
  };

  if (error) {
    return (
      <TerminalContainer title="CONTRIBUTION LEADERBOARD" className={className}>
        <div className="text-destructive text-center py-4">
          {error}
        </div>
      </TerminalContainer>
    );
  }

  if (loading) {
    return (
      <TerminalContainer title="CONTRIBUTION LEADERBOARD" className={className}>
        <div className="text-muted-foreground text-center py-4">
          Loading contributors...
        </div>
      </TerminalContainer>
    );
  }

  return (
    <TerminalContainer title="CONTRIBUTION LEADERBOARD" className={className}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {contributors.map((contributor) => (
            <motion.button
              key={contributor.id}
              onClick={() => setSelectedContributor(contributor)}
              className={`p-4 border border-primary/20 rounded-sm hover:bg-primary/5 transition-colors text-left ${
                selectedContributor?.id === contributor.id ? 'bg-primary/10' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getRankIcon(contributor.rank)}
                    <Text variant="terminal" className="font-bold">
                      {contributor.username}
                    </Text>
                  </div>
                  <pre className="font-mono text-xs whitespace-pre text-primary/80">
                    {contributor.avatarAscii}
                  </pre>
                </div>
                <div className="text-right">
                  <Text variant="terminal" className="font-bold">
                    {contributor.contributions}
                  </Text>
                  <Text variant="terminal" className="text-muted-foreground">
                    contributions
                  </Text>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedContributor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t border-primary/20 pt-4 mt-4"
            >
              <Text variant="terminal" className="font-bold mb-2">
                Rewards & Achievements
              </Text>
              <div className="grid grid-cols-1 gap-2">
                {selectedContributor.rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="text-xs p-2 border border-primary/20 rounded-sm flex items-center gap-2"
                  >
                    {getRewardIcon(reward.type)}
                    <div>
                      <div className="font-bold">{reward.title}</div>
                      <div className="text-muted-foreground">
                        {reward.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Text variant="terminal" className="font-bold mt-4 mb-2">
                Recent Activity
              </Text>
              <div className="space-y-2">
                {selectedContributor.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground"
                  >
                    [{new Date(activity.timestamp).toLocaleString()}] {activity.description}
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
