export const theme = {
  colors: {
    background: '#0a0a0a',
    foreground: '#00ff00',
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    border: '#333333',
    hover: '#1a1a1a'
  },
  fonts: {
    mono: "'IBM Plex Mono', monospace",
  },
  spacing: {
    grid: '8px',
  },
  transitions: {
    default: '0.2s ease',
    slow: '0.4s ease',
  }
};

export const borderStyles = {
  default: '1px solid',
  glowing: `1px solid ${theme.colors.primary}`,
};
