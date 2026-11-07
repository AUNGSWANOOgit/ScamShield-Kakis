import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/.
// A relative base ('./') makes every asset path relative to index.html, so the
// build works under ANY repository name (and locally) without configuration.
// Combined with HashRouter, page refreshes never hit a 404.
// You can still force an absolute base with: VITE_BASE=/my-repo/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Support older phones still common among seniors (e.g. iOS 14 Safari).
    target: ['es2020', 'safari14', 'chrome87', 'firefox78', 'edge88'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as Parameters<typeof defineConfig>[0]);
