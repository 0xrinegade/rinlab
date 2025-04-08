import React, { Suspense } from 'react';
import { Terminal } from '../client/src/components/defi/terminal';
import { Text } from '../client/src/lib/src/components/ui/text';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-background">
      <div className="w-full max-w-5xl">
        <Text variant="heading" size="3xl" className="mb-2">Rinlab Component Library</Text>
        <Text variant="retro" className="mb-8">
          A cutting-edge React component library that reimagines Solana blockchain interfaces 
          through a unique pixel-art design system.
        </Text>
        
        <div className="grid grid-cols-1 gap-8">
          <section className="mb-8">
            <Text variant="subheading" className="mb-4">Text Component Variants</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-background/50">
              <div className="space-y-4">
                <Text variant="terminal" animation="typing">Terminal with typing animation</Text>
                <Text variant="glitch" dataText="Glitch Effect">Glitch Effect</Text>
                <Text variant="pixelated">Pixelated Text Style</Text>
                <Text variant="retro">Retro Underlined Style</Text>
                <Text variant="code">const code = "styled code block";</Text>
              </div>
              <div className="space-y-4">
                <Text variant="heading">Heading Text</Text>
                <Text variant="subheading">Subheading Text</Text>
                <Text variant="label">Label Text Style</Text>
                <Text variant="success">Success Message</Text>
                <Text variant="error">Error Message</Text>
                <Text variant="warning">Warning Message</Text>
              </div>
            </div>
          </section>
          
          <section>
            <Text variant="subheading" className="mb-4">Terminal Component</Text>
            <Suspense fallback={<div>Loading terminal...</div>}>
              <Terminal 
                height="400px"
                welcomeMessage="Welcome to Rinlab Terminal v1.0.1"
                initialCommands={["help"]}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}