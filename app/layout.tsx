import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../client/src/index.css';
import { ThemeProvider } from './components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rinlab - DeFi UI Component Library',
  description: 'A cutting-edge React component library that reimagines Solana blockchain interfaces through a unique pixel-art design system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}