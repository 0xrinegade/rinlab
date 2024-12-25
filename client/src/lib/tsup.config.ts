import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'framer-motion', '@radix-ui/react-toast', 'tailwindcss'],
  treeshake: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  outDir: 'dist',
});
