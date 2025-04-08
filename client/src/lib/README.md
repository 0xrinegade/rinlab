# Rinlab Component Library

A cutting-edge React component library that reimagines Solana blockchain interfaces through a unique pixel-art design system, transforming complex blockchain interactions into engaging, nostalgic computing experiences.

## Installation

```bash
# Using npm
npm install rinlab

# Using yarn
yarn add rinlab

# Using pnpm
pnpm add rinlab
```

## Core Components

### Text Component

The Text component provides retro-computing styled text with a variety of effects and animations:

```jsx
import { Text } from 'rinlab';

// Basic usage
<Text>Regular text</Text>

// Terminal-style text with typing animation
<Text variant="terminal" animation="typing">Terminal output...</Text>

// Glitch effect
<Text variant="glitch" dataText="Glitch Effect">Glitch Effect</Text>

// Pixel art styled text
<Text variant="pixelated">Pixelated style</Text>

// CRT-style text
<Text variant="crt">Old monitor effect</Text>

// Code display
<Text variant="code">const code = "styled code block";</Text>

// DeFi specific variants
<Text variant="token">SOL</Text>
<Text variant="value">10.5</Text>
<Text variant="percent">23.4</Text>
<Text variant="address">0x1234...5678</Text>
```

### Terminal Component

Interactive terminal with command support and retro aesthetics:

```jsx
import { Terminal } from 'rinlab';

<Terminal 
  height="400px"
  welcomeMessage="Welcome to Rinlab Terminal v1.0"
  initialCommands={["help"]}
/>
```

## Features

- 🎮 **Retro Computing Aesthetic**: Nostalgic pixel art and terminal interfaces
- 🔧 **DeFi-focused Components**: Specialized UI for blockchain applications 
- 📊 **Data Visualization**: Charts and displays styled with retro aesthetics
- 🎨 **Animations**: Text typing, glitch effects, CRT scanlines, and more
- 🧩 **Modular Design**: Extensible components with consistent styling
- 🌙 **Theming**: Flexible color schemes inspired by retro computing eras

## Requirements

- React 18.0.0+ or React 19.0.0+
- Tailwind CSS 3.0.0+
- PostCSS with nesting plugin

## CSS Setup

Add the following to your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
```

Configure PostCSS to support nesting:

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

## License

MIT © Aldrin Labs