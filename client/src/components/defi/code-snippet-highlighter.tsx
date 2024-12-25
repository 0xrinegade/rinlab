import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code, Download } from 'lucide-react';

interface CodeSnippetHighlighterProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const ASCII_BORDERS = {
  top: '┌────────────────────────────────┐',
  bottom: '└────────────────────────────────┘',
  side: '│',
};

export function CodeSnippetHighlighter({
  code,
  language = 'typescript',
  title = 'CODE SNIPPET',
  className = ''
}: CodeSnippetHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      className={`relative font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <pre className="text-primary text-xs">
          {ASCII_BORDERS.top}
          {'\n'}
          {ASCII_BORDERS.side} {title.padEnd(26)} {ASCII_BORDERS.side}
          {'\n'}
          {ASCII_BORDERS.side} {`[${language.toUpperCase()}]`.padEnd(26)} {ASCII_BORDERS.side}
        </pre>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 border border-primary/20 hover:bg-primary/10 text-primary text-xs flex items-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <pre className="font-mono">
                  ┌──────┐
                  │COPIED│
                  └──────┘
                </pre>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <pre className="font-mono">
                  ┌──────┐
                  │ COPY │
                  └──────┘
                </pre>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-2 py-1 border border-primary/20 hover:bg-primary/10 text-primary text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-3 h-3" />
            <pre className="font-mono">
              ┌──────┐
              │SAVE │
              └──────┘
            </pre>
          </button>
        </div>
      </div>

      {/* Code container */}
      <div className="relative border border-primary/20 bg-background/50 backdrop-blur-sm overflow-hidden">
        {/* Scanline effect */}
        <motion.div
          className="absolute w-full h-[2px] bg-primary/10 pointer-events-none"
          style={{ top: `${scanLine}%` }}
        />

        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-primary/20 bg-primary/5 flex flex-col items-center py-2">
          {code.split('\n').map((_, i) => (
            <div 
              key={i} 
              className={`
                text-xs leading-6 w-full text-center
                ${i === Math.floor((scanLine / 100) * code.split('\n').length) 
                  ? 'text-primary' 
                  : 'text-primary/50'}
              `}
            >
              {String(i + 1).padStart(3, '0')}
            </div>
          ))}
        </div>

        {/* Code content */}
        <pre className="p-2 pl-16 overflow-x-auto text-xs leading-6">
          <AnimatePresence>
            {code.split('\n').map((line, i) => (
              <motion.div
                key={i}
                initial={hovered ? { x: -20, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`
                  ${i === Math.floor((scanLine / 100) * code.split('\n').length) 
                    ? 'text-primary' 
                    : 'text-primary/80'}
                `}
              >
                {line || '\n'}
              </motion.div>
            ))}
          </AnimatePresence>
        </pre>
      </div>

      {/* Footer */}
      <pre className="text-primary text-xs mt-2">
        {ASCII_BORDERS.bottom}
      </pre>
    </motion.div>
  );
}
