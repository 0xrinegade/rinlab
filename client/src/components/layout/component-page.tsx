import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';
import { CodeSnippetHighlighter } from '@/components/defi/code-snippet-highlighter';

interface ComponentPageProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

export function ComponentPage({ title, description, code, children }: ComponentPageProps) {
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleCode = () => {
    try {
      setShowCode(prev => !prev);
      setError(null);
    } catch (err) {
      console.error('Failed to toggle code view:', err);
      setError('Failed to display code');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="prose prose-invert">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {code && (
            <button
              onClick={handleToggleCode}
              className="px-3 py-2 border border-primary/20 hover:bg-primary/10 text-primary text-sm flex items-center gap-2 transition-colors rounded-sm"
              aria-label={showCode ? 'Hide component code' : 'View component code'}
            >
              <Code className="w-4 h-4" />
              <span className="font-mono">{showCode ? 'Hide Code' : 'View Code'}</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {showCode && code && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <CodeSnippetHighlighter
                code={code}
                language="typescript"
                title={title.toUpperCase()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}