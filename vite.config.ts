/* eslint-disable import/no-named-as-default */
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-unresolved
import react from '@vitejs/plugin-react';
import terser from '@rollup/plugin-terser';
import dts from 'vite-plugin-dts';
import path from 'path';
import detect from 'detect-port';
import Package from './package.json';

export default async ({ command } = { command: undefined }) => {
  const isBuild = command === 'build';

  // prefer PORT env if present, otherwise start looking at 4000
  const preferredPort = process.env.PORT ? Number(process.env.PORT) : 4000;
  // detect a free port (returns the preferred port if it's free)
  const port = await detect(preferredPort);

  return defineConfig({
    // Serve the example folder as the Vite root in dev.
    root: path.resolve(__dirname, 'example'),

    define: {
      __DEV__: !isBuild,
    },

    plugins: [
      react(),
      // generate types only in build mode
      ...(isBuild
        ? [
            dts({
              insertTypesEntry: true,
              rollupTypes: true,
            }),
          ]
        : []),
    ],

    server: {
      // Make the dev server accessible from the host and other devices on the LAN.
      // This avoids "not accessible" issues on WSL, Docker, or certain Windows setups.
      host: '0.0.0.0',
      port,
      strictPort: false,
      open: true,
    },

    // Build the library when running `vite build` from project root (not the example).
    build: {
      minify: 'terser',
      outDir: path.resolve(__dirname, 'dist'),
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'), // adjust to src/index.tsx if needed
        name: Package.name,
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        // don't bundle these peers
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react-bootstrap', 'bootstrap'],
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'React',
            'react-dom': 'ReactDOM',
          },
        },
        plugins: [
          terser({
            compress: {
              defaults: true,
              drop_console: false,
            },
          }),
        ],
      },
    },

    // Resolve alias so example can import library source via '@/...'
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // Vitest options (if you run tests via `vite` too)
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
  });
};
