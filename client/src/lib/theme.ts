export const theme = {
  colors: {
    background: '#000000',
    foreground: '#00ff00',
    primary: '#00ff00',
    secondary: '#ff00ff',
    accent: '#ffff00',
    border: '#333333',
    hover: '#1a1a1a',
    glow: 'rgba(0, 255, 0, 0.2)'
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