import { ComponentPage } from '@/components/layout/component-page';
import { DocsSidebar } from '@/components/layout/docs-sidebar';

export function DocsPage() {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <div className="flex-1 p-8">
        <ComponentPage
          title="rinlab Documentation"
          description="A comprehensive React component library for Solana blockchain interfaces with retro-computing aesthetics"
          code=""
        >
          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2>Introduction</h2>
              <p>
                rinlab is a specialized React component library that brings retro-computing aesthetics 
                to modern Solana blockchain interfaces. Designed with both nostalgia and functionality 
                in mind, it provides a unique set of components that make blockchain interactions more 
                engaging and visually distinctive.
              </p>
            </section>

            <section className="mb-12">
              <h2>Key Features</h2>
              <ul>
                <li>ASCII art-based NFT gallery displays</li>
                <li>Terminal-style portfolio management interfaces</li>
                <li>Retro-themed blockchain visualizations</li>
                <li>Text-based UI for token swaps</li>
                <li>Period-appropriate error messages and notifications</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>Getting Started</h2>
              <div className="bg-muted/50 p-4 rounded-md">
                <pre><code>{`# Using npm
npm install rinlab

# Using yarn
yarn add rinlab

# Using pnpm
pnpm add rinlab`}</code></pre>
              </div>
            </section>
          </div>
        </ComponentPage>
      </div>
    </div>
  );
}

export default DocsPage;
