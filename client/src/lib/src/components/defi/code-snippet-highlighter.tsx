import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Play, X, Info, Terminal, Eye } from 'lucide-react';

// Token type constants for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'function' | 'variable' | 'operator' | 'number' | 'punctuation' | 'type' | 'default';

// Token object for parsed code
interface Token {
  content: string;
  type: TokenType;
}

// Code line with tokens and interactive features
interface CodeLine {
  tokens: Token[];
  isHighlighted: boolean;
  isExecutable: boolean;
  lineNumber: number;
  description?: string;
}

interface CodeSnippetHighlighterProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  interactive?: boolean;
  onExecuteLine?: (lineNumber: number, code: string) => void;
}

const ASCII_BORDERS = {
  top: '┌────────────────────────────────┐',
  bottom: '└────────────────────────────────┘',
  side: '│',
};

// Simple token patterns for basic syntax highlighting
const TOKEN_PATTERNS = {
  keyword: /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|interface|type|extends|implements|new|this|super|async|await|try|catch|finally|throw|void|null|undefined|true|false)\b/g,
  string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
  comment: /\/\/.*|\/\*[\s\S]*?\*\//g,
  function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
  number: /\b\d+(\.\d+)?\b/g,
  operator: /[+\-*/%=&|^~<>!?:]+/g,
  punctuation: /[{}[\]();,.]/g,
  type: /\b(number|string|boolean|any|void|object|unknown|never|bigint|symbol)\b/g,
};

// Helper function to tokenize a line of code
function tokenizeLine(line: string): Token[] {
  // If line is empty, return a single default token
  if (!line.trim()) {
    return [{ content: line, type: 'default' }];
  }

  // Start with the whole line as a default token
  const tokens: Token[] = [{ content: line, type: 'default' }];
  
  // For each token pattern, split existing tokens if they match
  Object.entries(TOKEN_PATTERNS).forEach(([type, pattern]) => {
    const tokenType = type as TokenType;
    
    // Process each current token
    const newTokens: Token[] = [];
    tokens.forEach(token => {
      // Only process default tokens
      if (token.type !== 'default') {
        newTokens.push(token);
        return;
      }
      
      // Reset the pattern's lastIndex to ensure it starts from the beginning of the string
      pattern.lastIndex = 0;
      
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      
      // Find all matches within this token
      while ((match = pattern.exec(token.content)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;
        
        // Add the text before the match as a default token
        if (matchStart > lastIndex) {
          newTokens.push({
            content: token.content.substring(lastIndex, matchStart),
            type: 'default'
          });
        }
        
        // Add the matched text as a token of the current type
        newTokens.push({
          content: match[0],
          type: tokenType
        });
        
        lastIndex = matchEnd;
      }
      
      // Add any remaining text after the last match
      if (lastIndex < token.content.length) {
        newTokens.push({
          content: token.content.substring(lastIndex),
          type: 'default'
        });
      }
    });
    
    // Replace the current tokens with the new processed tokens
    tokens.length = 0;
    tokens.push(...newTokens);
  });
  
  return tokens;
}

// Determine if a line is executable (has actual code, not just comments or blank lines)
function isLineExecutable(tokens: Token[]): boolean {
  return tokens.some(token => 
    token.type !== 'comment' && 
    token.type !== 'default' && 
    token.content.trim() !== ''
  );
}

// Process code string into structured CodeLine objects
function processCode(code: string): CodeLine[] {
  return code.split('\n').map((line, index) => {
    const tokens = tokenizeLine(line);
    return {
      tokens,
      isHighlighted: false,
      isExecutable: isLineExecutable(tokens),
      lineNumber: index + 1,
      description: undefined
    };
  });
}

// Map token types to CSS classes
const tokenClasses: Record<TokenType, string> = {
  keyword: 'text-blue-400',
  string: 'text-green-400',
  comment: 'text-gray-500 italic',
  function: 'text-yellow-300',
  variable: 'text-primary',
  operator: 'text-pink-400',
  number: 'text-orange-400',
  punctuation: 'text-primary/70',
  type: 'text-teal-400',
  default: 'text-primary/80'
};

export function CodeSnippetHighlighter({
  code,
  language = 'typescript',
  title = 'CODE SNIPPET',
  className = '',
  interactive = true,
  onExecuteLine
}: CodeSnippetHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executeMode, setExecuteMode] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [infoTooltip, setInfoTooltip] = useState<{line: number, content: string} | null>(null);
  
  // Process the code into tokens and lines
  const [codeLines, setCodeLines] = useState<CodeLine[]>(() => processCode(code));
  
  // Reference to the pre element for getting line heights
  const preRef = useRef<HTMLPreElement>(null);

  // Update code lines when code prop changes
  useEffect(() => {
    setCodeLines(processCode(code));
  }, [code]);

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
      setError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy code');
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleDownload = () => {
    try {
      // Ensure line endings are consistent
      const processedCode = code.replace(/\r\n/g, '\n');
      const blob = new Blob([processedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snippet.${language}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error('Failed to download:', err);
      setError('Failed to download code');
      setTimeout(() => setError(null), 2000);
    }
  };

  // Handle line execution
  const handleExecuteLine = (lineNumber: number) => {
    const line = codeLines[lineNumber - 1];
    if (!line.isExecutable) {
      setError('This line cannot be executed');
      setTimeout(() => setError(null), 2000);
      return;
    }

    setActiveLine(lineNumber);
    
    // Highlight the executed line
    const updatedLines = [...codeLines];
    updatedLines[lineNumber - 1] = {
      ...updatedLines[lineNumber - 1],
      isHighlighted: true
    };
    setCodeLines(updatedLines);
    
    // Trigger the execution callback if provided
    if (onExecuteLine) {
      const lineCode = code.split('\n')[lineNumber - 1];
      onExecuteLine(lineNumber, lineCode);
    }
    
    // Reset highlighting after a delay
    setTimeout(() => {
      setActiveLine(null);
      const resetLines = [...codeLines];
      resetLines[lineNumber - 1] = {
        ...resetLines[lineNumber - 1],
        isHighlighted: false
      };
      setCodeLines(resetLines);
    }, 2000);
  };

  // Toggle execute mode
  const toggleExecuteMode = () => {
    setExecuteMode(prev => !prev);
    if (executeMode) {
      setHoveredLine(null);
      setActiveLine(null);
      
      // Reset all highlighted lines
      const resetLines = codeLines.map(line => ({
        ...line,
        isHighlighted: false
      }));
      setCodeLines(resetLines);
    }
  };
  
  // Add code explanations for selected lines
  const lineDescriptions: Record<number, string> = {
    // Example of line-specific descriptions - would be populated based on actual code
    1: 'Import statements bring in required modules',
    3: 'Define the component props interface',
    17: 'Main component definition with default props',
    23: 'State management for the component'
  };
  
  // Show info tooltip for a specific line
  const showLineInfo = (lineNumber: number) => {
    const description = lineDescriptions[lineNumber];
    if (description) {
      setInfoTooltip({
        line: lineNumber,
        content: description
      });
    }
  };
  
  // Hide the info tooltip
  const hideLineInfo = () => {
    setInfoTooltip(null);
  };

  return (
    <motion.div 
      className={`relative font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setHoveredLine(null);
        hideLineInfo();
      }}
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
          {interactive && (
            <button
              onClick={toggleExecuteMode}
              className={`px-2 py-1 border ${executeMode ? 'border-primary bg-primary/20' : 'border-primary/20'} hover:bg-primary/10 text-primary text-xs flex items-center gap-2 transition-colors`}
            >
              {executeMode ? (
                <>
                  <X className="w-3 h-3" />
                  <pre className="font-mono">
                    ┌───────┐
                    │ CLOSE │
                    └───────┘
                  </pre>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <pre className="font-mono">
                    ┌───────┐
                    │  RUN  │
                    └───────┘
                  </pre>
                </>
              )}
            </button>
          )}
          
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
              │ SAVE │
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

        {/* Execute mode indicator */}
        {executeMode && (
          <div className="absolute right-0 top-0 bg-primary/20 border-l border-b border-primary/30 px-2 py-1 text-xs text-primary flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            EXECUTION MODE
          </div>
        )}

        {/* Line numbers with interaction capability */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-primary/20 bg-primary/5 flex flex-col items-center py-2">
          {codeLines.map((line, i) => (
            <div 
              key={i} 
              className={`
                text-xs leading-6 w-full text-center cursor-pointer group
                ${executeMode && line.isExecutable ? 'hover:bg-primary/10' : ''}
                ${line.isHighlighted ? 'bg-primary/20' : ''}
                ${i === Math.floor((scanLine / 100) * codeLines.length) 
                  ? 'text-primary' 
                  : 'text-primary/50'}
              `}
              onClick={() => executeMode && handleExecuteLine(i + 1)}
              onMouseEnter={() => {
                setHoveredLine(i + 1);
                if (lineDescriptions[i + 1]) {
                  showLineInfo(i + 1);
                }
              }}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <div className="flex items-center justify-center relative">
                {String(i + 1).padStart(3, '0')}
                
                {executeMode && line.isExecutable && (
                  <span className="opacity-0 group-hover:opacity-100 absolute -right-1 text-primary">
                    ▶
                  </span>
                )}
                
                {lineDescriptions[i + 1] && (
                  <span className="opacity-0 group-hover:opacity-100 absolute -left-1 text-primary">
                    ℹ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Code content with token-based syntax highlighting */}
        <pre 
          ref={preRef}
          className="p-2 pl-16 overflow-x-auto text-xs leading-6 relative"
        >
          <AnimatePresence>
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={hovered ? { x: -20, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`
                  relative
                  ${hoveredLine === i + 1 ? 'bg-primary/5' : ''}
                  ${line.isHighlighted ? 'bg-primary/10' : ''}
                  ${activeLine === i + 1 ? 'bg-primary/20' : ''}
                  ${i === Math.floor((scanLine / 100) * codeLines.length) 
                    ? 'text-primary-highlighted' 
                    : ''}
                `}
              >
                {/* Token-based syntax highlighting */}
                <span className="whitespace-pre">
                  {line.tokens.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      className={tokenClasses[token.type] || tokenClasses.default}
                    >
                      {token.content}
                    </span>
                  ))}
                </span>
                
                {/* Execution indicator */}
                {executeMode && line.isExecutable && hoveredLine === i + 1 && (
                  <button
                    onClick={() => handleExecuteLine(i + 1)}
                    className="absolute right-0 top-0 bottom-0 bg-primary/10 hover:bg-primary/20 px-2 flex items-center"
                  >
                    <Play className="w-3 h-3 text-primary" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </pre>
      </div>

      {/* Footer */}
      <pre className="text-primary text-xs mt-2">
        {ASCII_BORDERS.bottom}
      </pre>

      {/* Line info tooltip */}
      <AnimatePresence>
        {infoTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-14 ml-2 px-3 py-2 bg-background/90 backdrop-blur-sm border border-primary/30 text-xs rounded-md text-primary max-w-xs z-10"
            style={{ 
              top: `${(infoTooltip.line - 1) * 24 + 40}px` 
            }}
          >
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 text-primary" />
              <span>{infoTooltip.content}</span>
            </div>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-primary/30 border-b-[6px] border-b-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-destructive/90 text-destructive-foreground text-xs rounded"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}