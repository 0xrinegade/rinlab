# DeFi Retro Components

A comprehensive React component library for Solana blockchain interfaces, combining cutting-edge financial technology with a nostalgic retro-computing aesthetic.

## Installation

```bash
npm install defi-retro-components
# or
yarn add defi-retro-components
```

## Features

- ASCII Art NFT Gallery
- Terminal-Style Portfolio Manager
- Retro Mining Visualization
- Token Swap ASCII Interface
- Vintage Error Messages
- And many more!

## Quick Start

```jsx
import { NetworkTopology, WalletConnectAnimation } from 'defi-retro-components';

function App() {
  return (
    <div>
      <NetworkTopology width={32} height={16} />
      <WalletConnectAnimation status="disconnected" onConnect={() => {}} />
    </div>
  );
}
```

## Requirements

- React 18 or higher
- TailwindCSS 3.0 or higher
- Node.js 16 or higher

## Theming

The components follow a retro-computing aesthetic by default but can be customized using TailwindCSS configuration.

## License

MIT
