// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: false,
  external: [
    'react',
    'react-dom',
    'react-bootstrap',
    'bootstrap'
  ],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      // '.css': 'text' // <<-- import css as string
    };
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    };
  },
});