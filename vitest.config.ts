// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // run tests in parallel workers by default; if you need serial set `sequence` options
    // setupFiles: './tests/setup.ts' // uncomment if you need global setup
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Keep default vite behavior otherwise
});

